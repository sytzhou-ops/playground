import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { DoodleStar, DoodleSquiggle } from "@/components/DoodleElements";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  ArrowLeft,
  Send,
  Loader2,
  Sparkles,
  Target,
  Eye,
  Crosshair,
} from "lucide-react";
import { toast } from "sonner";

interface MissingInfo {
  field: string;
  question: string;
  priority: "critical" | "important" | "nice_to_have";
}

interface Analysis {
  completeness_score: number;
  clarity_score: number;
  scopability_score: number;
  verdict: "ready" | "needs_work" | "insufficient";
  summary: string;
  strengths: string[];
  missing_info: MissingInfo[];
  suggestions: string[];
}

const verdictConfig = {
  ready: {
    icon: CheckCircle,
    label: "Ready to Post",
    color: "text-green-500",
    bg: "bg-green-500/10 border-green-500/30",
    description: "Your bounty has enough detail for engineers to scope.",
  },
  needs_work: {
    icon: AlertTriangle,
    label: "Needs Clarification",
    color: "text-amber-500",
    bg: "bg-amber-500/10 border-amber-500/30",
    description: "Almost there — a few clarifying details will help engineers scope this.",
  },
  insufficient: {
    icon: XCircle,
    label: "More Detail Needed",
    color: "text-red-500",
    bg: "bg-red-500/10 border-red-500/30",
    description: "Engineers need more context to understand and scope this bounty.",
  },
};

const priorityBadge = {
  critical: "bg-red-500/10 text-red-500 border-red-500/30",
  important: "bg-amber-500/10 text-amber-500 border-amber-500/30",
  nice_to_have: "bg-blue-500/10 text-blue-500 border-blue-500/30",
};

const priorityLabel = {
  critical: "Critical",
  important: "Important",
  nice_to_have: "Nice to Have",
};

const ScoreRing = ({ score, label, icon: Icon }: { score: number; label: string; icon: React.ElementType }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? "stroke-green-500" : score >= 40 ? "stroke-amber-500" : "stroke-red-500";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={radius} fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
          <motion.circle
            cx="40" cy="40" r={radius} fill="none" className={color} strokeWidth="6"
            strokeLinecap="round" strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-lg font-bold text-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {score}
          </motion.span>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
      </div>
    </div>
  );
};

const BountyAnalysis = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bountyData = location.state?.bountyData;
  const { user, loading: authLoading } = useAuth();

  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }
    if (!bountyData) {
      navigate("/post-bounty");
      return;
    }
    analyzeSubmission();
  }, [authLoading, user]);

  const analyzeSubmission = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("analyze-bounty", {
        body: { bountyData },
      });
      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);
      setAnalysis(data.analysis);
    } catch (e: any) {
      console.error("Analysis failed:", e);
      setError(e.message || "Failed to analyze bounty");
      toast.error("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePostBounty = async () => {
    if (!user || !bountyData) return;
    try {
      const { error: insertError } = await supabase.from("bounties").insert({
        user_id: user.id,
        title: bountyData.title,
        industry: bountyData.industry,
        problem_description: bountyData.problemDescription,
        current_process: bountyData.currentProcess || null,
        pain_frequency: bountyData.painFrequency || null,
        hours_wasted: bountyData.hoursWasted,
        annual_cost: bountyData.annualCost,
        pain_description: bountyData.painDescription || null,
        desired_outcome: bountyData.desiredOutcome || null,
        acceptance_criteria: bountyData.acceptanceCriteria || null,
        tool_preferences: bountyData.toolPreferences || null,
        bounty_amount: bountyData.bountyAmount,
        payment_structure: bountyData.paymentStructure,
        urgency: bountyData.urgency || null,
        deadline: bountyData.deadline || null,
        additional_notes: bountyData.additionalNotes || null,
        status: "open",
        ai_summary: analysis?.summary || null,
        ai_completeness_score: analysis?.completeness_score ?? null,
        ai_clarity_score: analysis?.clarity_score ?? null,
        ai_scopability_score: analysis?.scopability_score ?? null,
      });
      if (insertError) throw insertError;
      toast.success("Bounty posted! 🎉");
      navigate("/bounties");
    } catch (e: any) {
      console.error("Failed to post bounty:", e);
      toast.error(e.message || "Failed to post bounty");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <DoodleStar className="fixed top-32 right-8 w-6 h-6 text-primary/20 animate-float hidden lg:block" />
        <DoodleSquiggle className="fixed top-1/2 left-4 w-16 text-primary/10 hidden lg:block" />
        <main className="container max-w-2xl mx-auto px-4 pt-28 pb-16">
          <motion.div
            className="flex flex-col items-center justify-center gap-6 py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="relative">
              <motion.div
                className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-10 h-10 text-primary" />
              </motion.div>
              <motion.div
                className="absolute -top-1 -right-1 w-6 h-6"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="w-6 h-6 text-accent" />
              </motion.div>
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-display font-bold text-foreground">Analyzing your bounty…</h2>
              <p className="text-muted-foreground font-doodle text-lg">
                our AI is reviewing your submission for scope-readiness
              </p>
            </div>
            <div className="flex gap-1.5 mt-4">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full bg-primary"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
                />
              ))}
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container max-w-2xl mx-auto px-4 pt-28 pb-16">
          <div className="flex flex-col items-center gap-6 py-20 text-center">
            <XCircle className="w-16 h-16 text-red-500" />
            <h2 className="text-2xl font-display font-bold text-foreground">Analysis Failed</h2>
            <p className="text-muted-foreground">{error}</p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => navigate("/post-bounty", { state: { bountyData } })}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Edit Bounty
              </Button>
              <Button onClick={analyzeSubmission}>Retry Analysis</Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!analysis) return null;

  const v = verdictConfig[analysis.verdict];
  const VerdictIcon = v.icon;
  const criticalMissing = analysis.missing_info.filter((m) => m.priority === "critical");
  const canPost = analysis.verdict === "ready" || (analysis.verdict === "needs_work" && criticalMissing.length === 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <DoodleStar className="fixed top-32 right-8 w-6 h-6 text-primary/20 animate-float hidden lg:block" />

      <main className="container max-w-2xl mx-auto px-4 pt-28 pb-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
            Bounty <span className="text-gradient-primary">Analysis</span>
          </h1>
          <p className="text-muted-foreground font-doodle text-xl">here's what our AI thinks</p>
        </motion.div>

        {/* Verdict card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className={`rounded-xl border p-6 mb-6 ${v.bg}`}
        >
          <div className="flex items-center gap-3 mb-3">
            <VerdictIcon className={`w-7 h-7 ${v.color}`} />
            <h2 className={`text-xl font-bold ${v.color}`}>{v.label}</h2>
          </div>
          <p className="text-foreground/80">{v.description}</p>
        </motion.div>

        {/* Scores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-4 mb-6 rounded-xl border border-border bg-card p-6"
        >
          <ScoreRing score={analysis.completeness_score} label="Completeness" icon={Target} />
          <ScoreRing score={analysis.clarity_score} label="Clarity" icon={Eye} />
          <ScoreRing score={analysis.scopability_score} label="Scopability" icon={Crosshair} />
        </motion.div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-border bg-card p-6 mb-6"
        >
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Summary</h3>
          <p className="text-foreground leading-relaxed">{analysis.summary}</p>
        </motion.div>

        {/* Strengths */}
        {analysis.strengths.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-xl border border-border bg-card p-6 mb-6"
          >
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              ✅ What you did well
            </h3>
            <ul className="space-y-2">
              {analysis.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Missing info / Questions */}
        {analysis.missing_info.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-xl border border-border bg-card p-6 mb-6"
          >
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              ❓ Clarifying Questions
            </h3>
            <div className="space-y-4">
              {analysis.missing_info.map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${priorityBadge[item.priority]}`}
                    >
                      {priorityLabel[item.priority]}
                    </span>
                    <span className="text-xs text-muted-foreground">{item.field}</span>
                  </div>
                  <p className="text-sm text-foreground font-medium">{item.question}</p>
                  <Textarea
                    placeholder="Your answer…"
                    value={answers[i] || ""}
                    onChange={(e) => setAnswers((prev) => ({ ...prev, [i]: e.target.value }))}
                    rows={2}
                    className="text-sm"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Suggestions */}
        {analysis.suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="rounded-xl border border-border bg-card p-6 mb-8"
          >
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              💡 Suggestions
            </h3>
            <ul className="space-y-2">
              {analysis.suggestions.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-foreground text-sm">
                  <Sparkles className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex justify-between"
        >
          <Button
            variant="outline"
            onClick={() => navigate("/post-bounty", { state: { bountyData } })}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Edit Bounty
          </Button>
          {canPost ? (
            <Button onClick={handlePostBounty} className="gap-2 glow-bounty bg-accent text-accent-foreground hover:bg-accent/90">
              <Send className="w-4 h-4" /> Post Bounty
            </Button>
          ) : (
            <Button
              onClick={analyzeSubmission}
              className="gap-2 glow-primary"
            >
              <Sparkles className="w-4 h-4" /> Re-Analyze
            </Button>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default BountyAnalysis;
