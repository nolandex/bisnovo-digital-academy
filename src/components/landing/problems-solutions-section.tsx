import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import * as Icons from "lucide-react";

export function ProblemsSolutionsSection({ subdomain = "main" }: { subdomain?: string }) {
  const { data: problemsSolutions } = useQuery({
    queryKey: ['problems-solutions', subdomain],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('problems_solutions')
        .select('*')
        .eq('subdomain', subdomain)
        .order('order_index');
      
      if (error) throw error;
      return data;
    },
  });

  if (!problemsSolutions?.length) return null;

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Problems & Solutions</h2>
          <p className="text-xl text-muted-foreground">
            We understand your challenges and provide effective solutions
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {problemsSolutions.map((item) => {
            const IconComponent = (Icons as any)[item.icon] || Icons.AlertTriangle;
            
            return (
              <div key={item.id} className="space-y-6">
                {/* Problem */}
                <Card className="border-destructive/20 bg-destructive/5">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-destructive/10 rounded-lg">
                        <IconComponent className="h-6 w-6 text-destructive" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2 text-destructive">
                          {item.problem_title}
                        </h3>
                        {item.problem_description && (
                          <p className="text-muted-foreground">
                            {item.problem_description}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Solution */}
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icons.CheckCircle className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2 text-primary">
                          {item.solution_title}
                        </h3>
                        {item.solution_description && (
                          <p className="text-muted-foreground">
                            {item.solution_description}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}