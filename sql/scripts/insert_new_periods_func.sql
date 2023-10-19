/* Insert new rows in Period table whenever new year starts. */
create or replace function insert_new_periods(new_year integer)
returns void
as
$$
DECLARE
  new_year integer;
BEGIN
  -- Get the current year
  new_year := EXTRACT(YEAR FROM NOW());

  -- for monthly periods
  for new_month in 1..12 LOOP
  if not exists (
    select 1 from period where year = new_year and month = new_month
  ) then
  insert into period (year, month)
  values(new_year, new_month);
  end if;
  end loop;

  -- for quarterly periods
  for new_qt in 1..4 LOOP
  if not exists (
    select 1 from period where year = new_year and quarter = new_qt
  ) then
  insert into period (year, quarter)
  values(new_year, new_qt);
  end if;
  end loop;

  -- for yearly periods
  if not exists (
    select 1 from period where year = new_year and month is null and quarter is null
  ) then
  insert into period (year)
  values(new_year);
  end if;
end;
$$
language plpgsql;

/* Run above function before new KPI is inserted and if it's January 1st. */
create or replace trigger insert_new_year_periods_trigger
before insert on kpi
for each statement
when (extract(month from now()) = 1 and extract(day from now()) = 1)
execute function public.insert_new_periods();