"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const PDOK_FREE_URL = "https://api.pdok.nl/bzk/locatieserver/search/v3_1/free";

const PDOK_FIELDS = "id,weergavenaam,postcode,huisnummer,straatnaam,woonplaatsnaam,huis_nlt";
const BASE_ESTIMATED_REFUND_EUR = 635;

function formatEuro(amount) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

const CHANCE_BASE = {
  label: "Kans aanwezig",
  sublabel: "Er is kans op teruggave. Met een gratis uitgebreide scan controleren we dit nauwkeurig voor u.",
  percentage: 55,
  segments: 1,
  colorClass: "text-amber-600",
  bgClass: "bg-amber-50",
  borderClass: "border-amber-300",
  barClass: "bg-amber-400",
  iconColor: "text-amber-500",
  estimateValue: BASE_ESTIMATED_REFUND_EUR,
};

const CHANCE_VERY_HIGH = {
  label: "Zeer hoge kans van slagen",
  sublabel: "Uw adresanalyse laat sterke signalen zien dat u recht heeft op teruggave.",
  percentage: 95,
  segments: 3,
  colorClass: "text-emerald-600",
  bgClass: "bg-emerald-50",
  borderClass: "border-emerald-300",
  barClass: "bg-emerald-500",
  iconColor: "text-emerald-500",
  estimateRange: "€ 800 – € 1.500",
};

const CHANCE_HIGH = {
  label: "Hoge kans",
  sublabel: "Uw adres bevat meerdere signalen. Een uitgebreide scan geeft snel uitsluitsel.",
  percentage: 85,
  segments: 2,
  colorClass: "text-secondary",
  bgClass: "bg-blue-50",
  borderClass: "border-blue-300",
  barClass: "bg-secondary",
  iconColor: "text-secondary",
  estimateValue: BASE_ESTIMATED_REFUND_EUR,
};

function normalizeText(value) {
  return String(value ?? "").trim().toLowerCase();
}

function normalizePostcode(postcode) {
  return String(postcode ?? "").replace(/\s/g, "").toUpperCase();
}

function normalizeAddition(addition) {
  return String(addition ?? "").trim().toUpperCase();
}

function responseHasEan(payload) {
  if (!payload || typeof payload !== "object") return false;

  if (typeof payload.total === "number") {
    return payload.total > 0;
  }

  const arrayCandidates = [
    payload.ecbInfoset,
    payload.ecbinfoset,
    payload.meteringPoints,
    payload.items,
    payload.results,
    payload.data,
    payload.connections,
  ];

  if (arrayCandidates.some((arr) => Array.isArray(arr) && arr.length > 0)) {
    return true;
  }

  if (typeof payload.ean === "string" && payload.ean.trim().length > 0) {
    return true;
  }

  if (Array.isArray(payload.eans) && payload.eans.length > 0) {
    return true;
  }

  // Deep scan so nested API responses like { meteringPoints: [{ eanCode: "..." }] }
  // are still recognized as a positive EAN hit.
  const stack = [payload];
  const seen = new Set();

  while (stack.length) {
    const current = stack.pop();
    if (!current || typeof current !== "object") continue;
    if (seen.has(current)) continue;
    seen.add(current);

    for (const [key, value] of Object.entries(current)) {
      if (/ean/i.test(key)) {
        if (typeof value === "string" && value.trim().length > 0) return true;
        if (Array.isArray(value) && value.length > 0) return true;
        if (value && typeof value === "object") return true;
      }

      if (key === "meteringPoints" && Array.isArray(value) && value.length > 0) {
        return true;
      }

      if (value && typeof value === "object") {
        stack.push(value);
      }
    }
  }

  return false;
}

function createChanceFromAnalysis(analysis) {
  if (analysis?.isNinetyFiveScenario || analysis?.veryHighReasons?.length) {
    const chance = {
      ...CHANCE_VERY_HIGH,
      reasons: analysis.veryHighReasons,
    };

    if ((analysis.subNumbersWithoutEanCount ?? 0) > 0) {
      chance.estimateValue = analysis.subNumbersWithoutEanCount * BASE_ESTIMATED_REFUND_EUR;
    }

    return chance;
  }

  if (analysis?.isEightyFiveScenario) {
    const chance = { ...CHANCE_HIGH };

    if ((analysis.subNumbersWithoutEanCount ?? 0) > 0) {
      chance.estimateValue = analysis.subNumbersWithoutEanCount * BASE_ESTIMATED_REFUND_EUR;
    }

    return chance;
  }

  if (!analysis?.veryHighReasons?.length) {
    return CHANCE_BASE;
  }

  return CHANCE_BASE;
}

function isCompleteAddress(doc) {
  const postcode = normalizePostcode(doc?.postcode);
  return Boolean(
    normalizeText(doc?.straatnaam) &&
      String(doc?.huisnummer ?? "").trim() &&
      normalizeText(doc?.woonplaatsnaam) &&
      /^\d{4}[A-Z]{2}$/.test(postcode)
  );
}

// Fetch all sub-addresses (44, 44A, 44B, …) for a given street + house number + city
// Uses straatnaam + woonplaatsnaam so we only match the right city/street combination
async function fetchSubAddresses(straatnaam, huisnummer, woonplaatsnaam, postcodePrefix) {
  if (!normalizeText(straatnaam) || !normalizeText(woonplaatsnaam) || !huisnummer) {
    return [];
  }

  const q = `${straatnaam} ${huisnummer} ${woonplaatsnaam}`;
  const url = `${PDOK_FREE_URL}?q=${encodeURIComponent(q)}&fq=type:adres&fq=huisnummer:${huisnummer}&fl=${PDOK_FIELDS}&rows=20`;
  const res = await fetch(url);
  const data = await res.json();
  // Post-filter on exact house number and city to avoid false matches
  return (data.response?.docs || []).filter(
    (doc) =>
      Number(doc.huisnummer) === Number(huisnummer) &&
      normalizeText(doc.woonplaatsnaam) === normalizeText(woonplaatsnaam) &&
      normalizeText(doc.straatnaam) === normalizeText(straatnaam) &&
      (!postcodePrefix || normalizePostcode(doc.postcode).startsWith(postcodePrefix))
  );
}

// Derive the letter/addition from huis_nlt (e.g. "44A" → "A")
function extractAddition(doc) {
  const huis_nlt = String(doc.huis_nlt ?? "");
  const base = String(doc.huisnummer ?? "");
  return huis_nlt.replace(new RegExp(`^${base}`), "").trim();
}

// Call our Next.js EAN proxy for one address
async function fetchEan(postalCode, streetNumber, streetNumberAddition, product = "ELK") {
  const params = new URLSearchParams({ postalCode, streetNumber: String(streetNumber), product });
  if (streetNumberAddition) params.set("streetNumberAddition", streetNumberAddition);
  const res = await fetch(`/api/ean-lookup?${params}`);
  if (!res.ok) return null;
  return res.json();
}

async function runAddressAnalysis(selectedDoc) {
  if (!isCompleteAddress(selectedDoc)) {
    return { veryHighReasons: [] };
  }

  const { huisnummer, straatnaam, woonplaatsnaam } = selectedDoc;
  const postcodePrefix = normalizePostcode(selectedDoc.postcode).slice(0, 4);
  const selectedAddition = normalizeAddition(extractAddition(selectedDoc));
  const baseNumber = Number(huisnummer);

  // Step 1 — determine neighbour house numbers (±2, only > 0)
  const neighborNumbers = [baseNumber - 2, baseNumber, baseNumber + 2].filter((n) => n > 0);

  // Step 2 — fetch sub-addresses for each neighbour
  const subAddressesByNumber = await Promise.all(
    neighborNumbers.map(async (num) => {
      const docs = await fetchSubAddresses(straatnaam, num, woonplaatsnaam, postcodePrefix);
      return { number: num, docs };
    })
  );

  const allAddresses = subAddressesByNumber.flatMap(({ docs }) => {
    if (docs.length === 0) {
      return [];
    }
    return docs.map((doc) => ({
      weergavenaam: doc.weergavenaam,
      postcode: doc.postcode,
      huisnummer: Number(doc.huisnummer),
      addition: extractAddition(doc),
      straatnaam: doc.straatnaam,
      woonplaatsnaam: doc.woonplaatsnaam,
    }));
  });

  const seenAddressKeys = new Set();
  const uniqueAddresses = allAddresses.filter((addr) => {
    const key = `${normalizePostcode(addr.postcode)}|${addr.huisnummer}|${normalizeAddition(addr.addition)}`;
    if (seenAddressKeys.has(key)) return false;
    seenAddressKeys.add(key);
    return true;
  });

  // Step 3 — fetch EAN for every address
  const eanResults = await Promise.all(
    uniqueAddresses.map(async (addr) => {
      const data = await fetchEan(addr.postcode, addr.huisnummer, addr.addition);
      return {
        ...addr,
        ean: data,
        hasEan: responseHasEan(data),
      };
    })
  );

  const groupedByNumber = eanResults.reduce((acc, item) => {
    if (!acc[item.huisnummer]) acc[item.huisnummer] = [];
    acc[item.huisnummer].push(item);
    return acc;
  }, {});

  const enteredNumberGroup = groupedByNumber[baseNumber] ?? [];
  const selectedIsSubNumber = Boolean(selectedAddition);
  const subNumberEntries = enteredNumberGroup.filter((entry) => Boolean(normalizeAddition(entry.addition)));
  const selectedAddressEntry =
    enteredNumberGroup.find((entry) => normalizeAddition(entry.addition) === selectedAddition) ?? null;
  const selectedHasEan = selectedAddressEntry
    ? selectedAddressEntry.hasEan
    : enteredNumberGroup.some((entry) => entry.hasEan);

  const hasSubNumberContext = selectedIsSubNumber || subNumberEntries.length > 0;
  const subNumbersWithEanCount = subNumberEntries.filter((entry) => entry.hasEan).length;
  const subNumbersWithoutEanCount = subNumberEntries.filter((entry) => !entry.hasEan).length;
  const hasAnySubWithEan = subNumbersWithEanCount > 0;
  const selectedSubHasEan = selectedIsSubNumber && selectedAddressEntry ? selectedAddressEntry.hasEan : false;
  const selectedSubHasNoEan = selectedIsSubNumber && selectedAddressEntry ? !selectedAddressEntry.hasEan : false;
  const siblingSubWithoutEan =
    selectedIsSubNumber &&
    subNumberEntries.some(
      (entry) => normalizeAddition(entry.addition) !== selectedAddition && !entry.hasEan
    );

  // Requested behavior:
  // - Main number (e.g. 82) with a subnumber that has EAN => 85%
  // - Subnumber (e.g. 82A) with own EAN while sibling (e.g. 82B) has no EAN => 95%
  // - Subnumber (e.g. 82B) with no EAN => 95%
  const isEightyFiveScenario = !selectedIsSubNumber && hasAnySubWithEan;
  const isNinetyFiveScenario = selectedSubHasNoEan || (selectedSubHasEan && siblingSubWithoutEan);

  const subNumberWithoutEan = hasSubNumberContext && subNumbersWithoutEanCount > 0;

  const lowerGroup = groupedByNumber[baseNumber - 2] ?? [];
  const upperGroup = groupedByNumber[baseNumber + 2] ?? [];
  const lowerNoEan = lowerGroup.length > 0 && lowerGroup.every((entry) => !entry.hasEan);
  const upperNoEan = upperGroup.length > 0 && upperGroup.every((entry) => !entry.hasEan);

  const veryHighReasons = [];

  if (subNumberWithoutEan && !isEightyFiveScenario) {
    veryHighReasons.push(
      `Binnen deze subnummer-reeks hebben ${subNumbersWithoutEanCount} subnummer(s) geen EAN.`
    );
  }
  if (lowerNoEan || upperNoEan) {
    veryHighReasons.push("Een direct buuradres (nummer onder of boven) heeft geen EAN.");
  }
  if (!selectedHasEan) {
    veryHighReasons.push("Het ingevoerde adres zelf heeft geen EAN.");
  }

  return {
    veryHighReasons,
    subNumbersWithoutEanCount,
    isEightyFiveScenario,
    isNinetyFiveScenario,
  };
}

export default function ServiceHero() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [chance, setChance] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [animatedPct, setAnimatedPct] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  const debounceRef = useRef(null);
  const containerRef = useRef(null);
  const analysisRunRef = useRef(0);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Debounced PDOK address search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!isTyping || query.length < 4) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setFetchLoading(true);
      try {
        const res = await fetch(
          `${PDOK_FREE_URL}?q=${encodeURIComponent(query)}&fq=type:adres&fl=${PDOK_FIELDS}&rows=6`
        );
        const data = await res.json();
        const docs = data.response?.docs || [];
        setSuggestions(docs);
        setShowDropdown(docs.length > 0);
      } catch {
        setSuggestions([]);
      } finally {
        setFetchLoading(false);
      }
    }, 300);
  }, [query, isTyping]);

  // Animate progress bar after address selection
  useEffect(() => {
    if (!chance) { setAnimatedPct(0); return; }
    setAnimatedPct(0);
    const t = setTimeout(() => setAnimatedPct(chance.percentage), 80);
    return () => clearTimeout(t);
  }, [chance]);

  function selectAddress(doc) {
    setQuery(doc.weergavenaam);
    setIsTyping(false);
    setShowDropdown(false);
    setSuggestions([]);
    setSelectedAddress(doc);
    setChance(null);
    setAnalysisLoading(true);

    const runId = analysisRunRef.current + 1;
    analysisRunRef.current = runId;

    if (!isCompleteAddress(doc)) {
      setChance(CHANCE_BASE);
      setAnalysisLoading(false);
      return;
    }

    runAddressAnalysis(doc)
      .then((analysis) => {
        if (analysisRunRef.current !== runId) return;
        setChance(createChanceFromAnalysis(analysis));
      })
      .catch(() => {
        if (analysisRunRef.current !== runId) return;
        setChance(CHANCE_BASE);
      })
      .finally(() => {
        if (analysisRunRef.current !== runId) return;
        setAnalysisLoading(false);
      });
  }

  const aanvraagHref = (() => {
    if (!selectedAddress) return "/energiebelasting/aanvragen";

    const params = new URLSearchParams();
    params.set("adres", selectedAddress.weergavenaam ?? "");
    params.set("straat", selectedAddress.straatnaam ?? "");
    params.set("huisnummer", String(selectedAddress.huisnummer ?? ""));
    params.set("postcode", selectedAddress.postcode ?? "");
    params.set("stad", selectedAddress.woonplaatsnaam ?? "");

    if (chance?.percentage) {
      params.set("slagingskans", String(chance.percentage));
      params.set("kansLabel", chance.label ?? "");
    }

    return `/energiebelasting/aanvragen?${params.toString()}`;
  })();

  return (
    <section className="hero-bg relative pt-24 pb-32 curve-bottom w-full overflow-hidden">
      {/* Dot grid overlay */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Glow orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-24 top-16 w-[480px] h-[480px] bg-secondary/20 rounded-full blur-3xl" />
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left — text */}
          <div>
            <div className="inline-flex items-center bg-white/10 rounded-full px-4 py-1.5 mb-6 border border-white/20">
              <i className="fa-solid fa-bolt text-yellow-400 mr-2" />
              <span className="text-white text-sm font-medium">Terugvragen tot 5 jaar terug</span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
              <span className="inline-block whitespace-nowrap" style={{ wordSpacing: "-0.08em" }}>
                Energiebelasting terugvragen?
              </span>{" "}
              Veel woningeigenaren betalen onnodig te veel.
            </h1>

            <p className="text-lg text-gray-200 mb-10 leading-relaxed">
              Woont u in een appartementencomplex of heeft u meerdere woningen achter één elektriciteitsaansluiting?
              Grote kans dat u te veel energiebelasting betaalt. Vul uw adres in en zie direct uw kans.
            </p>

            <div className="flex flex-wrap gap-6 text-sm text-gray-300">
              <div className="flex items-center">
                <i className="fa-solid fa-shield-halved text-secondary mr-2" />
                No Cure No Pay
              </div>
              <div className="flex items-center">
                <i className="fa-solid fa-clock text-secondary mr-2" />
                Binnen 2 werkdagen duidelijkheid
              </div>
              <div className="flex items-center">
                <i className="fa-solid fa-star text-yellow-400 mr-2" />
                4.8/5 Klantbeoordeling
              </div>
            </div>
          </div>

          {/* Right — address checker card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full lg:ml-auto">
            <h2 className="text-lg font-bold text-primary mb-1">Gratis pre-scan, zie direct uw kans</h2>
            <p className="text-xs text-gray-500 mb-5">Vul hier uw adres in · Geen registratie nodig</p>

            {/* Address input + autocomplete */}
            <div className="relative" ref={containerRef}>
              <div
                className={`flex items-center border-2 rounded-xl transition-all duration-200 ${
                  showDropdown || query
                    ? "border-secondary ring-4 ring-secondary/20"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <i className="fa-solid fa-location-dot text-gray-400 ml-4 mr-2 flex-shrink-0 text-sm" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setIsTyping(true);
                    setQuery(e.target.value);
                    setSelectedAddress(null);
                    setChance(null);
                  }}
                  placeholder="Bijv. Kalverstraat 1, Amsterdam..."
                  aria-label="Voer uw adres in"
                  className="flex-1 py-3.5 pr-3 text-sm text-gray-800 placeholder:text-gray-400 outline-none bg-transparent font-medium"
                />
                {fetchLoading && (
                  <i className="fa-solid fa-spinner fa-spin text-secondary mr-4 text-sm flex-shrink-0" />
                )}
              </div>

              {showDropdown && suggestions.length > 0 && (
                <div className="absolute z-30 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden">
                  {suggestions.map((doc) => (
                    <button
                      key={doc.id}
                      type="button"
                      onMouseDown={() => selectAddress(doc)}
                      className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-background transition-colors border-b border-gray-50 last:border-0"
                    >
                      <i className="fa-solid fa-location-dot text-secondary text-xs flex-shrink-0" />
                      <span className="text-sm text-gray-700 font-medium truncate">{doc.weergavenaam}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Result — shown after address selection */}
            {analysisLoading && selectedAddress ? (
              <div className="mt-5 rounded-xl border-2 p-5 bg-blue-50 border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <i className="fa-solid fa-spinner fa-spin text-secondary" />
                  <span className="font-bold text-sm text-secondary">Adres wordt geanalyseerd</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  We controleren subnummers, buuradressen en EAN-gegevens om uw kans zo nauwkeurig mogelijk te bepalen.
                </p>
              </div>
            ) : chance && selectedAddress ? (
              <div className={`mt-5 rounded-xl border-2 p-5 ${chance.bgClass} ${chance.borderClass}`}>

                {/* Chance header */}
                <div className="flex items-center gap-2 mb-4">
                  <i className={`fa-solid fa-circle-check text-xl ${chance.iconColor}`} />
                  <span className={`font-bold text-sm ${chance.colorClass}`}>{chance.label}</span>
                </div>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Slagingskans</span>
                    <span className={`text-sm font-bold ${chance.colorClass}`}>{chance.percentage}%</span>
                  </div>
                  <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${chance.barClass}`}
                      style={{ width: `${animatedPct}%` }}
                    />
                  </div>
                </div>

                <p className="text-xs text-gray-600 mb-4 leading-relaxed">{chance.sublabel}</p>

                {/* Estimate range */}
                <div className="flex items-center justify-between bg-white/80 rounded-lg px-3 py-2.5 mb-4 border border-white">
                  <span className="text-xs text-gray-500 font-medium">Indicatie mogelijke teruggave</span>
                  <span className="text-sm font-bold text-primary">
                    {typeof chance.estimateValue === "number"
                      ? formatEuro(chance.estimateValue)
                      : chance.estimateRange}
                  </span>
                </div>

                <Link
                  href={aanvraagHref}
                  className="group w-full block py-3 bg-yellow-400 hover:bg-yellow-500 text-primary font-bold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg text-sm text-center"
                >
                  Ja, vraag gratis scan aan
                  <i className="fa-solid fa-arrow-right ml-2 cta-arrow-bounce" />
                </Link>

                <p className="text-center text-xs text-gray-400 pt-3">
                  Gratis · Binnen 2 werkdagen duidelijkheid · Daarna beslist u zelf
                </p>
              </div>
            ) : (
              <div className="mt-5">
                <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-4">
                  <i className="fa-solid fa-circle-info text-secondary text-sm mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Na uw aanvraag controleert een specialist uw situatie handmatig.
                    U ontvangt binnen 2 werkdagen duidelijkheid.
                  </p>
                </div>

                <Link
                  href="/energiebelasting/aanvragen"
                  className="group w-full block py-3 bg-yellow-400 hover:bg-yellow-500 text-primary font-bold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg mb-2 text-sm text-center"
                >
                  Vraag gratis scan aan
                  <i className="fa-solid fa-arrow-right ml-2 cta-arrow-bounce" />
                </Link>

                <p className="text-center text-xs text-gray-400 pt-1">
                  Gratis · Binnen 2 werkdagen duidelijkheid · Daarna beslist u zelf
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
