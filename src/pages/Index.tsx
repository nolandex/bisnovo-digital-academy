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
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-bisnovo-primary to-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <h1 className="text-xl font-bold text-foreground hidden sm:block">
                Bisnovo Learning
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hover:bg-bisnovo-secondary">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-bisnovo-secondary">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden hover:bg-bisnovo-secondary">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Category Filter */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">
              Jelajahi Course
            </h2>
            <div className="text-sm text-muted-foreground">
              18+ course tersedia
            </div>
          </div>
          
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            showAllCategories={showAllCategories}
            onToggleCategories={() => setShowAllCategories(!showAllCategories)}
          />
        </div>

        {/* Course Grid */}
        <CourseGrid selectedCategory={selectedCategory} />
      </main>

      {/* Bottom Navigation (Mobile Only) */}
      <BottomNavigation />
    </div>
  );
};

export default Index;