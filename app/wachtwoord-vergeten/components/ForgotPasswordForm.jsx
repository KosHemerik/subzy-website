"use client";

import { Button, Input } from "@/components/ui";
import Link from "next/link";
import { useState } from "react";

/**
 * Forgot Password Form Component
 * Handles password reset request with email
 */
export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Er ging iets mis. Probeer het later opnieuw.");
      }

      setIsSubmitted(true);
    } catch (err) {
      setError(err.message || "Er ging iets mis. Probeer het later opnieuw.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <i className="fa-solid fa-envelope-circle-check text-green-600 text-2xl" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-primary mb-2">
            E-mail verzonden!
          </h3>
          <p className="text-gray-600">
            Als er een account bestaat met <strong>{email}</strong>, ontvangt u 
            binnen enkele minuten een e-mail met instructies om uw wachtwoord te resetten.
          </p>
        </div>
        <div className="pt-4 space-y-3">
          <Link
            href="/login"
            className="block w-full text-center bg-secondary hover:bg-accent text-white px-6 py-3 rounded-lg font-medium transition duration-300"
          >
            <i className="fa-solid fa-arrow-left mr-2" />
            Terug naar inloggen
          </Link>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setEmail("");
            }}
            className="text-sm text-secondary hover:text-accent transition"
          >
            Andere e-mail proberen
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-2">
        <p className="text-gray-600 text-sm">
          Voer uw e-mailadres in en wij sturen u een link om uw wachtwoord te resetten.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          <i className="fa-solid fa-circle-exclamation mr-2" />
          {error}
        </div>
      )}

      <Input
        label="E-mailadres"
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="uw@email.nl"
        required
      />

      <Button
        type="submit"
        variant="secondary"
        size="lg"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <i className="fa-solid fa-spinner fa-spin mr-2" />
            Bezig met verzenden...
          </>
        ) : (
          <>
            <i className="fa-solid fa-paper-plane mr-2" />
            Verstuur reset link
          </>
        )}
      </Button>

      <div className="text-center text-sm text-gray-600">
        <Link
          href="/login"
          className="text-secondary hover:text-accent font-medium transition"
        >
          <i className="fa-solid fa-arrow-left mr-1" />
          Terug naar inloggen
        </Link>
      </div>
    </form>
  );
}
