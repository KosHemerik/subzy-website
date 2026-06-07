"use client";

import { Button, Logo } from "@/components/ui";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Energiebelasting", href: "/energiebelasting" },
  { 
    label: "Subsidie", 
    href: "#",
    dropdown: [
      { label: "Subsidie overzicht", href: "/subsidie" },
      { label: "ISDE subsidie", href: "/subsidie/isde" },
      { label: "SVOH subsidie", href: "/subsidie/svoh" },
    ]
  },
  { label: "Over ons", href: "/over-ons" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

/**
 * Main navigation header
 */
export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();
  const portalHref = user ? "/dashboard" : "/login";

  const isActive = (href, dropdown) => {
    if (dropdown) {
      return dropdown.some(item => pathname.startsWith(item.href));
    }
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-sm w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <div key={item.label} className="relative group">
                {item.dropdown ? (
                  <>
                    <Link href="/subsidie" className={`font-medium flex items-center cursor-pointer py-2 ${
                      isActive(item.href, item.dropdown)
                        ? "text-secondary border-b-2 border-secondary"
                        : "text-gray-600 hover:text-primary"
                    }`}>
                      {item.label}
                      <i className="fa-solid fa-chevron-down ml-1 text-xs" />
                    </Link>
                    <div className="absolute hidden group-hover:block w-56 bg-white shadow-lg rounded-lg pt-2 top-full left-0">
                      <div className="py-2 border border-gray-100 rounded-lg">
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.label}
                            href={subItem.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-background hover:text-primary"
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`font-medium transition ${
                      isActive(item.href)
                        ? "text-secondary border-b-2 border-secondary pb-1"
                        : "text-gray-600 hover:text-primary"
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="flex items-center">
            <Link href={portalHref}>
              <Button variant="secondary" size="sm">
                Klantportaal
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-primary"
            >
              <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-xl`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.dropdown ? "#" : item.href}
              className="block py-2 text-gray-600 hover:text-primary font-medium"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
