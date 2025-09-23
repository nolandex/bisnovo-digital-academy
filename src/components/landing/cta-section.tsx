import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export function CtaSection({ subdomain = "main" }: { subdomain?: string }) {
  const { data: ctaData } = useQuery({
    queryKey: ['landing-section', subdomain, 'cta'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('landing_sections')
        .select('*')
        .eq('subdomain', subdomain)
        .eq('section_type', 'cta')
        .eq('is_active', true)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  if (!ctaData) return null;

  return (
    <section className="py-20 px-4 bg-gradient-to-r from-primary to-secondary">
      <div className="container mx-auto max-w-4xl text-center">
        <div className="text-white space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            {ctaData.title}
          </h2>
          
          {ctaData.description && (
            <p className="text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
              {ctaData.description}
            </p>
          )}
          
          <div className="pt-4">
            <Button 
              size="lg" 
              variant="secondary"
              className="text-lg px-8 py-6"
              onClick={() => ctaData.link_url && document.querySelector(ctaData.link_url)?.scrollIntoView({ behavior: 'smooth' })}
            >
              Get Started Today
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}