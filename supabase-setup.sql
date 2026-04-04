-- 1) Haberler tablosu
create table if not exists public.news_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  image_url text,
  is_published boolean not null default true,
  published_at timestamptz default now(),
  created_at timestamptz not null default now()
);

-- 2) RLS
alter table public.news_items enable row level security;

-- 3) Herkes yalnızca yayınlanan haberleri okuyabilsin
create policy if not exists "public_read_published_news"
on public.news_items
for select
using (is_published = true);

-- 4) Giriş yapan kullanıcılar haber ekleyip silebilsin
create policy if not exists "auth_insert_news"
on public.news_items
for insert
to authenticated
with check (true);

create policy if not exists "auth_delete_news"
on public.news_items
for delete
to authenticated
using (true);

-- 5) (Opsiyonel) giriş yapan kullanıcılar haber düzenleyebilsin
create policy if not exists "auth_update_news"
on public.news_items
for update
to authenticated
using (true)
with check (true);
