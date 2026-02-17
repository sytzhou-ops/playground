import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { DoodleStar } from "@/components/DoodleElements";
import { User, Briefcase, MapPin, Pencil } from "lucide-react";

const INDUSTRIES = [
  "Technology", "Finance", "Healthcare", "Education", "Marketing",
  "Design", "Legal", "Consulting", "E-commerce", "Real Estate",
  "Manufacturing", "Media", "Non-profit", "Other",
];

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
    if (!authLoading && !user) {
      navigate("/auth", { state: { returnTo: "/profile" } });
    }
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
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const InfoRow = ({ label, value }: { label: string; value: string | null | undefined }) => (
    <div className="py-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm text-foreground">{value || "—"}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg mx-auto"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <DoodleStar className="w-6 h-6 text-primary animate-wiggle" />
              <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
            </div>
            {!editing && (
              <Button variant="outline" size="sm" onClick={() => setEditing(true)} className="gap-1.5">
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </Button>
            )}
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            {editing ? (
              <form onSubmit={handleSave} className="space-y-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground"><User className="w-4 h-4 text-primary" /> Personal</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required maxLength={100} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input id="dob" type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} maxLength={20} />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm font-semibold text-foreground pt-2"><MapPin className="w-4 h-4 text-primary" /> Location</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>City</Label><Input value={city} onChange={(e) => setCity(e.target.value)} maxLength={100} /></div>
                  <div className="space-y-2"><Label>Country</Label><Input value={country} onChange={(e) => setCountry(e.target.value)} maxLength={100} /></div>
                </div>

                <div className="flex items-center gap-2 text-sm font-semibold text-foreground pt-2"><Briefcase className="w-4 h-4 text-primary" /> Professional</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Job Title</Label><Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} maxLength={100} /></div>
                  <div className="space-y-2"><Label>Company</Label><Input value={company} onChange={(e) => setCompany(e.target.value)} maxLength={100} /></div>
                  <div className="space-y-2">
                    <Label>Industry</Label>
                    <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                      <option value="">Select industry</option>
                      {INDUSTRIES.map((ind) => <option key={ind} value={ind}>{ind}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2"><Label>LinkedIn</Label><Input type="url" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} maxLength={255} /></div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="submit" disabled={saving} className="flex-1">{saving ? "Saving..." : "Save"}</Button>
                  <Button type="button" variant="outline" onClick={() => { setEditing(false); if (profile) { setFullName(profile.full_name || ""); } }} className="flex-1">Cancel</Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground"><User className="w-4 h-4 text-primary" /> Personal</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                  <InfoRow label="Full Name" value={profile?.full_name} />
                  <InfoRow label="Date of Birth" value={profile?.date_of_birth} />
                  <InfoRow label="Phone" value={profile?.phone_number} />
                  <InfoRow label="Email" value={user?.email || user?.phone} />
                </div>

                <div className="flex items-center gap-2 text-sm font-semibold text-foreground pt-2"><MapPin className="w-4 h-4 text-primary" /> Location</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                  <InfoRow label="City" value={profile?.city} />
                  <InfoRow label="Country" value={profile?.country} />
                </div>

                <div className="flex items-center gap-2 text-sm font-semibold text-foreground pt-2"><Briefcase className="w-4 h-4 text-primary" /> Professional</div>
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
