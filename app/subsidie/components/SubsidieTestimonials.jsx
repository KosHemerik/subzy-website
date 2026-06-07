import { StarRating } from "@/components/ui";

const testimonials = [
  {
    initials: "MV",
    bgColor: "bg-secondary",
    name: "Martijn V.",
    meta: "Particulier, Utrecht",
    service: "Warmtepomp subsidie",
    rating: 5,
    quote:
      "Binnen 3 weken €2.400 subsidie ontvangen voor onze warmtepomp. Subzy regelde alles — ik hoefde alleen wat foto's te sturen.",
  },
  {
    initials: "SH",
    bgColor: "bg-primary",
    name: "Sandra H.",
    meta: "Verhuurder, Rotterdam",
    service: "SVOH isolatie subsidie",
    rating: 5,
    quote:
      "Als verhuurder wist ik niet waar ik moest beginnen. Subzy heeft de volledige SVOH aanvraag voor mij geregeld. €3.800 subsidie ontvangen.",
  },
  {
    initials: "KD",
    bgColor: "bg-accent",
    name: "Kevin D.",
    meta: "VvE beheerder, Amsterdam",
    service: "SVOH warmtepomp subsidie",
    rating: 5,
    quote:
      "Voor onze VvE hebben we €8.400 subsidie ontvangen. Het proces was volledig ontzorgd — Subzy deed al het werk.",
  },
];

function TestimonialCard({ initials, bgColor, name, meta, service, rating, quote }) {
  return (
    <div className="bg-gray-50 p-8 rounded-[12px] border border-gray-100 flex flex-col h-full">
      <StarRating rating={rating} className="text-sm mb-4" />
      <p className="text-gray-700 italic mb-6 flex-grow">"{quote}"</p>
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 ${bgColor} text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0`}
        >
          {initials}
        </div>
        <div>
          <p className="font-bold text-primary text-sm leading-tight">{name}</p>
          <p className="text-xs text-gray-400 leading-tight">{meta}</p>
          <span className="inline-block mt-1 text-xs bg-blue-50 text-secondary font-medium px-2 py-0.5 rounded-full">
            {service}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function SubsidieTestimonials() {
  return (
    <section className="py-20 bg-white w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">
            Wat onze klanten zeggen
          </h2>
          <p className="text-gray-600 text-lg mb-6">
            Al meer dan 1.400 succesvolle aanvragen ingediend.
          </p>
          {/* Rating row */}
          <div className="inline-flex items-center gap-3 bg-gray-50 px-6 py-3 rounded-full">
            <span className="text-2xl font-bold text-primary">4.8</span>
            <StarRating rating={4.8} className="text-sm" />
            <span className="text-xs text-gray-500">Klantreviews</span>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
}
