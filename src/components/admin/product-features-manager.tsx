import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, CheckCircle, FileText, Monitor, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProductFeature {
  id: string;
  feature_number: number;
  title: string;
  type: string;
  quantity: number;
}

interface ProductFeaturesManagerProps {
  productId: string;
}

const featureIcons = {
  video: Monitor,
  document: FileText,
  download: Download,
  access: CheckCircle,
} as const;

export function ProductFeaturesManager({ productId }: ProductFeaturesManagerProps) {
  const [features, setFeatures] = useState<ProductFeature[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<ProductFeature | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    type: "video",
    quantity: 1,
    feature_number: 1,
  });

  useEffect(() => {
    fetchFeatures();
  }, [productId]);

  const fetchFeatures = async () => {
    try {
      setLoading(true);
      // First get details to get features
      const { data: detailsData } = await supabase
        .from('product_details')
        .select('id')
        .eq('product_id', productId);

      if (detailsData && detailsData.length > 0) {
        const { data: featuresData, error } = await supabase
          .from('product_features')
          .select('*')
          .in('detail_id', detailsData.map(d => d.id))
          .order('feature_number');

        if (error) throw error;
        setFeatures(featuresData || []);
      } else {
        setFeatures([]);
      }
    } catch (error) {
      console.error('Error fetching features:', error);
      toast({
        title: "Error",
        description: "Failed to fetch product features",
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
      // Get the first detail ID (create one if none exists)
      let detailId: string;
      const { data: detailsData } = await supabase
        .from('product_details')
        .select('id')
        .eq('product_id', productId)
        .limit(1);

      if (detailsData && detailsData.length > 0) {
        detailId = detailsData[0].id;
      } else {
        // Create a default detail
        const { data: newDetail, error: detailError } = await supabase
          .from('product_details')
          .insert([{
            product_id: productId,
            title: "Product Features",
            description: "What you get with this product",
            detail_number: 1
          }])
          .select()
          .single();

        if (detailError) throw detailError;
        detailId = newDetail.id;
      }

      if (editingFeature) {
        const { error } = await supabase
          .from('product_features')
          .update({ ...formData, detail_id: detailId })
          .eq('id', editingFeature.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Feature updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('product_features')
          .insert([{ ...formData, detail_id: detailId }]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Feature created successfully",
        });
      }

      setIsFormOpen(false);
      setEditingFeature(null);
      setFormData({ title: "", type: "video", quantity: 1, feature_number: features.length + 1 });
      fetchFeatures();
    } catch (error) {
      console.error('Error saving feature:', error);
      toast({
        title: "Error",
        description: "Failed to save feature",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (featureId: string) => {
    if (!confirm('Are you sure you want to delete this feature?')) return;

    try {
      const { error } = await supabase
        .from('product_features')
        .delete()
        .eq('id', featureId);

      if (error) throw error;

      setFeatures(features.filter(feature => feature.id !== featureId));
      toast({
        title: "Success",
        description: "Feature deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting feature:', error);
      toast({
        title: "Error",
        description: "Failed to delete feature",
        variant: "destructive",
      });
    }
  };

  const openEditForm = (feature: ProductFeature) => {
    setEditingFeature(feature);
    setFormData({
      title: feature.title,
      type: feature.type,
      quantity: feature.quantity,
      feature_number: feature.feature_number,
    });
    setIsFormOpen(true);
  };

  const openAddForm = () => {
    setEditingFeature(null);
    setFormData({ title: "", type: "video", quantity: 1, feature_number: features.length + 1 });
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">What You Get</h3>
        <Button onClick={openAddForm} size="sm" className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Feature
        </Button>
      </div>

      {/* Form */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="feature-title">Feature Title</Label>
              <Input
                id="feature-title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g., Video Tutorial"
                required
              />
            </div>
            <div>
              <Label htmlFor="feature-type">Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                  <SelectItem value="download">Download</SelectItem>
                  <SelectItem value="access">Access</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="feature-quantity">Quantity</Label>
              <Input
                id="feature-quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: Number(e.target.value)})}
                required
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={loading} size="sm">
              {loading ? "Saving..." : editingFeature ? "Update" : "Add"}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Features List */}
      <div className="space-y-2">
        {features.map((feature) => {
          const Icon = featureIcons[feature.type as keyof typeof featureIcons] || CheckCircle;
          return (
            <div key={feature.id} className="flex items-center gap-3 p-3 bg-white border rounded-lg">
              <Icon className="h-4 w-4 text-green-600" />
              <div className="flex-1">
                <span className="text-sm">{feature.title}</span>
                {feature.quantity > 1 && (
                  <span className="text-xs text-gray-500 ml-2">({feature.quantity}x)</span>
                )}
              </div>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" onClick={() => openEditForm(feature)}>
                  <Edit className="h-3 w-3" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(feature.id)} className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          );
        })}
        {features.length === 0 && (
          <p className="text-gray-500 text-center py-4">No features added yet</p>
        )}
      </div>
    </div>
  );
}