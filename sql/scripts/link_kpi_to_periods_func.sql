/* Links KPI to Period table based on Frequency. */
CREATE OR REPLACE FUNCTION link_kpi_to_periods()
RETURNS TRIGGER AS $$
DECLARE
  curr_year integer;
BEGIN
  -- Get the current year
  curr_year := EXTRACT(YEAR FROM NOW());

  IF NEW.frequency_id IS NOT NULL THEN
    IF NEW.frequency_id = (SELECT id FROM frequency WHERE type = 'Monthly') THEN
      -- Link KPI to all months of the current year if not already linked
      FOR i IN 1..12 LOOP
        INSERT INTO kpi_period (kpi_id, period_id)
        SELECT NEW.id, p.id
        FROM period p
        WHERE p.month = i AND p.year = curr_year
        ON CONFLICT (kpi_id, period_id) DO NOTHING;
      END LOOP;
    ELSIF NEW.frequency_id = (SELECT id FROM frequency WHERE type = 'Quarterly') THEN
      -- Link KPI to all quarters of the current year if not already linked
      FOR i IN 1..4 LOOP
        INSERT INTO kpi_period (kpi_id, period_id)
        SELECT NEW.id, p.id
        FROM period p
        WHERE p.quarter = i AND p.year = curr_year
        ON CONFLICT (kpi_id, period_id) DO NOTHING;
      END LOOP;
    ELSIF NEW.frequency_id = (SELECT id FROM frequency WHERE type = 'Yearly') THEN
      -- Link KPI to the current year if not already linked
      INSERT INTO kpi_period (kpi_id, period_id)
      SELECT NEW.id, p.id
      FROM period p
      WHERE p.year = curr_year and p.quarter is null and p.month is null
      ON CONFLICT (kpi_id, period_id) DO NOTHING;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

/* Trigger to run above function whenever a new KPI is added. */
CREATE TRIGGER add_period_to_kpi_trigger
AFTER INSERT ON kpi
FOR EACH ROW
EXECUTE FUNCTION link_kpi_to_periods();