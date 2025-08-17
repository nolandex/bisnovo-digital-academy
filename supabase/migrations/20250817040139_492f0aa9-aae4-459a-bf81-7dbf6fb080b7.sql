-- Enhance the existing Bisnovo table for the course platform
ALTER TABLE public.Bisnovo RENAME TO courses;

-- Add new columns for course data
ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS level TEXT DEFAULT 'Easy' CHECK (level IN ('Easy', 'Medium', 'Hard')),
ADD COLUMN IF NOT EXISTS rating DECIMAL(2,1) DEFAULT 4.5 CHECK (rating >= 1.0 AND rating <= 5.0),
ADD COLUMN IF NOT EXISTS students INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS modules INTEGER DEFAULT 3,
ADD COLUMN IF NOT EXISTS lessons INTEGER DEFAULT 12,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create course_modules table
CREATE TABLE IF NOT EXISTS public.course_modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  module_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create course_lessons table
CREATE TABLE IF NOT EXISTS public.course_lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID REFERENCES public.course_modules(id) ON DELETE CASCADE,
  lesson_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  type TEXT DEFAULT 'video' CHECK (type IN ('video', 'pdf', 'text')),
  duration INTEGER, -- in minutes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert sample course data
INSERT INTO public.courses (name, description, category, level, rating, students, price, image_url) VALUES
('Jasa Pembuatan Website Bisnis', 'Pelajari cara membangun bisnis jasa pembuatan website dari nol hingga mendapatkan klien pertama dengan modal minim', 'Web Development', 'Easy', 4.8, 2340, 149000, '/api/placeholder/400/240'),
('Digital Marketing untuk Pemula', 'Strategi lengkap digital marketing untuk bisnis online, mulai dari social media hingga Google Ads', 'Digital Marketing', 'Easy', 4.7, 1890, 199000, '/api/placeholder/400/240'),
('Desain Logo dan Branding', 'Bangun bisnis jasa desain logo dan branding dengan tools gratis dan dapatkan klien konsisten', 'Design Services', 'Medium', 4.6, 1567, 179000, '/api/placeholder/400/240'),
('Jasa Social Media Management', 'Kelola media sosial klien dan bangun agensi digital marketing yang menguntungkan', 'Digital Marketing', 'Medium', 4.9, 3456, 249000, '/api/placeholder/400/240'),
('Aplikasi Mobile dengan No-Code', 'Buat aplikasi mobile tanpa coding dan monetisasi dengan berbagai model bisnis', 'Mobile Apps', 'Hard', 4.5, 987, 399000, '/api/placeholder/400/240'),
('Toko Online Dropshipping', 'Panduan lengkap membangun toko online dropshipping yang profitable dari awal', 'E-Commerce', 'Easy', 4.4, 5670, 129000, '/api/placeholder/400/240'),
('Konsultan Bisnis Digital', 'Jadi konsultan bisnis digital dan bantu UMKM go digital dengan fee jutaan rupiah', 'Consulting', 'Hard', 4.8, 890, 599000, '/api/placeholder/400/240'),
('Content Creator Profesional', 'Monetisasi kreativitas Anda menjadi bisnis content creation yang sustainable', 'Content Creation', 'Medium', 4.6, 2134, 199000, '/api/placeholder/400/240'),
('Jasa SEO dan Website Optimization', 'Tawarkan jasa SEO kepada bisnis lokal dan dapatkan klien recurring bulanan', 'SEO Services', 'Hard', 4.7, 1234, 349000, '/api/placeholder/400/240'),
('Virtual Assistant Services', 'Bangun bisnis jasa virtual assistant dan bekerja remote dengan klien global', 'Virtual Assistant', 'Easy', 4.5, 1678, 159000, '/api/placeholder/400/240'),
('Fotografi Produk untuk E-commerce', 'Spesialisasi fotografi produk dan layani pebisnis online dengan tarif premium', 'Photography', 'Medium', 4.8, 1123, 219000, '/api/placeholder/400/240'),
('Video Production untuk Bisnis', 'Produksi video marketing untuk bisnis lokal dengan equipment terjangkau', 'Video Production', 'Hard', 4.6, 756, 429000, '/api/placeholder/400/240'),
('Copywriting yang Menjual', 'Tulis copy yang convert tinggi dan bangun karir sebagai copywriter profesional', 'Copywriting', 'Medium', 4.7, 1987, 189000, '/api/placeholder/400/240'),
('Online Tutoring Platform', 'Buat platform les online dan monetisasi keahlian mengajar Anda', 'Online Tutoring', 'Medium', 4.5, 1445, 179000, '/api/placeholder/400/240'),
('Jasa Delivery dan Logistics', 'Mulai bisnis jasa pengiriman lokal dengan sistem yang efisien', 'Delivery Services', 'Easy', 4.4, 2287, 139000, '/api/placeholder/400/240'),
('Wellness Coach Online', 'Bangun praktek wellness coaching online dan dampingi klien mencapai goals mereka', 'Health & Wellness', 'Medium', 4.8, 934, 249000, '/api/placeholder/400/240'),
('Katering Sehat Online', 'Bisnis katering sehat dengan sistem pre-order dan delivery yang profitable', 'Food & Beverage', 'Hard', 4.6, 1556, 199000, '/api/placeholder/400/240'),
('Personal Trainer Online', 'Latih klien secara online dan bangun bisnis fitness coaching yang scalable', 'Fitness Coaching', 'Medium', 4.7, 1678, 219000, '/api/placeholder/400/240');

-- Enable Row Level Security
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (anyone can view courses)
CREATE POLICY "Courses are viewable by everyone" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Course modules are viewable by everyone" ON public.course_modules FOR SELECT USING (true);
CREATE POLICY "Course lessons are viewable by everyone" ON public.course_lessons FOR SELECT USING (true);

-- Create update trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_courses_updated_at
BEFORE UPDATE ON public.courses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample modules and lessons for the first course
WITH course_data AS (
  SELECT id FROM public.courses WHERE name = 'Jasa Pembuatan Website Bisnis' LIMIT 1
),
module_1 AS (
  INSERT INTO public.course_modules (course_id, module_number, title, description)
  SELECT id, 1, 'Pengenalan Bisnis Website', 'Memahami peluang bisnis website dan persiapan awal'
  FROM course_data
  RETURNING id
),
module_2 AS (
  INSERT INTO public.course_modules (course_id, module_number, title, description)
  SELECT id, 2, 'Desain dan Development', 'Membuat website profesional dengan tools modern'
  FROM course_data
  RETURNING id
),
module_3 AS (
  INSERT INTO public.course_modules (course_id, module_number, title, description)
  SELECT id, 3, 'Bisnis dan Marketing', 'Mendapatkan klien dan scaling bisnis website'
  FROM course_data
  RETURNING id
)
INSERT INTO public.course_lessons (module_id, lesson_number, title, type, duration)
SELECT module_id, lesson_number, title, type, duration FROM (VALUES
  ((SELECT id FROM module_1), 1, 'Peluang Bisnis Website di Indonesia', 'video', 25),
  ((SELECT id FROM module_1), 2, 'Riset Kompetitor dan Niche', 'video', 30),
  ((SELECT id FROM module_1), 3, 'Tools dan Resources Gratis', 'pdf', 15),
  ((SELECT id FROM module_1), 4, 'Setting Up Business Plan', 'video', 35),
  ((SELECT id FROM module_2), 1, 'Dasar-dasar Web Design', 'video', 40),
  ((SELECT id FROM module_2), 2, 'WordPress untuk Pemula', 'video', 45),
  ((SELECT id FROM module_2), 3, 'Template dan Customization', 'video', 35),
  ((SELECT id FROM module_2), 4, 'Testing dan Deployment', 'video', 30),
  ((SELECT id FROM module_3), 1, 'Strategi Pricing dan Paket', 'video', 25),
  ((SELECT id FROM module_3), 2, 'Marketing dan Lead Generation', 'video', 40),
  ((SELECT id FROM module_3), 3, 'Client Communication', 'pdf', 20),
  ((SELECT id FROM module_3), 4, 'Scaling dan Automation', 'video', 35)
) AS lessons(module_id, lesson_number, title, type, duration);