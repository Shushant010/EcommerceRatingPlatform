import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
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
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const productId = params?.id ? parseInt(params.id) : 0;

  // 1) Fetch product + stats
  const { data: product, isLoading } = useQuery<ProductWithReviews>({
    queryKey: ["product", productId],
    enabled: productId > 0,
    queryFn: async ({ queryKey }) => {
      const [, id] = queryKey as [string, number];
      const res = await fetch(`/api/products/${id}`);
      if (!res.ok) throw new Error("Failed to fetch product");
      return (await res.json()) as ProductWithReviews;
    },
  });

  // 2) Check if user has already reviewed
  const { data: hasReviewedData } = useQuery<{ hasReviewed: boolean }>({
    queryKey: ["hasReviewed", user?.id, productId],
    enabled: !!user && productId > 0,
    queryFn: async () => {
      const res = await fetch(
        `/api/reviews/check?userId=${user!.id}&productId=${productId}`
      );
      if (!res.ok) throw new Error("Failed to check review");
      return (await res.json()) as { hasReviewed: boolean };
    },
  });
  const hasReviewed = hasReviewedData?.hasReviewed || false;

  const handleWriteReview = () => {
    if (!user) setShowAuthModal(true);
    else if (!hasReviewed) setShowReviewForm(true);
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50">{/* loading skeleton */}</div>;
  }
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Button onClick={() => setLocation("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => setLocation("/")} className="mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>

        {/* Product Details */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 grid md:grid-cols-2 gap-8">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-80 object-cover rounded-lg"
            />
            <div>
              <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
              <div className="flex items-center mb-4">
                <StarRating rating={product.averageRating} size="lg" />
                <span className="ml-3 text-gray-600">
                  {(product.averageRating ?? 0).toFixed(1)} (
                  {product.reviewCount} review{product.reviewCount !== 1 ? "s" : ""}
                  )
                </span>
              </div>
              <p className="text-3xl font-bold text-primary mb-6">
                ${product.price}
              </p>
              <p className="text-gray-700 mb-6">{product.description}</p>
              <Button onClick={handleWriteReview} disabled={hasReviewed} className="w-full">
                {hasReviewed
                  ? "You've Already Reviewed This Product"
                  : "Write a Review"}
              </Button>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="p-6 border-t border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Customer Reviews</h2>
              {!hasReviewed && <Button onClick={handleWriteReview}>Add Review</Button>}
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

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </div>
  );
}
