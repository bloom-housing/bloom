-- In deployment, these commands need to be run to set up the database
-- if we're using RDS or the like and not the postgres container.
-- We don't do it here because the postgres container handles it.

-- Drop non-constraint indexes on public.applications (keeps PK/unique constraints)
DO $do$
DECLARE
  r record;
BEGIN
  FOR r IN
    SELECT n.nspname AS schema_name,
           i.relname AS index_name
    FROM pg_class t
    JOIN pg_namespace n     ON n.oid = t.relnamespace
    JOIN pg_index ix        ON ix.indrelid = t.oid
    JOIN pg_class i         ON i.oid = ix.indexrelid
    LEFT JOIN pg_constraint c ON c.conindid = ix.indexrelid
    WHERE n.nspname = 'public'
      AND t.relname = 'applications'
      AND c.oid IS NULL
  LOOP
    EXECUTE format('DROP INDEX IF EXISTS %I.%I;', r.schema_name, r.index_name);
  END LOOP;
END
$do$;

-- Truncate only if the table already exists
DO $do$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'applications'
  ) THEN
    EXECUTE 'TRUNCATE TABLE public.applications RESTART IDENTITY CASCADE';
  END IF;
END
$do$;

CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,
    portal_url TEXT,
    listing_id UUID,
    application_id UUID,
    submission_date TIMESTAMP WITH TIME ZONE,
    submission_type TEXT,
    application_language TEXT,
    homeaddress_census_tract TEXT,
    homeaddress_city TEXT,
    homeaddress_state TEXT CHECK (length(homeaddress_state) = 2),
    homeaddress_zip_code TEXT,
    send_mail_to_mailing_address BOOLEAN,
    phone_number_type TEXT,
    has_no_phone BOOLEAN,
    has_no_email BOOLEAN,
    alternatecontact_type TEXT,
    alternatecontact_agency TEXT,
    alternatecontact_other_type TEXT,
    household_size INTEGER,
    income NUMERIC(10, 2),
    income_period TEXT,
    income_vouchers BOOLEAN,
    accessibility_vision BOOLEAN,
    accessibility_mobility BOOLEAN,
    accessibility_hearing BOOLEAN,
    applicant_age INTEGER,
    student_in_household_almost_18 BOOLEAN,
    household_expecting_changes BOOLEAN,
    race TEXT[],
    ethnicity TEXT,
    gender TEXT,
    sexual_orientation TEXT,
    spoken_language TEXT,
    how_did_you_hear TEXT[],
    programs JSONB,
    preferences JSONB,
    number_children INTEGER,
    number_seniors INTEGER,
    household_age_0 INTEGER,
    household_relationship_0 TEXT,
    household_age_1 INTEGER,
    household_relationship_1 TEXT,
    household_age_2 INTEGER,
    household_relationship_2 TEXT,
    household_age_3 INTEGER,
    household_relationship_3 TEXT,
    household_age_4 INTEGER,
    household_relationship_4 TEXT,
    household_age_5 INTEGER,
    household_relationship_5 TEXT,
    household_age_6 INTEGER,
    household_relationship_6 TEXT,
    household_age_7 INTEGER,
    household_relationship_7 TEXT,
    household_age_8 INTEGER,
    household_relationship_8 TEXT,
    household_age_9 INTEGER,
    household_relationship_9 TEXT,
    household_age_10 INTEGER,
    household_relationship_10 TEXT,
    household_age_11 INTEGER,
    household_relationship_11 TEXT,
    household_age_12 INTEGER,
    household_relationship_12 TEXT,
    household_age_13 INTEGER,
    household_relationship_13 TEXT,
    household_age_14 INTEGER,
    household_relationship_14 TEXT,
    household_age_15 INTEGER,
    household_relationship_15 TEXT
);
