/* Used to update kpi_period table whenever a value is added for that specific KPI - Period. */

create or replace function update_kpi_period_completed()
returns trigger
as
$$
begin
-- if new entry was added for a specific kpi_period_id
if new.kpi_period_id is not null then
  update public.kpi_period
  set completed = true
  where id = new.kpi_period_id;
end if;
return new;
end;
$$
language plpgsql;

create trigger update_kpi_period_completed_trigger
after insert on public.audit
for each row
execute function update_kpi_period_completed();