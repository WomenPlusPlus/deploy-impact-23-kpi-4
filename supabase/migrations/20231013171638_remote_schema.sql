alter table "public"."users" enable row level security;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_public_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  insert into public.users (id, email, role)
  values (new.id, new.email, new.role);
  return new;
end;
$function$
;

create policy "Enable read access for all users"
on "public"."users"
as permissive
for select
to public
using (true);



