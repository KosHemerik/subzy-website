"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

/**
 * Dashboard Protection Component
 * Ensures only authenticated + active portal owners can access dashboard
 */
export default function DashboardProtection({ children }) {
  const { user, owner, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

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

  // Not logged in → redirect
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-4xl text-secondary mb-4" />
          <p className="text-gray-600">Doorverwijzen naar inloggen...</p>
        </div>
      </div>
    );
  }

  // Logged in but no active owner record
  if (!owner) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <i className="fa-solid fa-circle-exclamation text-4xl text-yellow-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Geen actief portaltoegang</h2>
          <p className="text-gray-600 mb-4">
            Uw account is niet gekoppeld aan een actief dossier. Neem contact op
            met ondersteuning via{" "}
            <a href="tel:+31712032405" className="text-secondary font-medium hover:underline">
              +31 71 203 2405
            </a>.
          </p>
        </div>
      </div>
    );
  }

  return children;
}
