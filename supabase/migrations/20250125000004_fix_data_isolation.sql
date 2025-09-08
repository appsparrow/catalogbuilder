-- Fix critical data isolation issues
-- Remove OR user_id IS NULL from all policies to prevent cross-tenant data leakage

-- Drop all existing policies that allow cross-tenant access
DROP POLICY IF EXISTS "Users can view their own products" ON public.products;
DROP POLICY IF EXISTS "Users can insert their own products" ON public.products;
DROP POLICY IF EXISTS "Users can update their own products" ON public.products;
DROP POLICY IF EXISTS "Users can delete their own products" ON public.products;

DROP POLICY IF EXISTS "Users can view their own catalogs" ON public.catalogs;
DROP POLICY IF EXISTS "Users can insert their own catalogs" ON public.catalogs;
DROP POLICY IF EXISTS "Users can update their own catalogs" ON public.catalogs;
DROP POLICY IF EXISTS "Users can delete their own catalogs" ON public.catalogs;

DROP POLICY IF EXISTS "Users can view their own unprocessed products" ON public.unprocessed_products;
DROP POLICY IF EXISTS "Users can insert their own unprocessed products" ON public.unprocessed_products;
DROP POLICY IF EXISTS "Users can update their own unprocessed products" ON public.unprocessed_products;
DROP POLICY IF EXISTS "Users can delete their own unprocessed products" ON public.unprocessed_products;

-- Drop the overly permissive policies
DROP POLICY IF EXISTS "Allow all operations on unprocessed_products" ON public.unprocessed_products;
DROP POLICY IF EXISTS "Public can view unprocessed products" ON public.unprocessed_products;
DROP POLICY IF EXISTS "Public can insert unprocessed products" ON public.unprocessed_products;

-- Create strict user-only policies for products
CREATE POLICY "Users can view their own products" ON public.products
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own products" ON public.products
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own products" ON public.products
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own products" ON public.products
    FOR DELETE USING (auth.uid() = user_id);

-- Create strict user-only policies for catalogs
CREATE POLICY "Users can view their own catalogs" ON public.catalogs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own catalogs" ON public.catalogs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own catalogs" ON public.catalogs
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own catalogs" ON public.catalogs
    FOR DELETE USING (auth.uid() = user_id);

-- Create strict user-only policies for unprocessed_products
CREATE POLICY "Users can view their own unprocessed products" ON public.unprocessed_products
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own unprocessed products" ON public.unprocessed_products
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own unprocessed products" ON public.unprocessed_products
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own unprocessed products" ON public.unprocessed_products
    FOR DELETE USING (auth.uid() = user_id);

-- Ensure RLS is enabled on all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unprocessed_products ENABLE ROW LEVEL SECURITY;

-- Add user_id column to unprocessed_products if it doesn't exist
ALTER TABLE public.unprocessed_products 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_unprocessed_products_user_id ON public.unprocessed_products(user_id);
