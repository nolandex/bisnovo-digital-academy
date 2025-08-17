-- Add QRIS image URL field to products table
ALTER TABLE public.products 
ADD COLUMN qris_image_url TEXT;