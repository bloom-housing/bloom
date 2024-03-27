-- Paper applications were originally submitted as though they were in UTC,
-- when they should have been submitted in Pacific (PST/PDT) and converted to UTC.
-- Here we update the times to be in PST or PDT depending on when they were submitted
-- and the yearly cycle of daylight savings.

UPDATE applications
SET submission_date = submission_date + '7 hours'
WHERE submission_date IS NOT NULL
    AND submission_type = 'paper';


UPDATE applications
SET submission_date = submission_date + '1 hours'
WHERE submission_date IS NOT NULL
    AND submission_type = 'paper'
    AND (submission_date > '2024-03-10 09:00:00.000-00'
    OR (submission_date <= '2023-11-05 09:00:00.000-00' AND submission_date > '2023-03-12 09:00:00.000-00')
    OR (submission_date <= '2022-11-06 09:00:00.000-00' AND submission_date > '2022-03-13 09:00:00.000-00')
    OR (submission_date <= '2021-11-07 09:00:00.000-00' AND submission_date > '2021-03-14 09:00:00.000-00'));
