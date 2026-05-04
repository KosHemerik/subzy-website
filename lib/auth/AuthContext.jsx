"use client";

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

  // Check for existing session on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      // Check localStorage for auth token/user data
      const storedUser = localStorage.getItem("subzy_user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password, rememberMe = false) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock user data - replace with actual response
      const userData = {
        id: "1",
        email,
        name: "Jan Jansen",
        avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg",
      };

      setUser(userData);
      
      // Store in localStorage if rememberMe is checked
      if (rememberMe) {
        localStorage.setItem("subzy_user", JSON.stringify(userData));
      } else {
        sessionStorage.setItem("subzy_user", JSON.stringify(userData));
      }

      return { success: true };
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("subzy_user");
    sessionStorage.removeItem("subzy_user");
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
