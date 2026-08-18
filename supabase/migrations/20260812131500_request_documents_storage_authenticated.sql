drop policy if exists "request-documents: authenticated read"
  on storage.objects;

create policy "request-documents: authenticated read"
  on storage.objects
  for select
  using (
    bucket_id = 'request-documents'
    and auth.uid() is not null
  );

drop policy if exists "request-documents: authenticated write"
  on storage.objects;

create policy "request-documents: authenticated write"
  on storage.objects
  for insert
  with check (
    bucket_id = 'request-documents'
    and auth.uid() is not null
  );

drop policy if exists "request-documents: authenticated update"
  on storage.objects;

create policy "request-documents: authenticated update"
  on storage.objects
  for update
  using (
    bucket_id = 'request-documents'
    and auth.uid() is not null
  )
  with check (
    bucket_id = 'request-documents'
    and auth.uid() is not null
  );

drop policy if exists "request-documents: authenticated delete"
  on storage.objects;

create policy "request-documents: authenticated delete"
  on storage.objects
  for delete
  using (
    bucket_id = 'request-documents'
    and auth.uid() is not null
  );
