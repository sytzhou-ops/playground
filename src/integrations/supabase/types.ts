export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      agreements: {
        Row: {
          agreed_amount: number
          agreed_scope: string
          agreed_timeline: string
          applicant_accepted: boolean
          applicant_id: string
          application_id: string
          bounty_id: string
          created_at: string
          id: string
          poster_accepted: boolean
          poster_id: string
          status: string
          stripe_payment_intent_id: string | null
          updated_at: string
        }
        Insert: {
          agreed_amount: number
          agreed_scope: string
          agreed_timeline: string
          applicant_accepted?: boolean
          applicant_id: string
          application_id: string
          bounty_id: string
          created_at?: string
          id?: string
          poster_accepted?: boolean
          poster_id: string
          status?: string
          stripe_payment_intent_id?: string | null
          updated_at?: string
        }
        Update: {
          agreed_amount?: number
          agreed_scope?: string
          agreed_timeline?: string
          applicant_accepted?: boolean
          applicant_id?: string
          application_id?: string
          bounty_id?: string
          created_at?: string
          id?: string
          poster_accepted?: boolean
          poster_id?: string
          status?: string
          stripe_payment_intent_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agreements_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agreements_bounty_id_fkey"
            columns: ["bounty_id"]
            isOneToOne: false
            referencedRelation: "bounties"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          applicant_id: string
          bounty_id: string
          created_at: string
          estimated_cost: number
          estimated_hours: number
          id: string
          needs_from_requestor: string
          problem_understanding: string
          scope_approach: string
          solution_plan: string
          status: string
          updated_at: string
        }
        Insert: {
          applicant_id: string
          bounty_id: string
          created_at?: string
          estimated_cost: number
          estimated_hours: number
          id?: string
          needs_from_requestor: string
          problem_understanding: string
          scope_approach: string
          solution_plan: string
          status?: string
          updated_at?: string
        }
        Update: {
          applicant_id?: string
          bounty_id?: string
          created_at?: string
          estimated_cost?: number
          estimated_hours?: number
          id?: string
          needs_from_requestor?: string
          problem_understanding?: string
          scope_approach?: string
          solution_plan?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_bounty_id_fkey"
            columns: ["bounty_id"]
            isOneToOne: false
            referencedRelation: "bounties"
            referencedColumns: ["id"]
          },
        ]
      }
      bounties: {
        Row: {
          acceptance_criteria: string | null
          additional_notes: string | null
          ai_clarity_score: number | null
          ai_completeness_score: number | null
          ai_scopability_score: number | null
          ai_summary: string | null
          annual_cost: number | null
          bounty_amount: number
          created_at: string
          current_process: string | null
          deadline: string | null
          desired_outcome: string | null
          hours_wasted: number | null
          id: string
          impact_description: string | null
          industry: string | null
          pain_description: string | null
          pain_frequency: string | null
          payment_structure: string | null
          problem_description: string
          status: string
          title: string
          tool_preferences: string | null
          updated_at: string
          urgency: string | null
          user_id: string
        }
        Insert: {
          acceptance_criteria?: string | null
          additional_notes?: string | null
          ai_clarity_score?: number | null
          ai_completeness_score?: number | null
          ai_scopability_score?: number | null
          ai_summary?: string | null
          annual_cost?: number | null
          bounty_amount?: number
          created_at?: string
          current_process?: string | null
          deadline?: string | null
          desired_outcome?: string | null
          hours_wasted?: number | null
          id?: string
          impact_description?: string | null
          industry?: string | null
          pain_description?: string | null
          pain_frequency?: string | null
          payment_structure?: string | null
          problem_description: string
          status?: string
          title: string
          tool_preferences?: string | null
          updated_at?: string
          urgency?: string | null
          user_id: string
        }
        Update: {
          acceptance_criteria?: string | null
          additional_notes?: string | null
          ai_clarity_score?: number | null
          ai_completeness_score?: number | null
          ai_scopability_score?: number | null
          ai_summary?: string | null
          annual_cost?: number | null
          bounty_amount?: number
          created_at?: string
          current_process?: string | null
          deadline?: string | null
          desired_outcome?: string | null
          hours_wasted?: number | null
          id?: string
          impact_description?: string | null
          industry?: string | null
          pain_description?: string | null
          pain_frequency?: string | null
          payment_structure?: string | null
          problem_description?: string
          status?: string
          title?: string
          tool_preferences?: string | null
          updated_at?: string
          urgency?: string | null
          user_id?: string
        }
        Relationships: []
      }
      hunter_profiles: {
        Row: {
          admin_notes: string | null
          ai_assessment: string | null
          ai_score: number | null
          bio: string
          certifications: string | null
          created_at: string
          expertise_areas: string[]
          full_name: string
          github_url: string | null
          id: string
          linkedin_url: string | null
          past_projects: string | null
          portfolio_url: string | null
          resume_path: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
          years_experience: number
        }
        Insert: {
          admin_notes?: string | null
          ai_assessment?: string | null
          ai_score?: number | null
          bio: string
          certifications?: string | null
          created_at?: string
          expertise_areas?: string[]
          full_name: string
          github_url?: string | null
          id?: string
          linkedin_url?: string | null
          past_projects?: string | null
          portfolio_url?: string | null
          resume_path?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
          years_experience?: number
        }
        Update: {
          admin_notes?: string | null
          ai_assessment?: string | null
          ai_score?: number | null
          bio?: string
          certifications?: string | null
          created_at?: string
          expertise_areas?: string[]
          full_name?: string
          github_url?: string | null
          id?: string
          linkedin_url?: string | null
          past_projects?: string | null
          portfolio_url?: string | null
          resume_path?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
          years_experience?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          city: string | null
          company: string | null
          country: string | null
          created_at: string
          date_of_birth: string | null
          full_name: string
          id: string
          industry: string | null
          job_title: string | null
          linkedin_url: string | null
          phone_number: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          city?: string | null
          company?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          full_name?: string
          id?: string
          industry?: string | null
          job_title?: string | null
          linkedin_url?: string | null
          phone_number?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          city?: string | null
          company?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          full_name?: string
          id?: string
          industry?: string | null
          job_title?: string | null
          linkedin_url?: string | null
          phone_number?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      scheduled_calls: {
        Row: {
          applicant_id: string
          application_id: string
          bounty_id: string
          created_at: string
          duration_minutes: number
          id: string
          notes: string | null
          poster_id: string
          scheduled_at: string
          status: string
        }
        Insert: {
          applicant_id: string
          application_id: string
          bounty_id: string
          created_at?: string
          duration_minutes?: number
          id?: string
          notes?: string | null
          poster_id: string
          scheduled_at: string
          status?: string
        }
        Update: {
          applicant_id?: string
          application_id?: string
          bounty_id?: string
          created_at?: string
          duration_minutes?: number
          id?: string
          notes?: string | null
          poster_id?: string
          scheduled_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_calls_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_calls_bounty_id_fkey"
            columns: ["bounty_id"]
            isOneToOne: false
            referencedRelation: "bounties"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "hunter" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "hunter", "user"],
    },
  },
} as const
