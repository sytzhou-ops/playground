import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { supabase } from "@/integrations/supabase/client";

export type HunterStatus = "none" | "pending" | "approved" | "rejected" | "loading";

export interface HunterProfile {
  id: string;
  full_name: string;
  title: string;
  bio: string;
  years_experience: number;
  expertise_areas: string[];
  linkedin_url: string | null;
  github_url: string | null;
  portfolio_url: string | null;
  resume_path: string | null;
  certifications: string | null;
  past_projects: string | null;
  status: string;
  ai_score: number | null;
  ai_assessment: string | null;
}

export const useHunterProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<HunterProfile | null>(null);
  const [status, setStatus] = useState<HunterStatus>("loading");

  useEffect(() => {
    if (!user) {
      setStatus("none");
      setProfile(null);
      return;
    }

    const fetch = async () => {
      const { data, error } = await supabase
        .from("hunter_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error || !data) {
        setStatus("none");
        setProfile(null);
      } else {
        setStatus(data.status as HunterStatus);
        setProfile(data as HunterProfile);
      }
    };

    fetch();
  }, [user]);

  return { profile, status, refetch: () => {
    if (user) {
      supabase
        .from("hunter_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data) {
            setStatus(data.status as HunterStatus);
            setProfile(data as HunterProfile);
          }
        });
    }
  }};
};
