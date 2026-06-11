import HowItWorksCards from "@/components/sections/HowItWorksCards";

const steps = [
  {
    icon: "fa-solid fa-magnifying-glass-chart",
    title: "1. Energiebelasting scan",
    description: "Laat ons een gratis scan uitvoeren. Vul uw gegevens in en wij beoordelen binnen 2 werkdagen of u recht heeft op Teruggave Energiebelasting. Geen energienota nodig, geen verplichtingen.",
  },
  {
    icon: "fa-regular fa-file-lines",
    title: "2. Wij regelen de aanvraag",
    description: "Wij verzamelen de gegevens. Blijkt dat u in aanmerking komt? Dan regelen wij de rest. Wij vragen de benodigde gegevens bij u op zoals uw energiejaarafrekening en WOZ-aanslag en bereiden de aanvraag volledig voor. U hoeft zelf niets uit te zoeken.",
  },
  {
    icon: "fa-solid fa-money-bill-transfer",
    title: "3. Ontvang uw teruggave",
    description: "Wij dienen de aanvraag namens u in bij de Belastingdienst en begeleiden het volledige proces tot uitbetaling. Volledig op No cure, No pay basis. Wilt u ook in de jaren daarna geen teruggave mislopen? Dan zorgen wij voor de jaarlijkse opvolging.",
  },
];

/**
 * How it Works Timeline Section
 */
export default function HowItWorksTimeline() {
  return (
    <HowItWorksCards
      label="Zo simpel werkt het"
      title="In 3 stappen naar uw teruggave"
      subtitle="Wij maken het proces zo makkelijk mogelijk. Geen ingewikkelde formulieren of verborgen verrassing."
      steps={steps}
      cta={{
        href: "/energiebelasting/aanvragen",
        label: "Begin met uw gratis scan",
        sub: "Binnen 2 werkdagen duidelijkheid",
      }}
    />
  );
}
