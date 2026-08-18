drop policy if exists "request-documents: authenticated read"
  on storage.objects;

create policy "request-documents: owner-chain read"
  on storage.objects
  for select
  using (
    bucket_id = 'request-documents'
    and (
      public.get_user_role(auth.uid()) = any (array['staff'::public.app_role, 'admin'::public.app_role])
      or exists (
        select 1
        from public."requestDocuments" rd
        join public.requests r on r.id = rd."requestId"
        join public.addresses a on a.id = r."addressId"
        join public.owners o on o.id = a."ownerId"
        where rd."storagePath" = storage.objects.name
          and o.portal_user_id = auth.uid()
      )
    )
  );