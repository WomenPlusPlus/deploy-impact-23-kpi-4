create table "public"."roles" (
    "id" integer not null,
    "name" text,
    "description" text
);


alter table "public"."roles" enable row level security;

create table "public"."users" (
    "id" uuid not null,
    "first_name" text,
    "last_name" text,
    "role_id" integer
);


alter table "public"."users" enable row level security;

alter table "public"."audit" alter column "value" drop not null;

CREATE UNIQUE INDEX roles_pkey ON public.roles USING btree (id);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

alter table "public"."roles" add constraint "roles_pkey" PRIMARY KEY using index "roles_pkey";

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."users" add constraint "users_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."users" validate constraint "users_id_fkey";

alter table "public"."users" add constraint "users_role_id_fkey" FOREIGN KEY (role_id) REFERENCES roles(id) not valid;

alter table "public"."users" validate constraint "users_role_id_fkey";


