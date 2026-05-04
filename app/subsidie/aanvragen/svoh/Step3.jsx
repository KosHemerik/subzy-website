"use client";

import { SmartAddressInput } from "@/components/wizard/SmartAddressInput";
import { Check, X } from "lucide-react";
import { useState } from "react";
import {
    InputField,
    NavigationButtons,
    RadioGroup,
    Tooltip,
} from "./components";
import { defaultAdres } from "./reducer";

function formatIban(raw) {
  const clean = raw.replace(/\s/g, "").toUpperCase();
  return clean.match(/.{1,4}/g)?.join(" ") ?? clean;
}

function isValidNlIban(val) {
  const clean = val.replace(/\s/g, "");
  return /^NL\d{2}[A-Z]{4}\d{10}$/.test(clean);
}

function IbanField({ value, onChange, error }) {
  const [touched, setTouched] = useState(false);
  const valid = isValidNlIban(value);
  const showError = touched && value.replace(/\s/g, "").length > 0 && !valid;

  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1">
        <label className="block text-sm font-medium text-gray-700">
          IBAN <span className="text-red-500">*</span>
        </label>
        <Tooltip text="Dit is nodig zodat de Belastingdienst de subsidie direct op uw rekening kan uitkeren." />
      </div>
      <div className="relative">
        <input
          type="text"
          inputMode="text"
          value={value}
          onChange={(e) => onChange(formatIban(e.target.value))}
          onBlur={() => setTouched(true)}
          placeholder="NL00 BANK 0000 0000 00"
          autoComplete="off"
          className={`w-full border rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-gray-50 transition tracking-wider ${
            error || showError ? "border-red-400" : valid ? "border-green-400" : "border-gray-200"
          }`}
        />
        {valid && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
            <Check size={16} strokeWidth={2.5} />
          </span>
        )}
        {showError && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400">
            <X size={16} strokeWidth={2.5} />
          </span>
        )}
      </div>
      {(error || showError) && (
        <p className="text-red-500 text-xs mt-1">
          {error ?? "Voer een geldig NL IBAN in (bijv. NL91 ABNA 0417 1643 00)"}
        </p>
      )}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest pt-1">
      {children}
    </p>
  );
}

function BsnField({ value, onChange, error }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1">
        <label className="block text-sm font-medium text-gray-700">
          BSN-nummer <span className="text-red-500">*</span>
        </label>
        <Tooltip text="Uw BSN-nummer is nodig voor de subsidieaanvraag bij RVO. Dit wordt veilig verwerkt en niet gedeeld met derden." />
      </div>
      <input
        type={focused ? "text" : "password"}
        inputMode="numeric"
        maxLength={9}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 9))}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="123456789"
        autoComplete="off"
        className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-gray-50 transition tracking-widest ${
          error ? "border-red-400" : "border-gray-200"
        }`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

function BedrijfForm({ data, dispatch, errors }) {
  const upd = (field, value) => dispatch({ type: "UPDATE_BEDRIJF", payload: { [field]: value } });
  return (
    <div className="space-y-5">
      <SectionLabel>Bedrijfsgegevens</SectionLabel>
      <InputField label="KvK-nummer" required value={data.kvk_nummer} onChange={(e) => upd("kvk_nummer", e.target.value)} placeholder="12345678" error={errors.kvk_nummer} />
      <InputField label="Bedrijfsnaam" required value={data.bedrijfsnaam} onChange={(e) => upd("bedrijfsnaam", e.target.value)} placeholder="Mijn BV" error={errors.bedrijfsnaam} />
      <IbanField value={data.iban} onChange={(v) => upd("iban", v)} error={errors.iban} />
      <RadioGroup label="Werken er meer dan 250 mensen in uw organisatie?" required value={data.meer_dan_250} onChange={(v) => upd("meer_dan_250", v)} options={[{ value: "ja", label: "Ja" }, { value: "nee", label: "Nee" }]} error={errors.meer_dan_250} />
      <hr className="border-gray-100" />
      <SectionLabel>Contactpersoon</SectionLabel>
      <InputField label="Voorletters" required value={data.voorletters} onChange={(e) => upd("voorletters", e.target.value)} placeholder="J.A." error={errors.voorletters} />
      <InputField label="Tussenvoegsel" value={data.tussenvoegsel} onChange={(e) => upd("tussenvoegsel", e.target.value)} placeholder="de" />
      <InputField label="Achternaam" required value={data.achternaam} onChange={(e) => upd("achternaam", e.target.value)} placeholder="Vries" error={errors.achternaam} />
      <RadioGroup label="Geslacht" required value={data.geslacht} onChange={(v) => upd("geslacht", v)} options={[{ value: "man", label: "Man" }, { value: "vrouw", label: "Vrouw" }, { value: "anders", label: "Anders" }]} error={errors.geslacht} />
      <InputField label="Telefoonnummer" required type="tel" value={data.telefoon} onChange={(e) => upd("telefoon", e.target.value)} placeholder="06 12 34 56 78" error={errors.telefoon} />
      <InputField label="E-mailadres" required type="email" value={data.email} onChange={(e) => upd("email", e.target.value)} placeholder="info@bedrijf.nl" error={errors.email} />
      <hr className="border-gray-100" />
      <SectionLabel>Correspondentieadres</SectionLabel>
      <SmartAddressInput
        value={data.correspondentieadres}
        onChange={(v) => dispatch({ type: "UPDATE_BEDRIJF", payload: { correspondentieadres: { ...data.correspondentieadres, ...v } } })}
      />
    </div>
  );
}

function ParticulierForm({ data, dispatch, errors }) {
  const upd = (field, value) => dispatch({ type: "UPDATE_PARTICULIER", payload: { [field]: value } });
  return (
    <div className="space-y-5">
      <SectionLabel>Uw gegevens</SectionLabel>
      <div className="grid grid-cols-2 gap-4">
        <InputField label="Voornaam" required value={data.voornaam} onChange={(e) => upd("voornaam", e.target.value)} placeholder="Jan" error={errors.voornaam} />
        <InputField label="Achternaam" required value={data.achternaam} onChange={(e) => upd("achternaam", e.target.value)} placeholder="de Vries" error={errors.achternaam} />
      </div>
      <RadioGroup label="Geslacht" required value={data.geslacht} onChange={(v) => upd("geslacht", v)} options={[{ value: "man", label: "Man" }, { value: "vrouw", label: "Vrouw" }, { value: "anders", label: "Anders" }]} error={errors.geslacht} />
      <BsnField value={data.bsn} onChange={(v) => upd("bsn", v)} error={errors.bsn} />
      <IbanField value={data.iban} onChange={(v) => upd("iban", v)} error={errors.iban} />
      <InputField label="Telefoonnummer" required type="tel" value={data.telefoon} onChange={(e) => upd("telefoon", e.target.value)} placeholder="06 12 34 56 78" error={errors.telefoon} />
      <InputField label="E-mailadres" required type="email" value={data.email} onChange={(e) => upd("email", e.target.value)} placeholder="jan@voorbeeld.nl" error={errors.email} />
      <hr className="border-gray-100" />
      <SectionLabel>Woonadres</SectionLabel>
      <SmartAddressInput
        value={data.woonadres}
        onChange={(v) => dispatch({ type: "UPDATE_PARTICULIER", payload: { woonadres: { ...data.woonadres, ...v } } })}
      />
      <InputField label="Land" value={data.woonadres?.land ?? "Nederland"} onChange={(e) => dispatch({ type: "UPDATE_PARTICULIER", payload: { woonadres: { ...data.woonadres, land: e.target.value } } })} />
    </div>
  );
}

const BEDRIJF_REQUIRED = ["kvk_nummer", "bedrijfsnaam", "iban", "meer_dan_250", "voorletters", "achternaam", "geslacht", "telefoon", "email"];
const PARTICULIER_REQUIRED = ["voornaam", "achternaam", "geslacht", "bsn", "iban", "telefoon", "email"];

// ─── ISDE: always particulier, with woning address ────────────────────────────
function IsdeParticulierForm({ data, dispatch, errors }) {
  const upd = (field, value) => dispatch({ type: "UPDATE_PARTICULIER", payload: { [field]: value } });
  return (
    <div className="space-y-5">
      <SectionLabel>Uw gegevens</SectionLabel>
      <div className="grid grid-cols-2 gap-4">
        <InputField label="Voornaam" required value={data.voornaam} onChange={(e) => upd("voornaam", e.target.value)} placeholder="Jan" error={errors.voornaam} />
        <InputField label="Achternaam" required value={data.achternaam} onChange={(e) => upd("achternaam", e.target.value)} placeholder="de Vries" error={errors.achternaam} />
      </div>
      <RadioGroup label="Geslacht" required value={data.geslacht} onChange={(v) => upd("geslacht", v)} options={[{ value: "man", label: "Man" }, { value: "vrouw", label: "Vrouw" }, { value: "anders", label: "Anders" }]} error={errors.geslacht} />
      <BsnField value={data.bsn} onChange={(v) => upd("bsn", v)} error={errors.bsn} />
      <IbanField value={data.iban} onChange={(v) => upd("iban", v)} error={errors.iban} />
      <InputField label="Telefoonnummer" required type="tel" value={data.telefoon} onChange={(e) => upd("telefoon", e.target.value)} placeholder="06 12 34 56 78" error={errors.telefoon} />
      <InputField label="E-mailadres" required type="email" value={data.email} onChange={(e) => upd("email", e.target.value)} placeholder="jan@voorbeeld.nl" error={errors.email} />
      <hr className="border-gray-100" />
      <SectionLabel>Adres van de woning</SectionLabel>
      <p className="text-xs text-gray-400 -mt-3">Op welk adres zijn de maatregelen uitgevoerd?</p>
      <SmartAddressInput
        value={data.woonadres}
        onChange={(v) => dispatch({ type: "UPDATE_PARTICULIER", payload: { woonadres: { ...data.woonadres, ...v } } })}
      />
    </div>
  );
}

export default function Step3({ state, dispatch, regelingType }) {
  const { aanvrager_type, bedrijf, particulier } = state;
  const isIsde = regelingType === "ISDE";
  const [errors, setErrors] = useState({});
  const [typeError, setTypeError] = useState("");

  const handleNext = () => {
    if (!isIsde && !aanvrager_type) { setTypeError("Selecteer bedrijf of particulier om verder te gaan."); return; }
    setTypeError("");
    const newErrors = {};
    const source = isIsde ? particulier : (aanvrager_type === "bedrijf" ? bedrijf : particulier);
    const required = isIsde ? PARTICULIER_REQUIRED : (aanvrager_type === "bedrijf" ? BEDRIJF_REQUIRED : PARTICULIER_REQUIRED);
    required.forEach((f) => { if (!source[f]?.toString().trim()) newErrors[f] = "Dit veld is verplicht"; });
    if (source.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(source.email)) newErrors.email = "Voer een geldig e-mailadres in";
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    dispatch({ type: "NEXT_STEP" });
  };

  // ISDE: always show particulier form directly, no type selector
  if (isIsde) {
    return (
      <div>
        <h2 className="text-xl font-bold text-primary mb-1">Uw gegevens</h2>
        <p className="text-gray-500 text-sm mb-6">Vul uw contactgegevens in. Wij gebruiken deze uitsluitend voor uw subsidieaanvraag.</p>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5">
          <IsdeParticulierForm data={particulier} dispatch={dispatch} errors={errors} />
        </div>
        <NavigationButtons step={3} onPrev={() => dispatch({ type: "PREV_STEP" })} onNext={handleNext} />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-primary mb-1">Uw gegevens</h2>
      <p className="text-gray-500 text-sm mb-6">Vul uw contactgegevens in. Wij gebruiken deze uitsluitend voor uw subsidieaanvraag.</p>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5 mb-5">
        <p className="text-sm font-medium text-gray-700 mb-3">Bent u een bedrijf of particulier? <span className="text-red-500">*</span></p>
        <div className="grid grid-cols-2 gap-3">
          {[{ value: "bedrijf", icon: "fa-solid fa-building", label: "Bedrijf" }, { value: "particulier", icon: "fa-solid fa-user", label: "Particulier" }].map((opt) => (
            <button key={opt.value} type="button" onClick={() => { dispatch({ type: "SET_AANVRAGER_TYPE", payload: opt.value }); setTypeError(""); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-sm font-medium transition ${aanvrager_type === opt.value ? "border-secondary bg-blue-50 text-primary" : "border-gray-100 text-gray-600 hover:border-gray-200"}`}>
              <i className={`${opt.icon} ${aanvrager_type === opt.value ? "text-secondary" : "text-gray-400"}`} />
              {opt.label}
            </button>
          ))}
        </div>
        {typeError && <p className="text-red-500 text-xs mt-2">{typeError}</p>}
      </div>

      {aanvrager_type && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5">
          {aanvrager_type === "bedrijf"
            ? <BedrijfForm data={bedrijf} dispatch={dispatch} errors={errors} />
            : <ParticulierForm data={particulier} dispatch={dispatch} errors={errors} />}
        </div>
      )}

      <NavigationButtons step={3} onPrev={() => dispatch({ type: "PREV_STEP" })} onNext={handleNext} />
    </div>
  );
}
