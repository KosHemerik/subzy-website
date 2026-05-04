const testimonials = [
  {
    text: "Subzy heeft het hele proces voor de ISDE subsidie voor mijn warmtepomp uit handen genomen. Ik hoefde alleen de factuur te sturen en zij regelden de rest. Binnen een paar weken stond het geld op mijn rekening. Top service!",
    name: "Peter de Jong",
    location: "Huiseigenaar uit Utrecht",
    initial: "P",
  },
  {
    text: "Ik wist niet eens dat ik recht had op teruggave energiebelasting voor onze VvE. Subzy heeft dit kosteloos voor ons uitgezocht en een aanzienlijk bedrag teruggehaald. Zeer professioneel en transparant gecommuniceerd.",
    name: "Monique Veenstra",
    location: "VvE Bestuurder uit Amsterdam",
    initial: "M",
  },
];

/**
 * Testimonials Section
 * Customer reviews and testimonials
 */
export default function Testimonials() {
  return (
    <section className="py-16 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-primary mb-12">
          Wat onze klanten zeggen
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.name}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-left relative"
            >
              <i className="fa-solid fa-quote-right absolute top-6 right-6 text-4xl text-surface" />
              <div className="flex text-yellow-400 mb-4">
                <i className="fa-solid fa-star" />
                <i className="fa-solid fa-star" />
                <i className="fa-solid fa-star" />
                <i className="fa-solid fa-star" />
                <i className="fa-solid fa-star" />
              </div>
              <p className="text-gray-600 italic mb-6">"{testimonial.text}"</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold mr-3">
                  {testimonial.initial}
                </div>
                <div>
                  <p className="font-bold text-primary">{testimonial.name}</p>
                  <p className="text-xs text-gray-500">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
