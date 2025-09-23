-- Create table for landing page sections content
CREATE TABLE public.landing_sections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subdomain TEXT NOT NULL DEFAULT 'main',
  section_type TEXT NOT NULL, -- 'hero', 'problems', 'benefits', 'testimonials', 'pricing', 'faq', 'cta'
  title TEXT,
  subtitle TEXT,
  description TEXT,
  image_url TEXT,
  link_url TEXT,
  icon TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for problems and solutions
CREATE TABLE public.problems_solutions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subdomain TEXT NOT NULL DEFAULT 'main',
  problem_title TEXT NOT NULL,
  problem_description TEXT,
  solution_title TEXT NOT NULL,
  solution_description TEXT,
  icon TEXT DEFAULT 'AlertTriangle',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for benefits/what you get
CREATE TABLE public.benefits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subdomain TEXT NOT NULL DEFAULT 'main',
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'Check',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for testimonials
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subdomain TEXT NOT NULL DEFAULT 'main',
  name TEXT NOT NULL,
  role TEXT,
  company TEXT,
  content TEXT NOT NULL,
  avatar_url TEXT,
  rating INTEGER DEFAULT 5,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for pricing plans
CREATE TABLE public.pricing_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subdomain TEXT NOT NULL DEFAULT 'main',
  name TEXT NOT NULL,
  price NUMERIC,
  currency TEXT DEFAULT 'IDR',
  billing_period TEXT DEFAULT 'month', -- 'month', 'year', 'lifetime'
  description TEXT,
  is_popular BOOLEAN DEFAULT false,
  features TEXT[], -- Array of features
  cta_text TEXT DEFAULT 'Get Started',
  cta_link TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for FAQ
CREATE TABLE public.faqs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subdomain TEXT NOT NULL DEFAULT 'main',
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for subdomains
CREATE TABLE public.subdomains (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subdomain TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#3B82F6',
  secondary_color TEXT DEFAULT '#1E40AF',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.landing_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problems_solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subdomains ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Landing sections are viewable by everyone" ON public.landing_sections FOR SELECT USING (true);
CREATE POLICY "Problems solutions are viewable by everyone" ON public.problems_solutions FOR SELECT USING (true);
CREATE POLICY "Benefits are viewable by everyone" ON public.benefits FOR SELECT USING (true);
CREATE POLICY "Testimonials are viewable by everyone" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Pricing plans are viewable by everyone" ON public.pricing_plans FOR SELECT USING (true);
CREATE POLICY "FAQs are viewable by everyone" ON public.faqs FOR SELECT USING (true);
CREATE POLICY "Subdomains are viewable by everyone" ON public.subdomains FOR SELECT USING (true);

-- Create policies for admin management
CREATE POLICY "Anyone can manage landing sections" ON public.landing_sections FOR ALL USING (true);
CREATE POLICY "Anyone can manage problems solutions" ON public.problems_solutions FOR ALL USING (true);
CREATE POLICY "Anyone can manage benefits" ON public.benefits FOR ALL USING (true);
CREATE POLICY "Anyone can manage testimonials" ON public.testimonials FOR ALL USING (true);
CREATE POLICY "Anyone can manage pricing plans" ON public.pricing_plans FOR ALL USING (true);
CREATE POLICY "Anyone can manage FAQs" ON public.faqs FOR ALL USING (true);
CREATE POLICY "Anyone can manage subdomains" ON public.subdomains FOR ALL USING (true);

-- Create triggers for updated_at
CREATE TRIGGER update_landing_sections_updated_at BEFORE UPDATE ON public.landing_sections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_problems_solutions_updated_at BEFORE UPDATE ON public.problems_solutions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_benefits_updated_at BEFORE UPDATE ON public.benefits FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pricing_plans_updated_at BEFORE UPDATE ON public.pricing_plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON public.faqs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_subdomains_updated_at BEFORE UPDATE ON public.subdomains FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default data for main subdomain
INSERT INTO public.subdomains (subdomain, title, description) VALUES ('main', 'Landing Page', 'Main landing page');

-- Insert default hero section
INSERT INTO public.landing_sections (subdomain, section_type, title, subtitle, description) VALUES 
('main', 'hero', 'Transform Your Business Today', 'Powerful Solutions for Modern Challenges', 'Discover our comprehensive suite of tools and services designed to help you achieve your goals faster and more efficiently.');

-- Insert default CTA section
INSERT INTO public.landing_sections (subdomain, section_type, title, description, link_url) VALUES 
('main', 'cta', 'Ready to Get Started?', 'Join thousands of satisfied customers who have transformed their business with our solutions.', '#pricing');