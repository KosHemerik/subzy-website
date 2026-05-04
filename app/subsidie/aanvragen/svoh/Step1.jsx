"use client";

import { NavigationButtons } from "./components";
import { MEASURE_META, MEASURE_RANGES } from "./reducer";

const MEASURE_TYPES = ["warmtepomp", "isolatie", "zonneboiler", "elektrisch"];

const fmt = new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

// ─── Single measure card ──────────────────────────────────────────────────────
function MeasureCard({ type, selected, onToggle }) {
  const meta = MEASURE_META[type];
  const range = MEASURE_RANGES[type];

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`w-full h-full text-left rounded-2xl border-2 p-5 transition-all duration-200 flex items-start gap-4 ${
        selected
          ? "border-secondary bg-blue-50 shadow-md shadow-secondary/10"
          : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"
      }`}
    >
      {/* Icon */}
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg shrink-0 ${
          selected ? "bg-secondary text-white" : "bg-background text-secondary"
        }`}
      >
        <i className={meta.icon} />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-primary text-sm">{meta.label}</p>
        <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{meta.subtitle}</p>
        {type === "isolatie" ? (
          <>
            <p className="text-secondary font-bold text-xs mt-1 whitespace-nowrap">
              {`Gem. ${fmt.format(range.min)} – ${fmt.format(range.max)}`}
            </p>
            <p className="text-gray-400 text-xs italic mt-0.5">afhankelijk van type en m²</p>
          </>
        ) : (
          <p className="text-secondary font-semibold text-xs mt-1 whitespace-nowrap">{range.label}</p>
        )}
      </div>

      {/* Checkbox indicator */}
      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition ${
          selected ? "bg-secondary border-secondary" : "border-gray-300"
        }`}
      >
        {selected && <i className="fa-solid fa-check text-white text-[9px]" />}
      </div>
    </button>
  );
}

// ─── One row of cards per woning ──────────────────────────────────────────────
function WoningRow({ woning, index, showTrash, onToggle, onRemove }) {
  return (
    <div className="rounded-2xl p-6 mb-5" style={{ background: "#f0f4ff" }}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">
          Woning {index + 1}
        </p>
        {showTrash && (
          <button
            type="button"
            onClick={onRemove}
            className="text-red-400 hover:text-red-600 transition text-sm"
            title="Woning verwijderen"
          >
            <i className="fa-solid fa-trash" />
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {MEASURE_TYPES.map((type) => (
          <MeasureCard
            key={type}
            type={type}
            selected={woning.maatregelen.includes(type)}
            onToggle={() => onToggle(woning.id, type)}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Step 1 ───────────────────────────────────────────────────────────────────
export default function Step1({ state, dispatch, regelingType }) {
  const { woningen, measures } = state;
  const [error, setError] = React.useState("");

  const isIsde = regelingType === "ISDE";
  const totalSelected = measures.length;

  const handleToggle = (woningId, type) => {
    if (isIsde) {
      dispatch({ type: "TOGGLE_ISDE_MAATREGEL", payload: { type } });
    } else {
      dispatch({ type: "TOGGLE_WONING_MAATREGEL", payload: { woningId, type } });
    }
    setError("");
  };

  const handleAddWoning = () => {
    dispatch({ type: "ADD_WONING" });
  };

  const handleRemoveWoning = (woningId) => {
    dispatch({ type: "REMOVE_WONING", payload: woningId });
  };

  const handleNext = () => {
    if (totalSelected === 0) {
      setError("Selecteer minimaal één maatregel om door te gaan.");
      return;
    }
    setError("");
    dispatch({ type: "NEXT_STEP" });
  };

  // ISDE: flat grid of cards, no woning context
  if (isIsde) {
    return (
      <div>
        <h2 className="text-xl font-bold text-primary mb-1">Welke maatregelen heeft u uitgevoerd?</h2>
        <p className="text-gray-500 text-sm mb-6">
          Vink aan wat u heeft geïnstalleerd — meerdere keuzes mogelijk
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          {MEASURE_TYPES.map((type) => (
            <MeasureCard
              key={type}
              type={type}
              selected={state.isde_maatregelen?.includes(type)}
              onToggle={() => handleToggle(null, type)}
            />
          ))}
        </div>

        <p className={`text-sm text-center mb-4 ${totalSelected > 0 ? "text-secondary font-medium" : "text-gray-400"}`}>
          {totalSelected === 0
            ? "Nog geen maatregel geselecteerd"
            : <><i className="fa-solid fa-check mr-1" />{totalSelected} maatregel{totalSelected !== 1 ? "en" : ""} geselecteerd</>}
        </p>

        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
        <NavigationButtons step={1} onNext={handleNext} />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-primary mb-1">Welke maatregelen heeft u uitgevoerd?</h2>
      <p className="text-gray-500 text-sm mb-6">
        Vink aan wat u heeft geïnstalleerd — meerdere keuzes mogelijk
      </p>

      {woningen.map((woning, index) => (
        <WoningRow
          key={woning.id}
          woning={woning}
          index={index}
          showTrash={woningen.length > 1}
          onToggle={handleToggle}
          onRemove={() => handleRemoveWoning(woning.id)}
        />
      ))}

      {/* Selection counter */}
      <p className={`text-sm text-center mb-3 ${totalSelected > 0 ? "text-secondary font-medium" : "text-gray-400"}`}>
        {totalSelected === 0
          ? "Nog geen maatregel geselecteerd"
          : <><i className="fa-solid fa-check mr-1" />{totalSelected} maatregel{totalSelected !== 1 ? "en" : ""} geselecteerd — u kunt er meer toevoegen</>}
      </p>

      {/* Add woning button */}
      <button
        type="button"
        onClick={handleAddWoning}
        className="w-full mt-2 mb-2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-secondary/40 text-secondary text-sm font-medium hover:border-secondary hover:bg-blue-50 transition"
      >
        <i className="fa-solid fa-plus text-xs" />
        Maatregelen voor een andere woning toevoegen
      </button>
      <p className="text-center text-xs text-gray-400 mb-2">
        Heeft u dezelfde maatregel voor meerdere woningen? Voeg een extra woning toe.
      </p>

      {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

      <NavigationButtons step={1} onNext={handleNext} />
    </div>
  );
}

import React from "react";
