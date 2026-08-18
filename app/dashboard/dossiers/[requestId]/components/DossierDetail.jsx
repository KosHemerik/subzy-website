"use client";

import { useAuth } from "@/lib/auth";
import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const DOCUMENT_CATEGORIES = [
  {
    key: "energienota",
    label: "Energienota",
    description: "De jaarafrekening van uw energieleverancier.",
  },
  {
    key: "woz_aanslag",
    label: "WOZ-aanslag",
    description: "De WOZ-aanslag van uw gemeente.",
  },
  {
    key: "aanvraag",
    label: "Aanvraag",
    description: "Het ingediende aanvraagdocument voor dit dossier.",
  },
  {
    key: "bevestiging",
    label: "Bevestiging",
    description: "De bevestiging van een ingediende aanvraag.",
  },
  {
    key: "overige_documenten",
    label: "Overige documenten",
    description: "Aanvullende documenten die niet in een vaste categorie vallen.",
  },
];

const READ_ONLY_CATEGORIES = new Set(["aanvraag", "bevestiging"]);

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

function parseAmount(value) {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;

  let text = String(value).trim();
  if (!text) return null;

  text = text.replace(/\s/g, "").replace(/[^\d.,-]/g, "");
  if (!text) return null;

  const hasComma = text.includes(",");
  const hasDot = text.includes(".");

  if (hasComma && hasDot) {
    const lastComma = text.lastIndexOf(",");
    const lastDot = text.lastIndexOf(".");
    if (lastComma > lastDot) {
      text = text.replace(/\./g, "").replace(",", ".");
    } else {
      text = text.replace(/,/g, "");
    }
  } else if (hasComma) {
    text = text.replace(/\./g, "").replace(",", ".");
  }

  const parsed = Number(text);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatEuro(value) {
  const parsed = parseAmount(value);
  if (parsed === null) return "-";
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(parsed);
}

function normalizeCategory(value) {
  if (!value) return "overige_documenten";
  const normalized = String(value).toLowerCase().trim().replace(/\s+/g, "_");

  if (normalized.includes("energie")) return "energienota";
  if (normalized.includes("woz")) return "woz_aanslag";
  if (normalized.includes("aanvraag")) return "aanvraag";
  if (normalized.includes("bevest")) return "bevestiging";
  if (normalized.includes("volmacht")) return "overige_documenten";
  if (normalized.includes("overig")) return "overige_documenten";

  return normalized;
}

function formatFileSize(sizeBytes) {
  if (typeof sizeBytes !== "number" || Number.isNaN(sizeBytes) || sizeBytes < 0) {
    return null;
  }

  if (sizeBytes < 1024) return `${sizeBytes} B`;

  const units = ["KB", "MB", "GB"];
  let size = sizeBytes / 1024;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  return `${new Intl.NumberFormat("nl-NL", {
    maximumFractionDigits: 1,
  }).format(size)} ${units[unitIndex]}`;
}

function getFileIconClass(name, mimeType) {
  const lowerName = String(name || "").toLowerCase();
  const lowerMime = String(mimeType || "").toLowerCase();

  if (lowerMime.includes("pdf") || lowerName.endsWith(".pdf")) return "fa-file-pdf";
  if (lowerMime.includes("image/") || /(\.png|\.jpe?g|\.webp|\.gif|\.svg)$/.test(lowerName)) return "fa-file-image";
  if (lowerName.endsWith(".doc") || lowerName.endsWith(".docx")) return "fa-file-word";
  if (lowerName.endsWith(".xls") || lowerName.endsWith(".xlsx")) return "fa-file-excel";

  return "fa-file-lines";
}

function canPreviewFile(name, mimeType) {
  const lowerName = String(name || "").toLowerCase();
  const lowerMime = String(mimeType || "").toLowerCase();
  if (lowerMime.includes("pdf") || lowerMime.includes("image/")) return true;
  return /(\.pdf|\.png|\.jpe?g|\.webp|\.gif|\.svg)$/.test(lowerName);
}

async function getAccessToken({ forceRefresh = false } = {}) {
  if (forceRefresh) {
    await supabase.auth.refreshSession();
  }

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session?.access_token) {
    throw new Error("U bent niet ingelogd. Log opnieuw in en probeer het nogmaals.");
  }

  return session.access_token;
}

async function requestPortalDocument(documentId, disposition, accessToken) {
  const endpoint = `/api/portal/documents/${documentId}/download?disposition=${disposition}`;

  return fetch(endpoint, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

async function fetchPortalDocument(documentId, disposition) {
  let accessToken = await getAccessToken();
  let response = await requestPortalDocument(documentId, disposition, accessToken);

  if (response.status === 401) {
    accessToken = await getAccessToken({ forceRefresh: true });
    response = await requestPortalDocument(documentId, disposition, accessToken);
  }

  if (!response.ok) {
    let message = "Bestand kon niet worden opgehaald.";
    let details = null;

    try {
      const payload = await response.json();
      if (payload?.error) {
        message = payload.error;
      }
      if (payload?.details) {
        details = payload.details;
      }
    } catch {
      // Keep default message when non-JSON response is returned.
    }

    if (response.status === 401) {
      message = "Uw sessie is verlopen. Log opnieuw in en probeer het nogmaals.";
    }

    const error = new Error(message);
    if (details) {
      error.details = details;
    }
    throw error;
  }

  return response.blob();
}

function getOwnerTypeLabel(requestType) {
  if (requestType === 1) return "Energiebelasting";
  if (requestType === 2) return "Subsidie";
  if (requestType === 3) return "SVOH";
  return "Onbekend";
}

export default function DossierDetail() {
  const { owner: authOwner, isLoading: authLoading } = useAuth();
  const params = useParams();
  const requestId = params?.requestId;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [request, setRequest] = useState(null);
  const [address, setAddress] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [activeTab, setActiveTab] = useState("algemeen");
  const [busyActionDocumentId, setBusyActionDocumentId] = useState(null);

  const handlePreviewDocument = async (doc) => {
    try {
      setBusyActionDocumentId(doc.id);
      const blob = await fetchPortalDocument(doc.id, "inline");
      const href = URL.createObjectURL(blob);
      window.open(href, "_blank", "noopener,noreferrer");

      if (href && href.startsWith("blob:")) {
        window.setTimeout(() => URL.revokeObjectURL(href), 60 * 1000);
      }
    } catch (previewError) {
      window.alert(
        previewError?.details
          ? `${previewError.message}\n${typeof previewError.details === "string" ? previewError.details : JSON.stringify(previewError.details, null, 2)}`
          : previewError.message || "Voorvertoning openen mislukt."
      );
    } finally {
      setBusyActionDocumentId(null);
    }
  };

  const handleDownloadDocument = async (doc) => {
    try {
      setBusyActionDocumentId(doc.id);
      const blob = await fetchPortalDocument(doc.id, "attachment");
      const href = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = href;
      link.download = doc.name || "document";
      document.body.appendChild(link);
      link.click();
      link.remove();

      if (href && href.startsWith("blob:")) {
        window.setTimeout(() => URL.revokeObjectURL(href), 60 * 1000);
      }
    } catch (downloadError) {
      window.alert(
        downloadError?.details
          ? `${downloadError.message}\n${typeof downloadError.details === "string" ? downloadError.details : JSON.stringify(downloadError.details, null, 2)}`
          : downloadError.message || "Downloaden mislukt."
      );
    } finally {
      setBusyActionDocumentId(null);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadDetail = async () => {
      if (authLoading) return;

      if (!isSupabaseConfigured) {
        if (!isMounted) return;
        setError("Supabase is niet geconfigureerd.");
        setLoading(false);
        return;
      }

      if (!authOwner?.id || !requestId) {
        if (!isMounted) return;
        setError("Dossier kon niet worden gevonden.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const { data: ownerAddresses, error: addressListError } = await supabase
          .from("addresses")
          .select("id")
          .eq("ownerId", authOwner.id);

        if (addressListError) throw addressListError;

        const ownerAddressIds = (ownerAddresses || []).map((item) => item.id);

        if (ownerAddressIds.length === 0) {
          throw new Error("Geen adressen gevonden voor deze owner.");
        }

        const numericRequestId = Number(requestId);
        const { data: requestData, error: requestError } = await supabase
          .from("requests")
          .select("id, created_at, status, reference, requestAmount, invoiceNumber, note, requestType, startDate, endDate, addressId, measure, reportCode, executionDate")
          .eq("id", numericRequestId)
          .in("addressId", ownerAddressIds)
          .maybeSingle();

        if (requestError) throw requestError;
        if (!requestData) throw new Error("Dit dossier hoort niet bij uw account of bestaat niet.");

        const { data: addressData, error: addressError } = await supabase
          .from("addresses")
          .select("street, houseNumber, addition, postalCode, city")
          .eq("id", requestData.addressId)
          .maybeSingle();

        if (addressError) throw addressError;

        const { data: documentData, error: docsError } = await supabase
          .from("requestDocuments")
          .select("id, name, category, created_at, storagePath, sizeBytes, mimeType")
          .eq("requestId", requestData.id)
          .order("created_at", { ascending: false });

        if (docsError) throw docsError;

        if (!isMounted) return;
        setRequest(requestData);
        setAddress(addressData || null);
        setDocuments(documentData || []);
      } catch (loadError) {
        if (!isMounted) return;
        setError(loadError.message || "Dossierdetails konden niet worden geladen.");
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    };

    loadDetail();

    return () => {
      isMounted = false;
    };
  }, [authLoading, authOwner?.id, requestId]);

  const addressLine = useMemo(() => {
    if (!address) return "Onbekend adres";
    const streetLine = [address.street, address.houseNumber, address.addition].filter(Boolean).join(" ");
    const cityLine = [address.postalCode, address.city].filter(Boolean).join(" ");
    return [streetLine, cityLine].filter(Boolean).join(", ") || "Onbekend adres";
  }, [address]);

  const addressTitle = useMemo(() => {
    const title = [address?.street, address?.houseNumber, address?.addition].filter(Boolean).join(" ");
    return title || "Dossierdetails";
  }, [address]);

  const kenmerk = request?.reference || (request ? `Dossier #${request.id}` : "-");

  const documentsByCategory = useMemo(() => {
    return documents.reduce((acc, doc) => {
      const key = normalizeCategory(doc.category);
      if (!acc[key]) acc[key] = [];
      acc[key].push(doc);
      return acc;
    }, {});
  }, [documents]);

  return (
    <main className="flex-grow p-4 sm:p-8 w-full overflow-y-auto relative bg-[linear-gradient(180deg,rgba(255,255,255,0.42)_0%,rgba(255,255,255,0.18)_100%)] backdrop-blur-sm">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50/90 px-3 py-1 text-xs font-semibold text-secondary shadow-sm mb-3">
            Dossierdetails
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">{addressTitle}</h1>
          <p className="mt-1 text-sm font-semibold text-gray-500">{kenmerk}</p>
        </div>
        <Link
          href="/dashboard/dossiers"
          className="inline-flex items-center justify-center rounded-xl border border-blue-100 bg-white/80 px-4 py-2 text-sm font-semibold text-primary shadow-sm hover:bg-blue-50 transition"
        >
          Terug naar dossiers
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-14 text-gray-500">
          <i className="fa-solid fa-spinner fa-spin text-3xl mb-3" />
          <p>Dossierdetails laden...</p>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-100 bg-red-50/80 p-6 text-red-700">
          <p className="font-semibold">Kon dossier niet openen</p>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="rounded-2xl border border-blue-100/70 bg-white/80 p-2 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("algemeen")}
                className={`inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  activeTab === "algemeen"
                    ? "bg-blue-50 text-secondary shadow-sm"
                    : "text-gray-500 hover:bg-blue-50/70 hover:text-secondary"
                }`}
              >
                <i className="fa-regular fa-circle-info mr-2" /> Algemeen
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("bestanden")}
                className={`inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  activeTab === "bestanden"
                    ? "bg-blue-50 text-secondary shadow-sm"
                    : "text-gray-500 hover:bg-blue-50/70 hover:text-secondary"
                }`}
              >
                <i className="fa-regular fa-folder-open mr-2" /> Bestanden
              </button>
            </div>
          </div>

          {activeTab === "algemeen" ? (
            <div>
              <section className="rounded-2xl border border-blue-100/60 bg-white/85 p-6 shadow-sm">
                <h2 className="text-base font-bold text-primary mb-4">Dossierinformatie</h2>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-gray-500">Kenmerk</dt>
                    <dd className="mt-1 font-semibold text-primary">{kenmerk}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Type</dt>
                    <dd className="mt-1 font-semibold text-primary">{getOwnerTypeLabel(request.requestType)}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Status</dt>
                    <dd className="mt-1 font-semibold text-primary">{request.status || "Open"}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Aangemaakt op</dt>
                    <dd className="mt-1 font-semibold text-primary">{formatDate(request.created_at)}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Periode</dt>
                    <dd className="mt-1 font-semibold text-primary">{formatPeriod(request.startDate, request.endDate)}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Adres</dt>
                    <dd className="mt-1 font-semibold text-primary">{addressLine}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Bedrag</dt>
                    <dd className="mt-1 font-semibold text-primary">{formatEuro(request.requestAmount)}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Factuur</dt>
                    <dd className="mt-1 font-semibold text-primary">{request.invoiceNumber || "-"}</dd>
                  </div>
                </dl>

                <div className="mt-6">
                  <h3 className="text-sm font-bold text-primary">Notitie</h3>
                  <p className="mt-2 rounded-xl border border-blue-100 bg-blue-50/40 p-3 text-sm text-gray-700">
                    {request.note || "Geen aanvullende notitie beschikbaar."}
                  </p>
                </div>
              </section>
            </div>
          ) : (
            <section className="rounded-2xl border border-blue-100/60 bg-white/85 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-primary">Documenten en Bestanden</h2>
              <p className="mt-1 text-sm text-gray-500">Upload of download uw dossierdocumenten per categorie.</p>

              <div className="mt-6 space-y-6">
                {DOCUMENT_CATEGORIES.map((category) => {
                  const categoryDocs = documentsByCategory[category.key] || [];
                  const isReadOnly = READ_ONLY_CATEGORIES.has(category.key);

                  return (
                    <div key={category.key} className="rounded-xl border border-blue-100/70 bg-white/75 p-4">
                      <h3 className="text-sm font-semibold text-primary">{category.label}</h3>
                      <p className="mt-1 text-xs text-gray-500">{category.description}</p>

                      {!isReadOnly ? (
                        <div className="mt-3 rounded-xl border border-dashed border-blue-200 bg-blue-50/30 p-4 text-center text-sm text-gray-400">
                          Klik of sleep om te uploaden
                        </div>
                      ) : categoryDocs.length === 0 ? (
                        <p className="mt-3 text-xs text-gray-500">
                          Deze documenten worden door Subzy toegevoegd en zijn alleen te downloaden.
                        </p>
                      ) : null}

                      {categoryDocs.length > 0 ? (
                        <ul className="mt-3 space-y-2">
                          {categoryDocs.map((doc) => (
                            <li key={doc.id} className="flex items-center justify-between gap-3 rounded-lg border border-blue-100 bg-white px-3 py-2">
                              <div className="min-w-0 flex items-start gap-2">
                                <i className={`fa-regular ${getFileIconClass(doc.name, doc.mimeType)} mt-0.5 text-gray-400`} />
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-primary truncate">{doc.name || "Naamloos document"}</p>
                                  <p className="text-xs text-gray-500 mt-0.5">
                                    Toegevoegd op {formatDate(doc.created_at)}
                                    {formatFileSize(doc.sizeBytes) ? ` · ${formatFileSize(doc.sizeBytes)}` : ""}
                                  </p>
                                </div>
                              </div>
                              <div className="shrink-0 flex items-center gap-2">
                                {doc.storagePath && canPreviewFile(doc.name, doc.mimeType) ? (
                                  <button
                                    type="button"
                                    onClick={() => handlePreviewDocument(doc)}
                                    disabled={busyActionDocumentId === doc.id}
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-blue-200 text-secondary hover:bg-blue-50"
                                    title="Bekijken"
                                  >
                                    <i className="fa-regular fa-eye text-xs" />
                                  </button>
                                ) : (
                                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-300" title="Voorvertoning niet beschikbaar">
                                    <i className="fa-regular fa-eye text-xs" />
                                  </span>
                                )}
                                {doc.storagePath ? (
                                  <button
                                    type="button"
                                    onClick={() => handleDownloadDocument(doc)}
                                    disabled={busyActionDocumentId === doc.id}
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-blue-200 text-secondary hover:bg-blue-50"
                                    title="Download"
                                  >
                                    <i className="fa-solid fa-download text-xs" />
                                  </button>
                                ) : (
                                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-300" title="Downloadpad ontbreekt">
                                    <i className="fa-solid fa-download text-xs" />
                                  </span>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      )}
    </main>
  );
}
