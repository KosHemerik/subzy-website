import Link from "next/link";

/**
 * Dashboard Footer Component
 * Simplified footer for dashboard pages
 */
export default function DashboardFooter() {
  return (
    <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Subzy. Alle rechten voorbehouden.</p>
        <div className="flex space-x-4 mt-4 sm:mt-0">
          <Link href="/privacy" className="hover:text-primary transition">
            Privacybeleid
          </Link>
          <Link href="/voorwaarden" className="hover:text-primary transition">
            Algemene Voorwaarden
          </Link>
          <Link href="/contact" className="hover:text-primary transition">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
