"use client";

import { useState } from "react";
import { Button, Input, Select, Textarea } from "@/components/ui";

const SUBJECT_OPTIONS = [
  { value: "", label: "Kies een onderwerp..." },
  { value: "energiebelasting", label: "Vraag over Teruggave Energiebelasting" },
  { value: "subsidie", label: "Vraag over Duurzaamheidssubsidie" },
  { value: "lopende_aanvraag", label: "Vraag over lopende aanvraag" },
  { value: "klantportaal", label: "Probleem met Klantportaal" },
  { value: "anders", label: "Anders" },
];

/**
 * Contact Form Component
 * Handles contact form submission
 */
export default function ContactForm() {
  const [formData, setFormData] = useState({
    naam: "",
    email: "",
    telefoon: "",
    onderwerp: "",
    bericht: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Er ging iets mis");
      }

      setIsSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-12 space-y-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <i className="fa-solid fa-check text-green-600 text-2xl" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-primary mb-2">
            Bericht verzonden!
          </h3>
          <p className="text-gray-600">
            Bedankt voor uw bericht. Wij nemen binnen 1 werkdag contact met u op.
          </p>
        </div>
        <button
          onClick={() => {
            setIsSubmitted(false);
            setFormData({
              naam: "",
              email: "",
              telefoon: "",
              onderwerp: "",
              bericht: "",
            });
          }}
          className="text-secondary hover:text-accent font-medium transition"
        >
          Nog een bericht versturen
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <i className="fa-solid fa-circle-exclamation mr-2" />
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Naam"
          type="text"
          name="naam"
          value={formData.naam}
          onChange={handleChange}
          placeholder="Uw volledige naam"
          required
        />
        <Input
          label="E-mailadres"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="uw@email.nl"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Telefoonnummer"
          type="tel"
          name="telefoon"
          value={formData.telefoon}
          onChange={handleChange}
          placeholder="06 12345678"
        />
        <Select
          label="Onderwerp"
          name="onderwerp"
          value={formData.onderwerp}
          onChange={handleChange}
          options={SUBJECT_OPTIONS}
          required
        />
      </div>

      <Textarea
        label="Uw bericht"
        name="bericht"
        value={formData.bericht}
        onChange={handleChange}
        placeholder="Typ hier uw bericht of vraag..."
        rows={5}
        required
      />

      <Button
        type="submit"
        variant="secondary"
        size="lg"
        className="w-full md:w-auto"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <i className="fa-solid fa-spinner fa-spin mr-2" />
            Bezig met verzenden...
          </>
        ) : (
          <>
            Verstuur bericht
            <i className="fa-solid fa-paper-plane ml-2" />
          </>
        )}
      </Button>
    </form>
  );
}
