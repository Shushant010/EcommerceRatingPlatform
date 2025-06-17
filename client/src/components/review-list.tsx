import { StarRating } from "@/components/star-rating";
import { formatDistanceToNow } from "date-fns";
import type { ReviewWithUser } from "@shared/schema";

interface ReviewListProps {
  reviews: ReviewWithUser[];
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
      </div>
    );
  }

  return (
   <div className="space-y-6">
  {reviews.map((review) => (
    <div
      key={review.id}
      className="border-b border-gray-200 pb-6 last:border-b-0"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
            {review.user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h6 className="font-medium">{review.user.username}</h6>
            <div className="flex items-center space-x-2">
              {/* only show stars if rating is set */}
              {review.rating != null && (
                <StarRating rating={review.rating} size="sm" />
              )}
              <span className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(review.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* only show title/content if they exist */}
      {(review.title || review.content) && (
        <div className="mt-4">
          {review.title && (
            <h6 className="font-medium mb-2">{review.title}</h6>
          )}
          {review.content && (
            <p className="text-gray-700">{review.content}</p>
          )}
        </div>
      )}
    </div>
  ))}
</div>

  );
}
