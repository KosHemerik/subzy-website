"use client";

import { Check, CheckSquare, ClipboardList, Eye, Upload, User } from "lucide-react";
import { useRef, useState } from "react";

// ─── ProgressBar ──────────────────────────────────────────────────────────────
const STEPS = [
  { n: 1, label: "Maatregelen", Icon: CheckSquare },
  { n: 2, label: "Details",     Icon: ClipboardList },
  { n: 3, label: "Uw gegevens", Icon: User },
  { n: 4, label: "Documenten",  Icon: Upload },
  { n: 5, label: "Overzicht",   Icon: Eye },
];

export function ProgressBar({ currentStep }) {
  return (
    <div className="w-full mb-6">
      <div className="flex items-center justify-between relative">
        {/* Connecting line — background */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 z-0" />
        {/* Connecting line — progress */}
        <div
          className="absolute top-6 left-0 h-0.5 bg-secondary z-0 transition-all duration-500"
          style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
        />

        {STEPS.map(({ n, label, Icon }) => {
          const done = n < currentStep;
          const active = n === currentStep;
          return (
            <div key={n} className="flex flex-col items-center z-10 flex-1">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  done
                    ? "bg-blue-100 text-secondary"
                    : active
                    ? "bg-secondary text-white shadow-md shadow-secondary/30"
                    : "bg-white border-2 border-gray-200 text-gray-400"
                }`}
              >
                {done ? (
                  <Check size={20} strokeWidth={3} />
                ) : (
                  <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                )}
              </div>
              <span
                className={`mt-1.5 text-xs font-medium hidden sm:block ${
                  active ? "text-secondary font-bold" : done ? "text-secondary/80" : "text-gray-400"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── StickyPriceBar ───────────────────────────────────────────────────────────
export function StickyPriceBar({ measures, ranges, details }) {
  const fmt = new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

  let totalMin = 0;
  let totalMax = 0;
  let exactCount = 0;
  let unknownCount = 0;

  measures.forEach((m) => {
    const exact = details?.[m.id]?.subsidiebedrag;
    if (details?.[m.id]?.bedrag_onbekend) unknownCount++;
    if (exact != null) {
      exactCount++;
      totalMin += exact;
      totalMax += exact;
    } else {
      totalMin += ranges?.[m.type]?.min ?? 0;
      totalMax += ranges?.[m.type]?.max ?? 0;
    }
  });

  const allExact = exactCount > 0 && exactCount === measures.length;
  const amountText =
    totalMin === totalMax
      ? fmt.format(totalMin)
      : `${fmt.format(totalMin)} \u2013 ${fmt.format(totalMax)}`;

  return (
    <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4 mb-6 flex items-center gap-4">
      {/* Icon */}
      <div className="w-11 h-11 rounded-xl bg-secondary text-white flex items-center justify-center text-lg shrink-0">
        <i className="fa-solid fa-euro-sign" />
      </div>
      {/* Label + amount */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500">Geschat subsidiebedrag</p>
        <p className="font-bold text-2xl text-primary whitespace-nowrap">{amountText}</p>
        <p className="text-xs text-gray-400 mt-0.5 sm:hidden">
          {unknownCount > 0 ? "Data onbekend voor gekozen jaar" : allExact ? "Gebaseerd op geselecteerd product" : "Indicatief bedrag"}
        </p>
      </div>
      {/* Status */}
      <div className="hidden sm:flex flex-col items-end gap-1 shrink-0 text-right">
        {unknownCount > 0 ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
            <i className="fa-solid fa-triangle-exclamation" />
            Data onbekend
          </span>
        ) : (
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
              allExact ? "bg-green-100 text-green-700" : "bg-white text-secondary border border-blue-100"
            }`}
          >
            <i className={`fa-solid ${allExact ? "fa-circle-check" : "fa-circle-info"}`} />
            {allExact ? "Op basis van product" : "Indicatief"}
          </span>
        )}
        {unknownCount > 0 ? (
          <span className="text-xs text-gray-400">Geen bedragen voor het gekozen jaar</span>
        ) : !allExact && (
          <span className="text-xs text-gray-400">Exact bedrag na invullen details</span>
        )}
      </div>
    </div>
  );
}

// ─── StepCard ────────────────────────────────────────────────────────────────
export function StepCard({ label, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
      {label && (
        <div className="px-6 pt-5 pb-3 border-b border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{label}</p>
        </div>
      )}
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

// ─── InputField ──────────────────────────────────────────────────────────────
export function InputField({ label, required, tooltip, error, type = "text", ...props }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1">
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {tooltip && <Tooltip text={tooltip} />}
      </div>
      <input
        type={type}
        className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-gray-50 transition ${
          error ? "border-red-400" : "border-gray-200"
        }`}
        {...props}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

// ─── SelectField ─────────────────────────────────────────────────────────────
export function SelectField({ label, required, tooltip, error, children, ...props }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1">
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {tooltip && <Tooltip text={tooltip} />}
      </div>
      <select
        className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-gray-50 transition ${
          error ? "border-red-400" : "border-gray-200"
        }`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

// ─── RadioGroup ──────────────────────────────────────────────────────────────
export function RadioGroup({ label, required, options, value, onChange, error }) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </p>
      <div className="flex flex-wrap gap-4">
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
            <input
              type="radio"
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="accent-secondary w-4 h-4"
            />
            {opt.label}
          </label>
        ))}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

// ─── CheckboxField ────────────────────────────────────────────────────────────
export function CheckboxField({ label, checked, onChange, error }) {
  return (
    <div>
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="accent-secondary w-4 h-4 mt-0.5 shrink-0"
        />
        <span className="text-sm text-gray-700 leading-relaxed">{label}</span>
      </label>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

// ─── DateFields (dag / maand / jaar dropdowns) ────────────────────────────────
const MAANDEN = [
  "Januari","Februari","Maart","April","Mei","Juni",
  "Juli","Augustus","September","Oktober","November","December",
];

export function DateFields({ label, required, value, onChange, error }) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div>
      <p className="text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </p>
      <div className="grid grid-cols-3 gap-2">
        <select
          value={value?.dag ?? ""}
          onChange={(e) => onChange({ ...value, dag: e.target.value })}
          className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-secondary"
        >
          <option value="">Dag</option>
          {days.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <select
          value={value?.maand ?? ""}
          onChange={(e) => onChange({ ...value, maand: e.target.value })}
          className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-secondary"
        >
          <option value="">Maand</option>
          {MAANDEN.map((m, i) => (
            <option key={i} value={i + 1}>{m}</option>
          ))}
        </select>
        <select
          value={value?.jaar ?? ""}
          onChange={(e) => onChange({ ...value, jaar: e.target.value })}
          className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-secondary"
        >
          <option value="">Jaar</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

// ─── AddressBlock ─────────────────────────────────────────────────────────────
export function AddressBlock({ label, value, onChange, errors = {} }) {
  const field = (name, placeholder, extra = {}) => (
    <input
      value={value?.[name] ?? ""}
      onChange={(e) => onChange({ ...value, [name]: e.target.value })}
      placeholder={placeholder}
      className={`w-full border rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-secondary transition ${
        errors[name] ? "border-red-400" : "border-gray-200"
      }`}
      {...extra}
    />
  );

  return (
    <div className="space-y-3">
      {label && <p className="text-sm font-medium text-gray-700">{label}</p>}
      <div className="grid grid-cols-[2fr_1fr_1fr] gap-2">
        {field("postcode", "Postcode")}
        {field("huisnummer", "Huisnr.")}
        {field("toevoeging", "Toev.")}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {field("straat", "Straatnaam")}
        {field("plaats", "Plaatsnaam")}
      </div>
      {Object.entries(errors).map(([k, v]) =>
        v ? <p key={k} className="text-red-500 text-xs">{v}</p> : null
      )}
    </div>
  );
}

// ─── DocumentUpload ───────────────────────────────────────────────────────────
// One compact row per document: label + hint with an upload button. Files can also be
// dropped anywhere on the row. Uploaded files are listed below with an "add another" link.
export function DocumentUpload({ label, hint, required, files, onAdd, onRemove, accept = ".pdf,.jpg,.jpeg,.png", maxFiles = 3, error }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const openPicker = () => inputRef.current?.click();
  const canAdd = files.length < maxFiles;

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (canAdd) onAdd(Array.from(e.dataTransfer.files));
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); if (canAdd) setDragging(true); }}
      onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setDragging(false); }}
      className={`rounded-xl border px-4 py-3 transition ${
        dragging ? "border-secondary bg-blue-50" : error ? "border-red-300 bg-red-50/40" : "border-gray-100"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
          </p>
          {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
        </div>
        {files.length === 0 ? (
          <button
            type="button"
            onClick={openPicker}
            className="shrink-0 flex items-center gap-2 border border-blue-100 bg-white text-secondary hover:bg-blue-50 text-sm font-medium px-4 py-2 rounded-xl transition"
          >
            <i className="fa-solid fa-arrow-up-from-bracket" /> Uploaden
          </button>
        ) : (
          <span className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-green-700">
            <i className="fa-solid fa-circle-check text-green-500" />
            {files.length} {files.length === 1 ? "bestand" : "bestanden"}
          </span>
        )}
      </div>

      {files.length > 0 && (
        <div className="mt-3 space-y-1.5">
          {files.map((f, i) => (
            <div key={`${f.name}-${i}`} className="flex items-center justify-between bg-blue-50 rounded-lg px-3 py-2 text-sm">
              <span className="flex items-center gap-2 text-gray-700 min-w-0">
                <i className="fa-solid fa-file-lines text-secondary shrink-0" />
                <span className="truncate">{f.name}</span>
              </span>
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="text-gray-400 hover:text-red-500 transition ml-3 shrink-0"
                title="Bestand verwijderen"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
          ))}
          {canAdd && (
            <button
              type="button"
              onClick={openPicker}
              className="flex items-center gap-1.5 text-xs font-medium text-secondary hover:text-primary transition pt-1"
            >
              <i className="fa-solid fa-plus" /> Nog een bestand toevoegen
            </button>
          )}
        </div>
      )}

      {error && <p className="text-red-500 text-xs mt-2">Dit document is verplicht.</p>}

      <input
        ref={inputRef}
        type="file"
        multiple
        accept={accept}
        className="hidden"
        onChange={(e) => {
          onAdd(Array.from(e.target.files));
          e.target.value = ""; // allow picking the same file again after removing it
        }}
      />
    </div>
  );
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────
export function Tooltip({ text }) {
  return (
    <div className="relative group inline-block">
      <button
        type="button"
        className="w-4 h-4 rounded-full bg-gray-200 text-gray-500 text-[10px] flex items-center justify-center hover:bg-secondary hover:text-white transition"
      >
        ?
      </button>
      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 bg-gray-800 text-white text-xs rounded-xl px-3 py-2.5 leading-relaxed opacity-0 group-hover:opacity-100 pointer-events-none transition z-50 shadow-lg">
        {text}
        <div className="absolute left-1/2 -translate-x-1/2 top-full w-2 h-2 bg-gray-800 rotate-45 -mt-1" />
      </div>
    </div>
  );
}

// ─── AddButton ────────────────────────────────────────────────────────────────
export function AddButton({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full border-2 border-dashed border-gray-200 hover:border-secondary text-secondary hover:bg-blue-50 text-sm font-medium py-2.5 rounded-xl transition flex items-center justify-center gap-2"
    >
      <i className="fa-solid fa-plus" />
      {label}
    </button>
  );
}

// ─── RemoveButton ─────────────────────────────────────────────────────────────
export function RemoveButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-gray-400 hover:text-red-500 transition text-xs flex items-center gap-1"
    >
      <i className="fa-solid fa-trash-can" /> Verwijderen
    </button>
  );
}

// ─── NavigationButtons ────────────────────────────────────────────────────────
export function NavigationButtons({ step, onPrev, onNext, nextLabel, loading }) {
  return (
    <div className="flex items-center justify-between mt-6">
      {step > 1 ? (
        <button
          type="button"
          onClick={onPrev}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary transition px-4 py-2 rounded-lg hover:bg-gray-100"
        >
          <i className="fa-solid fa-arrow-left" /> Vorige
        </button>
      ) : (
        <div />
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={loading}
        className="bg-yellow-400 hover:bg-yellow-500 text-primary font-bold px-8 py-3 rounded-[12px] transition shadow-md flex items-center gap-2 disabled:opacity-70"
      >
        {loading ? (
          <>
            <i className="fa-solid fa-circle-notch fa-spin" /> Versturen...
          </>
        ) : (
          <>
            {nextLabel ?? "Volgende"} <i className="fa-solid fa-arrow-right" />
          </>
        )}
      </button>
    </div>
  );
}
