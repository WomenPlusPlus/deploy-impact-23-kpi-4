drop policy "Allow economists to see KPIs assigned to their circle" on "public"."kpi";

drop policy "Give ALL permissions to gatekeeper to KPI table" on "public"."kpi";

alter table "public"."audit" drop constraint "audit_circle_kpi_id_fkey";

alter table "public"."circle_kpi" drop constraint "circle_kpi_circle_id_fkey";

alter table "public"."circle_kpi" drop constraint "circle_kpi_kpi_id_fkey";

alter table "public"."user_circle" drop constraint "user_circle_user_id_fkey";

alter table "public"."circle_kpi" drop constraint "circle_kpi_pkey";

alter table "public"."user_circle" drop constraint "user_circle_pkey";

drop index if exists "public"."circle_kpi_pkey";

drop index if exists "public"."user_circle_pkey";

alter table "public"."circle_kpi" drop column "id";

alter table "public"."circle_kpi" alter column "circle_id" set not null;

alter table "public"."circle_kpi" alter column "circle_id" set data type integer using "circle_id"::integer;

alter table "public"."circle_kpi" alter column "created_at" drop not null;

alter table "public"."circle_kpi" alter column "kpi_id" set not null;

alter table "public"."circle_kpi" alter column "kpi_id" set data type integer using "kpi_id"::integer;

alter table "public"."circle_kpi" disable row level security;

alter table "public"."user_circle" drop column "id";

alter table "public"."user_circle" alter column "circle_id" set data type integer using "circle_id"::integer;

alter table "public"."user_circle" disable row level security;

CREATE UNIQUE INDEX kpi_circle_pkey ON public.circle_kpi USING btree (kpi_id, circle_id);

CREATE UNIQUE INDEX kpi_id_key ON public.kpi USING btree (id);

CREATE UNIQUE INDEX user_circle_pkey ON public.user_circle USING btree (user_id, circle_id);

alter table "public"."circle_kpi" add constraint "kpi_circle_pkey" PRIMARY KEY using index "kpi_circle_pkey";

alter table "public"."user_circle" add constraint "user_circle_pkey" PRIMARY KEY using index "user_circle_pkey";

alter table "public"."kpi" add constraint "kpi_id_key" UNIQUE using index "kpi_id_key";

alter table "public"."circle_kpi" add constraint "circle_kpi_circle_id_fkey" FOREIGN KEY (circle_id) REFERENCES circle(id) not valid;

alter table "public"."circle_kpi" validate constraint "circle_kpi_circle_id_fkey";

alter table "public"."circle_kpi" add constraint "circle_kpi_kpi_id_fkey" FOREIGN KEY (kpi_id) REFERENCES kpi(id) not valid;

alter table "public"."circle_kpi" validate constraint "circle_kpi_kpi_id_fkey";

alter table "public"."user_circle" add constraint "user_circle_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."user_circle" validate constraint "user_circle_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.check_circle(user_id uuid, kpi_id bigint)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
DECLARE
  is_member BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1
    FROM public.circle_kpi ck
    JOIN public.user_circle uc ON ck.circle_id = uc.circle_id
    WHERE uc.user_id = check_circle.user_id AND ck.kpi_id = check_circle.kpi_id
  ) INTO is_member;
  RETURN is_member;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.check_circle(user_id uuid, kpi_id bigint, check_kpi boolean)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
DECLARE
  is_member BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1
    FROM public.circle_kpi ck
    JOIN public.user_circle uc ON ck.circle_id = uc.circle_id
    WHERE
      uc.user_id = check_circle.user_id 
      AND ck.kpi_id = check_circle.kpi_id
  ) INTO is_member;
  RETURN is_member;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.test(kpi_id bigint)
 RETURNS bigint
 LANGUAGE plpgsql
AS $function$
DECLARE
  kpi_id BIGINT;
BEGIN
  SELECT 1 INTO kpi_id;
  RETURN kpi_id;
END;
$function$
;

create policy "Enable ALL access to Gatekeeper"
on "public"."circle"
as permissive
for all
to gatekeeper
using (true)
with check (true);


create policy "Enable SELECT access for Economist"
on "public"."circle"
as permissive
for select
to economist
using ((EXISTS ( SELECT user_circle.user_id,
    user_circle.circle_id,
    user_circle.created_at
   FROM user_circle
  WHERE (user_circle.user_id = auth.uid()))));


create policy "Enable ALL access to Gatekeeper"
on "public"."frequency"
as permissive
for all
to gatekeeper, economist
using (true)
with check (true);


create policy "Enable SELECT access to Economist"
on "public"."frequency"
as permissive
for select
to economist
using (true);


create policy "Enable ALL privileges to GK"
on "public"."kpi"
as permissive
for all
to gatekeeper
using (true)
with check (true);


create policy "Enable read access to the Economist"
on "public"."kpi"
as permissive
for select
to economist
using (check_circle(auth.uid(), id));


create policy "Enable ALL access to Gatekeeper"
on "public"."range"
as permissive
for all
to gatekeeper
using (true)
with check (true);


create policy "Enable SELECT access to Economist"
on "public"."range"
as permissive
for select
to economist
using (true);



