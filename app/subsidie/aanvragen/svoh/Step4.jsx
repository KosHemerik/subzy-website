"use client";

import { useState } from "react";
import { NavigationButtons, UploadZone } from "./components";
import { MEASURE_META } from "./reducer";

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
};

function MeasureDocCard({ measure, docFiles, dispatch }) {
  const meta = MEASURE_META[measure.type];
  const categories = DOC_CATEGORIES[measure.type] ?? [];

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

      {/* Upload zones */}
      <div className="px-6 py-5 space-y-5">
        {categories.map((cat) => {
          const files = docFiles[measure.id]?.[cat.key] ?? [];
          return (
            <div key={cat.key}>
              <div className="flex items-center gap-1 mb-1">
                <p className="text-sm font-medium text-gray-700">{cat.label}</p>
                {cat.required && <span className="text-red-500 text-sm">*</span>}
              </div>
              <p className="text-xs text-gray-400 mb-2">{cat.hint}</p>
              <UploadZone
                files={files}
                onAdd={(newFiles) =>
                  dispatch({ type: "ADD_DOC_FILES", payload: { measureId: measure.id, category: cat.key, files: newFiles } })
                }
                onRemove={(index) =>
                  dispatch({ type: "REMOVE_DOC_FILE", payload: { measureId: measure.id, category: cat.key, index } })
                }
                accept=".pdf,.jpg,.jpeg,.png"
                maxFiles={3}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Step4({ state, dispatch }) {
  const [errors, setErrors] = useState([]);

  const handleNext = () => {
    const missing = [];
    state.measures.forEach((measure) => {
      const cats = DOC_CATEGORIES[measure.type] ?? [];
      const required = cats.filter((c) => c.required);
      required.forEach((cat) => {
        const files = state.docFiles[measure.id]?.[cat.key] ?? [];
        if (files.length === 0) {
          missing.push(`${MEASURE_META[measure.type]?.label ?? measure.type}: ${cat.label}`);
        }
      });
    });
    if (missing.length > 0) { setErrors(missing); return; }
    setErrors([]);
    dispatch({ type: "NEXT_STEP" });
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-primary mb-1">Documenten uploaden</h2>
      <p className="text-gray-500 text-sm mb-6">
        Upload de vereiste documenten per maatregel. Toegestane bestandstypen: PDF, JPG, PNG.
      </p>

      <div className="space-y-5">
        {state.measures.map((measure) => (
          <MeasureDocCard
            key={measure.id}
            measure={measure}
            docFiles={state.docFiles}
            dispatch={dispatch}
          />
        ))}
      </div>

      {errors.length > 0 && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-5 py-4">
          <p className="text-red-600 font-medium text-sm mb-2">Ontbrekende verplichte documenten:</p>
          <ul className="list-disc list-inside space-y-1">
            {errors.map((e, i) => (
              <li key={i} className="text-red-500 text-sm">{e}</li>
            ))}
          </ul>
        </div>
      )}

      <NavigationButtons step={4} onPrev={() => dispatch({ type: "PREV_STEP" })} onNext={handleNext} />
    </div>
  );
}
