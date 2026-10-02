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
    hero_cta_text TEXT DEFAULT 'ORDER NOW',
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
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_leads ENABLE ROW LEVEL SECURITY;

-- Public Visitor Read Policies (Marketing catalog is publicly accessible)
CREATE POLICY "Allow public read site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Allow public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public read gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Allow public read faqs" ON public.faqs FOR SELECT USING (true);
CREATE POLICY "Allow public read testimonials" ON public.testimonials FOR SELECT USING (is_published = true);

-- Public Visitor Order Creation & Analytics Logging
CREATE POLICY "Allow public to submit orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public to log analytics" ON public.site_analytics FOR ALL USING (true);

-- Authenticated Admin Policies (Full administrative management)
CREATE POLICY "Admins full access site_settings" ON public.site_settings FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins full access products" ON public.products FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins full access gallery" ON public.gallery FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins full access faqs" ON public.faqs FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins full access testimonials" ON public.testimonials FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins full access orders" ON public.orders FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins full access customer_leads" ON public.customer_leads FOR ALL TO authenticated USING (true);
