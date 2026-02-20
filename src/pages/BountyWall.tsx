import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { DoodleStar, DoodleSquiggle } from "@/components/DoodleElements";
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
  Shield,
  BadgeCheck,
  DollarSign,
  Cpu,
  Database,
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
  hours_wasted: number | null;
  annual_cost: number | null;
  impact_description: string | null;
  created_at: string;
  // Extended fields for display
  author?: string;
  role?: string;
  proposals?: number;
  days_left?: number;
  hot?: boolean;
  verified?: boolean;
  escrow?: boolean;
  complexity?: "Low" | "Medium" | "High";
  data_ready?: boolean;
}

const MOCK_BOUNTIES: Bounty[] = [
  {
    id: "mock-1",
    title: "Automate invoice extraction from vendor emails into QuickBooks",
    problem_description: "We spend 15+ hours a week manually copying invoice data from vendor emails into QuickBooks. Need an AI solution to automatically extract, categorize, and enter invoice data.",
    bounty_amount: 4000,
    industry: "finance",
    urgency: "asap",
    payment_structure: "fixed",
    ai_summary: "Automate invoice extraction from vendor emails into QuickBooks to eliminate manual data entry.",
    ai_completeness_score: 85,
    ai_clarity_score: 90,
    ai_scopability_score: 78,
    hours_wasted: 15,
    annual_cost: 48000,
    impact_description: "Eliminates manual data entry",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    author: "Marco T.",
    role: "Restaurant Owner",
    proposals: 12,
    days_left: 5,
    hot: true,
    verified: true,
    escrow: true,
    complexity: "Medium",
    data_ready: true,
  },
  {
    id: "mock-2",
    title: "AI agent to categorize and respond to 80% of inbound support emails",
    problem_description: "Our small gym gets hundreds of support emails weekly about memberships, class schedules, and billing. Need an AI agent that can handle 80% of these automatically.",
    bounty_amount: 2000,
    industry: "other",
    urgency: "soon",
    payment_structure: "fixed",
    ai_summary: "AI agent to categorize and auto-respond to 80% of inbound support emails for a gym.",
    ai_completeness_score: 72,
    ai_clarity_score: 80,
    ai_scopability_score: 75,
    hours_wasted: 10,
    annual_cost: 32000,
    impact_description: "Cuts response time by 80%",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    author: "Sarah K.",
    role: "Gym Owner",
    proposals: 8,
    days_left: 12,
    verified: true,
    escrow: true,
    complexity: "Medium",
    data_ready: true,
  },
  {
    id: "mock-3",
    title: "Build an interactive AI-powered wedding website with RSVP management",
    problem_description: "We want a beautiful wedding website that uses AI to manage RSVPs, answer guest questions about the venue/schedule, and handle dietary preferences automatically.",
    bounty_amount: 500,
    industry: "other",
    urgency: "normal",
    payment_structure: "fixed",
    ai_summary: "Interactive AI-powered wedding website with smart RSVP management and guest Q&A.",
    ai_completeness_score: 55,
    ai_clarity_score: 65,
    ai_scopability_score: 60,
    hours_wasted: 3,
    annual_cost: 2000,
    impact_description: "Automates guest management",
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    author: "Jamie & Alex",
    role: "Engaged Couple",
    proposals: 15,
    days_left: 20,
    escrow: true,
    complexity: "Low",
    data_ready: false,
  },
  {
    id: "mock-4",
    title: "Auto-generate social media posts from blog content with brand voice",
    problem_description: "We publish 3-4 blog posts per week and need AI to automatically generate platform-specific social media posts that match our brand voice and style guidelines.",
    bounty_amount: 1500,
    industry: "marketing",
    urgency: "asap",
    payment_structure: "fixed",
    ai_summary: "Auto-generate social media posts from blog content while maintaining brand voice consistency.",
    ai_completeness_score: 80,
    ai_clarity_score: 88,
    ai_scopability_score: 82,
    hours_wasted: 8,
    annual_cost: 24000,
    impact_description: "3x content output",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    author: "Diana L.",
    role: "Marketing Director",
    proposals: 6,
    days_left: 8,
    hot: true,
    verified: true,
    escrow: true,
    complexity: "Low",
    data_ready: true,
  },
  {
    id: "mock-5",
    title: "Schedule optimization AI for 30+ field technicians across 3 cities",
    problem_description: "Managing schedules for 30+ field technicians across 3 cities is a nightmare. Need an AI system that optimizes routes, handles cancellations, and minimizes idle time.",
    bounty_amount: 6000,
    industry: "logistics",
    urgency: "soon",
    payment_structure: "milestone",
    ai_summary: "AI-powered schedule optimization for 30+ field technicians across multiple cities.",
    ai_completeness_score: 78,
    ai_clarity_score: 85,
    ai_scopability_score: 70,
    hours_wasted: 25,
    annual_cost: 120000,
    impact_description: "20% fewer idle hours",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    author: "Robert M.",
    role: "Operations Manager",
    proposals: 4,
    days_left: 14,
    verified: true,
    escrow: true,
    complexity: "High",
    data_ready: true,
  },
  {
    id: "mock-6",
    title: "AI chatbot for patient intake and appointment pre-screening",
    problem_description: "Our clinic needs an AI chatbot that handles patient intake forms, pre-screens appointments, collects insurance info, and routes patients to the right department.",
    bounty_amount: 3000,
    industry: "healthcare",
    urgency: "soon",
    payment_structure: "fixed",
    ai_summary: "AI chatbot for patient intake, appointment pre-screening, and department routing.",
    ai_completeness_score: 68,
    ai_clarity_score: 75,
    ai_scopability_score: 65,
    hours_wasted: 12,
    annual_cost: 56000,
    impact_description: "Frees 2 FTEs from admin",
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    author: "Dr. Patel",
    role: "Clinic Owner",
    proposals: 9,
    days_left: 7,
    verified: true,
    escrow: true,
    complexity: "Medium",
    data_ready: false,
  },
];

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
      .select("id, title, industry, problem_description, bounty_amount, urgency, payment_structure, ai_summary, ai_completeness_score, ai_clarity_score, ai_scopability_score, hours_wasted, annual_cost, impact_description, created_at")
      .eq("status", "open")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch bounties:", error);
    }
    // Merge real bounties with mock data
    const real = (data || []) as Bounty[];
    setBounties([...real, ...MOCK_BOUNTIES]);
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
                const complexityColor = { Low: "text-green-400", Medium: "text-yellow-400", High: "text-red-400" };

                return (
                  <motion.div
                    key={bounty.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    layout
                  >
                    <Link to={`/bounties/${bounty.id}`} className="block h-full">
                    <Card className="group relative h-full hover:border-primary/30 transition-all duration-300 cursor-pointer overflow-visible">
                      {/* Hot badge */}
                      {bounty.hot && (
                        <div className="absolute -top-3 right-4 flex items-center gap-1.5 bg-gradient-to-r from-bounty to-bounty/80 text-bounty-foreground text-xs font-bold px-3 py-1 rounded-full glow-bounty z-10">
                          <Flame className="w-3 h-3" /> HOT
                        </div>
                      )}

                      <CardHeader className="pb-3">
                        {/* Trust badges */}
                        <div className="flex items-center gap-2 mb-1">
                          {(bounty.escrow !== false) && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full border border-green-400/20">
                              <Shield className="w-2.5 h-2.5" /> Escrow
                            </span>
                          )}
                          {(bounty.verified !== false) && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full border border-accent/20">
                              <BadgeCheck className="w-2.5 h-2.5" /> Verified
                            </span>
                          )}
                        </div>

                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            {bounty.industry && (
                              <span className="text-xs font-medium text-primary/80 bg-primary/10 px-3 py-1 rounded-full border border-primary/10">
                                {INDUSTRY_LABELS[bounty.industry] || bounty.industry}
                              </span>
                            )}
                            {urg && UrgIcon && (
                              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${urg.class}`}>
                                {urg.label}
                              </span>
                            )}
                          </div>
                          {bounty.days_left != null && (
                            <span className="text-xs text-muted-foreground font-mono whitespace-nowrap">{bounty.days_left}d left</span>
                          )}
                        </div>

                        <CardTitle className="text-sm font-semibold leading-snug mt-2 group-hover:text-primary/90 transition-colors">
                          {bounty.title}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="pb-3 space-y-3">
                        {/* ROI metrics */}
                        {(bounty.annual_cost || bounty.hours_wasted || bounty.impact_description) && (
                          <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-muted/30 border border-border/30">
                            <div className="text-center">
                              <div className="flex items-center justify-center gap-1 text-primary">
                                <DollarSign className="w-3 h-3" />
                                <span className="text-xs font-bold">
                                  {bounty.annual_cost ? `$${Math.round(bounty.annual_cost / 1000)}K` : "—"}
                                </span>
                              </div>
                              <p className="text-[9px] text-muted-foreground mt-0.5">saved/yr</p>
                            </div>
                            <div className="text-center border-x border-border/30">
                              <div className="flex items-center justify-center gap-1 text-accent">
                                <Clock className="w-3 h-3" />
                                <span className="text-xs font-bold">{bounty.hours_wasted || "—"}h</span>
                              </div>
                              <p className="text-[9px] text-muted-foreground mt-0.5">saved/wk</p>
                            </div>
                            <div className="text-center">
                              <p className="text-[10px] font-medium text-foreground/80 leading-tight">{bounty.impact_description || "—"}</p>
                            </div>
                          </div>
                        )}

                        {/* Builder signals */}
                        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                          {bounty.complexity && (
                            <span className={`inline-flex items-center gap-1 ${complexityColor[bounty.complexity]}`}>
                              <Cpu className="w-3 h-3" />
                              {bounty.complexity}
                            </span>
                          )}
                          {bounty.data_ready != null && (
                            <span className={`inline-flex items-center gap-1 ${bounty.data_ready ? "text-green-400" : "text-yellow-400"}`}>
                              <Database className="w-3 h-3" />
                              {bounty.data_ready ? "Data ready" : "Needs data"}
                            </span>
                          )}
                        </div>

                        {/* Bounty amount */}
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-extrabold text-gradient-primary">
                            {formatCurrency(bounty.bounty_amount)}
                          </span>
                          <span className="text-xs text-muted-foreground">bounty</span>
                        </div>
                      </CardContent>

                      <CardFooter className="pt-0">
                        <div className="w-full pt-3 border-t border-border/50 flex items-center justify-between">
                          {bounty.author ? (
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center text-xs font-bold text-primary">
                                {bounty.author[0]}
                              </div>
                              <div>
                                <p className="text-xs font-medium text-foreground">{bounty.author}</p>
                                {bounty.role && <p className="text-[10px] text-muted-foreground">{bounty.role}</p>}
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3">
                              <MiniScore score={bounty.ai_completeness_score} icon={Target} label="Completeness" />
                              <MiniScore score={bounty.ai_clarity_score} icon={Eye} label="Clarity" />
                              <MiniScore score={bounty.ai_scopability_score} icon={Crosshair} label="Scopability" />
                            </div>
                          )}
                          <span className="text-xs text-muted-foreground font-mono">
                            {bounty.proposals != null ? `${bounty.proposals} proposals` : getTimeAgo(bounty.created_at)}
                          </span>
                        </div>
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
