
-- Drop existing restrictive policies and create more permissive ones
DROP POLICY IF EXISTS "Allow public uploads to product-images bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to product-images bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update product-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete product-images" ON storage.objects;

-- Create very permissive policies for the product-images bucket
CREATE POLICY "Allow all operations on product-images bucket"
ON storage.objects FOR ALL
USING (bucket_id = 'product-images')
WITH CHECK (bucket_id = 'product-images');

-- Ensure RLS is enabled on products table and create permissive policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow all operations on products" ON products;

-- Create permissive policy for products table
CREATE POLICY "Allow all operations on products"
ON products FOR ALL
USING (true)
WITH CHECK (true);

-- Ensure RLS is enabled on catalogs table
ALTER TABLE catalogs ENABLE ROW LEVEL SECURITY;

-- Create permissive policy for catalogs table
CREATE POLICY "Allow all operations on catalogs"
ON catalogs FOR ALL
USING (true)
WITH CHECK (true);

-- Ensure RLS is enabled on catalog_products table
ALTER TABLE catalog_products ENABLE ROW LEVEL SECURITY;

-- Create permissive policy for catalog_products table
CREATE POLICY "Allow all operations on catalog_products"
ON catalog_products FOR ALL
USING (true)
WITH CHECK (true);

-- Ensure RLS is enabled on customer_responses table
ALTER TABLE customer_responses ENABLE ROW LEVEL SECURITY;

-- Create permissive policy for customer_responses table
CREATE POLICY "Allow all operations on customer_responses"
ON customer_responses FOR ALL
USING (true)
WITH CHECK (true);
