/**
 * Contact Hero Section
 * Page header with title and description
 */
export default function ContactHero() {
  return (
    <section className="hero-bg py-20 curve-bottom text-center px-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
          Neem contact met ons op
        </h1>
        <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
          Heeft u een vraag over uw aanvraag of onze diensten? Wij staan voor u klaar. Vriendelijk, persoonlijk en deskundig.
        </p>
      </div>
    </section>
  );
}
