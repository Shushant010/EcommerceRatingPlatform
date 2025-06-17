import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ReviewFormProps {
  productId: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ReviewForm({ productId, onSuccess, onCancel }: ReviewFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const createReviewMutation = useMutation({
    mutationFn: async (reviewData: {
      userId: number;
      productId: number;
      rating: number;
      title: string;
      content: string;
    }) => {
      const response = await apiRequest("POST", "/api/reviews", reviewData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      queryClient.invalidateQueries({ queryKey: ["hasReviewed", user!.id, productId] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Success", description: "Review submitted successfully!" });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit review",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const trimmedContent = content.trim();
    const trimmedTitle = title.trim();
    const hasValidRating = rating >= 1 && rating <= 5;
    const hasValidContent = trimmedContent.length > 0;

    // Validation: At least rating or content must be provided
    if (!hasValidRating && !hasValidContent) {
      return toast({
        title: "Error",
        description: "Please provide either a star rating or review content.",
        variant: "destructive",
      });
    }

    // Prepare review data according to backend expectations
    const reviewData = {
      userId: user.id,
      productId,
      rating: hasValidRating ? rating : 0, // Send 0 if no rating selected
      title: trimmedTitle || " ", // Send space if empty
      content: hasValidContent ? trimmedContent : " " // Send space if empty
    };

    console.log("Submitting review data:", reviewData);
    createReviewMutation.mutate(reviewData);
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6 mb-6">
      <h3 className="font-semibold mb-4">Write Your Review</h3>
      <form onSubmit={handleSubmit}>
        {/* Rating stars */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating (optional)
          </label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="text-2xl transition-colors"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star === rating ? 0 : star)}
              >
                <Star
                  className={`h-6 w-6 ${
                    star <= (hoverRating || rating)
                      ? "fill-secondary text-secondary"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {rating} star{rating !== 1 ? 's' : ''} selected
            </p>
          )}
          {rating === 0 && (
            <p className="text-sm text-gray-500 mt-1">
              No rating selected (will be saved as 0 stars)
            </p>
          )}
        </div>

        {/* Title (optional) */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Review Title (optional)
          </label>
          <Input
            type="text"
            placeholder="Summarize your review"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Content (optional but at least rating or content required) */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Review (optional)
          </label>
          <Textarea
            rows={4}
            placeholder="Share your experience..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-1">
            * Please provide either a star rating or review content (or both)
          </p>
        </div>

        {/* Submit & Cancel */}
        <div className="flex space-x-3">
          <Button type="submit" disabled={createReviewMutation.isPending}>
            {createReviewMutation.isPending ? "Submitting..." : "Submit Review"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={createReviewMutation.isPending}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}