import { cache } from "react";
import { COMPANY_INFO } from "@/lib/constants";

const GOOGLE_PLACE_DETAILS_URL = "https://places.googleapis.com/v1/places";
export const GOOGLE_RATING_REVALIDATE_SECONDS = 21600;

function fallbackRating(reason) {
  return {
    rating: COMPANY_INFO.rating,
    totalReviews: null,
    mapsUrl: COMPANY_INFO.googleReviews.href,
    source: "fallback",
    reason,
  };
}

/**
 * Server-only: fetches the Subzy place details (rating + reviews) once per request,
 * cached for 6 hours via Next's data cache. Returns null when Google is unavailable.
 */
const fetchPlaceDetails = cache(async () => {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return { error: "missing_google_places_config" };
  }

  try {
    const response = await fetch(`${GOOGLE_PLACE_DETAILS_URL}/${encodeURIComponent(placeId)}?languageCode=nl`, {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri,reviews",
      },
      next: { revalidate: GOOGLE_RATING_REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      return { error: "google_places_http_error" };
    }

    return { data: await response.json() };
  } catch {
    return { error: "google_places_fetch_failed" };
  }
});

/**
 * Server-only: the live Google rating, falling back to the static company rating
 * when Google is unavailable.
 */
export const getGoogleRating = cache(async () => {
  const { data, error } = await fetchPlaceDetails();

  if (error) {
    return fallbackRating(error);
  }

  const ratingValue = Number(data?.rating);
  const totalReviews = Number(data?.userRatingCount);
  const mapsUrl = data?.googleMapsUri;

  if (!Number.isFinite(ratingValue)) {
    return fallbackRating("invalid_google_places_payload");
  }

  return {
    rating: Math.round(ratingValue * 10) / 10,
    totalReviews: Number.isFinite(totalReviews) ? totalReviews : null,
    mapsUrl: typeof mapsUrl === "string" && mapsUrl.length > 0 ? mapsUrl : COMPANY_INFO.googleReviews.href,
    source: "google_places",
  };
});

/**
 * Server-only: up to `limit` Google reviews with text and at least `minRating` stars.
 * Google returns at most 5 reviews (its own "most relevant" selection).
 * Returns an empty array when Google is unavailable.
 */
export async function getGoogleReviews({ limit = 3, minRating = 4 } = {}) {
  const { data } = await fetchPlaceDetails();
  const reviews = Array.isArray(data?.reviews) ? data.reviews : [];

  return reviews
    .map((review) => {
      // Prefer the original text when it's already Dutch, otherwise Google's translation.
      const original = review?.originalText;
      const text = original?.languageCode === "nl" ? original.text : review?.text?.text ?? original?.text;

      return {
        id: review?.name ?? review?.publishTime,
        rating: Number(review?.rating),
        text: typeof text === "string" ? text.trim() : "",
        authorName: review?.authorAttribution?.displayName ?? "Google gebruiker",
        authorUrl: review?.authorAttribution?.uri ?? null,
        authorPhotoUrl: review?.authorAttribution?.photoUri ?? null,
        relativeTime: review?.relativePublishTimeDescription ?? null,
        reviewUrl: review?.googleMapsUri ?? null,
      };
    })
    .filter((review) => review.text.length > 0 && review.rating >= minRating)
    .slice(0, limit);
}

/**
 * schema.org AggregateRating for JSON-LD blocks.
 */
export function toAggregateRatingSchema({ rating, totalReviews }) {
  return {
    "@type": "AggregateRating",
    ratingValue: String(rating),
    bestRating: "5",
    ...(totalReviews ? { reviewCount: String(totalReviews) } : {}),
  };
}
