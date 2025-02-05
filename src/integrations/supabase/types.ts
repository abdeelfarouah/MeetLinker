export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      messages: {
        Row: {
          id: string
          content: string
          user_id: string | null
          room_id: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          content: string
          user_id?: string | null
          room_id?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          content?: string
          user_id?: string | null
          room_id?: string | null
          created_at?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          username: string | null
          avatar_url: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          username?: string | null
          avatar_url?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          username?: string | null
          avatar_url?: string | null
          updated_at?: string | null
        }
      }
      rooms: {
        Row: {
          id: string
          name: string
          created_by: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          created_by?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          created_by?: string | null
          created_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}