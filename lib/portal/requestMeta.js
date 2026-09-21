// Woordenboek voor dossiers/aanvragen in het klantportaal. Houdt exact dezelfde
// termen aan als het interne Subzy-dashboard:
//   - subsy-dashboard/src/utils/constants.js  -> STATUSES, REQUEST_TYPES
//   - subsy-dashboard/src/ui/Status.jsx       -> statuskleuren
// Wijzigt daar iets, pas het hier ook aan.

// requests.requestType (numeriek) -> weergave
export const REQUEST_TYPES = {
  1: "Energiebelasting",
  2: "SVOH",
  3: "ISDE",
};

const REQUEST_TYPE_META = {
  1: { label: "Energiebelasting", icon: "fa-bolt",            accent: "text-secondary",   badge: "bg-blue-100 text-secondary border-blue-200" },
  2: { label: "SVOH",             icon: "fa-house-chimney-window", accent: "text-green-600",   badge: "bg-green-100 text-green-700 border-green-200" },
  3: { label: "ISDE",             icon: "fa-solar-panel",      accent: "text-orange-500",  badge: "bg-orange-100 text-orange-700 border-orange-200" },
};

export function getRequestTypeMeta(requestType) {
  return (
    REQUEST_TYPE_META[Number(requestType)] || {
      label: "Aanvraag",
      icon: "fa-folder-open",
      accent: "text-secondary",
      badge: "bg-blue-100 text-secondary border-blue-200",
    }
  );
}

// requests.status (tekst) — exact de waarden uit het admin-dashboard.
// Sleutel = status in kleine letters.
const STATUS_META = {
  concept:   { label: "Concept",   pill: "bg-slate-100 text-slate-600 border-slate-200",      dot: "bg-slate-400"   },
  controle:  { label: "Controle",  pill: "bg-indigo-50 text-indigo-700 border-indigo-200",    dot: "bg-indigo-400"  },
  ingediend: { label: "Ingediend", pill: "bg-amber-50 text-amber-700 border-amber-200",       dot: "bg-amber-400"   },
  bevestigd: { label: "Bevestigd", pill: "bg-blue-50 text-blue-700 border-blue-200",          dot: "bg-blue-400"    },
  ontvangen: { label: "Ontvangen", pill: "bg-purple-50 text-purple-700 border-purple-200",    dot: "bg-purple-400"  },
  afgerond:  { label: "Afgerond",  pill: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
};

// Volgorde zoals in het admin-dashboard (STATUSES, met Ontvangen vóór Afgerond).
export const STATUS_ORDER = ["concept", "controle", "ingediend", "bevestigd", "ontvangen", "afgerond"];

export function getStatusKey(value) {
  return String(value || "").trim().toLowerCase();
}

export function getStatusMeta(value) {
  return (
    STATUS_META[getStatusKey(value)] || {
      label: value || "Onbekend",
      pill: "bg-gray-100 text-gray-600 border-gray-200",
      dot: "bg-gray-300",
    }
  );
}

// "Afgerond" is de eindstatus in het admin-dashboard; al het andere loopt nog.
export function isCompletedStatus(value) {
  return getStatusKey(value) === "afgerond";
}
