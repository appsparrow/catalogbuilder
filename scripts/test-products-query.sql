-- Test products query for paid@streakzilla.com
-- This will help us understand if the query works in SQL

-- First, let's see what products exist for this user
SELECT 
    id,
    name,
    code,
    category,
    supplier,
    archived_at,
    user_id,
    created_at
FROM public.products 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'paid@streakzilla.com')
ORDER BY created_at DESC;

-- Count total products
SELECT COUNT(*) as total_products
FROM public.products 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'paid@streakzilla.com');

-- Count active products (not archived)
SELECT COUNT(*) as active_products
FROM public.products 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'paid@streakzilla.com')
AND archived_at IS NULL;

-- Test the exact query the app would use
SELECT *
FROM public.products 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'paid@streakzilla.com')
AND archived_at IS NULL
ORDER BY created_at DESC;
