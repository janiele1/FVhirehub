-- Create a new private bucket for video responses
insert into storage.buckets (id, name, public) values ('videos', 'videos', false);

-- Policy to allow candidates (anon) to upload videos
create policy "Allow public uploads"
on storage.objects for insert
to anon
with check ( bucket_id = 'videos' );

-- Policy to allow authenticated users (Admins) to view videos
create policy "Allow authenticated view"
on storage.objects for select
to authenticated
using ( bucket_id = 'videos' );
