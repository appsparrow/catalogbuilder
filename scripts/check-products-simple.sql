-- Simple check for products for paid@streakzilla.com
-- This will show us exactly what's in the database

-- Get user ID
SELECT id as user_id FROM auth.users WHERE email = 'paid@streakzilla.com';

-- Show all products for this user
SELECT 
    id,
    name,
    code,
    category,
    supplier,
    archived_at,
    created_at,
    user_id
FROM public.products 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'paid@streakzilla.com')
ORDER BY created_at DESC;

-- Count products by status
SELECT 
    CASE 
        WHEN archived_at IS NULL THEN 'Active'
        ELSE 'Archived'
    END as status,
    COUNT(*) as count
FROM public.products 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'paid@streakzilla.com')
GROUP BY (archived_at IS NULL);
