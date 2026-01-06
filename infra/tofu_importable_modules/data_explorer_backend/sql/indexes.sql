-- Keep output quiet when dropping non-existent indexes
SET client_min_messages TO WARNING;

------------------------------------------------------------
-- Core date and race indexes
------------------------------------------------------------

-- Global date range filter used by many reports
CREATE INDEX IF NOT EXISTS idx_submission_date
    ON applications (submission_date);

-- Race is stored as a text[] and queried with race.any(...)
CREATE INDEX IF NOT EXISTS idx_race
    ON applications USING GIN (race);

------------------------------------------------------------
-- Household size and income
------------------------------------------------------------

-- Simple household size filters and as part of income cross-tab
CREATE INDEX IF NOT EXISTS idx_household_size
    ON applications (household_size);

-- Income cross-tab metric uses (household_size, income_period, income)
CREATE INDEX IF NOT EXISTS idx_income_crosstab
    ON applications (household_size, income_period, income);

-- Annual income expression index, matching annual_income_expr:
-- CASE WHEN coalesce(income_period, 'perYear') = 'perMonth'
--      THEN income * 12
--      ELSE income
-- END
CREATE INDEX IF NOT EXISTS idx_annual_income
    ON applications (
        (
            CASE
                WHEN coalesce(income_period, 'perYear') = 'perMonth'
                    THEN income * 12
                ELSE income
            END
        )
    );

-- Same, but with submission_date to support combined date + income filters
CREATE INDEX IF NOT EXISTS idx_date_annual_income
    ON applications (
        submission_date,
        (
            CASE
                WHEN coalesce(income_period, 'perYear') = 'perMonth'
                    THEN income * 12
                ELSE income
            END
        )
    );

------------------------------------------------------------
-- Voucher usage
------------------------------------------------------------

-- Simple boolean filter and voucher usage metric
CREATE INDEX IF NOT EXISTS idx_income_vouchers
    ON applications (income_vouchers);

-- Date + voucher combined filters
CREATE INDEX IF NOT EXISTS idx_date_income_vouchers
    ON applications (submission_date, income_vouchers);

------------------------------------------------------------
-- Accessibility flags
------------------------------------------------------------

-- Individual accessibility flags used in filters and metrics
CREATE INDEX IF NOT EXISTS idx_accessibility_mobility
    ON applications (accessibility_mobility);

CREATE INDEX IF NOT EXISTS idx_accessibility_hearing
    ON applications (accessibility_hearing);

CREATE INDEX IF NOT EXISTS idx_accessibility_vision
    ON applications (accessibility_vision);

-- Date + accessibility combined filters
CREATE INDEX IF NOT EXISTS idx_date_accessibility_mobility
    ON applications (submission_date, accessibility_mobility);

CREATE INDEX IF NOT EXISTS idx_date_accessibility_hearing
    ON applications (submission_date, accessibility_hearing);

CREATE INDEX IF NOT EXISTS idx_date_accessibility_vision
    ON applications (submission_date, accessibility_vision);

------------------------------------------------------------
-- Geography: city, census tract, ZIP
------------------------------------------------------------

-- City is filtered via normalized_city_expr(homeaddress_city), whose SQL form is:
-- regexp_replace(
--     lower(coalesce(initcap(nullif(trim(homeaddress_city), '')), 'Other')),
--     '[^[:alnum:]]+',
--     '',
--     'g'
-- )
-- This index matches that expression so it can be used by those filters.
CREATE INDEX IF NOT EXISTS idx_normalized_city
    ON applications (
        regexp_replace(
            lower(
                coalesce(
                    initcap(nullif(trim(homeaddress_city), '')),
                    'Other'
                )
            ),
            '[^[:alnum:]]+',
            '',
            'g'
        )
    );

-- Combined date + normalized city index for reports that filter on both
CREATE INDEX IF NOT EXISTS idx_date_normalized_city
    ON applications (
        submission_date,
        regexp_replace(
            lower(
                coalesce(
                    initcap(nullif(trim(homeaddress_city), '')),
                    'Other'
                )
            ),
            '[^[:alnum:]]+',
            '',
            'g'
        )
    );

-- Census tract: filters use the raw column with IN (...), so index the raw value
CREATE INDEX IF NOT EXISTS idx_census_tract
    ON applications (homeaddress_census_tract);

-- Date + census tract combined filters
CREATE INDEX IF NOT EXISTS idx_date_census_tract
    ON applications (submission_date, homeaddress_census_tract);

-- ZIP code: filters use the raw column with IN (...), so index the raw value
CREATE INDEX IF NOT EXISTS idx_zip_code
    ON applications (homeaddress_zip_code);

-- Date + ZIP code combined filters
CREATE INDEX IF NOT EXISTS idx_date_zip_code
    ON applications (submission_date, homeaddress_zip_code);