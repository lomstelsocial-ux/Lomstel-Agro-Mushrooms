-- ===================================================
-- LOMSTEL AGRO - SUPABASE PRODUCTION DATABASE SCHEMA
-- NAFDAC REG. NO: A8-121508L
-- ===================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. SITE SETTINGS TABLE (Controls full website text, imagery, and branding)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'default_settings',
    brand_name TEXT NOT NULL DEFAULT 'Lomstel Agro',
    tagline TEXT NOT NULL DEFAULT 'Growing for a Better Tomorrow.',
    nafdac_reg TEXT NOT NULL DEFAULT 'A8-121508L',
    primary_phone TEXT NOT NULL DEFAULT '+234 812 468 0837',
    secondary_phone TEXT NOT NULL DEFAULT '+234 806 543 0680',
    whatsapp_number TEXT NOT NULL DEFAULT '2348124680837',
    email TEXT NOT NULL DEFAULT 'lomstelsocial@gmail.com',
    main_website TEXT NOT NULL DEFAULT 'https://www.lomstel.com',
    mushroom_website TEXT NOT NULL DEFAULT 'https://lomstelmushroom.mobirisesite.com/',
    location_address TEXT NOT NULL DEFAULT '35, Ewuosho Street, off Aiyetoro Road, Kanuyi, Ogun State, Nigeria.',
    hero_headline TEXT NOT NULL DEFAULT 'FRESH OYSTER MUSHROOMS, GROWN WITH CARE.',
    hero_subheadline TEXT NOT NULL DEFAULT 'Discover fresh, natural and nutritious oyster mushrooms, carefully cultivated and hygienically packaged by Lomstel Agro.',
    hero_image TEXT,
    hero_dried_image TEXT,
    hero_cta_text TEXT DEFAULT 'ORDER NOW',
    social_links JSONB NOT NULL DEFAULT '[]'::jsonb,
    scrolling_images JSONB NOT NULL DEFAULT '[]'::jsonb,
    video_section_headline TEXT DEFAULT 'WATCH OUR FARM IN ACTION',
    video_section_subheadline TEXT,
    videos JSONB NOT NULL DEFAULT '[]'::jsonb,
    about_title TEXT DEFAULT 'FROM OUR FARM TO YOUR TABLE.',
    about_text TEXT NOT NULL,
    about_image TEXT,
    benefits_headline TEXT DEFAULT 'GOOD FOOD STARTS WITH GOOD CHOICES.',
    benefits_subtext TEXT,
    facility_headline TEXT DEFAULT 'SEE WHERE YOUR MUSHROOMS COME FROM.',
    facility_subtext TEXT,
    facility_image TEXT,
    contact_headline TEXT DEFAULT 'GET IN TOUCH WITH LOMSTEL AGRO',
    primary_color TEXT NOT NULL DEFAULT '#146B4A',
    dark_green_color TEXT NOT NULL DEFAULT '#0B3D2E',
    gold_color TEXT NOT NULL DEFAULT '#D4A72C',
    font_family TEXT DEFAULT 'Outfit',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('fresh', 'dried', 'wholesale')),
    tagline TEXT NOT NULL,
    description TEXT NOT NULL,
    unit TEXT NOT NULL,
    price_estimate TEXT,
    min_order TEXT,
    image TEXT NOT NULL,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    use_cases JSONB NOT NULL DEFAULT '[]'::jsonb,
    in_stock BOOLEAN NOT NULL DEFAULT true,
    whatsapp_message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. GALLERY TABLE
CREATE TABLE IF NOT EXISTS public.gallery (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Our Farm', 'Fresh Mushrooms', 'Packaging', 'Food & Recipes', 'Our Facility')),
    image_url TEXT NOT NULL,
    caption TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. FAQS TABLE
CREATE TABLE IF NOT EXISTS public.faqs (
    id TEXT PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS public.testimonials (
    id TEXT PRIMARY KEY,
    quote TEXT NOT NULL,
    client_type TEXT NOT NULL,
    location TEXT,
    is_published BOOLEAN NOT NULL DEFAULT true,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    product TEXT NOT NULL,
    quantity TEXT NOT NULL,
    customer_type TEXT NOT NULL CHECK (customer_type IN ('Home & Family', 'Restaurant', 'Hotel', 'Supermarket', 'Caterer', 'Retailer', 'Wholesale', 'Other')),
    delivery_location TEXT NOT NULL,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Confirmed', 'Processing', 'Delivered', 'Cancelled'))
);

-- 7. VISITOR ANALYTICS & TRAFFIC TABLE
CREATE TABLE IF NOT EXISTS public.site_analytics (
    id TEXT PRIMARY KEY DEFAULT 'global_analytics',
    total_page_views INTEGER NOT NULL DEFAULT 1,
    unique_visitors INTEGER NOT NULL DEFAULT 1,
    total_orders INTEGER NOT NULL DEFAULT 0,
    last_visited_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. CUSTOMER LEADS & OUTREACH PIPELINE
CREATE TABLE IF NOT EXISTS public.customer_leads (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    category TEXT NOT NULL,
    interest TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Inquiry' CHECK (status IN ('Inquiry', 'Sample Requested', 'Regular Client', 'Follow-up Needed')),
    notes TEXT,
    last_contacted TIMESTAMP WITH TIME ZONE
);

-- ===================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ===================================================
-- Safe column upgrades if tables already exist
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS hero_dried_image TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS scrolling_images JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS video_section_headline TEXT DEFAULT 'WATCH OUR FARM IN ACTION';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS video_section_subheadline TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS videos JSONB DEFAULT '[]'::jsonb;

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_leads ENABLE ROW LEVEL SECURITY;

-- Allow full read & write access for both anon web clients and authenticated admin
DROP POLICY IF EXISTS "Allow all on site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Allow public read site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins full access site_settings" ON public.site_settings;
CREATE POLICY "Allow all on site_settings" ON public.site_settings FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all on products" ON public.products;
DROP POLICY IF EXISTS "Allow public read products" ON public.products;
DROP POLICY IF EXISTS "Admins full access products" ON public.products;
CREATE POLICY "Allow all on products" ON public.products FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all on gallery" ON public.gallery;
DROP POLICY IF EXISTS "Allow public read gallery" ON public.gallery;
DROP POLICY IF EXISTS "Admins full access gallery" ON public.gallery;
CREATE POLICY "Allow all on gallery" ON public.gallery FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all on faqs" ON public.faqs;
DROP POLICY IF EXISTS "Allow public read faqs" ON public.faqs;
DROP POLICY IF EXISTS "Admins full access faqs" ON public.faqs;
CREATE POLICY "Allow all on faqs" ON public.faqs FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all on testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Allow public read testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins full access testimonials" ON public.testimonials;
CREATE POLICY "Allow all on testimonials" ON public.testimonials FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all on orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public to submit orders" ON public.orders;
DROP POLICY IF EXISTS "Admins full access orders" ON public.orders;
CREATE POLICY "Allow all on orders" ON public.orders FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all on site_analytics" ON public.site_analytics;
DROP POLICY IF EXISTS "Allow public to log analytics" ON public.site_analytics;
CREATE POLICY "Allow all on site_analytics" ON public.site_analytics FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all on customer_leads" ON public.customer_leads;
DROP POLICY IF EXISTS "Admins full access customer_leads" ON public.customer_leads;
CREATE POLICY "Allow all on customer_leads" ON public.customer_leads FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ===================================================
-- STORAGE BUCKET FOR MEDIA UPLOADS
-- ===================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('lomstel-media', 'lomstel-media', true) 
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public media access" ON storage.objects;
CREATE POLICY "Public media access" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'lomstel-media');

DROP POLICY IF EXISTS "Public media upload" ON storage.objects;
CREATE POLICY "Public media upload" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'lomstel-media');

DROP POLICY IF EXISTS "Public media update" ON storage.objects;
CREATE POLICY "Public media update" ON storage.objects FOR UPDATE TO anon, authenticated USING (bucket_id = 'lomstel-media');

DROP POLICY IF EXISTS "Public media delete" ON storage.objects;
CREATE POLICY "Public media delete" ON storage.objects FOR DELETE TO anon, authenticated USING (bucket_id = 'lomstel-media');

