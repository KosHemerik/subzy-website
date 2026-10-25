import { StarRating, RatingValue } from "@/components/ui";
import GoogleReviewCard from "@/components/sections/GoogleReviewCard";
import { getGoogleRating, getGoogleReviews } from "@/lib/googleRating";

const testimonials = [
  {
    rating: 5,
    text: "Binnen een week was alles geregeld. Ik had geen idee dat ik recht had op teruggave, maar Subzy heeft €850 voor me teruggevraagd. Top service!",
    name: "Martijn de Boer",
    service: "Teruggave Energiebelasting",
    initial: "M",
    bgColor: "bg-secondary",
  },
  {
    rating: 5,
    text: "Het portaal werkt super makkelijk. Even wat foto's uploaden van de facturen en zij doen de rest. Zeker een aanrader voor ISDE subsidie.",
    name: "Sanne Visser",
    service: "ISDE Subsidie",
    initial: "S",
    bgColor: "bg-primary",
  },
  {
    rating: 5,
    text: "Fijn contact gehad met de klantenservice toen ik een vraag had over mijn documenten. Zeer professioneel en snel geholpen.",
    name: "Peter Jansen",
    service: "Teruggave Energiebelasting",
    initial: "P",
    bgColor: "bg-accent",
  },
];

function TestimonialCard({ rating, text, name, service, initial, bgColor }) {
  return (
    <div className="bg-surface p-8 rounded-[12px] border border-surface">
      <StarRating rating={rating} className="text-sm mb-4" />
      <p className="text-gray-700 italic mb-6">"{text}"</p>
      <div className="flex items-center">
        <div className={`w-10 h-10 ${bgColor} text-white rounded-full flex items-center justify-center font-bold mr-3`} aria-hidden="true">
          {initial}
        </div>
        <div>
          <p className="font-bold text-primary text-sm">{name}</p>
          <span className="text-xs text-gray-500">{service}</span>
        </div>
      </div>
    </div>
  );
}

export default async function Testimonials() {
  // Real Google reviews when available (need a full row of 3), otherwise the static fallback.
  const [googleReviews, { mapsUrl }] = await Promise.all([getGoogleReviews({ limit: 3 }), getGoogleRating()]);
  const reviews = googleReviews.length >= 3 ? googleReviews : [];

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-reveal flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-bold text-primary mb-4">
              Wat onze klanten zeggen
            </h2>
            <p className="text-gray-600 text-lg">
              Al 3.200+ huiseigenaren en verhuurders gingen u voor.
            </p>
          </div>
          <div className="mt-6 md:mt-0 flex items-center bg-gray-50 px-6 py-3 rounded-[12px]">
            <span className="text-3xl font-bold text-primary mr-3"><RatingValue /></span>
            <div>
              <StarRating className="text-sm mb-1" />
              <span className="text-xs text-gray-500">Klantreviews</span>
            </div>
          </div>
        </div>
        <div className="animate-reveal-grid grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.length > 0
            ? reviews.map((review) => (
                <GoogleReviewCard key={review.id} review={review} className="bg-surface border-surface" />
              ))
            : testimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.name} {...testimonial} />
              ))}
        </div>
        {reviews.length > 0 && (
          <div className="text-center mt-8">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-secondary hover:underline"
            >
              Bekijk alle reviews op Google <i className="fa-solid fa-arrow-right ml-1" aria-hidden="true" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
