"use client";

import { AuthProvider } from "@/lib/auth";

/**
 * Client-side wrapper for AuthProvider
 * Needed because AuthProvider uses client hooks
 */
export default function AuthProviderWrapper({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
