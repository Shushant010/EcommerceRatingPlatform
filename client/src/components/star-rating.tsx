import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  showNumber?: boolean;
}

export function StarRating({ rating, size = "md", showNumber = false }: StarRatingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5", 
    lg: "h-6 w-6",
  };

  const stars = Array.from({ length: 5 }, (_, i) => {
    const starNumber = i + 1;
    const isFilled = starNumber <= Math.floor(rating);
    const isHalfFilled = starNumber === Math.ceil(rating) && rating % 1 !== 0;

    return (
      <div key={i} className="relative">
        <Star className={`${sizeClasses[size]} text-gray-300`} />
        {(isFilled || isHalfFilled) && (
          <Star 
            className={`${sizeClasses[size]} text-secondary absolute top-0 left-0`}
            style={{
              clipPath: isHalfFilled ? 'inset(0 50% 0 0)' : 'none'
            }}
            fill="currentColor"
          />
        )}
      </div>
    );
  });

  return (
    <div className="flex items-center space-x-1">
      <div className="flex items-center">
        {stars}
      </div>
      {showNumber && (
        <span className="text-sm text-gray-600 ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
