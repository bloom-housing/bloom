-- AlterTable
ALTER TABLE "jurisdictions" ADD COLUMN "enabled_stop_light_rule_keys" TEXT[] DEFAULT ARRAY[]::TEXT[];
