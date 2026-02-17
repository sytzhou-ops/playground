import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { DoodleStar, DoodleSquiggle } from "@/components/DoodleElements";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
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
  Search,
  SlidersHorizontal,
  X,
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

const INDUSTRIES = [
  "e-commerce", "healthcare", "real-estate", "finance", "legal",
  "marketing", "operations", "hr-/-recruiting", "logistics", "other",
];

const INDUSTRY_LABELS: Record<string, string> = {
  "e-commerce": "E-commerce",
  "healthcare": "Healthcare",
  "real-estate": "Real Estate",
  "finance": "Finance",
  "legal": "Legal",
  "marketing": "Marketing",
  "operations": "Operations",
  "hr-/-recruiting": "HR / Recruiting",
  "logistics": "Logistics",
  "other": "Other",
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

  // Filter state
  const [search, setSearch] = useState("");
  const [selectedIndustries, setSelectedIndustries] = useState<Set<string>>(new Set());
  const [selectedUrgencies, setSelectedUrgencies] = useState<Set<string>>(new Set());
  const [amountRange, setAmountRange] = useState<[number, number]>([0, 50000]);
  const [showFilters, setShowFilters] = useState(false);

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

  const toggleIndustry = (ind: string) => {
    setSelectedIndustries((prev) => {
      const next = new Set(prev);
      next.has(ind) ? next.delete(ind) : next.add(ind);
      return next;
    });
  };

  const toggleUrgency = (urg: string) => {
    setSelectedUrgencies((prev) => {
      const next = new Set(prev);
      next.has(urg) ? next.delete(urg) : next.add(urg);
      return next;
    });
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedIndustries(new Set());
    setSelectedUrgencies(new Set());
    setAmountRange([0, 50000]);
  };

  const hasActiveFilters = search || selectedIndustries.size > 0 || selectedUrgencies.size > 0 || amountRange[0] > 0 || amountRange[1] < 50000;

  const filtered = useMemo(() => {
    return bounties.filter((b) => {
      // Search
      if (search) {
        const q = search.toLowerCase();
        const matches =
          b.title.toLowerCase().includes(q) ||
          b.problem_description.toLowerCase().includes(q) ||
          (b.ai_summary && b.ai_summary.toLowerCase().includes(q)) ||
          (b.industry && b.industry.toLowerCase().includes(q));
        if (!matches) return false;
      }
      // Industry
      if (selectedIndustries.size > 0 && (!b.industry || !selectedIndustries.has(b.industry))) return false;
      // Urgency
      if (selectedUrgencies.size > 0 && (!b.urgency || !selectedUrgencies.has(b.urgency))) return false;
      // Amount
      if (b.bounty_amount < amountRange[0] || b.bounty_amount > amountRange[1]) return false;
      return true;
    });
  }, [bounties, search, selectedIndustries, selectedUrgencies, amountRange]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <DoodleStar className="fixed top-32 right-8 w-6 h-6 text-primary/20 animate-float hidden lg:block" />
      <DoodleSquiggle className="fixed top-1/2 left-4 w-16 text-primary/10 hidden lg:block" />

      <main className="container max-w-5xl mx-auto px-4 pt-28 pb-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <span className="font-western text-sm tracking-[0.3em] text-primary/60 uppercase block mb-2">★ Open Contracts ★</span>
          <h1 className="text-3xl md:text-4xl font-western font-bold text-foreground mb-2">
            Bounty <span className="text-gradient-ai">Wall</span>
          </h1>
          <p className="text-muted-foreground text-base mb-6">real problems, real rewards</p>
          <Link to="/post-bounty">
            <Button className="gap-2 glow-primary border border-primary/50">
              <Plus className="w-4 h-4" /> <span className="font-western tracking-wide">Post a Bounty</span>
            </Button>
          </Link>
        </motion.div>

        {/* Search & Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 space-y-3"
        >
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search bounties…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button
              variant={showFilters ? "default" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-accent" />
              )}
            </Button>
          </div>

          {/* Expandable filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="rounded-xl border border-border bg-card p-5 space-y-5">
                  {/* Industry */}
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                      Industry
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {INDUSTRIES.map((ind) => (
                        <button
                          key={ind}
                          onClick={() => toggleIndustry(ind)}
                          className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                            selectedIndustries.has(ind)
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border text-muted-foreground hover:border-primary/30"
                          }`}
                        >
                          {INDUSTRY_LABELS[ind] || ind}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Urgency */}
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                      Urgency
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(urgencyConfig).map(([key, cfg]) => {
                        const Icon = cfg.icon;
                        return (
                          <button
                            key={key}
                            onClick={() => toggleUrgency(key)}
                            className={`px-3 py-1.5 rounded-full text-xs border transition-all flex items-center gap-1.5 ${
                              selectedUrgencies.has(key)
                                ? cfg.class + " font-bold"
                                : "border-border text-muted-foreground hover:border-primary/30"
                            }`}
                          >
                            <Icon className="w-3 h-3" />
                            {cfg.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Amount range */}
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                      Bounty Amount: {formatCurrency(amountRange[0])} – {formatCurrency(amountRange[1])}
                    </label>
                    <Slider
                      value={amountRange}
                      onValueChange={(v) => setAmountRange(v as [number, number])}
                      min={0}
                      max={50000}
                      step={500}
                      className="mt-2"
                    />
                  </div>

                  {/* Clear */}
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 text-muted-foreground">
                      <X className="w-3 h-3" /> Clear all filters
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active filter count */}
          {hasActiveFilters && !showFilters && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{filtered.length} of {bounties.length} bounties</span>
              <button onClick={clearFilters} className="text-primary hover:underline text-xs">
                Clear filters
              </button>
            </div>
          )}
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <p className="text-muted-foreground text-lg mb-4">
              {bounties.length === 0 ? "No bounties yet. Be the first!" : "No bounties match your filters."}
            </p>
            {bounties.length === 0 ? (
              <Link to="/post-bounty">
                <Button variant="outline" className="gap-2">
                  <Plus className="w-4 h-4" /> Post a Bounty
                </Button>
              </Link>
            ) : (
              <Button variant="outline" onClick={clearFilters} className="gap-2">
                <X className="w-4 h-4" /> Clear Filters
              </Button>
            )}
          </motion.div>
        ) : (
          <>
            {showFilters && (
              <p className="text-sm text-muted-foreground mb-4">
                Showing {filtered.length} of {bounties.length} bounties
              </p>
            )}
            <div className="grid gap-4 md:grid-cols-2">
              {filtered.map((bounty, i) => {
                const urg = bounty.urgency ? urgencyConfig[bounty.urgency] : null;
                const UrgIcon = urg?.icon;
                const timeAgo = getTimeAgo(bounty.created_at);

                return (
                  <motion.div
                    key={bounty.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    layout
                  >
                    <Link to={`/bounties/${bounty.id}`} className="block h-full">
                    <Card className="h-full hover:border-primary/30 transition-colors cursor-pointer">
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
                              {INDUSTRY_LABELS[bounty.industry] || bounty.industry}
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
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </>
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
