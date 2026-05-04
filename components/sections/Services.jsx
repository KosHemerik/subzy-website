import Link from "next/link";

const services = [
  {
    icon: "fa-solid fa-file-invoice-dollar",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    badge: "NAUWELIJKS BEKEND",
    badgeColor: "bg-green-100 text-green-700",
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
    icon: "fa-solid fa-leaf",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    badge: "TOT €3.200 SUBSIDIE",
    badgeColor: "bg-blue-100 text-blue-700",
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
    href: "#",
    cta: "Bekijk of u in aanmerking komt",
  },
];

const stats = [
  { value: "€360K+", label: "Teruggevraagd voor klanten" },
  { value: "1.400+", label: "Succesvolle aanvragen" },
  { value: "Ruim 8 jaar", label: "Ervaring in energiebelasting & subsidie" },
];

/**
 * Service card component
 */
function ServiceCard({ icon, iconBg, iconColor, badge, badgeColor, title, description, features, tags, href, cta }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border-2 border-gray-100 hover:border-blue-200 flex flex-col h-full relative">
      {/* Header with icon and badge */}
      <div className="flex items-start justify-between mb-6">
        <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center ${iconColor}`}>
          <i className={`${icon} text-xl`} />
        </div>
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
            <i className="fa-solid fa-check text-green-500 mt-0.5 mr-3 text-xs" />
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
            <span key={index} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 rounded-[12px] text-xs text-white font-medium">
            <i className={`${tag.icon}`} />
            {tag.label}
          </span>
        ))}
      </div>

      {/* CTA Link */}
      <Link 
        href={href}
        className="inline-flex items-center text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors group"
      >
        {cta}
        <i className="fa-solid fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}

/**
 * Services overview section
 */
export default function Services() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Haal terug waar u <span className="text-blue-600">recht op heeft</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Geen documenten zoeken, geen formulieren invullen — wij regelen alles van A tot Z.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-400 mb-6">Waarom klanten ons vertrouwen</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
