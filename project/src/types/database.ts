export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          phone: string | null;
          location: string | null;
          preferences: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          location?: string | null;
          preferences?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          location?: string | null;
          preferences?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          original_price: number | null;
          category: string;
          subcategory: string | null;
          brand: string | null;
          image_urls: string[];
          rating: number | null;
          review_count: number;
          tags: string[];
          ar_compatible: boolean;
          ar_model_url: string | null;
          inventory_count: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          price: number;
          original_price?: number | null;
          category: string;
          subcategory?: string | null;
          brand?: string | null;
          image_urls: string[];
          rating?: number | null;
          review_count?: number;
          tags?: string[];
          ar_compatible?: boolean;
          ar_model_url?: string | null;
          inventory_count?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price?: number;
          original_price?: number | null;
          category?: string;
          subcategory?: string | null;
          brand?: string | null;
          image_urls?: string[];
          rating?: number | null;
          review_count?: number;
          tags?: string[];
          ar_compatible?: boolean;
          ar_model_url?: string | null;
          inventory_count?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      shortlists: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          is_public: boolean;
          collaborators: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          is_public?: boolean;
          collaborators?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          is_public?: boolean;
          collaborators?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      shortlist_items: {
        Row: {
          id: string;
          shortlist_id: string;
          product_id: string;
          added_by: string;
          votes_up: number;
          votes_down: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          shortlist_id: string;
          product_id: string;
          added_by: string;
          votes_up?: number;
          votes_down?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          shortlist_id?: string;
          product_id?: string;
          added_by?: string;
          votes_up?: number;
          votes_down?: number;
          created_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          shortlist_item_id: string;
          user_id: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          shortlist_item_id: string;
          user_id: string;
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          shortlist_item_id?: string;
          user_id?: string;
          content?: string;
          created_at?: string;
        };
      };
      ai_interactions: {
        Row: {
          id: string;
          user_id: string;
          interaction_type: string;
          context: Json;
          response: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          interaction_type: string;
          context: Json;
          response: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          interaction_type?: string;
          context?: Json;
          response?: Json;
          created_at?: string;
        };
      };
      user_preferences: {
        Row: {
          id: string;
          user_id: string;
          category: string;
          preferences: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category: string;
          preferences: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          category?: string;
          preferences?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_personalized_recommendations: {
        Args: {
          user_id: string;
          limit_count?: number;
        };
        Returns: {
          id: string;
          name: string;
          price: number;
          image_urls: string[];
          rating: number;
          relevance_score: number;
          ai_reason: string;
        }[];
      };
      search_products: {
        Args: {
          search_query: string;
          category_filter?: string;
          price_min?: number;
          price_max?: number;
          limit_count?: number;
        };
        Returns: {
          id: string;
          name: string;
          description: string;
          price: number;
          image_urls: string[];
          rating: number;
          similarity_score: number;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];