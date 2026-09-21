"use client";

import { useAuth } from "@/lib/auth";
import { formatEuro } from "@/lib/portal/currency";
import { getDocumentCategoriesForRequestType, getDocumentCategoryLabel } from "@/lib/portal/documentCategories";
import { getRequestTypeMeta, getStatusMeta } from "@/lib/portal/requestMeta";
import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Breadcrumb from "../../../components/Breadcrumb";
import ConfirmDialog from "../../../components/ConfirmDialog";
import NotificationsBell from "../../../components/NotificationsBell";

const UPLOAD_BUCKET = "request-documents";

function sanitizeFileName(name) {
  const trimmed = String(name || "document").trim();
  const lastDot = trimmed.lastIndexOf(".");
  const rawBase = lastDot > 0 ? trimmed.slice(0, lastDot) : trimmed;
  const rawExt = lastDot > 0 ? trimmed.slice(lastDot + 1) : "";
  // Sanitize base én extensie — de extensie belandt in de storage-key en
  // (via requestDocuments.name) in de Content-Disposition-header, dus daar
  // mogen geen "/", quotes of andere stuurtekens in blijven staan.
  const base = rawBase.replace(/[^a-zA-Z0-9-_]+/g, "_").slice(0, 120) || "document";
  const ext = rawExt.replace(/[^a-zA-Z0-9]+/g, "").slice(0, 12);
  return ext ? `${base}.${ext}` : base;
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

function normalizeCategory(value) {
  if (!value) return "overig";
  const normalized = String(value).toLowerCase().trim().replace(/\s+/g, "-");

  if (normalized.includes("energie")) return "energienota";
  if (normalized.includes("woz")) return "woz-aanslag";
  if (normalized.includes("aanvraag")) return "aanvraag";
  if (normalized.includes("bevest")) return "bevestiging";
  if (normalized.includes("factuur")) return "factuur";
  if (normalized.includes("offerte")) return "offerte";
  if (normalized.includes("betaling")) return "betalingsbewijs";
  if (normalized.includes("foto")) return "fotos";
  if (normalized.includes("volmacht")) return "overig";
  if (normalized.includes("overig")) return "overig";

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

export default function DossierDetail() {
  const { owner: authOwner, isLoading: authLoading } = useAuth();
  const params = useParams();
  const requestId = params?.requestId;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [request, setRequest] = useState(null);
  const [address, setAddress] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [documentRequests, setDocumentRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("algemeen");
  const [busyActionDocumentId, setBusyActionDocumentId] = useState(null);
  const [uploadingCategory, setUploadingCategory] = useState(null);
  const [dragOverCategory, setDragOverCategory] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleteError, setDeleteError] = useState("");

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

  // Herlaadt alleen documenten + documentverzoeken (na upload/verwijderen),
  // zonder de rest van het dossier opnieuw op te halen.
  const refreshDocuments = async (numericRequestId) => {
    const [{ data: documentData, error: docsError }, { data: requestReqData, error: reqError }] =
      await Promise.all([
        supabase
          .from("requestDocuments")
          .select("id, name, category, created_at, storagePath, sizeBytes, mimeType, created_by")
          .eq("requestId", numericRequestId)
          .order("created_at", { ascending: false }),
        supabase
          .from("request_document_requests")
          .select("id, category, requested_at, fulfilled_at, cancelled_at")
          .eq("request_id", numericRequestId)
          .is("fulfilled_at", null)
          .is("cancelled_at", null),
      ]);

    if (docsError) throw docsError;
    if (reqError) throw reqError;

    setDocuments(documentData || []);
    setDocumentRequests(requestReqData || []);
  };

  const handleUploadDocument = async (categoryConfig, file) => {
    if (!file || !request?.id) return;
    setUploadError("");
    setUploadingCategory(categoryConfig.id);

    let insertedId = null;
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("U bent niet ingelogd.");

      const safeName = sanitizeFileName(file.name);

      const { data: docRecord, error: insertError } = await supabase
        .from("requestDocuments")
        .insert({
          requestId: request.id,
          name: safeName,
          category: categoryConfig.id,
          storagePath: null,
          mimeType: file.type || "application/octet-stream",
          sizeBytes: file.size,
          created_by: user.id,
        })
        .select()
        .single();

      if (insertError) throw insertError;
      insertedId = docRecord.id;

      const storagePath = `${request.id}/${docRecord.id}_${safeName}`;
      const { error: uploadStorageError } = await supabase.storage
        .from(UPLOAD_BUCKET)
        .upload(storagePath, file, {
          contentType: file.type || "application/octet-stream",
          upsert: true,
        });

      if (uploadStorageError) throw uploadStorageError;

      const { error: updateError } = await supabase
        .from("requestDocuments")
        .update({ storagePath })
        .eq("id", docRecord.id);

      if (updateError) throw updateError;

      await refreshDocuments(request.id);
    } catch (err) {
      if (insertedId) {
        await supabase.from("requestDocuments").delete().eq("id", insertedId);
      }
      setUploadError(err.message || "Upload mislukt. Probeer het opnieuw.");
    } finally {
      setUploadingCategory(null);
      setDragOverCategory(null);
    }
  };

  const requestDeleteDocument = (doc) => {
    setDeleteError("");
    setPendingDelete(doc);
  };

  const confirmDeleteDocument = async () => {
    const doc = pendingDelete;
    if (!doc) return;

    setDeleteError("");
    setBusyActionDocumentId(doc.id);
    try {
      const { data, error } = await supabase.rpc("soft_delete_request_document", {
        p_document_id: doc.id,
      });

      if (error) throw error;
      if (!data?.ok) throw new Error(data?.reason || "Verwijderen is niet toegestaan.");

      await refreshDocuments(request.id);
      setPendingDelete(null);
    } catch (err) {
      setDeleteError(err.message || "Verwijderen mislukt. Probeer het opnieuw.");
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

        if (!isMounted) return;
        setRequest(requestData);
        setAddress(addressData || null);
        await refreshDocuments(requestData.id);
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

  // Welke categorieën getoond worden hangt af van het type aanvraag
  // (Energiebelasting vs. SVOH/ISDE) — zie lib/portal/documentCategories.js.
  const documentCategories = useMemo(
    () => getDocumentCategoriesForRequestType(request?.requestType),
    [request?.requestType]
  );

  return (
    <main className="flex-grow p-4 sm:p-8 w-full overflow-y-auto relative bg-[linear-gradient(180deg,rgba(255,255,255,0.42)_0%,rgba(255,255,255,0.18)_100%)] backdrop-blur-sm">
      <div className="mb-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <Breadcrumb
            pages={[
              { name: "Mijn Dossiers", href: "/dashboard/dossiers" },
              { name: addressTitle },
            ]}
          />
          <NotificationsBell />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">{addressTitle}</h1>
        <p className="mt-1 text-sm font-semibold text-gray-500">{kenmerk}</p>
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
                <i className="fa-solid fa-clipboard-list mr-2" /> Algemeen
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

          {documentRequests.length > 0 && (
            <div className="rounded-2xl border border-orange-200 bg-orange-50/90 p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                  <i className="fa-solid fa-triangle-exclamation" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-orange-900">
                    Actie vereist: lever nog {documentRequests.length === 1 ? "dit document" : "deze documenten"} aan
                  </p>
                  <p className="mt-1 text-sm text-orange-800">
                    {documentRequests
                      .map((docRequest) => getDocumentCategoryLabel(docRequest.category))
                      .join(", ")}
                  </p>
                  {activeTab !== "bestanden" && (
                    <button
                      type="button"
                      onClick={() => setActiveTab("bestanden")}
                      className="mt-3 inline-flex items-center gap-2 rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-orange-600"
                    >
                      <i className="fa-solid fa-file-arrow-up" /> Naar Bestanden
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

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
                    <dd className="mt-1 font-semibold text-primary">{getRequestTypeMeta(request.requestType).label}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Status</dt>
                    <dd className="mt-1">
                      <span className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${getStatusMeta(request.status).pill}`}>
                        {getStatusMeta(request.status).label}
                      </span>
                    </dd>
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

              {uploadError && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {uploadError}
                </div>
              )}

              <div className="mt-6 space-y-6">
                {documentCategories.map((category) => {
                  const categoryDocs = documentsByCategory[category.id] || [];
                  const isReadOnly = Boolean(category.readOnly);
                  const isUploading = uploadingCategory === category.id;
                  const isDragOver = dragOverCategory === category.id;
                  const openRequest = documentRequests.find(
                    (docRequest) => docRequest.category === category.id
                  );
                  const inputId = `upload-${category.id}`;

                  return (
                    <div
                      key={category.id}
                      className={`rounded-xl border p-4 transition ${
                        openRequest
                          ? "border-orange-200 bg-orange-50/40"
                          : "border-blue-100/70 bg-white/75"
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-sm font-semibold text-primary">{category.label}</h3>
                        {openRequest && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-2.5 py-1 text-xs font-semibold text-orange-700">
                            <i className="fa-solid fa-circle-exclamation" />
                            Gevraagd op {formatDate(openRequest.requested_at)}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-gray-500">{category.description}</p>

                      {!isReadOnly ? (
                        <label
                          htmlFor={inputId}
                          onDragOver={(event) => {
                            event.preventDefault();
                            setDragOverCategory(category.id);
                          }}
                          onDragLeave={() => setDragOverCategory(null)}
                          onDrop={(event) => {
                            event.preventDefault();
                            const file = event.dataTransfer.files?.[0];
                            if (file) handleUploadDocument(category, file);
                          }}
                          className={`mt-3 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed p-4 text-center text-sm transition ${
                            isDragOver
                              ? "border-secondary bg-blue-50"
                              : "border-blue-200 bg-blue-50/30 hover:bg-blue-50/60"
                          } ${isUploading ? "pointer-events-none opacity-60" : ""}`}
                        >
                          {isUploading ? (
                            <span className="flex items-center gap-2 text-secondary">
                              <i className="fa-solid fa-spinner fa-spin" /> Uploaden...
                            </span>
                          ) : (
                            <span className="text-gray-400">
                              <i className="fa-solid fa-cloud-arrow-up mr-2 text-secondary" />
                              Klik of sleep om te uploaden
                            </span>
                          )}
                          <input
                            id={inputId}
                            type="file"
                            className="hidden"
                            disabled={isUploading}
                            onChange={(event) => {
                              const file = event.target.files?.[0];
                              if (file) handleUploadDocument(category, file);
                              event.target.value = "";
                            }}
                          />
                        </label>
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
                                {!isReadOnly && (
                                  <button
                                    type="button"
                                    onClick={() => requestDeleteDocument(doc)}
                                    disabled={busyActionDocumentId === doc.id}
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-red-200 text-red-500 hover:bg-red-50"
                                    title="Verwijderen"
                                  >
                                    {busyActionDocumentId === doc.id ? (
                                      <i className="fa-solid fa-spinner fa-spin text-xs" />
                                    ) : (
                                      <i className="fa-solid fa-trash text-xs" />
                                    )}
                                  </button>
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

      <ConfirmDialog
        open={!!pendingDelete}
        title="Document verwijderen"
        description={
          <>
            Weet u zeker dat u{" "}
            <span className="font-semibold text-primary">
              {pendingDelete?.name || "dit document"}
            </span>{" "}
            wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.
          </>
        }
        confirmLabel="Verwijderen"
        busy={!!pendingDelete && busyActionDocumentId === pendingDelete.id}
        error={deleteError}
        onConfirm={confirmDeleteDocument}
        onClose={() => {
          setPendingDelete(null);
          setDeleteError("");
        }}
      />
    </main>
  );
}
