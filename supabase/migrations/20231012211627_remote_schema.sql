create role economist;

create role gatekeeper;

alter table "public"."users" drop constraint "users_role_id_fkey";

alter table "public"."audit" drop constraint "audit_circle_kpi_id_fkey";

alter table "public"."audit" drop constraint "audit_period_id_fkey";

alter table "public"."audit" drop constraint "audit_user_id_fkey";

alter table "public"."user_circle" drop constraint "user_circle_user_id_fkey";

alter table "public"."roles" drop constraint "roles_pkey";

drop index if exists "public"."roles_pkey";

drop table "public"."roles";

alter table "public"."user_circle" alter column "circle_id" set not null;

alter table "public"."user_circle" alter column "user_id" set not null;

alter table "public"."users" drop column "role_id";

alter table "public"."users" add column "email" character varying not null;

alter table "public"."users" add column "role" character varying not null;

alter table "public"."users" disable row level security;

alter table "public"."audit" add constraint "audit_circle_kpi_id_fkey" FOREIGN KEY (circle_kpi_id) REFERENCES circle_kpi(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."audit" validate constraint "audit_circle_kpi_id_fkey";

alter table "public"."audit" add constraint "audit_period_id_fkey" FOREIGN KEY (period_id) REFERENCES period(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."audit" validate constraint "audit_period_id_fkey";

alter table "public"."audit" add constraint "audit_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."audit" validate constraint "audit_user_id_fkey";

alter table "public"."user_circle" add constraint "user_circle_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."user_circle" validate constraint "user_circle_user_id_fkey";

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

create policy "Allow economists to see KPIs assigned to their circle"
on "public"."kpi"
as permissive
for select
to economist
using ((EXISTS ( SELECT 1
   FROM ((users u
     JOIN user_circle uc ON ((u.id = uc.user_id)))
     JOIN circle_kpi ck ON ((uc.circle_id = ck.circle_id)))
  WHERE ((u.id = (CURRENT_USER)::uuid) AND (ck.kpi_id = kpi.id)))));


create policy "Give ALL permissions to gatekeeper to KPI table"
on "public"."kpi"
as permissive
for all
to gatekeeper
using (true)
with check (true);



