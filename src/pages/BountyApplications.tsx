import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  ArrowLeft,
  Loader2,
  Brain,
  Crosshair,
  Wrench,
  MessageSquare,
  Clock,
  DollarSign,
  CheckCircle2,
  XCircle,
  CalendarIcon,
  Mail,
  FileText,
  Handshake,
} from "lucide-react";

interface Application {
  id: string;
  bounty_id: string;
  applicant_id: string;
  problem_understanding: string;
  scope_approach: string;
  solution_plan: string;
  needs_from_requestor: string;
  estimated_hours: number;
  estimated_cost: number;
  status: string;
  created_at: string;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

const BountyApplications = () => {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [bounty, setBounty] = useState<{ title: string; user_id: string; bounty_amount: number } | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Schedule call state
  const [schedulingFor, setSchedulingFor] = useState<string | null>(null);
  const [callDate, setCallDate] = useState<Date | undefined>();
  const [callNotes, setCallNotes] = useState("");
  const [scheduling, setScheduling] = useState(false);

  // Agreement state
  const [creatingAgreementFor, setCreatingAgreementFor] = useState<Application | null>(null);
  const [agreedScope, setAgreedScope] = useState("");
  const [agreedAmount, setAgreedAmount] = useState(0);
  const [agreedTimeline, setAgreedTimeline] = useState("");
  const [creatingAgreement, setCreatingAgreement] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth", { state: { returnTo: `/bounties/${id}/applications` } });
    }
  }, [user, authLoading, navigate, id]);

  useEffect(() => {
    if (!id || !user) return;
    const load = async () => {
      const { data: b } = await supabase.from("bounties").select("title, user_id, bounty_amount").eq("id", id).single();
      if (!b || b.user_id !== user.id) {
        navigate("/bounties");
        return;
      }
      setBounty(b);

      const { data: apps } = await supabase
        .from("applications")
        .select("*")
        .eq("bounty_id", id)
        .order("created_at", { ascending: false });
      setApplications(apps || []);
      setLoading(false);
    };
    load();
  }, [id, user]);

  const updateStatus = async (appId: string, status: string) => {
    const { error } = await supabase.from("applications").update({ status }).eq("id", appId);
    if (error) {
      toast({ title: "Error updating", variant: "destructive" });
    } else {
      setApplications((prev) => prev.map((a) => (a.id === appId ? { ...a, status } : a)));
      toast({ title: `Application ${status}` });
    }
  };

  const scheduleCall = async (app: Application) => {
    if (!callDate || !user || !id) return;
    setScheduling(true);
    const { error } = await supabase.from("scheduled_calls").insert({
      application_id: app.id,
      bounty_id: id,
      poster_id: user.id,
      applicant_id: app.applicant_id,
      scheduled_at: callDate.toISOString(),
      notes: callNotes.trim() || null,
    });
    if (error) {
      toast({ title: "Failed to schedule call", variant: "destructive" });
    } else {
      toast({ title: "Call scheduled!" });
      setSchedulingFor(null);
      setCallDate(undefined);
      setCallNotes("");
    }
    setScheduling(false);
  };

  const createAgreement = async () => {
    if (!creatingAgreementFor || !user || !id) return;
    setCreatingAgreement(true);
    const { error } = await supabase.from("agreements").insert({
      application_id: creatingAgreementFor.id,
      bounty_id: id,
      poster_id: user.id,
      applicant_id: creatingAgreementFor.applicant_id,
      agreed_scope: agreedScope.trim(),
      agreed_amount: agreedAmount,
      agreed_timeline: agreedTimeline.trim(),
      poster_accepted: true,
    });
    if (error) {
      toast({ title: "Failed to create agreement", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Agreement created!", description: "The applicant will be notified to review and accept." });
      await updateStatus(creatingAgreementFor.id, "accepted");
      setCreatingAgreementFor(null);
    }
    setCreatingAgreement(false);
  };

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container max-w-3xl mx-auto px-4 pt-28 pb-16">
        <Link to={`/bounties/${id}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Bounty
        </Link>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-1">Applications</h1>
          <p className="text-muted-foreground text-sm">{bounty?.title}</p>
          <p className="text-muted-foreground text-xs mt-1">{applications.length} application{applications.length !== 1 ? "s" : ""} received</p>
        </motion.div>

        {applications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No applications yet. Share your bounty to attract builders!
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {applications.map((app, i) => (
              <motion.div key={app.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="hover:border-primary/20 transition-colors">
                  <CardHeader className="cursor-pointer" onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-base">Application #{i + 1}</CardTitle>
                        <Badge variant={app.status === "pending" ? "secondary" : app.status === "accepted" ? "default" : "destructive"} className="capitalize">
                          {app.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{app.estimated_hours}h</span>
                        <span className="flex items-center gap-1 text-accent font-bold"><DollarSign className="w-3 h-3" />{formatCurrency(app.estimated_cost)}</span>
                      </div>
                    </div>
                  </CardHeader>

                  {expandedId === app.id && (
                    <CardContent className="space-y-5 border-t border-border pt-5">
                      <Section icon={Brain} label="Problem Understanding" text={app.problem_understanding} />
                      <Section icon={Crosshair} label="Scope & Approach" text={app.scope_approach} />
                      <Section icon={Wrench} label="Solution Plan" text={app.solution_plan} />
                      <Section icon={MessageSquare} label="Needs from You" text={app.needs_from_requestor} />

                      {app.status === "pending" && (
                        <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                          <Button size="sm" className="gap-1" onClick={() => {
                            setCreatingAgreementFor(app);
                            setAgreedAmount(app.estimated_cost);
                            setAgreedScope(app.scope_approach);
                            setAgreedTimeline(`${app.estimated_hours} hours`);
                          }}>
                            <Handshake className="w-3 h-3" /> Create Agreement
                          </Button>
                          <Button size="sm" variant="outline" className="gap-1" onClick={() => setSchedulingFor(schedulingFor === app.id ? null : app.id)}>
                            <CalendarIcon className="w-3 h-3" /> Schedule Call
                          </Button>
                          <Button size="sm" variant="ghost" className="gap-1 text-destructive" onClick={() => updateStatus(app.id, "rejected")}>
                            <XCircle className="w-3 h-3" /> Decline
                          </Button>
                        </div>
                      )}

                      {/* Schedule call inline */}
                      {schedulingFor === app.id && (
                        <div className="p-4 rounded-lg border border-border bg-secondary/30 space-y-3">
                          <Label className="text-foreground text-sm font-semibold">Schedule a Call</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className={cn("w-full justify-start text-left", !callDate && "text-muted-foreground")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {callDate ? format(callDate, "PPP") : "Pick a date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar mode="single" selected={callDate} onSelect={setCallDate} disabled={(d) => d < new Date()} className={cn("p-3 pointer-events-auto")} />
                            </PopoverContent>
                          </Popover>
                          <Textarea placeholder="Notes for the call (optional)" value={callNotes} onChange={(e) => setCallNotes(e.target.value)} rows={2} maxLength={500} />
                          <Button size="sm" onClick={() => scheduleCall(app)} disabled={!callDate || scheduling}>
                            {scheduling ? <Loader2 className="w-3 h-3 animate-spin" /> : "Confirm"}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Agreement creation modal (inline) */}
        {creatingAgreementFor && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
            <Card className="w-full max-w-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Handshake className="w-5 h-5 text-primary" /> Create Agreement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Agreed Scope of Work</Label>
                  <Textarea value={agreedScope} onChange={(e) => setAgreedScope(e.target.value)} rows={4} maxLength={3000} />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Agreed Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                    <Input type="number" min={0} max={100000} value={agreedAmount} onChange={(e) => setAgreedAmount(Number(e.target.value) || 0)} className="pl-7 text-accent font-bold" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Agreed Timeline</Label>
                  <Input value={agreedTimeline} onChange={(e) => setAgreedTimeline(e.target.value)} placeholder="e.g. 2 weeks, 40 hours" maxLength={200} />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button onClick={createAgreement} disabled={creatingAgreement || !agreedScope.trim() || agreedAmount <= 0 || !agreedTimeline.trim()} className="gap-1">
                    {creatingAgreement ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    Send Agreement
                  </Button>
                  <Button variant="ghost" onClick={() => setCreatingAgreementFor(null)}>Cancel</Button>
                </div>
                <p className="text-xs text-muted-foreground">The applicant will need to accept this agreement before work begins.</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  );
};

const Section = ({ icon: Icon, label, text }: { icon: React.ElementType; label: string; text: string }) => (
  <div className="space-y-1.5">
    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
      <Icon className="w-3.5 h-3.5" /> {label}
    </div>
    <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{text}</p>
  </div>
);

export default BountyApplications;
