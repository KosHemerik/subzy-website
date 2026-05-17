import { Logo, StarRating } from "@/components/ui";
import { COMPANY_INFO } from "@/lib/constants";

/**
 * Top Bar with contact info and rating
 */
export default function TopBar() {
  return (
    <div className="bg-primary-dark text-white py-2 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
      <div className="flex items-center space-x-6">
        <a href={COMPANY_INFO.phone.href} className="flex items-center hover:text-secondary transition">
          <i className="fa-solid fa-phone mr-2" /> {COMPANY_INFO.phone.display}
        </a>
        <a href={COMPANY_INFO.email.href} className="flex items-center hover:text-secondary transition">
          <i className="fa-solid fa-envelope mr-2" /> {COMPANY_INFO.email.display}
        </a>
      </div>
      <StarRating rating={COMPANY_INFO.rating} showValue />
      </div>
    </div>
  );
}
