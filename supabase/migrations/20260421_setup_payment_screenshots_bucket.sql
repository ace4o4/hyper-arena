-- 1. Create the storage bucket for payment screenshots
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-screenshots', 'payment-screenshots', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow public access to view the screenshots
CREATE POLICY "Public payment screenshots access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'payment-screenshots');

-- 3. Allow authenticated users to upload screenshots
CREATE POLICY "Authenticated users can upload payment screenshots"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'payment-screenshots');

-- 4. Allow users to update their own uploads (if they need to overwrite)
CREATE POLICY "Users can update their own payment screenshots"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'payment-screenshots');

-- 5. Allow users to delete screenshots
CREATE POLICY "Users can delete payment screenshots"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'payment-screenshots');
