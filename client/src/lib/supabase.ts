import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'free' | 'pro' | 'enterprise' | 'admin'
          subscription_id: string | null
          memory: any
          preferences: any
          last_active: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          password_hash: string
          role?: 'free' | 'pro' | 'enterprise' | 'admin'
          subscription_id?: string | null
          memory?: any
          preferences?: any
          last_active?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          password_hash?: string
          role?: 'free' | 'pro' | 'enterprise' | 'admin'
          subscription_id?: string | null
          memory?: any
          preferences?: any
          last_active?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      chat_sessions: {
        Row: {
          id: string
          user_id: string
          title: string | null
          metadata: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string | null
          metadata?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string | null
          metadata?: any
          created_at?: string
          updated_at?: string
        }
      }
      chats: {
        Row: {
          id: string
          user_id: string
          session_id: string
          message: string
          role: 'user' | 'assistant' | 'system'
          sources: any
          metadata: any
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          session_id: string
          message: string
          role: 'user' | 'assistant' | 'system'
          sources?: any
          metadata?: any
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          session_id?: string
          message?: string
          role?: 'user' | 'assistant' | 'system'
          sources?: any
          metadata?: any
          created_at?: string
        }
      }
    }
  }
}