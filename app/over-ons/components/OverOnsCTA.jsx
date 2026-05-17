import Link from "next/link";

export default function OverOnsCTA() {
  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative bg-primary rounded-2xl px-10 py-14 text-white overflow-hidden shadow-[0_20px_60px_-10px_rgba(27,58,107,0.5)] text-center">
          {/* Dot grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          {/* Glow orbs */}
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-secondary/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />

          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">Zet vandaag de eerste stap</h2>
            <p className="text-blue-200 mb-8 text-lg max-w-xl mx-auto">
              Ontdek direct of u in aanmerking komt voor teruggave of subsidie. Onze check is volledig gratis en vrijblijvend.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link href="/energiebelasting">
                <button className="bg-yellow text-primary font-bold px-8 py-3.5 rounded-lg transition duration-300 hover:brightness-95 shadow-lg text-lg w-full sm:w-auto">
                  Energiebelasting teruggave
                </button>
              </Link>
              <Link href="/subsidie">
                <button className="border-2 border-white hover:bg-white/10 text-white font-bold px-8 py-3.5 rounded-lg transition duration-300 text-lg w-full sm:w-auto">
                  Duurzaamheidssubsidie
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
