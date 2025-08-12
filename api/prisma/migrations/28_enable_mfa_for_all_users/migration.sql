UPDATE "user_accounts" 
SET "mfa_enabled"='true' 
WHERE "id" IN (
  SELECT "user_id" 
  FROM "user_roles" 
  WHERE "is_admin"='true' OR "is_partner"='true' OR "is_jurisdictional_admin"='true'
)