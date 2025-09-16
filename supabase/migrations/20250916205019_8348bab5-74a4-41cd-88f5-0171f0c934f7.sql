-- Add icon field to categories table
ALTER TABLE public.categories 
ADD COLUMN icon text DEFAULT 'FaStar';

-- Update existing categories with appropriate icons
UPDATE public.categories SET icon = 'FaBriefcase' WHERE name = 'Business Blueprint';
UPDATE public.categories SET icon = 'FaCode' WHERE name = 'Web Development';
UPDATE public.categories SET icon = 'FaTrendingUp' WHERE name = 'Digital Marketing';
UPDATE public.categories SET icon = 'FaPalette' WHERE name = 'Design Services';
UPDATE public.categories SET icon = 'FaMobile' WHERE name = 'Mobile Apps';
UPDATE public.categories SET icon = 'FaShoppingCart' WHERE name = 'E-Commerce';
UPDATE public.categories SET icon = 'FaUserTie' WHERE name = 'Consulting';
UPDATE public.categories SET icon = 'FaPen' WHERE name = 'Content Creation';
UPDATE public.categories SET icon = 'FaShare' WHERE name = 'Social Media';
UPDATE public.categories SET icon = 'FaSearch' WHERE name = 'SEO Services';
UPDATE public.categories SET icon = 'FaCamera' WHERE name = 'Photography';
UPDATE public.categories SET icon = 'FaVideo' WHERE name = 'Video Production';
UPDATE public.categories SET icon = 'FaFileAlt' WHERE name = 'Copywriting';
UPDATE public.categories SET icon = 'FaHandshake' WHERE name = 'Virtual Assistant';
UPDATE public.categories SET icon = 'FaChalkboardTeacher' WHERE name = 'Online Tutoring';
UPDATE public.categories SET icon = 'FaTruck' WHERE name = 'Delivery Services';
UPDATE public.categories SET icon = 'FaHeartbeat' WHERE name = 'Health & Wellness';