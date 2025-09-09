-- Migration: Remove Stripe Integration
-- Description: Removes all Stripe-related tables and components

-- 1. Drop Stripe-related tables
DROP TABLE IF EXISTS public.user_subscriptions CASCADE;
DROP TABLE IF EXISTS public.user_plans CASCADE;

-- 2. Drop unused tables
DROP TABLE IF EXISTS public.companies CASCADE;
DROP TABLE IF EXISTS public.admin_emails CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- 3. Create user_limits table for feature management
CREATE TABLE IF NOT EXISTS public.user_limits (
    user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    max_products integer NOT NULL DEFAULT 100,
    max_catalogs integer NOT NULL DEFAULT 10,
    is_admin boolean NOT NULL DEFAULT false,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 4. Initialize limits for existing users
INSERT INTO public.user_limits (user_id)
SELECT id FROM auth.users
WHERE NOT EXISTS (
    SELECT 1 FROM public.user_limits ul 
    WHERE ul.user_id = auth.users.id
);

-- 5. Add RLS to user_limits
ALTER TABLE public.user_limits ENABLE ROW LEVEL SECURITY;

-- 6. Update policies for user_limits
DO $$ 
BEGIN
    -- Drop existing policies
    DROP POLICY IF EXISTS "Users can view their own limits" ON public.user_limits;
    DROP POLICY IF EXISTS "Admins can update limits" ON public.user_limits;
END $$;

-- Create new policies
CREATE POLICY "Users can view their own limits"
    ON public.user_limits FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Admins can update limits"
    ON public.user_limits FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_limits
            WHERE user_id = auth.uid() AND is_admin = true
        )
    );

-- 7. Add function to update limits with timestamp
CREATE OR REPLACE FUNCTION update_user_limits_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_limits_timestamp
    BEFORE UPDATE ON public.user_limits
    FOR EACH ROW
    EXECUTE FUNCTION update_user_limits_updated_at();
