import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Orb, AISparkle, GridBackground } from "@/components/DoodleElements";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Mail, Phone, Chrome, Apple, Sparkles, ArrowRight } from "lucide-react";

const Auth = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = (location.state as any)?.returnTo || "/";

  // Redirect if already authenticated (e.g. after OAuth sets session)
  useEffect(() => {
    if (session) {
      const savedReturn = localStorage.getItem("auth_return_to");
      if (savedReturn) {
        localStorage.removeItem("auth_return_to");
        navigate(savedReturn, { replace: true });
      } else {
        navigate(returnTo, { replace: true });
      }
    }
  }, [session, navigate, returnTo]);
  const [loading, setLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [tab, setTab] = useState<"login" | "signup">("login");

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (tab === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast({ title: "Account created!", description: "You're now signed in." });
        navigate("/onboarding");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: "Welcome back!" });
        navigate(returnTo);
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({ phone });
      if (error) throw error;
      setOtpSent(true);
      toast({ title: "Code sent!", description: "Check your phone for the verification code." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({ phone, token: otp, type: "sms" });
      if (error) throw error;
      toast({ title: "Welcome!" });
      navigate(returnTo);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: "google" | "apple") => {
    setLoading(true);
    try {
      localStorage.setItem("auth_return_to", returnTo);
      const { error } = await lovable.auth.signInWithOAuth(provider, {
        redirect_uri: window.location.origin,
      });
      if (error) throw error;
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const EmailForm = ({ idPrefix }: { idPrefix: string }) => (
    <form onSubmit={handleEmailAuth} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-email`}>Email</Label>
        <Input id={`${idPrefix}-email`} type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-secondary/50 border-border/50 focus:border-primary/50" />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-password`}>Password</Label>
        <Input id={`${idPrefix}-password`} type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="bg-secondary/50 border-border/50 focus:border-primary/50" />
      </div>
      <Button type="submit" className="w-full bg-gradient-to-r from-primary to-primary/80 hover:shadow-[0_0_30px_-8px_hsl(270_95%_65%_/_0.5)] transition-all duration-300" disabled={loading}>
        {loading ? (tab === "signup" ? "Creating account..." : "Signing in...") : (tab === "signup" ? "Create account" : "Sign in")}
      </Button>
    </form>
  );

  const PhoneForm = ({ idPrefix }: { idPrefix: string }) => (
    !otpSent ? (
      <form onSubmit={handlePhoneSendOtp} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-phone`}>Phone number</Label>
          <Input id={`${idPrefix}-phone`} type="tel" placeholder="+1234567890" value={phone} onChange={(e) => setPhone(e.target.value)} required className="bg-secondary/50 border-border/50 focus:border-primary/50" />
        </div>
        <Button type="submit" className="w-full bg-gradient-to-r from-primary to-primary/80 hover:shadow-[0_0_30px_-8px_hsl(270_95%_65%_/_0.5)] transition-all duration-300" disabled={loading}>
          {loading ? "Sending..." : "Send verification code"}
        </Button>
      </form>
    ) : (
      <form onSubmit={handlePhoneVerify} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-otp`}>Verification code</Label>
          <Input id={`${idPrefix}-otp`} type="text" placeholder="123456" value={otp} onChange={(e) => setOtp(e.target.value)} required className="bg-secondary/50 border-border/50 focus:border-primary/50" />
        </div>
        <Button type="submit" className="w-full bg-gradient-to-r from-primary to-primary/80 hover:shadow-[0_0_30px_-8px_hsl(270_95%_65%_/_0.5)] transition-all duration-300" disabled={loading}>
          {loading ? "Verifying..." : (tab === "signup" ? "Verify & create account" : "Verify & sign in")}
        </Button>
        <button type="button" className="text-xs text-muted-foreground hover:text-foreground w-full text-center transition-colors" onClick={() => setOtpSent(false)}>
          Use a different number
        </button>
      </form>
    )
  );

  return (
    <div className="min-h-screen bg-background bg-gradient-mesh flex items-center justify-center px-4 relative overflow-hidden">
      <Orb className="w-[400px] h-[400px] -top-32 -left-32" color="primary" />
      <Orb className="w-[300px] h-[300px] bottom-10 right-[-10%]" color="accent" />
      <GridBackground className="opacity-30" />

      <AISparkle className="absolute top-20 left-[15%] w-4 h-4 text-primary/30 animate-float" />
      <AISparkle className="absolute bottom-32 right-[12%] w-3 h-3 text-accent/30 animate-float" style={{ animationDelay: "1.5s" }} />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2.5">
            <img src="/patch-logo.png" alt="Patch" className="w-6 h-6" />
            <span className="text-2xl font-display font-bold text-foreground">
              Patch
            </span>
          </a>
          <p className="text-muted-foreground mt-3 text-sm">
            {tab === "login" ? "Welcome back, let's get building" : "Join the bounty revolution"}
          </p>
        </div>

        {/* Card */}
        <div className="glass-strong rounded-2xl p-6">
          <Tabs value={tab} onValueChange={(v) => setTab(v as "login" | "signup")}>
            <TabsList className="w-full mb-6 bg-secondary/50 rounded-xl p-1">
              <TabsTrigger value="login" className="flex-1 rounded-lg data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Log in</TabsTrigger>
              <TabsTrigger value="signup" className="flex-1 rounded-lg data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Sign up</TabsTrigger>
            </TabsList>

            {/* OAuth buttons */}
            <div className="space-y-3 mb-6">
              <Button variant="outline" className="w-full gap-3 h-11 border-border/50 bg-secondary/30 hover:bg-secondary/60 hover:border-primary/20 transition-all duration-300" onClick={() => handleOAuth("google")} disabled={loading}>
                <Chrome className="w-4 h-4" />
                Continue with Google
              </Button>
              <Button variant="outline" className="w-full gap-3 h-11 border-border/50 bg-secondary/30 hover:bg-secondary/60 hover:border-primary/20 transition-all duration-300" onClick={() => handleOAuth("apple")} disabled={loading}>
                <Apple className="w-4 h-4" />
                Continue with Apple
              </Button>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/30" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-card/60 backdrop-blur-sm px-4 text-xs text-muted-foreground font-mono uppercase tracking-wider">or</span>
              </div>
            </div>

            {/* Method toggle */}
            <div className="flex gap-2 mb-4">
              <Button variant={authMethod === "email" ? "default" : "outline"} size="sm" className={`flex-1 gap-2 ${authMethod === "email" ? "bg-primary/20 text-primary border-primary/20" : "border-border/50 bg-secondary/30"}`} onClick={() => { setAuthMethod("email"); setOtpSent(false); }}>
                <Mail className="w-3.5 h-3.5" /> Email
              </Button>
              <Button variant={authMethod === "phone" ? "default" : "outline"} size="sm" className={`flex-1 gap-2 ${authMethod === "phone" ? "bg-primary/20 text-primary border-primary/20" : "border-border/50 bg-secondary/30"}`} onClick={() => { setAuthMethod("phone"); setOtpSent(false); }}>
                <Phone className="w-3.5 h-3.5" /> Phone
              </Button>
            </div>

            <TabsContent value="login" className="mt-0">
              {authMethod === "email" ? <EmailForm idPrefix="login" /> : <PhoneForm idPrefix="login" />}
            </TabsContent>

            <TabsContent value="signup" className="mt-0">
              {authMethod === "email" ? <EmailForm idPrefix="signup" /> : <PhoneForm idPrefix="signup" />}
            </TabsContent>
          </Tabs>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
