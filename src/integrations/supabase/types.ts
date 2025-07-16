export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      clients: {
        Row: {
          business: string | null
          client_id: number
          client_name: string
          contacts: Json | null
          conversation: string | null
          created_at: string
          email_address: string | null
          invoice_details: Json | null
          invoice_files: string[] | null
          key_challenges: string | null
          lead_handlings: Json | null
          meeting_time: Json | null
          onboarding_details: string | null
          status: string | null
        }
        Insert: {
          business?: string | null
          client_id?: number
          client_name: string
          contacts?: Json | null
          conversation?: string | null
          created_at?: string
          email_address?: string | null
          invoice_details?: Json | null
          invoice_files?: string[] | null
          key_challenges?: string | null
          lead_handlings?: Json | null
          meeting_time?: Json | null
          onboarding_details?: string | null
          status?: string | null
        }
        Update: {
          business?: string | null
          client_id?: number
          client_name?: string
          contacts?: Json | null
          conversation?: string | null
          created_at?: string
          email_address?: string | null
          invoice_details?: Json | null
          invoice_files?: string[] | null
          key_challenges?: string | null
          lead_handlings?: Json | null
          meeting_time?: Json | null
          onboarding_details?: string | null
          status?: string | null
        }
        Relationships: []
      }
      cv_evaluations: {
        Row: {
          ai_summary: string | null
          candidate_name: string
          city: string | null
          consideration: string | null
          created_at: string
          date_of_birth: string | null
          education: string | null
          email: string | null
          evaluation_date: string
          id: string
          job_history: string | null
          phone: string | null
          skills: string | null
          updated_at: string
          vote: number | null
        }
        Insert: {
          ai_summary?: string | null
          candidate_name: string
          city?: string | null
          consideration?: string | null
          created_at?: string
          date_of_birth?: string | null
          education?: string | null
          email?: string | null
          evaluation_date?: string
          id?: string
          job_history?: string | null
          phone?: string | null
          skills?: string | null
          updated_at?: string
          vote?: number | null
        }
        Update: {
          ai_summary?: string | null
          candidate_name?: string
          city?: string | null
          consideration?: string | null
          created_at?: string
          date_of_birth?: string | null
          education?: string | null
          email?: string | null
          evaluation_date?: string
          id?: string
          job_history?: string | null
          phone?: string | null
          skills?: string | null
          updated_at?: string
          vote?: number | null
        }
        Relationships: []
      }
      deals: {
        Row: {
          client_details: Json
          client_id: number
          created_at: string
          deal_id: number
          invoice_details: Json | null
          purchase_details: Json | null
          purchase_status: Database["public"]["Enums"]["status"]
          requested_followups: Json | null
        }
        Insert: {
          client_details: Json
          client_id: number
          created_at: string
          deal_id?: number
          invoice_details?: Json | null
          purchase_details?: Json | null
          purchase_status?: Database["public"]["Enums"]["status"]
          requested_followups?: Json | null
        }
        Update: {
          client_details?: Json
          client_id?: number
          created_at?: string
          deal_id?: number
          invoice_details?: Json | null
          purchase_details?: Json | null
          purchase_status?: Database["public"]["Enums"]["status"]
          requested_followups?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "Deals_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["client_id"]
          },
        ]
      }
      follow_ups: {
        Row: {
          client_name: string
          created_at: string | null
          email: string
          followed_up: boolean | null
          id: string
          invoice_id: string | null
          last_follow_up: string | null
          notes: string | null
          updated_at: string | null
        }
        Insert: {
          client_name: string
          created_at?: string | null
          email: string
          followed_up?: boolean | null
          id?: string
          invoice_id?: string | null
          last_follow_up?: string | null
          notes?: string | null
          updated_at?: string | null
        }
        Update: {
          client_name?: string
          created_at?: string | null
          email?: string
          followed_up?: boolean | null
          id?: string
          invoice_id?: string | null
          last_follow_up?: string | null
          notes?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "follow_ups_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount: number | null
          client_name: string
          created_at: string | null
          deal_id: number | null
          due_date: string | null
          email: string
          id: string
          invoice_date: string
          invoice_number: string | null
          notes: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          amount?: number | null
          client_name: string
          created_at?: string | null
          deal_id?: number | null
          due_date?: string | null
          email: string
          id?: string
          invoice_date: string
          invoice_number?: string | null
          notes?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number | null
          client_name?: string
          created_at?: string | null
          deal_id?: number | null
          due_date?: string | null
          email?: string
          id?: string
          invoice_date?: string
          invoice_number?: string | null
          notes?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["deal_id"]
          },
        ]
      }
      profile_criteria: {
        Row: {
          criteria: string
          id: number
          updated_at: string | null
        }
        Insert: {
          criteria?: string
          id?: number
          updated_at?: string | null
        }
        Update: {
          criteria?: string
          id?: number
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      status: "ACTIVE" | "PENDING" | "EXPIRED" | "INACTIVE"
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
      status: ["ACTIVE", "PENDING", "EXPIRED", "INACTIVE"],
    },
  },
} as const
