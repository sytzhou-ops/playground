import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import { DoodleStar, DoodleSquiggle } from "@/components/DoodleElements";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Clock,
  Zap,
  Flame,
  Calendar,
  Waves,
  Target,
  Eye,
  Crosshair,
  DollarSign,
  Loader2,
  Briefcase,
  FileText,
  CheckCircle2,
  Wrench,
  MessageSquare,
  Timer,
  Send,
  Users,
} from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Bounty = Tables<"bounties">;

const urgencyConfig: Record<string, { icon: React.ElementType; label: string; class: string }> = {
  asap: { icon: Flame, label: "ASAP", class: "bg-red-500/10 text-red-500 border-red-500/30" },
  soon: { icon: Zap, label: "Soon", class: "bg-amber-500/10 text-amber-500 border-amber-500/30" },
  normal: { icon: Calendar, label: "Normal", class: "bg-blue-500/10 text-blue-500 border-blue-500/30" },
  flexible: { icon: Waves, label: "Flexible", class: "bg-green-500/10 text-green-500 border-green-500/30" },
};

const INDUSTRY_LABELS: Record<string, string> = {
  "e-commerce": "E-commerce",
  healthcare: "Healthcare",
  "real-estate": "Real Estate",
  finance: "Finance",
  legal: "Legal",
  marketing: "Marketing",
  operations: "Operations",
  "hr-/-recruiting": "HR / Recruiting",
  logistics: "Logistics",
  other: "Other",
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

const ScoreRing = ({ score, label, icon: Icon }: { score: number | null; label: string; icon: React.ElementType }) => {
  if (score === null) return null;
  const color = score >= 70 ? "text-green-500" : score >= 40 ? "text-amber-500" : "text-red-500";
  const strokeColor = score >= 70 ? "stroke-green-500" : score >= 40 ? "stroke-amber-500" : "stroke-red-500";
  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-20 h-20">
        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="36" fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
          <circle
            cx="40" cy="40" r="36" fill="none"
            className={strokeColor}
            strokeWidth="6" strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1s ease" }}
          />
        </svg>
        <span className={`absolute inset-0 flex items-center justify-center text-lg font-bold ${color}`}>
          {score}
        </span>
      </div>
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Icon className="w-3 h-3" /> {label}
      </div>
    </div>
  );
};

const DetailRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | null | undefined;
}) => {
  if (!value) return null;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        <Icon className="w-3.5 h-3.5" /> {label}
      </div>
      <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{value}</p>
    </div>
  );
};

const BountyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [bounty, setBounty] = useState<Bounty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appCount, setAppCount] = useState(0);

  useEffect(() => {
    if (!id) return;
    const fetchBounty = async () => {
      const { data, error: fetchError } = await supabase
        .from("bounties")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) {
        setError("Bounty not found");
      } else {
        setBounty(data);
      }
      setLoading(false);
    };
    fetchBounty();

    // Fetch application count if owner
    if (user) {
      supabase
        .from("applications")
        .select("id", { count: "exact", head: true })
        .eq("bounty_id", id)
        .then(({ count }) => setAppCount(count || 0));
    }
  }, [id, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center items-center pt-40">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !bounty) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container max-w-3xl mx-auto px-4 pt-28 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Bounty not found</h1>
          <Link to="/bounties">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Bounties
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const urg = bounty.urgency ? urgencyConfig[bounty.urgency] : null;
  const UrgIcon = urg?.icon;
  const timeAgo = getTimeAgo(bounty.created_at);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <DoodleStar className="fixed top-32 right-8 w-6 h-6 text-primary/20 animate-float hidden lg:block" />
      <DoodleSquiggle className="fixed top-1/2 left-4 w-16 text-primary/10 hidden lg:block" />

      <main className="container max-w-3xl mx-auto px-4 pt-28 pb-16">
        {/* Back link */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <Link to="/bounties" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Bounties
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 flex-wrap mb-3">
            {bounty.industry && (
              <Badge variant="secondary" className="capitalize">
                {INDUSTRY_LABELS[bounty.industry] || bounty.industry}
              </Badge>
            )}
            {urg && UrgIcon && (
              <span className={`text-xs uppercase font-bold px-2.5 py-1 rounded-full border ${urg.class}`}>
                <UrgIcon className="w-3 h-3 inline mr-1" />
                {urg.label}
              </span>
            )}
            {bounty.payment_structure && (
              <Badge variant="outline" className="capitalize">{bounty.payment_structure}</Badge>
            )}
            <span className="text-xs text-muted-foreground flex items-center gap-1 ml-auto">
              <Clock className="w-3 h-3" /> {timeAgo}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">{bounty.title}</h1>

          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-accent" />
            <span className="text-2xl font-bold text-accent">{formatCurrency(bounty.bounty_amount)}</span>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 mt-4">
            {user && bounty.user_id === user.id ? (
              <Link to={`/bounties/${bounty.id}/applications`}>
                <Button className="gap-2">
                  <Users className="w-4 h-4" /> View Applications {appCount > 0 && `(${appCount})`}
                </Button>
              </Link>
            ) : (
              <Link to={`/bounties/${bounty.id}/apply`}>
                <Button className="gap-2 glow-primary">
                  <Send className="w-4 h-4" /> Apply to this Bounty
                </Button>
              </Link>
            )}
          </div>
        </motion.div>

        {/* AI Summary & Scores */}
        {bounty.ai_summary && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="mb-6">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-2">AI Summary</p>
                <p className="text-foreground leading-relaxed">{bounty.ai_summary}</p>

                {(bounty.ai_completeness_score !== null || bounty.ai_clarity_score !== null || bounty.ai_scopability_score !== null) && (
                  <div className="flex items-center justify-center gap-8 mt-6 pt-6 border-t border-border">
                    <ScoreRing score={bounty.ai_completeness_score} icon={Target} label="Completeness" />
                    <ScoreRing score={bounty.ai_clarity_score} icon={Eye} label="Clarity" />
                    <ScoreRing score={bounty.ai_scopability_score} icon={Crosshair} label="Scopability" />
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Details */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardContent className="pt-6 space-y-6">
              <DetailRow icon={FileText} label="Problem Description" value={bounty.problem_description} />
              <DetailRow icon={Briefcase} label="Current Process" value={bounty.current_process} />
              <DetailRow icon={MessageSquare} label="Pain & Impact" value={bounty.pain_description} />
              <DetailRow icon={CheckCircle2} label="Desired Outcome" value={bounty.desired_outcome} />
              <DetailRow icon={Target} label="Acceptance Criteria" value={bounty.acceptance_criteria} />
              <DetailRow icon={Wrench} label="Tool Preferences" value={bounty.tool_preferences} />
              <DetailRow icon={MessageSquare} label="Additional Notes" value={bounty.additional_notes} />

              {/* Meta info row */}
              <div className="flex flex-wrap gap-4 pt-4 border-t border-border text-xs text-muted-foreground">
                {bounty.pain_frequency && (
                  <span className="flex items-center gap-1">
                    <Timer className="w-3 h-3" /> Frequency: <span className="text-foreground capitalize">{bounty.pain_frequency}</span>
                  </span>
                )}
                {bounty.hours_wasted !== null && bounty.hours_wasted > 0 && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {bounty.hours_wasted}h/week wasted
                  </span>
                )}
                {bounty.annual_cost !== null && bounty.annual_cost > 0 && (
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" /> {formatCurrency(bounty.annual_cost)}/yr cost
                  </span>
                )}
                {bounty.deadline && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Deadline: {new Date(bounty.deadline).toLocaleDateString()}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default BountyDetail;
