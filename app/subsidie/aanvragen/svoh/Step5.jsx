"use client";

import { supabase } from "@/lib/supabase/client";
import { useState } from "react";
import { MEASURE_META, MEASURE_PRICES } from "./reducer";

// ─── Helpers ──────────────────────────────────────────────────────────────────
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
const SVOH_VERKLARING_LABELS = {
  gegevens_waarheid:       "De gegevens zijn naar waarheid ingevuld.",
  woningen_bezit:          "Ik verklaar dat alle aangevraagde woningen in mijn bezit zijn en verhuurd zijn sinds de dag van de aanvraag.",
  geen_dubbele_subsidie:   "Ik verklaar dat geen subsidie van een ander bestuursorgaan is ontvangen voor dezelfde maatregelen.",
  akkoord_voorwaarden:     "Ik ga akkoord met de algemene voorwaarden van Subzy.",
  machtiging_subzy:        "Ik geef Subzy toestemming om namens mij de aanvraag in te dienen bij RVO.",
};

const ISDE_VERKLARING_LABELS = {
  gegevens_waarheid:       "De gegevens zijn naar waarheid ingevuld.",
  woningen_bezit:          "Ik verklaar dat de maatregel is uitgevoerd door een erkend installateur.",
  geen_dubbele_subsidie:   "Ik verklaar dat ik niet eerder subsidie heb ontvangen voor dezelfde maatregel via een ander bestuursorgaan.",
  akkoord_voorwaarden:     "Ik ga akkoord met de algemene voorwaarden van Subzy.",
  machtiging_subzy:        "Ik geef Subzy toestemming om namens mij de aanvraag in te dienen bij RVO.",
};

// ─── Success screen ───────────────────────────────────────────────────────────
function SuccessScreen({ aanvraagId }) {
  return (
    <div className="flex flex-col items-center text-center py-12 px-6">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-5">
        <i className="fa-solid fa-circle-check text-green-500 text-3xl" />
      </div>
      <h2 className="text-2xl font-bold text-primary mb-2">Aanvraag succesvol ingediend!</h2>
      <p className="text-gray-500 text-sm mb-4">Wij nemen binnen 2 werkdagen contact met u op.</p>
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
  const { measures, details, aanvrager_type, bedrijf, particulier, docFiles, verklaringen, submitted, submitted_id, loading } = state;
  const [error, setError] = useState("");
  const isIsde = regelingType === "ISDE";
  const VERKLARING_LABELS = isIsde ? ISDE_VERKLARING_LABELS : SVOH_VERKLARING_LABELS;

  const totalPrice = measures.reduce((sum, m) => sum + (MEASURE_PRICES[m.type] ?? 0), 0);
  const allChecked = Object.values(verklaringen).every(Boolean);

  if (submitted) return <SuccessScreen aanvraagId={submitted_id} />;

  const handleSubmit = async () => {
    if (!allChecked) return;
    dispatch({ type: "SET_LOADING", payload: true });
    setError("");

    try {
      // 1. Insert row to get ID for storage paths
      const aanvragerData = aanvrager_type === "bedrijf"
        ? {
            kvk_nummer: bedrijf.kvk_nummer,
            bedrijfsnaam: bedrijf.bedrijfsnaam,
            meer_dan_250: bedrijf.meer_dan_250 === "ja",
            voorletters: bedrijf.voorletters,
            tussenvoegsel: bedrijf.tussenvoegsel,
            achternaam: bedrijf.achternaam,
            geslacht: bedrijf.geslacht,
            telefoon: bedrijf.telefoon,
            email: bedrijf.email,
            iban: bedrijf.iban,
            correspondentieadres: bedrijf.correspondentieadres,
          }
        : {
            voornaam: particulier.voornaam,
            achternaam: particulier.achternaam,
            geslacht: particulier.geslacht,
            bsn: particulier.bsn,
            iban: particulier.iban,
            telefoon: particulier.telefoon,
            email: particulier.email,
            woonadres: particulier.woonadres,
          };

      const { data: inserted, error: insertErr } = await supabase
        .from("subsidie_aanvragen")
        .insert({
          regeling: regelingType ?? "SVOH",
          doelgroep: doelgroep ?? aanvrager_type ?? "particulier",
          aanvrager_type: isIsde ? "particulier" : aanvrager_type,
          ...aanvragerData,
          maatregelen: measures.map((m) => ({ id: m.id, type: m.type, details: details[m.id] ?? {} })),
          status: "nieuw",
          verklaringen_akkoord: verklaringen.akkoord_voorwaarden && verklaringen.gegevens_waarheid && verklaringen.geen_dubbele_subsidie && verklaringen.woningen_bezit,
          subzy_machtiging: verklaringen.machtiging_subzy,
        })
        .select("id")
        .single();

      if (insertErr) throw insertErr;
      const aanvraag_id = inserted.id;

      // 2. Upload files
      for (const measure of measures) {
        const measureDocs = docFiles[measure.id] ?? {};
        for (const [category, files] of Object.entries(measureDocs)) {
          for (const file of files) {
            const ext = file.name.split(".").pop();
            const path = `${aanvraag_id}/${measure.type}/${category}_${Date.now()}_${file.name}`;
            const { error: uploadErr } = await supabase.storage
              .from("subsidie-documenten")
              .upload(path, file, { upsert: false, contentType: file.type });
            if (uploadErr) console.warn("Upload warning:", uploadErr.message);
          }
        }
      }

      dispatch({ type: "SET_SUBMITTED", payload: aanvraag_id });
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
                <span className="text-sm font-medium text-gray-800">{fmt.format(MEASURE_PRICES[m.type] ?? 0)}</span>
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
              <Row label="Correspondentieadres" value={formatAddress(bedrijf.correspondentieadres)} />
            </>
          ) : (
            <>
              <Row label="Type" value="Particulier" />
              <Row label="Naam" value={[particulier.voornaam, particulier.achternaam].filter(Boolean).join(" ")} />
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
          <div className="space-y-3">
            {Object.entries(VERKLARING_LABELS).map(([key, label]) => (
              <label key={key} className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={verklaringen[key] ?? false}
                  onChange={(e) => dispatch({ type: "SET_VERKLARING", payload: { key, value: e.target.checked } })}
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 text-secondary focus:ring-secondary cursor-pointer"
                />
                <span className="text-sm text-gray-700 leading-relaxed">{label}</span>
              </label>
            ))}
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
          disabled={!allChecked || loading}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition ${
            allChecked && !loading
              ? "bg-secondary text-white hover:bg-secondary/90"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
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
        <p className="text-center text-xs text-gray-400 mt-2">Bevestig alle verklaringen om in te kunnen dienen.</p>
      )}
    </div>
  );
}
