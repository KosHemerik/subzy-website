"use client";

import { supabase } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";


const required = ["voornaam", "achternaam", "email", "telefoon", "adres", "huisnummer", "postcode", "stad"];

export default function AanvraagForm() {
  const searchParams = useSearchParams();
  const calculatorJaren = searchParams.get("jaren") ? parseInt(searchParams.get("jaren")) : null;
  const calculatorUnits = searchParams.get("units") ? parseInt(searchParams.get("units")) : null;
  const calculatorIndicatie = searchParams.get("indicatie") ? parseFloat(searchParams.get("indicatie")) : null;
  const scanSlaagkans = searchParams.get("slagingskans") ? parseInt(searchParams.get("slagingskans"), 10) : null;
  const scanKansLabel = searchParams.get("kansLabel") || "";

  const prefillStraat = searchParams.get("straat") || "";
  const prefillHuisnummer = searchParams.get("huisnummer") || "";
  const prefillPostcode = searchParams.get("postcode") || "";
  const prefillStad = searchParams.get("stad") || "";

  const fallbackAdres = searchParams.get("adres") || "";
  const fallbackAdresMatch = fallbackAdres.match(/^(.+?)\s+(\d+\w*)\s*,\s*(\d{4}\s?[A-Za-z]{2})\s+(.+)$/);
  const fallbackStraat = fallbackAdresMatch?.[1] ?? "";
  const fallbackHuisnummer = fallbackAdresMatch?.[2] ?? "";
  const fallbackPostcode = fallbackAdresMatch?.[3] ?? "";
  const fallbackStad = fallbackAdresMatch?.[4] ?? "";

  const [form, setForm] = useState({
    voornaam: "",
    achternaam: "",
    email: "",
    telefoon: "",
    adres: prefillStraat || fallbackStraat,
    huisnummer: prefillHuisnummer || fallbackHuisnummer,
    postcode: prefillPostcode || fallbackPostcode,
    stad: prefillStad || fallbackStad,
    opmerkingen: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lookupStatus, setLookupStatus] = useState(null); // null | "loading" | "found" | "notfound"
  const lookupTimeout = useRef(null);

  useEffect(() => {
    const postcode = form.postcode.replace(/\s/g, "");
    const huisnummer = form.huisnummer.trim();
    const postcodeValid = /^[1-9][0-9]{3}[a-zA-Z]{2}$/.test(postcode);

    if (!postcodeValid || !huisnummer) {
      setLookupStatus(null);
      return;
    }

    clearTimeout(lookupTimeout.current);
    lookupTimeout.current = setTimeout(async () => {
      setLookupStatus("loading");
      try {
        const res = await fetch(
          `https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?q=${postcode}+${encodeURIComponent(huisnummer)}&fq=type:adres&rows=1`
        );
        const data = await res.json();
        const doc = data?.response?.docs?.[0];
        if (doc?.straatnaam && doc?.woonplaatsnaam) {
          setForm((prev) => ({
            ...prev,
            adres: doc.straatnaam,
            stad: doc.woonplaatsnaam,
          }));
          setErrors((prev) => ({ ...prev, adres: "", stad: "" }));
          setLookupStatus("found");
        } else {
          setLookupStatus("notfound");
        }
      } catch {
        setLookupStatus("notfound");
      }
    }, 500);

    return () => clearTimeout(lookupTimeout.current);
  }, [form.postcode, form.huisnummer]);

  const validate = (name, value) => {
    if (required.includes(name) && !value.trim()) {
      return "Dit veld is verplicht";
    }
    if (name === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Voer een geldig e-mailadres in";
    }
    if (name === "telefoon" && value && !/^[0-9\s\-+()]{10,}$/.test(value)) {
      return "Voer een geldig telefoonnummer in";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    required.forEach((field) => {
      const err = validate(field, form[field]);
      if (err) newErrors[field] = err;
    });
    const emailErr = validate("email", form.email);
    if (emailErr) newErrors.email = emailErr;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const payloadBase = {
        voornaam: form.voornaam.trim(),
        achternaam: form.achternaam.trim(),
        email: form.email.trim(),
        telefoon: form.telefoon.trim(),
        adres: form.adres.trim(),
        huisnummer: form.huisnummer.trim(),
        postcode: form.postcode.trim(),
        stad: form.stad.trim(),
        opmerkingen: form.opmerkingen.trim() || null,
        status: "nieuw",
        calculator_jaren: calculatorJaren,
        calculator_units: calculatorUnits,
        calculator_indicatie: calculatorIndicatie,
      };

      const payloadWithScan = {
        ...payloadBase,
        scan_slaagkans: scanSlaagkans,
        scan_kans_label: scanKansLabel || null,
      };

      const hasScanData = scanSlaagkans !== null || Boolean(scanKansLabel);

      let error;
      if (hasScanData) {
        const res = await supabase.from("energiebelasting_aanvragen").insert([payloadWithScan]);
        error = res.error;

        // If these columns are not yet created in Supabase, retry without them.
        if (error && /scan_slaagkans|scan_kans_label|column/i.test(error.message || "")) {
          const retry = await supabase.from("energiebelasting_aanvragen").insert([payloadBase]);
          error = retry.error;
        }
      } else {
        const res = await supabase.from("energiebelasting_aanvragen").insert([payloadBase]);
        error = res.error;
      }

      if (error) throw error;

      setSubmitted(true);
    } catch {
      setErrors((prev) => ({
        ...prev,
        _form: "Er is iets misgegaan. Probeer het opnieuw of bel ons op +31 71 203 24 05.",
      }));
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (name) =>
    `w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-gray-50 transition ${
      errors[name] ? "border-red-400" : "border-gray-300"
    }`;

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-sm overflow-hidden">
      {/* Calculator result banner */}
      {calculatorIndicatie !== null && (
        <div className="bg-green-50 border-b border-green-100 px-6 py-3 flex items-center gap-3">
          <i className="fa-solid fa-circle-check text-green-500 shrink-0" aria-hidden="true" />
          <p className="text-sm text-green-800">
            Op basis van uw berekening kunt u mogelijk{" "}
            <span className="font-bold">
              €{calculatorIndicatie.toLocaleString("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>{" "}
            terugkrijgen. Vul uw gegevens in om de gratis scan te starten.
          </p>
        </div>
      )}

      {scanSlaagkans !== null && !Number.isNaN(scanSlaagkans) && (
        <div className="bg-blue-50 border-b border-blue-100 px-6 py-3 flex items-center gap-3">
          <i className="fa-solid fa-chart-line text-secondary shrink-0" aria-hidden="true" />
          <p className="text-sm text-blue-800">
            Uw pre-scan toonde een kans van <span className="font-bold">{scanSlaagkans}%</span>
            {scanKansLabel ? <> ({scanKansLabel})</> : null}. Rond uw aanvraag af voor de uitgebreide beoordeling.
          </p>
        </div>
      )}

      {/* Card header — alleen tonen als formulier nog niet verstuurd */}
      {!submitted && (
        <div className="px-6 pt-6 pb-2">
          <h2 className="text-primary font-bold text-xl">Uw gegevens</h2>
          <p className="text-gray-500 text-sm mt-0.5">
            Invullen duurt minder dan 2 minuten
          </p>
        </div>
      )}

      {submitted ? (
        <div className="px-6 py-14 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <i className="fa-solid fa-circle-check text-green-500 text-3xl" aria-hidden="true" />
          </div>
          <h3 className="text-xl font-bold text-primary mb-2">
            Aanvraag ontvangen!
          </h3>
          <p className="text-gray-600">
            Bedankt! Wij nemen binnen 2 werkdagen contact met u op.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="px-6 py-6 space-y-5">
          {/* Section 1 label */}
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Persoonlijke gegevens</p>

          {/* Voornaam + Achternaam */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="voornaam" className={labelClass}>
                Voornaam <span className="text-red-500">*</span>
              </label>
              <input
                id="voornaam"
                type="text"
                name="voornaam"
                value={form.voornaam}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Jan"
                autoComplete="given-name"
                className={inputClass("voornaam")}
                aria-required="true"
                aria-invalid={!!errors.voornaam}
              />
              {errors.voornaam && (
                <p role="alert" className="text-red-500 text-xs mt-1">{errors.voornaam}</p>
              )}
            </div>
            <div>
              <label htmlFor="achternaam" className={labelClass}>
                Achternaam <span className="text-red-500">*</span>
              </label>
              <input
                id="achternaam"
                type="text"
                name="achternaam"
                value={form.achternaam}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="de Vries"
                autoComplete="family-name"
                className={inputClass("achternaam")}
                aria-required="true"
                aria-invalid={!!errors.achternaam}
              />
              {errors.achternaam && (
                <p role="alert" className="text-red-500 text-xs mt-1">{errors.achternaam}</p>
              )}
            </div>
          </div>

          {/* E-mail */}
          <div>
            <label htmlFor="email" className={labelClass}>
              E-mailadres <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="jan@voorbeeld.nl"
              autoComplete="email"
              className={inputClass("email")}
              aria-required="true"
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p role="alert" className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Telefoon */}
          <div>
            <label htmlFor="telefoon" className={labelClass}>
              Telefoonnummer <span className="text-red-500">*</span>
            </label>
            <input
              id="telefoon"
              type="tel"
              name="telefoon"
              value={form.telefoon}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="06 12 34 56 78"
              autoComplete="tel"
              className={inputClass("telefoon")}
              aria-required="true"
              aria-invalid={!!errors.telefoon}
            />
            {errors.telefoon && (
              <p role="alert" className="text-red-500 text-xs mt-1">{errors.telefoon}</p>
            )}
          </div>

          {/* Divider + Section 2 label */}
          <hr className="border-gray-100" />
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Gegevens woning</p>

          {/* Postcode + Huisnummer */}
          <div className="grid grid-cols-[2fr_1fr] gap-4">
            <div>
              <label htmlFor="postcode" className={labelClass}>
                Postcode <span className="text-red-500">*</span>
              </label>
              <input
                id="postcode"
                name="postcode"
                value={form.postcode}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="1234 AB"
                autoComplete="postal-code"
                className={inputClass("postcode")}
                aria-required="true"
                aria-invalid={!!errors.postcode}
              />
              {errors.postcode && (
                <p role="alert" className="text-red-500 text-xs mt-1">{errors.postcode}</p>
              )}
            </div>
            <div>
              <label htmlFor="huisnummer" className={labelClass}>
                Huisnr. <span className="text-red-500">*</span>
              </label>
              <input
                id="huisnummer"
                name="huisnummer"
                value={form.huisnummer}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="12A"
                className={inputClass("huisnummer")}
                aria-required="true"
                aria-invalid={!!errors.huisnummer}
              />
              {errors.huisnummer && (
                <p role="alert" className="text-red-500 text-xs mt-1">{errors.huisnummer}</p>
              )}
            </div>
          </div>

          {/* Adres + Stad (auto-ingevuld) */}
          <div className="grid grid-cols-[2fr_1fr] gap-4">
            <div>
              <label htmlFor="adres" className={labelClass}>
                Straatnaam <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="adres"
                  name="adres"
                  value={form.adres}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Dorpsstraat"
                  autoComplete="address-line1"
                  className={inputClass("adres")}
                  aria-required="true"
                  aria-invalid={!!errors.adres}
                />
                {lookupStatus === "loading" && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                    <i className="fa-solid fa-circle-notch fa-spin" aria-hidden="true" />
                  </span>
                )}
                {lookupStatus === "found" && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-xs">
                    <i className="fa-solid fa-circle-check" aria-hidden="true" />
                  </span>
                )}
              </div>
              {lookupStatus === "notfound" && (
                <p className="text-orange-500 text-xs mt-1">Adres niet gevonden, vul handmatig in</p>
              )}
              {errors.adres && (
                <p role="alert" className="text-red-500 text-xs mt-1">{errors.adres}</p>
              )}
            </div>
            <div>
              <label htmlFor="stad" className={labelClass}>
                Stad <span className="text-red-500">*</span>
              </label>
              <input
                id="stad"
                name="stad"
                value={form.stad}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Amsterdam"
                autoComplete="address-level2"
                className={inputClass("stad")}
                aria-required="true"
                aria-invalid={!!errors.stad}
              />
              {errors.stad && (
                <p role="alert" className="text-red-500 text-xs mt-1">{errors.stad}</p>
              )}
            </div>
          </div>

          {/* Opmerkingen */}
          <div>
            <label htmlFor="opmerkingen" className={labelClass}>
              Eventuele opmerkingen{" "}
              <span className="text-gray-400 font-normal">(optioneel)</span>
            </label>
            <textarea
              id="opmerkingen"
              name="opmerkingen"
              value={form.opmerkingen}
              onChange={handleChange}
              rows={3}
              placeholder="Bijv. meerdere adressen, specifieke situatie..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-gray-50 resize-none transition"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-primary font-bold px-7 py-3 rounded-lg transition duration-300 shadow-lg text-base disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <i className="fa-solid fa-circle-notch fa-spin" aria-hidden="true" />
                Versturen...
              </span>
            ) : (
              <>
                Vraag gratis scan aan{" "}
                <i className="fa-solid fa-arrow-right ml-2" aria-hidden="true" />
              </>
            )}
          </button>

          {errors._form && (
            <p role="alert" className="text-red-500 text-sm text-center">{errors._form}</p>
          )}

          {/* Microcopy */}
          <p className="text-center text-xs text-gray-400">
            <i className="fa-solid fa-lock mr-1" aria-hidden="true" />
            Veilig verwerkt · Geen spam · Geen verplichtingen ·{" "}
            <a href="/privacy" className="underline hover:text-gray-600 transition">
              Privacybeleid
            </a>
          </p>
        </form>
      )}
    </div>
  );
}
