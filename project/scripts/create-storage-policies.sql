-- Supprimer toutes les politiques existantes
DROP POLICY IF EXISTS "Anyone can upload artworks" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view artworks" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete artworks" ON storage.objects;
DROP POLICY IF EXISTS "Anonymous users can upload" ON storage.objects;

-- Autoriser l'insertion pour tout le monde
create policy "Public can upload artworks"
on storage.objects for insert
to public
with check (bucket_id = 'artworks');

-- Autoriser la lecture pour tout le monde
create policy "Public can view artworks"
on storage.objects for select
to public
using (bucket_id = 'artworks');

-- Supprimer toute restriction supplémentaire
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
