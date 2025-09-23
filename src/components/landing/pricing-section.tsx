import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

export function PricingSection({ subdomain = "main" }: { subdomain?: string }) {
  const { data: pricingPlans } = useQuery({
    queryKey: ['pricing-plans', subdomain],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pricing_plans')
        .select('*')
        .eq('subdomain', subdomain)
        .order('order_index');
      
      if (error) throw error;
      return data;
    },
  });

  if (!pricingPlans?.length) return null;

  return (
    <section className="py-20 px-4" id="pricing">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Plan</h2>
          <p className="text-xl text-muted-foreground">
            Simple, transparent pricing for everyone
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pricingPlans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative ${
                plan.is_popular 
                  ? 'border-primary shadow-xl scale-105' 
                  : 'border-border'
              }`}
            >
              {plan.is_popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                {plan.description && (
                  <p className="text-muted-foreground">{plan.description}</p>
                )}
                
                <div className="mt-4">
                  <span className="text-4xl font-bold">
                    {plan.currency === 'IDR' ? 'Rp' : '$'}
                    {Number(plan.price).toLocaleString()}
                  </span>
                  <span className="text-muted-foreground">
                    /{plan.billing_period}
                  </span>
                </div>
              </CardHeader>
              
              <CardContent>
                {plan.features && (
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
                
                <Button 
                  className="w-full" 
                  variant={plan.is_popular ? "default" : "outline"}
                  onClick={() => plan.cta_link && window.open(plan.cta_link, '_blank')}
                >
                  {plan.cta_text}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}