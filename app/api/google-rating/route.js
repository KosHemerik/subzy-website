import { NextResponse } from "next/server";
import { getGoogleRating } from "@/lib/googleRating";

const CACHE_CONTROL = "public, s-maxage=21600, stale-while-revalidate=43200";

export async function GET() {
  const payload = await getGoogleRating();

  return NextResponse.json(payload, {
    headers: { "Cache-Control": CACHE_CONTROL },
  });
}
