-- Add RLS policies for product_details table to allow full CRUD operations
CREATE POLICY "Anyone can manage product details" 
ON public.product_details 
FOR ALL 
USING (true);

-- Add RLS policies for product_features table to allow full CRUD operations  
CREATE POLICY "Anyone can manage product features"
ON public.product_features
FOR ALL
USING (true);