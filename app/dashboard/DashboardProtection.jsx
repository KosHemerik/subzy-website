"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

/**
 * Dashboard Protection Component
 * Ensures only authenticated users can access dashboard
 */
export default function DashboardProtection({ children }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-4xl text-secondary mb-4" />
          <p className="text-gray-600">Laden...</p>
        </div>
      </div>
    );
  }

  // Show redirect message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-4xl text-secondary mb-4" />
          <p className="text-gray-600">Doorverwijzen naar inloggen...</p>
        </div>
      </div>
    );
  }

  return children;
}
