-- Migration: Optimize Schema for Simple Product Catalog App
-- Description: Streamlines tables, adds proper indexing, and ensures data consistency

-- 1. Clean up unused tables
DROP TABLE IF EXISTS public.companies CASCADE;
DROP TABLE IF EXISTS public.company_profiles CASCADE;
DROP TABLE IF EXISTS public.admin_emails CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- 2. Add comments to clarify table purposes
COMMENT ON TABLE public.user_plans IS 'Current active subscription state - single row per user';
COMMENT ON TABLE public.user_subscriptions IS 'Historical subscription records - multiple rows per user';
COMMENT ON TABLE public.products IS 'Product catalog items';
COMMENT ON TABLE public.catalogs IS 'Customer-specific product catalogs';
COMMENT ON TABLE public.catalog_products IS 'Junction table linking catalogs to products';
COMMENT ON TABLE public.customer_responses IS 'Customer feedback and interactions with catalogs';
COMMENT ON TABLE public.user_usage IS 'Usage tracking for subscription limits';

-- 3. Optimize catalogs table
ALTER TABLE public.catalogs
    DROP COLUMN IF EXISTS company_id,
    ADD COLUMN IF NOT EXISTS description text,
    ADD COLUMN IF NOT EXISTS website_url text,
    ADD COLUMN IF NOT EXISTS theme jsonb DEFAULT '{"primary_color": "#4F46E5", "secondary_color": "#10B981"}';

-- 4. Optimize products table
ALTER TABLE public.products
    DROP COLUMN IF EXISTS company_id,
    ADD COLUMN IF NOT EXISTS description text,
    ADD COLUMN IF NOT EXISTS price decimal(10,2),
    ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}';

-- 5. Add better indexing
-- Products indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_supplier ON public.products(supplier);
CREATE INDEX IF NOT EXISTS idx_products_code ON public.products(code);
CREATE INDEX IF NOT EXISTS idx_products_active_user ON public.products(user_id) WHERE isactive = true;

-- Catalogs indexes
CREATE INDEX IF NOT EXISTS idx_catalogs_active_user ON public.catalogs(user_id) WHERE archived_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_catalogs_shareable ON public.catalogs(shareable_link);

-- Customer responses indexes
CREATE INDEX IF NOT EXISTS idx_customer_responses_catalog ON public.customer_responses(catalog_id);
CREATE INDEX IF NOT EXISTS idx_customer_responses_email ON public.customer_responses(customer_email);

-- Subscription indexes
CREATE INDEX IF NOT EXISTS idx_user_plans_active ON public.user_plans(user_id) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_active ON public.user_subscriptions(user_id, created_at DESC);

-- 6. Add useful views
CREATE OR REPLACE VIEW public.active_catalogs AS
SELECT c.*, 
       COUNT(DISTINCT cp.product_id) as product_count,
       COUNT(DISTINCT cr.id) as response_count
FROM catalogs c
LEFT JOIN catalog_products cp ON c.id = cp.catalog_id
LEFT JOIN customer_responses cr ON c.id = cr.catalog_id
WHERE c.archived_at IS NULL
GROUP BY c.id;

CREATE OR REPLACE VIEW public.product_stats AS
SELECT p.*,
       COUNT(DISTINCT cp.catalog_id) as catalog_count,
       COUNT(DISTINCT c.id) filter (where c.archived_at is null) as active_catalog_count
FROM products p
LEFT JOIN catalog_products cp ON p.id = cp.product_id
LEFT JOIN catalogs c ON cp.catalog_id = c.id
WHERE p.isactive = true
GROUP BY p.id;

-- 7. Add helpful functions
CREATE OR REPLACE FUNCTION public.search_products(
    search_term text,
    user_id uuid,
    include_archived boolean DEFAULT false
) RETURNS SETOF products AS $$
BEGIN
    RETURN QUERY
    SELECT p.*
    FROM products p
    WHERE p.user_id = search_products.user_id
    AND (
        include_archived OR p.archived_at IS NULL
    )
    AND (
        p.name ILIKE '%' || search_term || '%'
        OR p.code ILIKE '%' || search_term || '%'
        OR p.category ILIKE '%' || search_term || '%'
        OR p.supplier ILIKE '%' || search_term || '%'
    )
    ORDER BY 
        CASE WHEN p.name ILIKE search_term || '%' THEN 0
             WHEN p.name ILIKE '%' || search_term || '%' THEN 1
             ELSE 2
        END,
        p.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Update RLS policies
-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalog_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_responses ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
    -- Products policies
    DROP POLICY IF EXISTS "Users can view their own products" ON public.products;
    DROP POLICY IF EXISTS "Users can insert their own products" ON public.products;
    DROP POLICY IF EXISTS "Users can update their own products" ON public.products;
    
    -- Catalogs policies
    DROP POLICY IF EXISTS "Users can view their own catalogs" ON public.catalogs;
    DROP POLICY IF EXISTS "Anyone can view shared catalogs" ON public.catalogs;
    DROP POLICY IF EXISTS "Users can manage their own catalogs" ON public.catalogs;
    
    -- Customer responses policies
    DROP POLICY IF EXISTS "Users can view responses to their catalogs" ON public.customer_responses;
    DROP POLICY IF EXISTS "Anyone can submit responses" ON public.customer_responses;
END $$;

-- Products policies
CREATE POLICY "Users can view their own products"
    ON public.products FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own products"
    ON public.products FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own products"
    ON public.products FOR UPDATE
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

-- 9. Ensure data consistency
-- Sync user_plans with latest user_subscriptions
INSERT INTO public.user_plans (
    user_id,
    plan_id,
    status,
    current_period_start,
    current_period_end,
    cancel_at_period_end,
    stripe_subscription_id,
    stripe_customer_id
)
SELECT DISTINCT ON (user_id)
    user_id,
    plan_id,
    status,
    current_period_start,
    current_period_end,
    cancel_at_period_end,
    stripe_subscription_id,
    stripe_customer_id
FROM public.user_subscriptions
WHERE NOT EXISTS (
    SELECT 1 FROM public.user_plans up 
    WHERE up.user_id = user_subscriptions.user_id
)
ORDER BY user_id, created_at DESC;

-- 10. Add triggers for usage tracking
CREATE OR REPLACE FUNCTION update_catalog_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.user_usage
        SET catalog_count = catalog_count + 1
        WHERE user_id = NEW.user_id;
    ELSIF TG_OP = 'DELETE' AND OLD.archived_at IS NULL THEN
        UPDATE public.user_usage
        SET catalog_count = catalog_count - 1
        WHERE user_id = OLD.user_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER catalog_stats_trigger
    AFTER INSERT OR DELETE ON public.catalogs
    FOR EACH ROW
    EXECUTE FUNCTION update_catalog_stats();

CREATE OR REPLACE FUNCTION update_product_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.user_usage
        SET image_count = image_count + 1
        WHERE user_id = NEW.user_id;
    ELSIF TG_OP = 'DELETE' AND OLD.archived_at IS NULL THEN
        UPDATE public.user_usage
        SET image_count = image_count - 1
        WHERE user_id = OLD.user_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER product_stats_trigger
    AFTER INSERT OR DELETE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION update_product_stats();
