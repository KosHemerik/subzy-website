/**
 * Dashboard Overview Cards Component
 * Toont kerncijfers voor de eigenaar bovenaan het dashboard.
 */
const CARD_META = [
  {
    key: "activeDossiers",
    label: "Actieve dossiers",
    icon: "fa-folder-tree",
    iconBg: "from-secondary to-primary",
    fallback: 0,
  },
  {
    key: "completedRequests",
    label: "Afgeronde aanvragen",
    icon: "fa-circle-check",
    iconBg: "from-emerald-400 to-green-600",
    fallback: 0,
  },
  {
    key: "totalReclaimedLabel",
    label: "Teruggevraagd bedrag",
    icon: "fa-sack-dollar",
    iconBg: "from-primary to-primary-dark",
    fallback: "€ 0,00",
  },
  {
    key: "pendingDocuments",
    label: "Te uploaden documenten",
    icon: "fa-file-circle-exclamation",
    iconBg: "from-amber-400 to-orange-500",
    fallback: 0,
  },
];

export default function DashboardOverviewCards({ stats, loading = false }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {CARD_META.map((card) => (
        <div
          key={card.key}
          className="flex items-center gap-4 rounded-2xl border border-blue-100/70 bg-white/90 p-5 shadow-[0_4px_20px_-2px_rgba(27,58,107,0.06)]"
        >
          <div
            className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${card.iconBg} text-white shadow-sm`}
          >
            <i className={`fa-solid ${card.icon} text-lg`} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {card.label}
            </p>
            {loading ? (
              <span className="mt-1.5 block h-6 w-14 animate-pulse rounded bg-blue-100/80" />
            ) : (
              <p className="mt-1 truncate text-xl font-bold tracking-tight text-primary">
                {stats?.[card.key] ?? card.fallback}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
