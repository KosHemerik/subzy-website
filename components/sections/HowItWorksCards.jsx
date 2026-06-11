export default function HowItWorksCards({ label, title, subtitle, steps, badge, cta }) {
  const cols = steps.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2 lg:grid-cols-4";

  return (
    <section id="hoe-het-werkt" className="py-20 bg-white w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          {label && (
            <span className="text-accent text-xs font-semibold tracking-widest uppercase block mb-3">
              {label}
            </span>
          )}
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-gray-500 max-w-lg mx-auto text-base leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Step cards */}
        <div className={`grid grid-cols-1 ${cols} gap-6`}>
          {steps.map((step, index) => {
            const cleanTitle = step.title.replace(/^\d+\.\s*/, "");
            const stepNum = String(index + 1).padStart(2, "0");

            return (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-accent/20 transition-all duration-300 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center text-accent shrink-0">
                    <i className={`${step.icon} text-sm`} />
                  </div>
                  <span className="text-xs font-semibold text-accent tracking-widest uppercase">
                    Stap {stepNum}
                  </span>
                </div>

                <h3 className="font-bold text-primary text-base mb-2">{cleanTitle}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>

        {/* Badge */}
        {badge && (
          <div className="text-center mt-10">
            <span className="inline-flex items-center gap-2 bg-surface text-primary text-sm font-medium px-5 py-2 rounded-full">
              <i className="fa-solid fa-shield-halved text-yellow-400" />
              {badge}
            </span>
          </div>
        )}

        {/* CTA */}
        {cta && (
          <div className="text-center mt-10">
            <a
              href={cta.href}
              className="inline-flex items-center font-bold transition duration-300 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-primary shadow-lg px-6 py-3"
            >
              {cta.label}
              <i className="fa-solid fa-arrow-right ml-2 cta-arrow-bounce" />
            </a>
            {cta.sub && (
              <p className="text-gray-400 text-sm mt-3">{cta.sub}</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
