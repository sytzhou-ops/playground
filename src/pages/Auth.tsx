import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { DoodleStar, DoodleSquiggle } from "@/components/DoodleElements";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Mail, Phone, Chrome, Apple } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = (location.state as any)?.returnTo || "/";
  const [loading, setLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");

  // Email state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Phone state
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // Tab state
  const [tab, setTab] = useState<"login" | "signup">("login");

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (tab === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
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

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background doodles */}
      <DoodleStar className="absolute top-20 left-10 w-8 h-8 text-primary opacity-20 animate-float" />
      <DoodleStar className="absolute bottom-32 right-16 w-6 h-6 text-accent opacity-20 animate-wiggle" />
      <DoodleSquiggle className="absolute top-40 right-20 w-24 text-primary opacity-10" />
      <DoodleSquiggle className="absolute bottom-20 left-20 w-32 text-accent opacity-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2">
            <DoodleStar className="w-6 h-6 text-primary animate-wiggle" />
            <span className="text-2xl font-bold text-foreground">
              bounty<span className="text-primary">AI</span>
            </span>
          </a>
          <p className="text-muted-foreground mt-2 text-sm">
            {tab === "login" ? "Welcome back, let's get building" : "Join the bounty revolution"}
          </p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-xl p-6 glow-primary/20">
          <Tabs value={tab} onValueChange={(v) => setTab(v as "login" | "signup")}>
            <TabsList className="w-full mb-6 bg-secondary">
              <TabsTrigger value="login" className="flex-1">Log in</TabsTrigger>
              <TabsTrigger value="signup" className="flex-1">Sign up</TabsTrigger>
            </TabsList>

            {/* OAuth buttons */}
            <div className="space-y-3 mb-6">
              <Button
                variant="outline"
                className="w-full gap-3 h-11 border-border hover:bg-secondary"
                onClick={() => handleOAuth("google")}
                disabled={loading}
              >
                <Chrome className="w-4 h-4" />
                Continue with Google
              </Button>
              <Button
                variant="outline"
                className="w-full gap-3 h-11 border-border hover:bg-secondary"
                onClick={() => handleOAuth("apple")}
                disabled={loading}
              >
                <Apple className="w-4 h-4" />
                Continue with Apple
              </Button>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-card px-3 text-xs text-muted-foreground font-doodle text-lg">or</span>
              </div>
            </div>

            {/* Method toggle */}
            <div className="flex gap-2 mb-4">
              <Button
                variant={authMethod === "email" ? "default" : "outline"}
                size="sm"
                className="flex-1 gap-2"
                onClick={() => { setAuthMethod("email"); setOtpSent(false); }}
              >
                <Mail className="w-3.5 h-3.5" />
                Email
              </Button>
              <Button
                variant={authMethod === "phone" ? "default" : "outline"}
                size="sm"
                className="flex-1 gap-2"
                onClick={() => { setAuthMethod("phone"); setOtpSent(false); }}
              >
                <Phone className="w-3.5 h-3.5" />
                Phone
              </Button>
            </div>

            {/* Email form */}
            <TabsContent value="login" className="mt-0">
              {authMethod === "email" ? (
                <form onSubmit={handleEmailAuth} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-login">Email</Label>
                    <Input
                      id="email-login"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-login">Password</Label>
                    <Input
                      id="password-login"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Signing in..." : "Sign in"}
                  </Button>
                </form>
              ) : (
                !otpSent ? (
                  <form onSubmit={handlePhoneSendOtp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone-login">Phone number</Label>
                      <Input
                        id="phone-login"
                        type="tel"
                        placeholder="+1234567890"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Sending..." : "Send verification code"}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handlePhoneVerify} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="otp-login">Verification code</Label>
                      <Input
                        id="otp-login"
                        type="text"
                        placeholder="123456"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Verifying..." : "Verify & sign in"}
                    </Button>
                    <button
                      type="button"
                      className="text-xs text-muted-foreground hover:text-foreground w-full text-center"
                      onClick={() => setOtpSent(false)}
                    >
                      Use a different number
                    </button>
                  </form>
                )
              )}
            </TabsContent>

            <TabsContent value="signup" className="mt-0">
              {authMethod === "email" ? (
                <form onSubmit={handleEmailAuth} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-signup">Email</Label>
                    <Input
                      id="email-signup"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-signup">Password</Label>
                    <Input
                      id="password-signup"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Creating account..." : "Create account"}
                  </Button>
                </form>
              ) : (
                !otpSent ? (
                  <form onSubmit={handlePhoneSendOtp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone-signup">Phone number</Label>
                      <Input
                        id="phone-signup"
                        type="tel"
                        placeholder="+1234567890"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Sending..." : "Send verification code"}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handlePhoneVerify} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="otp-signup">Verification code</Label>
                      <Input
                        id="otp-signup"
                        type="text"
                        placeholder="123456"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Verifying..." : "Verify & create account"}
                    </Button>
                    <button
                      type="button"
                      className="text-xs text-muted-foreground hover:text-foreground w-full text-center"
                      onClick={() => setOtpSent(false)}
                    >
                      Use a different number
                    </button>
                  </form>
                )
              )}
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
