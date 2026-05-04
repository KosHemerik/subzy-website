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
      bgColor: "bg-blue-50",
      textColor: "text-secondary",
    },
    {
      label: "Te uploaden documenten",
      value: stats?.pendingDocuments ?? 3,
      icon: "fa-file-circle-exclamation",
      bgColor: "bg-orange-50",
      textColor: "text-orange-500",
    },
    {
      label: "Nieuwe berichten",
      value: stats?.newMessages ?? 1,
      icon: "fa-envelope-open-text",
      bgColor: "bg-green-50",
      textColor: "text-green-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4"
        >
          <div
            className={`w-12 h-12 rounded-lg ${card.bgColor} ${card.textColor} flex items-center justify-center text-xl`}
          >
            <i className={`fa-solid ${card.icon}`} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">{card.label}</p>
            <p className="text-2xl font-bold text-primary">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
