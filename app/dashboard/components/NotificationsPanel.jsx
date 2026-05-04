import Link from "next/link";

/**
 * Notifications Panel Component
 * Displays recent notifications in the dashboard
 */
export default function NotificationsPanel({ notifications }) {
  const defaultNotifications = [
    {
      id: 1,
      type: "action",
      title: "Actie vereist: Jaarrekening",
      description: "Upload uw jaarrekening voor dossier #EB-2023-8942.",
      time: "Vandaag, 10:30",
      highlight: true,
    },
    {
      id: 2,
      type: "success",
      title: "Documenten goedgekeurd",
      description: "De facturen voor dossier #DS-2023-1024 zijn geaccepteerd.",
      time: "Gisteren, 14:15",
      highlight: false,
    },
    {
      id: 3,
      type: "info",
      title: "Welkom bij Subzy",
      description: "Uw account is succesvol aangemaakt.",
      time: "12 Okt 2023",
      highlight: false,
    },
  ];

  const items = notifications || defaultNotifications;

  const getNotificationIcon = (type) => {
    const icons = {
      action: { icon: "fa-circle-exclamation", color: "text-secondary" },
      success: { icon: "fa-check-circle", color: "text-green-500" },
      info: { icon: "fa-envelope", color: "text-gray-400" },
      warning: { icon: "fa-triangle-exclamation", color: "text-orange-500" },
    };
    return icons[type] || icons.info;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg text-primary">Recente Notificaties</h3>
        <Link
          href="/dashboard/notificaties"
          className="text-sm text-secondary hover:text-accent font-medium"
        >
          Bekijk alles
        </Link>
      </div>

      <div className="space-y-4">
        {items.map((notification) => {
          const iconData = getNotificationIcon(notification.type);

          return (
            <div
              key={notification.id}
              className={`flex items-start space-x-3 p-3 rounded-lg transition ${
                notification.highlight
                  ? "bg-surface border border-blue-100"
                  : "hover:bg-gray-50 border border-transparent"
              }`}
            >
              <div className={`flex-shrink-0 mt-0.5 ${iconData.color}`}>
                <i className={`fa-solid ${iconData.icon}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {notification.title}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {notification.description}
                </p>
                <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
