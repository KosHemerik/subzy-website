import { StarRating } from "@/components/ui";
import { COMPANY_INFO } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";

const footerLinks = {
  diensten: [
    { label: "Teruggave energiebelasting", href: "/energiebelasting" },
    { label: "Duurzaamheidssubsidies", href: "/subsidie" },
    { label: "ISDE subsidie", href: "/subsidie/isde" },
    { label: "SVOH subsidie", href: "/subsidie/svoh" },
  ],
  handig: [
    { label: "Over ons", href: "/over-ons" },
    { label: "Veelgestelde vragen", href: "/faq" },
    { label: "Klantportaal", href: "/dashboard" },
    { label: "Algemene voorwaarden", href: "/voorwaarden" },
    { label: "Privacy beleid", href: "/privacy" },
  ],
};

/**
 * Main footer component
 */
export default function Footer() {
  return (
    <footer className="bg-primary-dark text-white pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center mb-6">
              <Image
                src="/subzy_logo_transparant_wit.png"
                alt="Subzy"
                width={120}
                height={40}
                style={{ width: "auto", height: "auto" }}
                priority
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Dé vertrouwde partner voor huiseigenaren. Wij maken het aanvragen van subsidies en teruggaven energiebelasting simpel, snel en 100% zorgeloos.
            </p>
          </div>

          {/* Diensten */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Diensten</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              {footerLinks.diensten.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-secondary transition">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Handig */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Handig</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              {footerLinks.handig.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-secondary transition">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="flex items-start">
                <i className="fa-solid fa-location-dot mt-1 mr-3 text-secondary" />
                <span>
                  {COMPANY_INFO.name}<br />
                  {COMPANY_INFO.address.street}<br />
                  {COMPANY_INFO.address.city}
                </span>
              </li>
              <li className="flex items-center">
                <i className="fa-solid fa-phone mr-3 text-secondary" />
                <a href={COMPANY_INFO.phone.href} className="hover:text-white transition">
                  {COMPANY_INFO.phone.display}
                </a>
              </li>
              <li className="flex items-center">
                <i className="fa-solid fa-envelope mr-3 text-secondary" />
                <a href={COMPANY_INFO.email.href} className="hover:text-white transition">
                  {COMPANY_INFO.email.display}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Subzy. Alle rechten voorbehouden.</p>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <span>Beoordeeld met</span>
            <StarRating rating={COMPANY_INFO.rating} className="text-xs" />
            <span>({COMPANY_INFO.rating}/5)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
