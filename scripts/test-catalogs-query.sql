-- Test catalogs query for paid@streakzilla.com
-- This will help us understand if catalogs exist and if the query works

-- First, let's see what catalogs exist for this user
SELECT 
    id,
    name,
    brand_name,
    shareable_link,
    archived_at,
    user_id,
    created_at
FROM public.catalogs 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'paid@streakzilla.com')
ORDER BY created_at DESC;

-- Count total catalogs
SELECT COUNT(*) as total_catalogs
FROM public.catalogs 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'paid@streakzilla.com');

-- Count active catalogs (not archived)
SELECT COUNT(*) as active_catalogs
FROM public.catalogs 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'paid@streakzilla.com')
AND archived_at IS NULL;

-- Test the exact query the app would use (with catalog_products join)
SELECT 
    c.*,
    cp.product_id,
    p.name as product_name
FROM public.catalogs c
LEFT JOIN public.catalog_products cp ON c.id = cp.catalog_id
LEFT JOIN public.products p ON cp.product_id = p.id
WHERE c.user_id = (SELECT id FROM auth.users WHERE email = 'paid@streakzilla.com')
AND c.archived_at IS NULL
ORDER BY c.created_at DESC;
