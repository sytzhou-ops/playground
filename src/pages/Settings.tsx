import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { DoodleStar } from "@/components/DoodleElements";
import { Lock, Mail } from "lucide-react";

const Settings = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth", { state: { returnTo: "/settings" } });
    }
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
      setCurrentPassword("");
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
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg mx-auto space-y-6"
        >
          <div className="flex items-center gap-2 mb-2">
            <DoodleStar className="w-6 h-6 text-primary animate-wiggle" />
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          </div>

          {/* Account Info */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Mail className="w-4 h-4 text-primary" />
              Account
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm text-foreground">{user?.email || "—"}</p>
            </div>
            {user?.phone && (
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="text-sm text-foreground">{user.phone}</p>
              </div>
            )}
          </div>

          {/* Change Password */}
          {user?.email && (
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-4">
                <Lock className="w-4 h-4 text-primary" />
                Change Password
              </div>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <Button type="submit" disabled={saving} className="w-full">
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
