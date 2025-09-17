-- Update category names to match exactly what user wants from the image
UPDATE public.categories 
SET name = CASE 
  WHEN name = 'All' THEN 'All'
  WHEN name = 'Business' THEN 'Bbbbb'  
  WHEN name = 'Technology' THEN 'Fdj'
  WHEN name = 'Creative' THEN 'Hbbbb'
  WHEN name = 'More' THEN 'Lainnya'
END;