-- Test the bloom_readonly expected permissions.
\set ON_ERROR_STOP on

DO $$
BEGIN
  -- Should succeed (PERFORM is like a SELECT but the results are discarded).
  PERFORM id FROM jurisdictions;
  RAISE NOTICE 'SELECT: OK';

  -- Should fail
  BEGIN
    INSERT INTO applicant DEFAULT VALUES;
    RAISE EXCEPTION 'INSERT unexpectedly succeeded';
  EXCEPTION WHEN insufficient_privilege THEN
      RAISE NOTICE 'INSERT: correctly denied';
  END;
END $$;
