import Link from "next/link";

const cards = [
  {
    icon: "fa-solid fa-house-user",
    title: "Particulier",
    badge: "Populair",
    description: "U heeft maatregelen genomen in uw eigen woning, zoals een warmtepomp, isolatie of zonneboiler.",
    href: "/subsidie/aanvragen/isde?doelgroep=particulier",
  },
  {
    icon: "fa-solid fa-building",
    title: "VvE",
    badge: null,
    description: "Uw Vereniging van Eigenaren heeft verduurzaamd in het gebouw of de gemeenschappelijke ruimten.",
    href: "/subsidie/aanvragen/isde?doelgroep=vve",
  },
  {
    icon: "fa-solid fa-key",
    title: "Verhuurder",
    badge: null,
    description: "U verhuurt een of meer woningen en heeft deze verduurzaamd. Subsidie per woning en per maatregel.",
    href: "/subsidie/aanvragen/svoh?doelgroep=verhuurder",
  },
  {
    icon: "fa-solid fa-briefcase",
    title: "Ondernemer: warmtepomp of zonneboiler",
    badge: "ISDE",
    description: "U heeft als bedrijf of ondernemer een warmtepomp of zonneboiler laten plaatsen.",
    href: "/subsidie/aanvragen/isde?doelgroep=zakelijk",
  },
  {
    icon: "fa-solid fa-chart-line",
    title: "Ondernemer: investering in energiebesparing",
    badge: "EIA",
    description: "U investeert in energiezuinige bedrijfsmiddelen, zoals ledverlichting, installaties of machines.",
    // Nog geen EIA-wizard: voorlopig via contact
    href: "/contact",
    cta: "Neem contact op",
  },
];

function DoelgroepCard({ card }) {
  return (
    <Link
      href={card.href}
      className="group relative bg-white border border-gray-100 rounded-2xl px-6 py-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] hover:border-blue-100 transition duration-300 flex flex-col h-full"
    >
      {/* Badge — absolute top-right */}
      {card.badge && (
        <span className="absolute top-4 right-4 bg-[#1a2e6b] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
          {card.badge}
        </span>
      )}

      {/* Icon above title */}
      <div className="w-10 h-10 bg-[#E6F1FB] rounded-xl flex items-center justify-center text-[#185FA5] text-base mb-4 flex-shrink-0">
        <i className={card.icon} />
      </div>

      <h3 className="text-base font-bold text-primary mb-2 pr-16">{card.title}</h3>
      <p className="text-gray-500 mb-5 text-[13px] leading-[1.6] flex-grow">{card.description}</p>

      {/* Action */}
      <span className="h-12 flex items-center justify-center gap-2 bg-[#F5C518] group-hover:bg-[#e0b310] text-[#1a2e6b] font-semibold rounded-xl transition duration-200 text-sm">
        {card.cta ?? "Gratis scan"} <i className="fa-solid fa-arrow-right cta-arrow-bounce" />
      </span>
    </Link>
  );
}

export default function SubsidiesFilter() {
  return (
    <section id="subsidies" className="py-16 md:py-20 lg:py-24 bg-white w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">Voor wie is de aanvraag?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Kies uw situatie. Elke situatie heeft eigen regels, dus zo komt u direct in de juiste aanvraag.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card) => (
            <DoelgroepCard key={card.title} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
