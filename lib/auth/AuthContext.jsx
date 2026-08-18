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
  const [owner, setOwner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchOwner = async (userId) => {
    if (!userId) { setOwner(null); return null; }
    const { data, error } = await supabase
      .from("owners")
      .select("id, portal_status, displayName, firstName, lastName, emailAddress")
      .eq("portal_user_id", userId)
      .maybeSingle();
    if (error || !data || data.portal_status !== "active") {
      setOwner(null);
      return null;
    }
    const normalizedOwner = {
      ...data,
      name: data.displayName || [data.firstName, data.lastName].filter(Boolean).join(" ") || null,
      email: data.emailAddress || null,
    };
    setOwner(normalizedOwner);
    return normalizedOwner;
  };

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
      } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (!isMounted) return;
        const supabaseUser = session?.user ?? null;
        setUser(mapUser(supabaseUser));
        if (supabaseUser) {
          await fetchOwner(supabaseUser.id);
        } else {
          setOwner(null);
        }
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
      const supabaseUser = session?.user ?? null;
      setUser(mapUser(supabaseUser));
      if (supabaseUser) {
        await fetchOwner(supabaseUser.id);
      } else {
        setOwner(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      setOwner(null);
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

      const ownerData = await fetchOwner(data.user.id);

      if (!ownerData) {
        await supabase.auth.signOut();
        setOwner(null);
        return {
          success: false,
          error: "Uw account heeft geen actief gekoppeld dossier. Neem contact op met ondersteuning.",
        };
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
    setOwner(null);
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
    owner,
    isLoading,
    isAuthenticated: !!user && !!owner,
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
