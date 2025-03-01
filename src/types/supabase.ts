export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      pens: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          title: string;
          description: string;
          html: string;
          css: string;
          js: string;
          user_id: string;
          forked_from: string | null;
          likes: number;
          views: number;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title: string;
          description?: string;
          html: string;
          css: string;
          js: string;
          user_id: string;
          forked_from?: string | null;
          likes?: number;
          views?: number;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title?: string;
          description?: string;
          html?: string;
          css?: string;
          js?: string;
          user_id?: string;
          forked_from?: string | null;
          likes?: number;
          views?: number;
        };
      };
      profiles: {
        Row: {
          id: string;
          created_at: string;
          username: string;
          avatar_url: string | null;
          bio: string | null;
          website: string | null;
        };
        Insert: {
          id: string;
          created_at?: string;
          username: string;
          avatar_url?: string | null;
          bio?: string | null;
          website?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          username?: string;
          avatar_url?: string | null;
          bio?: string | null;
          website?: string | null;
        };
      };
      likes: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          pen_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          pen_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          pen_id?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      increment_likes: {
        Args: { pen_id: string };
        Returns: undefined;
      };
      decrement_likes: {
        Args: { pen_id: string };
        Returns: undefined;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
