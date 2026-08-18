/**
 * Forgot Password API Route
 * POST /api/auth/forgot-password
 *
 * Only sends a Supabase password reset email when the address belongs to an
 * owner whose portal access is active. The response is identical either way
 * so the endpoint can't be used to enumerate registered accounts.
 */
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GENERIC_RESPONSE = NextResponse.json({ success: true });

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: "Ongeldig e-mailadres" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const supabase = createServerSupabaseClient();

    // An email can belong to multiple owner rows (one per dossier), so fetch
    // all matches instead of a single row and check if any has an active portal.
    const { data: owners, error } = await supabase
      .from("owners")
      .select("id, portal_status")
      .ilike("emailAddress", normalizedEmail);

    if (error) {
      console.error("Forgot password owner lookup failed:", error);
      return GENERIC_RESPONSE;
    }

    const hasActivePortal = owners?.some((owner) => owner.portal_status === "active");

    if (hasActivePortal) {
      const redirectTo = `${request.nextUrl.origin}/wachtwoord-resetten`;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
        redirectTo,
      });

      if (resetError) {
        console.error("Failed to send password reset email:", resetError);
      }
    }

    return GENERIC_RESPONSE;
  } catch (error) {
    console.error("Forgot password API error:", error);
    return GENERIC_RESPONSE;
  }
}
