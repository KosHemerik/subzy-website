import Link from "next/link";
import { Logo, StarRating } from "@/components/ui";
import { COMPANY_INFO } from "@/lib/constants";

const footerLinks = {
  diensten: [
    { label: "Teruggave Energiebelasting", href: "/diensten/energiebelasting" },
    { label: "Isolatiesubsidie (ISDE)", href: "/diensten/isde" },
    { label: "Warmtepomp subsidie", href: "/diensten/warmtepomp" },
    { label: "Zonnepanelen BTW", href: "/diensten/zonnepanelen" },
  ],
  handig: [
    { label: "Over ons", href: "/over-ons" },
    { label: "Veelgestelde vragen", href: "/faq" },
    { label: "Klantportaal", href: "/portaal" },
    { label: "Algemene voorwaarden", href: "/voorwaarden" },
    { label: "Privacy beleid", href: "/privacy" },
  ],
};

const socialLinks = [
  { icon: "fa-brands fa-facebook-f", href: "https://facebook.com" },
  { icon: "fa-brands fa-linkedin-in", href: "https://linkedin.com" },
  { icon: "fa-brands fa-instagram", href: "https://instagram.com" },
];

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
            <Logo className="mb-6" textColor="text-white" />
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Dé vertrouwde partner voor huiseigenaren. Wij maken het aanvragen
              van subsidies en teruggaven simpel, snel en 100% zorgeloos.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.icon}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition"
                >
                  <i className={social.icon} />
                </a>
              ))}
            </div>
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
