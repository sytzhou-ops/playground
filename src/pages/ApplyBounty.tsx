import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { DoodleStar, DoodleSquiggle, DoodleArrow } from "@/components/DoodleElements";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Loader2,
  Brain,
  Crosshair,
  Wrench,
  MessageSquare,
  Clock,
  DollarSign,
} from "lucide-react";

const STEPS = [
  { id: "understand", label: "Understand", icon: Brain, tagline: "Show you get the problem" },
  { id: "scope", label: "Scope", icon: Crosshair, tagline: "Break it down" },
  { id: "solve", label: "Solve", icon: Wrench, tagline: "Your approach" },
  { id: "needs", label: "Needs", icon: MessageSquare, tagline: "What you need from the poster" },
  { id: "estimate", label: "Estimate", icon: Clock, tagline: "Time & cost" },
];

interface ApplicationForm {
  problemUnderstanding: string;
  scopeApproach: string;
  solutionPlan: string;
  needsFromRequestor: string;
  estimatedHours: number;
  estimatedCost: number;
}

const initialForm: ApplicationForm = {
  problemUnderstanding: "",
  scopeApproach: "",
  solutionPlan: "",
  needsFromRequestor: "",
  estimatedHours: 10,
  estimatedCost: 1000,
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -300 : 300, opacity: 0 }),
};

const ApplyBounty = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [bountyTitle, setBountyTitle] = useState("");
  const [bountyLoading, setBountyLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [form, setForm] = useState<ApplicationForm>(initialForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth", { state: { returnTo: `/bounties/${id}/apply` } });
    }
  }, [user, authLoading, navigate, id]);

  useEffect(() => {
    if (!id) return;
    supabase
      .from("bounties")
      .select("title, user_id")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          navigate("/bounties");
        } else {
          if (data.user_id === user?.id) {
            toast({ title: "You can't apply to your own bounty", variant: "destructive" });
            navigate(`/bounties/${id}`);
            return;
          }
          setBountyTitle(data.title);
        }
        setBountyLoading(false);
      });
  }, [id, user]);

  const update = (field: keyof ApplicationForm, value: string | number) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const next = () => { if (step < STEPS.length - 1) { setDirection(1); setStep((s) => s + 1); } };
  const prev = () => { if (step > 0) { setDirection(-1); setStep((s) => s - 1); } };

  const handleSubmit = async () => {
    if (!user || !id) return;
    setSubmitting(true);
    const { error } = await supabase.from("applications").insert({
      bounty_id: id,
      applicant_id: user.id,
      problem_understanding: form.problemUnderstanding.trim(),
      scope_approach: form.scopeApproach.trim(),
      solution_plan: form.solutionPlan.trim(),
      needs_from_requestor: form.needsFromRequestor.trim(),
      estimated_hours: form.estimatedHours,
      estimated_cost: form.estimatedCost,
    });

    if (error) {
      toast({ title: "Failed to submit application", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Application submitted!", description: "The bounty poster will review your application." });
      navigate(`/bounties/${id}`);
    }
    setSubmitting(false);
  };

  const currentStep = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;

  if (bountyLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center items-center pt-40">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <DoodleStar className="fixed top-32 right-8 w-6 h-6 text-primary/20 animate-float hidden lg:block" />
      <DoodleSquiggle className="fixed top-1/2 left-4 w-16 text-primary/10 hidden lg:block" />

      <main className="container max-w-2xl mx-auto px-4 pt-28 pb-16">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <Link to={`/bounties/${id}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Bounty
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
            Apply to <span className="text-gradient-primary">Bounty</span>
          </h1>
          <p className="text-muted-foreground text-sm line-clamp-1 max-w-md mx-auto">{bountyTitle}</p>
        </motion.div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between mb-3">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const isActive = i === step;
              const isDone = i < step;
              return (
                <button
                  key={s.id}
                  onClick={() => { setDirection(i > step ? 1 : -1); setStep(i); }}
                  className="flex flex-col items-center gap-1"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isActive ? "border-primary bg-primary/10 text-primary scale-110"
                    : isDone ? "border-primary/50 bg-primary/5 text-primary/70"
                    : "border-border bg-secondary/50 text-muted-foreground"
                  }`}>
                    {isDone ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${
                    isActive ? "text-primary" : isDone ? "text-primary/60" : "text-muted-foreground"
                  }`}>{s.label}</span>
                </button>
              );
            })}
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <motion.div className="h-full bg-primary rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
          </div>
        </div>

        {/* Step content */}
        <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6 md:p-8 min-h-[300px]">
          <div className="flex items-center gap-2 mb-6">
            <DoodleArrow className="w-10 h-5 text-primary" />
            <span className="font-doodle text-lg text-accent">{currentStep.tagline}</span>
          </div>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div key={step} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
              {step === 0 && (
                <div className="space-y-2">
                  <Label className="text-foreground">In your own words, what is the core problem?</Label>
                  <p className="text-xs text-muted-foreground mb-2">Show the poster you truly understand their pain point and why it matters.</p>
                  <Textarea
                    placeholder="Describe what you understand the problem to be, and why it's painful for the poster..."
                    value={form.problemUnderstanding}
                    onChange={(e) => update("problemUnderstanding", e.target.value)}
                    rows={6}
                    maxLength={2000}
                  />
                </div>
              )}
              {step === 1 && (
                <div className="space-y-2">
                  <Label className="text-foreground">How would you scope this project?</Label>
                  <p className="text-xs text-muted-foreground mb-2">Break the work into phases, milestones, or deliverables. Show you can structure the work.</p>
                  <Textarea
                    placeholder="e.g. Phase 1: Data extraction pipeline. Phase 2: Integration with existing tools. Phase 3: Testing & handoff."
                    value={form.scopeApproach}
                    onChange={(e) => update("scopeApproach", e.target.value)}
                    rows={6}
                    maxLength={2000}
                  />
                </div>
              )}
              {step === 2 && (
                <div className="space-y-2">
                  <Label className="text-foreground">What's your solution approach?</Label>
                  <p className="text-xs text-muted-foreground mb-2">Tools, tech stack, methodology — how will you actually build this?</p>
                  <Textarea
                    placeholder="Describe your technical approach, tools you'd use, and why this approach is the right one..."
                    value={form.solutionPlan}
                    onChange={(e) => update("solutionPlan", e.target.value)}
                    rows={6}
                    maxLength={2000}
                  />
                </div>
              )}
              {step === 3 && (
                <div className="space-y-2">
                  <Label className="text-foreground">What do you need from the poster?</Label>
                  <p className="text-xs text-muted-foreground mb-2">Access, credentials, data, time — be specific about blockers.</p>
                  <Textarea
                    placeholder="e.g. Access to their CRM API, sample data for testing, 30-min kickoff call to clarify edge cases..."
                    value={form.needsFromRequestor}
                    onChange={(e) => update("needsFromRequestor", e.target.value)}
                    rows={6}
                    maxLength={2000}
                  />
                </div>
              )}
              {step === 4 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-foreground">Estimated hours to complete</Label>
                    <div className="flex items-center gap-3">
                      <Slider value={[form.estimatedHours]} onValueChange={([v]) => update("estimatedHours", v)} min={1} max={200} step={1} className="flex-1" />
                      <div className="flex items-center gap-1">
                        <Input
                          type="number" min={1} max={200}
                          value={form.estimatedHours}
                          onChange={(e) => update("estimatedHours", Math.min(200, Math.max(1, Number(e.target.value) || 1)))}
                          className="w-20 text-center text-primary font-bold"
                        />
                        <span className="text-sm text-muted-foreground">hrs</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Your proposed cost</Label>
                    <div className="flex items-center gap-3">
                      <Slider value={[form.estimatedCost]} onValueChange={([v]) => update("estimatedCost", v)} min={100} max={50000} step={100} className="flex-1" />
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                        <Input
                          type="number" min={100} max={50000} step={100}
                          value={form.estimatedCost}
                          onChange={(e) => update("estimatedCost", Math.min(50000, Math.max(100, Number(e.target.value) || 100)))}
                          className="w-28 pl-7 text-accent font-bold"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button variant="ghost" onClick={prev} disabled={step === 0} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={next} className="gap-2 glow-primary">
              Next <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={submitting} className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90 glow-bounty">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              Submit Application
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default ApplyBounty;
