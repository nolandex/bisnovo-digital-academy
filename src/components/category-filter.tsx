import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Star, MoreHorizontal, ChevronUp, ChevronDown } from "lucide-react";
import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";
import * as FiIcons from "react-icons/fi";
import * as HiIcons from "react-icons/hi";
import * as Io5Icons from "react-icons/io5";
import * as BiIcons from "react-icons/bi";

const allIcons = { ...FaIcons, ...MdIcons, ...FiIcons, ...HiIcons, ...Io5Icons, ...BiIcons } as Record<string, any>;

interface Category {
  id: string;
  name: string;
  icon?: string;
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
    const iconMap: { [key: string]: any } = {
      'Business Blueprint': FaIcons.FaBriefcase,
      'Web Development': FaIcons.FaCode,
      'Digital Marketing': MdIcons.MdTrendingUp,
      'Design Services': FaIcons.FaPalette,
      'Mobile Apps': FaIcons.FaMobile,
      'E-Commerce': FaIcons.FaShoppingCart,
      'Consulting': FaIcons.FaUserTie,
      'Content Creation': FaIcons.FaPen,
      'Social Media': FaIcons.FaShare,
      'SEO Services': FaIcons.FaSearch,
      'Photography': FaIcons.FaCamera,
      'Video Production': FaIcons.FaVideo,
      'Copywriting': FaIcons.FaFileAlt,
      'Virtual Assistant': FaIcons.FaHandshake,
      'Online Tutoring': FaIcons.FaChalkboardTeacher,
      'Delivery Services': FaIcons.FaTruck,
      'Health & Wellness': FaIcons.FaHeartbeat
    };
    return iconMap[categoryName] || Star;
  };

  const mappedCategories = useMemo(() =>
    categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      icon: getIconForCategory(cat.name),
      slug: cat.name,
    })),
    [categories]
  );

  const mainCategories = useMemo(() => {
    const primary = mappedCategories.slice(0, 3);
    return [
      { id: "all", name: "All", icon: Star, slug: "Semua" },
      ...primary,
      { id: "more", name: "Lainnya", icon: MoreHorizontal, slug: "more" },
    ];
  }, [mappedCategories]);

  const additionalCategories = useMemo(() =>
    mappedCategories.slice(3),
    [mappedCategories]
  );

  const hasMoreCategories = categories.length > 3;

  const handleCategoryClick = (slug: string) => {
    if (slug === "more") {
      onToggleCategories();
    } else {
      onCategoryChange(slug);
    }
  };

  const renderCategoryButton = (category: any) => {
    const IconComponent = category.icon;
    const isSelected = selectedCategory === category.slug;
    const isMoreButton = category.slug === "more";

    return (
      <div key={category.id || category.slug} className="flex flex-col items-center">
        <button
          onClick={() => handleCategoryClick(category.slug)}
          className={`
            w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg
            ${isSelected && !isMoreButton
              ? "bg-blue-600 text-white shadow-lg" 
              : "bg-blue-600 text-white"
            }
          `}
        >
          {isMoreButton ? (
            <div className="flex items-center">
              <MoreHorizontal className="w-5 h-5 mr-1" />
              {showAllCategories ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </div>
          ) : (
            IconComponent && <IconComponent className="w-5 h-5" />
          )}
        </button>
        <span className="mt-2 text-[0.6rem] sm:text-[0.65rem] font-medium text-center leading-tight px-1 text-gray-800">
          {category.name}
        </span>
      </div>
    );
  };

  return (
    <section className="py-4 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Main Categories Row */}
        <div className="grid grid-cols-5 gap-2 mb-4">
          {mainCategories.map(renderCategoryButton)}
        </div>

        {/* Additional Categories (shown when "Lainnya" is clicked) */}
        {showAllCategories && hasMoreCategories && (
          <div className="grid grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-100">
            {additionalCategories.map(renderCategoryButton)}
          </div>
        )}
      </div>
    </section>
  );
}