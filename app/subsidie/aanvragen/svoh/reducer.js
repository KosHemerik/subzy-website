// ─── Initial state ────────────────────────────────────────────────────────────

export const initialState = {
  step: 1,

  // Step 1 — woningen with selected maatregelen per woning
  // Each woning: { id: number, maatregelen: string[] }
  woningen: [{ id: 1, maatregelen: [] }],

  // Flat list derived from woningen — { id, type, woningId }
  // Keyed by `woning-${woningId}-${type}` for stable IDs
  measures: [],

  // ISDE-only: flat list of selected measure types (no woning context)
  // Keyed by `isde-${type}` for stable IDs
  isde_maatregelen: [],

  // Step 2 — details keyed by measure id
  details: {},

  // Doelgroep from the link the user came in with: 'particulier' | 'vve' | 'zakelijk' | 'verhuurder'
  doelgroep: "",

  // Step 3 — aanvrager type + contact
  aanvrager_type: "", // 'bedrijf' | 'particulier'

  // Bedrijf fields
  bedrijf: {
    kvk_nummer: "",
    bedrijfsnaam: "",
    iban: "",
    meer_dan_250: "",
    voorletters: "",
    tussenvoegsel: "",
    achternaam: "",
    geslacht: "",
    telefoon: "",
    email: "",
    correspondentieadres: defaultAdres(),
  },

  // Particulier fields
  particulier: {
    voornaam: "",
    tussenvoegsel: "",
    achternaam: "",
    geslacht: "",
    bsn: "",
    iban: "",
    telefoon: "",
    email: "",
    woonadres: { ...defaultAdres(), land: "Nederland" },
  },

  // Step 4 — documents keyed by measure id, then category
  // { [measureId]: { factuur: File[], betaalbewijs: File[], fotos: File[], netbeheerder: File[], overig: File[] } }
  docFiles: {},

  // Aanvraag id assigned after first Supabase insert (draft)
  aanvraag_id: null,

  // Step 5 — verklaringen
  verklaringen: {
    verklaring: false,
    akkoord_machtiging: false,
  },

  // Meta
  submitted: false,
  submitted_id: null,
  loading: false,
  error: "",
};

// ─── Reducer ──────────────────────────────────────────────────────────────────

export function reducer(state, action) {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, step: action.payload };

    case "NEXT_STEP":
      return { ...state, step: Math.min(state.step + 1, 5) };

    case "PREV_STEP":
      return { ...state, step: Math.max(state.step - 1, 1) };

    // Step 1 — woning-level actions
    case "ADD_WONING": {
      const nextId = Math.max(...state.woningen.map((w) => w.id), 0) + 1;
      return { ...state, woningen: [...state.woningen, { id: nextId, maatregelen: [] }] };
    }

    case "REMOVE_WONING": {
      const woningId = action.payload;
      const woning = state.woningen.find((w) => w.id === woningId);
      if (!woning) return state;
      const idsToRemove = new Set(woning.maatregelen.map((t) => `woning-${woningId}-${t}`));
      const remainingDetails = Object.fromEntries(
        Object.entries(state.details).filter(([k]) => !idsToRemove.has(k))
      );
      const remainingDocFiles = Object.fromEntries(
        Object.entries(state.docFiles).filter(([k]) => !idsToRemove.has(k))
      );
      return {
        ...state,
        woningen: state.woningen.filter((w) => w.id !== woningId),
        measures: state.measures.filter((m) => !idsToRemove.has(m.id)),
        details: remainingDetails,
        docFiles: remainingDocFiles,
      };
    }

    case "TOGGLE_WONING_MAATREGEL": {
      const { woningId, type } = action.payload;
      const woningIdx = state.woningen.findIndex((w) => w.id === woningId);
      if (woningIdx === -1) return state;
      const woning = state.woningen[woningIdx];
      const measureId = `woning-${woningId}-${type}`;
      const hasType = woning.maatregelen.includes(type);
      if (hasType) {
        const { [measureId]: _d, ...remainingDetails } = state.details;
        const { [measureId]: _f, ...remainingDocFiles } = state.docFiles;
        return {
          ...state,
          woningen: state.woningen.map((w, i) =>
            i === woningIdx ? { ...w, maatregelen: w.maatregelen.filter((t) => t !== type) } : w
          ),
          measures: state.measures.filter((m) => m.id !== measureId),
          details: remainingDetails,
          docFiles: remainingDocFiles,
        };
      } else {
        return {
          ...state,
          woningen: state.woningen.map((w, i) =>
            i === woningIdx ? { ...w, maatregelen: [...w.maatregelen, type] } : w
          ),
          measures: [...state.measures, { id: measureId, type, woningId }],
          details: { ...state.details, [measureId]: defaultDetail(type) },
        };
      }
    }

    // ISDE — toggle a measure type (flat, no woning)
    case "TOGGLE_ISDE_MAATREGEL": {
      const { type: isdeType } = action.payload;
      const measureId = `isde-${isdeType}`;
      const has = state.isde_maatregelen.includes(isdeType);
      if (has) {
        const { [measureId]: _d, ...rd } = state.details;
        const { [measureId]: _f, ...rf } = state.docFiles;
        return {
          ...state,
          isde_maatregelen: state.isde_maatregelen.filter((t) => t !== isdeType),
          measures: state.measures.filter((m) => m.id !== measureId),
          details: rd,
          docFiles: rf,
        };
      } else {
        const detail = defaultDetail(isdeType);
        // Particulier: all measures are in the own home, so start from an address already entered
        const bekendAdres = state.doelgroep === "particulier" ? eersteIsdeAdres(state) : null;
        if (bekendAdres && detail.woningen) detail.woningen = [{ ...bekendAdres }];
        return {
          ...state,
          isde_maatregelen: [...state.isde_maatregelen, isdeType],
          measures: [...state.measures, { id: measureId, type: isdeType }],
          details: { ...state.details, [measureId]: detail },
        };
      }
    }

    // Legacy: kept for backward-compat (preselect from URL)
    case "ADD_MEASURE": {
      const newMeasure = { id: action.payload.id, type: action.payload.measureType };
      return {
        ...state,
        measures: [...state.measures, newMeasure],
        details: {
          ...state.details,
          [action.payload.id]: defaultDetail(action.payload.measureType),
        },
      };
    }

    case "REMOVE_MEASURE": {
      const { [action.payload]: _removed, ...remainingDetails } = state.details;
      return {
        ...state,
        measures: state.measures.filter((m) => m.id !== action.payload),
        details: remainingDetails,
      };
    }

    // Step 2 — update a field inside a detail entry
    // action.payload: { id, path: string[], value }
    case "UPDATE_DETAIL": {
      const { id, path, value } = action.payload;
      return {
        ...state,
        details: {
          ...state.details,
          [id]: setIn(state.details[id] ?? {}, path, value),
        },
      };
    }

    // Step 2 — add a sub-item (e.g. extra woning, extra meldcode)
    case "ADD_SUB_ITEM": {
      const { id, listKey, template } = action.payload;
      const current = state.details[id] ?? {};
      return {
        ...state,
        details: {
          ...state.details,
          [id]: {
            ...current,
            [listKey]: [...(current[listKey] ?? []), template],
          },
        },
      };
    }

    // Step 2 — update a sub-item field (field: null replaces whole item)
    case "UPDATE_SUB_ITEM": {
      const { id, listKey, index, field, value } = action.payload;
      const current = state.details[id] ?? {};
      const list = [...(current[listKey] ?? [])];
      const vorige = list[index];
      list[index] = field === null ? value : { ...list[index], [field]: value };
      const next = {
        ...state,
        details: {
          ...state.details,
          [id]: { ...current, [listKey]: list },
        },
      };
      if (state.doelgroep === "particulier" && listKey === "woningen" && id.startsWith("isde-")) {
        return syncIsdeAdres(next, id, vorige, list[index]);
      }
      return next;
    }

    case "REMOVE_SUB_ITEM": {
      const { id, listKey, index } = action.payload;
      const current = state.details[id] ?? {};
      const list = (current[listKey] ?? []).filter((_, i) => i !== index);
      return {
        ...state,
        details: {
          ...state.details,
          [id]: { ...current, [listKey]: list },
        },
      };
    }

    // Step 3
    case "SET_DOELGROEP":
      return { ...state, doelgroep: action.payload };

    case "SET_AANVRAGER_TYPE":
      return { ...state, aanvrager_type: action.payload };

    case "UPDATE_BEDRIJF":
      return { ...state, bedrijf: { ...state.bedrijf, ...action.payload } };

    case "UPDATE_BEDRIJF_ADRES":
      return {
        ...state,
        bedrijf: { ...state.bedrijf, correspondentieadres: { ...state.bedrijf.correspondentieadres, ...action.payload } },
      };

    case "UPDATE_PARTICULIER":
      return { ...state, particulier: { ...state.particulier, ...action.payload } };

    case "UPDATE_PARTICULIER_ADRES":
      return {
        ...state,
        particulier: { ...state.particulier, woonadres: { ...state.particulier.woonadres, ...action.payload } },
      };

    // Step 4 — documents per measure + category
    // payload: { measureId, category, files: File[] }
    case "ADD_DOC_FILES": {
      const { measureId, category, files } = action.payload;
      const existing = state.docFiles[measureId]?.[category] ?? [];
      const merged = [...existing, ...files].slice(0, 3);
      return {
        ...state,
        docFiles: {
          ...state.docFiles,
          [measureId]: {
            ...(state.docFiles[measureId] ?? {}),
            [category]: merged,
          },
        },
      };
    }

    case "REMOVE_DOC_FILE": {
      const { measureId, category, index } = action.payload;
      const list = (state.docFiles[measureId]?.[category] ?? []).filter((_, i) => i !== index);
      return {
        ...state,
        docFiles: {
          ...state.docFiles,
          [measureId]: {
            ...(state.docFiles[measureId] ?? {}),
            [category]: list,
          },
        },
      };
    }

    // payload: { measureId, category }
    case "CLEAR_DOC_CATEGORY": {
      const { measureId, category } = action.payload;
      if (!state.docFiles[measureId]?.[category]) return state;
      const { [category]: _c, ...rest } = state.docFiles[measureId];
      return { ...state, docFiles: { ...state.docFiles, [measureId]: rest } };
    }

    // Step 5 — verklaringen
    case "SET_VERKLARING":
      return {
        ...state,
        verklaringen: { ...state.verklaringen, [action.payload.key]: action.payload.value },
      };

    case "SET_AANVRAAG_ID":
      return { ...state, aanvraag_id: action.payload };

    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    case "SET_SUBMITTED":
      return { ...state, submitted: true, submitted_id: action.payload, loading: false };

    default:
      return state;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function defaultDetail(type) {
  switch (type) {
    case "warmtepomp":
      return {
        nog_aardgas: "",
        meldcode: "",
        uitvoeringsdatum: { dag: "", maand: "", jaar: "" },
        aanschafdatum: { dag: "", maand: "", jaar: "" },
        woningen: [defaultAdres()],
      };
    case "isolatie":
      return {
        type_isolatie: "",
        oppervlakte: "",
        meldcodes: [{ meldcode: "", oppervlakte: "" }],
        verklaring_m2: false,
        uitvoeringsdatum: { dag: "", maand: "", jaar: "" },
        woningen: [defaultAdres()],
      };
    case "zonneboiler":
      return {
        meldcode: "",
        uitvoeringsdatum: { dag: "", maand: "", jaar: "" },
        woningen: [defaultAdres()],
      };
    case "elektrisch":
      return {
        datum_gasmeter: { dag: "", maand: "", jaar: "" },
        verklaring_gasmeter: false,
        verklaring_warmtenet: false,
        verklaring_geen_eerdere_subsidie: false,
        aanschafdatum_kookvoorziening: { dag: "", maand: "", jaar: "" },
        verklaring_nieuw: false,
        woningen: [defaultAdres()],
      };
    case "ventilatie":
      return {
        meldcode: "",
        categorie: "",
        uitvoeringsdatum: { dag: "", maand: "", jaar: "" },
        woningen: [defaultAdres()],
      };
    case "warmtenet":
      return {
        warmtebedrijf: "",
        aansluitdatum: { dag: "", maand: "", jaar: "" },
        verklaring_geen_eerdere_subsidie: false,
        woningen: [defaultAdres()],
      };
    default:
      return {};
  }
}

export function defaultAdres() {
  return { postcode: "", huisnummer: "", toevoeging: "", straat: "", plaats: "" };
}

// ─── ISDE particulier: one home for every measure ─────────────────────────────
const ADRES_VELDEN = ["postcode", "huisnummer", "toevoeging", "straat", "plaats"];

const isLeegAdres = (a) => ADRES_VELDEN.every((k) => !(a?.[k] ?? "").toString().trim());
const zelfdeAdres = (a, b) => ADRES_VELDEN.every((k) => (a?.[k] ?? "") === (b?.[k] ?? ""));

function eersteIsdeAdres(state) {
  for (const m of state.measures) {
    const adres = state.details[m.id]?.woningen?.[0];
    if (!isLeegAdres(adres)) return adres;
  }
  return null;
}

// Copies an address edit to the other measures and to "Uw adres", but only where that
// address is still empty or still equal to the old value — anything the user changed
// separately stays untouched.
function syncIsdeAdres(state, bronId, vorige, nieuw) {
  const volgt = (adres) => isLeegAdres(adres) || zelfdeAdres(adres, vorige);
  const details = { ...state.details };

  state.measures.forEach((m) => {
    if (m.id === bronId) return;
    const woningen = details[m.id]?.woningen;
    if (!woningen?.length || !volgt(woningen[0])) return;
    details[m.id] = { ...details[m.id], woningen: [{ ...woningen[0], ...pick(nieuw) }, ...woningen.slice(1)] };
  });

  const woonadres = state.particulier.woonadres;
  const particulier = volgt(woonadres)
    ? { ...state.particulier, woonadres: { ...woonadres, ...pick(nieuw) } }
    : state.particulier;

  return { ...state, details, particulier };
}

const pick = (adres) => Object.fromEntries(ADRES_VELDEN.map((k) => [k, adres?.[k] ?? ""]));

// Immutable nested set helper
function setIn(obj, [key, ...rest], value) {
  if (rest.length === 0) return { ...obj, [key]: value };
  return { ...obj, [key]: setIn(obj[key] ?? {}, rest, value) };
}

// ─── Subsidiebedrag per jaar ──────────────────────────────────────────────────
// Elke RVO-meldcodelijst staat in de tabel met zijn eigen geldig_vanaf. Het bedrag komt uit
// de nieuwste lijst die in het aanschafjaar is ingegaan; zonder lijst voor dat jaar is het onbekend.
export function bedragVoorJaar(products, maatregelType, meldcode, jaar) {
  const match = products
    .filter(
      (p) =>
        p.maatregel_type === maatregelType &&
        p.meldcode === meldcode &&
        p.geldigVanaf?.startsWith(`${jaar}-`)
    )
    .sort((a, b) => b.geldigVanaf.localeCompare(a.geldigVanaf))[0];

  return match
    ? { subsidiebedrag: match.subsidiebedrag, bedrag_onbekend: false }
    : { subsidiebedrag: 0, bedrag_onbekend: true };
}

// ─── ISDE maatregelen per doelgroep ───────────────────────────────────────────
const ISDE_MEASURE_TYPES = ["warmtepomp", "isolatie", "ventilatie", "zonneboiler", "warmtenet", "elektrisch"];
const ISDE_ZAKELIJK_MEASURE_TYPES = ["warmtepomp", "zonneboiler"];

export function isdeMaatregelenVoor(doelgroep) {
  return doelgroep === "zakelijk" ? ISDE_ZAKELIJK_MEASURE_TYPES : ISDE_MEASURE_TYPES;
}

// ISDE zakelijk: a lucht-water warmtepomp needs a jaarnota instead of the aardgas question
export function isLuchtWater(detail) {
  return detail?.selectedProduct?.categorie === "Lucht-Water";
}

// ─── Price map ────────────────────────────────────────────────────────────────
export const MEASURE_PRICES = {
  warmtepomp: 2400,
  isolatie: 1200,
  zonneboiler: 900,
  elektrisch: 400,
  ventilatie: 400,
  warmtenet: 3775,
};

export const MEASURE_RANGES = {
  warmtepomp: { min: 1800, max: 3200, label: "Ca. €1.800 – €3.200 subsidie" },
  isolatie:   { min: 800,  max: 2400, label: "Ca. €800 – €2.400 subsidie — afhankelijk van type en m²" },
  zonneboiler:{ min: 700,  max: 1200, label: "Ca. €700 – €1.200 subsidie" },
  elektrisch: { min: 400,  max: 400,  label: "Vast bedrag van €400 subsidie" },
  ventilatie: { min: 400,  max: 400,  label: "Vast bedrag van €400 subsidie" },
  warmtenet:  { min: 3775, max: 3775, label: "Vast bedrag van €3.775 subsidie" },
};

export const MEASURE_META = {
  warmtepomp: {
    icon: "fa-solid fa-fire-flame-curved",
    label: "Warmtepomp",
    subtitle: "Hybride of volledig elektrisch",
  },
  isolatie: {
    icon: "fa-solid fa-house-chimney-window",
    label: "Isolatie",
    subtitle: "Dak, gevel, vloer, spouwmuur of glas",
  },
  zonneboiler: {
    icon: "fa-solid fa-droplet",
    label: "Zonneboiler",
    subtitle: "Zonnecollectoren voor warm water",
  },
  elektrisch: {
    icon: "fa-solid fa-bolt",
    label: "Elektrische kookvoorziening",
    subtitle: "Vervanging gasaansluiting",
  },
  ventilatie: {
    icon: "fa-solid fa-wind",
    label: "Ventilatiesysteem",
    subtitle: "Alleen in combinatie met isolatie",
  },
  warmtenet: {
    icon: "fa-solid fa-city",
    label: "Aansluiting warmtenet",
    subtitle: "Aansluiting op een warmtedistributienet",
  },
};
