import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export function HeroSection({ subdomain = "main" }: { subdomain?: string }) {
  const { data: heroData } = useQuery({
    queryKey: ['landing-section', subdomain, 'hero'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('landing_sections')
        .select('*')
        .eq('subdomain', subdomain)
        .eq('section_type', 'hero')
        .eq('is_active', true)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  if (!heroData) return null;

  return (
    <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 px-4">
      <div className="container mx-auto max-w-6xl text-center">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {heroData.title}
          </h1>
          
          {heroData.subtitle && (
            <h2 className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              {heroData.subtitle}
            </h2>
          )}
          
          {heroData.description && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {heroData.description}
            </p>
          )}
          
          <div className="pt-6">
            <Button size="lg" className="text-lg px-8 py-6">
              Get Started Now
            </Button>
          </div>
        </div>
        
        {heroData.image_url && (
          <div className="mt-12">
            <img
              src={heroData.image_url}
              alt="Hero"
              className="mx-auto rounded-2xl shadow-2xl max-w-4xl w-full"
            />
          </div>
        )}
      </div>
    </section>
  );
}