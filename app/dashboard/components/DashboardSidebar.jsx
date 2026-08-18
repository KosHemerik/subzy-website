"use client";

import { useAuth } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarItems = [
  { label: "Overzicht",    href: "/dashboard",             icon: "fa-chart-line"      },
  { label: "Mijn Dossiers", href: "/dashboard/dossiers",   icon: "fa-folder-open"     },
  { label: "Mijn Profiel", href: "/dashboard/profiel",     icon: "fa-circle-user"     },
  { label: "Documenten",   href: "/dashboard/documenten",  icon: "fa-file-arrow-up"   },
];

/**
 * Dashboard Sidebar Component
 * Navigation sidebar for the dashboard
 */
export default function DashboardSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const isActive = (href) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 hidden md:flex flex-col flex-shrink-0 min-h-[calc(100vh-80px)] border-r border-blue-200/60 bg-[linear-gradient(180deg,rgba(27,58,107,0.98)_0%,rgba(33,76,140,0.96)_100%)] text-white shadow-[12px_0_40px_rgba(27,58,107,0.12)]">
      <div className="p-6 flex-grow">
        {/* Brand */}
        <div className="mb-7">
          <Link href="/dashboard" className="inline-flex" aria-label="Subzy dashboard">
            <Image
              src="/subzy_logo_transparant_wit.png"
              alt="Subzy"
              width={190}
              height={48}
              priority
              className="h-9 w-auto"
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {sidebarItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition ${
                isActive(item.href)
                  ? "bg-white/16 text-white ring-1 ring-white/10"
                  : "text-blue-100 hover:bg-white/8 hover:text-white"
              }`}
            >
              <i className={`fa-solid ${item.icon} w-5`} />
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto bg-white/15 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* Logout */}
      <div className="p-6 border-t border-white/10">
        <button
          onClick={logout}
          className="flex items-center space-x-3 text-blue-100 hover:text-white transition font-medium w-full"
        >
          <i className="fa-solid fa-arrow-right-from-bracket w-5" />
          <span>Uitloggen</span>
        </button>
      </div>
    </aside>
  );
}
