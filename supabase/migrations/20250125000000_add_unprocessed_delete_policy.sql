-- Add delete and update policies for unprocessed_products table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'unprocessed_products' AND policyname = 'Public can delete unprocessed products'
  ) THEN
    CREATE POLICY "Public can delete unprocessed products"
    ON public.unprocessed_products
    FOR DELETE
    USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'unprocessed_products' AND policyname = 'Public can update unprocessed products'
  ) THEN
    CREATE POLICY "Public can update unprocessed products"
    ON public.unprocessed_products
    FOR UPDATE
    USING (true)
    WITH CHECK (true);
  END IF;
END$$;
