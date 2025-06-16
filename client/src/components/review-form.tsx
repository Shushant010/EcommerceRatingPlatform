import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "@/components/star-rating";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Star } from "lucide-react";

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
      queryClient.invalidateQueries({ queryKey: ["/api/products", productId] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: [`/api/reviews/check?userId=${user?.id}&productId=${productId}`] });
      toast({
        title: "Success",
        description: "Review submitted successfully!",
      });
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
    if (rating === 0) {
      toast({
        title: "Error", 
        description: "Please select a rating",
        variant: "destructive",
      });
      return;
    }
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    createReviewMutation.mutate({
      userId: user.id,
      productId,
      rating,
      title: title.trim(),
      content: content.trim(),
    });
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6 mb-6">
      <h3 className="font-semibold mb-4">Write Your Review</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="text-2xl transition-colors"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
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
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Review Title</label>
          <Input
            type="text"
            placeholder="Summarize your review in one line"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
          <Textarea
            rows={4}
            placeholder="Share your experience with this product..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            minLength={10}
          />
        </div>
        
        <div className="flex space-x-3">
          <Button 
            type="submit" 
            disabled={createReviewMutation.isPending}
          >
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
