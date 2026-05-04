/**
 * Reusable "How It Works" card grid — refined editorial style.
 * Used on /subsidie and /energiebelasting.
 */
export default function HowItWorksCards({ label, title, subtitle, steps, badge }) {
  const cols = steps.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2 lg:grid-cols-4";

  return (
    <section id="hoe-het-werkt" className="py-20 bg-[#F8FAFC] w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          {label && (
            <div className="inline-flex items-center justify-center mb-3">
              <span className="text-gray-500 text-xs font-semibold tracking-widest uppercase">
                {label}
              </span>
            </div>
          )}
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-gray-400 max-w-lg mx-auto text-base leading-relaxed text-center">
              {subtitle}
            </p>
          )}
        </div>

        {/* Unified grid with 1px dividers */}
        <div
          className={`grid grid-cols-1 ${cols} rounded-2xl overflow-hidden mx-4`}
          style={{ background: "#e5e7eb", gap: "1px" }}
        >
          {steps.map((step, index) => {
            // Strip leading "N. " from titles so numbers come from the eyebrow only
            const cleanTitle = step.title.replace(/^\d+\.\s*/, "");
            const stepNum = String(index + 1).padStart(2, "0");

            return (
              <div
                key={index}
                className="bg-white flex flex-col"
                style={{ padding: "1.5rem 1.25rem" }}
              >
                {/* Icon */}
                <div
                  className="flex items-center justify-center mb-4 flex-shrink-0"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: "#E6F1FB",
                    color: "#185FA5",
                    fontSize: 14,
                  }}
                >
                  <i className={step.icon} />
                </div>

                {/* Eyebrow */}
                <p
                  className="font-semibold uppercase tracking-widest mb-1"
                  style={{ fontSize: 10, color: "#185FA5", letterSpacing: "0.1em" }}
                >
                  Stap {stepNum}
                </p>

                {/* Title */}
                <h3 className="font-bold text-primary mb-2" style={{ fontSize: 15 }}>
                  {cleanTitle}
                </h3>

                {/* Body */}
                <p className="text-gray-500" style={{ fontSize: 13, lineHeight: 1.6 }}>
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Badge */}
        {badge && (
          <div className="text-center mt-10">
            <span
              className="inline-flex items-center gap-2 bg-[#F0F6FF] text-primary font-medium"
              style={{
                fontSize: 13,
                borderRadius: 100,
                padding: "0.4rem 1.1rem",
                border: "0.5px solid #C5D9F0",
              }}
            >
              <i className="fa-solid fa-shield-halved text-yellow-400" />
              {badge}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
