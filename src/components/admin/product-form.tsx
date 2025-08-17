import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  product?: Product | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    category: product?.category || "",
    price: product?.price || 0,
    is_digital: product?.is_digital || false,
    features: product?.features_text || "",
    how_it_works: product?.how_it_works_text || "",
  });

  useEffect(() => {
    fetchCategories();
    if (product?.image_url) {
      setImagePreview(product.image_url);
    }
  }, [product]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `course-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('course-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('course-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = product?.image_url || "";

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: formData.price,
        is_digital: formData.is_digital,
        features_text: formData.features,
        how_it_works_text: formData.how_it_works,
        image_url: imageUrl,
        updated_at: new Date().toISOString(),
      };

      if (product) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', product.id);

        if (error) throw error;
      } else {
        // Create new product
        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: product ? "Product updated successfully" : "Product created successfully",
      });

      onSuccess();
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {product ? 'Edit Product' : 'Add New Product'}
        </h3>
        <Button type="button" variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Enter product name"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Enter product description"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({...formData, category: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="price">Price (IDR) *</Label>
            <Input
              id="price"
              type="number"
              required
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
              placeholder="0"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_digital"
              checked={formData.is_digital}
              onCheckedChange={(checked) => setFormData({...formData, is_digital: !!checked})}
            />
            <Label htmlFor="is_digital">Digital Product</Label>
          </div>
        </div>

        {/* Image */}
        <div>
          <Label>Product Image</Label>
          <div className="mt-2">
            {imagePreview ? (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Product preview"
                  className="w-full h-32 object-cover rounded-lg border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview("");
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Upload className="h-6 w-6 mx-auto text-gray-400 mb-1" />
                <p className="text-xs text-gray-600">Upload image</p>
              </div>
            )}
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-2"
            />
          </div>
        </div>

        {/* Yang Anda Dapatkan */}
        <div>
          <Label htmlFor="features">Yang Anda Dapatkan</Label>
          <Textarea
            id="features"
            value={formData.features}
            onChange={(e) => setFormData({...formData, features: e.target.value})}
            placeholder="Enter what customers will get (one item per line)"
            rows={4}
          />
        </div>

        {/* How It Works */}
        <div>
          <Label htmlFor="how_it_works">How It Works</Label>
          <Textarea
            id="how_it_works"
            value={formData.how_it_works}
            onChange={(e) => setFormData({...formData, how_it_works: e.target.value})}
            placeholder="Enter how it works (one step per line)"
            rows={4}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading ? "Saving..." : product ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </form>
  );
}