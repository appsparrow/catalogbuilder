-- Add user_id columns to existing tables
-- This migration should run before the subscription tables migration

-- Add user_id to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add user_id to catalogs table  
ALTER TABLE public.catalogs 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add user_id to unprocessed_products table
ALTER TABLE public.unprocessed_products 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_user_id ON public.products(user_id);
CREATE INDEX IF NOT EXISTS idx_catalogs_user_id ON public.catalogs(user_id);
CREATE INDEX IF NOT EXISTS idx_unprocessed_products_user_id ON public.unprocessed_products(user_id);

-- Update RLS policies to include user_id filtering
DROP POLICY IF EXISTS "Authenticated users can manage products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can manage catalogs" ON public.catalogs;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own products" ON public.products;
DROP POLICY IF EXISTS "Users can insert their own products" ON public.products;
DROP POLICY IF EXISTS "Users can update their own products" ON public.products;
DROP POLICY IF EXISTS "Users can delete their own products" ON public.products;

DROP POLICY IF EXISTS "Users can view their own catalogs" ON public.catalogs;
DROP POLICY IF EXISTS "Users can insert their own catalogs" ON public.catalogs;
DROP POLICY IF EXISTS "Users can update their own catalogs" ON public.catalogs;
DROP POLICY IF EXISTS "Users can delete their own catalogs" ON public.catalogs;

-- New RLS policies with user_id filtering
CREATE POLICY "Users can view their own products" ON public.products 
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own products" ON public.products 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own products" ON public.products 
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own products" ON public.products 
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own catalogs" ON public.catalogs 
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own catalogs" ON public.catalogs 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own catalogs" ON public.catalogs 
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own catalogs" ON public.catalogs 
    FOR DELETE USING (auth.uid() = user_id);

-- Enable RLS for unprocessed_products if not already enabled
ALTER TABLE public.unprocessed_products ENABLE ROW LEVEL SECURITY;

-- Drop existing unprocessed_products policies if they exist
DROP POLICY IF EXISTS "Users can view their own unprocessed products" ON public.unprocessed_products;
DROP POLICY IF EXISTS "Users can insert their own unprocessed products" ON public.unprocessed_products;
DROP POLICY IF EXISTS "Users can update their own unprocessed products" ON public.unprocessed_products;
DROP POLICY IF EXISTS "Users can delete their own unprocessed products" ON public.unprocessed_products;

-- RLS policies for unprocessed_products
CREATE POLICY "Users can view their own unprocessed products" ON public.unprocessed_products 
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own unprocessed products" ON public.unprocessed_products 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own unprocessed products" ON public.unprocessed_products 
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own unprocessed products" ON public.unprocessed_products 
    FOR DELETE USING (auth.uid() = user_id);

-- Update existing records to have user_id (optional - for existing data)
-- You may want to manually assign these or leave them NULL for public access
