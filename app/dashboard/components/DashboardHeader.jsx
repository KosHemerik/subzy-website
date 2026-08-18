"use client";

import Link from "next/link";
import { Logo } from "@/components/ui";

const navItems = [
  { label: "Homepage", href: "/" },
  { label: "Energiebelasting", href: "/energiebelasting" },
  { label: "Duurzaamheidssubsidie", href: "#" },
  { label: "FAQ", href: "/faq" },
  { label: "Over ons", href: "/over-ons" },
  { label: "Contact", href: "/contact" },
];

/**
 * Dashboard Header Component
 * Top navigation bar for the dashboard
 */
export default function DashboardHeader() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/70 bg-white/90 backdrop-blur-md shadow-[0_8px_30px_rgba(27,58,107,0.08)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Logo />

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-gray-600 hover:text-primary font-medium transition"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Dashboard Button */}
          <div className="hidden lg:flex items-center">
            <span className="bg-[linear-gradient(135deg,#2D6BE4_0%,#1B3A6B_100%)] text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-secondary/30">
              Klantportaal Dashboard
            </span>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button className="text-gray-600 hover:text-primary focus:outline-none">
              <i className="fa-solid fa-bars text-2xl" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
