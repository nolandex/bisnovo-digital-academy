-- Create storage bucket for course images
INSERT INTO storage.buckets (id, name, public) VALUES ('course-images', 'course-images', true);

-- Create policies for course image uploads
CREATE POLICY "Course images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'course-images');

CREATE POLICY "Anyone can upload course images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'course-images');

CREATE POLICY "Anyone can update course images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'course-images');

CREATE POLICY "Anyone can delete course images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'course-images');

-- Add categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Create policies for categories
CREATE POLICY "Categories are viewable by everyone" 
ON public.categories 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can manage categories" 
ON public.categories 
FOR ALL 
USING (true);

-- Insert default categories
INSERT INTO public.categories (name, description) VALUES 
('Web Development', 'Learn modern web development technologies'),
('Mobile Development', 'Build mobile applications for iOS and Android'),
('Data Science', 'Analyze data and build machine learning models'),
('Digital Marketing', 'Master online marketing strategies'),
('Business', 'Develop business and entrepreneurship skills'),
('Design', 'Learn UI/UX and graphic design'),
('Photography', 'Master photography techniques and editing');

-- Update courses table to allow public CRUD operations
DROP POLICY IF EXISTS "Courses are viewable by everyone" ON public.courses;

CREATE POLICY "Anyone can manage courses" 
ON public.courses 
FOR ALL 
USING (true);

-- Create trigger for categories updated_at
CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();