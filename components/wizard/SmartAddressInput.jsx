"use client";

import { Check, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// ─── SmartAddressInput ────────────────────────────────────────────────────────
// Props:
//   label    – string, default "Adres van de woning"
//   value    – { postcode, huisnummer, toevoeging, straat, plaats }
//   onChange – (value) => void

export function SmartAddressInput({ label = "Adres van de woning", value = {}, onChange }) {
  const [loading, setLoading] = useState(false);
  const [autoFilled, setAutoFilled] = useState(false);
  const [manualOverride, setManualOverride] = useState(false);
  const [lookupFailed, setLookupFailed] = useState(false);
  const debounceRef = useRef(null);

  const upd = (field, val) => onChange({ ...value, [field]: val });

  // Trigger lookup when postcode + huisnummer are filled
  useEffect(() => {
    const postcode = (value.postcode ?? "").replace(/\s/g, "");
    const huisnummer = (value.huisnummer ?? "").trim();

    // Need valid postcode (6 chars: 4 digits + 2 letters) and huisnummer
    if (!/^\d{4}[a-zA-Z]{2}$/.test(postcode) || !huisnummer) {
      return;
    }

    // If already auto-filled and user hasn't cleared postcode/huisnummer, don't re-fetch
    if (autoFilled && !manualOverride) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      setLookupFailed(false);

      try {
        const res = await fetch(
          `https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?q=${encodeURIComponent(postcode)}+${encodeURIComponent(huisnummer)}&rows=1&fl=straatnaam,woonplaatsnaam`
        );
        const json = await res.json();
        const doc = json?.response?.docs?.[0];

        if (doc?.straatnaam && doc?.woonplaatsnaam) {
          onChange({
            ...value,
            straat: doc.straatnaam,
            plaats: doc.woonplaatsnaam,
          });
          setAutoFilled(true);
          setManualOverride(false);
          setLookupFailed(false);
        } else {
          setLookupFailed(true);
          setAutoFilled(false);
        }
      } catch {
        setLookupFailed(true);
        setAutoFilled(false);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.postcode, value.huisnummer]);

  const inputCls = (extra = "") =>
    `w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#3b5bf6] transition ${extra}`;

  const readonlyCls =
    "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-[#f0f4ff] text-gray-700 focus:outline-none cursor-default select-none";

  const isReadonly = autoFilled && !manualOverride;

  return (
    <div className="space-y-3">
      {label && <p className="text-sm font-medium text-gray-700">{label}</p>}

      {/* Row 1: Postcode + Huisnummer + Toevoeging */}
      <div className="grid grid-cols-[2fr_1.2fr_1fr] gap-2">
        <input
          value={value.postcode ?? ""}
          onChange={(e) => {
            setAutoFilled(false);
            setManualOverride(false);
            setLookupFailed(false);
            upd("postcode", e.target.value);
          }}
          placeholder="Postcode"
          className={inputCls()}
        />
        <input
          value={value.huisnummer ?? ""}
          onChange={(e) => {
            setAutoFilled(false);
            setManualOverride(false);
            setLookupFailed(false);
            upd("huisnummer", e.target.value);
          }}
          placeholder="Huisnr."
          className={inputCls()}
        />
        <input
          value={value.toevoeging ?? ""}
          onChange={(e) => upd("toevoeging", e.target.value)}
          placeholder="Toev."
          className={inputCls()}
        />
      </div>

      {/* Row 2: Straat */}
      <div className="relative">
        {isReadonly ? (
          <div className={readonlyCls}>{value.straat || ""}</div>
        ) : (
          <input
            value={value.straat ?? ""}
            onChange={(e) => upd("straat", e.target.value)}
            placeholder="Straatnaam"
            className={inputCls()}
          />
        )}
        {loading && (
          <Loader2
            size={15}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3b5bf6] animate-spin"
          />
        )}
      </div>

      {/* Row 3: Plaats */}
      <div className="relative">
        {isReadonly ? (
          <div className={readonlyCls + " flex items-center justify-between"}>
            <span>{value.plaats || ""}</span>
            <Check size={15} className="text-green-500 shrink-0 ml-2" />
          </div>
        ) : (
          <input
            value={value.plaats ?? ""}
            onChange={(e) => upd("plaats", e.target.value)}
            placeholder="Plaatsnaam"
            className={inputCls()}
          />
        )}
      </div>

      {/* Status messages */}
      {lookupFailed && (
        <p className="text-xs text-gray-400">
          Adres niet gevonden. Vul handmatig in.
        </p>
      )}
      {isReadonly && (
        <button
          type="button"
          className="text-xs text-gray-400 hover:text-gray-600 underline"
          onClick={() => setManualOverride(true)}
        >
          Adres niet correct? Wijzig handmatig
        </button>
      )}
    </div>
  );
}
