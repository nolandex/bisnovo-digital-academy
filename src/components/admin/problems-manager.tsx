import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit, Plus } from "lucide-react";

export function ProblemsManager() {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    problem_title: '',
    problem_description: '',
    solution_title: '',
    solution_description: '',
    icon: 'AlertTriangle',
    subdomain: 'main',
    order_index: 0,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: problems, isLoading } = useQuery({
    queryKey: ['problems-solutions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('problems_solutions')
        .select('*')
        .order('order_index');
      
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase
        .from('problems_solutions')
        .insert([data]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['problems-solutions'] });
      setIsCreating(false);
      resetForm();
      toast({ title: "Problem/Solution created successfully" });
    },
    onError: () => {
      toast({ title: "Error creating problem/solution", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase
        .from('problems_solutions')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['problems-solutions'] });
      setIsEditing(null);
      resetForm();
      toast({ title: "Problem/Solution updated successfully" });
    },
    onError: () => {
      toast({ title: "Error updating problem/solution", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('problems_solutions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['problems-solutions'] });
      toast({ title: "Problem/Solution deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error deleting problem/solution", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      problem_title: '',
      problem_description: '',
      solution_title: '',
      solution_description: '',
      icon: 'AlertTriangle',
      subdomain: 'main',
      order_index: 0,
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

  const startEdit = (problem: any) => {
    setFormData({
      problem_title: problem.problem_title,
      problem_description: problem.problem_description || '',
      solution_title: problem.solution_title,
      solution_description: problem.solution_description || '',
      icon: problem.icon,
      subdomain: problem.subdomain,
      order_index: problem.order_index,
    });
    setIsEditing(problem.id);
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
        <h3 className="text-lg font-semibold">Problems & Solutions</h3>
        <Button onClick={startCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Problem/Solution
        </Button>
      </div>

      {(isCreating || isEditing) && (
        <Card>
          <CardHeader>
            <CardTitle>{isCreating ? 'Create Problem/Solution' : 'Edit Problem/Solution'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Problem Title</label>
                  <Input
                    value={formData.problem_title}
                    onChange={(e) => setFormData(prev => ({ ...prev, problem_title: e.target.value }))}
                    placeholder="What's the problem?"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Solution Title</label>
                  <Input
                    value={formData.solution_title}
                    onChange={(e) => setFormData(prev => ({ ...prev, solution_title: e.target.value }))}
                    placeholder="How do we solve it?"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Problem Description</label>
                  <Textarea
                    value={formData.problem_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, problem_description: e.target.value }))}
                    placeholder="Describe the problem in detail"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Solution Description</label>
                  <Textarea
                    value={formData.solution_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, solution_description: e.target.value }))}
                    placeholder="Describe the solution in detail"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Icon</label>
                  <Input
                    value={formData.icon}
                    onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                    placeholder="AlertTriangle"
                  />
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
        {problems?.map((problem) => (
          <Card key={problem.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="border-l-4 border-destructive pl-3">
                      <h4 className="font-medium text-destructive">Problem</h4>
                      <p className="text-sm">{problem.problem_title}</p>
                      {problem.problem_description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {problem.problem_description.slice(0, 80)}...
                        </p>
                      )}
                    </div>
                    <div className="border-l-4 border-primary pl-3">
                      <h4 className="font-medium text-primary">Solution</h4>
                      <p className="text-sm">{problem.solution_title}</p>
                      {problem.solution_description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {problem.solution_description.slice(0, 80)}...
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Icon: {problem.icon}</span>
                    <span>•</span>
                    <span>Subdomain: {problem.subdomain}</span>
                    <span>•</span>
                    <span>Order: {problem.order_index}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => startEdit(problem)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteMutation.mutate(problem.id)}
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