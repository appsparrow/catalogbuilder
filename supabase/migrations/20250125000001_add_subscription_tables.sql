-- Create user_subscriptions table
CREATE TABLE public.user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  plan_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_usage table for tracking limits
CREATE TABLE public.user_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  image_count INTEGER DEFAULT 0,
  catalog_count INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add user_id to existing tables
ALTER TABLE public.products ADD COLUMN user_id UUID;
ALTER TABLE public.catalogs ADD COLUMN user_id UUID;
ALTER TABLE public.unprocessed_products ADD COLUMN user_id UUID;

-- Enable RLS on new tables
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_subscriptions
CREATE POLICY "Users can view own subscriptions" ON public.user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions" ON public.user_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions" ON public.user_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for user_usage
CREATE POLICY "Users can view own usage" ON public.user_usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage" ON public.user_usage
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own usage" ON public.user_usage
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for existing tables with user_id
CREATE POLICY "Users can view own products" ON public.products
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert own products" ON public.products
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own products" ON public.products
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own catalogs" ON public.catalogs
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert own catalogs" ON public.catalogs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own catalogs" ON public.catalogs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own unprocessed products" ON public.unprocessed_products
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert own unprocessed products" ON public.unprocessed_products
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own unprocessed products" ON public.unprocessed_products
  FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_stripe_subscription_id ON public.user_subscriptions(stripe_subscription_id);
CREATE INDEX idx_user_usage_user_id ON public.user_usage(user_id);
CREATE INDEX idx_products_user_id ON public.products(user_id);
CREATE INDEX idx_catalogs_user_id ON public.catalogs(user_id);
CREATE INDEX idx_unprocessed_products_user_id ON public.unprocessed_products(user_id);
