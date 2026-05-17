import Image from "next/image";

export default function Mission() {
  return (
    <section className="py-16 w-full px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className="lg:w-1/2">
          <Image
            className="w-full h-[500px] object-cover rounded-2xl shadow-xl"
            src="/warmte_pomp.jpg"
            alt="Warmtepomp bij een woning"
            width={800}
            height={500}
          />
        </div>
        <div className="lg:w-1/2 space-y-6">
          <h2 className="text-3xl font-bold text-primary">Uw specialist in energiebelasting en duurzaamheidssubsidies</h2>
          <div className="w-20 h-1 bg-accent rounded" />
          <p className="text-gray-600 text-lg leading-relaxed">
            Jaarlijks laten duizenden huiseigenaren geld liggen, niet omdat ze er geen recht op hebben, maar omdat de overheid het ze niet makkelijk maakt. Ingewikkelde formulieren, onduidelijke eisen en instanties waar je moeilijk doorheen komt. Subzy is precies om die reden opgericht: om particulieren, verhuurders en VvE&apos;s dat traject volledig uit handen te nemen.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed">
            Wij weten precies welke aanvragen kans van slagen hebben, hoe het traject bij de overheid werkt en hoe we voorkomen dat uw aanvraag strandt op een gemist detail. Geen anoniem loket, geen standaardantwoorden, maar persoonlijke begeleiding van iemand die uw dossier door en door kent.
          </p>
        </div>
      </div>
    </section>
  );
}
