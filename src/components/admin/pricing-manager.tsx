import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit, Plus } from "lucide-react";

export function PricingManager() {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    currency: 'IDR',
    billing_period: 'month',
    description: '',
    is_popular: false,
    features: [] as string[],
    cta_text: 'Get Started',
    cta_link: '',
    subdomain: 'main',
    order_index: 0,
  });
  const [featureInput, setFeatureInput] = useState('');

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pricingPlans, isLoading } = useQuery({
    queryKey: ['pricing-plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pricing_plans')
        .select('*')
        .order('order_index');
      
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from('pricing_plans')
        .insert([{
          ...data,
          price: parseFloat(data.price),
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricing-plans'] });
      setIsCreating(false);
      resetForm();
      toast({ title: "Pricing plan created successfully" });
    },
    onError: () => {
      toast({ title: "Error creating pricing plan", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { error } = await supabase
        .from('pricing_plans')
        .update({
          ...data,
          price: parseFloat(data.price),
        })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricing-plans'] });
      setIsEditing(null);
      resetForm();
      toast({ title: "Pricing plan updated successfully" });
    },
    onError: () => {
      toast({ title: "Error updating pricing plan", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('pricing_plans')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricing-plans'] });
      toast({ title: "Pricing plan deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error deleting pricing plan", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      currency: 'IDR',
      billing_period: 'month',
      description: '',
      is_popular: false,
      features: [],
      cta_text: 'Get Started',
      cta_link: '',
      subdomain: 'main',
      order_index: 0,
    });
    setFeatureInput('');
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData(prev => ({ 
        ...prev, 
        features: [...prev.features, featureInput.trim()] 
      }));
      setFeatureInput('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({ 
      ...prev, 
      features: prev.features.filter((_, i) => i !== index) 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isCreating) {
      createMutation.mutate(formData);
    } else if (isEditing) {
      updateMutation.mutate({ id: isEditing, data: formData });
    }
  };

  const startEdit = (plan: any) => {
    setFormData({
      name: plan.name,
      price: plan.price?.toString() || '',
      currency: plan.currency,
      billing_period: plan.billing_period,
      description: plan.description || '',
      is_popular: plan.is_popular,
      features: plan.features || [],
      cta_text: plan.cta_text,
      cta_link: plan.cta_link || '',
      subdomain: plan.subdomain,
      order_index: plan.order_index,
    });
    setIsEditing(plan.id);
    setIsCreating(false);
  };

  const startCreate = () => {
    resetForm();
    setIsCreating(true);
    setIsEditing(null);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Pricing Plans Management</h3>
        <Button onClick={startCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Pricing Plan
        </Button>
      </div>

      {(isCreating || isEditing) && (
        <Card>
          <CardHeader>
            <CardTitle>{isCreating ? 'Create New Pricing Plan' : 'Edit Pricing Plan'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Plan Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Basic, Pro, Enterprise..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Price</label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="99000"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Currency</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="IDR">IDR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Billing Period</label>
                  <select
                    value={formData.billing_period}
                    onChange={(e) => setFormData(prev => ({ ...prev, billing_period: e.target.value }))}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="month">Month</option>
                    <option value="year">Year</option>
                    <option value="lifetime">Lifetime</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Order</label>
                  <Input
                    type="number"
                    value={formData.order_index}
                    onChange={(e) => setFormData(prev => ({ ...prev, order_index: parseInt(e.target.value) }))}
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Plan description"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_popular"
                  checked={formData.is_popular}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_popular: checked as boolean }))}
                />
                <label htmlFor="is_popular" className="text-sm font-medium">
                  Mark as popular plan
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Features</label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    placeholder="Add a feature"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  />
                  <Button type="button" onClick={addFeature}>Add</Button>
                </div>
                <div className="space-y-1">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                      <span className="flex-1">{feature}</span>
                      <Button 
                        type="button" 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => removeFeature(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">CTA Text</label>
                  <Input
                    value={formData.cta_text}
                    onChange={(e) => setFormData(prev => ({ ...prev, cta_text: e.target.value }))}
                    placeholder="Get Started"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">CTA Link</label>
                  <Input
                    value={formData.cta_link}
                    onChange={(e) => setFormData(prev => ({ ...prev, cta_link: e.target.value }))}
                    placeholder="https://example.com/signup"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Subdomain</label>
                <Input
                  value={formData.subdomain}
                  onChange={(e) => setFormData(prev => ({ ...prev, subdomain: e.target.value }))}
                  placeholder="main"
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {isCreating ? 'Create' : 'Update'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsCreating(false);
                    setIsEditing(null);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {pricingPlans?.map((plan) => (
          <Card key={plan.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium">{plan.name}</h4>
                    {plan.is_popular && (
                      <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-lg font-bold">
                    {plan.currency === 'IDR' ? 'Rp' : '$'}
                    {Number(plan.price).toLocaleString()}/{plan.billing_period}
                  </p>
                  {plan.description && (
                    <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                  )}
                  {plan.features && plan.features.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-medium">Features:</p>
                      <ul className="text-xs text-muted-foreground ml-4 list-disc">
                        {plan.features.slice(0, 3).map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                        {plan.features.length > 3 && (
                          <li>...and {plan.features.length - 3} more</li>
                        )}
                      </ul>
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <span>Subdomain: {plan.subdomain}</span>
                    <span>•</span>
                    <span>Order: {plan.order_index}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => startEdit(plan)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteMutation.mutate(plan.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}