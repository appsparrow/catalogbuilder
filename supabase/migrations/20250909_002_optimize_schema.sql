-- Migration: Optimize Schema for Simple Product Catalog App
-- Description: Streamlines tables, adds proper indexing, and ensures data isolation

-- 1. Create or update user_settings table
CREATE TABLE IF NOT EXISTS public.user_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    company_name text NOT NULL,
    contact_person text NOT NULL,
    contact_phone text,
    email text NOT NULL,
    website_url text,
    logo_url text,
    theme jsonb DEFAULT '{"primary_color": "#4F46E5", "secondary_color": "#10B981"}',
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT user_settings_user_id_key UNIQUE (user_id)
);

-- 2. Migrate data from company_profiles if it exists
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'company_profiles') THEN
        INSERT INTO public.user_settings (
            user_id,
            company_name,
            contact_person,
            contact_phone,
            email,
            website_url,
            logo_url,
            created_at,
            updated_at
        )
        SELECT 
            user_id,
            company_name,
            contact_person,
            contact_phone,
            email,
            website_url,
            logo_url,
            created_at,
            updated_at
        FROM public.company_profiles
        ON CONFLICT (user_id) DO NOTHING;
    END IF;
END $$;

-- 3. Drop old company_profiles table
DROP TABLE IF EXISTS public.company_profiles CASCADE;

-- 4. Update products table
ALTER TABLE public.products
    DROP COLUMN IF EXISTS company_id,
    ADD COLUMN IF NOT EXISTS description text,
    ADD COLUMN IF NOT EXISTS price decimal(10,2),
    ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}';

-- 5. Update catalogs table
ALTER TABLE public.catalogs
    DROP COLUMN IF EXISTS company_id,
    ADD COLUMN IF NOT EXISTS description text,
    ADD COLUMN IF NOT EXISTS theme jsonb DEFAULT '{"primary_color": "#4F46E5", "secondary_color": "#10B981"}';

-- 6. Add better indexing
-- Products indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_supplier ON public.products(supplier);
CREATE INDEX IF NOT EXISTS idx_products_code ON public.products(code);
CREATE INDEX IF NOT EXISTS idx_products_active_user ON public.products(user_id) WHERE isactive = true;
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);

-- Catalogs indexes
CREATE INDEX IF NOT EXISTS idx_catalogs_active_user ON public.catalogs(user_id) WHERE archived_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_catalogs_shareable ON public.catalogs(shareable_link);

-- Customer responses indexes
CREATE INDEX IF NOT EXISTS idx_customer_responses_catalog ON public.customer_responses(catalog_id);
CREATE INDEX IF NOT EXISTS idx_customer_responses_email ON public.customer_responses(customer_email);
CREATE INDEX IF NOT EXISTS idx_customer_responses_created ON public.customer_responses(created_at DESC);

-- 7. Add RLS to all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalog_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- 8. Drop existing policies
DO $$ 
BEGIN
    -- Drop products policies
    DROP POLICY IF EXISTS "Users can view their own products" ON public.products;
    DROP POLICY IF EXISTS "Users can manage their own products" ON public.products;
    DROP POLICY IF EXISTS "Users can insert their own products" ON public.products;
    DROP POLICY IF EXISTS "Users can update their own products" ON public.products;
    
    -- Drop catalogs policies
    DROP POLICY IF EXISTS "Users can view their own catalogs" ON public.catalogs;
    DROP POLICY IF EXISTS "Anyone can view shared catalogs" ON public.catalogs;
    DROP POLICY IF EXISTS "Users can manage their own catalogs" ON public.catalogs;
    
    -- Drop user settings policies
    DROP POLICY IF EXISTS "Users can view their own settings" ON public.user_settings;
    DROP POLICY IF EXISTS "Users can manage their own settings" ON public.user_settings;
    
    -- Drop customer responses policies
    DROP POLICY IF EXISTS "Users can view responses to their catalogs" ON public.customer_responses;
    DROP POLICY IF EXISTS "Anyone can submit responses" ON public.customer_responses;
END $$;

-- 9. Create new RLS policies
-- Products policies
CREATE POLICY "Users can view their own products"
    ON public.products FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own products"
    ON public.products FOR ALL
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Catalogs policies
CREATE POLICY "Users can view their own catalogs"
    ON public.catalogs FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Anyone can view shared catalogs"
    ON public.catalogs FOR SELECT
    TO authenticated
    USING (archived_at IS NULL);

CREATE POLICY "Users can manage their own catalogs"
    ON public.catalogs FOR ALL
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- User settings policies
CREATE POLICY "Users can view their own settings"
    ON public.user_settings FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own settings"
    ON public.user_settings FOR ALL
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Customer responses policies
CREATE POLICY "Users can view responses to their catalogs"
    ON public.customer_responses FOR SELECT
    TO authenticated
    USING (
        catalog_id IN (
            SELECT id FROM catalogs 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Anyone can submit responses"
    ON public.customer_responses FOR INSERT
    TO authenticated
    WITH CHECK (
        catalog_id IN (
            SELECT id FROM catalogs 
            WHERE archived_at IS NULL
        )
    );

-- 9. Add helpful views
CREATE OR REPLACE VIEW public.active_catalogs AS
SELECT 
    c.*,
    COUNT(DISTINCT cp.product_id) as product_count,
    COUNT(DISTINCT cr.id) as response_count,
    us.company_name,
    us.logo_url as company_logo
FROM catalogs c
LEFT JOIN catalog_products cp ON c.id = cp.catalog_id
LEFT JOIN customer_responses cr ON c.id = cr.catalog_id
LEFT JOIN user_settings us ON c.user_id = us.user_id
WHERE c.archived_at IS NULL
GROUP BY c.id, us.company_name, us.logo_url;

CREATE OR REPLACE VIEW public.product_stats AS
SELECT 
    p.*,
    COUNT(DISTINCT cp.catalog_id) as catalog_count,
    COUNT(DISTINCT c.id) filter (where c.archived_at is null) as active_catalog_count
FROM products p
LEFT JOIN catalog_products cp ON p.id = cp.product_id
LEFT JOIN catalogs c ON cp.catalog_id = c.id
WHERE p.isactive = true
GROUP BY p.id;

-- 10. Add triggers for automatic timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update timestamp triggers to all relevant tables
CREATE TRIGGER update_products_timestamp
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_catalogs_timestamp
    BEFORE UPDATE ON catalogs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_user_settings_timestamp
    BEFORE UPDATE ON user_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- 11. Add usage limit check triggers
CREATE OR REPLACE FUNCTION check_user_limits()
RETURNS TRIGGER AS $$
DECLARE
    current_count integer;
    max_limit integer;
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Check if it's a product or catalog
        IF TG_TABLE_NAME = 'products' THEN
            SELECT COUNT(*) INTO current_count
            FROM products
            WHERE user_id = NEW.user_id AND archived_at IS NULL;
            
            SELECT max_products INTO max_limit
            FROM user_limits
            WHERE user_id = NEW.user_id;
            
            IF current_count > max_limit THEN
                RAISE EXCEPTION 'Product limit exceeded. Maximum allowed: %', max_limit;
            END IF;
        ELSIF TG_TABLE_NAME = 'catalogs' THEN
            SELECT COUNT(*) INTO current_count
            FROM catalogs
            WHERE user_id = NEW.user_id AND archived_at IS NULL;
            
            SELECT max_catalogs INTO max_limit
            FROM user_limits
            WHERE user_id = NEW.user_id;
            
            IF current_count > max_limit THEN
                RAISE EXCEPTION 'Catalog limit exceeded. Maximum allowed: %', max_limit;
            END IF;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add limit check triggers
CREATE TRIGGER check_product_limits
    BEFORE INSERT ON products
    FOR EACH ROW
    EXECUTE FUNCTION check_user_limits();

CREATE TRIGGER check_catalog_limits
    BEFORE INSERT ON catalogs
    FOR EACH ROW
    EXECUTE FUNCTION check_user_limits();
