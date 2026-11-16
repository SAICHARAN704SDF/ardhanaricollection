begin;
create schema if not exists private;
revoke all on schema private from public;
create type public.publication_status as enum ('draft','published','archived');
create table public.admin_roles (name text primary key, permissions text[] not null);
insert into public.admin_roles values ('owner',array['catalog','content','orders','inventory','refunds','customers']),('editor',array['catalog','content']),('fulfilment',array['orders','inventory']);
create table public.admin_users (clerk_user_id text primary key check(clerk_user_id like 'user_%'), role text not null references public.admin_roles(name), active boolean not null default true, created_at timestamptz not null default now());
create function public.has_permission(permission text) returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.admin_users u join public.admin_roles r on r.name=u.role where u.clerk_user_id=auth.jwt()->>'sub' and u.active and permission=any(r.permissions));
$$;
create table public.catalog_revision (id boolean primary key default true check(id), revision bigint not null default 0);
insert into public.catalog_revision default values;
create table public.categories (id text primary key, name text not null unique, publication public.publication_status not null default 'draft');
create table public.collections (slug text primary key check(slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'), data jsonb not null check(jsonb_typeof(data)='object'), name text generated always as (data->>'name') stored not null, publication public.publication_status not null default 'draft', position integer not null default 0, updated_at timestamptz not null default now(), check(length(name) between 1 and 120));
create table public.products (
 id text primary key, slug text not null unique check(slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'), data jsonb not null check(jsonb_typeof(data)='object'),
 name text generated always as (data->>'name') stored not null,
 price_paise bigint not null check(price_paise between 1 and 1000000000), compare_at_paise bigint check(compare_at_paise>=price_paise),
 currency text not null default 'INR' check(currency='INR'), category_id text references public.categories(id),
 publication public.publication_status not null default 'draft', featured boolean not null default false, position integer not null default 0,
 updated_at timestamptz not null default now(), check(length(name) between 1 and 120)
);
-- Textile descriptions, fabric composition, feel, weave, border, pallu, blouse,
-- dimensions, weight and care arrays live in products.data, preserving the UI contract.
create table public.product_collections (product_id text references public.products(id) on delete cascade, collection_slug text references public.collections(slug) on update cascade on delete restrict, primary key(product_id,collection_slug));
create table public.product_variants (
 product_id text references public.products(id) on delete cascade, id text not null, name text not null check(length(name)>0), color_hex text not null check(color_hex ~ '^#[a-fA-F0-9]{6}$'),
 sku text unique, active boolean not null default true, stock integer not null default 0 check(stock>=0), reserved integer not null default 0 check(reserved>=0 and reserved<=stock), primary key(product_id,id)
);
create table public.media_assets (id uuid primary key default gen_random_uuid(), storage_path text unique not null, mime_type text not null check(mime_type in ('image/jpeg','image/png','image/webp')), bytes integer not null check(bytes between 1 and 5242880), uploaded_by text not null, created_at timestamptz not null default now());
create table public.product_media (id uuid primary key default gen_random_uuid(), product_id text not null references public.products(id) on delete cascade, asset_id uuid references public.media_assets(id) on delete restrict, src text not null, alt text not null default '', kind text not null check(kind in ('image','macro','video','model')), detail text, position integer not null default 0);
create table public.website_content (key text primary key, data jsonb not null check(jsonb_typeof(data)='object'), publication public.publication_status not null default 'draft', version integer not null default 1, updated_at timestamptz not null default now());
-- Banners, navigation, policies, homepage sections and quiz configuration are typed
-- content documents; avoid separate identical tables for every editable text block.
create table public.customer_profiles (clerk_user_id text primary key default (auth.jwt()->>'sub') check(clerk_user_id like 'user_%'), display_name text not null default '', created_at timestamptz not null default now());
create table public.customer_addresses (id uuid primary key default gen_random_uuid(), customer_id text not null default (auth.jwt()->>'sub') references public.customer_profiles(clerk_user_id), name text not null, phone text not null, street text not null, city text not null, state text not null, postal_code text not null check(postal_code ~ '^[1-9][0-9]{5}$'), country text not null default 'IN' check(country='IN'), is_default boolean not null default false);
create unique index one_default_address on public.customer_addresses(customer_id) where is_default;
create table public.carts (id uuid primary key default gen_random_uuid(), customer_id text not null unique references public.customer_profiles(clerk_user_id), updated_at timestamptz not null default now());
create table public.cart_items (cart_id uuid references public.carts(id) on delete cascade, product_id text not null, variant_id text not null, quantity integer not null check(quantity between 1 and 10), primary key(cart_id,product_id,variant_id), foreign key(product_id,variant_id) references public.product_variants(product_id,id));
create table public.wishlist_items (customer_id text references public.customer_profiles(clerk_user_id), product_id text references public.products(id) on delete cascade, created_at timestamptz not null default now(), primary key(customer_id,product_id));
create table public.coupons (code text primary key check(code=upper(code)), kind text not null check(kind in ('percent','fixed')), value integer not null check(value>0), minimum_paise bigint not null default 0 check(minimum_paise>=0), maximum_discount_paise bigint check(maximum_discount_paise>0), starts_at timestamptz not null default now(), ends_at timestamptz, max_uses integer check(max_uses>0), uses integer not null default 0 check(uses>=0), active boolean not null default false, check(kind<>'percent' or value<=100), check(ends_at is null or ends_at>starts_at));
create table public.orders (id uuid primary key default gen_random_uuid(), customer_id text not null references public.customer_profiles(clerk_user_id), request_key uuid not null, status text not null default 'pending_payment' check(status in ('pending_payment','paid','processing','shipped','delivered','cancelled','refunded')), subtotal_paise bigint not null check(subtotal_paise>0), discount_paise bigint not null default 0 check(discount_paise>=0 and discount_paise<=subtotal_paise), shipping_paise bigint not null default 0 check(shipping_paise>=0), total_paise bigint generated always as (subtotal_paise-discount_paise+shipping_paise) stored, currency text not null default 'INR' check(currency='INR'), coupon_code text references public.coupons(code), shipping_address jsonb not null, created_at timestamptz not null default now(), expires_at timestamptz not null default now()+interval '30 minutes', unique(customer_id,request_key));
create table public.order_items (id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id), product_id text not null, variant_id text not null, name text not null, variant_name text not null, quantity integer not null check(quantity between 1 and 10), unit_price_paise bigint not null check(unit_price_paise>0), unique(order_id,product_id,variant_id), foreign key(product_id,variant_id) references public.product_variants(product_id,id));
create table public.payment_transactions (id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id), provider text not null, provider_payment_id text not null, amount_paise bigint not null check(amount_paise>0), currency text not null check(currency='INR'), status text not null check(status in ('created','verified','failed')), verified_at timestamptz, created_at timestamptz not null default now(), unique(provider,provider_payment_id));
create table public.refunds (id uuid primary key default gen_random_uuid(), payment_id uuid not null references public.payment_transactions(id), provider_refund_id text unique, amount_paise bigint not null check(amount_paise>0), reason text not null, status text not null default 'requested' check(status in ('requested','processing','succeeded','failed')), created_at timestamptz not null default now());
create table public.shipments (id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id), carrier text not null, tracking_number text not null, tracking_url text check(tracking_url is null or tracking_url like 'https://%'), status text not null default 'preparing' check(status in ('preparing','dispatched','in_transit','delivered','returned')), created_at timestamptz not null default now(), unique(carrier,tracking_number));
create table public.shipment_events (id uuid primary key default gen_random_uuid(), shipment_id uuid not null references public.shipments(id), description text not null, happened_at timestamptz not null default now());
create table public.reviews (id uuid primary key default gen_random_uuid(), product_id text not null references public.products(id), customer_id text not null default (auth.jwt()->>'sub') references public.customer_profiles(clerk_user_id), rating integer not null check(rating between 1 and 5), body text not null check(length(body) between 1 and 3000), publication public.publication_status not null default 'draft', created_at timestamptz not null default now(), unique(product_id,customer_id));
create table public.inventory_movements (id bigint generated always as identity primary key, product_id text not null, variant_id text not null, stock_delta integer not null, reserved_delta integer not null, actor text, created_at timestamptz not null default now(), foreign key(product_id,variant_id) references public.product_variants(product_id,id));
create table public.audit_logs (id bigint generated always as identity primary key, actor text, entity text not null, entity_key text, operation text not null, created_at timestamptz not null default now());
-- Deliberately exclude before/after private payloads from audit records.
create index products_public on public.products(publication,featured,position);
create index products_search on public.products using gin(to_tsvector('simple',name));
create index collection_products on public.product_collections(collection_slug,product_id);
create index media_product_order on public.product_media(product_id,position);
create index media_asset on public.product_media(asset_id);
create index addresses_owner on public.customer_addresses(customer_id);
create index orders_customer on public.orders(customer_id,created_at desc);
create index orders_expiry on public.orders(expires_at) where status='pending_payment';
create index items_order on public.order_items(order_id);
create index payments_order on public.payment_transactions(order_id);
create index refunds_payment on public.refunds(payment_id);
create index shipments_order on public.shipments(order_id);
create index shipment_events_parent on public.shipment_events(shipment_id);
create index reviews_product on public.reviews(product_id,publication);
create index audit_date on public.audit_logs(created_at desc);
create index inventory_variant on public.inventory_movements(product_id,variant_id);
commit;
