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
        <div className="flex p-4 gap-4">
          {/* Image Section */}
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg overflow-hidden">
              {product.image_url && (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            {product.is_digital && (
              <span className="absolute -top-1 -right-1 text-xs px-2 py-1 rounded-full font-medium bg-blue-100 text-blue-700">
                Digital
              </span>
            )}
          </div>
          
          {/* Content Section */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {product.description}
              </p>
              
              {/* Features */}
              {product.features_text && (
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Yang Anda Dapatkan:</h4>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {product.features_text}
                  </p>
                </div>
              )}
            </div>
            
            {/* Price */}
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-primary">
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }).format(product.price)}
              </span>
              <span className="text-sm text-gray-500">{product.category}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}