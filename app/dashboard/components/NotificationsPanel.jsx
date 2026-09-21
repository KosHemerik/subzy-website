import Link from "next/link";

/**
 * Notifications Panel Component
 * Displays recent (real) notifications in the dashboard — momenteel
 * "actie vereist"-meldingen voor documenten die Subzy heeft opgevraagd.
 * `notifications` komt van DashboardContent; een lege array betekent dat er
 * écht geen meldingen zijn (geen mock-fallback meer).
 */
export default function NotificationsPanel({ notifications = [] }) {
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
    <div className="rounded-2xl border border-blue-100/70 bg-white/90 shadow-[0_4px_20px_-2px_rgba(27,58,107,0.06)] p-6 sticky top-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-lg text-primary">Meldingen</h2>
      </div>

      {notifications.length === 0 ? (
        <div className="py-6 text-center text-sm text-gray-400">
          <i className="fa-regular fa-bell-slash text-2xl mb-2 block" />
          Geen meldingen op dit moment.
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => {
            const iconData = getNotificationIcon(notification.type);
            const className = `flex items-start space-x-3 p-3 rounded-lg transition ${
              notification.highlight
                ? "bg-[linear-gradient(135deg,rgba(45,107,228,0.14)_0%,rgba(27,58,107,0.08)_100%)] border border-blue-100"
                : "hover:bg-blue-50/70 border border-transparent"
            } ${notification.href ? "hover:shadow-sm" : ""}`;

            const body = (
              <>
                <div className={`flex-shrink-0 mt-0.5 ${iconData.color}`}>
                  <i className={`fa-solid ${iconData.icon}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {notification.title}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {notification.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                </div>
              </>
            );

            return notification.href ? (
              <Link key={notification.id} href={notification.href} className={className}>
                {body}
              </Link>
            ) : (
              <div key={notification.id} className={className}>
                {body}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
