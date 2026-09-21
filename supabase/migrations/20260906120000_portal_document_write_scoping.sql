-- Scope portal write-access to request documents to the owner's own dossiers.
--
-- Problem this fixes
-- ------------------
--  * public."requestDocuments" INSERT/UPDATE/DELETE for portal users only
--    checked `created_by = auth.uid()`. A logged-in portal user could attach or
--    modify document rows on ANY request (requestId is an unchecked bigint).
--  * storage.objects in bucket 'request-documents' allowed INSERT/UPDATE/DELETE
--    for every authenticated user. Storage keys are "<requestId>/<docId>_<name>"
--    with sequential ids, so a portal user could overwrite or delete files that
--    belong to other owners.
--
-- After this migration a portal user can only write a document that belongs,
-- through requests -> addresses -> owners, to their own portal account. Staff
-- and admin keep full access (via role check / the existing staff-admin policy).

--------------------------------------------------------------------------------
-- Helpers (SECURITY DEFINER so the ownership check is not itself subject to RLS)
--------------------------------------------------------------------------------
create or replace function public.portal_user_owns_request(p_request_id bigint)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.requests r
    join public.addresses a on a.id = r."addressId"
    join public.owners o on o.id = a."ownerId"
    where r.id = p_request_id
      and (o.portal_user_id = auth.uid() or o.created_by = auth.uid())
  );
$$;

-- Storage key layout is "<requestId>/<documentId>_<filename>". The CASE guard
-- makes sure the ::bigint cast only runs when the first path segment is numeric,
-- so a non-matching object name denies cleanly instead of raising an error.
create or replace function public.portal_user_owns_storage_object(p_object_name text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select case
    when p_object_name ~ '^[0-9]+/'
      then public.portal_user_owns_request(split_part(p_object_name, '/', 1)::bigint)
    else false
  end;
$$;

revoke all on function public.portal_user_owns_request(bigint) from public;
revoke all on function public.portal_user_owns_storage_object(text) from public;
grant execute on function public.portal_user_owns_request(bigint) to authenticated;
grant execute on function public.portal_user_owns_storage_object(text) to authenticated;

--------------------------------------------------------------------------------
-- public."requestDocuments" — replace the created_by-only write policies.
-- Staff/admin already have full access via "RequestDocuments: staff/admin full
-- access" (FOR ALL), so these policies only need the portal branch.
--------------------------------------------------------------------------------
drop policy if exists "RequestDocuments: users can insert own" on public."requestDocuments";
drop policy if exists "RequestDocuments: users can update own" on public."requestDocuments";
drop policy if exists "RequestDocuments: users can delete own" on public."requestDocuments";
drop policy if exists "RequestDocuments: portal users can insert own" on public."requestDocuments";
drop policy if exists "RequestDocuments: portal users can update own" on public."requestDocuments";
drop policy if exists "RequestDocuments: portal users can delete own" on public."requestDocuments";

create policy "RequestDocuments: portal users can insert own"
  on public."requestDocuments"
  for insert
  to authenticated
  with check (
    "created_by" = auth.uid()
    and public.portal_user_owns_request("requestId")
  );

create policy "RequestDocuments: portal users can update own"
  on public."requestDocuments"
  for update
  to authenticated
  using (
    "created_by" = auth.uid()
    and public.portal_user_owns_request("requestId")
  )
  with check (
    "created_by" = auth.uid()
    and public.portal_user_owns_request("requestId")
  );

create policy "RequestDocuments: portal users can delete own"
  on public."requestDocuments"
  for delete
  to authenticated
  using (
    "created_by" = auth.uid()
    and public.portal_user_owns_request("requestId")
  );

--------------------------------------------------------------------------------
-- storage.objects (bucket: request-documents) — scope writes to the owner chain.
--------------------------------------------------------------------------------
drop policy if exists "request-documents: authenticated write" on storage.objects;
drop policy if exists "request-documents: authenticated update" on storage.objects;
drop policy if exists "request-documents: authenticated delete" on storage.objects;
drop policy if exists "request-documents: owner-chain write" on storage.objects;
drop policy if exists "request-documents: owner-chain update" on storage.objects;
drop policy if exists "request-documents: owner-chain delete" on storage.objects;

create policy "request-documents: owner-chain write"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'request-documents'
    and (
      public.get_user_role(auth.uid()) = any (array['staff'::public.app_role, 'admin'::public.app_role])
      or public.portal_user_owns_storage_object(name)
    )
  );

create policy "request-documents: owner-chain update"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'request-documents'
    and (
      public.get_user_role(auth.uid()) = any (array['staff'::public.app_role, 'admin'::public.app_role])
      or public.portal_user_owns_storage_object(name)
    )
  )
  with check (
    bucket_id = 'request-documents'
    and (
      public.get_user_role(auth.uid()) = any (array['staff'::public.app_role, 'admin'::public.app_role])
      or public.portal_user_owns_storage_object(name)
    )
  );

create policy "request-documents: owner-chain delete"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'request-documents'
    and (
      public.get_user_role(auth.uid()) = any (array['staff'::public.app_role, 'admin'::public.app_role])
      or public.portal_user_owns_storage_object(name)
    )
  );
