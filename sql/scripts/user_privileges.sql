/* All privileges given to GATEKEEPER, ECONOMIST role. */

/* create database roles */
create role gatekeeper;
create role economist;

/* grant privileges to gatekeeper and economist */
grant gatekeeper to authenticator;
grant economist to authenticator;

-- allow roles to use public schema
grant usage on schema public to gatekeeper, economist;

grant all privileges on all tables in schema public to gatekeeper;
grant all privileges on all sequences in schema public to gatekeeper;

grant select on all tables in schema public to economist;
grant update on table public.audit to economist;
grant insert on table public.audit to economist;