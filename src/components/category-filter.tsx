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
    <div className="py-5 animate-slide-up" style={{ animationDelay: '0.2s' }}>
      <div className="flex overflow-x-auto gap-3 px-4 scrollbar-hide scroll-smooth-horizontal">
        {allCategories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`
              flex-shrink-0 px-5 py-2.5 rounded-full text-small font-medium 
              transition-all duration-300 ease-out filter-pill btn-press
              min-h-[44px] flex items-center justify-center
              ${selectedCategory === category
                ? 'bg-primary text-primary-foreground shadow-md ring-2 ring-primary/20 scale-105'
                : 'bg-secondary text-secondary-foreground hover:bg-muted hover:shadow-sm'
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