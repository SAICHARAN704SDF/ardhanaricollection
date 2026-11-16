begin;
create function public.save_shopping(lines jsonb, wishes jsonb) returns void language plpgsql security definer set search_path='' as $$
declare uid text:=auth.jwt()->>'sub'; cid uuid; line jsonb; pid text;
begin
 if uid is null or uid not like 'user_%' then raise exception 'Sign in required' using errcode='42501'; end if;
 if jsonb_typeof(lines)<>'array' or jsonb_typeof(wishes)<>'array' or jsonb_array_length(lines)>100 or jsonb_array_length(wishes)>200 then raise exception 'Too many items'; end if;
 insert into public.customer_profiles(clerk_user_id) values(uid) on conflict do nothing;
 insert into public.carts(customer_id) values(uid) on conflict(customer_id) do update set updated_at=now() returning id into cid;
 delete from public.cart_items where cart_id=cid;
 for line in select value from jsonb_array_elements(lines) loop
 if not exists(select 1 from public.products p join public.product_variants v on v.product_id=p.id where p.id=line->>'productId' and v.id=line->>'variantId' and p.publication='published' and v.active) then continue; end if;
 insert into public.cart_items values(cid,line->>'productId',line->>'variantId',(line->>'quantity')::integer);
 end loop;
 delete from public.wishlist_items where customer_id=uid;
 for pid in select jsonb_array_elements_text(wishes) loop
 if exists(select 1 from public.products where id=pid and publication='published') then insert into public.wishlist_items(customer_id,product_id) values(uid,pid) on conflict do nothing; end if;
 end loop;
end;$$;
create function public.place_order(lines jsonb, address jsonb, request_id uuid, coupon text default null) returns public.orders language plpgsql security definer set search_path='' as $$
declare uid text:=auth.jwt()->>'sub'; result public.orders; item jsonb; v public.product_variants; p public.products; qty integer; subtotal bigint:=0; discount bigint:=0; shipping bigint; offer public.coupons; line_count integer;
begin
 if uid is null or uid not like 'user_%' then raise exception 'Sign in required' using errcode='42501'; end if;
 perform pg_advisory_xact_lock(hashtext(uid||request_id::text));
 select * into result from public.orders where customer_id=uid and request_key=request_id;
 if found then return result; end if;
 if jsonb_typeof(lines)<>'array' or jsonb_array_length(lines) not between 1 and 100 then raise exception 'Your bag is empty or too large'; end if;
 select count(distinct (x->>'productId',x->>'variantId')) into line_count from jsonb_array_elements(lines) x;
 if line_count<>jsonb_array_length(lines) then raise exception 'Duplicate bag items'; end if;
 if coalesce(address->>'name','')='' or coalesce(address->>'phone','')='' or coalesce(address->>'street','')='' or coalesce(address->>'city','')='' or coalesce(address->>'state','')='' or coalesce(address->>'postalCode','') !~ '^[1-9][0-9]{5}$' then raise exception 'Complete the delivery address'; end if;
 select (data->>'shippingPaise')::bigint into shipping from public.website_content where key='checkout' and publication='published';
 if shipping is null or shipping<0 then raise exception 'Delivery pricing is not configured. Please contact the store.'; end if;
 -- Stable lock order prevents overselling and cross-cart deadlocks.
 for item in select value from jsonb_array_elements(lines) order by value->>'productId',value->>'variantId' loop
 qty:=(item->>'quantity')::integer;
 if qty not between 1 and 10 or (item->>'quantity')::numeric<>qty then raise exception 'Invalid quantity'; end if;
 select * into p from public.products where id=item->>'productId' and publication='published' for share;
 if not found then raise exception 'A product is no longer available'; end if;
 select * into v from public.product_variants where product_id=p.id and id=item->>'variantId' for update;
 if not found or not v.active or v.stock-v.reserved<qty then raise exception 'Not enough stock for this selection'; end if;
 subtotal:=subtotal+p.price_paise*qty;
 end loop;
 if nullif(trim(coupon),'') is not null then
 select * into offer from public.coupons where code=upper(trim(coupon)) for update;
 if not found or not offer.active or offer.starts_at>now() or offer.ends_at<=now() or subtotal<offer.minimum_paise or (offer.max_uses is not null and offer.uses>=offer.max_uses) then raise exception 'This coupon is not available'; end if;
 discount:=case when offer.kind='percent' then floor(subtotal*offer.value/100.0) else offer.value end;
 discount:=least(subtotal,discount,coalesce(offer.maximum_discount_paise,subtotal));
 update public.coupons set uses=uses+1 where code=offer.code;
 end if;
 insert into public.customer_profiles(clerk_user_id) values(uid) on conflict do nothing;
 insert into public.orders(customer_id,request_key,subtotal_paise,discount_paise,shipping_paise,coupon_code,shipping_address) values(uid,request_id,subtotal,discount,shipping,offer.code,address) returning * into result;
 for item in select value from jsonb_array_elements(lines) loop
 select * into p from public.products where id=item->>'productId';
 select * into v from public.product_variants where product_id=p.id and id=item->>'variantId';
 qty:=(item->>'quantity')::integer;
 insert into public.order_items(order_id,product_id,variant_id,name,variant_name,quantity,unit_price_paise) values(result.id,p.id,v.id,p.name,v.name,qty,p.price_paise);
 update public.product_variants set reserved=reserved+qty where product_id=p.id and id=v.id;
 end loop;
 delete from public.cart_items where cart_id in(select id from public.carts where customer_id=uid);
 return result;
end;$$;
create function public.cancel_pending_order(order_uuid uuid) returns void language plpgsql security definer set search_path='' as $$
declare o public.orders; item public.order_items;
begin
 select * into o from public.orders where id=order_uuid for update;
 if not found or not coalesce((o.customer_id=auth.jwt()->>'sub' or public.has_permission('orders') or auth.jwt()->>'role'='service_role'),false) then raise exception 'Not permitted' using errcode='42501'; end if;
 if o.status='cancelled' then return; end if;
 if o.status<>'pending_payment' then raise exception 'Only unpaid orders can be cancelled here'; end if;
 for item in select * from public.order_items where order_id=o.id order by product_id,variant_id loop
 update public.product_variants set reserved=reserved-item.quantity where product_id=item.product_id and id=item.variant_id;
 end loop;
 update public.orders set status='cancelled' where id=o.id;
 update public.coupons set uses=greatest(0,uses-1) where code=o.coupon_code;
end;$$;
-- Only a future verified payment webhook/backend may execute this function.
-- No frontend or admin session receives EXECUTE privileges.
create function public.confirm_verified_payment(order_uuid uuid, provider_name text, payment_id text, amount bigint) returns void language plpgsql security definer set search_path='' as $$
declare o public.orders; item public.order_items;
begin
 select * into o from public.orders where id=order_uuid for update;
 if not found then raise exception 'Order not found'; end if;
 if exists(select 1 from public.payment_transactions where provider=provider_name and provider_payment_id=payment_id and order_id=o.id and status='verified') then return; end if;
 if o.status<>'pending_payment' or amount<>o.total_paise or o.expires_at<now() then raise exception 'Payment amount or order state does not match'; end if;
 insert into public.payment_transactions(order_id,provider,provider_payment_id,amount_paise,currency,status,verified_at) values(o.id,provider_name,payment_id,amount,'INR','verified',now());
 for item in select * from public.order_items where order_id=o.id order by product_id,variant_id loop
 update public.product_variants set stock=stock-item.quantity,reserved=reserved-item.quantity where product_id=item.product_id and id=item.variant_id;
 end loop;
 update public.orders set status='paid' where id=o.id;
end;$$;
-- Refund request is an audited instruction, never a claim that money was returned.
create function public.request_refund(payment_uuid uuid, amount bigint, explanation text) returns uuid language plpgsql security definer set search_path='' as $$
declare payment public.payment_transactions; result uuid;
begin
 if not public.has_permission('refunds') then raise exception 'Refund permission required' using errcode='42501'; end if;
 select * into payment from public.payment_transactions where id=payment_uuid for update;
 if not found or payment.status<>'verified' or amount<=0 or amount+coalesce((select sum(amount_paise) from public.refunds where payment_id=payment_uuid and status<>'failed'),0)>payment.amount_paise then raise exception 'Invalid refund amount'; end if;
 insert into public.refunds(payment_id,amount_paise,reason) values(payment_uuid,amount,explanation) returning id into result;return result;
end;$$;
revoke all on function public.save_shopping(jsonb,jsonb),public.place_order(jsonb,jsonb,uuid,text),public.cancel_pending_order(uuid),public.confirm_verified_payment(uuid,text,text,bigint),public.request_refund(uuid,bigint,text) from public;
grant execute on function public.save_shopping(jsonb,jsonb),public.place_order(jsonb,jsonb,uuid,text),public.cancel_pending_order(uuid),public.request_refund(uuid,bigint,text) to authenticated;
grant execute on function public.confirm_verified_payment(uuid,text,text,bigint),public.cancel_pending_order(uuid) to service_role;
commit;
