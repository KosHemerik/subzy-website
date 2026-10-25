"use client";

import { createContext, useContext } from "react";
import { COMPANY_INFO } from "@/lib/constants";

const GoogleRatingContext = createContext({
  rating: COMPANY_INFO.rating,
  totalReviews: null,
  mapsUrl: COMPANY_INFO.googleReviews.href,
});

/**
 * Makes the server-fetched Google rating available to client components.
 */
export default function GoogleRatingProvider({ value, children }) {
  return <GoogleRatingContext.Provider value={value}>{children}</GoogleRatingContext.Provider>;
}

export function useGoogleRating() {
  return useContext(GoogleRatingContext);
}
