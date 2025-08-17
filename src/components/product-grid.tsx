import { useEffect, useState, useMemo } from "react";
import { ProductCard, Product } from "@/components/product-card";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen } from "lucide-react";

interface ProductGridProps {
  selectedCategory: string;
}

export function ProductGrid({ selectedCategory }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'Semua') return products;
    
    if (selectedCategory === 'Populer') {
      return [...products]
        .sort((a, b) => b.customers - a.customers);
    }
    
    return products.filter(product => product.category === selectedCategory);
  }, [products, selectedCategory]);

  if (loading) {
    return (
      <div className="px-4">
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-card rounded-lg shadow-card overflow-hidden border border-border/50">
              <div className="h-24 skeleton" />
              <div className="p-3 space-y-2">
                <div className="h-4 skeleton w-3/4" />
                <div className="h-3 skeleton w-1/2" />
                <div className="flex justify-between pt-1">
                  <div className="h-3 skeleton w-1/4" />
                  <div className="h-3 skeleton w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-16 px-4 animate-fade-in">
        <div className="text-4xl mb-4">🛍️</div>
        <p className="text-muted-foreground text-small">
          Tidak ada produk untuk kategori "{selectedCategory}"
        </p>
      </div>
    );
  }

  return (
    <section className="px-4 pb-20">
      <div className="grid grid-cols-2 gap-4">
        {filteredProducts.map((product, index) => (
          <div
            key={product.id}
            style={{ animationDelay: `${0.1 * index}s` }}
            className="animate-scale-in"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}