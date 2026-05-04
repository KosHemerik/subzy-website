import Link from "next/link";

const features = [
  "Gratis haalbaarheidscheck",
  "Controle van alle documenten",
  "Indiening bij het RVO",
  "Communicatie met instanties",
];

export default function SubsidiePricing() {
  return (
    <section id="tarieven" className="py-20 bg-surface w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-primary mb-4">Vaste, transparante tarieven</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Geen verrassingen achteraf. Wij werken met een vast tarief per aanvraag.
          </p>
        </div>

        <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-primary p-6 text-center text-white">
            <h3 className="text-2xl font-bold mb-2">Volledige Ontzorging</h3>
            <p className="text-blue-200 text-sm">Eén vast bedrag</p>
          </div>

          <div className="p-8">
            <div className="flex justify-center items-end mb-6">
              <span className="text-5xl font-bold text-primary">€ 85,-</span>
              <span className="text-gray-500 ml-2 mb-2">per aanvraag</span>
            </div>
            <p className="text-center text-gray-500 text-sm mb-8">Inclusief 21% BTW</p>

            <ul className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <i className="fa-solid fa-check text-green-500 mt-1 mr-3" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/subsidie/aanvragen"
              className="block w-full bg-yellow-400 hover:bg-yellow-500 text-primary font-bold py-3.5 rounded-lg transition duration-300 text-center"
            >
              Start uw aanvraag
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
