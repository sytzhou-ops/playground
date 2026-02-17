import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  Clock,
  DollarSign,
  ArrowRight,
  CheckCircle2,
  Handshake,
} from "lucide-react";

interface AppWithBounty {
  id: string;
  bounty_id: string;
  status: string;
  estimated_hours: number;
  estimated_cost: number;
  created_at: string;
  bounties: { title: string } | null;
}

interface Agreement {
  id: string;
  application_id: string;
  agreed_scope: string;
  agreed_amount: number;
  agreed_timeline: string;
  poster_accepted: boolean;
  applicant_accepted: boolean;
  status: string;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

const MyApplications = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [apps, setApps] = useState<AppWithBounty[]>([]);
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth", { state: { returnTo: "/my-applications" } });
  }, [user, authLoading]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase
        .from("applications")
        .select("id, bounty_id, status, estimated_hours, estimated_cost, created_at, bounties(title)")
        .eq("applicant_id", user.id)
        .order("created_at", { ascending: false });
      setApps((data as AppWithBounty[]) || []);

      const { data: agrs } = await supabase
        .from("agreements")
        .select("*")
        .eq("applicant_id", user.id);
      setAgreements(agrs || []);
      setLoading(false);
    };
    load();
  }, [user]);

  const acceptAgreement = async (agr: Agreement) => {
    const { error } = await supabase.from("agreements").update({ applicant_accepted: true, status: "active" }).eq("id", agr.id);
    if (error) {
      toast({ title: "Error", variant: "destructive" });
    } else {
      setAgreements((prev) => prev.map((a) => a.id === agr.id ? { ...a, applicant_accepted: true, status: "active" } : a));
      toast({ title: "Agreement accepted! Work can begin." });
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-background"><Navbar /><div className="flex justify-center pt-40"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container max-w-3xl mx-auto px-4 pt-28 pb-16">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-1">My Applications</h1>
          <p className="text-muted-foreground text-sm">{apps.length} application{apps.length !== 1 ? "s" : ""}</p>
        </motion.div>

        {apps.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <p className="mb-4">You haven't applied to any bounties yet.</p>
              <Link to="/bounties"><Button variant="outline" className="gap-2">Browse Bounties <ArrowRight className="w-4 h-4" /></Button></Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {apps.map((app, i) => {
              const agr = agreements.find((a) => a.application_id === app.id);
              return (
                <motion.div key={app.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Link to={`/bounties/${app.bounty_id}`} className="hover:underline">
                          <CardTitle className="text-base">{app.bounties?.title || "Bounty"}</CardTitle>
                        </Link>
                        <Badge variant={app.status === "pending" ? "secondary" : app.status === "accepted" ? "default" : "destructive"} className="capitalize">
                          {app.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{app.estimated_hours}h</span>
                        <span className="flex items-center gap-1 text-accent font-bold"><DollarSign className="w-3 h-3" />{formatCurrency(app.estimated_cost)}</span>
                      </div>

                      {agr && (
                        <div className="p-3 rounded-lg border border-border bg-secondary/30 space-y-2">
                          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                            <Handshake className="w-4 h-4 text-primary" /> Agreement
                            <Badge variant={agr.status === "active" ? "default" : "secondary"} className="capitalize ml-auto">{agr.status}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">Scope: {agr.agreed_scope.slice(0, 100)}...</p>
                          <p className="text-xs text-muted-foreground">Amount: <span className="text-accent font-bold">{formatCurrency(agr.agreed_amount)}</span> · Timeline: {agr.agreed_timeline}</p>
                          {!agr.applicant_accepted && agr.poster_accepted && (
                            <Button size="sm" className="gap-1 mt-2" onClick={() => acceptAgreement(agr)}>
                              <CheckCircle2 className="w-3 h-3" /> Accept Agreement
                            </Button>
                          )}
                        </div>
                      )}
                    </CardContent>
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

export default MyApplications;
