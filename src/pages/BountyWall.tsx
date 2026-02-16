import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { DoodleStar, DoodleSquiggle } from "@/components/DoodleElements";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  Clock,
  Zap,
  Flame,
  Calendar,
  Waves,
  Target,
  Eye,
  Crosshair,
  Loader2,
  Plus,
} from "lucide-react";

interface Bounty {
  id: string;
  title: string;
  industry: string | null;
  problem_description: string;
  bounty_amount: number;
  urgency: string | null;
  payment_structure: string | null;
  ai_summary: string | null;
  ai_completeness_score: number | null;
  ai_clarity_score: number | null;
  ai_scopability_score: number | null;
  created_at: string;
}

const urgencyConfig: Record<string, { icon: React.ElementType; label: string; class: string }> = {
  asap: { icon: Flame, label: "ASAP", class: "bg-red-500/10 text-red-500 border-red-500/30" },
  soon: { icon: Zap, label: "Soon", class: "bg-amber-500/10 text-amber-500 border-amber-500/30" },
  normal: { icon: Calendar, label: "Normal", class: "bg-blue-500/10 text-blue-500 border-blue-500/30" },
  flexible: { icon: Waves, label: "Flexible", class: "bg-green-500/10 text-green-500 border-green-500/30" },
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

const MiniScore = ({ score, icon: Icon, label }: { score: number | null; icon: React.ElementType; label: string }) => {
  if (score === null) return null;
  const color = score >= 70 ? "text-green-500" : score >= 40 ? "text-amber-500" : "text-red-500";
  return (
    <div className="flex items-center gap-1" title={label}>
      <Icon className={`w-3 h-3 ${color}`} />
      <span className={`text-xs font-bold ${color}`}>{score}</span>
    </div>
  );
};

const BountyWall = () => {
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBounties();

    const channel = supabase
      .channel("bounties-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "bounties" }, () => {
        fetchBounties();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchBounties = async () => {
    const { data, error } = await supabase
      .from("bounties")
      .select("id, title, industry, problem_description, bounty_amount, urgency, payment_structure, ai_summary, ai_completeness_score, ai_clarity_score, ai_scopability_score, created_at")
      .eq("status", "open")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch bounties:", error);
    } else {
      setBounties(data || []);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <DoodleStar className="fixed top-32 right-8 w-6 h-6 text-primary/20 animate-float hidden lg:block" />
      <DoodleSquiggle className="fixed top-1/2 left-4 w-16 text-primary/10 hidden lg:block" />

      <main className="container max-w-5xl mx-auto px-4 pt-28 pb-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
            Bounty <span className="text-gradient-primary">Wall</span>
          </h1>
          <p className="text-muted-foreground font-doodle text-xl mb-6">real problems, real rewards</p>
          <Link to="/post-bounty">
            <Button className="gap-2 glow-primary">
              <Plus className="w-4 h-4" /> Post a Bounty
            </Button>
          </Link>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : bounties.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <p className="text-muted-foreground text-lg mb-4">No bounties yet. Be the first!</p>
            <Link to="/post-bounty">
              <Button variant="outline" className="gap-2">
                <Plus className="w-4 h-4" /> Post a Bounty
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {bounties.map((bounty, i) => {
              const urg = bounty.urgency ? urgencyConfig[bounty.urgency] : null;
              const UrgIcon = urg?.icon;
              const timeAgo = getTimeAgo(bounty.created_at);

              return (
                <motion.div
                  key={bounty.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="h-full hover:border-primary/30 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <CardTitle className="text-lg leading-snug line-clamp-2">{bounty.title}</CardTitle>
                        <span className="text-xl font-bold text-accent whitespace-nowrap">
                          {formatCurrency(bounty.bounty_amount)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap mt-1">
                        {bounty.industry && (
                          <Badge variant="secondary" className="text-xs capitalize">
                            {bounty.industry}
                          </Badge>
                        )}
                        {urg && UrgIcon && (
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${urg.class}`}>
                            {urg.label}
                          </span>
                        )}
                        {bounty.payment_structure && (
                          <Badge variant="outline" className="text-xs capitalize">
                            {bounty.payment_structure}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {bounty.ai_summary || bounty.problem_description}
                      </p>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between pt-0">
                      <div className="flex items-center gap-3">
                        <MiniScore score={bounty.ai_completeness_score} icon={Target} label="Completeness" />
                        <MiniScore score={bounty.ai_clarity_score} icon={Eye} label="Clarity" />
                        <MiniScore score={bounty.ai_scopability_score} icon={Crosshair} label="Scopability" />
                      </div>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {timeAgo}
                      </span>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
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

export default BountyWall;
