-- Update categories table to use Lucide icon names
-- Change default icon from 'FaStar' to 'Star'
ALTER TABLE public.categories 
ALTER COLUMN icon SET DEFAULT 'Star';

-- Update existing categories with old react-icons format to Lucide format
UPDATE public.categories 
SET icon = CASE 
  WHEN icon = 'FaStar' THEN 'Star'
  WHEN icon = 'FaBriefcase' THEN 'Briefcase'
  WHEN icon = 'FaCode' THEN 'Code'
  WHEN icon = 'FaTrendingUp' THEN 'TrendingUp'
  WHEN icon = 'FaPalette' THEN 'Palette'
  WHEN icon = 'FaMobile' THEN 'Smartphone'
  WHEN icon = 'FaShoppingCart' THEN 'ShoppingCart'
  WHEN icon = 'FaUserTie' THEN 'User'
  WHEN icon = 'FaPen' THEN 'PenTool'
  WHEN icon = 'FaShare' THEN 'Share'
  WHEN icon = 'FaSearch' THEN 'Search'
  WHEN icon = 'FaCamera' THEN 'Camera'
  WHEN icon = 'FaVideo' THEN 'Video'
  WHEN icon = 'FaFileAlt' THEN 'FileText'
  WHEN icon = 'FaHandshake' THEN 'Handshake'
  WHEN icon = 'FaChalkboardTeacher' THEN 'GraduationCap'
  WHEN icon = 'FaTruck' THEN 'Truck'
  WHEN icon = 'FaHeartbeat' THEN 'Heart'
  ELSE 'Star'
END
WHERE icon IS NOT NULL;