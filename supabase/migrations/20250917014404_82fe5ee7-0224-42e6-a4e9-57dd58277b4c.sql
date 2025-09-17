-- Update categories to match the user's desired categories from the image
-- Clear existing categories and add new ones with proper icons

-- Delete existing categories
DELETE FROM public.categories;

-- Insert new categories matching the user's image
INSERT INTO public.categories (name, icon, description) VALUES 
('All', 'Star', 'Semua kategori produk'),
('Business', 'Heart', 'Kategori bisnis dan konsultasi'), 
('Technology', 'FileCode2', 'Teknologi dan pengembangan'),
('Creative', 'Flower', 'Layanan kreatif dan desain'),
('More', 'MoreHorizontal', 'Kategori lainnya');