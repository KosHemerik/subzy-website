import { StarRating } from "@/components/ui";

/**
 * A single Google review. Google's terms require showing the author's name/photo,
 * linking to their profile and attributing the review to Google.
 */
export default function GoogleReviewCard({ review, className = "" }) {
  const { rating, text, authorName, authorUrl, authorPhotoUrl, relativeTime, reviewUrl } = review;
  const AuthorTag = authorUrl ? "a" : "span";

  return (
    <div className={`p-8 rounded-[12px] border flex flex-col h-full ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <StarRating rating={rating} className="text-sm" />
        <i className="fa-brands fa-google text-gray-400" aria-label="Review via Google" />
      </div>
      <p className="text-gray-700 italic mb-6 flex-grow line-clamp-6">"{text}"</p>
      <div className="flex items-center gap-3">
        {authorPhotoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- Google profile photos, not optimisable
          <img
            src={authorPhotoUrl}
            alt=""
            width={40}
            height={40}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-10 h-10 rounded-full flex-shrink-0"
          />
        ) : (
          <div className="w-10 h-10 bg-secondary text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0" aria-hidden="true">
            {authorName.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <AuthorTag
            {...(authorUrl ? { href: authorUrl, target: "_blank", rel: "noopener noreferrer" } : {})}
            className="font-bold text-primary text-sm leading-tight hover:underline"
          >
            {authorName}
          </AuthorTag>
          {relativeTime && (
            <p className="text-xs text-gray-400 leading-tight">
              {reviewUrl ? (
                <a href={reviewUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {relativeTime} op Google
                </a>
              ) : (
                `${relativeTime} op Google`
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
