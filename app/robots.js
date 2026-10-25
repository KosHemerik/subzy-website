export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/api/"],
    },
    sitemap: "https://subzy.nl/sitemap.xml",
    host: "https://subzy.nl",
  };
}
