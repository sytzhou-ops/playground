import { useAuth } from "./useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

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

const fetchProfile = async (userId: string) => {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  return (data as Profile | null) ?? null;
};

export const useProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile = null, isLoading: loading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => fetchProfile(user!.id),
    enabled: !!user,
  });

  const isOnboarded = profile ? profile.full_name.trim().length > 0 : false;

  const refetch = () => {
    if (user) {
      queryClient.invalidateQueries({ queryKey: ["profile", user.id] });
    }
  };

  return { profile, loading, isOnboarded, refetch };
};
