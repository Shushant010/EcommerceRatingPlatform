import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/star-rating";
import { ReviewForm } from "@/components/review-form";
import { ReviewList } from "@/components/review-list";
import { AuthModal } from "@/components/auth-modal";
import { useAuth } from "@/lib/auth";
import { ArrowLeft } from "lucide-react";
import type { ProductWithReviews } from "@shared/schema";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const { user } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const productId = params?.id ? parseInt(params.id) : 0;

  const { data: product, isLoading } = useQuery<ProductWithReviews>({
    queryKey: ["/api/products", productId],
    enabled: productId > 0,
  });

  const { data: hasReviewedData } = useQuery<{ hasReviewed: boolean }>({
    queryKey: ["/api/reviews/check", user?.id, productId],
    enabled: !!user && productId > 0,
  });

  const hasReviewed = hasReviewedData?.hasReviewed || false;

  const handleWriteReview = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    if (hasReviewed) {
      return;
    }
    
    setShowReviewForm(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-32 mb-8"></div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="w-full h-80 bg-gray-300 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                <div className="h-20 bg-gray-300 rounded"></div>
                <div className="h-12 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <Button onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-80 object-cover rounded-lg"
                />
              </div>
              
              <div>
                <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
                <div className="flex items-center mb-4">
                  <StarRating rating={product.averageRating} size="lg" />
                  <span className="ml-3 text-gray-600">
                    {product.averageRating.toFixed(1)} ({product.reviewCount} review{product.reviewCount !== 1 ? 's' : ''})
                  </span>
                </div>
                <p className="text-3xl font-bold text-primary mb-6">${product.price}</p>
                <p className="text-gray-700 mb-6">{product.description}</p>
                
                <div className="space-y-4">
                  <Button
                    onClick={handleWriteReview}
                    className="w-full"
                    disabled={hasReviewed}
                  >
                    {hasReviewed ? "You've Already Reviewed This Product" : "Write a Review"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Customer Reviews</h2>
                {!hasReviewed && (
                  <Button
                    onClick={handleWriteReview}
                    className="bg-accent hover:bg-green-600"
                  >
                    Add Review
                  </Button>
                )}
              </div>

              {showReviewForm && user && (
                <ReviewForm
                  productId={product.id}
                  onSuccess={() => setShowReviewForm(false)}
                  onCancel={() => setShowReviewForm(false)}
                />
              )}

              <ReviewList reviews={product.reviews} />
            </div>
          </div>
        </div>
      </div>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </div>
  );
}
