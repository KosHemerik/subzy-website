"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";

const sidebarItems = [
  { label: "Overzicht", href: "/dashboard", icon: "fa-chart-line" },
  { label: "Mijn Dossiers", href: "/dashboard/dossiers", icon: "fa-folder-open" },
  { label: "Documenten", href: "/dashboard/documenten", icon: "fa-file-arrow-up" },
  { label: "Notificaties", href: "/dashboard/notificaties", icon: "fa-bell", badge: 2 },
  { label: "Instellingen", href: "/dashboard/instellingen", icon: "fa-gear" },
];

/**
 * Dashboard Sidebar Component
 * Navigation sidebar for the dashboard
 */
export default function DashboardSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isActive = (href) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col flex-shrink-0 min-h-[calc(100vh-80px)]">
      <div className="p-6 flex-grow">
        {/* User Info */}
        <div className="flex items-center space-x-3 mb-8">
          <img
            src={user?.avatar || "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg"}
            alt="User Avatar"
            className="w-12 h-12 rounded-full object-cover border-2 border-surface"
          />
          <div>
            <p className="text-sm font-semibold text-primary">Welkom terug,</p>
            <p className="text-sm text-gray-600">{user?.name || "Gebruiker"}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {sidebarItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition ${
                isActive(item.href)
                  ? "bg-surface text-secondary"
                  : "text-gray-600 hover:bg-gray-50 hover:text-primary"
              }`}
            >
              <i className={`fa-solid ${item.icon} w-5`} />
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* Logout */}
      <div className="p-6 border-t border-gray-200">
        <button
          onClick={logout}
          className="flex items-center space-x-3 text-gray-500 hover:text-red-600 transition font-medium w-full"
        >
          <i className="fa-solid fa-arrow-right-from-bracket w-5" />
          <span>Uitloggen</span>
        </button>
      </div>
    </aside>
  );
}
