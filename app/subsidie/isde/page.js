import { Footer, Header, TopBar } from "@/components/layout";
import { redirect } from "next/navigation";
import {
  IsdeHero,
  IsdeMeasures,
  IsdeEligibility,
  IsdeHowItWorks,
  IsdeMidCTA,
  IsdeFAQ,
} from "./components";

export const metadata = {
  title: "ISDE Subsidie 2026 | Warmtepomp, Isolatie & Meer | Subzy",
  description:
    "Vraag uw ISDE-subsidie aan via Subzy. Tot €3.500 voor een warmtepomp, tot €30/m² voor isolatie en meer. No Cure No Pay — wij regelen alles voor u. Gratis check.",
  keywords: [
    "ISDE subsidie",
    "ISDE 2026",
    "warmtepomp subsidie",
    "isolatie subsidie",
    "zonneboiler subsidie",
    "investeringssubsidie duurzame energie",
    "energiebesparing subsidie",
    "RVO subsidie aanvragen",
  ],
  openGraph: {
    title: "ISDE Subsidie 2026 | Tot €3.500 voor verduurzaming | Subzy",
    description:
      "Ontvang tot €3.500 ISDE-subsidie voor een warmtepomp, zonneboiler of isolatie. Wij regelen de aanvraag volledig voor u. No Cure No Pay.",
    type: "website",
  },
};

// Tijdelijk uit: bezoekers gaan naar het subsidie-overzicht. Terugzetten door
// IsdePage weer als default te exporteren.
export default function Page() {
  redirect("/subsidie");
}

// eslint-disable-next-line no-unused-vars
function IsdePage() {
  return (
    <>
      <TopBar />
      <Header />
      <main>
        <IsdeHero />
        <IsdeMeasures />
        <IsdeEligibility />
        <IsdeHowItWorks />
        <IsdeMidCTA />
        <IsdeFAQ />
      </main>
      <Footer />
    </>
  );
}
