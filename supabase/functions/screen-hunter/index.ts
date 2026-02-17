import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId } = await req.json();
    if (!userId) throw new Error("userId is required");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Fetch the hunter profile
    const { data: profile, error: fetchError } = await supabase
      .from("hunter_profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (fetchError || !profile) {
      throw new Error("Hunter profile not found");
    }

    // Score the application using a simple heuristic
    let score = 0;
    const reasons: string[] = [];

    // Years of experience (max 20 points)
    const expPoints = Math.min(profile.years_experience * 2, 20);
    score += expPoints;
    reasons.push(`Experience: ${profile.years_experience} years (+${expPoints})`);

    // Bio quality (max 15 points)
    const bioLength = (profile.bio || "").length;
    const bioPoints = bioLength > 200 ? 15 : bioLength > 100 ? 10 : bioLength > 50 ? 5 : 0;
    score += bioPoints;
    reasons.push(`Bio quality: ${bioPoints > 10 ? "detailed" : bioPoints > 5 ? "adequate" : "brief"} (+${bioPoints})`);

    // Expertise areas (max 15 points)
    const expertiseCount = (profile.expertise_areas || []).length;
    const expertisePoints = Math.min(expertiseCount * 3, 15);
    score += expertisePoints;
    reasons.push(`Expertise areas: ${expertiseCount} selected (+${expertisePoints})`);

    // Portfolio links (max 15 points)
    let linkPoints = 0;
    if (profile.linkedin_url) linkPoints += 5;
    if (profile.github_url) linkPoints += 5;
    if (profile.portfolio_url) linkPoints += 5;
    score += linkPoints;
    reasons.push(`Portfolio links: ${linkPoints / 5} provided (+${linkPoints})`);

    // Resume uploaded (10 points)
    if (profile.resume_path) {
      score += 10;
      reasons.push("Resume: uploaded (+10)");
    }

    // Past projects quality (max 15 points)
    const projectsLength = (profile.past_projects || "").length;
    const projectPoints = projectsLength > 300 ? 15 : projectsLength > 150 ? 10 : projectsLength > 50 ? 5 : 0;
    score += projectPoints;
    reasons.push(`Past projects: ${projectPoints > 10 ? "comprehensive" : projectPoints > 5 ? "adequate" : "brief"} (+${projectPoints})`);

    // Certifications (max 10 points)
    const certLength = (profile.certifications || "").length;
    const certPoints = certLength > 100 ? 10 : certLength > 30 ? 5 : 0;
    score += certPoints;
    if (certLength > 0) reasons.push(`Certifications: provided (+${certPoints})`);

    const assessment = `**AI Screening Score: ${score}/100**\n\n${reasons.join("\n")}\n\n${
      score >= 60
        ? "✅ Strong candidate — recommend approval."
        : score >= 40
        ? "⚠️ Moderate profile — consider manual review of portfolio and projects."
        : "❌ Weak profile — insufficient evidence of expertise."
    }`;

    // Update the profile with AI score
    await supabase
      .from("hunter_profiles")
      .update({
        ai_score: score,
        ai_assessment: assessment,
      })
      .eq("user_id", userId);

    return new Response(JSON.stringify({ score, assessment }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
