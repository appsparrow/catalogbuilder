-- Cleanup unused tables and add website URL to company_profiles
-- This migration removes unused tables and adds missing fields

-- First, add website_url to company_profiles table
ALTER TABLE public.company_profiles 
ADD COLUMN IF NOT EXISTS website_url TEXT,
ADD COLUMN IF NOT EXISTS contact_phone TEXT;

-- Drop unused tables (in order due to foreign key constraints)
DROP TABLE IF EXISTS public.admin_emails CASCADE;
DROP TABLE IF EXISTS public.companies CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.user_subscriptions CASCADE;

-- Update company_profiles to be the main settings table
-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_company_profiles_user_id ON public.company_profiles(user_id);

-- Add RLS policies for company_profiles
ALTER TABLE public.company_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own company profile" ON public.company_profiles;
DROP POLICY IF EXISTS "Users can insert own company profile" ON public.company_profiles;
DROP POLICY IF EXISTS "Users can update own company profile" ON public.company_profiles;

-- Create RLS policies for company_profiles
CREATE POLICY "Users can view own company profile" ON public.company_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own company profile" ON public.company_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own company profile" ON public.company_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_company_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_company_profiles_updated_at
  BEFORE UPDATE ON public.company_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_company_profiles_updated_at();
