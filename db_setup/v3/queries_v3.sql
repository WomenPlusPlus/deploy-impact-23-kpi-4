SELECT 
    dp.id AS datapoint_id,
    u.username AS user,
    u.email AS user_email,
    c.name AS circle,
    k.name AS kpi,
    p.year AS year,
    p.month AS month,
    a.value AS value,
    a.timestamp AS timestamp
FROM datapoints dp
JOIN circle_kpi ck ON dp.circle_kpi_id = ck.id
JOIN circles c ON ck.circle_id = c.id
JOIN kpis k ON ck.kpi_id = k.id
JOIN periods p ON dp.period_id = p.id
JOIN audits a ON dp.value_id = a.id
JOIN users u ON a.user_id = u.id
WHERE 
    c.name = 'HR' 
    AND k.name = 'share of teams constituted as circles' 
    AND p.year = 2023;

SELECT 
    u.username,
    COUNT(dp.id) AS datapoint_count
FROM datapoints dp
JOIN audits a ON dp.value_id = a.id
JOIN users u ON a.user_id = u.id
GROUP BY u.username
ORDER BY datapoint_count DESC;
