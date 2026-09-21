"use client";

/**
 * Dashboard Content Component
 * Main content area of the dashboard overview page — loads real data.
 */
import { useAuth } from "@/lib/auth";
import { formatEuro, parseAmount } from "@/lib/portal/currency";
import { fetchPortalNotifications } from "@/lib/portal/notifications";
import { getRequestTypeMeta, isCompletedStatus } from "@/lib/portal/requestMeta";
import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import CaseTimeline from "./CaseTimeline";
import DashboardOverviewCards from "./DashboardOverviewCards";
import NotificationsBell from "./NotificationsBell";
import NotificationsPanel from "./NotificationsPanel";

function formatAddress(address) {
  if (!address) return "Onbekend adres";
  const streetLine = [address.street, address.houseNumber, address.addition].filter(Boolean).join(" ");
  const cityLine = [address.postalCode, address.city].filter(Boolean).join(" ");
  return [streetLine, cityLine].filter(Boolean).join(", ") || "Onbekend adres";
}

function formatPeriodLabel(startDate, endDate) {
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  if (start && !Number.isNaN(start.getTime()) && end && !Number.isNaN(end.getTime())) {
    return `${start.getFullYear()} - ${end.getFullYear()}`;
  }

  if (start && !Number.isNaN(start.getTime())) return String(start.getFullYear());
  if (end && !Number.isNaN(end.getTime())) return String(end.getFullYear());
  return "Periode onbekend";
}

function buildTimelineSteps(request) {
  const status = (request.status || "").toLowerCase();
  const steps = [
    { type: "intake",     title: "Intake",                status: "completed" },
    { type: "documents",  title: "Documenten aangeleverd", status: "pending"   },
    { type: "review",     title: "Beoordeling Subzy",     status: "pending"   },
    { type: "submitted",  title: "Ingediend",              status: "pending"   },
    { type: "completed",  title: "Afgerond",               status: "pending"   },
  ];

  // Admin-status -> laatst voltooide klantstap. Meerdere interne statussen
  // kunnen op dezelfde klantvriendelijke stap uitkomen (bv. Bevestigd en
  // Ontvangen tonen allebei als "bijna klaar, Afgerond in behandeling") —
  // expliciete mapping i.p.v. positioneel raden, zodat een nieuwe interne
  // status (zoals "Controle") de tijdlijn niet stilletjes laat
  // verschuiven.
  const STATUS_STEP_INDEX = {
    concept: 0,
    controle: 1,
    ingediend: 2,
    bevestigd: 3,
    ontvangen: 3,
    afgerond: 4,
  };

  const idx = STATUS_STEP_INDEX[status] ?? 0;

  return steps.map((step, i) => ({
    ...step,
    status: i <= idx ? "completed" : i === idx + 1 ? "current" : "pending",
  }));
}

export default function DashboardContent() {
  const { user, owner } = useAuth();
  const [recentRequests, setRecentRequests] = useState([]);
  const [stats, setStats]                   = useState(null);
  const [notifications, setNotifications]    = useState([]);
  const [loading, setLoading]               = useState(true);

  useEffect(() => {
    if (!user?.id || !isSupabaseConfigured) { setLoading(false); return; }

    (async () => {
      try {
        // 1. Fetch requests via addresses linked to the owner
        const { data: addressRows } = await supabase
          .from("addresses")
          .select("id")
          .eq("ownerId", owner?.id);

        const addressIds = (addressRows || []).map((a) => a.id);

        let requestRows = [];
        if (addressIds.length > 0) {
          const { data } = await supabase
            .from("requests")
            .select("id, status, requestType, reference, requestAmount, created_at, startDate, endDate, addressId(street, houseNumber, addition)")
            .in("addressId", addressIds)
            .order("created_at", { ascending: false });
          requestRows = data || [];
        }

        const openRequests = requestRows.filter((r) => !isCompletedStatus(r.status));
        const completedRequests = requestRows.filter((r) => isCompletedStatus(r.status));

        const totalReclaimed = requestRows.reduce(
          (sum, r) => sum + (parseAmount(r.requestAmount) || 0),
          0,
        );

        // 2. Openstaande documentverzoeken -> "actie vereist"-notificaties
        const documentNotifications = await fetchPortalNotifications(owner?.id);

        setRecentRequests(openRequests.slice(0, 5));
        setStats({
          activeDossiers: openRequests.length,
          completedRequests: completedRequests.length,
          totalReclaimedLabel: formatEuro(totalReclaimed, { fallback: "€ 0,00" }),
          pendingDocuments: documentNotifications.length,
        });
        setNotifications(documentNotifications);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.id, owner?.id]);

  const ownerName = owner?.name || user?.name || "Gebruiker";

  return (
    <main className="flex-grow p-4 sm:p-8 w-full overflow-y-auto relative bg-[linear-gradient(180deg,rgba(255,255,255,0.42)_0%,rgba(255,255,255,0.18)_100%)] backdrop-blur-sm">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">
            Welkom terug, {ownerName}
          </h1>
          <p className="text-gray-600 mt-1 max-w-xl">
            Bekijk de status van uw lopende aanvragen en documenten.
          </p>
        </div>
        <NotificationsBell />
      </div>

      <div className="space-y-8">
        {/* Kerncijfers */}
        <DashboardOverviewCards stats={stats} loading={loading} />

        {/* Recente dossiers + notificaties */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-primary">Recente dossiers</h2>
              <Link
                href="/dashboard/dossiers"
                className="text-sm font-semibold text-secondary transition hover:text-accent"
              >
                Alle dossiers
              </Link>
            </div>

            {loading ? (
              <div className="rounded-2xl border border-blue-100/70 bg-white/90 py-12 text-center text-gray-400">
                <i className="fa-solid fa-spinner fa-spin text-3xl mb-3" />
                <p>Dossiers laden…</p>
              </div>
            ) : recentRequests.length === 0 ? (
              <div className="rounded-2xl border border-blue-100/70 bg-white/90 p-8 text-center text-gray-500">
                <i className="fa-solid fa-folder-open text-3xl mb-3 text-blue-200" />
                <p>Geen lopende dossiers.</p>
              </div>
            ) : (
              recentRequests.map((req) => {
                const address = req.addressId || {};
                const typeMeta = getRequestTypeMeta(req.requestType);
                const caseData = {
                  id:          req.id,
                  title:       formatAddress(address),
                  periodLabel: formatPeriodLabel(req.startDate, req.endDate),
                  caseNumber:  req.reference || `#${req.id}`,
                  status:      req.status,
                  requestType: req.requestType,
                  requestTypeMeta: typeMeta,
                  steps:       buildTimelineSteps(req),
                };
                return <CaseTimeline key={req.id} caseData={caseData} />;
              })
            )}
          </div>

          <div className="lg:col-span-1">
            <NotificationsPanel notifications={notifications} />
          </div>
        </div>
      </div>
    </main>
  );
}
