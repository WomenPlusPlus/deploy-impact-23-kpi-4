/* Used in RLS to validate if USER has access to a KPI. */
CREATE OR REPLACE FUNCTION check_circle(user_id uuid, kpi_id BIGINT)
RETURNS BOOLEAN AS $$
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
$$ LANGUAGE plpgsql;