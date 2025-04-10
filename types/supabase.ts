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
      animals: {
        Row: {
          id: string
          owner_id: string
          metric_number: string | null
          full_name: string | null
          nickname: string
          species_id: string
          breed_id: string
          color_id: string
          birth_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          metric_number?: string | null
          full_name?: string | null
          nickname: string
          species_id: string
          breed_id: string
          color_id: string
          birth_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          metric_number?: string | null
          full_name?: string | null
          nickname?: string
          species_id?: string
          breed_id?: string
          color_id?: string
          birth_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      // Add other table types here...
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
