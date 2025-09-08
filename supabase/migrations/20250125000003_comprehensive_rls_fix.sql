-- Comprehensive RLS fix for catalog deletion issues
-- This addresses the trigger function and RLS policy conflicts

-- First, let's fix the update_user_usage function to handle the user context properly
CREATE OR REPLACE FUNCTION update_user_usage()
RETURNS TRIGGER AS $$
DECLARE
    target_user_id UUID;
BEGIN
    -- Determine which user_id to use based on the trigger context
    IF TG_OP = 'DELETE' THEN
        target_user_id := OLD.user_id;
    ELSE
        target_user_id := NEW.user_id;
    END IF;
    
    -- Skip if no user_id is available
    IF target_user_id IS NULL THEN
        RETURN COALESCE(NEW, OLD);
    END IF;
    
    -- Update or insert user_usage record with proper user context
    INSERT INTO public.user_usage (user_id, image_count, catalog_count, updated_at)
    SELECT 
        target_user_id,
        (SELECT COUNT(*) FROM public.products WHERE user_id = target_user_id),
        (SELECT COUNT(*) FROM public.catalogs WHERE user_id = target_user_id),
        NOW()
    ON CONFLICT (user_id) 
    DO UPDATE SET
        image_count = (SELECT COUNT(*) FROM public.products WHERE user_id = target_user_id),
        catalog_count = (SELECT COUNT(*) FROM public.catalogs WHERE user_id = target_user_id),
        updated_at = NOW();
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure all necessary RLS policies exist
-- Drop and recreate all policies to ensure they're correct

-- user_usage policies
DROP POLICY IF EXISTS "Users can view their own usage" ON public.user_usage;
DROP POLICY IF EXISTS "Users can insert their own usage" ON public.user_usage;
DROP POLICY IF EXISTS "Users can update their own usage" ON public.user_usage;
DROP POLICY IF EXISTS "Users can delete their own usage" ON public.user_usage;

CREATE POLICY "Users can view their own usage" ON public.user_usage
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage" ON public.user_usage
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage" ON public.user_usage
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own usage" ON public.user_usage
    FOR DELETE USING (auth.uid() = user_id);

-- catalogs policies
DROP POLICY IF EXISTS "Users can view their own catalogs" ON public.catalogs;
DROP POLICY IF EXISTS "Users can insert their own catalogs" ON public.catalogs;
DROP POLICY IF EXISTS "Users can update their own catalogs" ON public.catalogs;
DROP POLICY IF EXISTS "Users can delete their own catalogs" ON public.catalogs;

CREATE POLICY "Users can view their own catalogs" ON public.catalogs
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own catalogs" ON public.catalogs
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own catalogs" ON public.catalogs
    FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete their own catalogs" ON public.catalogs
    FOR DELETE USING (auth.uid() = user_id OR user_id IS NULL);

-- products policies
DROP POLICY IF EXISTS "Users can view their own products" ON public.products;
DROP POLICY IF EXISTS "Users can insert their own products" ON public.products;
DROP POLICY IF EXISTS "Users can update their own products" ON public.products;
DROP POLICY IF EXISTS "Users can delete their own products" ON public.products;

CREATE POLICY "Users can view their own products" ON public.products
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own products" ON public.products
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own products" ON public.products
    FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete their own products" ON public.products
    FOR DELETE USING (auth.uid() = user_id OR user_id IS NULL);

-- catalog_products policies (junction table)
DROP POLICY IF EXISTS "Users can manage catalog products" ON public.catalog_products;
CREATE POLICY "Users can manage catalog products" ON public.catalog_products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.catalogs 
            WHERE catalogs.id = catalog_products.catalog_id 
            AND (auth.uid() = catalogs.user_id OR catalogs.user_id IS NULL)
        )
    );

-- customer_responses policies
DROP POLICY IF EXISTS "Users can manage customer responses" ON public.customer_responses;
CREATE POLICY "Users can manage customer responses" ON public.customer_responses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.catalogs 
            WHERE catalogs.id = customer_responses.catalog_id 
            AND (auth.uid() = catalogs.user_id OR catalogs.user_id IS NULL)
        )
    );
