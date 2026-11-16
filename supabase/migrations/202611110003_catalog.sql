begin;
create function public.get_catalog() returns jsonb language sql stable security invoker set search_path='' as $$
 select jsonb_build_object('revision',coalesce((select revision from public.catalog_revision where id),0),
 'collections',coalesce((select jsonb_agg(c.data||jsonb_build_object('slug',c.slug,'publication',c.publication) order by c.position,c.name) from public.collections c),'[]'::jsonb),
 'products',coalesce((select jsonb_agg(p.data||jsonb_build_object(
 'id',p.id,'slug',p.slug,'price',p.price_paise/100.0,'publication',p.publication,'featured',p.featured,'currency','INR',
 'collections',coalesce((select jsonb_agg(pc.collection_slug) from public.product_collections pc join public.collections c on c.slug=pc.collection_slug where pc.product_id=p.id),'[]'::jsonb),
 'variants',coalesce((select jsonb_agg(jsonb_build_object('id',v.id,'name',v.name,'hex',v.color_hex,'available',v.active and v.stock>v.reserved,'stock',v.stock,'reserved',v.reserved) order by v.id) from public.product_variants v where v.product_id=p.id and v.active),'[]'::jsonb),
 'inventory',case when exists(select 1 from public.product_variants v where v.product_id=p.id and v.active and v.stock>v.reserved) then 'available' else 'unavailable' end,
 'images',coalesce((select jsonb_agg(jsonb_build_object('src',m.src,'alt',m.alt) order by m.position) from public.product_media m where m.product_id=p.id and m.kind='image'),'[]'::jsonb),
 'macroImages',coalesce((select jsonb_agg(jsonb_build_object('src',m.src,'alt',m.alt,'detail',m.detail) order by m.position) from public.product_media m where m.product_id=p.id and m.kind='macro'),'[]'::jsonb)
 ) order by p.position,p.name) from public.products p),'[]'::jsonb));
$$;
create function public.save_catalog_entry(kind text, entry jsonb, expected_revision bigint, is_existing boolean default true) returns void language plpgsql security definer set search_path='' as $$
declare current_revision bigint; variant jsonb; photo jsonb; pos integer:=0; pid text; cslug text; stock_count integer;
begin
 if not public.has_permission('catalog') then raise exception 'Admin access required' using errcode='42501'; end if;
 select revision into current_revision from public.catalog_revision where id for update;
 if current_revision<>expected_revision then raise exception 'Content changed in another tab. Reload before saving.' using errcode='40001'; end if;
 if kind='collection' then
 if not is_existing and exists(select 1 from public.collections where slug=entry->>'slug') then raise exception 'This collection URL already exists'; end if;
 insert into public.collections(slug,data,publication) values(entry->>'slug',entry,(entry->>'publication')::public.publication_status)
 on conflict(slug) do update set data=excluded.data,publication=excluded.publication,updated_at=now();
 elsif kind='product' then
 pid:=entry->>'id';
 if not is_existing and exists(select 1 from public.products where id=pid) then raise exception 'This product already exists'; end if;
 if jsonb_array_length(entry->'variants')<1 then raise exception 'At least one variant is required'; end if;
 if entry->>'publication'='published' and (jsonb_array_length(entry->'images')<1 or coalesce(entry->>'composition','')='' or coalesce(entry->>'dimensions','')='' or jsonb_array_length(entry->'care')<1 or not exists(select 1 from public.collections where slug in(select jsonb_array_elements_text(entry->'collections')) and publication='published')) then raise exception 'Add photos, textile details, care and a published collection before publishing'; end if;
 insert into public.products(id,slug,data,price_paise,compare_at_paise,publication,featured) values(pid,entry->>'slug',entry- 'variants'-'images'-'macroImages'-'collections',round((entry->>'price')::numeric*100),round((entry->>'compareAtPrice')::numeric*100),(entry->>'publication')::public.publication_status,coalesce((entry->>'featured')::boolean,false))
 on conflict(id) do update set slug=excluded.slug,data=excluded.data,price_paise=excluded.price_paise,compare_at_paise=excluded.compare_at_paise,publication=excluded.publication,featured=excluded.featured,updated_at=now();
 delete from public.product_collections where product_id=pid;
 for cslug in select jsonb_array_elements_text(entry->'collections') loop
 insert into public.product_collections values(pid,cslug);
 end loop;
 update public.product_variants set active=false where product_id=pid;
 for variant in select value from jsonb_array_elements(entry->'variants') loop
 stock_count:=coalesce((variant->>'stock')::integer,0);
 if not public.has_permission('inventory') then select coalesce((select stock from public.product_variants where product_id=pid and id=variant->>'id'),0) into stock_count; end if;
 insert into public.product_variants(product_id,id,name,color_hex,active,stock) values(pid,variant->>'id',variant->>'name',variant->>'hex',true,stock_count)
 on conflict(product_id,id) do update set name=excluded.name,color_hex=excluded.color_hex,active=true,stock=excluded.stock;
 end loop;
 delete from public.product_media where product_id=pid;
 for photo in select value from jsonb_array_elements(coalesce(entry->'images','[]')||coalesce(entry->'macroImages','[]')) loop
 insert into public.product_media(product_id,asset_id,src,alt,kind,detail,position) values(pid,case when photo->>'src' like '/api/media/%' then substring(photo->>'src' from 12)::uuid else null end,photo->>'src',coalesce(photo->>'alt',''),case when photo ? 'detail' then 'macro' else 'image' end,photo->>'detail',pos);
 pos:=pos+1;
 end loop;
 else raise exception 'Unknown catalog type'; end if;
 update public.catalog_revision set revision=revision+1 where id;
end;$$;
create function public.save_content(content_key text, content_data jsonb, visibility public.publication_status, expected_version integer default 0) returns void language plpgsql security definer set search_path='' as $$
declare version_now integer;
begin
 if not public.has_permission('content') then raise exception 'Admin access required' using errcode='42501'; end if;
 perform pg_advisory_xact_lock(hashtext('content:'||content_key));
 select version into version_now from public.website_content where key=content_key;
 if coalesce(version_now,0)<>expected_version then raise exception 'This page changed. Reload before saving.' using errcode='40001'; end if;
 insert into public.website_content(key,data,publication) values(content_key,content_data,visibility)
 on conflict(key) do update set data=excluded.data,publication=excluded.publication,version=public.website_content.version+1,updated_at=now();
end;$$;
revoke all on function public.get_catalog() from public;
grant execute on function public.get_catalog() to anon,authenticated;
revoke all on function public.save_catalog_entry(text,jsonb,bigint,boolean) from public;
grant execute on function public.save_catalog_entry(text,jsonb,bigint,boolean) to authenticated;
revoke all on function public.save_content(text,jsonb,public.publication_status,integer) from public;
grant execute on function public.save_content(text,jsonb,public.publication_status,integer) to authenticated;
commit;
