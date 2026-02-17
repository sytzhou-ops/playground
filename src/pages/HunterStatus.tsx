import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useHunterProfile } from "@/hooks/useHunterProfile";
import Navbar from "@/components/Navbar";
import { DoodleStar, DoodleSquiggle } from "@/components/DoodleElements";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  CheckCircle,
  XCircle,
  Shield,
  ArrowRight,
  Loader2,
  Sparkles,
  Eye,
  Star,
} from "lucide-react";

const HunterStatus = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, status } = useHunterProfile();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth", { state: { returnTo: "/hunter-status" } });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (status === "none") {
      navigate("/become-hunter");
    }
  }, [status, navigate]);

  if (authLoading || status === "loading") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center items-center pt-40">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  const statusConfig = {
    pending: {
      icon: Clock,
      color: "text-accent",
      bgColor: "bg-accent/10 border-accent/20",
      badge: "Under Review",
      title: "Your application is being reviewed",
      description: "Our team is reviewing your profile. This typically takes 24-48 hours. You'll be notified once a decision is made.",
    },
    approved: {
      icon: CheckCircle,
      color: "text-primary",
      bgColor: "bg-primary/10 border-primary/20",
      badge: "Approved",
      title: "You're a verified Bounty Hunter!",
      description: "You can now browse and apply to bounties. Go find some problems to solve!",
    },
    rejected: {
      icon: XCircle,
      color: "text-destructive",
      bgColor: "bg-destructive/10 border-destructive/20",
      badge: "Not Approved",
      title: "Application not approved",
      description: "Unfortunately, your application didn't meet our requirements at this time. You're welcome to reapply with updated credentials.",
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig];
  if (!config) return null;

  const StatusIcon = config.icon;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <DoodleStar className="fixed top-32 right-8 w-6 h-6 text-primary/20 animate-float hidden lg:block" />
      <DoodleSquiggle className="fixed bottom-20 left-10 w-24 text-accent/10 hidden lg:block" />

      <div className="container mx-auto px-4 pt-28 pb-16 max-w-lg">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          {/* Status icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className={`w-20 h-20 rounded-full ${config.bgColor} border flex items-center justify-center mx-auto mb-6`}
          >
            <StatusIcon className={`w-10 h-10 ${config.color}`} />
          </motion.div>

          <Badge variant="outline" className={`mb-4 ${config.color} border-current/30`}>
            {config.badge}
          </Badge>

          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-3">
            {config.title}
          </h1>
          <p className="text-muted-foreground text-sm mb-8 max-w-sm mx-auto">
            {config.description}
          </p>

          {/* Profile summary */}
          {profile && (
            <div className="bg-card border border-border rounded-xl p-5 text-left mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{profile.full_name}</p>
                  <p className="text-xs text-muted-foreground">{profile.title}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {profile.expertise_areas.map((area) => (
                  <Badge key={area} variant="secondary" className="text-[10px]">{area}</Badge>
                ))}
              </div>
              {profile.ai_score !== null && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  AI Confidence Score: <span className="font-semibold text-foreground">{profile.ai_score}/100</span>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3">
            {status === "approved" && (
              <Button asChild className="gap-2">
                <Link to="/bounties">
                  Browse Bounties <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            )}
            {status === "pending" && (
              <Button variant="outline" asChild className="gap-2">
                <Link to="/bounties">
                  <Eye className="w-4 h-4" /> Browse Bounties (view only)
                </Link>
              </Button>
            )}
            <Button variant="ghost" asChild>
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HunterStatus;
