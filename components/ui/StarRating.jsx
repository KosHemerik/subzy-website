"use client";

import { useGoogleRating } from "@/components/providers/GoogleRatingProvider";

/**
 * Star Rating display component (defaults to the live Google rating)
 */
export default function StarRating({ rating: ratingProp, showValue = false, className = "" }) {
  const { rating: googleRating } = useGoogleRating();
  const rating = ratingProp ?? googleRating;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className={`flex items-center ${className}`}>
      {showValue && (
        <span className="text-white mr-2 font-medium">{rating}/5</span>
      )}
      <div className="flex text-yellow-400">
        {[...Array(fullStars)].map((_, i) => (
          <i key={i} className="fa-solid fa-star" />
        ))}
        {hasHalfStar && <i className="fa-solid fa-star-half-stroke" />}
        {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
          <i key={`empty-${i}`} className="fa-regular fa-star" />
        ))}
      </div>
    </div>
  );
}
