-- DANGER: Test reset. Run in Supabase SQL editor (not in production).
-- Order matters due to foreign keys.

-- Junctions first
TRUNCATE TABLE public.catalog_products RESTART IDENTITY CASCADE;

-- Dependent tables
TRUNCATE TABLE public.customer_responses RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.unprocessed_products RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.products RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.catalogs RESTART IDENTITY CASCADE;

-- Subscription-related (keep users)
TRUNCATE TABLE public.user_usage RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.user_subscriptions RESTART IDENTITY CASCADE;

-- Storage note: run admin-wipe (storage) to clear R2 objects
