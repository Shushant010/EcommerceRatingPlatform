import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/star-rating";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    description: string;
    price: string;
    imageUrl: string;
    averageRating: number;
    reviewCount: number;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <img 
        src={product.imageUrl} 
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h4 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h4>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-center mb-3">
          <StarRating rating={product.averageRating} />
          <span className="ml-2 text-sm text-gray-600">
            {product.averageRating.toFixed(1)} ({product.reviewCount} review{product.reviewCount !== 1 ? 's' : ''})
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-primary">${product.price}</span>
          <Link href={`/product/${product.id}`}>
            <Button>View Details</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
