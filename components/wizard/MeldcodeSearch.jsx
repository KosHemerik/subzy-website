"use client";

import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const fmt = new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = [CURRENT_YEAR - 2, CURRENT_YEAR - 1, CURRENT_YEAR];

const MAATREGEL_LABELS = {
  warmtepomp: "warmtepomp",
  isolatie: "isolatiemaatregel",
  zonneboiler: "zonneboiler",
  elektrisch: "apparaat",
};

// ─── Single product row in dropdown ──────────────────────────────────────────
function ProductRow({ product, active, onSelect }) {
  return (
    <button
      type="button"
      className={`w-full text-left px-4 py-3 flex items-center justify-between gap-4 transition min-h-[48px] border-b border-gray-50 last:border-0 ${
        active ? "bg-blue-50" : "hover:bg-blue-50"
      }`}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onSelect}
    >
      <div className="flex-1 min-w-0">
        <div>
          <span className="font-semibold text-gray-900 text-sm">{product.merk}</span>
          <span className="text-gray-500 text-sm ml-1.5">{product.type}</span>
        </div>
        {product.categorie && (
          <span className="text-gray-400 text-xs">{product.categorie}</span>
        )}
      </div>
      <span className="text-gray-400 text-xs font-mono shrink-0">{product.meldcode}</span>
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
/**
 * MeldcodeSearch
 *
 * Props:
 *   maatregelType  string       — used to filter products
 *   products       Product[]    — all products (loaded once by parent)
 *   detail         object       — current detail slice from wizard state
 *   onSelect       fn(product|null) — called when product selected or cleared
 *   onChange       fn(updates)  — called for manual meldcode + year changes
 */
export function MeldcodeSearch({ maatregelType, products, productsLoading, detail, onSelect, onChange }) {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [manualMode, setManualMode] = useState(false);

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Products for this measure type, sorted by popularity desc
  const typeProducts = products
    .filter((p) => p.maatregel_type === maatregelType)
    .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));

  const popularProducts = typeProducts.slice(0, 5);

  const filteredProducts =
    query.trim().length >= 1
      ? (() => {
          const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
          return typeProducts.filter((p) => {
            const haystack = [
              p.merk ?? "",
              p.type ?? "",
              p.meldcode ?? "",
              p.categorie ?? "",
            ].join(" ").toLowerCase();
            return tokens.every((t) => haystack.includes(t));
          });
        })()
      : [];

  const dropdownList = query.trim().length >= 1 ? filteredProducts : popularProducts;

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const rows = listRef.current.querySelectorAll("button");
      rows[activeIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  const handleSelect = (product) => {
    onSelect(product);
    setShowDropdown(false);
    setQuery("");
    setActiveIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!showDropdown) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, dropdownList.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0 && dropdownList[activeIndex]) {
      e.preventDefault();
      handleSelect(dropdownList[activeIndex]);
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  const selectedProduct = detail?.selectedProduct;

  // ─── Selected card ──────────────────────────────────────────────────────────
  if (selectedProduct) {
    return (
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">
          Meldcode installatie <span className="text-red-500">*</span>
        </label>
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="font-bold text-primary text-sm">
                {selectedProduct.merk} {selectedProduct.type}
              </p>
              {selectedProduct.categorie && (
                <p className="text-xs text-gray-500 mt-0.5">{selectedProduct.categorie}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => onSelect(null)}
              className="text-secondary text-xs font-medium hover:underline flex items-center gap-1 shrink-0 ml-3"
            >
              <X size={12} />
              Wijzigen
            </button>
          </div>

          {/* Key-value rows */}
          <div className="bg-white rounded-lg p-3 space-y-2 text-xs">
            {selectedProduct.categorie && (
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Categorie</span>
                <span className="font-medium text-gray-700">{selectedProduct.categorie}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Meldcode</span>
              <span className="font-mono font-bold text-primary">{selectedProduct.meldcode}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Subsidiebedrag</span>
              <span className="font-bold text-secondary">{fmt.format(selectedProduct.subsidiebedrag)}</span>
            </div>
          </div>

          {/* Year selectors */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-2">Jaar van plaatsing</p>
                <div className="flex flex-wrap gap-1.5">
                  {YEAR_OPTIONS.map((y) => (
                    <button
                      key={y}
                      type="button"
                      onClick={() => onChange({ jaar_plaatsing: y })}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                        detail?.jaar_plaatsing === y
                          ? "bg-[#3b5bf6] text-white border-[#3b5bf6]"
                          : "bg-white text-gray-500 border-gray-300 hover:border-[#3b5bf6] hover:text-[#3b5bf6]"
                      }`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-2">Jaar van aanschaf</p>
                <div className="flex flex-wrap gap-1.5">
                  {YEAR_OPTIONS.map((y) => (
                    <button
                      key={y}
                      type="button"
                      onClick={() => onChange({ jaar_aanschaf: y })}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                        detail?.jaar_aanschaf === y
                          ? "bg-[#3b5bf6] text-white border-[#3b5bf6]"
                          : "bg-white text-gray-500 border-gray-300 hover:border-[#3b5bf6] hover:text-[#3b5bf6]"
                      }`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3 text-center">De exacte datum halen wij op uit uw factuur.</p>
          </div>
        </div>
      </div>
    );
  }

  // ─── Search / manual input ──────────────────────────────────────────────────
  return (
    <div className="space-y-1.5" ref={containerRef}>
      <label className="block text-sm font-medium text-gray-700">
        Meldcode installatie <span className="text-red-500">*</span>
      </label>

      {/* Search input + dropdown wrapper */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
          onKeyDown={handleKeyDown}
          placeholder="Zoek op merk, type of meldcode"
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-white transition"
        />
        <Search
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />

        {/* Dropdown */}
        {showDropdown && !manualMode && (
          <div className="absolute z-50 w-full top-full mt-1 bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden">
            <div className="max-h-80 overflow-y-auto" ref={listRef}>
              {/* Loading state */}
              {productsLoading && (
                <div className="px-4 py-5 text-center text-sm text-gray-400">
                  <i className="fa-solid fa-circle-notch fa-spin mr-2" />
                  Producten laden…
                </div>
              )}

              {!productsLoading && <>
              {/* Popular header */}
              {query.trim().length < 1 && (
                <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-widest bg-gray-50 border-b border-gray-100">
                  Meest gezochte {MAATREGEL_LABELS[maatregelType] ?? maatregelType}
                </div>
              )}

              {/* Popular products (when no query) */}
              {query.trim().length < 1 &&
                popularProducts.map((p, i) => (
                  <ProductRow
                    key={p.id}
                    product={p}
                    active={activeIndex === i}
                    onSelect={() => handleSelect(p)}
                  />
                ))}

              {/* Empty popular list */}
              {query.trim().length < 1 && popularProducts.length === 0 && (
                <div className="px-4 py-5 text-center text-sm text-gray-400">
                  Typ om te zoeken naar producten
                </div>
              )}

              {/* Filtered results */}
              {query.trim().length >= 1 &&
                filteredProducts.map((p, i) => (
                  <ProductRow
                    key={p.id}
                    product={p}
                    active={activeIndex === i}
                    onSelect={() => handleSelect(p)}
                  />
                ))}

              {/* No results */}
              {query.trim().length >= 1 && filteredProducts.length === 0 && (
                <div className="px-4 py-5 text-center text-sm text-gray-400">
                  Geen producten gevonden voor &quot;{query}&quot;
                </div>
              )}
              </>}
            </div>
          </div>
        )}
      </div>

      {/* Manual entry link */}
      {!manualMode && (
        <button
          type="button"
          className="text-xs text-gray-400 hover:text-gray-600 underline transition"
          onClick={() => {
            setManualMode(true);
            setShowDropdown(false);
          }}
        >
          Meldcode niet gevonden? Voer handmatig in
        </button>
      )}

      {/* Manual input */}
      {manualMode && (
        <div className="flex items-center gap-2 mt-1">
          <input
            type="text"
            placeholder="bijv. KA17439"
            value={detail?.meldcode ?? ""}
            onChange={(e) => onChange({ meldcode: e.target.value })}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-white"
          />
          <button
            type="button"
            onClick={() => setManualMode(false)}
            className="text-xs text-gray-400 hover:text-gray-600 underline shrink-0"
          >
            Annuleren
          </button>
        </div>
      )}
    </div>
  );
}
