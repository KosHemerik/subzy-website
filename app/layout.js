import { AuthProviderWrapper } from "@/components/providers";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "Subzy - Subsidies en Teruggaven voor Huiseigenaren",
  description: "Wij ontzorgen huiseigenaren volledig bij het terugvragen van energiebelasting en het aanvragen van duurzaamheidssubsidies.",
  keywords: ["subsidie", "energiebelasting", "teruggave", "ISDE", "duurzaamheid"],
  openGraph: {
    title: "Subzy - Subsidies en Teruggaven voor Huiseigenaren",
    description:
      "Wij ontzorgen huiseigenaren volledig bij het terugvragen van energiebelasting en het aanvragen van duurzaamheidssubsidies.",
    url: "https://subzy.nl",
    type: "website",
    siteName: "Subzy",
    locale: "nl_NL",
  },
  twitter: {
    card: "summary",
    title: "Subzy - Subsidies en Teruggaven voor Huiseigenaren",
    description:
      "Wij ontzorgen huiseigenaren volledig bij het terugvragen van energiebelasting en het aanvragen van duurzaamheidssubsidies.",
  },
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "any" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: "/favicon/apple-touch-icon.png",
  },
  manifest: "/favicon/site.webmanifest",
};

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className={`${inter.variable} antialiased bg-white text-gray-800 overflow-x-hidden`}>
        <AuthProviderWrapper>
          {children}
        </AuthProviderWrapper>
      </body>
    </html>
  );
}
