"use client";

import { supabase } from "@/lib/supabase/client";
import { useState } from "react";
import { MEASURE_META, MEASURE_PRICES } from "./reducer";

// ─── Helpers ──────────────────────────────────────────────────────────────────
// Storage-sleutels mogen geen spaties of bijzondere tekens bevatten
const safeFileName = (name) => name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w.-]+/g, "_");

const fmt = new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

function formatAddress(a) {
  if (!a) return "—";
  const parts = [
    `${a.straat ?? ""} ${a.huisnummer ?? ""}${a.toevoeging ? ` ${a.toevoeging}` : ""}`.trim(),
    `${a.postcode ?? ""} ${a.plaats ?? ""}`.trim(),
    a.land ?? "",
  ].filter(Boolean);
  return parts.join(", ") || "—";
}

// ─── Collapsible section ──────────────────────────────────────────────────────
function Section({ title, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-6 py-4 text-left"
      >
        <span className="font-semibold text-primary text-sm">{title}</span>
        <i className={`fa-solid fa-chevron-${open ? "up" : "down"} text-gray-400 text-xs`} />
      </button>
      {open && <div className="px-6 pb-5 border-t border-gray-50 pt-4">{children}</div>}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm py-1">
      <span className="text-gray-500 shrink-0 w-40">{label}</span>
      <span className="text-gray-800 font-medium text-right">{value || "—"}</span>
    </div>
  );
}

// ─── Verklaringen ─────────────────────────────────────────────────────────────
// Feitelijke verklaringen worden gebundeld onder één vinkje
const SVOH_VERKLARING_PUNTEN = [
  "de gegevens naar waarheid zijn ingevuld;",
  "alle aangevraagde woningen in mijn bezit zijn en verhuurd zijn sinds de dag van de aanvraag;",
  "geen subsidie van een ander bestuursorgaan is ontvangen voor dezelfde maatregelen.",
];

// Zakelijk vraagt vooraf aan: de maatregel is nog niet uitgevoerd
const ISDE_ZAKELIJK_VERKLARING_PUNTEN = [
  "de gegevens naar waarheid zijn ingevuld;",
  "ik nog geen opdracht heb gegeven en geen offerte heb getekend voor de aangevraagde maatregelen;",
  "de maatregelen worden uitgevoerd door een installatiebedrijf;",
  "ik niet eerder subsidie heb ontvangen voor dezelfde maatregel via een ander bestuursorgaan.",
];

const ISDE_VERKLARING_PUNTEN = [
  "de gegevens naar waarheid zijn ingevuld;",
  "de maatregel is uitgevoerd door een erkend installateur;",
  "ik niet eerder subsidie heb ontvangen voor dezelfde maatregel via een ander bestuursorgaan.",
];

function VerklaringCheckbox({ id, checked, onChange, showError, children }) {
  const invalid = showError && !checked;
  return (
    <div>
      <label
        className={`flex items-start gap-3 cursor-pointer group rounded-xl p-3 -m-3 transition ${
          invalid ? "bg-red-50 ring-1 ring-red-200" : ""
        }`}
      >
        <input
          type="checkbox"
          required
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={invalid}
          aria-describedby={invalid ? `${id}-error` : undefined}
          className={`mt-0.5 w-4 h-4 rounded text-secondary focus:ring-secondary cursor-pointer ${
            invalid ? "border-red-400" : "border-gray-300"
          }`}
        />
        <span className="text-sm text-gray-700 leading-relaxed">
          {children} <span className="text-red-500" aria-hidden="true">*</span>
        </span>
      </label>
      {invalid && (
        <p id={`${id}-error`} className="mt-3 ml-7 text-xs text-red-600">
          Dit vinkje is verplicht.
        </p>
      )}
    </div>
  );
}

// ─── Success screen ───────────────────────────────────────────────────────────
function SuccessScreen({ aanvraagId }) {
  return (
    <div className="flex flex-col items-center text-center py-12 px-6">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-5">
        <i className="fa-solid fa-circle-check text-green-500 text-3xl" />
      </div>
      <h2 className="text-2xl font-bold text-primary mb-2">Aanvraag succesvol ingediend!</h2>
      <p className="text-gray-500 text-sm mb-4">Wij controleren uw aanvraag en dienen hem binnen 2 werkdagen in bij RVO.</p>
      {aanvraagId && (
        <p className="text-secondary font-semibold text-sm mb-8">Uw aanvraagnummer: #{aanvraagId}</p>
      )}
      <a
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition"
      >
        <i className="fa-solid fa-house" />
        Terug naar home
      </a>
    </div>
  );
}

// ─── Step 5 ───────────────────────────────────────────────────────────────────
export default function Step5({ state, dispatch, regelingType, doelgroep }) {
  const { measures, details, aanvrager_type, bedrijf, particulier, docFiles, verklaringen, aanvraag_id, submitted, submitted_id, loading } = state;
  const [error, setError] = useState("");
  const [showVerklaringErrors, setShowVerklaringErrors] = useState(false);
  const isIsde = regelingType === "ISDE";
  // ISDE zakelijk skips the 250-employees question and the correspondence address
  const zakelijk = isIsde && doelgroep === "zakelijk";
  const verklaringPunten = zakelijk
    ? ISDE_ZAKELIJK_VERKLARING_PUNTEN
    : isIsde ? ISDE_VERKLARING_PUNTEN : SVOH_VERKLARING_PUNTEN;
  const setVerklaring = (key) => (value) => dispatch({ type: "SET_VERKLARING", payload: { key, value } });

  const measurePrice = (m) => details[m.id]?.subsidiebedrag ?? MEASURE_PRICES[m.type] ?? 0;
  const totalPrice = measures.reduce((sum, m) => sum + measurePrice(m), 0);
  const allChecked = Boolean(verklaringen.verklaring && verklaringen.akkoord_machtiging);

  if (submitted) return <SuccessScreen aanvraagId={submitted_id} />;

  const handleSubmit = async () => {
    if (!allChecked) {
      setShowVerklaringErrors(true);
      return;
    }
    dispatch({ type: "SET_LOADING", payload: true });
    setError("");

    try {
      // 1. Aanvraag opslaan. Bij een nieuwe poging na een uploadfout bestaat hij al.
      // Het id wordt hier gemaakt omdat bezoekers de rij na een insert niet terug mogen lezen.
      let id = aanvraag_id;
      if (!id) {
        id = crypto.randomUUID();
        const aanvragerData = aanvrager_type === "bedrijf"
          ? {
              kvk_nummer: bedrijf.kvk_nummer,
              bedrijfsnaam: bedrijf.bedrijfsnaam,
              meer_dan_250: zakelijk ? null : bedrijf.meer_dan_250 === "ja",
              voorletters: bedrijf.voorletters,
              tussenvoegsel: bedrijf.tussenvoegsel,
              achternaam: bedrijf.achternaam,
              geslacht: bedrijf.geslacht,
              telefoon: bedrijf.telefoon,
              email: bedrijf.email,
              iban: bedrijf.iban,
              correspondentieadres: zakelijk ? null : bedrijf.correspondentieadres,
            }
          : {
              voornaam: particulier.voornaam,
              tussenvoegsel: particulier.tussenvoegsel,
              achternaam: particulier.achternaam,
              geslacht: particulier.geslacht,
              bsn: particulier.bsn,
              iban: particulier.iban,
              telefoon: particulier.telefoon,
              email: particulier.email,
              woonadres: particulier.woonadres,
            };

        const { error: insertErr } = await supabase
          .from("subsidie_aanvragen")
          .insert({
            id,
            regeling: regelingType ?? "SVOH",
            doelgroep: doelgroep ?? "onbekend",
            bron_pad: window.location.pathname + window.location.search,
            aanvrager_type,
            ...aanvragerData,
            maatregelen: measures.map((m) => ({ id: m.id, type: m.type, details: details[m.id] ?? {} })),
            status: "nieuw",
            verklaringen_akkoord: verklaringen.verklaring && verklaringen.akkoord_machtiging,
            subzy_machtiging: verklaringen.akkoord_machtiging,
          });

        if (insertErr) throw insertErr;
        dispatch({ type: "SET_AANVRAAG_ID", payload: id });
      }

      // 2. Documenten uploaden. Vaste paden, zodat een nieuwe poging al geüploade bestanden overslaat.
      const mislukt = [];
      for (const measure of measures) {
        const measureDocs = docFiles[measure.id] ?? {};
        for (const [category, files] of Object.entries(measureDocs)) {
          for (const [index, file] of files.entries()) {
            const path = `${id}/${measure.id}/${category}/${index}_${safeFileName(file.name)}`;
            const { error: uploadErr } = await supabase.storage
              .from("subsidie-documenten")
              .upload(path, file, { upsert: false, contentType: file.type });
            const alGeupload = uploadErr?.statusCode === "409" || uploadErr?.status === 409;
            if (uploadErr && !alGeupload) {
              console.error("Upload mislukt:", path, uploadErr);
              mislukt.push(file.name);
            }
          }
        }
      }

      if (mislukt.length > 0) {
        setError(
          `Uw aanvraag is opgeslagen, maar ${mislukt.length === 1 ? "dit bestand kon" : "deze bestanden konden"} niet worden geüpload: ${mislukt.join(", ")}. Klik nogmaals op indienen om het opnieuw te proberen.`
        );
        dispatch({ type: "SET_LOADING", payload: false });
        return;
      }

      dispatch({ type: "SET_SUBMITTED", payload: id });
    } catch (e) {
      console.error(e);
      setError("Er is iets misgegaan bij het indienen. Probeer het opnieuw of neem contact op.");
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-primary mb-1">Overzicht en indienen</h2>
      <p className="text-gray-500 text-sm mb-6">Controleer uw aanvraag en bevestig de verklaringen om in te dienen.</p>

      <div className="space-y-4">
        {/* Maatregelen */}
        <Section title="Maatregelen">
          <div className="space-y-2">
            {measures.map((m) => (
              <div key={m.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <i className={`${MEASURE_META[m.type]?.icon} text-secondary text-sm`} />
                  <span className="text-sm text-gray-700">{MEASURE_META[m.type]?.label ?? m.type}</span>
                </div>
                {details[m.id]?.bedrag_onbekend ? (
                  <span className="text-sm font-medium text-amber-700">€ 0,00 · data onbekend</span>
                ) : (
                  <span className="text-sm font-medium text-gray-800">{fmt.format(measurePrice(m))}</span>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="font-semibold text-primary">Indicatief totaalbedrag</span>
            <span className="text-2xl font-bold text-secondary">{fmt.format(totalPrice)}</span>
          </div>
        </Section>

        {/* Aanvrager */}
        <Section title="Gegevens aanvrager">
          {aanvrager_type === "bedrijf" ? (
            <>
              <Row label="Type" value="Bedrijf" />
              <Row label="KvK-nummer" value={bedrijf.kvk_nummer} />
              <Row label="Bedrijfsnaam" value={bedrijf.bedrijfsnaam} />
              <Row label="Contactpersoon" value={[bedrijf.voorletters, bedrijf.tussenvoegsel, bedrijf.achternaam].filter(Boolean).join(" ")} />
              <Row label="E-mail" value={bedrijf.email} />
              <Row label="Telefoon" value={bedrijf.telefoon} />
              <Row label="IBAN" value={bedrijf.iban} />
              {!zakelijk && <Row label="Correspondentieadres" value={formatAddress(bedrijf.correspondentieadres)} />}
            </>
          ) : (
            <>
              <Row label="Type" value="Particulier" />
              <Row label="Naam" value={[particulier.voornaam, particulier.tussenvoegsel, particulier.achternaam].filter(Boolean).join(" ")} />
              <Row label="E-mail" value={particulier.email} />
              <Row label="Telefoon" value={particulier.telefoon} />
              <Row label="IBAN" value={particulier.iban} />
              <Row label="Woonadres" value={formatAddress(particulier.woonadres)} />
            </>
          )}
        </Section>

        {/* Documenten */}
        <Section title="Geüploade documenten">
          {measures.map((m) => {
            const docs = docFiles[m.id] ?? {};
            const totalFiles = Object.values(docs).flat();
            return (
              <div key={m.id} className="mb-3 last:mb-0">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">{MEASURE_META[m.type]?.label}</p>
                {totalFiles.length === 0
                  ? <p className="text-sm text-gray-400 italic">Geen bestanden</p>
                  : Object.entries(docs).map(([cat, files]) =>
                      files.map((f, i) => (
                        <div key={`${cat}-${i}`} className="flex items-center gap-2 py-0.5">
                          <i className="fa-solid fa-file text-gray-300 text-xs" />
                          <span className="text-sm text-gray-600 truncate">{f.name}</span>
                          <span className="text-xs text-gray-400 shrink-0">({cat})</span>
                        </div>
                      ))
                    )
                }
              </div>
            );
          })}
        </Section>

        {/* Verklaringen */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5">
          <p className="font-semibold text-primary text-sm mb-4">Verklaringen</p>
          <div className="space-y-4">
            <VerklaringCheckbox
              id="verklaring"
              checked={verklaringen.verklaring ?? false}
              onChange={setVerklaring("verklaring")}
              showError={showVerklaringErrors}
            >
              Ik verklaar dat:
              <ul className="mt-1 list-disc pl-5 space-y-0.5">
                {verklaringPunten.map((punt) => (
                  <li key={punt}>{punt}</li>
                ))}
              </ul>
            </VerklaringCheckbox>
            <VerklaringCheckbox
              id="akkoord_machtiging"
              checked={verklaringen.akkoord_machtiging ?? false}
              onChange={setVerklaring("akkoord_machtiging")}
              showError={showVerklaringErrors}
            >
              Ik ga akkoord met de{" "}
              <a
                href="/voorwaarden"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary underline hover:text-secondary/80"
              >
                algemene voorwaarden
              </a>{" "}
              van Subzy en geef Subzy toestemming om namens mij de aanvraag in te dienen bij RVO.
            </VerklaringCheckbox>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-600 text-sm">{error}</div>
      )}

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => dispatch({ type: "PREV_STEP" })}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
        >
          <i className="fa-solid fa-arrow-left text-xs" />
          Vorige
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition ${
            loading
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : allChecked
                ? "bg-secondary text-white hover:bg-secondary/90"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          {loading ? (
            <><i className="fa-solid fa-circle-notch fa-spin" /> Bezig met indienen...</>
          ) : (
            <><i className="fa-solid fa-paper-plane" /> Aanvraag indienen</>
          )}
        </button>
      </div>
      {!allChecked && (
        <p className={`text-center text-xs mt-2 ${showVerklaringErrors ? "text-red-600" : "text-gray-400"}`}>
          Bevestig alle verklaringen om in te kunnen dienen.
        </p>
      )}
    </div>
  );
}
