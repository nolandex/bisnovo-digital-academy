import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const mainCategories = [
  'Semua',
  'Populer',
  'Web Development',
  'Digital Marketing',
  'Design Services',
  'Lainnya'
];

const additionalCategories = [
  'Mobile Apps',
  'E-Commerce',
  'Consulting',
  'Content Creation',
  'Social Media',
  'SEO Services',
  'Photography',
  'Video Production',
  'Copywriting',
  'Virtual Assistant',
  'Online Tutoring',
  'Delivery Services',
  'Health & Wellness',
  'Food & Beverage',
  'Fitness Coaching'
];

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  showAllCategories?: boolean;
  onToggleCategories?: () => void;
}

export function CategoryFilter({ 
  selectedCategory, 
  onCategoryChange, 
  showAllCategories = false,
  onToggleCategories 
}: CategoryFilterProps) {
  const categories = showAllCategories 
    ? [...mainCategories.slice(0, -1), ...additionalCategories]
    : mainCategories;

  return (
    <div className="space-y-4">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-2 p-1">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => {
                if (category === 'Lainnya' && onToggleCategories) {
                  onToggleCategories();
                } else {
                  onCategoryChange(category);
                }
              }}
              className={cn(
                "whitespace-nowrap transition-all duration-200",
                selectedCategory === category
                  ? "bg-bisnovo-primary hover:bg-bisnovo-primary/90 text-bisnovo-primary-foreground shadow-md"
                  : "hover:bg-bisnovo-secondary hover:text-bisnovo-secondary-foreground"
              )}
            >
              {category}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      
      {showAllCategories && (
        <div className="text-center">
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleCategories}
            className="hover:bg-bisnovo-secondary"
          >
            Tampilkan Kategori Utama
          </Button>
        </div>
      )}
    </div>
  );
}