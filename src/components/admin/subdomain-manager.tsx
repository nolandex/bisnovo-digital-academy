import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit, Plus } from "lucide-react";

export function SubdomainManager() {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    subdomain: '',
    title: '',
    description: '',
    logo_url: '',
    primary_color: '#3B82F6',
    secondary_color: '#1E40AF',
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: subdomains, isLoading } = useQuery({
    queryKey: ['subdomains'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subdomains')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase
        .from('subdomains')
        .insert([data]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subdomains'] });
      setIsCreating(false);
      resetForm();
      toast({ title: "Subdomain created successfully" });
    },
    onError: () => {
      toast({ title: "Error creating subdomain", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase
        .from('subdomains')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subdomains'] });
      setIsEditing(null);
      resetForm();
      toast({ title: "Subdomain updated successfully" });
    },
    onError: () => {
      toast({ title: "Error updating subdomain", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('subdomains')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subdomains'] });
      toast({ title: "Subdomain deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error deleting subdomain", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      subdomain: '',
      title: '',
      description: '',
      logo_url: '',
      primary_color: '#3B82F6',
      secondary_color: '#1E40AF',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isCreating) {
      createMutation.mutate(formData);
    } else if (isEditing) {
      updateMutation.mutate({ id: isEditing, data: formData });
    }
  };

  const startEdit = (subdomain: any) => {
    setFormData({
      subdomain: subdomain.subdomain,
      title: subdomain.title,
      description: subdomain.description || '',
      logo_url: subdomain.logo_url || '',
      primary_color: subdomain.primary_color,
      secondary_color: subdomain.secondary_color,
    });
    setIsEditing(subdomain.id);
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
        <h3 className="text-lg font-semibold">Subdomain Management</h3>
        <Button onClick={startCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Create Subdomain
        </Button>
      </div>

      {(isCreating || isEditing) && (
        <Card>
          <CardHeader>
            <CardTitle>{isCreating ? 'Create New Subdomain' : 'Edit Subdomain'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Subdomain</label>
                  <Input
                    value={formData.subdomain}
                    onChange={(e) => setFormData(prev => ({ ...prev, subdomain: e.target.value }))}
                    placeholder="e.g. business, personal"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Site title"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Site description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Logo URL</label>
                <Input
                  value={formData.logo_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, logo_url: e.target.value }))}
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Primary Color</label>
                  <Input
                    type="color"
                    value={formData.primary_color}
                    onChange={(e) => setFormData(prev => ({ ...prev, primary_color: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Secondary Color</label>
                  <Input
                    type="color"
                    value={formData.secondary_color}
                    onChange={(e) => setFormData(prev => ({ ...prev, secondary_color: e.target.value }))}
                  />
                </div>
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
        {subdomains?.map((subdomain) => (
          <Card key={subdomain.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium">{subdomain.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    Subdomain: {subdomain.subdomain}
                  </p>
                  {subdomain.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {subdomain.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <div 
                      className="w-4 h-4 rounded" 
                      style={{ backgroundColor: subdomain.primary_color }}
                    />
                    <div 
                      className="w-4 h-4 rounded" 
                      style={{ backgroundColor: subdomain.secondary_color }}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => startEdit(subdomain)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  {subdomain.subdomain !== 'main' && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteMutation.mutate(subdomain.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}