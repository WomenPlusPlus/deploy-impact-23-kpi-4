alter table "public"."users" alter column "role" set default 'no_role'::character varying;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_last_signed_in_on_profiles()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
    begin
      IF (NEW.last_sign_in_at is null) THEN
        RETURN NULL;
      ELSE
        UPDATE public.users
        SET role = NEW.role
        WHERE id = (NEW.id)::uuid;
        RETURN NEW;
      END IF;
    end;
    $function$
;

CREATE OR REPLACE FUNCTION public.create_public_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  insert into public.users (id, email, role)
  values (new.id, new.email, new.role);
  return new;
end;
$function$
;


