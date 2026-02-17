import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import Navbar from "@/components/Navbar";
import { Orb, AISparkle, GridBackground } from "@/components/DoodleElements";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { User, Briefcase, MapPin, Pencil, X, Save } from "lucide-react";

const INDUSTRIES = [
  "Technology", "Finance", "Healthcare", "Education", "Marketing",
  "Design", "Legal", "Consulting", "E-commerce", "Real Estate",
  "Manufacturing", "Media", "Non-profit", "Other",
];

const SectionHeader = ({ icon: Icon, label }: { icon: any; label: string }) => (
  <div className="flex items-center gap-2.5 text-sm font-semibold text-foreground">
    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
      <Icon className="w-3.5 h-3.5 text-primary" />
    </div>
    {label}
  </div>
);

const InfoRow = ({ label, value }: { label: string; value: string | null | undefined }) => (
  <div className="py-2.5">
    <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-0.5">{label}</p>
    <p className="text-sm text-foreground">{value || "—"}</p>
  </div>
);

const Profile = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, refetch } = useProfile();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [industry, setIndustry] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth", { state: { returnTo: "/profile" } });
  }, [user, authLoading]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setDateOfBirth(profile.date_of_birth || "");
      setPhoneNumber(profile.phone_number || "");
      setCity(profile.city || "");
      setCountry(profile.country || "");
      setJobTitle(profile.job_title || "");
      setCompany(profile.company || "");
      setIndustry(profile.industry || "");
      setLinkedinUrl(profile.linkedin_url || "");
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("profiles").update({
        full_name: fullName.trim(), date_of_birth: dateOfBirth || null,
        phone_number: phoneNumber.trim() || null, city: city.trim() || null,
        country: country.trim() || null, job_title: jobTitle.trim() || null,
        company: company.trim() || null, industry: industry || null,
        linkedin_url: linkedinUrl.trim() || null,
      }).eq("user_id", user.id);
      if (error) throw error;
      toast({ title: "Profile updated!" });
      setEditing(false);
      refetch();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-background bg-gradient-mesh">
        <Navbar />
        <div className="pt-24 flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>
      </div>
    );
  }

  const inputClass = "bg-secondary/50 border-border/50 focus:border-primary/50";
  const selectClass = "flex h-10 w-full rounded-md border border-border/50 bg-secondary/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

  return (
    <div className="min-h-screen bg-background bg-gradient-mesh relative overflow-hidden">
      <Orb className="w-[400px] h-[400px] top-20 -left-40" color="primary" />
      <Orb className="w-[300px] h-[300px] bottom-20 right-[-10%]" color="accent" />
      <GridBackground className="opacity-20" />
      <Navbar />

      <div className="pt-24 pb-16 px-4 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-2xl font-display font-extrabold text-foreground">My Profile</h1>
            </div>
            {!editing && (
              <Button variant="outline" size="sm" onClick={() => setEditing(true)} className="gap-1.5 border-border/50 bg-secondary/30 hover:bg-secondary/60 hover:border-primary/20">
                <Pencil className="w-3.5 h-3.5" /> Edit
              </Button>
            )}
          </div>

          {/* Avatar card */}
          <div className="glass-strong rounded-2xl p-6 mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/40 to-accent/30 flex items-center justify-center text-2xl font-bold text-primary-foreground">
                {profile?.full_name?.trim()
                  ? profile.full_name.trim().split(/\s+/).map(n => n[0]).join("").toUpperCase().slice(0, 2)
                  : (user?.email?.[0] || "U").toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">{profile?.full_name || "User"}</h2>
                <p className="text-sm text-muted-foreground">{profile?.job_title ? `${profile.job_title}${profile.company ? ` at ${profile.company}` : ""}` : (user?.email || user?.phone)}</p>
                {profile?.city && <p className="text-xs text-muted-foreground mt-0.5">{[profile.city, profile.country].filter(Boolean).join(", ")}</p>}
              </div>
            </div>
          </div>

          {/* Details card */}
          <div className="glass-strong rounded-2xl p-6">
            {editing ? (
              <form onSubmit={handleSave} className="space-y-6">
                <SectionHeader icon={User} label="Personal" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2 sm:col-span-2"><Label>Full Name *</Label><Input value={fullName} onChange={(e) => setFullName(e.target.value)} required maxLength={100} className={inputClass} /></div>
                  <div className="space-y-2"><Label>Date of Birth</Label><Input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className={inputClass} /></div>
                  <div className="space-y-2"><Label>Phone</Label><Input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} maxLength={20} className={inputClass} /></div>
                </div>
                <SectionHeader icon={MapPin} label="Location" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>City</Label><Input value={city} onChange={(e) => setCity(e.target.value)} maxLength={100} className={inputClass} /></div>
                  <div className="space-y-2"><Label>Country</Label><Input value={country} onChange={(e) => setCountry(e.target.value)} maxLength={100} className={inputClass} /></div>
                </div>
                <SectionHeader icon={Briefcase} label="Professional" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Job Title</Label><Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} maxLength={100} className={inputClass} /></div>
                  <div className="space-y-2"><Label>Company</Label><Input value={company} onChange={(e) => setCompany(e.target.value)} maxLength={100} className={inputClass} /></div>
                  <div className="space-y-2"><Label>Industry</Label><select value={industry} onChange={(e) => setIndustry(e.target.value)} className={selectClass}><option value="">Select</option>{INDUSTRIES.map((ind) => <option key={ind} value={ind}>{ind}</option>)}</select></div>
                  <div className="space-y-2"><Label>LinkedIn</Label><Input type="url" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} maxLength={255} className={inputClass} /></div>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="submit" disabled={saving} className="flex-1 bg-gradient-to-r from-primary to-primary/80 gap-2">{saving ? "Saving..." : <><Save className="w-4 h-4" /> Save</>}</Button>
                  <Button type="button" variant="outline" onClick={() => { setEditing(false); if (profile) setFullName(profile.full_name || ""); }} className="flex-1 border-border/50 bg-secondary/30 gap-2"><X className="w-4 h-4" /> Cancel</Button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <SectionHeader icon={User} label="Personal" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                  <InfoRow label="Full Name" value={profile?.full_name} />
                  <InfoRow label="Date of Birth" value={profile?.date_of_birth} />
                  <InfoRow label="Phone" value={profile?.phone_number} />
                  <InfoRow label="Email" value={user?.email || user?.phone} />
                </div>
                <SectionHeader icon={MapPin} label="Location" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                  <InfoRow label="City" value={profile?.city} />
                  <InfoRow label="Country" value={profile?.country} />
                </div>
                <SectionHeader icon={Briefcase} label="Professional" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                  <InfoRow label="Job Title" value={profile?.job_title} />
                  <InfoRow label="Company" value={profile?.company} />
                  <InfoRow label="Industry" value={profile?.industry} />
                  <InfoRow label="LinkedIn" value={profile?.linkedin_url} />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
