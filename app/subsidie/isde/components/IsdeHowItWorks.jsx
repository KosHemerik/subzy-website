import HowItWorksCards from "@/components/sections/HowItWorksCards";

const steps = [
  {
    icon: "fa-solid fa-magnifying-glass-chart",
    title: "1. Gratis subsidiecheck",
    description:
      "Vul uw gegevens in via onze wizard. Wij beoordelen binnen 2 werkdagen of u in aanmerking komt voor ISDE en welk bedrag u kunt verwachten. Geen verplichtingen, geen kosten.",
  },
  {
    icon: "fa-regular fa-file-lines",
    title: "2. Wij regelen de aanvraag",
    description:
      "Komt u in aanmerking? Dan verzorgen wij de volledige aanvraag bij RVO namens u. Wij controleren of uw installateur en product op de subsidielijst staan, en dienen alles correct en tijdig in.",
  },
  {
    icon: "fa-solid fa-money-bill-transfer",
    title: "3. Subsidie ontvangen",
    description:
      "Na goedkeuring door RVO ontvangt u de subsidie rechtstreeks op uw rekening. Dit gebeurt doorgaans binnen enkele weken na indiening. U betaalt ons alleen een percentage bij een succesvolle uitkering.",
  },
];

export default function IsdeHowItWorks() {
  return (
    <HowItWorksCards
      label="Zo simpel werkt het"
      title="In 3 stappen uw ISDE-subsidie aanvragen"
      subtitle="Wij ontzorgen u volledig. Van check tot uitbetaling — geen ingewikkelde formulieren, geen zoeken op de RVO-website."
      steps={steps}
      badge="No Cure No Pay — u betaalt alleen bij succes"
    />
  );
}
