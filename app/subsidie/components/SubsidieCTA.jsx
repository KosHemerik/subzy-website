import Link from "next/link";

export default function SubsidieCTA() {
  return (
    <section className="py-20 bg-primary text-white w-full">
      <div className="max-w-3xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Laat geen subsidie liggen
        </h2>
        <p className="text-blue-200 text-lg mb-10">
          Start vandaag uw gratis subsidiescan en ontdek hoeveel u kunt ontvangen.
          No Cure No Pay — u betaalt alleen bij succes.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            href="/subsidie/aanvragen/isde"
            className="inline-flex items-center bg-yellow-400 hover:bg-yellow-500 text-primary font-bold px-8 py-3.5 rounded-lg transition duration-300 shadow-lg text-lg w-full sm:w-auto justify-center"
          >
            Start gratis subsidiescan <i className="fa-solid fa-arrow-right ml-2" />
          </Link>
          <Link
            href="/subsidie"
            className="inline-flex items-center border-2 border-white hover:bg-white/10 text-white font-bold px-8 py-3.5 rounded-lg transition duration-300 text-lg w-full sm:w-auto justify-center"
          >
            Bekijk alle maatregelen <i className="fa-solid fa-arrow-right ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}
