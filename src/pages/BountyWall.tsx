import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
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
  hours_wasted: number | null;
  annual_cost: number | null;
  impact_description: string | null;
  created_at: string;
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
    problem_description: "We spend 15+ hours a week manually copying invoice data from vendor emails into QuickBooks.",
    bounty_amount: 4000,
    industry: "finance",
    urgency: "asap",
    payment_structure: "fixed",
    ai_summary: null,
    ai_completeness_score: null,
    ai_clarity_score: null,
    ai_scopability_score: null,
    hours_wasted: 15,
    annual_cost: 48000,
    impact_description: null,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    author: "Marco T.",
    days_left: 5,
  },
  {
    id: "mock-2",
    title: "AI agent to categorize and respond to 80% of inbound support emails",
    problem_description: "Our small gym gets hundreds of support emails weekly about memberships, class schedules, and billing.",
    bounty_amount: 2000,
    industry: "other",
    urgency: "soon",
    payment_structure: "fixed",
    ai_summary: null,
    ai_completeness_score: null,
    ai_clarity_score: null,
    ai_scopability_score: null,
    hours_wasted: 10,
    annual_cost: 32000,
    impact_description: null,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    author: "Sarah K.",
    days_left: 12,
  },
  {
    id: "mock-3",
    title: "Build an interactive AI-powered wedding website with RSVP management",
    problem_description: "We want a beautiful wedding website that uses AI to manage RSVPs and answer guest questions.",
    bounty_amount: 500,
    industry: "other",
    urgency: "normal",
    payment_structure: "fixed",
    ai_summary: null,
    ai_completeness_score: null,
    ai_clarity_score: null,
    ai_scopability_score: null,
    hours_wasted: 3,
    annual_cost: 2000,
    impact_description: null,
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    author: "Jamie & Alex",
    days_left: 20,
  },
  {
    id: "mock-4",
    title: "Auto-generate social media posts from blog content with brand voice",
    problem_description: "We publish 3-4 blog posts per week and need AI to generate platform-specific social media posts.",
    bounty_amount: 1500,
    industry: "marketing",
    urgency: "asap",
    payment_structure: "fixed",
    ai_summary: null,
    ai_completeness_score: null,
    ai_clarity_score: null,
    ai_scopability_score: null,
    hours_wasted: 8,
    annual_cost: 24000,
    impact_description: null,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    author: "Diana L.",
    days_left: 8,
  },
  {
    id: "mock-5",
    title: "Schedule optimization AI for 30+ field technicians across 3 cities",
    problem_description: "Managing schedules for 30+ field technicians across 3 cities is a nightmare.",
    bounty_amount: 6000,
    industry: "logistics",
    urgency: "soon",
    payment_structure: "milestone",
    ai_summary: null,
    ai_completeness_score: null,
    ai_clarity_score: null,
    ai_scopability_score: null,
    hours_wasted: 25,
    annual_cost: 120000,
    impact_description: null,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    author: "Robert M.",
    days_left: 14,
  },
  {
    id: "mock-6",
    title: "AI chatbot for patient intake and appointment pre-screening",
    problem_description: "Our clinic needs an AI chatbot that handles patient intake forms and pre-screens appointments.",
    bounty_amount: 3000,
    industry: "healthcare",
    urgency: "soon",
    payment_structure: "fixed",
    ai_summary: null,
    ai_completeness_score: null,
    ai_clarity_score: null,
    ai_scopability_score: null,
    hours_wasted: 12,
    annual_cost: 56000,
    impact_description: null,
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    author: "Dr. Patel",
    days_left: 7,
  },
];

const urgencyLabels: Record<string, string> = {
  asap: "ASAP",
  soon: "Soon",
  normal: "Normal",
  flexible: "Flexible",
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

const BountyWall = () => {
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [loading, setLoading] = useState(true);

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
    const real = (data || []) as Bounty[];
    setBounties(real.length > 0 ? real : MOCK_BOUNTIES);
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
      if (search) {
        const q = search.toLowerCase();
        const matches =
          b.title.toLowerCase().includes(q) ||
          b.problem_description.toLowerCase().includes(q) ||
          (b.ai_summary && b.ai_summary.toLowerCase().includes(q)) ||
          (b.industry && b.industry.toLowerCase().includes(q));
        if (!matches) return false;
      }
      if (selectedIndustries.size > 0 && (!b.industry || !selectedIndustries.has(b.industry))) return false;
      if (selectedUrgencies.size > 0 && (!b.urgency || !selectedUrgencies.has(b.urgency))) return false;
      if (b.bounty_amount < amountRange[0] || b.bounty_amount > amountRange[1]) return false;
      return true;
    });
  }, [bounties, search, selectedIndustries, selectedUrgencies, amountRange]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container max-w-4xl mx-auto px-4 pt-28 pb-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Bounty Wall
          </h1>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm">Real problems, real rewards</p>
            <Link to="/post-bounty">
              <Button size="sm" className="gap-2">
                <Plus className="w-4 h-4" /> Post a Bounty
              </Button>
            </Link>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mb-6 space-y-3">
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
                <span className="w-2 h-2 rounded-full bg-primary" />
              )}
            </Button>
          </div>

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
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                      Industry
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {INDUSTRIES.map((ind) => (
                        <button
                          key={ind}
                          onClick={() => toggleIndustry(ind)}
                          className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                            selectedIndustries.has(ind)
                              ? "border-foreground bg-foreground/10 text-foreground"
                              : "border-border text-muted-foreground hover:border-foreground/20"
                          }`}
                        >
                          {INDUSTRY_LABELS[ind] || ind}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                      Urgency
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(urgencyLabels).map(([key, label]) => (
                        <button
                          key={key}
                          onClick={() => toggleUrgency(key)}
                          className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                            selectedUrgencies.has(key)
                              ? "border-foreground bg-foreground/10 text-foreground"
                              : "border-border text-muted-foreground hover:border-foreground/20"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                      Amount: {formatCurrency(amountRange[0])} – {formatCurrency(amountRange[1])}
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

                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 text-muted-foreground">
                      <X className="w-3 h-3" /> Clear all
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {hasActiveFilters && !showFilters && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{filtered.length} of {bounties.length} bounties</span>
              <button onClick={clearFilters} className="text-foreground hover:underline text-xs">
                Clear
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">
              {bounties.length === 0 ? "No bounties yet. Be the first!" : "No bounties match your filters."}
            </p>
            {bounties.length === 0 ? (
              <Link to="/post-bounty">
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="w-4 h-4" /> Post a Bounty
                </Button>
              </Link>
            ) : (
              <Button variant="outline" size="sm" onClick={clearFilters} className="gap-2">
                <X className="w-4 h-4" /> Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <>
            {showFilters && (
              <p className="text-sm text-muted-foreground mb-4">
                Showing {filtered.length} of {bounties.length} bounties
              </p>
            )}
            <div className="grid gap-3 md:grid-cols-2">
              {filtered.map((bounty, i) => (
                <motion.div
                  key={bounty.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Link to={`/bounties/${bounty.id}`} className="block h-full">
                    <div className="rounded-xl border border-border p-5 hover:border-foreground/10 transition-colors h-full">
                      {/* Top row: industry + urgency + time */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {bounty.industry && (
                            <span className="text-xs text-muted-foreground">
                              {INDUSTRY_LABELS[bounty.industry] || bounty.industry}
                            </span>
                          )}
                          {bounty.urgency && (
                            <span className="text-xs text-muted-foreground">
                              · {urgencyLabels[bounty.urgency] || bounty.urgency}
                            </span>
                          )}
                        </div>
                        {bounty.days_left != null && (
                          <span className="text-xs text-muted-foreground font-mono">{bounty.days_left}d left</span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-sm font-semibold text-foreground leading-snug mb-4">
                        {bounty.title}
                      </h3>

                      {/* Bottom: amount + author */}
                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <span className="text-lg font-bold text-foreground">
                          {formatCurrency(bounty.bounty_amount)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {bounty.author || getTimeAgo(bounty.created_at)}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
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
