import { getStatusKey, getStatusMeta, STATUS_ORDER } from "@/lib/portal/requestMeta";

/**
 * Status Breakdown
 * Horizontale balk met het aantal dossiers per status — geeft de eigenaar in
 * één oogopslag inzicht in waar zijn aanvragen staan. Statussen en kleuren
 * komen uit het gedeelde woordenboek dat het admin-dashboard volgt.
 */
export default function StatusBreakdown({ requests = [] }) {
  if (!requests.length) return null;

  const counts = requests.reduce((acc, request) => {
    const key = getStatusKey(request.status);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const known = new Set(STATUS_ORDER);
  const otherCount = Object.entries(counts)
    .filter(([key]) => !known.has(key))
    .reduce((sum, [, value]) => sum + value, 0);

  const items = [
    ...STATUS_ORDER.map((key) => {
      const meta = getStatusMeta(key);
      return { key, label: meta.label, dot: meta.dot, count: counts[key] || 0 };
    }),
    ...(otherCount
      ? [{ key: "overig", label: "Overig", dot: "bg-gray-300", count: otherCount }]
      : []),
  ];

  return (
    <div>
      <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-500">
        Status van uw dossiers
      </h2>
      <div className="flex flex-wrap items-stretch overflow-hidden rounded-2xl border border-blue-100/70 bg-white/90 shadow-[0_4px_20px_-2px_rgba(27,58,107,0.06)] sm:divide-x sm:divide-blue-100/70">
        {items.map((item) => (
          <div
            key={item.key}
            className="flex flex-1 items-center justify-between gap-3 px-5 py-3.5 sm:justify-center sm:gap-2.5"
          >
            <span className="flex items-center gap-2.5">
              <span className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${item.dot}`} />
              <span className="text-sm font-medium text-gray-600">{item.label}</span>
            </span>
            <span className="text-lg font-bold text-primary">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
