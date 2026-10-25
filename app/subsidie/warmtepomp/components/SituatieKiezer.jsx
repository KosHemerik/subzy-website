import Link from "next/link";

// Elke situatie opent de juiste wizard met de warmtepomp al aangevinkt
const opties = [
  {
    icon: "fa-solid fa-house-user",
    title: "Particulier",
    description: "De warmtepomp staat in uw eigen woning.",
    href: "/subsidie/aanvragen/isde?doelgroep=particulier&maatregel=warmtepomp",
    cta: "Gratis scan",
    badge: "Populair",
  },
  {
    icon: "fa-solid fa-key",
    title: "Verhuurder",
    description: "De warmtepomp staat in een woning die u verhuurt.",
    href: "/subsidie/aanvragen/svoh?doelgroep=verhuurder&maatregel=warmtepomp",
    cta: "Gratis scan",
  },
  {
    icon: "fa-solid fa-briefcase",
    title: "Ondernemer",
    description: "U schaft de warmtepomp zakelijk aan. Let op: vraag aan vóór u de offerte tekent.",
    href: "/subsidie/aanvragen/isde?doelgroep=zakelijk&maatregel=warmtepomp",
    cta: "Gratis scan",
  },
  {
    icon: "fa-solid fa-building",
    title: "VvE",
    description: "De warmtepomp is voor het gebouw van uw Vereniging van Eigenaren.",
    href: "/subsidie/aanvragen/isde?doelgroep=vve&maatregel=warmtepomp",
    cta: "Gratis scan",
  },
];

export default function SituatieKiezer() {
  return (
    <section id="aanvragen" className="py-16 md:py-20 lg:py-24 bg-white w-full scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">Voor wie is de aanvraag?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Kies uw situatie. U komt direct in de juiste aanvraag, met de warmtepomp al geselecteerd.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {opties.map((o) => (
            <Link
              key={o.title}
              href={o.href}
              className="group relative bg-white border border-gray-100 rounded-2xl px-6 py-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] hover:border-blue-100 transition duration-300 flex flex-col h-full"
            >
              {o.badge && (
                <span className="absolute top-4 right-4 bg-[#1a2e6b] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {o.badge}
                </span>
              )}
              <div className="w-10 h-10 bg-[#E6F1FB] rounded-xl flex items-center justify-center text-[#185FA5] text-base mb-4">
                <i className={o.icon} />
              </div>
              <h3 className="text-base font-bold text-primary mb-2">{o.title}</h3>
              <p className="text-gray-500 mb-5 text-[13px] leading-[1.6] flex-grow">{o.description}</p>
              <span className="h-12 flex items-center justify-center gap-2 bg-[#F5C518] group-hover:bg-[#e0b310] text-[#1a2e6b] font-semibold rounded-xl transition duration-200 text-sm">
                {o.cta} <i className="fa-solid fa-arrow-right cta-arrow-bounce" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
