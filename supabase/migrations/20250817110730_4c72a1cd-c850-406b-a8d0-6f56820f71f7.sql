-- Create payment_settings table for global QRIS configuration
CREATE TABLE public.payment_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  qris_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payment_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for payment settings
CREATE POLICY "Anyone can manage payment settings" 
ON public.payment_settings 
FOR ALL 
USING (true);

-- Add text fields for features and how_it_works to products table
ALTER TABLE public.products 
ADD COLUMN features_text TEXT,
ADD COLUMN how_it_works_text TEXT;