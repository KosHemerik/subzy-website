import HowItWorksCards from "@/components/sections/HowItWorksCards";

const steps = [
  {
    icon: "fa-solid fa-clipboard-check",
    title: "Vul de gratis subsidiescan in",
    description:
      "Selecteer uw maatregelen en upload uw factuur, betaalbewijs en foto — onze scan leidt u in enkele minuten door het proces.",
  },
  {
    icon: "fa-solid fa-circle-check",
    title: "Wij controleren uw aanvraag",
    description:
      "Wij checken alle gegevens zorgvuldig en stellen uw subsidieaanvraag op. U hoeft niets meer te doen.",
  },
  {
    icon: "fa-solid fa-paper-plane",
    title: "Wij dienen in bij RVO",
    description:
      "Uw aanvraag wordt binnen 2 werkdagen professioneel ingediend bij RVO.",
  },
  {
    icon: "fa-solid fa-money-bill-wave",
    title: "Ontvang uw subsidie",
    description:
      "Na goedkeuring van RVO wordt het subsidiebedrag direct op uw rekening gestort.",
  },
];

export default function SubsidieTimeline() {
  return (
    <HowItWorksCards
      label="⚡ Zo simpel werkt het"
      title="In 4 stappen naar uw subsidie"
      subtitle="U vult de scan in en uploadt uw documenten. Daarna hoeft u niets meer te doen."
      steps={steps}
      badge="No Cure No Pay — u betaalt alleen bij succes"
    />
  );
}
