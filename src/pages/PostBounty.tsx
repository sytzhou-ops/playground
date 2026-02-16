import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DoodleStar, DoodleSquiggle, DoodleArrow } from "@/components/DoodleElements";
import Navbar from "@/components/Navbar";
import { ArrowLeft, ArrowRight, CheckCircle, DollarSign, Clock, FileText, AlertTriangle, Target } from "lucide-react";

const STEPS = [
  { id: "context", label: "Context", icon: FileText, tagline: "What's broken?" },
  { id: "pain", label: "Pain", icon: AlertTriangle, tagline: "How much is it costing you?" },
  { id: "request", label: "Request", icon: Target, tagline: "What do you want built?" },
  { id: "bounty", label: "Bounty", icon: DollarSign, tagline: "Name your price" },
  { id: "timeline", label: "Timeline", icon: Clock, tagline: "When do you need it?" },
];

interface BountyFormData {
  // Context
  title: string;
  industry: string;
  problemDescription: string;
  currentProcess: string;
  // Pain
  painFrequency: string;
  hoursWasted: number;
  annualCost: number;
  painDescription: string;
  // Request
  desiredOutcome: string;
  acceptanceCriteria: string;
  toolPreferences: string;
  // Bounty
  bountyAmount: number;
  paymentStructure: string;
  // Timeline
  urgency: string;
  deadline: string;
  additionalNotes: string;
}

const initialFormData: BountyFormData = {
  title: "",
  industry: "",
  problemDescription: "",
  currentProcess: "",
  painFrequency: "",
  hoursWasted: 5,
  annualCost: 5000,
  painDescription: "",
  desiredOutcome: "",
  acceptanceCriteria: "",
  toolPreferences: "",
  bountyAmount: 2500,
  paymentStructure: "milestone",
  urgency: "",
  deadline: "",
  additionalNotes: "",
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -300 : 300, opacity: 0 }),
};

const PostBounty = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState<BountyFormData>(initialFormData);

  const update = (field: keyof BountyFormData, value: string | number) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const next = () => {
    if (step < STEPS.length - 1) {
      setDirection(1);
      setStep((s) => s + 1);
    }
  };

  const prev = () => {
    if (step > 0) {
      setDirection(-1);
      setStep((s) => s - 1);
    }
  };

  const handleSubmit = () => {
    // For now, just log and navigate back
    console.log("Bounty submitted:", formData);
    navigate("/");
  };

  const currentStep = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Decorative doodles */}
      <DoodleStar className="fixed top-32 right-8 w-6 h-6 text-primary/20 animate-float hidden lg:block" />
      <DoodleStar className="fixed bottom-20 left-12 w-8 h-8 text-accent/20 animate-float hidden lg:block" style={{ animationDelay: "1s" }} />
      <DoodleSquiggle className="fixed top-1/2 left-4 w-16 text-primary/10 hidden lg:block" />

      <main className="container max-w-2xl mx-auto px-4 pt-28 pb-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
            Post a <span className="text-gradient-primary">Bounty</span>
          </h1>
          <p className="text-muted-foreground font-doodle text-xl">turn your pain into opportunity</p>
        </motion.div>

        {/* Progress bar */}
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
                  className="flex flex-col items-center gap-1 group"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      isActive
                        ? "border-primary bg-primary/10 text-primary scale-110"
                        : isDone
                        ? "border-primary/50 bg-primary/5 text-primary/70"
                        : "border-border bg-secondary/50 text-muted-foreground"
                    }`}
                  >
                    {isDone ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span
                    className={`text-xs font-medium hidden sm:block transition-colors ${
                      isActive ? "text-primary" : isDone ? "text-primary/60" : "text-muted-foreground"
                    }`}
                  >
                    {s.label}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Step content */}
        <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6 md:p-8 min-h-[420px]">
          {/* Step tagline */}
          <div className="flex items-center gap-2 mb-6">
            <DoodleArrow className="w-10 h-5 text-primary" />
            <span className="font-doodle text-lg text-accent">{currentStep.tagline}</span>
          </div>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {step === 0 && <StepContext formData={formData} update={update} />}
              {step === 1 && <StepPain formData={formData} update={update} />}
              {step === 2 && <StepRequest formData={formData} update={update} />}
              {step === 3 && <StepBounty formData={formData} update={update} />}
              {step === 4 && <StepTimeline formData={formData} update={update} />}
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
            <Button onClick={handleSubmit} className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90 glow-bounty">
              <CheckCircle className="w-4 h-4" /> Submit Bounty
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

/* ── Step Components ────────────────────────── */

interface StepProps {
  formData: BountyFormData;
  update: (field: keyof BountyFormData, value: string | number) => void;
}

const fieldClass = "space-y-2";

const StepContext = ({ formData, update }: StepProps) => (
  <div className="space-y-5">
    <div className={fieldClass}>
      <Label htmlFor="title" className="text-foreground">Bounty Title</Label>
      <Input
        id="title"
        placeholder="e.g. Automate invoice processing for my Shopify store"
        value={formData.title}
        onChange={(e) => update("title", e.target.value)}
        maxLength={120}
      />
    </div>
    <div className={fieldClass}>
      <Label htmlFor="industry" className="text-foreground">Industry / Domain</Label>
      <Select value={formData.industry} onValueChange={(v) => update("industry", v)}>
        <SelectTrigger>
          <SelectValue placeholder="Select your industry" />
        </SelectTrigger>
        <SelectContent>
          {["E-commerce", "Healthcare", "Real Estate", "Finance", "Legal", "Marketing", "Operations", "HR / Recruiting", "Logistics", "Other"].map(
            (ind) => (
              <SelectItem key={ind} value={ind.toLowerCase()}>
                {ind}
              </SelectItem>
            )
          )}
        </SelectContent>
      </Select>
    </div>
    <div className={fieldClass}>
      <Label htmlFor="problemDescription" className="text-foreground">Describe the problem</Label>
      <Textarea
        id="problemDescription"
        placeholder="Walk us through the workflow that's causing you pain. Be specific — what tools, people, or steps are involved?"
        value={formData.problemDescription}
        onChange={(e) => update("problemDescription", e.target.value)}
        rows={4}
        maxLength={2000}
      />
    </div>
    <div className={fieldClass}>
      <Label htmlFor="currentProcess" className="text-foreground">Current process (optional)</Label>
      <Textarea
        id="currentProcess"
        placeholder="How do you currently handle this? Manual spreadsheets, copy-paste, etc."
        value={formData.currentProcess}
        onChange={(e) => update("currentProcess", e.target.value)}
        rows={2}
        maxLength={1000}
      />
    </div>
  </div>
);

const StepPain = ({ formData, update }: StepProps) => (
  <div className="space-y-5">
    <div className={fieldClass}>
      <Label className="text-foreground">How often does this problem occur?</Label>
      <RadioGroup value={formData.painFrequency} onValueChange={(v) => update("painFrequency", v)} className="grid grid-cols-2 gap-3 pt-1">
        {["Multiple times daily", "Daily", "Weekly", "Monthly"].map((freq) => (
          <label
            key={freq}
            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
              formData.painFrequency === freq.toLowerCase().replace(/ /g, "-")
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/30"
            }`}
          >
            <RadioGroupItem value={freq.toLowerCase().replace(/ /g, "-")} />
            <span className="text-sm text-foreground">{freq}</span>
          </label>
        ))}
      </RadioGroup>
    </div>
    <div className={fieldClass}>
      <Label className="text-foreground">Hours wasted per week: <span className="text-primary font-bold">{formData.hoursWasted}h</span></Label>
      <Slider
        value={[formData.hoursWasted]}
        onValueChange={([v]) => update("hoursWasted", v)}
        min={1}
        max={40}
        step={1}
        className="pt-2"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>1h</span>
        <span>40h</span>
      </div>
    </div>
    <div className={fieldClass}>
      <Label className="text-foreground">
        Estimated annual cost of this problem:{" "}
        <span className="text-accent font-bold">{formatCurrency(formData.annualCost)}</span>
      </Label>
      <Slider
        value={[formData.annualCost]}
        onValueChange={([v]) => update("annualCost", v)}
        min={1000}
        max={500000}
        step={1000}
        className="pt-2"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>$1K</span>
        <span>$500K</span>
      </div>
    </div>
    <div className={fieldClass}>
      <Label htmlFor="painDescription" className="text-foreground">What's the real impact? (optional)</Label>
      <Textarea
        id="painDescription"
        placeholder="Lost revenue, missed deadlines, employee burnout..."
        value={formData.painDescription}
        onChange={(e) => update("painDescription", e.target.value)}
        rows={2}
        maxLength={1000}
      />
    </div>
  </div>
);

const StepRequest = ({ formData, update }: StepProps) => (
  <div className="space-y-5">
    <div className={fieldClass}>
      <Label htmlFor="desiredOutcome" className="text-foreground">What does success look like?</Label>
      <Textarea
        id="desiredOutcome"
        placeholder="Describe the ideal end state. e.g. 'Invoices are automatically extracted from emails, matched to POs, and posted to QuickBooks.'"
        value={formData.desiredOutcome}
        onChange={(e) => update("desiredOutcome", e.target.value)}
        rows={4}
        maxLength={2000}
      />
    </div>
    <div className={fieldClass}>
      <Label htmlFor="acceptanceCriteria" className="text-foreground">Acceptance criteria</Label>
      <Textarea
        id="acceptanceCriteria"
        placeholder="How will you know it works? List specific conditions. e.g. '95% accuracy on invoice extraction, handles 200+ invoices/month'"
        value={formData.acceptanceCriteria}
        onChange={(e) => update("acceptanceCriteria", e.target.value)}
        rows={3}
        maxLength={2000}
      />
    </div>
    <div className={fieldClass}>
      <Label htmlFor="toolPreferences" className="text-foreground">Tool / platform preferences (optional)</Label>
      <Input
        id="toolPreferences"
        placeholder="e.g. Must integrate with Zapier, Google Sheets, Slack"
        value={formData.toolPreferences}
        onChange={(e) => update("toolPreferences", e.target.value)}
        maxLength={500}
      />
    </div>
  </div>
);

const StepBounty = ({ formData, update }: StepProps) => (
  <div className="space-y-6">
    <div className={fieldClass}>
      <Label className="text-foreground">
        Bounty amount:{" "}
        <span className="text-2xl text-accent font-bold">{formatCurrency(formData.bountyAmount)}</span>
      </Label>
      <Slider
        value={[formData.bountyAmount]}
        onValueChange={([v]) => update("bountyAmount", v)}
        min={500}
        max={50000}
        step={250}
        className="pt-2"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>$500</span>
        <span>$50,000</span>
      </div>
    </div>

    {/* Quick-pick amounts */}
    <div className="flex flex-wrap gap-2">
      {[1000, 2500, 5000, 10000, 25000].map((amount) => (
        <button
          key={amount}
          onClick={() => update("bountyAmount", amount)}
          className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
            formData.bountyAmount === amount
              ? "border-accent bg-accent/10 text-accent"
              : "border-border text-muted-foreground hover:border-accent/40"
          }`}
        >
          {formatCurrency(amount)}
        </button>
      ))}
    </div>

    <div className={fieldClass}>
      <Label className="text-foreground">Payment structure</Label>
      <RadioGroup value={formData.paymentStructure} onValueChange={(v) => update("paymentStructure", v)} className="space-y-2 pt-1">
        {[
          { value: "milestone", label: "Milestone-based", desc: "Pay in stages as deliverables are met" },
          { value: "completion", label: "On completion", desc: "Full payment when the project is done" },
          { value: "escrow", label: "Escrow", desc: "Funds held securely, released on approval" },
        ].map((opt) => (
          <label
            key={opt.value}
            className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
              formData.paymentStructure === opt.value
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/30"
            }`}
          >
            <RadioGroupItem value={opt.value} className="mt-0.5" />
            <div>
              <span className="text-sm font-medium text-foreground">{opt.label}</span>
              <p className="text-xs text-muted-foreground">{opt.desc}</p>
            </div>
          </label>
        ))}
      </RadioGroup>
    </div>
  </div>
);

const StepTimeline = ({ formData, update }: StepProps) => (
  <div className="space-y-5">
    <div className={fieldClass}>
      <Label className="text-foreground">How urgent is this?</Label>
      <RadioGroup value={formData.urgency} onValueChange={(v) => update("urgency", v)} className="grid grid-cols-2 gap-3 pt-1">
        {[
          { value: "asap", label: "🔥 ASAP", desc: "Within days" },
          { value: "soon", label: "⚡ Soon", desc: "Within 2 weeks" },
          { value: "normal", label: "📅 Normal", desc: "Within a month" },
          { value: "flexible", label: "🌊 Flexible", desc: "No rush" },
        ].map((opt) => (
          <label
            key={opt.value}
            className={`flex flex-col items-center gap-1 p-4 rounded-lg border cursor-pointer text-center transition-all ${
              formData.urgency === opt.value
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/30"
            }`}
          >
            <RadioGroupItem value={opt.value} className="sr-only" />
            <span className="text-lg">{opt.label.split(" ")[0]}</span>
            <span className="text-sm font-medium text-foreground">{opt.label.split(" ").slice(1).join(" ")}</span>
            <span className="text-xs text-muted-foreground">{opt.desc}</span>
          </label>
        ))}
      </RadioGroup>
    </div>
    <div className={fieldClass}>
      <Label htmlFor="deadline" className="text-foreground">Hard deadline (optional)</Label>
      <Input
        id="deadline"
        type="date"
        value={formData.deadline}
        onChange={(e) => update("deadline", e.target.value)}
      />
    </div>
    <div className={fieldClass}>
      <Label htmlFor="additionalNotes" className="text-foreground">Anything else we should know?</Label>
      <Textarea
        id="additionalNotes"
        placeholder="Budget flexibility, team size, preferred communication style..."
        value={formData.additionalNotes}
        onChange={(e) => update("additionalNotes", e.target.value)}
        rows={3}
        maxLength={1000}
      />
    </div>
  </div>
);

export default PostBounty;
