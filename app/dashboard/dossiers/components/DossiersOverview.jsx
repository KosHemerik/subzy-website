"use client";

import { useAuth } from "@/lib/auth";
import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const statusMeta = {
  nieuw: {
    label: "Nieuw",
    pill: "bg-blue-100 text-blue-700 border-blue-200",
    tone: "from-blue-50 to-sky-50",
  },
  in_behandeling: {
    label: "In behandeling",
    pill: "bg-amber-100 text-amber-700 border-amber-200",
    tone: "from-amber-50 to-orange-50",
  },
  completed: {
    label: "Afgerond",
    pill: "bg-green-100 text-green-700 border-green-200",
    tone: "from-green-50 to-emerald-50",
  },
  afgerond: {
    label: "Afgerond",
    pill: "bg-green-100 text-green-700 border-green-200",
    tone: "from-green-50 to-emerald-50",
  },
  waiting: {
    label: "Wachten",
    pill: "bg-orange-100 text-orange-700 border-orange-200",
    tone: "from-orange-50 to-amber-50",
  },
  default: {
    label: "Open",
    pill: "bg-slate-100 text-slate-700 border-slate-200",
    tone: "from-slate-50 to-blue-50",
  },
};

const requestTypeMeta = {
  1: { label: "Energiebelasting", icon: "fa-bolt", accent: "text-secondary" },
  2: { label: "Subsidie", icon: "fa-solar-panel", accent: "text-orange-500" },
  3: { label: "SVOH", icon: "fa-building-columns", accent: "text-green-500" },
};

function getStatusKey(value) {
  if (!value) return "default";
  return String(value).toLowerCase().replace(/\s+/g, "_");
}

function formatDate(value) {
  if (!value) return "Onbekend";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatPeriodDate(value) {
  if (!value) return null;

  const asText = String(value).trim();
  const directDateMatch = asText.match(/^(\d{4}-\d{2}-\d{2})/);
  if (directDateMatch) {
    return directDateMatch[1];
  }

  const date = new Date(asText);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString().slice(0, 10);
}

function formatPeriod(startDate, endDate) {
  const start = formatPeriodDate(startDate);
  const end = formatPeriodDate(endDate);

  if (start && end) return `${start} - ${end}`;
  if (start) return `${start} -`;
  if (end) return `- ${end}`;
  return "Onbekend";
}

export default function DossiersOverview() {
  const { user, owner: authOwner, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [addresses, setAddresses] = useState([]);
  const [requests, setRequests] = useState([]);
  const [requestDocumentCounts, setRequestDocumentCounts] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const ownerName = useMemo(() => {
    if (!authOwner) return user?.name || "Gebruiker";
    return authOwner.displayName || authOwner.firstName || authOwner.name || user?.name || "Gebruiker";
  }, [authOwner, user?.name]);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (authLoading) return;

      if (!isSupabaseConfigured) {
        if (!isMounted) return;
        setError("Supabase is niet geconfigureerd.");
        setLoading(false);
        return;
      }

      if (!user?.id) {
        if (!isMounted) return;
        setError("Geen ingelogde gebruiker gevonden.");
        setLoading(false);
        return;
      }

      if (!authOwner?.id) {
        if (!isMounted) return;
        setError("Geen actief owner-profiel gevonden voor dit account.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const { data: addressData, error: addressError } = await supabase
          .from("addresses")
          .select("id, street, houseNumber, addition, postalCode, city, ownerId, reminderEnabled")
          .eq("ownerId", authOwner.id)
          .order("created_at", { ascending: false });

        if (addressError) {
          throw addressError;
        }

        const addressIds = (addressData || []).map((address) => address.id);
        let requestData = [];

        if (addressIds.length > 0) {
          const { data: fetchedRequests, error: requestError } = await supabase
            .from("requests")
            .select("id, created_at, status, reference, requestAmount, invoiceNumber, note, requestType, startDate, endDate, addressId, measure, reportCode, executionDate")
            .in("addressId", addressIds)
            .order("created_at", { ascending: false });

          if (requestError) {
            throw requestError;
          }

          requestData = fetchedRequests || [];
        }

        const requestIds = (requestData || []).map((request) => request.id);
        let documentCounts = {};

        if (requestIds.length > 0) {
          const { data: documentData, error: documentError } = await supabase
            .from("requestDocuments")
            .select("requestId")
            .in("requestId", requestIds);

          if (documentError) {
            throw documentError;
          }

          documentCounts = (documentData || []).reduce((accumulator, item) => {
            const key = item.requestId;
            accumulator[key] = (accumulator[key] || 0) + 1;
            return accumulator;
          }, {});
        }

        if (!isMounted) return;
        setAddresses(addressData || []);
        setRequests(requestData || []);
        setRequestDocumentCounts(documentCounts);
      } catch (loadError) {
        if (!isMounted) return;
        console.error("Dossiers laden mislukt:", loadError);
        setError("Uw dossiers konden niet worden geladen. Probeer het later opnieuw.");
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [authLoading, authOwner?.id, user?.id]);

  const summary = useMemo(() => {
    const openCount = requests.filter((request) => {
      const statusKey = getStatusKey(request.status);
      return !["completed", "afgerond"].includes(statusKey);
    }).length;

    return {
      total: requests.length,
      open: openCount,
      addresses: addresses.length,
    };
  }, [addresses.length, requestDocumentCounts, requests]);

  const addressById = useMemo(() => {
    return addresses.reduce((accumulator, address) => {
      accumulator[address.id] = address;
      return accumulator;
    }, {});
  }, [addresses]);

  const filteredRequests = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return requests;

    return requests.filter((request) => {
      const kenmerk = String(request.reference || `Dossier #${request.id}`).toLowerCase();
      const address = addressById[request.addressId];
      const addressText = [
        address?.street,
        address?.houseNumber,
        address?.addition,
        address?.postalCode,
        address?.city,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return kenmerk.includes(query) || addressText.includes(query);
    });
  }, [addressById, requests, searchTerm]);

  const formatAddress = (address) => {
    if (!address) return "Onbekend adres";
    const streetLine = [address.street, address.houseNumber, address.addition].filter(Boolean).join(" ");
    const cityLine = [address.postalCode, address.city].filter(Boolean).join(" ");
    return [streetLine, cityLine].filter(Boolean).join(", ") || `Adres #${address.id}`;
  };

  return (
    <main className="flex-grow p-4 sm:p-8 w-full overflow-y-auto relative bg-[linear-gradient(180deg,rgba(255,255,255,0.42)_0%,rgba(255,255,255,0.18)_100%)] backdrop-blur-sm">
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50/90 px-3 py-1 text-xs font-semibold text-secondary shadow-sm mb-3">
              Mijn Dossiers
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">
              Dossieroverzicht
            </h1>
            <p className="text-gray-600 mt-1 max-w-2xl">
              Alle dossiers gekoppeld aan {ownerName} worden hier verzameld in één overzicht.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-xl border border-blue-100 bg-white/80 px-4 py-2 text-sm font-semibold text-primary shadow-sm hover:bg-blue-50 transition"
          >
            Terug naar dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-blue-100/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(235,242,255,0.98)_100%)] p-5 shadow-[0_12px_40px_rgba(27,58,107,0.07)]">
            <p className="text-sm text-gray-500 font-medium">Totaal dossiers</p>
            <p className="mt-2 text-3xl font-bold text-primary">{summary.total}</p>
          </div>
          <div className="rounded-2xl border border-blue-100/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(235,242,255,0.98)_100%)] p-5 shadow-[0_12px_40px_rgba(27,58,107,0.07)]">
            <p className="text-sm text-gray-500 font-medium">Open dossiers</p>
            <p className="mt-2 text-3xl font-bold text-primary">{summary.open}</p>
          </div>
          <div className="rounded-2xl border border-blue-100/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(235,242,255,0.98)_100%)] p-5 shadow-[0_12px_40px_rgba(27,58,107,0.07)]">
            <p className="text-sm text-gray-500 font-medium">Adressen</p>
            <p className="mt-2 text-3xl font-bold text-primary">{summary.addresses}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-blue-100/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(235,242,255,0.98)_100%)] p-10 text-center shadow-[0_12px_40px_rgba(27,58,107,0.07)]">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-secondary" />
          <p className="text-primary font-semibold">Dossiers laden...</p>
          <p className="mt-1 text-sm text-gray-500">Even wachten terwijl uw overzicht wordt opgehaald.</p>
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-red-100 bg-red-50/80 p-8 text-center text-red-700 shadow-sm">
          <p className="font-semibold">Kon dossiers niet laden</p>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="rounded-3xl border border-blue-100/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(235,242,255,0.98)_100%)] p-10 shadow-[0_12px_40px_rgba(27,58,107,0.07)]">
          <div className="max-w-xl">
            <p className="text-lg font-bold text-primary">Nog geen dossiers gevonden</p>
            <p className="mt-2 text-gray-600">
              Zodra er adressen en dossiers aan deze owner zijn gekoppeld, verschijnen ze hier automatisch.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-blue-100/60 bg-white/75 p-4 shadow-[0_10px_30px_rgba(27,58,107,0.06)]">
            <label htmlFor="dossier-search" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Zoek op adres of kenmerk
            </label>
            <div className="relative">
              <i className="fa-solid fa-magnifying-glass pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="dossier-search"
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Bijv. Driftstraat, Nieuwsteeg of 811137661..."
                className="w-full rounded-xl border border-blue-100 bg-white px-10 py-2.5 text-sm text-primary outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              {filteredRequests.length} van {requests.length} dossiers zichtbaar
            </p>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="rounded-3xl border border-blue-100/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(235,242,255,0.98)_100%)] p-8 text-center shadow-[0_12px_40px_rgba(27,58,107,0.07)]">
              <p className="text-lg font-bold text-primary">Geen dossiers gevonden voor deze zoekopdracht</p>
              <p className="mt-2 text-sm text-gray-600">Probeer een ander adres of kenmerk.</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-blue-100/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(235,242,255,0.98)_100%)] shadow-[0_12px_40px_rgba(27,58,107,0.07)]">
              <div className="overflow-x-auto">
                <table className="min-w-[980px] w-full text-left">
                  <thead className="bg-white/70 border-b border-blue-100/70">
                    <tr className="text-xs uppercase tracking-wide text-gray-500">
                      <th className="px-6 py-4 font-semibold">Kenmerk</th>
                      <th className="px-4 py-4 font-semibold">Type</th>
                      <th className="px-4 py-4 font-semibold">Status</th>
                      <th className="px-4 py-4 font-semibold">Adres</th>
                      <th className="px-4 py-4 font-semibold">Periode</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-100/60">
                    {filteredRequests.map((request) => {
                      const requestMeta = requestTypeMeta[request.requestType] || requestTypeMeta[1];
                      const statusKey = getStatusKey(request.status);
                      const activeStatus = statusMeta[statusKey] || statusMeta.default;
                      const dossierLabel = request.reference || `Dossier #${request.id}`;
                      const periodLabel = formatPeriod(request.startDate, request.endDate);

                      return (
                        <tr
                          key={request.id}
                          className="bg-white/30 hover:bg-blue-50/50 transition cursor-pointer"
                          role="link"
                          tabIndex={0}
                          onClick={() => router.push(`/dashboard/dossiers/${request.id}`)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              router.push(`/dashboard/dossiers/${request.id}`);
                            }
                          }}
                        >
                          <td className="px-6 py-4 align-top">
                            <p className="text-sm font-bold text-primary">{dossierLabel}</p>
                            <p className="mt-1 text-xs text-gray-500">Aangemaakt op {formatDate(request.created_at)}</p>
                          </td>
                          <td className="px-4 py-4 align-top">
                            <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                              <i className={`fa-solid ${requestMeta.icon} ${requestMeta.accent}`} />
                              {requestMeta.label}
                            </span>
                          </td>
                          <td className="px-4 py-4 align-top">
                            <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${activeStatus.pill}`}>
                              {activeStatus.label}
                            </span>
                          </td>
                          <td className="px-4 py-4 align-top text-sm text-gray-700">
                            {formatAddress(addressById[request.addressId])}
                          </td>
                          <td className="px-4 py-4 align-top text-sm font-medium text-primary whitespace-nowrap">{periodLabel}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
