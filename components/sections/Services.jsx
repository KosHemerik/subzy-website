import Link from "next/link";
import StatsCounter from "./StatsCounter";

const services = [
  {
    badge: "NAUWELIJKS BEKEND",
    badgeColor: "bg-yellow text-primary",
    title: "Teruggave Energiebelasting",
    description: "Heeft u meerdere woningen, units of appartementen achter één elektriciteitsaansluiting? Dan betaalt u waarschijnlijk te veel energiebelasting. De Belastingdienst geeft dit terug — wij regelen de aanvraag volledig voor u.",
    features: [
      { text: "Gemiddeld ", highlight: "€1.207,-", suffix: " per aanvraag teruggekregen" },
      { text: "Terugvorderen tot ", highlight: "5 jaar terug", suffix: "" },
      { text: "Binnen 2 dagen een ", highlight: "gratis scan", suffix: " door onze professionals" },
    ],
    tags: [
      { icon: "fa-solid fa-building", label: "Verhuurders" },
      { icon: "fa-solid fa-city", label: "VvE's" },
      { icon: "fa-solid fa-user", label: "Particulieren" },
    ],
    href: "/energiebelasting",
    cta: "Bekijk of u in aanmerking komt",
  },
  {
    badge: "TOT €3.200 SUBSIDIE",
    badgeColor: "bg-surface text-primary",
    title: "Duurzaamheidssubsidie",
    description: "Investeert u in isolatie, een warmtepomp of zonneboiler? De overheid vergoedt een groot deel via verschillende subsidieregelingen. Wij bepalen welke regeling voor u van toepassing is en regelen de aanvraag volledig.",
    features: [
      { text: "Subsidie op een warmtepomp — al snel ", highlight: "€2.400 terug", suffix: "" },
      { text: "", highlight: "Combinatievoordeel", suffix: " bij meerdere maatregelen" },
      { text: "Ook voor ", highlight: "verhuurwoningen", suffix: " beschikbaar" },
    ],
    tags: [
      { icon: "fa-solid fa-user", label: "Particulieren" },
      { icon: "fa-solid fa-building", label: "Verhuurders" },
      { icon: "fa-solid fa-city", label: "VvE's" },
      { icon: "fa-solid fa-briefcase", label: "Bedrijven" },
    ],
    href: "/subsidie",
    cta: "Bekijk of u in aanmerking komt",
  },
];


function ServiceCard({ badge, badgeColor, title, description, features, tags, href, cta }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border-2 border-gray-100 hover:border-accent/30 flex flex-col h-full relative">
      <div className="mb-6">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeColor}`}>
          {badge}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      
      {/* Description */}
      <p className="text-gray-600 mb-6 text-sm leading-relaxed">{description}</p>
      
      {/* Features */}
      <ul className="space-y-3 mb-6 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start text-sm text-gray-700">
            <i aria-hidden="true" className="fa-solid fa-check text-green-500 mt-0.5 mr-3 text-xs" />
            <span>
              {feature.text}
              <span className="font-semibold">{feature.highlight}</span>
              {feature.suffix}
            </span>
          </li>
        ))}
      </ul>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tags.map((tag, index) => (
          <span key={index} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface rounded-full text-xs text-primary font-medium">
            <i aria-hidden="true" className={`${tag.icon} text-accent`} />
            {tag.label}
          </span>
        ))}
      </div>

      {/* CTA Button */}
      <Link
        href={href}
        className="inline-flex items-center justify-center w-full bg-primary hover:bg-primary-hover text-white font-semibold text-sm px-5 py-3 rounded-xl transition-colors duration-200 group mt-auto"
      >
        {cta}
        <i aria-hidden="true" className="fa-solid fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}

export default function Services() {
  return (
    <section className="py-16 md:py-20 lg:py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="animate-reveal text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Haal terug waar u recht op heeft
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Geen documenten zoeken, geen formulieren invullen — wij regelen alles van A tot Z.
          </p>
        </div>

        {/* Service Cards */}
        <div className="animate-reveal-grid grid md:grid-cols-2 gap-8">
          {services.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>

        {/* Animated stats */}
        <StatsCounter />
      </div>
    </section>
  );
}
