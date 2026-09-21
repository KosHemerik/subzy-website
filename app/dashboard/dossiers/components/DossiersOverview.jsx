"use client";

import { useAuth } from "@/lib/auth";
import {
  getRequestTypeMeta,
  getStatusKey,
  getStatusMeta,
  isCompletedStatus,
  STATUS_ORDER,
} from "@/lib/portal/requestMeta";
import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import NotificationsBell from "../../components/NotificationsBell";

const SORT_COLUMNS = [
  { key: "kenmerk", label: "Kenmerk" },
  { key: "type", label: "Type" },
  { key: "status", label: "Status" },
  { key: "adres", label: "Adres" },
];

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

export default function DossiersOverview() {
  const { user, owner: authOwner, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [addresses, setAddresses] = useState([]);
  const [requests, setRequests] = useState([]);
  const [requestDocumentCounts, setRequestDocumentCounts] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState({ key: "created_at", dir: "desc" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleSort = (key) => {
    setSort((current) =>
      current.key === key
        ? { key, dir: current.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" },
    );
  };

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
    const openCount = requests.filter(
      (request) => !isCompletedStatus(request.status),
    ).length;

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

  const sortedRequests = useMemo(() => {
    const sortValue = (request) => {
      switch (sort.key) {
        case "kenmerk":
          return String(request.reference || `Dossier #${request.id}`).toLowerCase();
        case "type":
          return Number(request.requestType) || 0;
        case "status": {
          const index = STATUS_ORDER.indexOf(getStatusKey(request.status));
          return index === -1 ? STATUS_ORDER.length : index;
        }
        case "adres":
          return formatAddress(addressById[request.addressId]).toLowerCase();
        default:
          return new Date(request.created_at).getTime() || 0;
      }
    };

    const rows = [...filteredRequests];
    rows.sort((a, b) => {
      const va = sortValue(a);
      const vb = sortValue(b);
      let cmp =
        typeof va === "number" && typeof vb === "number"
          ? va - vb
          : String(va).localeCompare(String(vb), "nl");
      // Gelijk? Dan altijd nieuwste dossier eerst als stabiele tiebreaker.
      if (cmp === 0) {
        return (new Date(b.created_at).getTime() || 0) - (new Date(a.created_at).getTime() || 0);
      }
      return sort.dir === "asc" ? cmp : -cmp;
    });
    return rows;
  }, [filteredRequests, sort, addressById]);

  return (
    <main className="flex-grow p-4 sm:p-8 w-full overflow-y-auto relative bg-[linear-gradient(180deg,rgba(255,255,255,0.42)_0%,rgba(255,255,255,0.18)_100%)] backdrop-blur-sm">
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">
              Dossieroverzicht
            </h1>
            <p className="text-gray-600 mt-1 max-w-2xl">
              Alle dossiers gekoppeld aan {ownerName} worden hier verzameld in één overzicht.
            </p>
          </div>
          <NotificationsBell />
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
        <div className="overflow-hidden rounded-3xl border border-blue-100/60 bg-white shadow-[0_12px_40px_rgba(27,58,107,0.07)]">
          <div className="flex flex-col gap-3 border-b border-blue-100/60 bg-slate-50 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-primary">{filteredRequests.length}</span> van{" "}
              {requests.length} {requests.length === 1 ? "dossier" : "dossiers"}
            </p>
            <div className="relative w-full sm:w-72">
              <i className="fa-solid fa-magnifying-glass pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400" />
              <input
                id="dossier-search"
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Zoek op adres of kenmerk…"
                aria-label="Zoek op adres of kenmerk"
                className="w-full rounded-xl border border-blue-100 bg-white px-9 py-2 text-sm text-primary outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
              />
            </div>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <p className="text-sm font-semibold text-primary">
                Geen dossiers gevonden voor “{searchTerm}”.
              </p>
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="mt-2 text-sm font-medium text-secondary transition hover:text-accent"
              >
                Zoekopdracht wissen
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white">
                <table className="min-w-[640px] w-full text-left">
                  <thead className="bg-slate-50 border-b border-blue-100">
                    <tr className="text-xs text-gray-500">
                      {SORT_COLUMNS.map((column, index) => {
                        const active = sort.key === column.key;
                        return (
                          <th
                            key={column.key}
                            aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}
                            className={`${index === 0 ? "px-6" : "px-4"} py-3.5 font-semibold`}
                          >
                            <button
                              type="button"
                              onClick={() => handleSort(column.key)}
                              className="inline-flex items-center gap-1.5 rounded-sm px-0.5 uppercase tracking-wide outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-secondary/50"
                            >
                              {column.label}
                              <i
                                aria-hidden="true"
                                className={`fa-solid w-2.5 text-center text-[10px] ${
                                  active
                                    ? sort.dir === "asc"
                                      ? "fa-sort-up text-secondary"
                                      : "fa-sort-down text-secondary"
                                    : "fa-sort text-gray-300"
                                }`}
                              />
                            </button>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-b-0">
                    {sortedRequests.map((request) => {
                      const requestMeta = getRequestTypeMeta(request.requestType);
                      const activeStatus = getStatusMeta(request.status);
                      const dossierLabel = request.reference || `Dossier #${request.id}`;

                      return (
                        <tr
                          key={request.id}
                          className="border-b border-blue-100/70 bg-white hover:bg-blue-50/60 transition-colors cursor-pointer"
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
                            <span className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${activeStatus.pill}`}>
                              {activeStatus.label}
                            </span>
                          </td>
                          <td className="px-4 py-4 align-top text-sm text-gray-700">
                            {formatAddress(addressById[request.addressId])}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
