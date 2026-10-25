"use client";

import { useState } from "react";
import { DocumentUpload, NavigationButtons } from "./components";
import { isLuchtWater, MEASURE_META } from "./reducer";

// Document categories per measure type
const DOC_CATEGORIES = {
  warmtepomp: [
    { key: "factuur",     label: "Factuur",      hint: "Factuur met meldcode en installatiedatum", required: true },
    { key: "betaalbewijs", label: "Betaalbewijs", hint: "Bewijs van betaling",                        required: true },
    { key: "fotos",       label: "Foto's",        hint: "Foto's van de geïnstalleerde warmtepomp",   required: true },
    { key: "overig",      label: "Overig",        hint: "Eventuele aanvullende documenten",             required: false },
  ],
  isolatie: [
    { key: "factuur",     label: "Factuur",      hint: "Factuur met meldcode en m² geïsoleerd oppervlak", required: true },
    { key: "betaalbewijs", label: "Betaalbewijs", hint: "Bewijs van betaling",                               required: true },
    { key: "fotos",       label: "Foto's",        hint: "Foto's van de geïnstalleerde maatregel",            required: true },
    { key: "overig",      label: "Overig",        hint: "Eventuele aanvullende documenten",                   required: false },
  ],
  zonneboiler: [
    { key: "factuur",     label: "Factuur",      hint: "Factuur van de zonneboiler",                required: true },
    { key: "betaalbewijs", label: "Betaalbewijs", hint: "Bewijs van betaling",                        required: true },
    { key: "fotos",       label: "Foto's",        hint: "Foto's van de geïnstalleerde zonneboiler",  required: true },
    { key: "overig",      label: "Overig",        hint: "Eventuele aanvullende documenten",             required: false },
  ],
  elektrisch: [
    { key: "factuur",       label: "Factuur",           hint: "Factuur van de kookvoorziening",                                         required: true },
    { key: "betaalbewijs",  label: "Betaalbewijs",       hint: "Bewijs van betaling",                                                     required: true },
    { key: "netbeheerder",  label: "Brief netbeheerder", hint: "Bevestiging dat de aardgasmeter definitief is verwijderd",                required: true },
    { key: "warmtebedrijf", label: "Warmtenet bewijs",   hint: "Bewijs dat u op een warmtenet bent aangesloten (indien van toepassing)", required: false },
    { key: "overig",        label: "Overig",             hint: "Eventuele aanvullende documenten",                                        required: false },
  ],
  ventilatie: [
    { key: "factuur",     label: "Factuur",      hint: "Factuur met meldcode van het ventilatiesysteem", required: true },
    { key: "betaalbewijs", label: "Betaalbewijs", hint: "Bewijs van betaling",                             required: true },
    { key: "fotos",       label: "Foto's",        hint: "Foto's van het geïnstalleerde ventilatiesysteem", required: true },
    { key: "overig",      label: "Overig",        hint: "Eventuele aanvullende documenten",                 required: false },
  ],
  warmtenet: [
    { key: "factuur",       label: "Factuur",              hint: "Factuur van de aansluiting op het warmtenet",           required: true },
    { key: "betaalbewijs",  label: "Betaalbewijs",          hint: "Bewijs van betaling",                                   required: true },
    { key: "warmtebedrijf", label: "Bevestiging warmtebedrijf", hint: "Bevestiging van de aansluiting door het warmtebedrijf", required: true },
    { key: "overig",        label: "Overig",                hint: "Eventuele aanvullende documenten",                      required: false },
  ],
};

const JAARNOTA = { key: "jaarnota", label: "Jaarnota gas en elektra", hint: "Jaarnota van uw energieleverancier voor gas en elektriciteit", required: true };

// ISDE zakelijk: aanvraag vóór de opdracht, dus nog geen factuur, betaalbewijs of foto's
const ZAKELIJK_DOC_CATEGORIES = [
  { key: "offerte",     label: "Offerte",                 hint: "Offerte van het installatiebedrijf (nog niet getekend)",                 required: true },
  { key: "technisch",   label: "Technische documentatie", hint: "Alleen nodig als uw apparaat niet op de meldcodelijst van RVO staat", required: false },
  { key: "overig",      label: "Overig",                  hint: "Eventuele aanvullende documenten",                                     required: false },
];

// ISDE zakelijk with a lucht-water warmtepomp also needs the jaarnota
function docCategorieen(measure, state, zakelijk) {
  const categories = zakelijk ? ZAKELIJK_DOC_CATEGORIES : DOC_CATEGORIES[measure.type] ?? [];
  if (zakelijk && measure.type === "warmtepomp" && isLuchtWater(state.details[measure.id])) {
    return [...categories.filter((c) => c.key !== "overig"), JAARNOTA, ...categories.filter((c) => c.key === "overig")];
  }
  return categories;
}

function MeasureDocCard({ measure, categories, docFiles, dispatch, showErrors }) {
  const meta = MEASURE_META[measure.type];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-50 bg-gray-50/60">
        <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
          <i className={`${meta?.icon ?? "fa-solid fa-file"} text-secondary text-sm`} />
        </div>
        <div>
          <p className="font-semibold text-primary text-sm">{meta?.label ?? measure.type}</p>
          <p className="text-gray-400 text-xs">{meta?.subtitle}</p>
        </div>
      </div>

      {/* Documents */}
      <div className="px-6 py-5 space-y-3">
        {categories.map((cat) => {
          const files = docFiles[measure.id]?.[cat.key] ?? [];
          const missing = showErrors && cat.required && files.length === 0;
          return (
            <div key={cat.key} data-doc-error={missing || undefined}>
              <DocumentUpload
                label={cat.label}
                hint={cat.hint}
                required={cat.required}
                files={files}
                onAdd={(newFiles) =>
                  dispatch({ type: "ADD_DOC_FILES", payload: { measureId: measure.id, category: cat.key, files: newFiles } })
                }
                onRemove={(index) =>
                  dispatch({ type: "REMOVE_DOC_FILE", payload: { measureId: measure.id, category: cat.key, index } })
                }
                maxFiles={3}
                error={missing}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Step4({ state, dispatch, regelingType }) {
  const [showErrors, setShowErrors] = useState(false);
  const zakelijk = regelingType === "ISDE" && state.doelgroep === "zakelijk";

  const missingCount = state.measures.reduce((count, measure) => {
    const required = docCategorieen(measure, state, zakelijk).filter((c) => c.required);
    return count + required.filter((cat) => (state.docFiles[measure.id]?.[cat.key] ?? []).length === 0).length;
  }, 0);

  const handleNext = () => {
    if (missingCount > 0) {
      setShowErrors(true);
      // Bring the first missing document into view
      requestAnimationFrame(() =>
        document.querySelector("[data-doc-error]")?.scrollIntoView({ behavior: "smooth", block: "center" })
      );
      return;
    }
    dispatch({ type: "NEXT_STEP" });
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-primary mb-1">Documenten uploaden</h2>
      <p className="text-gray-500 text-sm mb-6">
        Upload de vereiste documenten per maatregel. PDF, JPG of PNG · max 10 MB per bestand · max 3 bestanden per document. U kunt bestanden ook op een regel slepen.
      </p>
      {zakelijk && (
        <p className="text-sm text-gray-600 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-6 -mt-2">
          <i className="fa-solid fa-circle-info text-secondary mr-1.5" />
          Factuur, betaalbewijs en foto&apos;s heeft u nu nog niet nodig. Die levert u aan na de installatie, als wij de
          uitbetaling bij RVO aanvragen.
        </p>
      )}

      <div className="space-y-5">
        {state.measures.map((measure) => (
          <MeasureDocCard
            key={measure.id}
            measure={measure}
            categories={docCategorieen(measure, state, zakelijk)}
            docFiles={state.docFiles}
            dispatch={dispatch}
            showErrors={showErrors}
          />
        ))}
      </div>

      <NavigationButtons step={4} onPrev={() => dispatch({ type: "PREV_STEP" })} onNext={handleNext} />
    </div>
  );
}
