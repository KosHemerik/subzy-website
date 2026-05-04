"use client";

import { useState, useEffect, useRef } from "react";


const required = ["voornaam", "achternaam", "email", "telefoon", "adres", "huisnummer", "postcode", "stad"];

export default function AanvraagForm() {
  const [form, setForm] = useState({
    voornaam: "",
    achternaam: "",
    email: "",
    telefoon: "",
    adres: "",
    huisnummer: "",
    postcode: "",
    stad: "",
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
    // Simulate submission
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSubmitted(true);
  };

  const inputClass = (name) =>
    `w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-gray-50 transition ${
      errors[name] ? "border-red-400" : "border-gray-300"
    }`;

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-sm overflow-hidden">
      {/* Card header */}
      <div className="px-6 pt-6 pb-2">
        <h2 className="text-primary font-bold text-xl">Uw gegevens</h2>
        <p className="text-gray-500 text-sm mt-0.5">
          Invullen duurt minder dan 2 minuten
        </p>
      </div>

      {submitted ? (
        <div className="px-6 py-14 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <i className="fa-solid fa-circle-check text-green-500 text-3xl" />
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
              <label className={labelClass}>
                Voornaam <span className="text-red-500">*</span>
              </label>
              <input
                name="voornaam"
                value={form.voornaam}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Jan"
                className={inputClass("voornaam")}
              />
              {errors.voornaam && (
                <p className="text-red-500 text-xs mt-1">{errors.voornaam}</p>
              )}
            </div>
            <div>
              <label className={labelClass}>
                Achternaam <span className="text-red-500">*</span>
              </label>
              <input
                name="achternaam"
                value={form.achternaam}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="de Vries"
                className={inputClass("achternaam")}
              />
              {errors.achternaam && (
                <p className="text-red-500 text-xs mt-1">{errors.achternaam}</p>
              )}
            </div>
          </div>

          {/* E-mail */}
          <div>
            <label className={labelClass}>
              E-mailadres <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="jan@voorbeeld.nl"
              className={inputClass("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Telefoon */}
          <div>
            <label className={labelClass}>
              Telefoonnummer <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="telefoon"
              value={form.telefoon}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="06 12 34 56 78"
              className={inputClass("telefoon")}
            />
            {errors.telefoon && (
              <p className="text-red-500 text-xs mt-1">{errors.telefoon}</p>
            )}
          </div>

          {/* Divider + Section 2 label */}
          <hr className="border-gray-100" />
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Gegevens woning</p>

          {/* Postcode + Huisnummer */}
          <div className="grid grid-cols-[2fr_1fr] gap-4">
            <div>
              <label className={labelClass}>
                Postcode <span className="text-red-500">*</span>
              </label>
              <input
                name="postcode"
                value={form.postcode}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="1234 AB"
                className={inputClass("postcode")}
              />
              {errors.postcode && (
                <p className="text-red-500 text-xs mt-1">{errors.postcode}</p>
              )}
            </div>
            <div>
              <label className={labelClass}>
                Huisnr. <span className="text-red-500">*</span>
              </label>
              <input
                name="huisnummer"
                value={form.huisnummer}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="12A"
                className={inputClass("huisnummer")}
              />
              {errors.huisnummer && (
                <p className="text-red-500 text-xs mt-1">{errors.huisnummer}</p>
              )}
            </div>
          </div>

          {/* Adres + Stad (auto-ingevuld) */}
          <div className="grid grid-cols-[2fr_1fr] gap-4">
            <div>
              <label className={labelClass}>
                Straatnaam <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  name="adres"
                  value={form.adres}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Wordt automatisch ingevuld"
                  className={inputClass("adres")}
                />
                {lookupStatus === "loading" && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                    <i className="fa-solid fa-circle-notch fa-spin" />
                  </span>
                )}
                {lookupStatus === "found" && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-xs">
                    <i className="fa-solid fa-circle-check" />
                  </span>
                )}
              </div>
              {lookupStatus === "notfound" && (
                <p className="text-orange-500 text-xs mt-1">Adres niet gevonden, vul handmatig in</p>
              )}
              {errors.adres && (
                <p className="text-red-500 text-xs mt-1">{errors.adres}</p>
              )}
            </div>
            <div>
              <label className={labelClass}>
                Stad <span className="text-red-500">*</span>
              </label>
              <input
                name="stad"
                value={form.stad}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Wordt automatisch ingevuld"
                className={inputClass("stad")}
              />
              {errors.stad && (
                <p className="text-red-500 text-xs mt-1">{errors.stad}</p>
              )}
            </div>
          </div>

          {/* Opmerkingen */}
          <div>
            <label className={labelClass}>
              Eventuele opmerkingen{" "}
              <span className="text-gray-400 font-normal">(optioneel)</span>
            </label>
            <textarea
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
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-primary font-bold px-8 py-4 rounded-[12px] transition duration-300 shadow-lg text-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <i className="fa-solid fa-circle-notch fa-spin" />
                Versturen...
              </span>
            ) : (
              <>
                Vraag gratis scan aan{" "}
                <i className="fa-solid fa-arrow-right ml-2" />
              </>
            )}
          </button>

          {/* Microcopy */}
          <p className="text-center text-xs text-gray-400">
            🔒 Veilig verwerkt · Geen spam · Geen verplichtingen
          </p>
        </form>
      )}
    </div>
  );
}
