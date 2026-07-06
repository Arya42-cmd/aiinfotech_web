-- Allow anonymous/public users to submit new applications while keeping RLS enabled.
-- Anonymous users may INSERT, but cannot SELECT, UPDATE, or DELETE applications.
-- Only authenticated recruiters/admins may read, update, or delete applications.

-- Ensure RLS remains enabled on applications.
alter table public.applications enable row level security;

-- Drop any overly permissive application policies that would allow public reads/updates/deletes.
drop policy if exists "Authenticated admins can view all applications" on public.applications;
drop policy if exists "Public users can insert applications" on public.applications;

-- Allow public/anonymous inserts for new applications.
create policy "Public users can insert applications"
  on public.applications
  for insert
  to anon, authenticated
  with check (true);

-- Allow only authenticated admins/recruiters to read applications.
create policy "Authenticated admins can view all applications"
  on public.applications
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.admins a
      where a.id = auth.uid()
    )
  );

-- Allow only authenticated admins/recruiters to update applications.
create policy "Authenticated admins can update applications"
  on public.applications
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.admins a
      where a.id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.admins a
      where a.id = auth.uid()
    )
  );

-- Allow only authenticated admins/recruiters to delete applications.
create policy "Authenticated admins can delete applications"
  on public.applications
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.admins a
      where a.id = auth.uid()
    )
  );
