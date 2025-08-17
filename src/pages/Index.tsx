import { useState } from "react";
import { HeroSection } from "@/components/hero-section";
import { CategoryFilter } from "@/components/category-filter";
import { CourseGrid } from "@/components/course-grid";
import { BottomNavigation } from "@/components/bottom-navigation";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [showAllCategories, setShowAllCategories] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">

      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <main className="pb-8">
        {/* Section Header */}
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Jelajahi Course
            </h2>
            <div className="text-sm text-gray-600">
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