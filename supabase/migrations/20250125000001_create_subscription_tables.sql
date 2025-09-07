-- Create user_subscriptions table
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id TEXT NOT NULL DEFAULT 'free',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid')),
    current_period_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    current_period_end TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '1 month',
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    stripe_subscription_id TEXT,
    stripe_customer_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_usage table for tracking usage stats
CREATE TABLE IF NOT EXISTS public.user_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    image_count INTEGER DEFAULT 0,
    catalog_count INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON public.user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_usage_user_id ON public.user_usage(user_id);

-- Enable Row Level Security
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_usage ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Users can insert their own subscriptions" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Users can update their own subscriptions" ON public.user_subscriptions;

DROP POLICY IF EXISTS "Users can view their own usage" ON public.user_usage;
DROP POLICY IF EXISTS "Users can insert their own usage" ON public.user_usage;
DROP POLICY IF EXISTS "Users can update their own usage" ON public.user_usage;

-- Create RLS policies for user_subscriptions
CREATE POLICY "Users can view their own subscriptions" ON public.user_subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions" ON public.user_subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" ON public.user_subscriptions
    FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for user_usage
CREATE POLICY "Users can view their own usage" ON public.user_usage
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage" ON public.user_usage
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage" ON public.user_usage
    FOR UPDATE USING (auth.uid() = user_id);

-- Create function to update user_usage when products/catalogs change
CREATE OR REPLACE FUNCTION update_user_usage()
RETURNS TRIGGER AS $$
BEGIN
    -- Update or insert user_usage record
    INSERT INTO public.user_usage (user_id, image_count, catalog_count, updated_at)
    SELECT 
        NEW.user_id,
        (SELECT COUNT(*) FROM public.products WHERE user_id = NEW.user_id),
        (SELECT COUNT(*) FROM public.catalogs WHERE user_id = NEW.user_id),
        NOW()
    ON CONFLICT (user_id) 
    DO UPDATE SET
        image_count = (SELECT COUNT(*) FROM public.products WHERE user_id = NEW.user_id),
        catalog_count = (SELECT COUNT(*) FROM public.catalogs WHERE user_id = NEW.user_id),
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_usage_on_product_change ON public.products;
DROP TRIGGER IF EXISTS update_usage_on_catalog_change ON public.catalogs;

-- Create triggers to automatically update usage stats
CREATE TRIGGER update_usage_on_product_change
    AFTER INSERT OR UPDATE OR DELETE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION update_user_usage();

CREATE TRIGGER update_usage_on_catalog_change
    AFTER INSERT OR UPDATE OR DELETE ON public.catalogs
    FOR EACH ROW
    EXECUTE FUNCTION update_user_usage();

-- Initialize usage for existing users (only for users with data)
INSERT INTO public.user_usage (user_id, image_count, catalog_count)
SELECT 
    u.id,
    COALESCE(p.image_count, 0),
    COALESCE(c.catalog_count, 0)
FROM auth.users u
LEFT JOIN (
    SELECT user_id, COUNT(*) as image_count 
    FROM public.products 
    WHERE user_id IS NOT NULL
    GROUP BY user_id
) p ON u.id = p.user_id
LEFT JOIN (
    SELECT user_id, COUNT(*) as catalog_count 
    FROM public.catalogs 
    WHERE user_id IS NOT NULL
    GROUP BY user_id
) c ON u.id = c.user_id
WHERE p.image_count > 0 OR c.catalog_count > 0
ON CONFLICT (user_id) DO NOTHING;
