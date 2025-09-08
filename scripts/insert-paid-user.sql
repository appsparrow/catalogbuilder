-- Insert paid user for testing
-- This script creates a user subscription record for paid@streakzilla.com

-- First, let's check if the user exists and get their UUID
DO $$
DECLARE
    user_uuid UUID;
BEGIN
    -- Get the UUID for paid@streakzilla.com
    SELECT id INTO user_uuid 
    FROM auth.users 
    WHERE email = 'paid@streakzilla.com';
    
    -- If user doesn't exist, create a note
    IF user_uuid IS NULL THEN
        RAISE NOTICE 'User paid@streakzilla.com not found in auth.users. Please create this user first in Supabase Auth.';
        RETURN;
    END IF;
    
    RAISE NOTICE 'Found user paid@streakzilla.com with UUID: %', user_uuid;
    
    -- Check if subscription already exists
    IF EXISTS (SELECT 1 FROM public.user_subscriptions WHERE user_id = user_uuid) THEN
        RAISE NOTICE 'Subscription already exists for paid@streakzilla.com';
    ELSE
        -- Insert user subscription for paid@streakzilla.com
        INSERT INTO public.user_subscriptions (
          id,
          user_id,
          plan_id,
          status,
          current_period_start,
          current_period_end,
          cancel_at_period_end,
          stripe_subscription_id,
          stripe_customer_id,
          created_at,
          updated_at
        ) VALUES (
          gen_random_uuid(),
          user_uuid,
          'starter',
          'active',
          NOW(),
          NOW() + INTERVAL '1 month',
          false,
          'sub_test_paid_user',
          'cus_test_paid_user',
          NOW(),
          NOW()
        );
        RAISE NOTICE 'Created new subscription for paid@streakzilla.com';
    END IF;
    
    -- Update user_usage to reflect starter plan limits
    IF EXISTS (SELECT 1 FROM public.user_usage WHERE user_id = user_uuid) THEN
        UPDATE public.user_usage 
        SET updated_at = NOW()
        WHERE user_id = user_uuid;
        RAISE NOTICE 'Updated existing usage record for paid@streakzilla.com';
    ELSE
        INSERT INTO public.user_usage (
          user_id,
          image_count,
          catalog_count,
          updated_at
        ) VALUES (
          user_uuid,
          0, -- Start with 0 images
          0, -- Start with 0 catalogs
          NOW()
        );
        RAISE NOTICE 'Created new usage record for paid@streakzilla.com';
    END IF;
    
    RAISE NOTICE 'Successfully created Starter plan subscription for paid@streakzilla.com';
END $$;

-- Instructions:
-- 1. Go to Supabase Auth and create user paid@streakzilla.com if it doesn't exist
-- 2. Run this script in Supabase SQL Editor
-- 3. The script will automatically find the user UUID and create the subscription
