import Image from "next/image";

const documents = [
  {
    icon: "fa-solid fa-file-invoice-dollar",
    title: "Facturen",
    description: "Gespecificeerde facturen van de uitgevoerde werkzaamheden.",
  },
  {
    icon: "fa-solid fa-money-check-dollar",
    title: "Betaalbewijzen",
    description: "Bankafschriften of pinbonnen waaruit blijkt dat de factuur is voldaan.",
  },
  {
    icon: "fa-solid fa-camera",
    title: "Foto's (bij isolatie)",
    description: "Foto's gemaakt tijdens de uitvoering van de isolatiewerkzaamheden.",
  },
];

export default function RequiredDocuments() {
  return (
    <section id="documenten" className="py-20 bg-background w-full border-y border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold text-primary mb-6">Wat hebben wij van u nodig?</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Om uw aanvraag snel en succesvol in te dienen, hebben we slechts een paar documenten nodig. U kunt deze veilig uploaden in ons klantportaal.
            </p>

            <ul className="space-y-4">
              {documents.map((doc, index) => (
                <li key={index} className="flex items-start bg-white p-4 rounded-lg shadow-sm">
                  <i className={`${doc.icon} text-secondary mt-1 mr-4 text-xl`} />
                  <div>
                    <h4 className="font-bold text-primary">{doc.title}</h4>
                    <p className="text-sm text-gray-600">{doc.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Documenten voorbereiding"
              className="rounded-2xl shadow-xl w-full h-[400px] object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
