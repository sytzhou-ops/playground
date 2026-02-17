import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { supabase } from "@/integrations/supabase/client";

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  date_of_birth: string | null;
  phone_number: string | null;
  city: string | null;
  country: string | null;
  job_title: string | null;
  company: string | null;
  industry: string | null;
  linkedin_url: string | null;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();
    setProfile(data as Profile | null);
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const isOnboarded = profile ? profile.full_name.trim().length > 0 : false;

  return { profile, loading, isOnboarded, refetch: fetchProfile };
};
