import { useState } from "react";
import { HeroSection } from "@/components/hero-section";
import { CategoryFilter } from "@/components/category-filter";
import { ProductGrid } from "@/components/product-grid";
import { BottomNavigation } from "@/components/bottom-navigation";
import { Footer } from "@/components/footer";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [showAllCategories, setShowAllCategories] = useState(false);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <main className="pb-8">
        
        {/* Category Filter */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          showAllCategories={showAllCategories}
          onToggleCategories={() => setShowAllCategories(!showAllCategories)}
        />

        {/* Product Grid */}
        <ProductGrid selectedCategory={selectedCategory} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Bottom Navigation (Mobile Only) */}
      <BottomNavigation />
    </div>
  );
};

export default Index;