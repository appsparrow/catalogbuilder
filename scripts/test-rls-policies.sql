-- Test RLS policies for products table
-- This will help us understand if RLS is blocking the query

-- First, let's see what RLS policies exist
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'products'
ORDER BY policyname;

-- Test query as the paid@streakzilla.com user
-- (This simulates what the app would see)
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claims" = '{"sub": "6f6e7f2e-b397-4052-8bb1-4bff75d80f47"}';

-- Try to select products
SELECT 
    id,
    name,
    archived_at,
    user_id
FROM public.products 
WHERE user_id = '6f6e7f2e-b397-4052-8bb1-4bff75d80f47'
ORDER BY created_at DESC;

-- Reset role
RESET ROLE;
