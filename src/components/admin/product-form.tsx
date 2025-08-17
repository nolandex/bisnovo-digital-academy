import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, X, Plus, Trash2, CheckCircle, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: string;
  name: string;
}

interface ProductDetail {
  id?: string;
  detail_number: number;
  title: string;
  description: string;
}

interface ProductFeature {
  id?: string;
  detail_id?: string;
  feature_number: number;
  title: string;
  type: string;
  quantity: number;
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
  const [qrisFile, setQrisFile] = useState<File | null>(null);
  const [qrisPreview, setQrisPreview] = useState<string>("");
  const [details, setDetails] = useState<ProductDetail[]>([]);
  const [features, setFeatures] = useState<ProductFeature[]>([]);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    category: product?.category || "",
    price: product?.price || 0,
    is_digital: product?.is_digital || false,
  });

  useEffect(() => {
    fetchCategories();
    if (product?.image_url) {
      setImagePreview(product.image_url);
    }
    if (product?.qris_image_url) {
      setQrisPreview(product.qris_image_url);
    }
    if (product?.id) {
      fetchProductDetails();
      fetchProductFeatures();
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

  const fetchProductDetails = async () => {
    if (!product?.id) return;
    try {
      const { data, error } = await supabase
        .from('product_details')
        .select('*')
        .eq('product_id', product.id)
        .order('detail_number');

      if (error) throw error;
      setDetails(data || []);
    } catch (error) {
      console.error('Error fetching details:', error);
    }
  };

  const fetchProductFeatures = async () => {
    if (!product?.id) return;
    try {
      const { data: detailsData } = await supabase
        .from('product_details')
        .select('id')
        .eq('product_id', product.id);

      if (detailsData && detailsData.length > 0) {
        const { data: featuresData, error } = await supabase
          .from('product_features')
          .select('*')
          .in('detail_id', detailsData.map(d => d.id))
          .order('feature_number');

        if (error) throw error;
        setFeatures(featuresData || []);
      }
    } catch (error) {
      console.error('Error fetching features:', error);
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

  const handleQrisChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setQrisFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setQrisPreview(reader.result as string);
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

  const addDetail = () => {
    setDetails([...details, {
      detail_number: details.length + 1,
      title: "",
      description: ""
    }]);
  };

  const updateDetail = (index: number, field: keyof ProductDetail, value: string | number) => {
    const updated = [...details];
    updated[index] = { ...updated[index], [field]: value };
    setDetails(updated);
  };

  const removeDetail = (index: number) => {
    setDetails(details.filter((_, i) => i !== index));
  };

  const addFeature = () => {
    setFeatures([...features, {
      feature_number: features.length + 1,
      title: "",
      type: "video",
      quantity: 1
    }]);
  };

  const updateFeature = (index: number, field: keyof ProductFeature, value: string | number) => {
    const updated = [...features];
    updated[index] = { ...updated[index], [field]: value };
    setFeatures(updated);
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = product?.image_url || "";
      let qrisUrl = product?.qris_image_url || "";

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      if (qrisFile) {
        qrisUrl = await uploadImage(qrisFile);
      }

      const productData = {
        ...formData,
        image_url: imageUrl,
        qris_image_url: qrisUrl,
        updated_at: new Date().toISOString(),
      };

      let productId = product?.id;

      if (product) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', product.id);

        if (error) throw error;
      } else {
        // Create new product
        const { data: newProduct, error } = await supabase
          .from('products')
          .insert([productData])
          .select()
          .single();

        if (error) throw error;
        productId = newProduct.id;
      }

      // Save details
      if (productId && details.length > 0) {
        // Delete existing details if updating
        if (product) {
          await supabase
            .from('product_details')
            .delete()
            .eq('product_id', productId);
        }

        // Insert new details
        const { data: insertedDetails, error: detailsError } = await supabase
          .from('product_details')
          .insert(details.map(detail => ({
            ...detail,
            product_id: productId
          })))
          .select();

        if (detailsError) throw detailsError;

        // Save features
        if (features.length > 0 && insertedDetails && insertedDetails.length > 0) {
          // Delete existing features if updating
          if (product) {
            await supabase
              .from('product_features')
              .delete()
              .in('detail_id', insertedDetails.map(d => d.id));
          }

          // Assign features to first detail (simplified approach)
          const firstDetailId = insertedDetails[0].id;
          await supabase
            .from('product_features')
            .insert(features.map(feature => ({
              ...feature,
              detail_id: firstDetailId
            })));
        }
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

        {/* Images */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Product Image</Label>
            <div className="mt-2">
              {imagePreview ? (
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="w-full h-20 object-cover rounded-lg border"
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

          <div>
            <Label>QRIS Payment</Label>
            <div className="mt-2">
              {qrisPreview ? (
                <div className="relative inline-block">
                  <img
                    src={qrisPreview}
                    alt="QRIS preview"
                    className="w-full h-20 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6"
                    onClick={() => {
                      setQrisFile(null);
                      setQrisPreview("");
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Upload className="h-6 w-6 mx-auto text-gray-400 mb-1" />
                  <p className="text-xs text-gray-600">Upload QRIS</p>
                </div>
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={handleQrisChange}
                className="mt-2"
              />
            </div>
          </div>
        </div>

        {/* Yang Anda Dapatkan */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label className="text-base font-medium">Yang Anda Dapatkan</Label>
            <Button type="button" onClick={addFeature} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          <div className="space-y-2">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 p-2 border rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                <Input
                  placeholder="Feature title"
                  value={feature.title}
                  onChange={(e) => updateFeature(index, 'title', e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  min="1"
                  value={feature.quantity}
                  onChange={(e) => updateFeature(index, 'quantity', Number(e.target.value))}
                  className="w-16"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeFeature(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label className="text-base font-medium">How It Works</Label>
            <Button type="button" onClick={addDetail} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" />
              Add Step
            </Button>
          </div>
          <div className="space-y-2">
            {details.map((detail, index) => (
              <div key={index} className="flex items-start gap-2 p-2 border rounded-lg">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mt-1">
                  {detail.detail_number}
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 mt-2" />
                <div className="flex-1 space-y-2">
                  <Input
                    placeholder="Step title"
                    value={detail.title}
                    onChange={(e) => updateDetail(index, 'title', e.target.value)}
                  />
                  <Textarea
                    placeholder="Step description"
                    value={detail.description}
                    onChange={(e) => updateDetail(index, 'description', e.target.value)}
                    rows={2}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeDetail(index)}
                  className="flex-shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
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