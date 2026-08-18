/**
 * Dashboard Overview Cards Component
 * Displays statistics cards at top of dashboard
 */
export default function DashboardOverviewCards({ stats }) {
  const cards = [
    {
      label: "Actieve dossiers",
      value: stats?.activeDossiers ?? 2,
      icon: "fa-folder-tree",
      accent: "from-blue-50 to-sky-50",
      textColor: "text-secondary",
    },
    {
      label: "Te uploaden documenten",
      value: stats?.pendingDocuments ?? 3,
      icon: "fa-file-circle-exclamation",
      accent: "from-orange-50 to-amber-50",
      textColor: "text-orange-500",
    },
    {
      label: "Nieuwe berichten",
      value: stats?.newMessages ?? 1,
      icon: "fa-envelope-open-text",
      accent: "from-green-50 to-emerald-50",
      textColor: "text-green-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(235,242,255,0.98)_100%)] backdrop-blur-sm p-6 rounded-2xl shadow-[0_12px_40px_rgba(27,58,107,0.07)] border border-blue-100/60 flex items-center space-x-4"
        >
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.accent} ${card.textColor} flex items-center justify-center text-xl ring-1 ring-white/80`}
          >
            <i className={`fa-solid ${card.icon}`} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">{card.label}</p>
            <p className="text-2xl font-bold text-primary tracking-tight">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
