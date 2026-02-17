import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useHunterProfile } from "@/hooks/useHunterProfile";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { DoodleStar, DoodleArrow, DoodleSquiggle } from "@/components/DoodleElements";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Loader2,
  User,
  Briefcase,
  Link2,
  Upload,
  Award,
  Clock,
  Shield,
  Sparkles,
  Github,
  Linkedin,
  Globe,
} from "lucide-react";

const EXPERTISE_OPTIONS = [
  "AI / Machine Learning",
  "Process Automation",
  "Data Engineering",
  "Full-Stack Development",
  "API Integrations",
  "No-Code / Low-Code",
  "DevOps / Infrastructure",
  "NLP / LLMs",
  "Computer Vision",
  "Workflow Optimization",
];

const STEPS = [
  { id: "info", label: "About You", icon: User },
  { id: "expertise", label: "Expertise", icon: Briefcase },
  { id: "links", label: "Portfolio", icon: Link2 },
  { id: "experience", label: "Experience", icon: Award },
];

interface HunterForm {
  fullName: string;
  title: string;
  bio: string;
  yearsExperience: number;
  expertiseAreas: string[];
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  certifications: string;
  pastProjects: string;
  resumeFile: File | null;
}

const initialForm: HunterForm = {
  fullName: "",
  title: "",
  bio: "",
  yearsExperience: 1,
  expertiseAreas: [],
  linkedinUrl: "",
  githubUrl: "",
  portfolioUrl: "",
  certifications: "",
  pastProjects: "",
  resumeFile: null,
};

const BecomeHunter = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { status: hunterStatus } = useHunterProfile();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [form, setForm] = useState<HunterForm>(initialForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth", { state: { returnTo: "/become-hunter" } });
    }
  }, [user, authLoading, navigate]);

  // Redirect if already applied
  useEffect(() => {
    if (hunterStatus === "pending") {
      navigate("/hunter-status");
    } else if (hunterStatus === "approved") {
      toast({ title: "You're already an approved hunter!" });
      navigate("/bounties");
    }
  }, [hunterStatus, navigate, toast]);

  const update = <K extends keyof HunterForm>(field: K, value: HunterForm[K]) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const toggleExpertise = (area: string) => {
    setForm((prev) => ({
      ...prev,
      expertiseAreas: prev.expertiseAreas.includes(area)
        ? prev.expertiseAreas.filter((a) => a !== area)
        : [...prev.expertiseAreas, area],
    }));
  };

  const next = () => {
    if (step < STEPS.length - 1) { setDirection(1); setStep((s) => s + 1); }
  };
  const prev = () => {
    if (step > 0) { setDirection(-1); setStep((s) => s - 1); }
  };

  const canProceed = () => {
    switch (step) {
      case 0: return form.fullName.trim() && form.title.trim() && form.bio.trim();
      case 1: return form.expertiseAreas.length > 0;
      case 2: return true; // links optional
      case 3: return form.pastProjects.trim();
      default: return false;
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    setSubmitting(true);

    try {
      // Upload resume if provided
      let resumePath: string | null = null;
      if (form.resumeFile) {
        const ext = form.resumeFile.name.split(".").pop();
        const path = `${user.id}/resume.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("resumes")
          .upload(path, form.resumeFile, { upsert: true });
        if (uploadError) throw uploadError;
        resumePath = path;
      }

      const { error } = await supabase.from("hunter_profiles").insert({
        user_id: user.id,
        full_name: form.fullName.trim(),
        title: form.title.trim(),
        bio: form.bio.trim(),
        years_experience: form.yearsExperience,
        expertise_areas: form.expertiseAreas,
        linkedin_url: form.linkedinUrl.trim() || null,
        github_url: form.githubUrl.trim() || null,
        portfolio_url: form.portfolioUrl.trim() || null,
        resume_path: resumePath,
        certifications: form.certifications.trim() || null,
        past_projects: form.pastProjects.trim(),
      });

      if (error) throw error;

      // Trigger AI screening
      try {
        await supabase.functions.invoke("screen-hunter", {
          body: { userId: user.id },
        });
      } catch {
        // Non-blocking — admin can still review manually
      }

      toast({ title: "Application submitted!", description: "We'll review your profile and get back to you." });
      navigate("/hunter-status");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  if (authLoading || hunterStatus === "loading") {
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
      <DoodleSquiggle className="fixed bottom-20 left-10 w-24 text-accent/10 hidden lg:block" />

      <div className="container mx-auto px-4 pt-28 pb-16 max-w-2xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <Shield className="w-6 h-6 text-primary" />
            <Badge variant="outline" className="border-primary/30 text-primary font-doodle text-sm">
              Vetted Experts Only
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
            Become a <span className="text-gradient-primary">Bounty Hunter</span>
          </h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Join our network of vetted AI experts, automation specialists, and tech professionals.
          </p>
        </motion.div>

        {/* Progress steps */}
        <div className="mb-8">
          <div className="flex justify-between mb-3">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const isActive = i === step;
              const isDone = i < step;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    if (i < step) { setDirection(-1); setStep(i); }
                  }}
                  className="flex flex-col items-center gap-1"
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
                    className={`text-xs font-medium hidden sm:block ${
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
            <motion.div className="h-full bg-primary rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
          </div>
        </div>

        {/* Step content */}
        <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6 md:p-8 min-h-[340px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {step === 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DoodleArrow className="w-10 h-5 text-primary" />
                    <span className="font-doodle text-lg text-accent">Tell us about yourself</span>
                  </div>
                  <div className="space-y-2">
                    <Label>Full Name *</Label>
                    <Input
                      placeholder="Jane Smith"
                      value={form.fullName}
                      onChange={(e) => update("fullName", e.target.value)}
                      maxLength={100}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Professional Title *</Label>
                    <Input
                      placeholder="e.g. Senior ML Engineer, Automation Specialist"
                      value={form.title}
                      onChange={(e) => update("title", e.target.value)}
                      maxLength={100}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Bio *</Label>
                    <p className="text-xs text-muted-foreground">Brief summary of who you are and what you do.</p>
                    <Textarea
                      placeholder="I'm a Full-Stack AI engineer with 8 years of experience building automation solutions..."
                      value={form.bio}
                      onChange={(e) => update("bio", e.target.value)}
                      rows={4}
                      maxLength={1000}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Years of Experience</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        type="number"
                        min={0}
                        max={50}
                        value={form.yearsExperience}
                        onChange={(e) => update("yearsExperience", parseInt(e.target.value) || 0)}
                        className="w-24"
                      />
                      <span className="text-sm text-muted-foreground">years</span>
                    </div>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DoodleArrow className="w-10 h-5 text-primary" />
                    <span className="font-doodle text-lg text-accent">Your areas of expertise</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Select all that apply. You must select at least one.</p>
                  <div className="flex flex-wrap gap-2">
                    {EXPERTISE_OPTIONS.map((area) => {
                      const selected = form.expertiseAreas.includes(area);
                      return (
                        <button
                          key={area}
                          onClick={() => toggleExpertise(area)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                            selected
                              ? "bg-primary/10 border-primary/50 text-primary"
                              : "bg-secondary/50 border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                          }`}
                        >
                          {selected && <CheckCircle className="w-3.5 h-3.5 inline mr-1.5" />}
                          {area}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DoodleArrow className="w-10 h-5 text-primary" />
                    <span className="font-doodle text-lg text-accent">Show your work</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Add links so we can verify your expertise. At least one link is recommended.</p>
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label className="flex items-center gap-1.5"><Linkedin className="w-3.5 h-3.5" /> LinkedIn</Label>
                      <Input
                        placeholder="https://linkedin.com/in/yourname"
                        value={form.linkedinUrl}
                        onChange={(e) => update("linkedinUrl", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="flex items-center gap-1.5"><Github className="w-3.5 h-3.5" /> GitHub</Label>
                      <Input
                        placeholder="https://github.com/yourname"
                        value={form.githubUrl}
                        onChange={(e) => update("githubUrl", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Portfolio / Website</Label>
                      <Input
                        placeholder="https://yoursite.com"
                        value={form.portfolioUrl}
                        onChange={(e) => update("portfolioUrl", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 pt-2">
                    <Label className="flex items-center gap-1.5"><Upload className="w-3.5 h-3.5" /> Resume / CV (optional)</Label>
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => update("resumeFile", e.target.files?.[0] || null)}
                      className="file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:text-xs file:font-medium"
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DoodleArrow className="w-10 h-5 text-primary" />
                    <span className="font-doodle text-lg text-accent">Prove your chops</span>
                  </div>
                  <div className="space-y-2">
                    <Label>Relevant Certifications</Label>
                    <p className="text-xs text-muted-foreground">AWS, GCP, Azure, Coursera, etc.</p>
                    <Textarea
                      placeholder="e.g. AWS Solutions Architect, Google Cloud ML Engineer, Stanford ML Specialization..."
                      value={form.certifications}
                      onChange={(e) => update("certifications", e.target.value)}
                      rows={3}
                      maxLength={1000}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Past Projects & References *</Label>
                    <p className="text-xs text-muted-foreground">Describe 2-3 relevant projects you've shipped. Include outcomes.</p>
                    <Textarea
                      placeholder="1. Built an automated invoice processing pipeline for a $50M logistics company, reducing manual work by 80%&#10;2. Developed a custom GPT-powered support agent handling 2,000+ tickets/month..."
                      value={form.pastProjects}
                      onChange={(e) => update("pastProjects", e.target.value)}
                      rows={6}
                      maxLength={3000}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={prev} disabled={step === 0} className="gap-1">
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
            {step < STEPS.length - 1 ? (
              <Button onClick={next} disabled={!canProceed()} className="gap-1">
                Next <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={!canProceed() || submitting} className="gap-2">
                {submitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                ) : (
                  <><Sparkles className="w-4 h-4" /> Submit Application</>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Info box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-4 rounded-xl border border-border bg-card/50 text-center"
        >
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-primary" /> AI-screened</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-accent" /> 24-48h review</span>
            <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-primary" /> Manual approval</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BecomeHunter;
