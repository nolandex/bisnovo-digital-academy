-- Rename students column to customers for better clarity
ALTER TABLE public.products RENAME COLUMN students TO customers;

-- Update default feature types to be more digital-focused
UPDATE public.product_features 
SET type = CASE 
  WHEN type = 'digital' THEN 'file'
  WHEN type = 'video' THEN 'video'  
  ELSE 'tool'
END;