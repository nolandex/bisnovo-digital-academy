-- Create courses table from scratch
CREATE TABLE public.courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  level TEXT DEFAULT 'Easy' CHECK (level IN ('Easy', 'Medium', 'Hard')),
  rating DECIMAL(2,1) DEFAULT 4.5 CHECK (rating >= 1.0 AND rating <= 5.0),
  students INTEGER DEFAULT 0,
  modules INTEGER DEFAULT 3,
  lessons INTEGER DEFAULT 12,
  price NUMERIC,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create course_modules table
CREATE TABLE public.course_modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  module_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create course_lessons table
CREATE TABLE public.course_lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID REFERENCES public.course_modules(id) ON DELETE CASCADE,
  lesson_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  type TEXT DEFAULT 'video' CHECK (type IN ('video', 'pdf', 'text')),
  duration INTEGER, -- in minutes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (anyone can view courses)
CREATE POLICY "Courses are viewable by everyone" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Course modules are viewable by everyone" ON public.course_modules FOR SELECT USING (true);
CREATE POLICY "Course lessons are viewable by everyone" ON public.course_lessons FOR SELECT USING (true);

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