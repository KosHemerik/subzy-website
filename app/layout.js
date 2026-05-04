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
  icons: {
    icon: "/subzy_logo_transparant.png",
    shortcut: "/subzy_logo_transparant.png",
    apple: "/subzy_logo_transparant.png",
  },
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
