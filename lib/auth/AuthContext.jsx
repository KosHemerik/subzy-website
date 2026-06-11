"use client";

import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

/**
 * Auth Provider Component
 * Manages authentication state and provides auth methods
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const mapUser = (supabaseUser) => {
    if (!supabaseUser) return null;

    const metadata = supabaseUser.user_metadata || {};
    const derivedName =
      metadata.full_name ||
      metadata.name ||
      (supabaseUser.email ? supabaseUser.email.split("@")[0] : "Gebruiker");

    return {
      id: supabaseUser.id,
      email: supabaseUser.email,
      name: derivedName,
      avatar:
        metadata.avatar_url ||
        metadata.picture ||
        "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg",
      raw: supabaseUser,
    };
  };

  // Check for existing session on mount
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      await checkAuth();
      if (!isSupabaseConfigured) return;

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!isMounted) return;
        setUser(mapUser(session?.user ?? null));
        setIsLoading(false);
      });

      return subscription;
    };

    let activeSubscription;
    initAuth().then((subscription) => {
      activeSubscription = subscription;
    });

    return () => {
      isMounted = false;
      activeSubscription?.unsubscribe();
    };
  }, []);

  const checkAuth = async () => {
    setIsLoading(true);

    if (!isSupabaseConfigured) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) throw error;
      setUser(mapUser(session?.user ?? null));
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password, rememberMe = false) => {
    void rememberMe;

    if (!isSupabaseConfigured) {
      return {
        success: false,
        error:
          "Supabase is niet geconfigureerd. Voeg NEXT_PUBLIC_SUPABASE_URL en NEXT_PUBLIC_SUPABASE_ANON_KEY toe.",
      };
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        return { success: false, error: "Inloggen mislukt. Controleer uw gegevens." };
      }

      setUser(mapUser(data?.user ?? null));

      return { success: true };
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false, error: "Inloggen mislukt. Controleer uw gegevens." };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout failed:", error);
      }
    }
    router.push("/login");
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
