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
      about_section: {
        Row: {
          content: string | null
          id: string
          image_url: string | null
          stats: Json | null
          subtitle: string | null
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          id?: string
          image_url?: string | null
          stats?: Json | null
          subtitle?: string | null
          title?: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          id?: string
          image_url?: string | null
          stats?: Json | null
          subtitle?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      archive_categories: {
        Row: {
          cover_image_url: string | null
          created_at: string
          description: string | null
          link_url: string | null
          id: string
          is_visible: boolean
          slug: string
          sort_order: number
          title: string
          year: string | null
          updated_at: string
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string
          link_url?: string | null
          description?: string | null
          id?: string
          is_visible?: boolean
          slug: string
          sort_order?: number
          title: string
          year?: string | null
          updated_at?: string
        }
        Update: {
          cover_image_url?: string | null
          link_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_visible?: boolean
          slug?: string
          sort_order?: number
          title?: string
          year?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      archive_items: {
        Row: {
          category_id: string | null
          created_at: string
          date: string | null
          description: string | null
          id: string
          image_url: string | null
          is_visible: boolean
          link_url: string | null
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          date?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_visible?: boolean
          link_url?: string | null
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          date?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_visible?: boolean
          link_url?: string | null
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "archive_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "archive_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_settings: {
        Row: {
          description: string | null
          id: string
          instagram_url: string | null
          management_email: string | null
          subtitle: string | null
          tiktok_url: string | null
          title: string | null
          twitter_url: string | null
          updated_at: string
          youtube_url: string | null
        }
        Insert: {
          description?: string | null
          id?: string
          instagram_url?: string | null
          management_email?: string | null
          subtitle?: string | null
          tiktok_url?: string | null
          title?: string | null
          twitter_url?: string | null
          updated_at?: string
          youtube_url?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          instagram_url?: string | null
          management_email?: string | null
          subtitle?: string | null
          tiktok_url?: string | null
          title?: string | null
          twitter_url?: string | null
          updated_at?: string
          youtube_url?: string | null
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          is_read: boolean
          message: string
          name: string
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_read?: boolean
          message: string
          name: string
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean
          message?: string
          name?: string
          subject?: string | null
        }
        Relationships: []
      }
      footer_settings: {
        Row: {
          additional_links: Json | null
          copyright_text: string | null
          id: string
          show_social_links: boolean
          updated_at: string
        }
        Insert: {
          additional_links?: Json | null
          copyright_text?: string | null
          id?: string
          show_social_links?: boolean
          updated_at?: string
        }
        Update: {
          additional_links?: Json | null
          copyright_text?: string | null
          id?: string
          show_social_links?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      nav_links: {
        Row: {
          created_at: string
          href: string
          id: string
          is_visible: boolean
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          href: string
          id?: string
          is_visible?: boolean
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          href?: string
          id?: string
          is_visible?: boolean
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_featured: boolean
          is_visible: boolean
          link_text: string | null
          link_url: string | null
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean
          is_visible?: boolean
          link_text?: string | null
          link_url?: string | null
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean
          is_visible?: boolean
          link_text?: string | null
          link_url?: string | null
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          hero_background_gradient: string | null
          hero_image_url: string | null
          hero_subtitle: string | null
          hero_title: string | null
          id: string
          site_name: string
          site_tagline: string | null
          updated_at: string
          privacy_policy: string | null
          terms_of_service: string | null
        }
        Insert: {
          hero_background_gradient?: string | null
          hero_image_url?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          id?: string
          site_name?: string
          site_tagline?: string | null
          updated_at?: string
          privacy_policy?: string | null
          terms_of_service?: string | null
        }
        Update: {
          hero_background_gradient?: string | null
          hero_image_url?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          id?: string
          site_name?: string
          site_tagline?: string | null
          updated_at?: string
          privacy_policy?: string | null
          terms_of_service?: string | null
        }
        Relationships: []
      }
      tour_dates: {
        Row: {
          additional_info: string | null
          city: string
          country: string | null
          created_at: string
          event_date: string
          event_time: string | null
          id: string
          is_visible: boolean
          sort_order: number
          status: string | null
          ticket_price: string | null
          ticket_url: string | null
          updated_at: string
          venue_name: string
        }
        Insert: {
          additional_info?: string | null
          city: string
          country?: string | null
          created_at?: string
          event_date: string
          event_time?: string | null
          id?: string
          is_visible?: boolean
          sort_order?: number
          status?: string | null
          ticket_price?: string | null
          ticket_url?: string | null
          updated_at?: string
          venue_name: string
        }
        Update: {
          additional_info?: string | null
          city?: string
          country?: string | null
          created_at?: string
          event_date?: string
          event_time?: string | null
          id?: string
          is_visible?: boolean
          sort_order?: number
          status?: string | null
          ticket_price?: string | null
          ticket_url?: string | null
          updated_at?: string
          venue_name?: string
        }
        Relationships: []
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
          role?: Database["public"]["Enums"]["app_role"]
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
      videos: {
        Row: {
          created_at: string
          duration: string | null
          id: string
          is_featured: boolean
          is_visible: boolean
          sort_order: number
          thumbnail_url: string | null
          title: string
          updated_at: string
          views: string | null
          watermark_url: string | null
          youtube_embed_id: string | null
          youtube_url: string | null
        }
        Insert: {
          created_at?: string
          duration?: string | null
          id?: string
          is_featured?: boolean
          is_visible?: boolean
          sort_order?: number
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          views?: string | null
          watermark_url?: string | null
          youtube_embed_id?: string | null
          youtube_url?: string | null
        }
        Update: {
          created_at?: string
          duration?: string | null
          id?: string
          is_featured?: boolean
          is_visible?: boolean
          sort_order?: number
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          views?: string | null
          watermark_url?: string | null
          youtube_embed_id?: string | null
          youtube_url?: string | null
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
      grant_admin: {
        Args: {
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
