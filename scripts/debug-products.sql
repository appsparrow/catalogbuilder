-- Debug script to check products for paid@streakzilla.com
-- This will help us understand why products aren't showing

-- Get user ID for paid@streakzilla.com
DO $$
DECLARE
    user_uuid UUID;
    product_count INTEGER;
    archived_count INTEGER;
BEGIN
    -- Get the UUID for paid@streakzilla.com
    SELECT id INTO user_uuid 
    FROM auth.users 
    WHERE email = 'paid@streakzilla.com';
    
    IF user_uuid IS NULL THEN
        RAISE NOTICE 'User paid@streakzilla.com not found in auth.users';
        RETURN;
    END IF;
    
    RAISE NOTICE 'Found user paid@streakzilla.com with UUID: %', user_uuid;
    
    -- Count total products
    SELECT COUNT(*) INTO product_count
    FROM public.products 
    WHERE user_id = user_uuid;
    
    -- Count archived products
    SELECT COUNT(*) INTO archived_count
    FROM public.products 
    WHERE user_id = user_uuid 
    AND archived_at IS NOT NULL;
    
    RAISE NOTICE 'Total products: %, Archived products: %, Active products: %', 
        product_count, archived_count, (product_count - archived_count);
    
    -- Show sample products
    RAISE NOTICE 'Sample products:';
    FOR product IN 
        SELECT id, name, archived_at, created_at 
        FROM public.products 
        WHERE user_id = user_uuid 
        ORDER BY created_at DESC 
        LIMIT 5
    LOOP
        RAISE NOTICE '  ID: %, Name: %, Archived: %, Created: %', 
            product.id, product.name, product.archived_at, product.created_at;
    END LOOP;
    
END $$;
