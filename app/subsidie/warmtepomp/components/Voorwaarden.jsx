const voorwaarden = [
  {
    icon: "fa-solid fa-box-open",
    text: "De warmtepomp is nieuw. Voor een tweedehands of gebruikt apparaat krijgt u geen subsidie.",
  },
  {
    icon: "fa-solid fa-screwdriver-wrench",
    text: "Een installatiebedrijf heeft de warmtepomp geplaatst. Zelf installeren mag niet.",
  },
  {
    icon: "fa-solid fa-list-check",
    text: "Het model staat op de meldcodelijst van RVO. Wij zoeken de meldcode voor u op.",
  },
  {
    icon: "fa-solid fa-temperature-half",
    text: "De warmtepomp verwarmt uw ruimte of tapwater. Airco's (lucht-lucht) en warmtepompdrogers vallen af.",
  },
  {
    icon: "fa-solid fa-house",
    text: "Particulier: uw woning is gebouwd vóór 1 januari 2019.",
  },
  {
    icon: "fa-solid fa-ban",
    text: "Sinds 2026 geen subsidie voor split lucht-waterwarmtepompen met een vulgewicht onder 3 kg én een GWP boven 750.",
  },
];

const situaties = [
  {
    icon: "fa-solid fa-house-user",
    title: "Particulier",
    regeling: "ISDE",
    wanneer: "Eerst installeren, daarna aanvragen",
    termijn: "Binnen 24 maanden na installatie",
    tone: "ok",
  },
  {
    icon: "fa-solid fa-key",
    title: "Verhuurder",
    regeling: "SVOH",
    wanneer: "Onder € 25.000 subsidie: eerst uitvoeren, daarna aanvragen",
    termijn: "Binnen 24 maanden. Vanaf € 25.000 vraagt u vooraf aan.",
    tone: "ok",
  },
  {
    icon: "fa-solid fa-briefcase",
    title: "Ondernemer",
    regeling: "ISDE zakelijk",
    wanneer: "Eerst aanvragen, pas daarna opdracht geven",
    termijn:
      "Vóór het tekenen van de offerte. Achteraf aanvragen wordt afgewezen.",
    tone: "let-op",
  },
  {
    icon: "fa-solid fa-building",
    title: "VvE",
    regeling: "SVVE",
    wanneer: "Andere regeling dan ISDE",
    termijn:
      "Voor een VvE valt een warmtepomp onder de SVVE. In de scan kijken wij welke regels voor uw VvE gelden.",
    tone: "ok",
  },
];

const TONE = {
  ok: "border-gray-100",
  "let-op": "border-yellow-300 bg-yellow-50/40",
};

export default function Voorwaarden() {
  return (
    <>
      <section
        id="voorwaarden"
        className="py-16 md:py-20 lg:py-24 bg-surface w-full"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Komt u in aanmerking?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Aan deze voorwaarden moet uw warmtepomp voldoen. Twijfelt u? In
              onze gratis scan controleren wij het voor u.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {voorwaarden.map((v) => (
              <div
                key={v.text}
                className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4"
              >
                <div className="w-10 h-10 bg-[#E6F1FB] rounded-xl flex items-center justify-center text-[#185FA5] shrink-0">
                  <i className={v.icon} />
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {v.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="wanneer-aanvragen"
        className="py-16 md:py-20 lg:py-24 bg-white w-full"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Wanneer vraagt u aan?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Het moment van aanvragen verschilt per situatie. Wie te laat is,
              verliest de subsidie.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {situaties.map((s) => (
              <div
                key={s.title}
                className={`bg-white rounded-2xl border-2 p-5 ${TONE[s.tone]}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-[#E6F1FB] rounded-xl flex items-center justify-center text-[#185FA5]">
                    <i className={s.icon} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                    {s.regeling}
                  </span>
                </div>
                <p className="font-bold text-primary mb-2">{s.title}</p>
                <p className="text-sm font-medium text-gray-800 mb-1">
                  {s.tone === "let-op" && (
                    <i className="fa-solid fa-triangle-exclamation text-yellow-500 mr-1.5" />
                  )}
                  {s.wanneer}
                </p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {s.termijn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
