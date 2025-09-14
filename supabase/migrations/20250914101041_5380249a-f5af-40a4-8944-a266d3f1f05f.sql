-- Insert Business Blueprint category if it doesn't exist
INSERT INTO categories (name, description) 
SELECT 'Business Blueprint', 'Panduan lengkap untuk memulai dan menjalankan berbagai jenis bisnis'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Business Blueprint');

-- Insert 10 Business Blueprint products
INSERT INTO products (
  name, 
  description, 
  category, 
  price, 
  image_url, 
  level,
  features_text,
  how_it_works_text,
  rating,
  customers
) VALUES 
(
  'Blueprint Bisnis Cafe & Bakery',
  'Panduan lengkap memulai bisnis cafe dan bakery dari nol hingga sukses. Termasuk analisis pasar, menu planning, dan strategi marketing.',
  'Business Blueprint',
  149000,
  '/src/assets/cafe-blueprint.jpg',
  'Intermediate',
  'Business plan lengkap
Financial projection 3 tahun
Menu planning & costing
SOP operasional cafe
Marketing strategy
Supplier contact list
Interior design guidance
Staff training module',
  'Download blueprint PDF
Pelajari business plan
Lakukan market research
Setup lokasi & perizinan
Implementasi SOP
Launch & marketing',
  4.8,
  245
),
(
  'Blueprint Online Shop Fashion',
  'Strategi membangun toko online fashion yang profitable. Dari product sourcing hingga digital marketing yang efektif.',
  'Business Blueprint',
  129000,
  '/src/assets/online-shop-blueprint.jpg',
  'Easy',
  'E-commerce setup guide
Product sourcing strategy
Instagram marketing template
Customer service SOP
Inventory management
Pricing strategy
Supplier database
Content creation guide',
  'Setup toko online
Riset produk trending
Building brand identity
Mulai content marketing
Launch soft opening
Scale marketing campaign',
  4.7,
  189
),
(
  'Blueprint Digital Marketing Agency',
  'Roadmap lengkap membangun agency digital marketing dari freelancer hingga perusahaan dengan tim.',
  'Business Blueprint',
  199000,
  '/src/assets/digital-marketing-blueprint.jpg',
  'Advanced',
  'Service package templates
Client proposal templates
Team hiring guide
Pricing strategy
Project management SOP
Client acquisition strategy
Portfolio building guide
Legal contract templates',
  'Define service offerings
Create portfolio website
Set pricing packages
Network & get first clients
Build team gradually
Scale operations',
  4.9,
  156
),
(
  'Blueprint Restaurant Business',
  'Panduan komprehensif membuka restaurant yang sukses. Mencakup concept development hingga grand opening.',
  'Business Blueprint',
  179000,
  '/src/assets/restaurant-blueprint.jpg',
  'Intermediate',
  'Restaurant concept planning
Location analysis checklist
Kitchen design layout
Menu engineering
Staff recruitment guide
Cost control system
Marketing launch plan
Operational procedures',
  'Develop restaurant concept
Secure location & permits
Design kitchen & dining
Hire & train staff
Soft opening testing
Grand opening marketing',
  4.6,
  98
),
(
  'Blueprint Skincare Brand',
  'Cara memulai brand skincare dari riset formula hingga marketing yang tepat sasaran untuk target market beauty.',
  'Business Blueprint',
  169000,
  '/src/assets/skincare-blueprint.jpg',
  'Intermediate',
  'Product formulation guide
BPOM registration process
Packaging design template
Influencer marketing strategy
Brand positioning guide
Manufacturing partner list
Quality control checklist
Launch campaign template',
  'Research target market
Develop product formula
Handle BPOM registration
Design packaging & branding
Find manufacturing partner
Execute launch campaign',
  4.8,
  134
),
(
  'Blueprint Food Truck Business',
  'Memulai bisnis food truck yang mobile dan profitable. Dari menu development hingga location strategy.',
  'Business Blueprint',
  139000,
  '/src/assets/food-truck-blueprint.jpg',
  'Easy',
  'Food truck setup guide
Menu development strategy
Location scouting tips
Permit & licensing guide
Equipment checklist
Social media marketing
Event booking strategy
Daily operation SOP',
  'Choose food truck concept
Get permits & licenses
Equip your food truck
Develop signature menu
Find prime locations
Build social media presence',
  4.5,
  112
),
(
  'Blueprint Online Course Creator',
  'Panduan membuat dan menjual online course yang laku keras. Dari content creation hingga marketing funnel.',
  'Business Blueprint',
  159000,
  '/src/assets/online-course-blueprint.jpg',
  'Intermediate',
  'Course content structure
Video production guide
Learning platform setup
Student engagement strategy
Pricing psychology
Affiliate program setup
Email marketing sequence
Certificate template',
  'Validate course idea
Create course outline
Produce video content
Setup learning platform
Build email funnel
Launch to beta students',
  4.7,
  203
),
(
  'Blueprint Dropshipping Business',
  'Strategi membangun bisnis dropshipping yang sustainable dengan profit margin yang sehat.',
  'Business Blueprint',
  119000,
  '/src/assets/dropship-blueprint.jpg',
  'Easy',
  'Niche research methodology
Supplier verification guide
Store setup tutorial
Product listing optimization
Facebook ads strategy
Customer service automation
Profit calculation tools
Scaling strategy',
  'Research profitable niche
Find reliable suppliers
Setup online store
List winning products
Run Facebook ads
Process orders efficiently',
  4.4,
  167
),
(
  'Blueprint Photography Business',
  'Mengubah hobi fotografi menjadi bisnis yang menguntungkan dengan strategi pricing dan marketing yang tepat.',
  'Business Blueprint',
  149000,
  '/src/assets/photography-blueprint.jpg',
  'Intermediate',
  'Photography niche selection
Portfolio building guide
Pricing strategy template
Client contract templates
Equipment recommendation
Social media marketing
Wedding photography SOP
Event photography guide',
  'Define photography niche
Build stunning portfolio
Set competitive pricing
Market your services
Book first clients
Deliver excellent service',
  4.6,
  89
),
(
  'Blueprint Consulting Business',
  'Membangun praktik konsultan profesional yang credible dan profitable di bidang expertise Anda.',
  'Business Blueprint',
  189000,
  '/src/assets/consulting-blueprint.jpg',
  'Advanced',
  'Expertise positioning guide
Service methodology framework
Client assessment tools
Proposal template library
Hourly vs project pricing
Speaking opportunity guide
Thought leadership strategy
Client retention system',
  'Identify your expertise
Develop service offerings
Create consulting framework
Build credibility & authority
Network with target clients
Scale through referrals',
  4.8,
  76
);