-- Add isActive field to products table
ALTER TABLE public.products 
ADD COLUMN isActive BOOLEAN DEFAULT true;

-- Completely relax RLS policies for development
-- Drop all existing policies
DROP POLICY IF EXISTS "Public can view products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can manage products" ON public.products;
DROP POLICY IF EXISTS "Allow all operations on products" ON public.products;

-- Create completely permissive policy for products table
CREATE POLICY "Allow all operations on products"
ON public.products FOR ALL
USING (true)
WITH CHECK (true);

-- Ensure RLS is enabled but with permissive policies
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Update existing products to have isActive = true
UPDATE public.products SET isActive = true WHERE isActive IS NULL; 