UPDATE ami_chart
  SET name = concat('2025 ', name)
WHERE name NOT LIKE '%2026%';
