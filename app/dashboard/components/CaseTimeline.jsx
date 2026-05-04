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

  const getStatusBadge = (status) => {
    const badges = {
      "waiting-documents": {
        bg: "bg-orange-100",
        text: "text-orange-700",
        border: "border-orange-200",
        label: "Wacht op documenten",
      },
      "in-progress": {
        bg: "bg-blue-100",
        text: "text-blue-700",
        border: "border-blue-200",
        label: "In behandeling",
      },
      "completed": {
        bg: "bg-green-100",
        text: "text-green-700",
        border: "border-green-200",
        label: "Afgerond",
      },
    };
    return badges[status] || badges["in-progress"];
  };

  const badge = getStatusBadge(caseData.status);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <div>
          <h3 className="font-bold text-lg text-primary">{caseData.title}</h3>
          <p className="text-sm text-gray-500">Dossiernr: {caseData.caseNumber}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text} border ${badge.border}`}
        >
          {badge.label}
        </span>
      </div>

      {/* Timeline */}
      <div className="p-6">
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
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
                      <button className="text-sm bg-secondary text-white px-4 py-1.5 rounded hover:bg-accent transition shadow-sm">
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
