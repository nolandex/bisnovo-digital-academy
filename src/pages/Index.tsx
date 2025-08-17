import { useState } from "react";
import { HeroSection } from "@/components/hero-section";
import { CategoryFilter } from "@/components/category-filter";
import { CourseGrid } from "@/components/course-grid";
import { BottomNavigation } from "@/components/bottom-navigation";
import { Button } from "@/components/ui/button";
import { Search, Bell, Menu } from "lucide-react";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [showAllCategories, setShowAllCategories] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-200 shadow-sm">
        <div className="px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 hidden sm:block">
                Bisnovo Learning
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hover:bg-gray-100">
              <Search className="h-5 w-5 text-gray-600" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-gray-100">
              <Bell className="h-5 w-5 text-gray-600" />
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden hover:bg-gray-100">
              <Menu className="h-5 w-5 text-gray-600" />
            </Button>
          </div>
        </div>
      </header>

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