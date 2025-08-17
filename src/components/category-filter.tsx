import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Category {
  id: string;
  name: string;
}

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  showAllCategories: boolean;
  onToggleCategories: () => void;
}

export function CategoryFilter({ 
  selectedCategory, 
  onCategoryChange, 
  showAllCategories, 
  onToggleCategories 
}: CategoryFilterProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, name')
          .order('name');

        if (error) throw error;
        setCategories(data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const defaultCategories = ['Semua', 'Populer'];
  const allCategories = [...defaultCategories, ...categories.map(cat => cat.name)];

  return (
    <div className="py-4">
      <div className="flex overflow-x-auto gap-2 px-4 scrollbar-hide">
        {allCategories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`
              flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
              ${selectedCategory === category
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }
            `}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}