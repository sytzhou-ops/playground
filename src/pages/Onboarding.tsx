import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Orb, AISparkle, GridBackground } from "@/components/DoodleElements";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { User, Briefcase, MapPin, Sparkles, ArrowRight } from "lucide-react";

const INDUSTRIES = [
  "Technology", "Finance", "Healthcare", "Education", "Marketing",
  "Design", "Legal", "Consulting", "E-commerce", "Real Estate",
  "Manufacturing", "Media", "Non-profit", "Other",
];

const SectionHeader = ({ icon: Icon, label }: { icon: any; label: string }) => (
  <div className="flex items-center gap-2.5 text-sm font-semibold text-foreground mb-1">
    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
      <Icon className="w-3.5 h-3.5 text-primary" />
    </div>
    {label}
  </div>
);

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [industry, setIndustry] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!fullName.trim()) {
      toast({ title: "Full name is required", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim(),
          date_of_birth: dateOfBirth || null,
          phone_number: phoneNumber.trim() || null,
          city: city.trim() || null,
          country: country.trim() || null,
          job_title: jobTitle.trim() || null,
          company: company.trim() || null,
          industry: industry || null,
          linkedin_url: linkedinUrl.trim() || null,
        })
        .eq("user_id", user.id);
      if (error) throw error;
      toast({ title: "Welcome aboard! 🎉" });
      navigate("/");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "bg-secondary/50 border-border/50 focus:border-primary/50";
  const selectClass = "flex h-10 w-full rounded-md border border-border/50 bg-secondary/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

  return (
    <div className="min-h-screen bg-background bg-gradient-mesh flex items-center justify-center px-4 relative overflow-hidden py-12">
      <Orb className="w-[400px] h-[400px] -top-32 left-[-10%]" color="primary" />
      <Orb className="w-[300px] h-[300px] bottom-0 right-[-5%]" color="accent" />
      <GridBackground className="opacity-30" />

      <AISparkle className="absolute top-20 left-[12%] w-4 h-4 text-primary/30 animate-float" />
      <AISparkle className="absolute bottom-24 right-[15%] w-3 h-3 text-accent/25 animate-float" style={{ animationDelay: "2s" }} />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-display font-extrabold text-foreground">Tell us about yourself</h1>
          <p className="text-muted-foreground mt-2 text-sm">Complete your profile to get started</p>
        </div>

        <div className="glass-strong rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <SectionHeader icon={User} label="Personal Info" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input id="fullName" placeholder="Jane Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} required maxLength={100} className={inputClass} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input id="dob" type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className={inputClass} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} maxLength={20} className={inputClass} />
              </div>
            </div>

            <SectionHeader icon={MapPin} label="Location" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>City</Label>
                <Input placeholder="San Francisco" value={city} onChange={(e) => setCity(e.target.value)} maxLength={100} className={inputClass} />
              </div>
              <div className="space-y-2">
                <Label>Country</Label>
                <Input placeholder="United States" value={country} onChange={(e) => setCountry(e.target.value)} maxLength={100} className={inputClass} />
              </div>
            </div>

            <SectionHeader icon={Briefcase} label="Professional" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Job Title</Label>
                <Input placeholder="Product Manager" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} maxLength={100} className={inputClass} />
              </div>
              <div className="space-y-2">
                <Label>Company</Label>
                <Input placeholder="Acme Inc." value={company} onChange={(e) => setCompany(e.target.value)} maxLength={100} className={inputClass} />
              </div>
              <div className="space-y-2">
                <Label>Industry</Label>
                <select value={industry} onChange={(e) => setIndustry(e.target.value)} className={selectClass}>
                  <option value="">Select industry</option>
                  {INDUSTRIES.map((ind) => <option key={ind} value={ind}>{ind}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label>LinkedIn URL</Label>
                <Input type="url" placeholder="https://linkedin.com/in/..." value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} maxLength={255} className={inputClass} />
              </div>
            </div>

            <Button type="submit" className="w-full bg-gradient-to-r from-primary to-primary/80 hover:shadow-[0_0_30px_-8px_hsl(270_95%_65%_/_0.5)] transition-all duration-300 gap-2" disabled={loading}>
              {loading ? "Saving..." : "Complete Profile"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Onboarding;
