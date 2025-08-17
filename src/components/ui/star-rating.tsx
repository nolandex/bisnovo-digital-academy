import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  className?: string;
}

export function StarRating({ rating, className }: StarRatingProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "h-4 w-4",
            star <= rating
              ? "fill-accent text-accent"
              : "fill-muted text-muted-foreground"
          )}
        />
      ))}
      <span className="ml-1 text-sm font-medium text-foreground">{rating}</span>
    </div>
  );
}