-- Email strings move onto their own scope so they can be edited in Partners. A value added here
-- cannot be used until this transaction commits, so anything writing it lives in a later migration.
ALTER TYPE "site_enum" ADD VALUE 'email';
