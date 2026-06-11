"use client";

import { Button, Input } from "@/components/ui";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * Login Form Component
 * Handles user authentication with email and password
 */
export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await login(formData.email, formData.password, formData.rememberMe);
    
    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error || "Inloggen mislukt. Controleer uw gegevens.");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div role="alert" className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          <i aria-hidden="true" className="fa-solid fa-circle-exclamation mr-2" />
          {error}
        </div>
      )}

      <Input
        label="E-mailadres"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="uw@email.nl"
        required
      />

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Wachtwoord <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-gray-50"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-0 px-4 flex items-center text-gray-400 hover:text-gray-600 transition"
            aria-label={showPassword ? "Wachtwoord verbergen" : "Wachtwoord tonen"}
          >
            <i aria-hidden="true" className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
            className="w-4 h-4 text-secondary border-gray-300 rounded focus:ring-secondary"
          />
          <span className="ml-2 text-sm text-gray-600">Onthoud mij</span>
        </label>

        <Link
          href="/wachtwoord-vergeten"
          className="text-sm text-secondary hover:text-accent transition"
        >
          Wachtwoord vergeten?
        </Link>
      </div>

      <Button
        type="submit"
        variant="secondary"
        size="lg"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <i aria-hidden="true" className="fa-solid fa-spinner fa-spin mr-2" />
            Bezig met inloggen...
          </>
        ) : (
          <>
            <i aria-hidden="true" className="fa-solid fa-right-to-bracket mr-2" />
            Inloggen
          </>
        )}
      </Button>

    </form>
  );
}
