import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  useEffect(() => {
    let mounted = true;
    console.log("AuthProvider: Initializing...");

    // Safety timeout to prevent infinite loading
    const safetyTimeout = setTimeout(() => {
      if (mounted && loading) {
        console.warn("AuthProvider: Initialization timed out, forcing loading to false");
        setLoading(false);
      }
    }, 5000); // 5 seconds timeout

    // Helper to check admin status
    const checkAdminRole = async (userId: string) => {
      try {
        console.log("AuthProvider: Checking admin role...");
        
        // Try RPC first (bypasses RLS)
        // We pass the role as a string, Supabase/Postgres should handle the enum cast
        const { data: rpcData, error: rpcError } = await supabase
          .rpc('has_role', { _user_id: userId, _role: 'admin' });

        if (!rpcError) {
          console.log("AuthProvider: RPC check result:", rpcData);
          if (mounted) setIsAdmin(!!rpcData);
          return;
        }

        console.warn("AuthProvider: RPC check failed/unavailable, falling back to table query:", rpcError);

        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId)
          .eq('role', 'admin')
          .maybeSingle();
        
        if (error) {
          console.error("AuthProvider: Error querying user_roles:", error);
        }

        if (mounted) {
          setIsAdmin(!!data);
          console.log("AuthProvider: Admin role check result:", !!data);
        }
      } catch (error) {
        console.error('AuthProvider: Exception checking admin role:', error);
        if (mounted) setIsAdmin(false);
      }
    };

    // Initialize auth state
    const initializeAuth = async () => {
      try {
        console.log("AuthProvider: Getting session...");
        
        // Use a timeout promise for the session check as well
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Session check timed out")), 4000)
        );

        const result = await Promise.race([sessionPromise, timeoutPromise]) as { data: { session: Session | null } };
        const initialSession = result.data.session;
        
        console.log("AuthProvider: Session retrieved:", initialSession ? "Session found" : "No session");

        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          
          if (initialSession?.user) {
            const email = (initialSession.user.email || '').toLowerCase();
            if (ADMIN_EMAILS.includes(email)) {
              setIsAdmin(true);
            } else {
              await checkAdminRole(initialSession.user.id);
            }
          } else {
            setIsAdmin(false);
          }
          console.log("AuthProvider: Initialization complete");
          setLoading(false);
        }
      } catch (error) {
        console.error('AuthProvider: Error initializing auth:', error);
        if (mounted) setLoading(false);
      } finally {
        clearTimeout(safetyTimeout);
      }
    };

    initializeAuth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log(`AuthProvider: Auth state changed: ${event}`);
        if (!mounted) return;

        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          const email = (currentSession.user.email || '').toLowerCase();
          if (ADMIN_EMAILS.includes(email)) {
            setIsAdmin(true);
          } else {
            await checkAdminRole(currentSession.user.id);
          }
        } else {
          setIsAdmin(false);
        }
        
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      clearTimeout(safetyTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin
        }
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (!error) {
        setUser(null);
        setSession(null);
        setIsAdmin(false);
      }
      return { error };
    } catch (error) {
      return { error };
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
