const measures = [
  {
    icon: "fa-solid fa-temperature-arrow-up",
    title: "Warmtepomp",
    subtitle: "Lucht-water & hybride",
    amount: "tot €3.500",
    description:
      "Een volledig elektrische warmtepomp (lucht-water) geeft recht op de hoogste ISDE-subsidie. Ook een hybride warmtepomp — die samenwerkt met uw bestaande cv-ketel — komt in aanmerking. Het exacte bedrag is afhankelijk van het vermogen en het gekozen model.",
    tag: "Meest aangevraagd",
    tagColor: "bg-secondary text-white",
  },
  {
    icon: "fa-solid fa-sun",
    title: "Zonneboiler",
    subtitle: "Warm water op zonne-energie",
    amount: "tot €800",
    description:
      "Een zonneboiler gebruikt zonne-energie om warm water te maken. Hiermee bespaart u flink op uw gasverbruik. Het subsidiebedrag is afhankelijk van het type en het collectoroppervlak van het systeem.",
    tag: null,
  },
  {
    icon: "fa-solid fa-house",
    title: "Dakisolatie",
    subtitle: "Plat & schuin dak",
    amount: "tot €25 per m²",
    description:
      "Dakisolatie heeft een grote impact op uw energieverbruik. ISDE vergoedt een vast bedrag per m² geïsoleerd dakoppervlak. Zowel platte als schuine daken komen in aanmerking, mits geïnstalleerd door een erkend bedrijf.",
    tag: null,
  },
  {
    icon: "fa-solid fa-border-all",
    title: "Gevel- & vloerisolatie",
    subtitle: "Spouwmuur, binnengevel & kruipruimte",
    amount: "tot €30 per m²",
    description:
      "Gevels en vloeren zijn grote energieverliezers. Spouwmuurisolatie, binnengevelisolatie en vloerisolatie in de kruipruimte worden allemaal vergoed via ISDE. Het bedrag varieert per type isolatie.",
    tag: null,
  },
  {
    icon: "fa-solid fa-window-maximize",
    title: "HR++ & Triple glas",
    subtitle: "Energiezuinige beglazing",
    amount: "tot €30 per m²",
    description:
      "Vervangt u oud glas door HR++ of HR+++ (triple) glas? Dan vergoedt de ISDE een vast bedrag per m² nieuw glas. Belangrijk: het glas moet worden geplaatst in een bestaande woning door een erkende installateur.",
    tag: null,
  },
  {
    icon: "fa-solid fa-wind",
    title: "Ventilatiesysteem",
    subtitle: "Wtw-ventilatie (systeem D)",
    amount: "tot €1.400",
    description:
      "Een warmteterugwinning-ventilatiesysteem (systeem D) zorgt voor frisse lucht zonder warmteverlies. Dit systeem komt in aanmerking voor ISDE-subsidie als het voldoet aan de eisen van het Nationaal Warmtefonds.",
    tag: null,
  },
  {
    icon: "fa-solid fa-plug",
    title: "Elektrisch koken",
    subtitle: "Inductie kookplaat",
    amount: "tot €122",
    description:
      "Stapt u over van gas- naar inductiekoken? Dan ontvangt u een vaste subsidie per aansluiting. Dit is de kleinste ISDE-vergoeding, maar eenvoudig te combineren met andere maatregelen voor een hogere totale teruggave.",
    tag: null,
  },
  {
    icon: "fa-solid fa-network-wired",
    title: "Warmtenet aansluiting",
    subtitle: "Aansluiting op stadsverwarming",
    amount: "vaste bijdrage",
    description:
      "Sluit u uw woning aan op een collectief warmtenet (stadsverwarming)? Dan kunt u onder bepaalde voorwaarden ook aanspraak maken op ISDE-subsidie. De hoogte is afhankelijk van uw situatie en het type warmtenet.",
    tag: null,
  },
];

export default function IsdeMeasures() {
  return (
    <section id="maatregelen" className="py-16 md:py-20 lg:py-24 bg-background w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-accent text-xs font-semibold tracking-widest uppercase block mb-3">
            Subsidiabele maatregelen
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Welke maatregelen komen in aanmerking voor ISDE?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            De ISDE subsidie geldt voor een breed scala aan energiebesparende investeringen. Hieronder vindt u de meest voorkomende maatregelen inclusief indicatieve subsidiebedragen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {measures.map((m, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-accent/20 transition-all duration-300 flex gap-5">
              <div className="shrink-0">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-secondary">
                  <i className={`${m.icon} text-lg`} />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <h3 className="font-bold text-primary text-base">{m.title}</h3>
                    <p className="text-xs text-gray-500 mb-2">{m.subtitle}</p>
                  </div>
                  {m.tag && (
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${m.tagColor}`}>
                      {m.tag}
                    </span>
                  )}
                </div>
                <div className="inline-flex items-center bg-green-50 border border-green-100 rounded-lg px-3 py-1 mb-3">
                  <i className="fa-solid fa-euro-sign text-green-600 text-xs mr-1.5" />
                  <span className="text-sm font-bold text-green-700">{m.amount}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{m.description}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          * Bedragen zijn indicatief voor 2026 en afhankelijk van het specifieke product en vermogen. De actuele subsidielijst wordt jaarlijks vastgesteld door RVO.
        </p>
      </div>
    </section>
  );
}
