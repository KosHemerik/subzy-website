const groups = [
  {
    title: "Particulieren (woningeigenaren)",
    subtitle: "Eigenaar-bewoners",
    description:
      "Bent u eigenaar van uw eigen woning en wilt u isoleren, een warmtepomp plaatsen of een zonneboiler installeren? Dan komt u als particulier in aanmerking voor ISDE. U dient de aanvraag zelf in via RVO, of laat Subzy dit volledig voor u regelen.",
  },
  {
    title: "Zakelijke eigenaren",
    subtitle: "Bedrijven, instellingen & VvE's",
    description:
      "Bedrijven, woningcorporaties, gemeenten en Verenigingen van Eigenaren (VvE) kunnen ook ISDE aanvragen — maar voor een beperktere set maatregelen: warmtepompen, zonneboilers en kleine windturbines. Zakelijke aanvragen vereisen eHerkenning niveau 2+.",
  },
  {
    title: "Monumenteneigenaren",
    subtitle: "Rijks- en gemeentemonumenten",
    description:
      "Heeft u een monumentale woning of een pand met een beschermde status? Ook dan kunt u voor bepaalde maatregelen ISDE-subsidie aanvragen. Er gelden aanvullende eisen, maar wij kennen de regels en begeleiden u door het proces.",
  },
];

const conditions = [
  "De maatregel wordt uitgevoerd door een erkend installatiebedrijf",
  "De woning of het pand staat in Nederland",
  "U bent eigenaar van het pand of heeft toestemming van de eigenaar",
  "De aanvraag wordt ingediend vóórdat de opdracht wordt verstrekt (zakelijk)",
  "De installatie vindt plaats binnen 24 maanden na toekenning",
  "Het product staat op de RVO-subsidielijst",
];

export default function IsdeEligibility() {
  return (
    <section id="voor-wie" className="py-20 bg-white w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-accent text-xs font-semibold tracking-widest uppercase block mb-3">
            Voor wie is het?
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Wie komt in aanmerking voor ISDE?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            De ISDE is beschikbaar voor zowel particulieren als zakelijke eigenaren. Hieronder ziet u voor welke situaties de subsidie geldt.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Groups */}
          <div className="space-y-5">
            {groups.map((g, i) => (
              <div key={i} className="flex bg-background p-5 rounded-2xl border border-gray-100">
                <div className="shrink-0 mt-1">
                  <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-white">
                    <i className="fa-solid fa-check" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-primary mb-0.5">{g.title}</h3>
                  <p className="text-xs text-gray-500 mb-2">{g.subtitle}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{g.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Conditions */}
          <div>
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-white shrink-0">
                  <i className="fa-solid fa-list-check" />
                </div>
                <h3 className="font-bold text-primary text-lg">Basisvoorwaarden ISDE</h3>
              </div>
              <ul className="space-y-3">
                {conditions.map((c, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700 text-sm">
                    <i className="fa-solid fa-circle-check text-secondary mt-0.5 shrink-0" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 bg-white rounded-xl border border-blue-100 p-4">
                <p className="text-xs text-gray-500 leading-relaxed">
                  <strong className="text-primary">Tip:</strong> Vraag de subsidie altijd aan <em>voordat</em> u het installatiebedrijf opdracht geeft. Bij zakelijke aanvragen is dit een harde eis van RVO — u kunt anders geen aanspraak meer maken op de subsidie.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
