-- Fix RLS policies for user_usage table
-- Add missing DELETE policy for user_usage table

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own usage" ON public.user_usage;
DROP POLICY IF EXISTS "Users can insert their own usage" ON public.user_usage;
DROP POLICY IF EXISTS "Users can update their own usage" ON public.user_usage;

-- Create comprehensive RLS policies for user_usage
CREATE POLICY "Users can view their own usage" ON public.user_usage
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage" ON public.user_usage
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage" ON public.user_usage
    FOR UPDATE USING (auth.uid() = user_id);

-- Add missing DELETE policy for user_usage
CREATE POLICY "Users can delete their own usage" ON public.user_usage
    FOR DELETE USING (auth.uid() = user_id);

-- Also add DELETE policy for catalogs if missing
DROP POLICY IF EXISTS "Users can delete their own catalogs" ON public.catalogs;
CREATE POLICY "Users can delete their own catalogs" ON public.catalogs
    FOR DELETE USING (auth.uid() = user_id OR user_id IS NULL);

-- Add DELETE policy for products if missing  
DROP POLICY IF EXISTS "Users can delete their own products" ON public.products;
CREATE POLICY "Users can delete their own products" ON public.products
    FOR DELETE USING (auth.uid() = user_id OR user_id IS NULL);
