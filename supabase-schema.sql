-- Run this in the Supabase SQL Editor

-- Profiles (extends auth.users)
create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  phone text unique,
  full_name text,
  surname text,
  username text unique,
  gender text,
  age integer,
  address text,
  is_admin boolean default false,
  created_at timestamptz default now()
);

-- Products
create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10,2) not null,
  category text not null,
  images text[] default '{}',
  sizes text[] default '{}',
  stock integer default 0,
  active boolean default true,
  created_at timestamptz default now()
);

-- Orders
create table orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) not null,
  items jsonb not null,
  total numeric(10,2) not null,
  status text default 'pending_confirmation',
  phone text not null,
  address text not null,
  created_at timestamptz default now()
);

-- RLS
alter table profiles enable row level security;
alter table products enable row level security;
alter table orders enable row level security;

create policy "Users view own profile" on profiles for select using (auth.uid() = id);
create policy "Users update own profile" on profiles for update using (auth.uid() = id);

create policy "Anyone views active products" on products for select using (active = true);
create policy "Admins manage products" on products for all using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);

create policy "Users view own orders" on orders for select using (auth.uid() = user_id);
create policy "Users create orders" on orders for insert with check (auth.uid() = user_id);
create policy "Admins manage orders" on orders for all using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, phone, full_name, surname, username, gender, age)
  values (
    new.id,
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'surname',
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'gender',
    (new.raw_user_meta_data->>'age')::integer
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- To make a user admin, run:
-- update profiles set is_admin = true where phone = '+1234567890';
