const BASE_URL = "https://subzy.nl";

// Public, indexable routes. Auth pages and the /dashboard portal are left out on purpose.
const ROUTES = [
  { path: "", priority: 1.0, changeFrequency: "weekly" },
  { path: "/energiebelasting", priority: 0.9, changeFrequency: "monthly" },
  { path: "/energiebelasting/aanvragen", priority: 0.8, changeFrequency: "monthly" },
  { path: "/subsidie", priority: 0.9, changeFrequency: "monthly" },
  { path: "/subsidie/warmtepomp", priority: 0.9, changeFrequency: "monthly" },
  // Tijdelijk uit
  // { path: "/subsidie/isde", priority: 0.9, changeFrequency: "monthly" },
  // { path: "/subsidie/svoh", priority: 0.9, changeFrequency: "monthly" },
  { path: "/subsidie/aanvragen", priority: 0.7, changeFrequency: "monthly" },
  { path: "/subsidie/aanvragen/isde", priority: 0.8, changeFrequency: "monthly" },
  { path: "/subsidie/aanvragen/svoh", priority: 0.8, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.6, changeFrequency: "monthly" },
  { path: "/over-ons", priority: 0.5, changeFrequency: "yearly" },
  { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/voorwaarden", priority: 0.2, changeFrequency: "yearly" },
];

export default function sitemap() {
  return ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${BASE_URL}${path}`,
    changeFrequency,
    priority,
  }));
}
