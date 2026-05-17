import { COMPANY_INFO } from "@/lib/constants";

/**
 * Contact Info Sidebar
 * Displays company contact details and map
 */
export default function ContactInfo() {
  const contactDetails = [
    {
      icon: "fa-location-dot",
      title: "Bezoekadres",
      content: (
        <>
          {COMPANY_INFO.address.street}
          <br />
          {COMPANY_INFO.address.city}
        </>
      ),
    },
    {
      icon: "fa-phone",
      title: "Telefoon",
      content: (
        <>
          <a href={COMPANY_INFO.phone.href} className="hover:text-secondary transition">
            {COMPANY_INFO.phone.display}
          </a>
          <p className="text-sm text-gray-500 mt-1">{COMPANY_INFO.openingHours.full}</p>
        </>
      ),
    },
    {
      icon: "fa-envelope",
      title: "E-mail",
      content: (
        <a href={COMPANY_INFO.email.href} className="hover:text-secondary transition">
          {COMPANY_INFO.email.display}
        </a>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Office Details Card */}
      <div className="bg-background rounded-2xl p-8 border border-blue-100">
        <h3 className="text-xl font-bold text-primary mb-6">
          Onze contactgegevens
        </h3>

        <div className="space-y-6">
          {contactDetails.map((detail, index) => (
            <div key={index} className="flex items-start">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-secondary shrink-0">
                <i className={`fa-solid ${detail.icon} text-xl`} />
              </div>
              <div className="ml-4">
                <h4 className="font-bold text-gray-900">{detail.title}</h4>
                <div className="text-gray-600 mt-1">{detail.content}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
