
-- Create the product-images storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true);

-- Create policy to allow public uploads to the product-images bucket
CREATE POLICY "Allow public uploads to product-images bucket"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images');

-- Create policy to allow public access to view images in product-images bucket
CREATE POLICY "Allow public access to product-images bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Create policy to allow authenticated users to update images in product-images bucket
CREATE POLICY "Allow authenticated users to update product-images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- Create policy to allow authenticated users to delete images in product-images bucket
CREATE POLICY "Allow authenticated users to delete product-images"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
