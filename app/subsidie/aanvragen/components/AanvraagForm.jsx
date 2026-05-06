"use client";

import { supabase } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const MAATREGEL_OPTIONS = [
  { value: "warmtepomp", label: "Warmtepomp" },
  { value: "zonneboiler", label: "Zonneboiler" },
  { value: "isolatie", label: "Isolatie & glas" },
  { value: "elektrisch", label: "Elektrische kookvoorziening" },
  { value: "combinatie", label: "Combinatie van meerdere maatregelen" },
  { value: "onbekend", label: "Weet ik nog niet" },
];

const ISOLATIE_TYPE_OPTIONS = [
  { value: "dakisolatie", label: "Dakisolatie" },
  { value: "gevelisolatie", label: "Gevelisolatie" },
  { value: "spouwmuurisolatie", label: "Spouwmuurisolatie" },
  { value: "vloerisolatie", label: "Vloerisolatie" },
  { value: "glasisolatie", label: "Glasisolatie / HR++ glas" },
  { value: "vlieringvloer", label: "Zolder- of vlieringvloerisolatie" },
  { value: "bodemeisolatie", label: "Bodemeisolatie" },
  { value: "combinatie_isolatie", label: "Combinatie van meerdere isolatiesoorten" },
];

const JAAR_OPTIONS = ["2020", "2021", "2022", "2023", "2024", "2025", "2026"];

const DOELGROEP_REGELING = {
  particulier: "ISDE",
  verhuurder: "SVOH",
  vve: "SVOH",
};

const REQUIRED_FIELDS = ["voornaam", "achternaam", "email", "telefoon", "maatregel", "al_geinstalleerd"];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES = 3;
const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/png"];

function validate(name, value) {
  if (REQUIRED_FIELDS.includes(name) && (value === "" || value === null || value === undefined)) {
    return "Dit veld is verplicht";
  }
  if (name === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return "Voer een geldig e-mailadres in";
  }
  return "";
}

export default function AanvraagForm() {
  const searchParams = useSearchParams();

  const [form, setForm] = useState({
    voornaam: "",
    achternaam: "",
    email: "",
    telefoon: "",
    maatregel: "",
    isolatie_type: "",
    al_geinstalleerd: "",
    installatiejaar: "",
    opmerkingen: "",
  });
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Read URL params on mount
  useEffect(() => {
    const maatregel = searchParams.get("maatregel") || "";
    setForm((prev) => ({ ...prev, maatregel }));
  }, [searchParams]);

  const doelgroep = searchParams.get("doelgroep") || "particulier";
  const regeling = DOELGROEP_REGELING[doelgroep] || "ISDE";

  const showIsolatieType = form.maatregel === "isolatie";
  const showInstallatiejaar = form.al_geinstalleerd === "ja";

  const inputClass = (name) =>
    `w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-gray-50 transition ${
      errors[name] ? "border-red-400" : "border-gray-200"
    }`;

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
    }
    // Clear isolatie_type when maatregel changes away from isolatie
    if (name === "maatregel" && value !== "isolatie") {
      setForm((prev) => ({ ...prev, maatregel: value, isolatie_type: "" }));
    }
    // Clear installatiejaar when switching to "nee"
    if (name === "al_geinstalleerd" && value === "nee") {
      setForm((prev) => ({ ...prev, al_geinstalleerd: "nee", installatiejaar: "" }));
    }
  };

  const handleBlur = (name, value) => {
    const err = validate(name, value);
    if (err) setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const handleFiles = (newFiles) => {
    const valid = [];
    for (const f of newFiles) {
      if (!ACCEPTED_TYPES.includes(f.type)) continue;
      if (f.size > MAX_FILE_SIZE) continue;
      if (files.length + valid.length >= MAX_FILES) break;
      valid.push(f);
    }
    setFiles((prev) => [...prev, ...valid].slice(0, MAX_FILES));
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(Array.from(e.dataTransfer.files));
  };

  const uploadFiles = async () => {
    if (files.length === 0) return [];
    const urls = [];
    for (const file of files) {
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("facturen").upload(path, file);
      if (error) throw error;
      const { data } = supabase.storage.from("facturen").getPublicUrl(path);
      urls.push(data.publicUrl);
    }
    return urls;
  };

  const handleSubmit = async () => {
    const newErrors = {};
    REQUIRED_FIELDS.forEach((field) => {
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
    setSubmitError("");

    try {
      const factuur_urls = await uploadFiles();

      const payload = {
        voornaam: form.voornaam.trim(),
        achternaam: form.achternaam.trim(),
        email: form.email.trim(),
        telefoon: form.telefoon.trim(),
        maatregel: form.maatregel,
        isolatie_type: showIsolatieType ? form.isolatie_type || null : null,
        al_geinstalleerd: form.al_geinstalleerd === "ja",
        installatiejaar: showInstallatiejaar ? form.installatiejaar || null : null,
        opmerkingen: form.opmerkingen.trim() || null,
        factuur_urls: factuur_urls.length > 0 ? factuur_urls : null,
        doelgroep,
        regeling,
        status: "nieuw",
      };

      const { error } = await supabase.from("subsidie_aanvragen").insert([payload]);
      if (error) throw error;

      setSubmitted(true);
    } catch {
      setSubmitError("Er is iets misgegaan. Probeer het opnieuw of bel ons op 06 81 41 49 67.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-sm px-6 py-14 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <i className="fa-solid fa-circle-check text-secondary text-3xl" />
        </div>
        <h3 className="text-xl font-bold text-primary mb-2">Bedankt voor uw aanvraag!</h3>
        <p className="text-gray-600 mb-3">
          Wij nemen binnen 2 werkdagen contact met u op om uw situatie te bespreken.
        </p>
        <p className="text-sm text-gray-400">Een bevestiging is verstuurd naar uw e-mailadres.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-sm overflow-hidden">
      {/* Card header */}
      <div className="px-6 pt-6 pb-4">
        <h2 className="text-primary font-bold text-xl">Uw gegevens</h2>
        <p className="text-gray-500 text-sm mt-0.5">Invullen duurt minder dan 3 minuten</p>
      </div>

      <div className="px-6 pb-6 space-y-5">
        {/* Section 1 */}
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          Persoonlijke gegevens
        </p>

        {/* Voornaam + Achternaam */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              Voornaam <span className="text-red-500">*</span>
            </label>
            <input
              name="voornaam"
              value={form.voornaam}
              onChange={(e) => handleChange("voornaam", e.target.value)}
              onBlur={(e) => handleBlur("voornaam", e.target.value)}
              placeholder="Jan"
              className={inputClass("voornaam")}
            />
            {errors.voornaam && <p className="text-red-500 text-xs mt-1">{errors.voornaam}</p>}
          </div>
          <div>
            <label className={labelClass}>
              Achternaam <span className="text-red-500">*</span>
            </label>
            <input
              name="achternaam"
              value={form.achternaam}
              onChange={(e) => handleChange("achternaam", e.target.value)}
              onBlur={(e) => handleBlur("achternaam", e.target.value)}
              placeholder="de Vries"
              className={inputClass("achternaam")}
            />
            {errors.achternaam && <p className="text-red-500 text-xs mt-1">{errors.achternaam}</p>}
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
            onChange={(e) => handleChange("email", e.target.value)}
            onBlur={(e) => handleBlur("email", e.target.value)}
            placeholder="jan@voorbeeld.nl"
            className={inputClass("email")}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
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
            onChange={(e) => handleChange("telefoon", e.target.value)}
            onBlur={(e) => handleBlur("telefoon", e.target.value)}
            placeholder="06 12 34 56 78"
            className={inputClass("telefoon")}
          />
          {errors.telefoon && <p className="text-red-500 text-xs mt-1">{errors.telefoon}</p>}
        </div>

        {/* Divider + Section 2 */}
        <hr className="border-gray-100" />
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Uw situatie</p>

        {/* Maatregel dropdown */}
        <div>
          <label className={labelClass}>
            Voor welke maatregel wilt u subsidie? <span className="text-red-500">*</span>
          </label>
          <select
            value={form.maatregel}
            onChange={(e) => handleChange("maatregel", e.target.value)}
            onBlur={(e) => handleBlur("maatregel", e.target.value)}
            className={inputClass("maatregel")}
          >
            <option value="">Selecteer een maatregel</option>
            {MAATREGEL_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {errors.maatregel && <p className="text-red-500 text-xs mt-1">{errors.maatregel}</p>}
        </div>

        {/* Isolatie type — conditional */}
        {showIsolatieType && (
          <div>
            <label className={labelClass}>Welk type isolatie?</label>
            <select
              value={form.isolatie_type}
              onChange={(e) => handleChange("isolatie_type", e.target.value)}
              className={inputClass("isolatie_type")}
            >
              <option value="">Selecteer type isolatie</option>
              {ISOLATIE_TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Al geïnstalleerd — radio */}
        <div>
          <label className={labelClass}>
            Is de maatregel al geïnstalleerd? <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-6 mt-2">
            {[
              { value: "ja", label: "Ja, al geïnstalleerd" },
              { value: "nee", label: "Nee, nog te installeren" },
            ].map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                <input
                  type="radio"
                  name="al_geinstalleerd"
                  value={opt.value}
                  checked={form.al_geinstalleerd === opt.value}
                  onChange={() => handleChange("al_geinstalleerd", opt.value)}
                  className="accent-secondary w-4 h-4"
                />
                {opt.label}
              </label>
            ))}
          </div>
          {errors.al_geinstalleerd && (
            <p className="text-red-500 text-xs mt-1">{errors.al_geinstalleerd}</p>
          )}
        </div>

        {/* Installatiejaar — conditional */}
        {showInstallatiejaar && (
          <div>
            <label className={labelClass}>In welk jaar is de maatregel geïnstalleerd?</label>
            <select
              value={form.installatiejaar}
              onChange={(e) => handleChange("installatiejaar", e.target.value)}
              className={inputClass("installatiejaar")}
            >
              <option value="">Selecteer een jaar</option>
              {JAAR_OPTIONS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* File upload */}
        <div>
          <label className={labelClass}>
            Factuur uploaden{" "}
            <span className="text-gray-400 font-normal">(optioneel)</span>
          </label>
          <p className="text-xs text-gray-400 mb-2">
            Heeft u al een factuur? Upload deze dan alvast — zo kunnen wij u sneller helpen.
          </p>
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => document.getElementById("factuur-input").click()}
            className={`border-2 border-dashed rounded-xl px-4 py-6 text-center cursor-pointer transition ${
              dragOver
                ? "border-secondary bg-blue-50"
                : "border-gray-200 hover:border-secondary hover:bg-gray-50"
            }`}
          >
            <i className="fa-solid fa-cloud-arrow-up text-gray-400 text-2xl mb-2" />
            <p className="text-sm text-gray-500">Selecteer of sleep uw factuur hierheen</p>
            <p className="text-xs text-gray-400 mt-1">PDF, JPG of PNG · max 10MB · max 3 bestanden</p>
            <input
              id="factuur-input"
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => handleFiles(Array.from(e.target.files))}
            />
          </div>

          {files.length > 0 && (
            <ul className="mt-2 space-y-1">
              {files.map((f, i) => (
                <li key={i} className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                  <span className="truncate max-w-[80%]">
                    <i className="fa-solid fa-file text-secondary mr-2" />
                    {f.name}
                  </span>
                  <button
                    onClick={() => removeFile(i)}
                    className="text-gray-400 hover:text-red-500 transition ml-2"
                  >
                    <i className="fa-solid fa-xmark" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Opmerkingen */}
        <div>
          <label className={labelClass}>
            Eventuele opmerkingen{" "}
            <span className="text-gray-400 font-normal">(optioneel)</span>
          </label>
          <textarea
            value={form.opmerkingen}
            onChange={(e) => handleChange("opmerkingen", e.target.value)}
            rows={3}
            placeholder="Bijv. type warmtepomp, aantal m2 isolatie, specifieke situatie..."
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-gray-50 resize-none transition"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-primary font-bold px-8 py-4 rounded-[12px] transition duration-300 shadow-lg text-lg disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <i className="fa-solid fa-circle-notch fa-spin" />
              Versturen...
            </span>
          ) : (
            <>Vraag gratis beoordeling aan <i className="fa-solid fa-arrow-right ml-2" /></>
          )}
        </button>

        {/* Error message */}
        {submitError && (
          <p className="text-red-500 text-sm text-center">{submitError}</p>
        )}

        {/* Microcopy */}
        <p className="text-center text-xs text-gray-400">
          🔒 Veilig verwerkt · Geen verplichtingen · Honorarium 20% excl. BTW — alleen bij succes
        </p>
      </div>
    </div>
  );
}
