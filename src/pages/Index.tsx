import { useState } from "react";
import { HeroSection } from "@/components/hero-section";
import { CategoryFilter } from "@/components/category-filter";
import { CourseGrid } from "@/components/course-grid";
import { BottomNavigation } from "@/components/bottom-navigation";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [showAllCategories, setShowAllCategories] = useState(false);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <main className="pb-8">
        {/* Section Header */}
        <div className="px-4 py-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-title font-heading font-bold text-foreground">
              Jelajahi Course
            </h2>
            <div className="text-tiny text-muted-foreground font-medium bg-muted/50 px-3 py-1 rounded-full">
              18+ course tersedia
            </div>
          </div>
        </div>
        
        {/* Category Filter */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          showAllCategories={showAllCategories}
          onToggleCategories={() => setShowAllCategories(!showAllCategories)}
        />

        {/* Course Grid */}
        <CourseGrid selectedCategory={selectedCategory} />
      </main>

      {/* Bottom Navigation (Mobile Only) */}
      <BottomNavigation />
    </div>
  );
};

export default Index;