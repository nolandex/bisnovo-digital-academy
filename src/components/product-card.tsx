import { Badge } from "@/components/ui/badge";
import { LevelBadge } from "@/components/ui/level-badge";
import { StarRating } from "@/components/ui/star-rating";
import { Users, Clock } from "lucide-react";
import { Link } from "react-router-dom";

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image_url?: string;
  is_digital?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {


  return (
    <Link to={`/products/${product.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow duration-200">
        {/* Image Section */}
        <div className="relative">
          <div className="w-full h-20 bg-gradient-to-r from-blue-400 to-blue-600">
            {product.image_url && (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          {product.is_digital && (
            <span className="absolute top-1 right-1 text-[0.5rem] px-1.5 py-0.5 rounded-full font-medium bg-blue-100 text-blue-700">
              Digital
            </span>
          )}
        </div>
        
        {/* Content Section */}
        <div className="p-2 flex flex-col flex-grow">
          <h3 className="text-xs font-semibold text-gray-800 line-clamp-2 mb-1 leading-tight">
            {product.name}
          </h3>
          <p className="text-[0.6rem] text-gray-600 mb-2 truncate">
            {product.category}
          </p>
          
          {/* Price Row */}
          <div className="flex items-center text-[0.6rem] mt-auto">
            <span className="text-gray-600 font-semibold">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }).format(product.price)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}