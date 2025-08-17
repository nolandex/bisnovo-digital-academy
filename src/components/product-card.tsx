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
  level: string;
  rating: number;
  customers: number;
  price: number;
  image_url?: string;
  details?: number;
  features?: number;
  stock?: number;
  is_digital?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const formatCustomers = (customers: number) => {
    if (customers >= 1000) {
      return `${(customers / 1000).toFixed(1)}k`;
    }
    return customers.toString();
  };

  const formatStock = (stock: number) => {
    if (stock > 99) return "99+";
    return stock.toString();
  };

  const getLevelBadgeStyle = (level: string) => {
    switch (level) {
      case 'Easy':
        return 'bg-green-100 text-green-700';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'Hard':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

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
          <span className={`absolute top-1 right-1 text-[0.5rem] px-1.5 py-0.5 rounded-full font-medium ${getLevelBadgeStyle(product.level)}`}>
            {product.level}
          </span>
        </div>
        
        {/* Content Section */}
        <div className="p-2 flex flex-col flex-grow">
          <h3 className="text-xs font-semibold text-gray-800 line-clamp-2 mb-1 leading-tight">
            {product.name}
          </h3>
          <p className="text-[0.6rem] text-gray-600 mb-2 truncate">
            {product.is_digital ? 'Digital' : 'Physical'} Product
          </p>
          
          {/* Metadata Row */}
          <div className="flex items-center gap-1 text-[0.6rem] mt-auto">
            <div className="flex items-center gap-0.5">
              <span className="text-yellow-500">★</span>
              <span className="text-gray-600">{product.rating}</span>
            </div>
            <span className="text-gray-400">•</span>
            <div className="flex items-center gap-0.5">
              <span className="text-gray-600">{formatCustomers(product.customers)}</span>
            </div>
            <span className="text-gray-400">•</span>
            <div className="flex items-center gap-0.5">
              <span className="text-gray-600">Stok: {formatStock(product.stock || 100)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}