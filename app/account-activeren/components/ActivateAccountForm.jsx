"use client";

import { Button } from "@/components/ui";
import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ActivateAccountForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("checking");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    let isMounted = true;

    const initFromInviteLink = async () => {
      if (!isSupabaseConfigured) {
        if (isMounted) {
          setStatus("invalid");
          setError("Supabase is niet geconfigureerd voor authenticatie.");
        }
        return;
      }

      try {
        const code = searchParams.get("code");
        const tokenHash = searchParams.get("token_hash");
        const type = searchParams.get("type");

        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
        }

        if (tokenHash && type) {
          const allowedTypes = ["invite", "recovery", "magiclink", "signup", "email"];
          if (allowedTypes.includes(type)) {
            const { error: verifyError } = await supabase.auth.verifyOtp({
              token_hash: tokenHash,
              type,
            });
            if (verifyError) throw verifyError;
          }
        }

        if (typeof window !== "undefined" && window.location.hash) {
          const hashParams = new URLSearchParams(window.location.hash.slice(1));
          const accessToken = hashParams.get("access_token");
          const refreshToken = hashParams.get("refresh_token");

          if (accessToken && refreshToken) {
            const { error: setSessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            if (setSessionError) throw setSessionError;

            window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
          }
        }

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (!session?.user) {
          if (isMounted) {
            setStatus("invalid");
            setError("Deze uitnodigingslink is ongeldig of verlopen.");
          }
          return;
        }

        if (isMounted) {
          setEmail(session.user.email || "");
          setStatus("ready");
          setError("");
        }
      } catch (err) {
        if (isMounted) {
          setStatus("invalid");
          setError(err?.message || "Deze uitnodigingslink is ongeldig of verlopen.");
        }
      }
    };

    initFromInviteLink();

    return () => {
      isMounted = false;
    };
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Gebruik minimaal 8 tekens voor uw wachtwoord.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Wachtwoorden komen niet overeen.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;

      // Sign out so the owner is required to sign in fresh; this guarantees
      // last_sign_in_at updates and the portal_status auto-activate trigger fires.
      await supabase.auth.signOut();

      setStatus("success");
      setTimeout(() => {
        router.replace("/login");
      }, 1500);
    } catch (err) {
      setError(err?.message || "Wachtwoord instellen mislukt. Probeer het opnieuw.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "checking") {
    return (
      <div className="text-center py-4">
        <i className="fa-solid fa-spinner fa-spin text-2xl text-secondary mb-3" />
        <p className="text-sm text-gray-600">Uitnodigingslink controleren...</p>
      </div>
    );
  }

  if (status === "invalid") {
    return (
      <div className="space-y-6 text-center">
        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto">
          <i className="fa-solid fa-triangle-exclamation text-red-500 text-xl" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-primary mb-2">Link niet geldig</h3>
          <p className="text-gray-600 text-sm">{error || "Deze uitnodigingslink is ongeldig of verlopen."}</p>
        </div>
        <Link href="/login" className="inline-flex items-center text-secondary hover:text-accent font-medium transition">
          <i className="fa-solid fa-arrow-left mr-2" />
          Terug naar inloggen
        </Link>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="space-y-6 text-center">
        <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto">
          <i className="fa-solid fa-circle-check text-green-600 text-xl" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-primary mb-2">Gelukt</h3>
          <p className="text-gray-600 text-sm">Uw wachtwoord is ingesteld. U wordt doorgestuurd naar de inlogpagina.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {email && (
        <div className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
          Account: <span className="font-medium text-gray-700">{email}</span>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          <i className="fa-solid fa-circle-exclamation mr-2" />
          {error}
        </div>
      )}

      <div>
        <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
          Nieuw wachtwoord <span className="text-red-500">*</span>
        </label>
        <input
          id="new-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-gray-50"
          placeholder="Minimaal 8 tekens"
        />
      </div>

      <div>
        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
          Herhaal wachtwoord <span className="text-red-500">*</span>
        </label>
        <input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-gray-50"
          placeholder="Herhaal uw wachtwoord"
        />
      </div>

      <Button type="submit" variant="secondary" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <i className="fa-solid fa-spinner fa-spin mr-2" />
            Opslaan...
          </>
        ) : (
          <>
            <i className="fa-solid fa-check mr-2" />
            Wachtwoord instellen
          </>
        )}
      </Button>
    </form>
  );
}
