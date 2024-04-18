-- Convert all rule keys to lowercase
-- Then correct nameAndDOB in lowercased rule_keys

UPDATE application_flagged_set
SET rule_key = LOWER(rule_key);

UPDATE application_flagged_set
SET rule_key = REPLACE(rule_key, 'nameanddob', 'nameAndDOB');
