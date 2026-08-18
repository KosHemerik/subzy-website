import { NextResponse } from "next/server";
import { COMPANY_INFO } from "@/lib/constants";

const GOOGLE_PLACE_DETAILS_URL = "https://maps.googleapis.com/maps/api/place/details/json";
const CACHE_CONTROL = "public, s-maxage=21600, stale-while-revalidate=43200";

function fallbackPayload(reason) {
  return {
    rating: COMPANY_INFO.rating,
    totalReviews: null,
    mapsUrl: COMPANY_INFO.googleReviews.href,
    source: "fallback",
    reason,
  };
}

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return NextResponse.json(fallbackPayload("missing_google_places_config"), {
      headers: { "Cache-Control": CACHE_CONTROL },
    });
  }

  const url = new URL(GOOGLE_PLACE_DETAILS_URL);
  url.searchParams.set("place_id", placeId);
  url.searchParams.set("fields", "rating,user_ratings_total,url");
  url.searchParams.set("key", apiKey);

  try {
    const response = await fetch(url.toString(), {
      next: { revalidate: 21600 },
    });

    if (!response.ok) {
      return NextResponse.json(fallbackPayload("google_places_http_error"), {
        headers: { "Cache-Control": CACHE_CONTROL },
      });
    }

    const data = await response.json();
    const ratingValue = Number(data?.result?.rating);
    const totalReviews = Number(data?.result?.user_ratings_total);
    const mapsUrl = data?.result?.url;

    if (!Number.isFinite(ratingValue)) {
      return NextResponse.json(fallbackPayload("invalid_google_places_payload"), {
        headers: { "Cache-Control": CACHE_CONTROL },
      });
    }

    return NextResponse.json(
      {
        rating: Math.round(ratingValue * 10) / 10,
        totalReviews: Number.isFinite(totalReviews) ? totalReviews : null,
        mapsUrl: typeof mapsUrl === "string" && mapsUrl.length > 0 ? mapsUrl : COMPANY_INFO.googleReviews.href,
        source: "google_places",
      },
      {
        headers: { "Cache-Control": CACHE_CONTROL },
      }
    );
  } catch {
    return NextResponse.json(fallbackPayload("google_places_fetch_failed"), {
      headers: { "Cache-Control": CACHE_CONTROL },
    });
  }
}