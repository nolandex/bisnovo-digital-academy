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

  const getIconForCategory = (categoryName: string) => {
    const iconMap: { [key: string]: string } = {
      'Populer': '🔥',
      'Web Development': '💻',
      'Digital Marketing': '📈',
      'Design Services': '🎨',
      'Mobile Apps': '📱',
      'E-Commerce': '🛒',
      'Consulting': '💼',
      'Content Creation': '✍️',
      'Social Media': '📲',
      'SEO Services': '🔍',
      'Photography': '📸',
      'Video Production': '🎥',
      'Copywriting': '📝',
      'Virtual Assistant': '🤝',
      'Online Tutoring': '👨‍🏫',
      'Delivery Services': '🚚',
      'Health & Wellness': '🏥'
    };
    return iconMap[categoryName] || '📚';
  };

  const mainCategories = [
    ...categories.slice(0, 5).map(cat => ({ 
      name: cat.name, 
      icon: getIconForCategory(cat.name) 
    }))
  ];

  return (
    <section className="py-4 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-start pb-2 w-full">
          {/* 5 kategori utama dalam 1 baris */}
          {mainCategories.map((category) => (
            <button 
              key={category.name}
              onClick={() => onCategoryChange(category.name)}
              className="flex flex-col items-center justify-start flex-1"
            >
              <div className={`
                flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-md transition-all duration-200
                ${selectedCategory === category.name 
                  ? 'bg-primary text-white shadow-lg' 
                  : 'bg-white text-gray-800'
                }
              `}>
                <span className="text-lg">{category.icon}</span>
              </div>
              <span className={`
                mt-2 text-[0.6rem] sm:text-[0.65rem] font-medium text-center leading-tight px-1
                ${selectedCategory === category.name ? 'text-primary' : 'text-gray-800'}
              `}>
                {category.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}