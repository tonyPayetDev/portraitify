-- Create the artworks table function
create or replace function create_artworks_table()
returns void
language plpgsql
security definer
as $$
begin
  -- Drop the table if it exists
  drop table if exists artworks;

  -- Create the table
  create table artworks (
    id text primary key,
    title text not null,
    artist text not null,
    year integer not null,
    description text,
    image_url text not null,
    category text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
  );

  -- Create RLS policies
  alter table artworks enable row level security;

  -- Policy for public read access
  create policy "Public can view artworks"
    on artworks for select
    using (true);

  -- Policy for all users to insert/update
  create policy "All users can manage artworks"
    on artworks for all
    using (true)
    with check (true);
end;
$$;
