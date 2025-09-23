import { useState } from "react";
import { HeroSection } from "@/components/landing/hero-section";
import { ProblemsSolutionsSection } from "@/components/landing/problems-solutions-section";
import { BenefitsSection } from "@/components/landing/benefits-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { CategoryFilter } from "@/components/category-filter";
import { ProductGrid } from "@/components/product-grid";
import { PricingSection } from "@/components/landing/pricing-section";
import { FaqSection } from "@/components/landing/faq-section";
import { CtaSection } from "@/components/landing/cta-section";
import { BottomNavigation } from "@/components/bottom-navigation";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [showAllCategories, setShowAllCategories] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection />

      {/* Problems & Solutions */}
      <ProblemsSolutionsSection />

      {/* Benefits */}
      <BenefitsSection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Products Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Products & Projects</h2>
            <p className="text-xl text-muted-foreground">
              Discover our range of solutions
            </p>
          </div>
          
          {/* Category Filter */}
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            showAllCategories={showAllCategories}
            onToggleCategories={() => setShowAllCategories(!showAllCategories)}
          />

          {/* Product Grid */}
          <ProductGrid selectedCategory={selectedCategory} />
        </div>
      </section>

      {/* Pricing */}
      <PricingSection />

      {/* FAQ */}
      <FaqSection />

      {/* CTA */}
      <CtaSection />

      {/* Bottom Navigation (Mobile Only) */}
      <BottomNavigation />
    </div>
  );
};

export default Index;