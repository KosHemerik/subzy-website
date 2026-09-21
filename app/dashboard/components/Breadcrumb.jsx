import Link from "next/link";

/**
 * Breadcrumb
 * `pages`: array van { name, href }. Het laatste item (of een item zonder href)
 * wordt als huidige pagina getoond. Begint altijd met een home-link naar het
 * dashboard. Stijl volgt het interne Subzy-dashboard (home-icoon + chevrons).
 */
export default function Breadcrumb({ pages = [] }) {
  return (
    <nav aria-label="Kruimelpad" className="flex min-w-0">
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        <li className="flex items-center">
          <Link
            href="/dashboard"
            className="flex items-center text-gray-400 transition hover:text-secondary"
          >
            <i className="fa-solid fa-house text-xs" aria-hidden="true" />
            <span className="sr-only">Dashboard</span>
          </Link>
        </li>

        {pages.map((page, index) => {
          const isCurrent = index === pages.length - 1 || !page.href;
          return (
            <li key={page.name} className="flex min-w-0 items-center gap-2">
              <i
                className="fa-solid fa-chevron-right text-[10px] text-gray-300"
                aria-hidden="true"
              />
              {isCurrent ? (
                <span
                  aria-current="page"
                  className="truncate font-semibold text-primary"
                >
                  {page.name}
                </span>
              ) : (
                <Link
                  href={page.href}
                  className="font-medium text-gray-500 transition hover:text-secondary"
                >
                  {page.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
