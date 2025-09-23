import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import * as Icons from "lucide-react";

export function BenefitsSection({ subdomain = "main" }: { subdomain?: string }) {
  const { data: benefits } = useQuery({
    queryKey: ['benefits', subdomain],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('benefits')
        .select('*')
        .eq('subdomain', subdomain)
        .order('order_index');
      
      if (error) throw error;
      return data;
    },
  });

  if (!benefits?.length) return null;

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What You'll Get</h2>
          <p className="text-xl text-muted-foreground">
            Powerful benefits that transform your business
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit) => {
            const IconComponent = (Icons as any)[benefit.icon] || Icons.Check;
            
            return (
              <Card key={benefit.id} className="border-primary/20 hover:border-primary/40 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="mb-4 mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                  {benefit.description && (
                    <p className="text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}