-- Create a table to persist unprocessed products uploaded by users
CREATE TABLE IF NOT EXISTS public.unprocessed_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  original_image_url TEXT,
  name TEXT,
  code TEXT,
  category TEXT,
  supplier TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.unprocessed_products ENABLE ROW LEVEL SECURITY;

-- Broad allow-all policy to match existing project pattern
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'unprocessed_products' AND policyname = 'Allow all operations on unprocessed_products'
  ) THEN
    CREATE POLICY "Allow all operations on unprocessed_products"
    ON public.unprocessed_products
    FOR ALL
    USING (true)
    WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'unprocessed_products' AND policyname = 'Public can view unprocessed products'
  ) THEN
    CREATE POLICY "Public can view unprocessed products"
    ON public.unprocessed_products
    FOR SELECT
    USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'unprocessed_products' AND policyname = 'Public can insert unprocessed products'
  ) THEN
    CREATE POLICY "Public can insert unprocessed products"
    ON public.unprocessed_products
    FOR INSERT
    WITH CHECK (true);
  END IF;
END$$;