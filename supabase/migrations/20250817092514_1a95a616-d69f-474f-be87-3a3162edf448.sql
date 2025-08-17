-- Rename courses table to products
ALTER TABLE public.courses RENAME TO products;

-- Rename course_modules table to product_details  
ALTER TABLE public.course_modules RENAME TO product_details;
ALTER TABLE public.product_details RENAME COLUMN course_id TO product_id;
ALTER TABLE public.product_details RENAME COLUMN module_number TO detail_number;

-- Rename course_lessons table to product_features
ALTER TABLE public.course_lessons RENAME TO product_features;
ALTER TABLE public.product_features RENAME COLUMN module_id TO detail_id;
ALTER TABLE public.product_features RENAME COLUMN lesson_number TO feature_number;
ALTER TABLE public.product_features RENAME COLUMN duration TO quantity;

-- Update products table columns to be more suitable for products
ALTER TABLE public.products RENAME COLUMN modules TO details;
ALTER TABLE public.products RENAME COLUMN lessons TO features;
ALTER TABLE public.products ADD COLUMN stock INTEGER DEFAULT 100;
ALTER TABLE public.products ADD COLUMN is_digital BOOLEAN DEFAULT false;

-- Update RLS policies for products
DROP POLICY IF EXISTS "Anyone can manage courses" ON public.products;
CREATE POLICY "Anyone can manage products" ON public.products FOR ALL USING (true);

-- Update RLS policies for product_details
DROP POLICY IF EXISTS "Course modules are viewable by everyone" ON public.product_details;
CREATE POLICY "Product details are viewable by everyone" ON public.product_details FOR SELECT USING (true);

-- Update RLS policies for product_features  
DROP POLICY IF EXISTS "Course lessons are viewable by everyone" ON public.product_features;
CREATE POLICY "Product features are viewable by everyone" ON public.product_features FOR SELECT USING (true);