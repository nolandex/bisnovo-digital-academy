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
  qris_image_url?: string;
  is_digital?: boolean;
  created_at?: string;
  updated_at?: string;
  features_text?: string;
  how_it_works_text?: string;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {


  return (
    <Link to={`/products/${product.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
        {/* Image Section */}
        <div className="relative">
          <div className="w-full h-32 bg-gradient-to-r from-blue-400 to-blue-600 overflow-hidden">
            {product.image_url && (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          {product.is_digital && (
            <span className="absolute top-2 right-2 text-xs px-2 py-1 rounded-full font-medium bg-blue-100 text-blue-700">
              Digital
            </span>
          )}
        </div>
        
        {/* Content Section */}
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-2 line-clamp-2">
            {product.name}
          </h3>
          
          {/* Features */}
          {product.features_text && (
            <div>
              <h4 className="text-xs font-medium text-gray-700 mb-1">Yang Anda Dapatkan:</h4>
              <div className="text-xs text-gray-600 space-y-1">
                {product.features_text.split('\n').filter(feature => feature.trim()).map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <span className="mr-1">•</span>
                    <span>{feature.trim()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}