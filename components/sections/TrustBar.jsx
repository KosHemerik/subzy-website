const trustItems = [
  {
    icon: "fa-solid fa-shield-halved",
    label: "No Cure No Pay",
    subtitle: "U betaalt alleen bij succes",
    bgColor: "bg-background",
    iconColor: "text-secondary",
  },
  {
    icon: "fa-solid fa-circle-check",
    label: "Binnen 2 werkdagen",
    subtitle: "Duidelijkheid over uw aanvraag",
    bgColor: "bg-background",
    iconColor: "text-secondary",
  },
  {
    icon: "fa-solid fa-mobile-screen",
    label: "100% digitaal",
    subtitle: "Geen bezoek nodig",
    bgColor: "bg-background",
    iconColor: "text-secondary",
  },
  {
    icon: "fa-solid fa-star",
    label: "4.8/5 beoordeling",
    subtitle: "Gebaseerd op 450+ reviews",
    bgColor: "bg-yellow-50",
    iconColor: "text-yellow-400",
  },
];

/**
 * Trust bar with key selling points
 */
export default function TrustBar() {
  return (
    <section className="py-12 bg-white relative z-20 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {trustItems.map((item) => (
            <div key={item.label} className="flex flex-col items-center justify-center">
              <div className={`w-12 h-12 ${item.bgColor} rounded-full flex items-center justify-center ${item.iconColor} mb-3`}>
                <i className={`${item.icon} text-xl`} />
              </div>
              <span className="font-semibold text-primary">{item.label}</span>
              <span className="text-xs text-gray-500 mt-0.5">{item.subtitle}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
