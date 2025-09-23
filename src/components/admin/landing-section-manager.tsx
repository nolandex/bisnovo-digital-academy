import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit, Plus } from "lucide-react";

export function LandingSectionManager() {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    section_type: 'hero',
    title: '',
    subtitle: '',
    description: '',
    image_url: '',
    link_url: '',
    icon: '',
    subdomain: 'main',
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: sections, isLoading } = useQuery({
    queryKey: ['landing-sections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('landing_sections')
        .select('*')
        .order('section_type')
        .order('order_index');
      
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase
        .from('landing_sections')
        .insert([data]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landing-sections'] });
      setIsCreating(false);
      resetForm();
      toast({ title: "Section created successfully" });
    },
    onError: () => {
      toast({ title: "Error creating section", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase
        .from('landing_sections')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landing-sections'] });
      setIsEditing(null);
      resetForm();
      toast({ title: "Section updated successfully" });
    },
    onError: () => {
      toast({ title: "Error updating section", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('landing_sections')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landing-sections'] });
      toast({ title: "Section deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error deleting section", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      section_type: 'hero',
      title: '',
      subtitle: '',
      description: '',
      image_url: '',
      link_url: '',
      icon: '',
      subdomain: 'main',
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

  const startEdit = (section: any) => {
    setFormData({
      section_type: section.section_type,
      title: section.title || '',
      subtitle: section.subtitle || '',
      description: section.description || '',
      image_url: section.image_url || '',
      link_url: section.link_url || '',
      icon: section.icon || '',
      subdomain: section.subdomain,
    });
    setIsEditing(section.id);
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
        <h3 className="text-lg font-semibold">Hero & CTA Sections</h3>
        <Button onClick={startCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Section
        </Button>
      </div>

      {(isCreating || isEditing) && (
        <Card>
          <CardHeader>
            <CardTitle>{isCreating ? 'Create New Section' : 'Edit Section'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Section Type</label>
                  <select
                    value={formData.section_type}
                    onChange={(e) => setFormData(prev => ({ ...prev, section_type: e.target.value }))}
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value="hero">Hero</option>
                    <option value="cta">CTA</option>
                  </select>
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
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Section title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Subtitle</label>
                <Input
                  value={formData.subtitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="Section subtitle"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Section description"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Image URL</label>
                  <Input
                    value={formData.image_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Link URL</label>
                  <Input
                    value={formData.link_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, link_url: e.target.value }))}
                    placeholder="#section or https://example.com"
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
        {sections?.map((section) => (
          <Card key={section.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
                      {section.section_type.toUpperCase()}
                    </span>
                    <span className="bg-muted px-2 py-1 rounded text-xs">
                      {section.subdomain}
                    </span>
                  </div>
                  <h4 className="font-medium">{section.title}</h4>
                  {section.subtitle && (
                    <p className="text-sm text-muted-foreground">{section.subtitle}</p>
                  )}
                  {section.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {section.description.slice(0, 100)}...
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => startEdit(section)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteMutation.mutate(section.id)}
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