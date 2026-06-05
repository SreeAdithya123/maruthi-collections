-- Saree photos: a public Storage bucket that admins write to and everyone reads.
-- Up to 4 images per product are uploaded here from the Curator Studio; their
-- public URLs are saved on the product (data.images). Falls back to the woven
-- swatch when a saree has no photos.

insert into storage.buckets (id, name, public)
values ('saree-images', 'saree-images', true)
on conflict (id) do nothing;

-- Public (anon + authenticated) may read every object in this bucket.
drop policy if exists "saree_images_public_read" on storage.objects;
create policy "saree_images_public_read" on storage.objects
  for select using (bucket_id = 'saree-images');

-- Only admins may add / change / remove objects.
drop policy if exists "saree_images_admin_insert" on storage.objects;
create policy "saree_images_admin_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'saree-images' and public.is_admin());

drop policy if exists "saree_images_admin_update" on storage.objects;
create policy "saree_images_admin_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'saree-images' and public.is_admin())
  with check (bucket_id = 'saree-images' and public.is_admin());

drop policy if exists "saree_images_admin_delete" on storage.objects;
create policy "saree_images_admin_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'saree-images' and public.is_admin());
