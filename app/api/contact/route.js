/**
 * Contact Form API Route
 * POST /api/contact
 */
import { NextResponse } from "next/server";
import { sendContactFormEmails } from "@/lib/email";

export async function POST(request) {
  try {
    const body = await request.json();
    const { naam, email, telefoon, onderwerp, bericht } = body;

    // Validate required fields
    if (!naam || !email || !onderwerp || !bericht) {
      return NextResponse.json(
        { error: "Vul alle verplichte velden in" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Ongeldig e-mailadres" },
        { status: 400 }
      );
    }

    // Send emails
    const result = await sendContactFormEmails({
      naam,
      email,
      telefoon,
      onderwerp,
      bericht,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: "Er ging iets mis bij het versturen. Probeer het later opnieuw." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
