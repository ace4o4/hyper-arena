-- 1. Create the storage bucket for team logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('team-logos', 'team-logos', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow public access to view the logos
CREATE POLICY "Public team logos access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'team-logos');

-- 3. Allow authenticated users to upload logos
CREATE POLICY "Authenticated users can upload logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'team-logos');

-- 4. Allow users to update their own uploads (if they need to overwrite)
CREATE POLICY "Users can update their own logos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'team-logos');

-- 5. Allow users to delete logos
CREATE POLICY "Users can delete logos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'team-logos');
