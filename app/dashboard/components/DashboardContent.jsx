"use client";

/**
 * Dashboard Content Component
 * Main content area of the dashboard overview page — loads real data.
 */
import { useAuth } from "@/lib/auth";
import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import CaseTimeline from "./CaseTimeline";
import DashboardOverviewCards from "./DashboardOverviewCards";
import NotificationsPanel from "./NotificationsPanel";

const REQUEST_TYPE_LABEL = {
  1: "Energiebelasting",
  2: "SVOH",
  3: "ISDE",
};

const requestTypeMeta = {
  1: { label: "Energiebelasting", icon: "fa-bolt", accent: "text-secondary", badge: "bg-blue-100 text-secondary border-blue-200" },
  2: { label: "Subsidie", icon: "fa-solar-panel", accent: "text-orange-500", badge: "bg-orange-100 text-orange-700 border-orange-200" },
  3: { label: "SVOH", icon: "fa-building-columns", accent: "text-green-500", badge: "bg-green-100 text-green-700 border-green-200" },
};

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

  const order = ["concept", "ingediend", "bevestigd", "ontvangen", "afgerond"];
  const idx   = order.findIndex((s) => status.includes(s));

  return steps.map((step, i) => ({
    ...step,
    status: i <= Math.max(idx, 0) ? "completed" : i === Math.max(idx, 0) + 1 ? "current" : "pending",
  }));
}

export default function DashboardContent() {
  const { user, owner } = useAuth();
  const [requests, setRequests]   = useState([]);
  const [stats, setStats]         = useState(null);
  const [loading, setLoading]     = useState(true);

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
            .select("id, status, requestType, reference, created_at, startDate, endDate, addressId(street, houseNumber, addition)")
            .in("addressId", addressIds)
            .order("created_at", { ascending: false })
            .limit(5);
          requestRows = data || [];
        }

        const openRequests = requestRows.filter((r) => {
          const statusKey = (r.status || "").toLowerCase();
          return !["afgerond", "completed", "voltooid"].includes(statusKey);
        });

        const active = openRequests.length;

        setRequests(openRequests);
        setStats({ activeDossiers: active, pendingDocuments: 0, newMessages: 0 });
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.id, owner?.id]);

  const ownerName = owner?.name || user?.name || "Gebruiker";

  return (
    <main className="flex-grow p-4 sm:p-8 w-full overflow-y-auto relative bg-[linear-gradient(180deg,rgba(255,255,255,0.42)_0%,rgba(255,255,255,0.18)_100%)] backdrop-blur-sm">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <p className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50/90 px-3 py-1 text-xs font-semibold text-secondary shadow-sm mb-3">
            Klantportaal
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">
            Welkom terug, {ownerName}
          </h1>
          <p className="text-gray-600 mt-1 max-w-xl">
            Bekijk de status van uw lopende aanvragen en documenten.
          </p>
        </div>
        <Link
          href="/dashboard/dossiers"
          className="bg-[linear-gradient(135deg,#2D6BE4_0%,#1B3A6B_100%)] text-white px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-secondary/20 transition flex items-center border border-blue-100/40"
        >
          <i className="fa-solid fa-folder-open mr-2" /> Alle dossiers
        </Link>
      </div>

      {/* Overview Cards */}
      <DashboardOverviewCards stats={stats} />

      {/* Main Grid: Timelines & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {loading ? (
            <div className="text-center py-12 text-gray-400">
              <i className="fa-solid fa-spinner fa-spin text-3xl mb-3" />
              <p>Dossiers laden…</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="rounded-2xl border border-blue-100/60 bg-white/80 p-8 text-center text-gray-500">
              <i className="fa-solid fa-folder-open text-3xl mb-3 text-blue-200" />
              <p>Nog geen dossiers gevonden.</p>
            </div>
          ) : (
            requests.map((req) => {
              const address = req.addressId || {};
              const typeMeta = requestTypeMeta[req.requestType] || { label: REQUEST_TYPE_LABEL[req.requestType] || "Aanvraag", icon: "fa-circle", accent: "text-secondary", badge: "bg-blue-100 text-secondary border-blue-200" };
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
          <NotificationsPanel />
        </div>
      </div>
    </main>
  );
}
