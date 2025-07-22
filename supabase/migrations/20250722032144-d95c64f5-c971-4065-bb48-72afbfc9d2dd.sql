-- Create products table
CREATE TABLE public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  category TEXT NOT NULL,
  supplier TEXT NOT NULL,
  image_url TEXT NOT NULL,
  original_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create catalogs table
CREATE TABLE public.catalogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  brand_name TEXT NOT NULL,
  logo_url TEXT,
  shareable_link TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create catalog_products junction table
CREATE TABLE public.catalog_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  catalog_id UUID REFERENCES public.catalogs(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  UNIQUE(catalog_id, product_id)
);

-- Create customer_responses table
CREATE TABLE public.customer_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  catalog_id UUID REFERENCES public.catalogs(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  liked_products UUID[] DEFAULT '{}',
  response_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- Storage policies for product images
CREATE POLICY "Public can view product images" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload product images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update product images" ON storage.objects
FOR UPDATE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalog_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_responses ENABLE ROW LEVEL SECURITY;

-- RLS Policies (public read for demo, can be restricted later)
CREATE POLICY "Public can view products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage products" ON public.products FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can view catalogs" ON public.catalogs FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage catalogs" ON public.catalogs FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can view catalog products" ON public.catalog_products FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage catalog products" ON public.catalog_products FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can view customer responses" ON public.customer_responses FOR SELECT USING (true);
CREATE POLICY "Public can create customer responses" ON public.customer_responses FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can manage customer responses" ON public.customer_responses FOR ALL USING (auth.role() = 'authenticated');