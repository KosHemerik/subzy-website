import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import { getDocumentCategoryLabel } from "./documentCategories";

function timeAgoLabel(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const minutes = Math.floor((Date.now() - date.getTime()) / (60 * 1000));
  if (minutes < 1) return "Zojuist";
  if (minutes < 60) return `${minutes} min geleden`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} uur geleden`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Gisteren";
  if (days < 7) return `${days} dagen geleden`;
  return new Intl.DateTimeFormat("nl-NL", { day: "numeric", month: "short" }).format(date);
}

/**
 * Haalt de actuele klantportaal-meldingen op voor een owner.
 * Momenteel: "actie vereist"-meldingen voor documenten die Subzy heeft
 * opgevraagd en die nog niet zijn aangeleverd of geannuleerd.
 * Geeft altijd een array terug (leeg bij geen meldingen of geen configuratie).
 */
export async function fetchPortalNotifications(ownerId) {
  if (!ownerId || !isSupabaseConfigured) return [];

  const { data: addressRows } = await supabase
    .from("addresses")
    .select("id")
    .eq("ownerId", ownerId);

  const addressIds = (addressRows || []).map((a) => a.id);
  if (addressIds.length === 0) return [];

  const { data: requestIdRows } = await supabase
    .from("requests")
    .select("id")
    .in("addressId", addressIds);

  const requestIds = (requestIdRows || []).map((r) => r.id);
  if (requestIds.length === 0) return [];

  const { data: docRequestRows } = await supabase
    .from("request_document_requests")
    .select("id, request_id, category, requested_at")
    .in("request_id", requestIds)
    .is("fulfilled_at", null)
    .is("cancelled_at", null)
    .order("requested_at", { ascending: false });

  return (docRequestRows || []).map((docRequest) => ({
    id: `doc-request-${docRequest.id}`,
    type: "action",
    title: `Actie vereist: ${getDocumentCategoryLabel(docRequest.category)}`,
    description: `Upload uw ${getDocumentCategoryLabel(docRequest.category).toLowerCase()} voor dossier #${docRequest.request_id}.`,
    time: timeAgoLabel(docRequest.requested_at),
    highlight: true,
    href: `/dashboard/dossiers/${docRequest.request_id}`,
  }));
}
