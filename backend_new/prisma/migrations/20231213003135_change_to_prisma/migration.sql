/*
  Warnings:

  - The `status` column on the `application_flagged_set` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `income_period` column on the `applications` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `language` column on the `applications` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `review_status` column on the `applications` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `listing_approval_permissions` on the `jurisdictions` table. All the data in the column will be lost.
  - The `languages` column on the `jurisdictions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `listing_images` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `listing_images` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `listing_images` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `listing_images` table. All the data in the column will be lost.
  - The primary key for the `listing_multiselect_questions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `listing_multiselect_questions` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `listing_multiselect_questions` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `listing_multiselect_questions` table. All the data in the column will be lost.
  - The `application_pick_up_address_type` column on the `listings` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `application_drop_off_address_type` column on the `listings` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `application_mailing_address_type` column on the `listings` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `language` column on the `user_accounts` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `activity_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `application_flagged_set_applications_applications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `applications_preferred_unit_unit_types` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `jurisdictions_multiselect_questions_multiselect_questions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `listings_leasing_agents_user_accounts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `revoked_tokens` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_accounts_jurisdictions_jurisdictions` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `cron_job` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[neighborhood_amenities_id]` on the table `listings` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `rule` on the `application_flagged_set` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `applications` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `submission_type` on the `applications` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `language` on the `generated_listing_translations` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `same_address` to the `household_member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `work_in_region` to the `household_member` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `language` on the `paper_applications` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `language` on the `translations` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `name` on the `unit_accessibility_priority_types` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `name` on the `unit_rent_types` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `name` on the `unit_types` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/ -- CreateEnum

CREATE TYPE "user_role_enum" AS ENUM ('user', 'partner', 'admin', 'jurisdictionAdmin');

-- CreateEnum

CREATE TYPE "languages_enum" AS ENUM ('en', 'es', 'vi', 'zh', 'tl');

-- CreateEnum

CREATE TYPE "listings_application_address_type_enum" AS ENUM ('leasingAgent');

-- CreateEnum

CREATE TYPE "yes_no_enum" AS ENUM ('yes', 'no');

-- CreateEnum

CREATE TYPE "rule_enum" AS ENUM ('nameAndDOB', 'email');

-- CreateEnum

CREATE TYPE "flagged_set_status_enum" AS ENUM ('flagged', 'pending', 'resolved');

-- CreateEnum

CREATE TYPE "income_period_enum" AS ENUM ('perMonth', 'perYear');

-- CreateEnum

CREATE TYPE "application_status_enum" AS ENUM ('draft', 'submitted', 'removed');

-- CreateEnum

CREATE TYPE "application_submission_type_enum" AS ENUM ('paper', 'electronical');

-- CreateEnum

CREATE TYPE "application_review_status_enum" AS ENUM ('pending', 'pendingAndValid', 'valid', 'duplicate');

-- CreateEnum

CREATE TYPE "units_status_enum" AS ENUM ('unknown', 'available', 'occupied', 'unavailable');

-- CreateEnum

CREATE TYPE "listings_home_type_enum" AS ENUM ('apartment', 'duplex', 'house', 'townhome');

-- CreateEnum

CREATE TYPE "listings_marketing_season_enum" AS ENUM ('spring', 'summer', 'fall', 'winter');

-- CreateEnum

CREATE TYPE "listings_marketing_type_enum" AS ENUM ('marketing', 'comingSoon');

-- CreateEnum

CREATE TYPE "property_region_enum" AS ENUM ('Greater_Downtown', 'Eastside', 'Southwest', 'Westside');

-- CreateEnum

CREATE TYPE "monthly_rent_determination_type_enum" AS ENUM ('flatRent', 'percentageOfIncome');

-- CreateEnum

CREATE TYPE "unit_rent_type_enum" AS ENUM ('fixed', 'percentageOfIncome');

-- CreateEnum

CREATE TYPE "unit_type_enum" AS ENUM ('studio', 'oneBdrm', 'twoBdrm', 'threeBdrm', 'fourBdrm', 'SRO', 'fiveBdrm');

-- CreateEnum

CREATE TYPE "unit_accessibility_priority_type_enum" AS ENUM ('mobility', 'mobilityAndHearing', 'hearing', 'visual', 'hearingAndVisual', 'mobilityAndVisual', 'mobilityHearingAndVisual');

-- DropForeignKey

ALTER TABLE "activity_logs"
DROP CONSTRAINT "FK_d54f841fa5478e4734590d44036";

-- DropForeignKey

ALTER TABLE "application_flagged_set_applications_applications"
DROP CONSTRAINT "FK_93f583f2d43fb21c5d7ceac57e7";

-- DropForeignKey

ALTER TABLE "application_flagged_set_applications_applications"
DROP CONSTRAINT "FK_bbae218ba0eff977157fad5ea31";

-- DropForeignKey

ALTER TABLE "applications_preferred_unit_unit_types"
DROP CONSTRAINT "FK_5838635fbe9294cac64d1a0b605";

-- DropForeignKey

ALTER TABLE "applications_preferred_unit_unit_types"
DROP CONSTRAINT "FK_8249d47edacc30250c18c53915a";

-- DropForeignKey

ALTER TABLE "jurisdictions_multiselect_questions_multiselect_questions"
DROP CONSTRAINT "FK_3f7126f5da7c0368aea2f9459c0";

-- DropForeignKey

ALTER TABLE "jurisdictions_multiselect_questions_multiselect_questions"
DROP CONSTRAINT "FK_ab91e5d403a6cf21656f7d5ae20";

-- DropForeignKey

ALTER TABLE "listings_leasing_agents_user_accounts"
DROP CONSTRAINT "FK_de53131bc8a08f824a5d3dd51e3";

-- DropForeignKey

ALTER TABLE "listings_leasing_agents_user_accounts"
DROP CONSTRAINT "FK_f7b22af2c421e823f60c5f7d28b";

-- DropForeignKey

ALTER TABLE "user_accounts_jurisdictions_jurisdictions"
DROP CONSTRAINT "FK_e51e812700e143101aeaabbccc6";

-- DropForeignKey

ALTER TABLE "user_accounts_jurisdictions_jurisdictions"
DROP CONSTRAINT "FK_fe359f4430f9e0e7b278e03f0f3";

-- DropIndex

DROP INDEX "UQ_87b8888186ca9769c960e926870";

-- AlterTable "accessibility"

ALTER TABLE "accessibility" RENAME CONSTRAINT "PK_9729339e162bc7ec98a8815758c" TO "accessibility_pkey";


ALTER TABLE "accessibility"
ALTER COLUMN "updated_at"
DROP DEFAULT;

-- AlterTable "address"

ALTER TABLE "address" RENAME CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" TO "address_pkey";


ALTER TABLE "address"
ALTER COLUMN "updated_at"
DROP DEFAULT;

-- AlterTable "alternate_contact"

ALTER TABLE "alternate_contact" RENAME CONSTRAINT "PK_4b35560218b2062cccb339975e7" TO "alternate_contact_pkey";


ALTER TABLE "alternate_contact"
ALTER COLUMN "updated_at"
DROP DEFAULT;

-- AlterTable "ami_chart"

ALTER TABLE "ami_chart" RENAME CONSTRAINT "PK_e079bbfad233fdc79072acb33b5" TO "ami_chart_pkey";


ALTER TABLE "ami_chart"
ALTER COLUMN "updated_at"
DROP DEFAULT;

-- AlterTable "applicant"

ALTER TABLE "applicant" RENAME CONSTRAINT "PK_f4a6e907b8b17f293eb073fc5ea" TO "applicant_pkey";


ALTER TABLE "applicant"
ALTER COLUMN "updated_at"
DROP DEFAULT;


ALTER TABLE "applicant" ADD COLUMN "work_in_region_TEMP" TEXT;


UPDATE "applicant"
SET "work_in_region_TEMP" = "work_in_region";


ALTER TABLE "applicant"
DROP COLUMN "work_in_region";


ALTER TABLE "applicant" ADD COLUMN "work_in_region" "yes_no_enum";


UPDATE "applicant"
SET "work_in_region" = CAST ("work_in_region_TEMP" AS "yes_no_enum");


ALTER TABLE "applicant"
DROP COLUMN "work_in_region_TEMP";

-- AlterTable "application_flagged_set"

ALTER TABLE "application_flagged_set" RENAME CONSTRAINT "PK_81969e689800a802b75ffd883cc" TO "application_flagged_set_pkey";


ALTER TABLE "application_flagged_set"
ALTER COLUMN "updated_at"
DROP DEFAULT;


ALTER TABLE "application_flagged_set" ADD COLUMN "rule_TEMP" VARCHAR NOT NULL;


ALTER TABLE "application_flagged_set" ADD COLUMN "status_TEMP" VARCHAR NOT NULL DEFAULT 'pending';


UPDATE "application_flagged_set"
SET "rule_TEMP" = "rule",
    "status_TEMP" = "status";


ALTER TABLE "application_flagged_set"
DROP COLUMN "rule";


ALTER TABLE "application_flagged_set" ADD COLUMN "rule" "rule_enum" NOT NULL;


ALTER TABLE "application_flagged_set"
DROP COLUMN "status";


ALTER TABLE "application_flagged_set" ADD COLUMN "status" "flagged_set_status_enum" NOT NULL DEFAULT 'pending';


UPDATE "application_flagged_set"
SET "rule" = CASE
                 WHEN "rule_TEMP" = 'Email' THEN CAST('email' as "rule_enum")
                 WHEN "rule_TEMP" = 'Name and DOB' THEN CAST ('nameAndDOB' as "rule_enum")
             END,
             "status" = CAST("status_TEMP" as "flagged_set_status_enum");


ALTER TABLE "application_flagged_set"
DROP COLUMN "rule_TEMP";


ALTER TABLE "application_flagged_set"
DROP COLUMN "status_TEMP";

-- AlterTable

ALTER TABLE "application_methods" RENAME CONSTRAINT "PK_c58506819ffaba3863a4edc5e9e" TO "application_methods_pkey";


ALTER TABLE "application_methods"
ALTER COLUMN "updated_at"
DROP DEFAULT;

-- AlterTable "applications"

ALTER TABLE "applications" RENAME CONSTRAINT "PK_938c0a27255637bde919591888f" TO "applications_pkey";


ALTER TABLE "applications"
ALTER COLUMN "updated_at"
DROP DEFAULT;


ALTER TABLE "applications" ADD COLUMN "income_period_TEMP" VARCHAR;


UPDATE "applications"
SET "income_period_TEMP" = "income_period";


ALTER TABLE "applications"
DROP COLUMN "income_period";


ALTER TABLE "applications" ADD COLUMN "income_period" "income_period_enum";


UPDATE "applications"
SET "income_period" = CAST("income_period_TEMP" as "income_period_enum");


ALTER TABLE "applications"
DROP COLUMN "income_period_TEMP";


ALTER TABLE "applications" ADD COLUMN "status_TEMP" VARCHAR NOT NULL;


UPDATE "applications"
SET "status_TEMP" = "status";


ALTER TABLE "applications"
DROP COLUMN "status";


ALTER TABLE "applications" ADD COLUMN "status" "application_status_enum" NOT NULL;


UPDATE "applications"
SET "status" = CAST("status_TEMP" as "application_status_enum");


ALTER TABLE "applications"
DROP COLUMN "status_TEMP";


ALTER TABLE "applications" ADD COLUMN "language_TEMP" VARCHAR;


UPDATE "applications"
SET "language_TEMP" = "language";


ALTER TABLE "applications"
DROP COLUMN "language";


ALTER TABLE "applications" ADD COLUMN "language" "languages_enum";


UPDATE "applications"
SET "language" = CAST("language_TEMP" as "languages_enum");


ALTER TABLE "applications"
DROP COLUMN "language_TEMP";


ALTER TABLE "applications" ADD COLUMN "submission_type_TEMP" VARCHAR NOT NULL;


UPDATE "applications"
SET "submission_type_TEMP" = "submission_type";


ALTER TABLE "applications"
DROP COLUMN "submission_type";


ALTER TABLE "applications" ADD COLUMN "submission_type" "application_submission_type_enum" NOT NULL;


UPDATE "applications"
SET "submission_type" = CAST("submission_type_TEMP" as "application_submission_type_enum");


ALTER TABLE "applications"
DROP COLUMN "submission_type_TEMP";


ALTER TABLE "applications" ADD COLUMN "review_status_TEMP" VARCHAR NOT NULL DEFAULT 'valid';


UPDATE "applications"
SET "review_status_TEMP" = "review_status";


ALTER TABLE "applications"
DROP COLUMN "review_status";


ALTER TABLE "applications" ADD COLUMN "review_status" "application_review_status_enum" NOT NULL DEFAULT 'valid';

-- TODO: unsure about this data

UPDATE "applications"
SET "review_status" = CAST("review_status_TEMP" as "application_review_status_enum");


ALTER TABLE "applications"
DROP COLUMN "review_status_TEMP";

-- AlterTable

ALTER TABLE "assets" RENAME CONSTRAINT "PK_da96729a8b113377cfb6a62439c" TO "assets_pkey";


ALTER TABLE "assets"
ALTER COLUMN "updated_at"
DROP DEFAULT;

-- AlterTable

ALTER TABLE "cron_job" RENAME CONSTRAINT "PK_3f180d097e1216411578b642513" TO "cron_job_pkey";


ALTER TABLE "cron_job"
ALTER COLUMN "updated_at"
DROP DEFAULT;

-- AlterTable

ALTER TABLE "demographics" RENAME CONSTRAINT "PK_17bf4db5727bd0ad0462c67eda9" TO "demographics_pkey";


ALTER TABLE "demographics"
ALTER COLUMN "updated_at"
DROP DEFAULT;

-- AlterTable "generated_listing_translations"

ALTER TABLE "generated_listing_translations" RENAME CONSTRAINT "PK_4059452831439aefc27c1990b20" TO "generated_listing_translations_pkey";


ALTER TABLE "generated_listing_translations"
ALTER COLUMN "updated_at"
DROP DEFAULT;


ALTER TABLE "generated_listing_translations" ADD COLUMN "language_TEMP" VARCHAR NOT NULL;


UPDATE "generated_listing_translations"
SET "language_TEMP" = "language";


ALTER TABLE "generated_listing_translations"
DROP COLUMN "language";


ALTER TABLE "generated_listing_translations" ADD COLUMN "language" "languages_enum" NOT NULL;


UPDATE "generated_listing_translations"
SET "language" = CAST("language_TEMP" as "languages_enum");


ALTER TABLE "generated_listing_translations"
DROP COLUMN "language_TEMP";

-- AlterTable "household_member"

ALTER TABLE "household_member" RENAME CONSTRAINT "PK_84e1d1f2553646d38e7c8b72a10" TO "household_member_pkey";


ALTER TABLE "household_member" ADD COLUMN "email_address" TEXT;


ALTER TABLE "household_member" ADD COLUMN "no_phone" BOOLEAN;


ALTER TABLE "household_member" ADD COLUMN "phone_number" TEXT;


ALTER TABLE "household_member" ADD COLUMN "phone_number_type" TEXT;


ALTER TABLE "household_member"
ALTER COLUMN "updated_at"
DROP DEFAULT;


ALTER TABLE "household_member" ADD COLUMN "same_address_TEMP" TEXT;


UPDATE "household_member"
SET "same_address_TEMP" = "same_address";


ALTER TABLE "household_member"
DROP COLUMN "same_address";


ALTER TABLE "household_member" ADD COLUMN "same_address" "yes_no_enum" NOT NULL;


UPDATE "household_member"
SET "same_address" = CAST("same_address_TEMP" AS "yes_no_enum");


ALTER TABLE "household_member"
DROP COLUMN "same_address_TEMP";


ALTER TABLE "household_member" ADD COLUMN "work_in_region_TEMP" TEXT;


UPDATE "household_member"
SET "work_in_region_TEMP" = "work_in_region";


ALTER TABLE "household_member"
DROP COLUMN "work_in_region";


ALTER TABLE "household_member" ADD COLUMN "work_in_region" "yes_no_enum" NOT NULL;


UPDATE "household_member"
SET "work_in_region" = CAST("work_in_region_TEMP" AS "yes_no_enum");


ALTER TABLE "household_member"
DROP COLUMN "work_in_region_TEMP";

-- AlterTable "jurisdictions"

ALTER TABLE "jurisdictions" RENAME CONSTRAINT "PK_7cc0bed21c9e2b32866c1109ec5" TO "jurisdictions_pkey";


ALTER TABLE "jurisdictions"
ALTER COLUMN "updated_at"
DROP DEFAULT;


ALTER TABLE "jurisdictions" ADD COLUMN "listing_approval_permissions_TEMP" "jurisdictions_listing_approval_permissions_enum"[];


UPDATE "jurisdictions"
SET "listing_approval_permissions_TEMP" = "listing_approval_permissions";


ALTER TABLE "jurisdictions"
DROP COLUMN "listing_approval_permissions";


ALTER TABLE "jurisdictions" ADD COLUMN "listing_approval_permission" "user_role_enum"[];


UPDATE "jurisdictions"
SET "listing_approval_permission" = CAST(CAST("listing_approval_permissions_TEMP" AS TEXT[]) AS "user_role_enum"[]);


ALTER TABLE "jurisdictions"
DROP COLUMN "listing_approval_permissions_TEMP";


ALTER TABLE "jurisdictions" ADD COLUMN "languages_TEMP" "jurisdictions_languages_enum"[];


UPDATE "jurisdictions"
SET "languages_TEMP" = "languages";


ALTER TABLE "jurisdictions"
DROP COLUMN "languages";


ALTER TABLE "jurisdictions" ADD COLUMN "languages" "languages_enum"[] DEFAULT ARRAY['en']::"languages_enum"[];


UPDATE "jurisdictions"
SET "languages" = CAST(CAST("languages_TEMP" AS TEXT[]) AS "languages_enum"[]);


ALTER TABLE "jurisdictions"
DROP COLUMN "languages_TEMP";

-- AlterTable

ALTER TABLE "listing_events" RENAME CONSTRAINT "PK_a9a209828028e14e2caf8def25c" TO "listing_events_pkey";


ALTER TABLE "listing_events"
ALTER COLUMN "updated_at"
DROP DEFAULT;

-- AlterTable "listing_features"

ALTER TABLE "listing_features" RENAME CONSTRAINT "PK_88e4fe3e46d21d8b4fdadeb7599" TO "listing_features_pkey";


ALTER TABLE "listing_features" ADD COLUMN "barrier_free_bathroom" BOOLEAN;


ALTER TABLE "listing_features" ADD COLUMN "barrier_free_unit_entrance" BOOLEAN;


ALTER TABLE "listing_features" ADD COLUMN "lowered_cabinets" BOOLEAN;


ALTER TABLE "listing_features" ADD COLUMN "lowered_light_switch" BOOLEAN;


ALTER TABLE "listing_features" ADD COLUMN "wide_doorways" BOOLEAN;


ALTER TABLE "listing_features"
ALTER COLUMN "updated_at"
DROP DEFAULT;

-- AlterTable "listing_images"

ALTER TABLE "listing_images"
DROP CONSTRAINT "PK_2abb5c9d795f27dbc4b10ced9dc";


ALTER TABLE "listing_images"
DROP COLUMN "created_at";


ALTER TABLE "listing_images"
DROP COLUMN "id";


ALTER TABLE "listing_images"
DROP COLUMN "updated_at";


ALTER TABLE "listing_images" ADD CONSTRAINT "listing_images_pkey" PRIMARY KEY ("listing_id",
                                                                               "image_id");

-- AlterTable "listing_multiselect_questions"

ALTER TABLE "listing_multiselect_questions"
DROP CONSTRAINT "PK_2ceddbd7c705edaf32f00642ce7";


ALTER TABLE "listing_multiselect_questions"
DROP COLUMN "created_at";


ALTER TABLE "listing_multiselect_questions"
DROP COLUMN "id";


ALTER TABLE "listing_multiselect_questions"
DROP COLUMN "updated_at";


ALTER TABLE "listing_multiselect_questions" ADD CONSTRAINT "listing_multiselect_questions_pkey" PRIMARY KEY ("listing_id",
                                                                                                             "multiselect_question_id");

-- AlterTable "listing_utilities"

ALTER TABLE "listing_utilities" RENAME CONSTRAINT "PK_8e88f883b389f7b31d331de764f" TO "listing_utilities_pkey";


ALTER TABLE "listing_utilities"
ALTER COLUMN "updated_at"
DROP DEFAULT;

-- AlterTable "listings"

ALTER TABLE "listings" RENAME CONSTRAINT "PK_520ecac6c99ec90bcf5a603cdcb" TO "listings_pkey";


ALTER TABLE "listings" ADD COLUMN "ami_percentage_max" INTEGER;


ALTER TABLE "listings" ADD COLUMN "ami_percentage_min" INTEGER;


ALTER TABLE "listings" ADD COLUMN "home_type" "listings_home_type_enum";


ALTER TABLE "listings" ADD COLUMN "hrd_id" TEXT;


ALTER TABLE "listings" ADD COLUMN "is_verified" BOOLEAN DEFAULT false;


ALTER TABLE "listings" ADD COLUMN "management_company" TEXT;


ALTER TABLE "listings" ADD COLUMN "management_website" TEXT;


ALTER TABLE "listings" ADD COLUMN "marketing_date" TIMESTAMPTZ(6);


ALTER TABLE "listings" ADD COLUMN "marketing_season" "listings_marketing_season_enum";


ALTER TABLE "listings" ADD COLUMN "marketing_type" "listings_marketing_type_enum" NOT NULL DEFAULT 'marketing';


ALTER TABLE "listings" ADD COLUMN "neighborhood_amenities_id" UUID;


ALTER TABLE "listings" ADD COLUMN "owner_company" TEXT;


ALTER TABLE "listings" ADD COLUMN "phone_number" TEXT;


ALTER TABLE "listings" ADD COLUMN "region" "property_region_enum";


ALTER TABLE "listings" ADD COLUMN "section8_acceptance" BOOLEAN;


ALTER TABLE "listings" ADD COLUMN "temporary_listing_id" INTEGER;


ALTER TABLE "listings" ADD COLUMN "verified_at" TIMESTAMPTZ(6);


ALTER TABLE "listings" ADD COLUMN "what_to_expect_additional_text" TEXT;


ALTER TABLE "listings"
ALTER COLUMN "updated_at"
DROP DEFAULT;


ALTER TABLE "listings" ADD COLUMN "application_pick_up_address_type_TEMP" "listings_application_pick_up_address_type_enum";


UPDATE "listings"
SET "application_pick_up_address_type_TEMP" = "application_pick_up_address_type";


ALTER TABLE "listings"
DROP COLUMN "application_pick_up_address_type";


ALTER TABLE "listings" ADD COLUMN "application_pick_up_address_type" "listings_application_address_type_enum";


UPDATE "listings"
SET "application_pick_up_address_type" = CAST(CAST("application_pick_up_address_type_TEMP" AS TEXT) AS "listings_application_address_type_enum");


ALTER TABLE "listings"
DROP COLUMN "application_pick_up_address_type_TEMP";


ALTER TABLE "listings" ADD COLUMN "application_drop_off_address_type_TEMP" "listings_application_drop_off_address_type_enum";


UPDATE "listings"
SET "application_drop_off_address_type_TEMP" = "application_drop_off_address_type";


ALTER TABLE "listings"
DROP COLUMN "application_drop_off_address_type";


ALTER TABLE "listings" ADD COLUMN "application_drop_off_address_type" "listings_application_address_type_enum";


UPDATE "listings"
SET "application_drop_off_address_type" = CAST(CAST("application_drop_off_address_type_TEMP" AS TEXT) AS "listings_application_address_type_enum");


ALTER TABLE "listings"
DROP COLUMN "application_drop_off_address_type_TEMP";


ALTER TABLE "listings" ADD COLUMN "application_mailing_address_type_TEMP" "listings_application_mailing_address_type_enum";


UPDATE "listings"
SET "application_mailing_address_type_TEMP" = "application_mailing_address_type";


ALTER TABLE "listings"
DROP COLUMN "application_mailing_address_type";


ALTER TABLE "listings" ADD COLUMN "application_mailing_address_type" "listings_application_address_type_enum";


UPDATE "listings"
SET "application_mailing_address_type" = CAST(CAST("application_mailing_address_type_TEMP" AS TEXT) AS "listings_application_address_type_enum");


ALTER TABLE "listings"
DROP COLUMN "application_mailing_address_type_TEMP";


ALTER TABLE "listings"
ALTER COLUMN "requested_changes_date"
SET DEFAULT '1970-01-01 00:00:00-07'::timestamp with time zone;

-- AlterTable

ALTER TABLE "migrations" RENAME CONSTRAINT "PK_8c82d7f526340ab734260ea46be" TO "migrations_pkey";

-- AlterTable

ALTER TABLE "multiselect_questions" RENAME CONSTRAINT "PK_671931eccff7fb3b7cf2050cce0" TO "multiselect_questions_pkey";


ALTER TABLE "multiselect_questions"
ALTER COLUMN "updated_at"
DROP DEFAULT;

-- AlterTable "paper_applications"

ALTER TABLE "paper_applications" RENAME CONSTRAINT "PK_1bc5b0234d874ec03f500621d43" TO "paper_applications_pkey";


ALTER TABLE "paper_applications"
ALTER COLUMN "updated_at"
DROP DEFAULT;


ALTER TABLE "paper_applications" ADD COLUMN "language_TEMP" VARCHAR NOT NULL;


UPDATE "paper_applications"
SET "language_TEMP" = "language";


ALTER TABLE "paper_applications"
DROP COLUMN "language";


ALTER TABLE "paper_applications" ADD COLUMN "language" "languages_enum" NOT NULL;


UPDATE "paper_applications"
SET "language" = CAST("language_TEMP" AS "languages_enum");


ALTER TABLE "paper_applications"
DROP COLUMN "language_TEMP";

-- AlterTable

ALTER TABLE "reserved_community_types" RENAME CONSTRAINT "PK_af3937276e7bb53c30159d6ca0b" TO "reserved_community_types_pkey";


ALTER TABLE "reserved_community_types"
ALTER COLUMN "updated_at"
DROP DEFAULT;

-- AlterTable

ALTER TABLE "unit_ami_chart_overrides" RENAME CONSTRAINT "PK_839676df1bd1ac12ff09b9d920d" TO "unit_ami_chart_overrides_pkey";


ALTER TABLE "unit_ami_chart_overrides"
ALTER COLUMN "updated_at"
DROP DEFAULT;

-- AlterTable

ALTER TABLE "units_summary" RENAME CONSTRAINT "PK_8d8c4940fab2a9d1b2e7ddd9e49" TO "units_summary_pkey";

-- AlterTable

ALTER TABLE "user_roles" RENAME CONSTRAINT "PK_87b8888186ca9769c960e926870" TO "user_roles_pkey";

-- AlterTable "translations"

ALTER TABLE "translations" RENAME CONSTRAINT "PK_aca248c72ae1fb2390f1bf4cd87" TO "translations_pkey";


ALTER TABLE "translations"
ALTER COLUMN "updated_at"
DROP DEFAULT;


ALTER TABLE "translations" ADD COLUMN "language_TEMP" VARCHAR NOT NULL;


UPDATE "translations"
SET "language_TEMP" = "language";


ALTER TABLE "translations"
DROP COLUMN "language";


ALTER TABLE "translations" ADD COLUMN "language" "languages_enum" NOT NULL;


UPDATE "translations"
SET "language" = CAST("language_TEMP" AS "languages_enum");


ALTER TABLE "translations"
DROP COLUMN "language_TEMP";

-- AlterTable "unit_accessibility_priority_types"

ALTER TABLE "unit_accessibility_priority_types" RENAME CONSTRAINT "PK_2cf31d2ceea36e6a6b970608565" TO "unit_accessibility_priority_types_pkey";


ALTER TABLE "unit_accessibility_priority_types"
ALTER COLUMN "updated_at"
DROP DEFAULT;


ALTER TABLE "unit_accessibility_priority_types" ADD COLUMN "name_TEMP" TEXT NOT NULL;


UPDATE "unit_accessibility_priority_types"
SET "name_TEMP" = "name";


ALTER TABLE "unit_accessibility_priority_types"
DROP COLUMN "name";


ALTER TABLE "unit_accessibility_priority_types" ADD COLUMN "name" "unit_accessibility_priority_type_enum" NOT NULL;


UPDATE "unit_accessibility_priority_types"
SET "name" = CAST("name_TEMP" AS "unit_accessibility_priority_type_enum");


ALTER TABLE "unit_accessibility_priority_types"
DROP COLUMN "name_TEMP";

-- AlterTable "unit_rent_types"

ALTER TABLE "unit_rent_types" RENAME CONSTRAINT "PK_fb6b318fdee0a5b30521f63c516" TO "unit_rent_types_pkey";


ALTER TABLE "unit_rent_types"
ALTER COLUMN "updated_at"
DROP DEFAULT;


ALTER TABLE "unit_rent_types" ADD COLUMN "name_TEMP" TEXT NOT NULL;


UPDATE "unit_rent_types"
SET "name_TEMP" = "name";


ALTER TABLE "unit_rent_types"
DROP COLUMN "name";


ALTER TABLE "unit_rent_types" ADD COLUMN "name" "unit_rent_type_enum" NOT NULL;


UPDATE "unit_rent_types"
SET "name" = CAST("name_TEMP" AS "unit_rent_type_enum");


ALTER TABLE "unit_rent_types"
DROP COLUMN "name_TEMP";

-- AlterTable "unit_types"

ALTER TABLE "unit_types" RENAME CONSTRAINT "PK_105c42fcf447c1da21fd20bcb85" TO "unit_types_pkey";


ALTER TABLE "unit_types"
ALTER COLUMN "updated_at"
DROP DEFAULT;


ALTER TABLE "unit_types" ADD COLUMN "name_TEMP" TEXT NOT NULL;


UPDATE "unit_types"
SET "name_TEMP" = "name";


ALTER TABLE "unit_types"
DROP COLUMN "name";


ALTER TABLE "unit_types" ADD COLUMN "name" "unit_type_enum" NOT NULL;


UPDATE "unit_types"
SET "name" = CAST("name_TEMP" AS "unit_type_enum");


ALTER TABLE "unit_types"
DROP COLUMN "name_TEMP";

-- AlterTable "units"

ALTER TABLE "units" RENAME CONSTRAINT "PK_5a8f2f064919b587d93936cb223" TO "units_pkey";


ALTER TABLE "units" ADD COLUMN "status" "units_status_enum" NOT NULL DEFAULT 'unknown';


ALTER TABLE "units"
ALTER COLUMN "updated_at"
DROP DEFAULT;

-- AlterTable "user_accounts"

ALTER TABLE "user_accounts" RENAME CONSTRAINT "PK_125e915cf23ad1cfb43815ce59b" TO "user_accounts_pkey";


ALTER TABLE "user_accounts"
ALTER COLUMN "updated_at"
DROP DEFAULT;


ALTER TABLE "user_accounts" ADD COLUMN "language_TEMP" VARCHAR;


UPDATE "user_accounts"
SET "language_TEMP" = "language";


ALTER TABLE "user_accounts"
DROP COLUMN "language";


ALTER TABLE "user_accounts" ADD COLUMN "language" "languages_enum";


UPDATE "user_accounts"
SET "language" = CAST("language_TEMP" AS "languages_enum");


ALTER TABLE "user_accounts"
DROP COLUMN "language_TEMP";

-- CreateTable

CREATE TABLE "activity_log" ("id" UUID NOT NULL DEFAULT uuid_generate_v4(),
                                                        "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                                                                                   "updated_at" TIMESTAMP(6) NOT NULL,
                                                                                                                             "module" VARCHAR NOT NULL,
                                                                                                                                              "record_id" UUID NOT NULL,
                                                                                                                                                               "action" VARCHAR NOT NULL,
                                                                                                                                                                                "metadata" JSONB,
                                                                                                                                                                                "user_id" UUID,
                                                                                                                                                                                CONSTRAINT "activity_log_pkey" PRIMARY KEY ("id"));


INSERT INTO "activity_log" ("created_at",
                            "updated_at",
                            "module",
                            "record_id",
                            "action",
                            "metadata",
                            "user_id")
SELECT "created_at",
       "updated_at",
       "module",
       "record_id",
       "action",
       "metadata",
       "user_id"
FROM "activity_logs";

-- DropTable

DROP TABLE "activity_logs";

-- CreateTable

CREATE TABLE "ami_chart_item" ("id" UUID NOT NULL DEFAULT uuid_generate_v4(),
                                                          "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                                                                                     "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                                                                                                                                "percent_of_ami" INTEGER NOT NULL,
                                                                                                                                                                         "household_size" INTEGER NOT NULL,
                                                                                                                                                                                                  "income" INTEGER NOT NULL,
                                                                                                                                                                                                                   "ami_chart_id" UUID,
                                                                                                                                                                                                                   CONSTRAINT "ami_chart_item_pkey" PRIMARY KEY ("id"));

-- CreateTable

CREATE TABLE "listing_neighborhood_amenities" ("id" UUID NOT NULL DEFAULT uuid_generate_v4(),
                                                                          "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                                                                                                     "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                                                                                                                                                "grocery_stores" TEXT, "pharmacies" TEXT, "health_care_resources" TEXT, "parks_and_community_centers" TEXT, "schools" TEXT, "public_transportation" TEXT, CONSTRAINT "listing_neighborhood_amenities_pkey" PRIMARY KEY ("id"));

-- CreateTable

CREATE TABLE "unit_group" ("max_occupancy" INTEGER, "min_occupancy" INTEGER, "floor_min" INTEGER, "floor_max" INTEGER, "total_count" INTEGER, "total_available" INTEGER, "priority_type_id" UUID,
                                                                                                                                                                         "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
                                                                                                                                                                                                    "listing_id" UUID,
                                                                                                                                                                                                    "bathroom_min" DECIMAL, "bathroom_max" DECIMAL, "open_waitlist" BOOLEAN NOT NULL DEFAULT true,
                                                                                                                                                                                                                                                                                             "sq_feet_min" DECIMAL, "sq_feet_max" DECIMAL, CONSTRAINT "unit_group_pkey" PRIMARY KEY ("id"));

-- CreateTable

CREATE TABLE "unit_group_ami_levels" ("id" UUID NOT NULL DEFAULT uuid_generate_v4(),
                                                                 "ami_percentage" INTEGER, "monthly_rent_determination_type" "monthly_rent_determination_type_enum" NOT NULL,
                                                                                                                                                                    "percentage_of_income_value" DECIMAL, "ami_chart_id" UUID,
                                                                                                                                                                                                          "unit_group_id" UUID,
                                                                                                                                                                                                          "flat_rent_value" DECIMAL, CONSTRAINT "unit_group_ami_levels_pkey" PRIMARY KEY ("id"));

-- CreateTable

CREATE TABLE "user_preferences" ("send_email_notifications" BOOLEAN NOT NULL DEFAULT false,
                                                                                     "send_sms_notifications" BOOLEAN NOT NULL DEFAULT false,
                                                                                                                                       "user_id" UUID NOT NULL,
                                                                                                                                                      "favorite_ids" TEXT[] DEFAULT ARRAY[]::TEXT[], CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("user_id"));

-- CreateTable

CREATE TABLE "_ApplicationFlaggedSetToApplications" ("A" UUID NOT NULL,
                                                              "B" UUID NOT NULL);


INSERT INTO "_ApplicationFlaggedSetToApplications" ("A",
                                                    "B")
SELECT "application_flagged_set_id",
       "applications_id"
FROM "application_flagged_set_applications_applications";

-- DropTable

DROP TABLE "application_flagged_set_applications_applications";

-- CreateTable

CREATE TABLE "_ApplicationsToUnitTypes" ("A" UUID NOT NULL,
                                                  "B" UUID NOT NULL);


INSERT INTO "_ApplicationsToUnitTypes" ("A",
                                        "B")
SELECT "applications_id",
       "unit_types_id"
FROM "applications_preferred_unit_unit_types";

-- DropTable

DROP TABLE "applications_preferred_unit_unit_types";

-- CreateTable

CREATE TABLE "_JurisdictionsToMultiselectQuestions" ("A" UUID NOT NULL,
                                                              "B" UUID NOT NULL);


INSERT INTO "_JurisdictionsToMultiselectQuestions" ("A",
                                                    "B")
SELECT "jurisdictions_id",
       "multiselect_questions_id"
FROM "jurisdictions_multiselect_questions_multiselect_questions";

-- DropTable

DROP TABLE "jurisdictions_multiselect_questions_multiselect_questions";

-- CreateTable

CREATE TABLE "_JurisdictionsToUserAccounts" ("A" UUID NOT NULL,
                                                      "B" UUID NOT NULL);


INSERT INTO "_JurisdictionsToUserAccounts" ("A",
                                            "B")
SELECT "jurisdictions_id",
       "user_accounts_id"
FROM "user_accounts_jurisdictions_jurisdictions";

-- DropTable

DROP TABLE "user_accounts_jurisdictions_jurisdictions";

-- CreateTable

CREATE TABLE "_ListingsToUserAccounts" ("A" UUID NOT NULL,
                                                 "B" UUID NOT NULL);


INSERT INTO "_ListingsToUserAccounts" ("A",
                                       "B")
SELECT "listings_id",
       "user_accounts_id"
FROM "listings_leasing_agents_user_accounts";

-- DropTable

DROP TABLE "listings_leasing_agents_user_accounts";

-- CreateTable

CREATE TABLE "_ListingsToUserPreferences" ("A" UUID NOT NULL,
                                                    "B" UUID NOT NULL);

-- CreateTable

CREATE TABLE "_UnitGroupToUnitTypes" ("A" UUID NOT NULL,
                                               "B" UUID NOT NULL);

-- DropTable

DROP TABLE "revoked_tokens";

-- DropEnum

DROP TYPE "jurisdictions_languages_enum";

-- DropEnum

DROP TYPE "jurisdictions_listing_approval_permissions_enum";

-- DropEnum

DROP TYPE "listings_application_drop_off_address_type_enum";

-- DropEnum

DROP TYPE "listings_application_mailing_address_type_enum";

-- DropEnum

DROP TYPE "listings_application_pick_up_address_type_enum";

-- CreateIndex

CREATE UNIQUE INDEX "user_preferences_user_id_key" ON "user_preferences"("user_id");

-- CreateIndex

CREATE UNIQUE INDEX "_ApplicationFlaggedSetToApplications_AB_unique" ON "_ApplicationFlaggedSetToApplications"("A",
                                                                                                               "B");

-- CreateIndex

CREATE INDEX "_ApplicationFlaggedSetToApplications_B_index" ON "_ApplicationFlaggedSetToApplications"("B");

-- CreateIndex

CREATE UNIQUE INDEX "_ApplicationsToUnitTypes_AB_unique" ON "_ApplicationsToUnitTypes"("A",
                                                                                       "B");

-- CreateIndex

CREATE INDEX "_ApplicationsToUnitTypes_B_index" ON "_ApplicationsToUnitTypes"("B");

-- CreateIndex

CREATE UNIQUE INDEX "_JurisdictionsToMultiselectQuestions_AB_unique" ON "_JurisdictionsToMultiselectQuestions"("A",
                                                                                                               "B");

-- CreateIndex

CREATE INDEX "_JurisdictionsToMultiselectQuestions_B_index" ON "_JurisdictionsToMultiselectQuestions"("B");

-- CreateIndex

CREATE UNIQUE INDEX "_JurisdictionsToUserAccounts_AB_unique" ON "_JurisdictionsToUserAccounts"("A",
                                                                                               "B");

-- CreateIndex

CREATE INDEX "_JurisdictionsToUserAccounts_B_index" ON "_JurisdictionsToUserAccounts"("B");

-- CreateIndex

CREATE UNIQUE INDEX "_ListingsToUserAccounts_AB_unique" ON "_ListingsToUserAccounts"("A",
                                                                                     "B");

-- CreateIndex

CREATE INDEX "_ListingsToUserAccounts_B_index" ON "_ListingsToUserAccounts"("B");

-- CreateIndex

CREATE UNIQUE INDEX "_ListingsToUserPreferences_AB_unique" ON "_ListingsToUserPreferences"("A",
                                                                                           "B");

-- CreateIndex

CREATE INDEX "_ListingsToUserPreferences_B_index" ON "_ListingsToUserPreferences"("B");

-- CreateIndex

CREATE UNIQUE INDEX "_UnitGroupToUnitTypes_AB_unique" ON "_UnitGroupToUnitTypes"("A",
                                                                                 "B");

-- CreateIndex

CREATE INDEX "_UnitGroupToUnitTypes_B_index" ON "_UnitGroupToUnitTypes"("B");

-- CreateIndex

CREATE UNIQUE INDEX "cron_job_name_key" ON "cron_job"("name");

-- CreateIndex

CREATE UNIQUE INDEX "listings_neighborhood_amenities_id_key" ON "listings"("neighborhood_amenities_id");

-- CreateIndex

CREATE UNIQUE INDEX "translations_jurisdiction_id_language_key" ON "translations"("jurisdiction_id",
                                                                                  "language");

-- RenameForeignKey

ALTER TABLE "alternate_contact" RENAME CONSTRAINT "FK_5eb038a51b9cd6872359a687b18" TO "alternate_contact_mailing_address_id_fkey";

-- RenameForeignKey

ALTER TABLE "ami_chart" RENAME CONSTRAINT "FK_5566b52b2e7c0056e3b81c171f1" TO "ami_chart_jurisdiction_id_fkey";

-- RenameForeignKey

ALTER TABLE "applicant" RENAME CONSTRAINT "FK_7d357035705ebbbe91b50346781" TO "applicant_work_address_id_fkey";

-- RenameForeignKey

ALTER TABLE "applicant" RENAME CONSTRAINT "FK_8ba2b09030c3a2b857dda5f83fe" TO "applicant_address_id_fkey";

-- RenameForeignKey

ALTER TABLE "application_flagged_set" RENAME CONSTRAINT "FK_3aed12c210529ed798beee9d09e" TO "application_flagged_set_resolving_user_id_fkey";

-- RenameForeignKey

ALTER TABLE "application_flagged_set" RENAME CONSTRAINT "FK_f2ace84eebd770f1387b47e5e45" TO "application_flagged_set_listing_id_fkey";

-- RenameForeignKey

ALTER TABLE "application_methods" RENAME CONSTRAINT "FK_3057650361c2aeab15dfee5c3cc" TO "application_methods_listing_id_fkey";

-- RenameForeignKey

ALTER TABLE "applications" RENAME CONSTRAINT "FK_194d0fca275b8661a56e486cb64" TO "applications_applicant_id_fkey";

-- RenameForeignKey

ALTER TABLE "applications" RENAME CONSTRAINT "FK_3a4c71bc34dce9f6c196f110935" TO "applications_accessibility_id_fkey";

-- RenameForeignKey

ALTER TABLE "applications" RENAME CONSTRAINT "FK_56abaa378952856aaccc64d7eb3" TO "applications_alternate_contact_id_fkey";

-- RenameForeignKey

ALTER TABLE "applications" RENAME CONSTRAINT "FK_7fc41f89f22ca59ffceab5da80e" TO "applications_alternate_address_id_fkey";

-- RenameForeignKey

ALTER TABLE "applications" RENAME CONSTRAINT "FK_9e7594d5b474d9cbebba15c1ae7" TO "applications_user_id_fkey";

-- RenameForeignKey

ALTER TABLE "applications" RENAME CONSTRAINT "FK_b72ba26ebc88981f441b30fe3c5" TO "applications_mailing_address_id_fkey";

-- RenameForeignKey

ALTER TABLE "applications" RENAME CONSTRAINT "FK_cc9d65c58d8deb0ef5353e9037d" TO "applications_listing_id_fkey";

-- RenameForeignKey

ALTER TABLE "applications" RENAME CONSTRAINT "FK_fed5da45b7b4dafd9f025a37dd1" TO "applications_demographics_id_fkey";

-- RenameForeignKey

ALTER TABLE "household_member" RENAME CONSTRAINT "FK_520996eeecf9f6fb9425dc7352c" TO "household_member_application_id_fkey";

-- RenameForeignKey

ALTER TABLE "household_member" RENAME CONSTRAINT "FK_7b61da64f1b7a6bbb48eb5bbb43" TO "household_member_address_id_fkey";

-- RenameForeignKey

ALTER TABLE "household_member" RENAME CONSTRAINT "FK_f390552cbb929761927c70b7a0d" TO "household_member_work_address_id_fkey";

-- RenameForeignKey

ALTER TABLE "listing_events" RENAME CONSTRAINT "FK_4fd176b179ce281bedb1b7b9f2b" TO "listing_events_file_id_fkey";

-- RenameForeignKey

ALTER TABLE "listing_events" RENAME CONSTRAINT "FK_d0b9892bc613e4d9f8b5c25d03e" TO "listing_events_listing_id_fkey";

-- RenameForeignKey

ALTER TABLE "listing_images" RENAME CONSTRAINT "FK_6fc0fefe11fb46d5ee863ed483a" TO "listing_images_image_id_fkey";

-- RenameForeignKey

ALTER TABLE "listing_images" RENAME CONSTRAINT "FK_94041359df3c1b14c4420808d16" TO "listing_images_listing_id_fkey";

-- RenameForeignKey

ALTER TABLE "listing_multiselect_questions" RENAME CONSTRAINT "FK_92adcb35f2f14e316b4cb12a84e" TO "listing_multiselect_questions_multiselect_question_id_fkey";

-- RenameForeignKey

ALTER TABLE "listing_multiselect_questions" RENAME CONSTRAINT "FK_d123697625fe564c2bae54dcecf" TO "listing_multiselect_questions_listing_id_fkey";

-- RenameForeignKey

ALTER TABLE "listings" RENAME CONSTRAINT "FK_17e861d96c1bde13c1f4c344cb6" TO "listings_application_drop_off_address_id_fkey";

-- RenameForeignKey

ALTER TABLE "listings" RENAME CONSTRAINT "FK_1f6fac73d27c81b656cc6100267" TO "listings_reserved_community_type_id_fkey";

-- RenameForeignKey

ALTER TABLE "listings" RENAME CONSTRAINT "FK_2634b9bcb29ec36a629d9e379f0" TO "listings_building_selection_criteria_file_id_fkey";

-- RenameForeignKey

ALTER TABLE "listings" RENAME CONSTRAINT "FK_3f7b2aedbfccd6297923943e311" TO "listings_result_id_fkey";

-- RenameForeignKey

ALTER TABLE "listings" RENAME CONSTRAINT "FK_61b80a947c9db249548ba3c73a5" TO "listings_utilities_id_fkey";

-- RenameForeignKey

ALTER TABLE "listings" RENAME CONSTRAINT "FK_7cedb0a800e3c0af7ede27ab1ec" TO "listings_application_mailing_address_id_fkey";

-- RenameForeignKey

ALTER TABLE "listings" RENAME CONSTRAINT "FK_8a93cc462d190d3f1a04fa69156" TO "listings_leasing_agent_address_id_fkey";

-- RenameForeignKey

ALTER TABLE "listings" RENAME CONSTRAINT "FK_ac59a58a02199c57a588f045830" TO "listings_features_id_fkey";

-- RenameForeignKey

ALTER TABLE "listings" RENAME CONSTRAINT "FK_ba0026e02ecfe91791aed1a4818" TO "listings_jurisdiction_id_fkey";

-- RenameForeignKey

ALTER TABLE "listings" RENAME CONSTRAINT "FK_d54596fd877e83a3126d3953f36" TO "listings_application_pick_up_address_id_fkey";

-- RenameForeignKey

ALTER TABLE "listings" RENAME CONSTRAINT "FK_e5d5291cd6ab92cbec304aab905" TO "listings_building_address_id_fkey";

-- RenameForeignKey

ALTER TABLE "paper_applications" RENAME CONSTRAINT "FK_493291d04c708dda2ffe5b521e7" TO "paper_applications_file_id_fkey";

-- RenameForeignKey

ALTER TABLE "paper_applications" RENAME CONSTRAINT "FK_bd67da96ae3e2c0e37394ba1dd3" TO "paper_applications_application_method_id_fkey";

-- RenameForeignKey

ALTER TABLE "reserved_community_types" RENAME CONSTRAINT "FK_8b43c85a0dd0c39ca795c369edc" TO "reserved_community_types_jurisdiction_id_fkey";

-- RenameForeignKey

ALTER TABLE "translations" RENAME CONSTRAINT "FK_181f8168d13457f0fd00b08b359" TO "translations_jurisdiction_id_fkey";

-- RenameForeignKey

ALTER TABLE "units" RENAME CONSTRAINT "FK_1e193f5ffdda908517e47d4e021" TO "units_unit_type_id_fkey";

-- RenameForeignKey

ALTER TABLE "units" RENAME CONSTRAINT "FK_35571c6bd2a1ff690201d1dff08" TO "units_ami_chart_id_fkey";

-- RenameForeignKey

ALTER TABLE "units" RENAME CONSTRAINT "FK_4ca3d4c823e6bd5149ecaad363a" TO "units_ami_chart_override_id_fkey";

-- RenameForeignKey

ALTER TABLE "units" RENAME CONSTRAINT "FK_6981f323d01ba8d55190480078d" TO "units_priority_type_id_fkey";

-- RenameForeignKey

ALTER TABLE "units" RENAME CONSTRAINT "FK_9aebcde52d6e054e5ac5d26228c" TO "units_listing_id_fkey";

-- RenameForeignKey

ALTER TABLE "units" RENAME CONSTRAINT "FK_ff9559bf9a1daecef4a89bad4a9" TO "units_unit_rent_type_id_fkey";

-- RenameForeignKey

ALTER TABLE "units_summary" RENAME CONSTRAINT "FK_0eae6ec11a6109496d80d9a88f9" TO "units_summary_unit_type_id_fkey";

-- RenameForeignKey

ALTER TABLE "units_summary" RENAME CONSTRAINT "FK_4791099ef82551aa9819a71d8f5" TO "units_summary_priority_type_id_fkey";

-- RenameForeignKey

ALTER TABLE "units_summary" RENAME CONSTRAINT "FK_4edda29192dbc0c6a18e15437a0" TO "units_summary_listing_id_fkey";

-- RenameForeignKey

ALTER TABLE "user_roles" RENAME CONSTRAINT "FK_87b8888186ca9769c960e926870" TO "user_roles_user_id_fkey";

-- AddForeignKey

ALTER TABLE "activity_log" ADD CONSTRAINT "activity_log_user_id_fkey"
FOREIGN KEY ("user_id") REFERENCES "user_accounts"("id") ON
DELETE
SET NULL ON
UPDATE NO ACTION;

-- AddForeignKey

ALTER TABLE "listings" ADD CONSTRAINT "listings_neighborhood_amenities_id_fkey"
FOREIGN KEY ("neighborhood_amenities_id") REFERENCES "listing_neighborhood_amenities"("id") ON
DELETE NO ACTION ON
UPDATE NO ACTION;

-- AddForeignKey

ALTER TABLE "ami_chart_item" ADD CONSTRAINT "ami_chart_item_ami_chart_id_fkey"
FOREIGN KEY ("ami_chart_id") REFERENCES "ami_chart"("id") ON
DELETE NO ACTION ON
UPDATE NO ACTION;

-- AddForeignKey

ALTER TABLE "unit_group" ADD CONSTRAINT "unit_group_listing_id_fkey"
FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON
DELETE NO ACTION ON
UPDATE NO ACTION;

-- AddForeignKey

ALTER TABLE "unit_group" ADD CONSTRAINT "unit_group_priority_type_id_fkey"
FOREIGN KEY ("priority_type_id") REFERENCES "unit_accessibility_priority_types"("id") ON
DELETE NO ACTION ON
UPDATE NO ACTION;

-- AddForeignKey

ALTER TABLE "unit_group_ami_levels" ADD CONSTRAINT "unit_group_ami_levels_unit_group_id_fkey"
FOREIGN KEY ("unit_group_id") REFERENCES "unit_group"("id") ON
DELETE NO ACTION ON
UPDATE NO ACTION;

-- AddForeignKey

ALTER TABLE "unit_group_ami_levels" ADD CONSTRAINT "unit_group_ami_levels_ami_chart_id_fkey"
FOREIGN KEY ("ami_chart_id") REFERENCES "ami_chart"("id") ON
DELETE NO ACTION ON
UPDATE NO ACTION;

-- AddForeignKey

ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_fkey"
FOREIGN KEY ("user_id") REFERENCES "user_accounts"("id") ON
DELETE CASCADE ON
UPDATE NO ACTION;

-- AddForeignKey

ALTER TABLE "_ApplicationFlaggedSetToApplications" ADD CONSTRAINT "_ApplicationFlaggedSetToApplications_A_fkey"
FOREIGN KEY ("A") REFERENCES "application_flagged_set"("id") ON
DELETE CASCADE ON
UPDATE CASCADE;

-- AddForeignKey

ALTER TABLE "_ApplicationFlaggedSetToApplications" ADD CONSTRAINT "_ApplicationFlaggedSetToApplications_B_fkey"
FOREIGN KEY ("B") REFERENCES "applications"("id") ON
DELETE CASCADE ON
UPDATE CASCADE;

-- AddForeignKey

ALTER TABLE "_ApplicationsToUnitTypes" ADD CONSTRAINT "_ApplicationsToUnitTypes_A_fkey"
FOREIGN KEY ("A") REFERENCES "applications"("id") ON
DELETE CASCADE ON
UPDATE CASCADE;

-- AddForeignKey

ALTER TABLE "_ApplicationsToUnitTypes" ADD CONSTRAINT "_ApplicationsToUnitTypes_B_fkey"
FOREIGN KEY ("B") REFERENCES "unit_types"("id") ON
DELETE CASCADE ON
UPDATE CASCADE;

-- AddForeignKey

ALTER TABLE "_JurisdictionsToMultiselectQuestions" ADD CONSTRAINT "_JurisdictionsToMultiselectQuestions_A_fkey"
FOREIGN KEY ("A") REFERENCES "jurisdictions"("id") ON
DELETE CASCADE ON
UPDATE CASCADE;

-- AddForeignKey

ALTER TABLE "_JurisdictionsToMultiselectQuestions" ADD CONSTRAINT "_JurisdictionsToMultiselectQuestions_B_fkey"
FOREIGN KEY ("B") REFERENCES "multiselect_questions"("id") ON
DELETE CASCADE ON
UPDATE CASCADE;

-- AddForeignKey

ALTER TABLE "_JurisdictionsToUserAccounts" ADD CONSTRAINT "_JurisdictionsToUserAccounts_A_fkey"
FOREIGN KEY ("A") REFERENCES "jurisdictions"("id") ON
DELETE CASCADE ON
UPDATE CASCADE;

-- AddForeignKey

ALTER TABLE "_JurisdictionsToUserAccounts" ADD CONSTRAINT "_JurisdictionsToUserAccounts_B_fkey"
FOREIGN KEY ("B") REFERENCES "user_accounts"("id") ON
DELETE CASCADE ON
UPDATE CASCADE;

-- AddForeignKey

ALTER TABLE "_ListingsToUserAccounts" ADD CONSTRAINT "_ListingsToUserAccounts_A_fkey"
FOREIGN KEY ("A") REFERENCES "listings"("id") ON
DELETE CASCADE ON
UPDATE CASCADE;

-- AddForeignKey

ALTER TABLE "_ListingsToUserAccounts" ADD CONSTRAINT "_ListingsToUserAccounts_B_fkey"
FOREIGN KEY ("B") REFERENCES "user_accounts"("id") ON
DELETE CASCADE ON
UPDATE CASCADE;

-- AddForeignKey

ALTER TABLE "_ListingsToUserPreferences" ADD CONSTRAINT "_ListingsToUserPreferences_A_fkey"
FOREIGN KEY ("A") REFERENCES "listings"("id") ON
DELETE CASCADE ON
UPDATE CASCADE;

-- AddForeignKey

ALTER TABLE "_ListingsToUserPreferences" ADD CONSTRAINT "_ListingsToUserPreferences_B_fkey"
FOREIGN KEY ("B") REFERENCES "user_preferences"("user_id") ON
DELETE CASCADE ON
UPDATE CASCADE;

-- AddForeignKey

ALTER TABLE "_UnitGroupToUnitTypes" ADD CONSTRAINT "_UnitGroupToUnitTypes_A_fkey"
FOREIGN KEY ("A") REFERENCES "unit_group"("id") ON
DELETE CASCADE ON
UPDATE CASCADE;

-- AddForeignKey

ALTER TABLE "_UnitGroupToUnitTypes" ADD CONSTRAINT "_UnitGroupToUnitTypes_B_fkey"
FOREIGN KEY ("B") REFERENCES "unit_types"("id") ON
DELETE CASCADE ON
UPDATE CASCADE;

-- RenameIndex

ALTER INDEX "REL_5eb038a51b9cd6872359a687b1" RENAME TO "alternate_contact_mailing_address_id_key";

-- RenameIndex

ALTER INDEX "REL_7d357035705ebbbe91b5034678" RENAME TO "applicant_work_address_id_key";

-- RenameIndex

ALTER INDEX "REL_8ba2b09030c3a2b857dda5f83f" RENAME TO "applicant_address_id_key";

-- RenameIndex

ALTER INDEX "IDX_f2ace84eebd770f1387b47e5e4" RENAME TO "application_flagged_set_listing_id_idx";

-- RenameIndex

ALTER INDEX "UQ_2983d3205a16bfae28323d021ea" RENAME TO "application_flagged_set_rule_key_key";

-- RenameIndex

ALTER INDEX "IDX_cc9d65c58d8deb0ef5353e9037" RENAME TO "applications_listing_id_idx";

-- RenameIndex

ALTER INDEX "REL_194d0fca275b8661a56e486cb6" RENAME TO "applications_applicant_id_key";

-- RenameIndex

ALTER INDEX "REL_3a4c71bc34dce9f6c196f11093" RENAME TO "applications_accessibility_id_key";

-- RenameIndex

ALTER INDEX "REL_56abaa378952856aaccc64d7eb" RENAME TO "applications_alternate_contact_id_key";

-- RenameIndex

ALTER INDEX "REL_7fc41f89f22ca59ffceab5da80" RENAME TO "applications_alternate_address_id_key";

-- RenameIndex

ALTER INDEX "REL_b72ba26ebc88981f441b30fe3c" RENAME TO "applications_mailing_address_id_key";

-- RenameIndex

ALTER INDEX "REL_fed5da45b7b4dafd9f025a37dd" RENAME TO "applications_demographics_id_key";

-- RenameIndex

ALTER INDEX "UQ_556c258a4439f1b7f53de2ed74f" RENAME TO "applications_listing_id_confirmation_code_key";

-- RenameIndex

ALTER INDEX "IDX_520996eeecf9f6fb9425dc7352" RENAME TO "household_member_application_id_idx";

-- RenameIndex

ALTER INDEX "REL_7b61da64f1b7a6bbb48eb5bbb4" RENAME TO "household_member_address_id_key";

-- RenameIndex

ALTER INDEX "REL_f390552cbb929761927c70b7a0" RENAME TO "household_member_work_address_id_key";

-- RenameIndex

ALTER INDEX "UQ_60b3294568b273d896687dea59f" RENAME TO "jurisdictions_name_key";

-- RenameIndex

ALTER INDEX "IDX_94041359df3c1b14c4420808d1" RENAME TO "listing_images_listing_id_idx";

-- RenameIndex

ALTER INDEX "IDX_ba0026e02ecfe91791aed1a481" RENAME TO "listings_jurisdiction_id_idx";

-- RenameIndex

ALTER INDEX "REL_61b80a947c9db249548ba3c73a" RENAME TO "listings_utilities_id_key";

-- RenameIndex

ALTER INDEX "REL_ac59a58a02199c57a588f04583" RENAME TO "listings_features_id_key";

-- RenameIndex

ALTER INDEX "REL_4ca3d4c823e6bd5149ecaad363" RENAME TO "units_ami_chart_override_id_key";

-- RenameIndex

ALTER INDEX "UQ_df3802ec9c31dd9491e3589378d" RENAME TO "user_accounts_email_key";

