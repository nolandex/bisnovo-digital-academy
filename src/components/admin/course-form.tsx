import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Course } from "@/components/course-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: string;
  name: string;
}

interface CourseFormProps {
  course?: Course | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CourseForm({ course, onSuccess, onCancel }: CourseFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: course?.name || "",
    description: course?.description || "",
    category: course?.category || "",
    level: course?.level || "Easy",
    price: course?.price || 0,
    rating: course?.rating || 4.5,
    students: course?.students || 0,
    modules: course?.modules || 3,
    lessons: course?.lessons || 12,
  });

  useEffect(() => {
    fetchCategories();
    if (course?.image_url) {
      setImagePreview(course.image_url);
    }
  }, [course]);

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
      let imageUrl = course?.image_url || "";

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const courseData = {
        ...formData,
        image_url: imageUrl,
        updated_at: new Date().toISOString(),
      };

      if (course) {
        // Update existing course
        const { error } = await supabase
          .from('courses')
          .update(courseData)
          .eq('id', course.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Course updated successfully",
        });
      } else {
        // Create new course
        const { error } = await supabase
          .from('courses')
          .insert([courseData]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Course created successfully",
        });
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving course:', error);
      toast({
        title: "Error",
        description: "Failed to save course",
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
          {course ? 'Edit Course' : 'Add New Course'}
        </h3>
        <Button type="button" variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="space-y-4">
        {/* Course Name */}
        <div>
          <Label htmlFor="name">Course Name *</Label>
          <Input
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="Enter course name"
          />
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Enter course description"
            rows={3}
          />
        </div>

        {/* Category & Level */}
        <div className="grid grid-cols-2 gap-4">
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
            <Label htmlFor="level">Level *</Label>
            <Select
              value={formData.level}
              onValueChange={(value) => setFormData({...formData, level: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Price & Rating */}
        <div className="grid grid-cols-2 gap-4">
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

          <div>
            <Label htmlFor="rating">Rating (1-5)</Label>
            <Input
              id="rating"
              type="number"
              min="1"
              max="5"
              step="0.1"
              value={formData.rating}
              onChange={(e) => setFormData({...formData, rating: Number(e.target.value)})}
            />
          </div>
        </div>

        {/* Students, Modules, Lessons */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="students">Students</Label>
            <Input
              id="students"
              type="number"
              min="0"
              value={formData.students}
              onChange={(e) => setFormData({...formData, students: Number(e.target.value)})}
            />
          </div>

          <div>
            <Label htmlFor="modules">Modules</Label>
            <Input
              id="modules"
              type="number"
              min="1"
              value={formData.modules}
              onChange={(e) => setFormData({...formData, modules: Number(e.target.value)})}
            />
          </div>

          <div>
            <Label htmlFor="lessons">Lessons</Label>
            <Input
              id="lessons"
              type="number"
              min="1"
              value={formData.lessons}
              onChange={(e) => setFormData({...formData, lessons: Number(e.target.value)})}
            />
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <Label>Course Image</Label>
          <div className="mt-2">
            {imagePreview ? (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Course preview"
                  className="w-32 h-20 object-cover rounded-lg border"
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
                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">Upload course image</p>
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
          {loading ? "Saving..." : course ? "Update Course" : "Create Course"}
        </Button>
      </div>
    </form>
  );
}