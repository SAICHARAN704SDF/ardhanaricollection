begin;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('store-media','store-media',false,5242880,array['image/jpeg','image/png','image/webp']) on conflict(id) do nothing;
create policy ardhanari_media_read on storage.objects for select to anon,authenticated using(bucket_id='store-media' and exists(select 1 from public.media_assets a where a.storage_path=name and public.media_visible(a.id)));
create policy ardhanari_media_upload on storage.objects for insert to authenticated with check(bucket_id='store-media' and (public.has_permission('catalog') or public.has_permission('content')));
create policy ardhanari_media_delete on storage.objects for delete to authenticated using(bucket_id='store-media' and (public.has_permission('catalog') or public.has_permission('content')) and not exists(select 1 from public.media_assets a where a.storage_path=name));
grant insert,delete on public.media_assets to authenticated;
create policy asset_upload on public.media_assets for insert with check((public.has_permission('catalog') or public.has_permission('content')) and uploaded_by=auth.jwt()->>'sub');
create policy asset_delete on public.media_assets for delete using((public.has_permission('catalog') or public.has_permission('content')) and not exists(select 1 from public.product_media m where m.asset_id=media_assets.id) and not exists(select 1 from public.collections c where c.data->>'image'='/api/media/'||media_assets.id::text) and not exists(select 1 from public.website_content c where strpos(c.data::text,'/api/media/'||media_assets.id::text)>0));
commit;
