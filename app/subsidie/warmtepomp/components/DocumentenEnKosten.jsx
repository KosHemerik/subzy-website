import { SUBZY_TARIEF } from "../data";

const documenten = [
  { icon: "fa-solid fa-file-invoice", title: "Factuur", text: "Van de installateur, met merk, type en installatiedatum." },
  { icon: "fa-solid fa-money-check", title: "Betaalbewijs", text: "Bijvoorbeeld een bankafschrift met datum en bedrag." },
  { icon: "fa-solid fa-camera", title: "Foto's", text: "Van de geïnstalleerde warmtepomp." },
];

const wijRegelen = [
  "Indiening bij RVO binnen 2 werkdagen na uw scan",
  "Opzoeken van de juiste meldcode en het subsidiebedrag",
  "Controle van uw documenten vóór indiening",
  "Volledige aanvraag bij RVO namens u",
  "Contact met RVO bij vragen of aanvullingen",
];

export default function DocumentenEnKosten() {
  return (
    <section className="py-16 md:py-20 lg:py-24 bg-surface w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h2 className="text-3xl font-bold text-primary mb-4">Wat heeft u nodig?</h2>
          <p className="text-gray-600 mb-8">
            Als particulier of verhuurder houdt u deze documenten bij de hand. De meldcode en alle andere gegevens zoeken wij
            voor u op.
          </p>
          <div className="space-y-4">
            {documenten.map((d) => (
              <div key={d.title} className="flex items-start gap-4 bg-white rounded-2xl border border-gray-100 p-5">
                <div className="w-10 h-10 bg-[#E6F1FB] rounded-xl flex items-center justify-center text-secondary shrink-0">
                  <i className={d.icon} />
                </div>
                <div>
                  <p className="font-semibold text-primary">{d.title}</p>
                  <p className="text-sm text-gray-600">{d.text}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-6">
            <i className="fa-solid fa-circle-info text-secondary mr-1.5" />
            Ondernemer? U vraagt aan vóórdat de warmtepomp er is. Facturen en foto&apos;s volgen pas na installatie, als u om
            uitbetaling vraagt.
          </p>
        </div>

        <div className="bg-primary rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-2">Wat kost het?</h2>
          <p className="text-blue-200 mb-6">Eén vast tarief, alleen bij succes.</p>
          <div className="flex items-end gap-2 mb-1">
            <span className="text-5xl font-bold">€ {SUBZY_TARIEF.basis},-</span>
            <span className="text-blue-200 mb-2">incl. btw</span>
          </div>
          <p className="text-sm text-blue-200 mb-8">
            + € {SUBZY_TARIEF.extraMaatregel} per extra maatregel, bijvoorbeeld als u ook isoleert. Wordt de subsidie niet
            toegekend? Dan betaalt u niets.
          </p>
          <ul className="space-y-3">
            {wijRegelen.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm">
                <i className="fa-solid fa-check text-green-400 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
