import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import { Orb, AISparkle, GridBackground } from "@/components/DoodleElements";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Lock, Mail, Phone, Settings as SettingsIcon, Shield } from "lucide-react";

const SectionHeader = ({ icon: Icon, label }: { icon: any; label: string }) => (
  <div className="flex items-center gap-2.5 text-sm font-semibold text-foreground mb-4">
    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
      <Icon className="w-3.5 h-3.5 text-primary" />
    </div>
    {label}
  </div>
);

const Settings = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth", { state: { returnTo: "/settings" } });
  }, [user, authLoading]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast({ title: "Password updated!" });
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background bg-gradient-mesh">
        <Navbar />
        <div className="pt-24 flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>
      </div>
    );
  }

  const inputClass = "bg-secondary/50 border-border/50 focus:border-primary/50";

  return (
    <div className="min-h-screen bg-background bg-gradient-mesh relative overflow-hidden">
      <Orb className="w-[400px] h-[400px] top-10 -right-40" color="primary" />
      <Orb className="w-[300px] h-[300px] bottom-20 -left-20" color="accent" />
      <GridBackground className="opacity-20" />
      <Navbar />

      <div className="pt-24 pb-16 px-4 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center">
              <SettingsIcon className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-2xl font-display font-extrabold text-foreground">Settings</h1>
          </div>

          {/* Account Info */}
          <div className="glass-strong rounded-2xl p-6">
            <SectionHeader icon={Mail} label="Account" />
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-0.5">Email</p>
                <p className="text-sm text-foreground">{user?.email || "—"}</p>
              </div>
              {user?.phone && (
                <div>
                  <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-0.5">Phone</p>
                  <p className="text-sm text-foreground">{user.phone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Security */}
          {user?.email && (
            <div className="glass-strong rounded-2xl p-6">
              <SectionHeader icon={Shield} label="Security" />
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" placeholder="••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} className={inputClass} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} className={inputClass} />
                </div>
                <Button type="submit" disabled={saving} className="w-full bg-gradient-to-r from-primary to-primary/80 hover:shadow-[0_0_30px_-8px_hsl(270_95%_65%_/_0.5)] transition-all duration-300 gap-2">
                  <Lock className="w-4 h-4" />
                  {saving ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
