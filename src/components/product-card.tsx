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
  layout?: 'grid' | 'list';
}

export function ProductCard({ product, layout = 'grid' }: ProductCardProps) {
  const formatFeatures = (featuresText?: string) => {
    if (!featuresText) return [];
    return featuresText.split('\n').filter(feature => feature.trim()).slice(0, 3);
  };

  if (layout === 'list') {
    return (
      <Link to={`/products/${product.id}`} className="block">
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
          <div className="flex">
            {/* Image Section - 30% */}
            <div className="relative w-[30%]">
              <div className="w-full h-24 bg-gradient-to-r from-blue-400 to-blue-600">
                {product.image_url && (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              {product.is_digital && (
                <span className="absolute top-1 right-1 text-[0.4rem] px-1 py-0.5 rounded-full font-medium bg-blue-100 text-blue-700">
                  Digital
                </span>
              )}
            </div>
            
            {/* Content Section - 70% */}
            <div className="flex-1 p-3">
              <div className="flex flex-col h-full">
                <h3 className="text-sm font-semibold text-gray-800 mb-1">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-600 mb-2">
                  {product.category}
                </p>
                
                {/* Description */}
                {product.description && (
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                    {product.description}
                  </p>
                )}
                
                {/* Features */}
                {product.features_text && (
                  <div className="mb-2">
                    <p className="text-xs font-medium text-gray-700 mb-1">Yang Anda Dapatkan:</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {formatFeatures(product.features_text).map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-1">✓</span>
                          <span className="line-clamp-1">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Price */}
                <div className="mt-auto">
                  <span className="text-sm font-semibold text-gray-800">
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
          </div>
        </div>
      </Link>
    );
  }

  // Grid layout (default)
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