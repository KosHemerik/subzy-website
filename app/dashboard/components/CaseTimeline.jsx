"use client";

/**
 * Case Timeline Component
 * Displays a single case with its progress timeline
 */
export default function CaseTimeline({ caseData }) {
  const getStepIcon = (step) => {
    const icons = {
      intake: "fa-check",
      documents: "fa-file-arrow-up",
      review: "fa-magnifying-glass",
      submitted: "fa-building-columns",
      processing: "fa-spinner",
      sent: "fa-paper-plane",
    };
    return icons[step.type] || "fa-circle";
  };

  const getStepStyles = (status) => {
    switch (status) {
      case "completed":
        return {
          bg: "bg-green-500",
          textColor: "text-white",
          ring: "",
        };
      case "current":
        return {
          bg: step => step.type === "processing" ? "bg-blue-500" : "bg-orange-500",
          textColor: "text-white",
          ring: step => step.type === "processing" ? "ring-4 ring-blue-50" : "ring-4 ring-orange-50",
        };
      case "pending":
      default:
        return {
          bg: "bg-gray-200",
          textColor: "text-gray-500",
          ring: "",
        };
    }
  };

  const typeMeta = caseData.requestTypeMeta || { label: "Aanvraag", icon: "fa-circle", accent: "text-secondary", badge: "bg-blue-100 text-secondary border-blue-200" };

  return (
    <div className="bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(235,242,255,0.98)_100%)] backdrop-blur-sm rounded-2xl shadow-[0_12px_40px_rgba(27,58,107,0.07)] border border-blue-100/60 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-blue-100/60 flex justify-between items-start gap-4 bg-[linear-gradient(135deg,rgba(45,107,228,0.08)_0%,rgba(27,58,107,0.05)_100%)]">
        <div>
          <h3 className="font-bold text-lg text-primary">{caseData.title}</h3>
          <p className="text-sm text-gray-500">{caseData.periodLabel || "Periode onbekend"}</p>
        </div>
        <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${typeMeta.badge}`}>
          <i className={`fa-solid ${typeMeta.icon} ${typeMeta.accent}`} />
          {typeMeta.label}
        </span>
      </div>

      {/* Timeline */}
      <div className="p-6">
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-secondary/40 via-primary/20 to-blue-200" />
          <ul className="space-y-6 relative">
            {caseData.steps.map((step, index) => {
              const styles = getStepStyles(step.status);
              const bgClass = typeof styles.bg === "function" ? styles.bg(step) : styles.bg;
              const ringClass = typeof styles.ring === "function" ? styles.ring(step) : styles.ring;

              return (
                <li key={index} className="flex items-start">
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full ${bgClass} flex items-center justify-center ${styles.textColor} z-10 relative shadow-sm ${ringClass}`}
                  >
                    <i
                      className={`fa-solid ${getStepIcon(step)} text-sm ${
                        step.type === "processing" && step.status === "current"
                          ? "fa-spin"
                          : ""
                      }`}
                    />
                  </div>
                  <div className="ml-4">
                    <h4
                      className={`text-sm font-semibold ${
                        step.status === "pending" ? "text-gray-400" : "text-gray-900"
                      }`}
                    >
                      {step.title}
                    </h4>
                    {step.date && (
                      <p className="text-xs text-gray-500 mt-1">{step.date}</p>
                    )}
                    {step.description && (
                      <p className="text-xs text-gray-500 mt-1 mb-2">
                        {step.description}
                      </p>
                    )}
                    {step.action && (
                      <button className="text-sm bg-[linear-gradient(135deg,#2D6BE4_0%,#1B3A6B_100%)] text-white px-4 py-1.5 rounded-lg hover:shadow-lg hover:shadow-secondary/20 transition shadow-sm">
                        {step.action}
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
