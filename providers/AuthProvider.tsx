import { createContext, useContext, useEffect, useState } from 'react';
import { Session, SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';

interface AuthContextType {
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  supabaseClient: SupabaseClient; // Add Supabase client
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
  signOut: async () => {},
  signIn: async () => {},
  signUp: async () => {},
  supabaseClient: supabase, // Initialize with supabase instance
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const sessionSubscription = supabase.auth.onAuthStateChange(
      async (_, session) => {
        setSession(session);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    return () => {
      sessionSubscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setSession(null);
      router.replace('/login'); // Redirect to login
    } catch (error: any) {
      console.error('Sign out error:', error);
      // Handle sign-out error appropriately (e.g., display an error message)
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        console.error('Sign in error:', error);
        throw new Error(error.message);
      } else {
        setSession(data.session);
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        console.error('Sign up error:', error);
        throw new Error(error.message);
      } else {
        setSession(data.session);
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ session, loading, signOut, signIn, signUp, supabaseClient: supabase }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
