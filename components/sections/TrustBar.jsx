const trustItems = [
  {
    icon: "fa-solid fa-shield-halved",
    label: "No Cure No Pay",
    subtitle: "U betaalt alleen bij succes",
    iconBg: "bg-blue-50",
    iconColor: "text-secondary",
  },
  {
    icon: "fa-solid fa-circle-check",
    label: "Binnen 2 werkdagen",
    subtitle: "Duidelijkheid over uw aanvraag",
    iconBg: "bg-blue-50",
    iconColor: "text-secondary",
  },
  {
    icon: "fa-solid fa-mobile-screen",
    label: "100% digitaal",
    subtitle: "Geen bezoek nodig",
    iconBg: "bg-blue-50",
    iconColor: "text-secondary",
  },
  {
    icon: "fa-solid fa-star",
    label: "4.8/5 beoordeling",
    subtitle: "Gebaseerd op 450+ reviews",
    iconBg: "bg-yellow-50",
    iconColor: "text-yellow-400",
  },
];

export default function TrustBar() {
  return (
    <section className="bg-white py-8 border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6">
          {trustItems.map((item, index) => (
            <div
              key={item.label}
              className={`flex items-center gap-4 px-8 ${
                index < trustItems.length - 1
                  ? "md:border-r md:border-gray-100"
                  : ""
              }`}
            >
              <div
                className={`w-11 h-11 ${item.iconBg} rounded-xl flex items-center justify-center ${item.iconColor} shrink-0`}
              >
                <i className={`${item.icon} text-lg`} />
              </div>
              <div>
                <span className="font-semibold text-primary text-sm block leading-tight">
                  {item.label}
                </span>
                <span className="text-xs text-gray-500 mt-0.5 block">
                  {item.subtitle}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
