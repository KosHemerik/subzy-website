"use client";

import { useAuth } from "@/lib/auth";
import { fetchPortalNotifications } from "@/lib/portal/notifications";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/**
 * Notifications Bell
 * Compacte belknop met dropdown die de actuele klantportaal-meldingen toont.
 * Haalt zelf de data op zodat elke portaalpagina 'm zonder props kan plaatsen.
 */
export default function NotificationsBell() {
  const { owner } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    let active = true;

    if (!owner?.id) {
      setNotifications([]);
      return;
    }

    fetchPortalNotifications(owner.id)
      .then((items) => {
        if (active) setNotifications(items);
      })
      .catch(() => {
        if (active) setNotifications([]);
      });

    return () => {
      active = false;
    };
  }, [owner?.id]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const count = notifications.length;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={count > 0 ? `Meldingen (${count})` : "Meldingen"}
        aria-expanded={open}
        className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl border border-blue-100 bg-white/80 text-primary shadow-sm transition hover:bg-blue-50"
      >
        <i className="fa-regular fa-bell text-lg" />
        {count > 0 && (
          <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-orange-500 px-1 text-[11px] font-bold text-white">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-blue-100/60 bg-white shadow-[0_12px_40px_rgba(27,58,107,0.18)]">
          <div className="border-b border-blue-100/60 px-4 py-3">
            <p className="text-sm font-bold text-primary">Meldingen</p>
          </div>

          {count === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-gray-400">
              <i className="fa-regular fa-bell-slash text-2xl mb-2 block" />
              Geen meldingen op dit moment.
            </div>
          ) : (
            <ul className="max-h-96 overflow-y-auto py-2">
              {notifications.map((notification) => (
                <li key={notification.id}>
                  <Link
                    href={notification.href || "#"}
                    onClick={() => setOpen(false)}
                    className="flex items-start gap-3 px-4 py-3 transition hover:bg-blue-50/70"
                  >
                    <span className="mt-0.5 flex-shrink-0 text-secondary">
                      <i className="fa-solid fa-circle-exclamation" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-gray-900">
                        {notification.title}
                      </span>
                      <span className="mt-1 block text-xs text-gray-600">
                        {notification.description}
                      </span>
                      <span className="mt-1 block text-xs text-gray-400">{notification.time}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
