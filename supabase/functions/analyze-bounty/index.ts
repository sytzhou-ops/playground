import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response(null, { headers: corsHeaders });

  try {
    const { bountyData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are a senior automation engineering consultant reviewing bounty submissions on a platform where businesses post automation challenges. Your job is to assess whether a bounty submission contains enough detail for an automation engineer to scope, estimate, and build the solution.

Analyze the submission and return a JSON object using the tool provided. Evaluate these dimensions:

1. **Completeness Score** (0-100): Overall how complete the submission is.
2. **Clarity Score** (0-100): How clearly the problem and desired outcome are articulated.
3. **Scopability Score** (0-100): Whether an engineer could write a statement of work from this.
4. **Overall Verdict**: "ready" | "needs_work" | "insufficient"
   - ready: Engineer can scope this now (all scores > 60)
   - needs_work: Has the core idea but missing a couple key details
   - insufficient: Too vague to even understand the problem
   Keep the bar LOW. A clear title + problem description + rough budget = "needs_work" at minimum.

5. **Strengths**: 1-2 things the submitter did well (be specific, reference their actual inputs).
6. **Missing Info**: Only the TOP 2-3 most critical gaps a builder absolutely needs to start scoping. Skip nice-to-haves. Keep questions short and easy to answer. For each:
   - field: which area it relates to
   - question: a specific, non-intimidating clarifying question
   - priority: "critical" | "important"
7. **Summary**: A 2-3 sentence executive summary of the bounty as you understand it.
8. **Suggestions**: 1-2 concrete suggestions to strengthen the bounty.

The goal is to get the builder ~60% of what they need to scope — not 100%. Builders figure out details during engagement.`;

    const userPrompt = `Here is the bounty submission to analyze:

**Title:** ${bountyData.title || "(not provided)"}
**Industry:** ${bountyData.industry || "(not provided)"}
**Problem Description:** ${bountyData.problemDescription || "(not provided)"}
**Current Process:** ${bountyData.currentProcess || "(not provided)"}
**Pain Frequency:** ${bountyData.painFrequency || "(not provided)"}
**Hours Wasted/Week:** ${bountyData.hoursWasted ?? "(not provided)"}
**Estimated Annual Cost:** $${bountyData.annualCost ?? "(not provided)"}
**Pain Impact:** ${bountyData.painDescription || "(not provided)"}
**Desired Outcome:** ${bountyData.desiredOutcome || "(not provided)"}
**Acceptance Criteria:** ${bountyData.acceptanceCriteria || "(not provided)"}
**Tool Preferences:** ${bountyData.toolPreferences || "(not provided)"}
**Bounty Amount:** $${bountyData.bountyAmount ?? "(not provided)"}
**Payment Structure:** ${bountyData.paymentStructure || "(not provided)"}
**Urgency:** ${bountyData.urgency || "(not provided)"}
**Deadline:** ${bountyData.deadline || "(not provided)"}
**Additional Notes:** ${bountyData.additionalNotes || "(not provided)"}

Analyze this submission thoroughly.`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "bounty_analysis",
                description:
                  "Return structured analysis of the bounty submission",
                parameters: {
                  type: "object",
                  properties: {
                    completeness_score: { type: "number" },
                    clarity_score: { type: "number" },
                    scopability_score: { type: "number" },
                    verdict: {
                      type: "string",
                      enum: ["ready", "needs_work", "insufficient"],
                    },
                    summary: { type: "string" },
                    strengths: {
                      type: "array",
                      items: { type: "string" },
                    },
                    missing_info: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          field: { type: "string" },
                          question: { type: "string" },
                          priority: {
                            type: "string",
                            enum: ["critical", "important", "nice_to_have"],
                          },
                        },
                        required: ["field", "question", "priority"],
                        additionalProperties: false,
                      },
                    },
                    suggestions: {
                      type: "array",
                      items: { type: "string" },
                    },
                  },
                  required: [
                    "completeness_score",
                    "clarity_score",
                    "scopability_score",
                    "verdict",
                    "summary",
                    "strengths",
                    "missing_info",
                    "suggestions",
                  ],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: {
            type: "function",
            function: { name: "bounty_analysis" },
          },
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI analysis failed");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No analysis returned");

    const analysis = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-bounty error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
