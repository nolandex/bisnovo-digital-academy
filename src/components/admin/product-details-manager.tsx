import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProductDetail {
  id: string;
  detail_number: number;
  title: string;
  description: string;
}

interface ProductDetailsManagerProps {
  productId: string;
}

export function ProductDetailsManager({ productId }: ProductDetailsManagerProps) {
  const [details, setDetails] = useState<ProductDetail[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDetail, setEditingDetail] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    detail_number: 1,
  });

  useEffect(() => {
    fetchDetails();
  }, [productId]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('product_details')
        .select('*')
        .eq('product_id', productId)
        .order('detail_number');

      if (error) throw error;
      setDetails(data || []);
    } catch (error) {
      console.error('Error fetching details:', error);
      toast({
        title: "Error",
        description: "Failed to fetch product details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingDetail) {
        const { error } = await supabase
          .from('product_details')
          .update(formData)
          .eq('id', editingDetail.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Detail updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('product_details')
          .insert([{ ...formData, product_id: productId }]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Detail created successfully",
        });
      }

      setIsFormOpen(false);
      setEditingDetail(null);
      setFormData({ title: "", description: "", detail_number: details.length + 1 });
      fetchDetails();
    } catch (error) {
      console.error('Error saving detail:', error);
      toast({
        title: "Error",
        description: "Failed to save detail",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (detailId: string) => {
    if (!confirm('Are you sure you want to delete this detail?')) return;

    try {
      const { error } = await supabase
        .from('product_details')
        .delete()
        .eq('id', detailId);

      if (error) throw error;

      setDetails(details.filter(detail => detail.id !== detailId));
      toast({
        title: "Success",
        description: "Detail deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting detail:', error);
      toast({
        title: "Error",
        description: "Failed to delete detail",
        variant: "destructive",
      });
    }
  };

  const openEditForm = (detail: ProductDetail) => {
    setEditingDetail(detail);
    setFormData({
      title: detail.title,
      description: detail.description,
      detail_number: detail.detail_number,
    });
    setIsFormOpen(true);
  };

  const openAddForm = () => {
    setEditingDetail(null);
    setFormData({ title: "", description: "", detail_number: details.length + 1 });
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">How It Works</h3>
        <Button onClick={openAddForm} size="sm" className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Step
        </Button>
      </div>

      {/* Form */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="step-number">Step Number</Label>
              <Input
                id="step-number"
                type="number"
                min="1"
                value={formData.detail_number}
                onChange={(e) => setFormData({...formData, detail_number: Number(e.target.value)})}
                required
              />
            </div>
            <div>
              <Label htmlFor="step-title">Step Title</Label>
              <Input
                id="step-title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g., Order & Pay"
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="step-description">Description</Label>
            <Textarea
              id="step-description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Explain what happens in this step"
              rows={2}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={loading} size="sm">
              {loading ? "Saving..." : editingDetail ? "Update" : "Add"}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Details List */}
      <div className="space-y-2">
        {details.map((detail) => (
          <div key={detail.id} className="flex items-start gap-3 p-3 bg-white border rounded-lg">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
              {detail.detail_number}
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400 mt-1" />
            <div className="flex-1">
              <h4 className="font-medium text-sm">{detail.title}</h4>
              <p className="text-xs text-gray-600">{detail.description}</p>
            </div>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" onClick={() => openEditForm(detail)}>
                <Edit className="h-3 w-3" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleDelete(detail.id)} className="text-red-600 hover:text-red-700">
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
        {details.length === 0 && (
          <p className="text-gray-500 text-center py-4">No steps added yet</p>
        )}
      </div>
    </div>
  );
}