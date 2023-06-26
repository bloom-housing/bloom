-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateEnum
CREATE TYPE "application_methods_type_enum" AS ENUM ('Internal', 'FileDownload', 'ExternalLink', 'PaperPickup', 'POBox', 'LeasingAgent', 'Referral');

-- CreateEnum
CREATE TYPE "languages_enum" AS ENUM ('en', 'es', 'vi', 'zh', 'tl');

-- CreateEnum
CREATE TYPE "listing_events_type_enum" AS ENUM ('openHouse', 'publicLottery', 'lotteryResults');

-- CreateEnum
CREATE TYPE "listings_application_address_type_enum" AS ENUM ('leasingAgent');

-- CreateEnum
CREATE TYPE "listings_review_order_type_enum" AS ENUM ('lottery', 'firstComeFirstServe', 'waitlist');

-- CreateEnum
CREATE TYPE "listings_status_enum" AS ENUM ('active', 'pending', 'closed');

-- CreateEnum
CREATE TYPE "multiselect_questions_application_section_enum" AS ENUM ('programs', 'preferences');

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

-- CreateTable
CREATE TABLE "accessibility" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "mobility" BOOLEAN,
    "vision" BOOLEAN,
    "hearing" BOOLEAN,

    CONSTRAINT "accessibility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_log" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "module" VARCHAR NOT NULL,
    "record_id" UUID NOT NULL,
    "action" VARCHAR NOT NULL,
    "metadata" JSONB,
    "user_id" UUID,

    CONSTRAINT "activity_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "address" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "place_name" TEXT,
    "city" TEXT,
    "county" TEXT,
    "state" TEXT,
    "street" TEXT,
    "street2" TEXT,
    "zip_code" TEXT,
    "latitude" DECIMAL,
    "longitude" DECIMAL,

    CONSTRAINT "address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alternate_contact" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "type" TEXT,
    "other_type" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "agency" TEXT,
    "phone_number" TEXT,
    "email_address" TEXT,
    "mailing_address_id" UUID,

    CONSTRAINT "alternate_contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ami_chart" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "items" JSONB NOT NULL,
    "name" VARCHAR NOT NULL,
    "jurisdiction_id" UUID NOT NULL,

    CONSTRAINT "ami_chart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applicant" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "first_name" TEXT,
    "middle_name" TEXT,
    "last_name" TEXT,
    "birth_month" TEXT,
    "birth_day" TEXT,
    "birth_year" TEXT,
    "email_address" TEXT,
    "no_email" BOOLEAN,
    "phone_number" TEXT,
    "phone_number_type" TEXT,
    "no_phone" BOOLEAN,
    "work_in_region" "yes_no_enum",
    "work_address_id" UUID,
    "address_id" UUID,

    CONSTRAINT "applicant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_flagged_set" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "rule" "rule_enum" NOT NULL,
    "rule_key" VARCHAR NOT NULL,
    "resolved_time" TIMESTAMPTZ(6),
    "listing_id" UUID NOT NULL,
    "show_confirmation_alert" BOOLEAN NOT NULL DEFAULT false,
    "status" "flagged_set_status_enum" NOT NULL DEFAULT 'pending',
    "resolving_user_id" UUID,

    CONSTRAINT "application_flagged_set_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_methods" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "type" "application_methods_type_enum" NOT NULL,
    "label" TEXT,
    "external_reference" TEXT,
    "accepts_postmarked_applications" BOOLEAN,
    "phone_number" TEXT,
    "listing_id" UUID,

    CONSTRAINT "application_methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applications" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "deleted_at" TIMESTAMP(6),
    "app_url" TEXT,
    "additional_phone" BOOLEAN,
    "additional_phone_number" TEXT,
    "additional_phone_number_type" TEXT,
    "contact_preferences" TEXT[],
    "household_size" INTEGER,
    "housing_status" TEXT,
    "send_mail_to_mailing_address" BOOLEAN,
    "household_expecting_changes" BOOLEAN,
    "household_student" BOOLEAN,
    "income_vouchers" BOOLEAN,
    "income" TEXT,
    "income_period" "income_period_enum",
    "preferences" JSONB NOT NULL,
    "programs" JSONB,
    "status" "application_status_enum" NOT NULL,
    "language" "languages_enum",
    "submission_type" "application_submission_type_enum" NOT NULL,
    "accepted_terms" BOOLEAN,
    "submission_date" TIMESTAMPTZ(6),
    "marked_as_duplicate" BOOLEAN NOT NULL DEFAULT false,
    "confirmation_code" TEXT NOT NULL,
    "review_status" "application_review_status_enum" NOT NULL DEFAULT 'valid',
    "user_id" UUID,
    "listing_id" UUID,
    "applicant_id" UUID,
    "mailing_address_id" UUID,
    "alternate_address_id" UUID,
    "alternate_contact_id" UUID,
    "accessibility_id" UUID,
    "demographics_id" UUID,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assets" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "file_id" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cron_job" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" TEXT,
    "last_run_date" TIMESTAMPTZ(6),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "cron_job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "demographics" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "ethnicity" TEXT,
    "gender" TEXT,
    "sexual_orientation" TEXT,
    "how_did_you_hear" TEXT[],
    "race" TEXT[],

    CONSTRAINT "demographics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "generated_listing_translations" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "listing_id" VARCHAR NOT NULL,
    "jurisdiction_id" VARCHAR NOT NULL,
    "language" "languages_enum" NOT NULL,
    "translations" JSONB NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "generated_listing_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "household_member" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "order_id" INTEGER,
    "first_name" TEXT,
    "middle_name" TEXT,
    "last_name" TEXT,
    "birth_month" TEXT,
    "birth_day" TEXT,
    "birth_year" TEXT,
    "email_address" TEXT,
    "phone_number" TEXT,
    "phone_number_type" TEXT,
    "no_phone" BOOLEAN,
    "same_address" "yes_no_enum" NOT NULL,
    "relationship" TEXT,
    "work_in_region" "yes_no_enum" NOT NULL,
    "address_id" UUID,
    "work_address_id" UUID,
    "application_id" UUID,

    CONSTRAINT "household_member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jurisdictions" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "name" TEXT NOT NULL,
    "notifications_sign_up_url" TEXT,
    "languages" "languages_enum"[] DEFAULT ARRAY['en']::"languages_enum"[],
    "partner_terms" TEXT,
    "public_url" TEXT NOT NULL DEFAULT '',
    "email_from_address" TEXT,
    "rental_assistance_default" TEXT NOT NULL,
    "enable_partner_settings" BOOLEAN NOT NULL DEFAULT false,
    "enable_accessibility_features" BOOLEAN NOT NULL DEFAULT false,
    "enable_utilities_included" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "jurisdictions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listing_events" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "type" "listing_events_type_enum" NOT NULL,
    "start_date" TIMESTAMPTZ(6),
    "start_time" TIMESTAMPTZ(6),
    "end_time" TIMESTAMPTZ(6),
    "url" TEXT,
    "note" TEXT,
    "label" TEXT,
    "listing_id" UUID,
    "file_id" UUID,

    CONSTRAINT "listing_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listing_features" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "elevator" BOOLEAN,
    "wheelchair_ramp" BOOLEAN,
    "service_animals_allowed" BOOLEAN,
    "accessible_parking" BOOLEAN,
    "parking_on_site" BOOLEAN,
    "in_unit_washer_dryer" BOOLEAN,
    "laundry_in_building" BOOLEAN,
    "barrier_free_entrance" BOOLEAN,
    "roll_in_shower" BOOLEAN,
    "grab_bars" BOOLEAN,
    "heating_in_unit" BOOLEAN,
    "ac_in_unit" BOOLEAN,
    "hearing" BOOLEAN,
    "visual" BOOLEAN,
    "mobility" BOOLEAN,
    "barrier_free_unit_entrance" BOOLEAN,
    "lowered_light_switch" BOOLEAN,
    "barrier_free_bathroom" BOOLEAN,
    "wide_doorways" BOOLEAN,
    "lowered_cabinets" BOOLEAN,

    CONSTRAINT "listing_features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listing_images" (
    "ordinal" INTEGER,
    "listing_id" UUID NOT NULL,
    "image_id" UUID NOT NULL,

    CONSTRAINT "listing_images_pkey" PRIMARY KEY ("listing_id","image_id")
);

-- CreateTable
CREATE TABLE "listing_multiselect_questions" (
    "ordinal" INTEGER,
    "listing_id" UUID NOT NULL,
    "multiselect_question_id" UUID NOT NULL,

    CONSTRAINT "listing_multiselect_questions_pkey" PRIMARY KEY ("listing_id","multiselect_question_id")
);

-- CreateTable
CREATE TABLE "listing_utilities" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "water" BOOLEAN,
    "gas" BOOLEAN,
    "trash" BOOLEAN,
    "sewer" BOOLEAN,
    "electricity" BOOLEAN,
    "cable" BOOLEAN,
    "phone" BOOLEAN,
    "internet" BOOLEAN,

    CONSTRAINT "listing_utilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listings" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "additional_application_submission_notes" TEXT,
    "digital_application" BOOLEAN,
    "common_digital_application" BOOLEAN,
    "paper_application" BOOLEAN,
    "referral_opportunity" BOOLEAN,
    "assets" JSONB NOT NULL,
    "accessibility" TEXT,
    "amenities" TEXT,
    "building_total_units" INTEGER,
    "developer" TEXT,
    "household_size_max" INTEGER,
    "household_size_min" INTEGER,
    "neighborhood" TEXT,
    "pet_policy" TEXT,
    "smoking_policy" TEXT,
    "units_available" INTEGER,
    "unit_amenities" TEXT,
    "services_offered" TEXT,
    "year_built" INTEGER,
    "application_due_date" TIMESTAMPTZ(6),
    "application_open_date" TIMESTAMPTZ(6),
    "application_fee" TEXT,
    "application_organization" TEXT,
    "application_pick_up_address_office_hours" TEXT,
    "application_pick_up_address_type" "listings_application_address_type_enum",
    "application_drop_off_address_office_hours" TEXT,
    "application_drop_off_address_type" "listings_application_address_type_enum",
    "application_mailing_address_type" "listings_application_address_type_enum",
    "building_selection_criteria" TEXT,
    "costs_not_included" TEXT,
    "credit_history" TEXT,
    "criminal_background" TEXT,
    "deposit_min" TEXT,
    "deposit_max" TEXT,
    "deposit_helper_text" TEXT,
    "disable_units_accordion" BOOLEAN,
    "leasing_agent_email" TEXT,
    "leasing_agent_name" TEXT,
    "leasing_agent_office_hours" TEXT,
    "leasing_agent_phone" TEXT,
    "leasing_agent_title" TEXT,
    "name" TEXT NOT NULL,
    "postmarked_applications_received_by_date" TIMESTAMPTZ(6),
    "program_rules" TEXT,
    "rental_assistance" TEXT,
    "rental_history" TEXT,
    "required_documents" TEXT,
    "special_notes" TEXT,
    "waitlist_current_size" INTEGER,
    "waitlist_max_size" INTEGER,
    "what_to_expect" TEXT,
    "status" "listings_status_enum" NOT NULL DEFAULT 'pending',
    "review_order_type" "listings_review_order_type_enum",
    "display_waitlist_size" BOOLEAN NOT NULL,
    "reserved_community_description" TEXT,
    "reserved_community_min_age" INTEGER,
    "result_link" TEXT,
    "is_waitlist_open" BOOLEAN,
    "waitlist_open_spots" INTEGER,
    "custom_map_pin" BOOLEAN,
    "published_at" TIMESTAMPTZ(6),
    "closed_at" TIMESTAMPTZ(6),
    "afs_last_run_at" TIMESTAMPTZ(6) DEFAULT '1970-01-01 00:00:00-07'::timestamp with time zone,
    "last_application_update_at" TIMESTAMPTZ(6) DEFAULT '1970-01-01 00:00:00-07'::timestamp with time zone,
    "building_address_id" UUID,
    "application_pick_up_address_id" UUID,
    "application_drop_off_address_id" UUID,
    "application_mailing_address_id" UUID,
    "building_selection_criteria_file_id" UUID,
    "jurisdiction_id" UUID,
    "leasing_agent_address_id" UUID,
    "reserved_community_type_id" UUID,
    "result_id" UUID,
    "features_id" UUID,
    "utilities_id" UUID,
    "hrd_id" TEXT,
    "owner_company" TEXT,
    "management_company" TEXT,
    "management_website" TEXT,
    "ami_percentage_min" INTEGER,
    "ami_percentage_max" INTEGER,
    "phone_number" TEXT,
    "temporary_listing_id" INTEGER,
    "is_verified" BOOLEAN DEFAULT false,
    "marketing_type" "listings_marketing_type_enum" NOT NULL DEFAULT 'marketing',
    "marketing_date" TIMESTAMPTZ(6),
    "marketing_season" "listings_marketing_season_enum",
    "what_to_expect_additional_text" TEXT,
    "section8_acceptance" BOOLEAN,
    "neighborhood_amenities_id" UUID,
    "verified_at" TIMESTAMPTZ(6),
    "home_type" "listings_home_type_enum",
    "region" "property_region_enum",

    CONSTRAINT "listings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "migrations" (
    "id" SERIAL NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "name" VARCHAR NOT NULL,

    CONSTRAINT "migrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "multiselect_questions" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "text" TEXT NOT NULL,
    "sub_text" TEXT,
    "description" TEXT,
    "links" JSONB,
    "options" JSONB,
    "opt_out_text" TEXT,
    "hide_from_listing" BOOLEAN,
    "application_section" "multiselect_questions_application_section_enum" NOT NULL,

    CONSTRAINT "multiselect_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paper_applications" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "language" "languages_enum" NOT NULL,
    "file_id" UUID,
    "application_method_id" UUID,

    CONSTRAINT "paper_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reserved_community_types" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "jurisdiction_id" UUID NOT NULL,

    CONSTRAINT "reserved_community_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "translations" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "language" "languages_enum" NOT NULL,
    "translations" JSONB NOT NULL,
    "jurisdiction_id" UUID,

    CONSTRAINT "translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unit_accessibility_priority_types" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "name" "unit_accessibility_priority_type_enum" NOT NULL,

    CONSTRAINT "unit_accessibility_priority_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unit_ami_chart_overrides" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "items" JSONB NOT NULL,

    CONSTRAINT "unit_ami_chart_overrides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unit_rent_types" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "name" "unit_rent_type_enum" NOT NULL,

    CONSTRAINT "unit_rent_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unit_types" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "name" "unit_type_enum" NOT NULL,
    "num_bedrooms" INTEGER NOT NULL,

    CONSTRAINT "unit_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "units" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "ami_percentage" TEXT,
    "annual_income_min" TEXT,
    "monthly_income_min" TEXT,
    "floor" INTEGER,
    "annual_income_max" TEXT,
    "max_occupancy" INTEGER,
    "min_occupancy" INTEGER,
    "monthly_rent" TEXT,
    "num_bathrooms" INTEGER,
    "num_bedrooms" INTEGER,
    "number" TEXT,
    "sq_feet" DECIMAL(8,2),
    "monthly_rent_as_percent_of_income" DECIMAL(8,2),
    "bmr_program_chart" BOOLEAN,
    "ami_chart_id" UUID,
    "listing_id" UUID,
    "unit_type_id" UUID,
    "unit_rent_type_id" UUID,
    "priority_type_id" UUID,
    "ami_chart_override_id" UUID,
    "status" "units_status_enum" NOT NULL DEFAULT 'unknown',

    CONSTRAINT "units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "units_summary" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "monthly_rent_min" INTEGER,
    "monthly_rent_max" INTEGER,
    "monthly_rent_as_percent_of_income" DECIMAL(8,2),
    "ami_percentage" INTEGER,
    "minimum_income_min" TEXT,
    "minimum_income_max" TEXT,
    "max_occupancy" INTEGER,
    "min_occupancy" INTEGER,
    "floor_min" INTEGER,
    "floor_max" INTEGER,
    "sq_feet_min" DECIMAL(8,2),
    "sq_feet_max" DECIMAL(8,2),
    "total_count" INTEGER,
    "total_available" INTEGER,
    "unit_type_id" UUID,
    "listing_id" UUID,
    "priority_type_id" UUID,

    CONSTRAINT "units_summary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_accounts" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "password_hash" VARCHAR NOT NULL,
    "password_updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "password_valid_for_days" INTEGER NOT NULL DEFAULT 180,
    "reset_token" VARCHAR,
    "confirmation_token" VARCHAR,
    "confirmed_at" TIMESTAMPTZ(6),
    "email" VARCHAR NOT NULL,
    "first_name" VARCHAR NOT NULL,
    "middle_name" VARCHAR,
    "last_name" VARCHAR NOT NULL,
    "dob" TIMESTAMP(6),
    "phone_number" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "language" "languages_enum",
    "mfa_enabled" BOOLEAN NOT NULL DEFAULT false,
    "mfa_code" VARCHAR,
    "mfa_code_updated_at" TIMESTAMPTZ(6),
    "last_login_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "failed_login_attempts_count" INTEGER NOT NULL DEFAULT 0,
    "phone_number_verified" BOOLEAN DEFAULT false,
    "agreed_to_terms_of_service" BOOLEAN NOT NULL DEFAULT false,
    "hit_confirmation_url" TIMESTAMPTZ(6),
    "active_access_token" VARCHAR,
    "active_refresh_token" VARCHAR,

    CONSTRAINT "user_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "is_jurisdictional_admin" BOOLEAN NOT NULL DEFAULT false,
    "is_partner" BOOLEAN NOT NULL DEFAULT false,
    "user_id" UUID NOT NULL,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "ami_chart_item" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "percent_of_ami" INTEGER NOT NULL,
    "household_size" INTEGER NOT NULL,
    "income" INTEGER NOT NULL,
    "ami_chart_id" UUID,

    CONSTRAINT "ami_chart_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listing_neighborhood_amenities" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "grocery_stores" TEXT,
    "pharmacies" TEXT,
    "health_care_resources" TEXT,
    "parks_and_community_centers" TEXT,
    "schools" TEXT,
    "public_transportation" TEXT,

    CONSTRAINT "listing_neighborhood_amenities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unit_group" (
    "max_occupancy" INTEGER,
    "min_occupancy" INTEGER,
    "floor_min" INTEGER,
    "floor_max" INTEGER,
    "total_count" INTEGER,
    "total_available" INTEGER,
    "priority_type_id" UUID,
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "listing_id" UUID,
    "bathroom_min" DECIMAL,
    "bathroom_max" DECIMAL,
    "open_waitlist" BOOLEAN NOT NULL DEFAULT true,
    "sq_feet_min" DECIMAL,
    "sq_feet_max" DECIMAL,

    CONSTRAINT "unit_group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unit_group_ami_levels" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "ami_percentage" INTEGER,
    "monthly_rent_determination_type" "monthly_rent_determination_type_enum" NOT NULL,
    "percentage_of_income_value" DECIMAL,
    "ami_chart_id" UUID,
    "unit_group_id" UUID,
    "flat_rent_value" DECIMAL,

    CONSTRAINT "unit_group_ami_levels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_preferences" (
    "send_email_notifications" BOOLEAN NOT NULL DEFAULT false,
    "send_sms_notifications" BOOLEAN NOT NULL DEFAULT false,
    "user_id" UUID NOT NULL,
    "favorite_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "_ApplicationFlaggedSetToApplications" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_ApplicationsToUnitTypes" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_JurisdictionsToMultiselectQuestions" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_JurisdictionsToUserAccounts" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_ListingsToUserAccounts" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_ListingsToUserPreferences" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_UnitGroupToUnitTypes" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "alternate_contact_mailing_address_id_key" ON "alternate_contact"("mailing_address_id");

-- CreateIndex
CREATE UNIQUE INDEX "applicant_work_address_id_key" ON "applicant"("work_address_id");

-- CreateIndex
CREATE UNIQUE INDEX "applicant_address_id_key" ON "applicant"("address_id");

-- CreateIndex
CREATE UNIQUE INDEX "application_flagged_set_rule_key_key" ON "application_flagged_set"("rule_key");

-- CreateIndex
CREATE INDEX "application_flagged_set_listing_id_idx" ON "application_flagged_set"("listing_id");

-- CreateIndex
CREATE UNIQUE INDEX "applications_applicant_id_key" ON "applications"("applicant_id");

-- CreateIndex
CREATE UNIQUE INDEX "applications_mailing_address_id_key" ON "applications"("mailing_address_id");

-- CreateIndex
CREATE UNIQUE INDEX "applications_alternate_address_id_key" ON "applications"("alternate_address_id");

-- CreateIndex
CREATE UNIQUE INDEX "applications_alternate_contact_id_key" ON "applications"("alternate_contact_id");

-- CreateIndex
CREATE UNIQUE INDEX "applications_accessibility_id_key" ON "applications"("accessibility_id");

-- CreateIndex
CREATE UNIQUE INDEX "applications_demographics_id_key" ON "applications"("demographics_id");

-- CreateIndex
CREATE INDEX "applications_listing_id_idx" ON "applications"("listing_id");

-- CreateIndex
CREATE UNIQUE INDEX "applications_listing_id_confirmation_code_key" ON "applications"("listing_id", "confirmation_code");

-- CreateIndex
CREATE UNIQUE INDEX "household_member_address_id_key" ON "household_member"("address_id");

-- CreateIndex
CREATE UNIQUE INDEX "household_member_work_address_id_key" ON "household_member"("work_address_id");

-- CreateIndex
CREATE INDEX "household_member_application_id_idx" ON "household_member"("application_id");

-- CreateIndex
CREATE UNIQUE INDEX "jurisdictions_name_key" ON "jurisdictions"("name");

-- CreateIndex
CREATE INDEX "listing_images_listing_id_idx" ON "listing_images"("listing_id");

-- CreateIndex
CREATE UNIQUE INDEX "listings_features_id_key" ON "listings"("features_id");

-- CreateIndex
CREATE UNIQUE INDEX "listings_utilities_id_key" ON "listings"("utilities_id");

-- CreateIndex
CREATE UNIQUE INDEX "listings_neighborhood_amenities_id_key" ON "listings"("neighborhood_amenities_id");

-- CreateIndex
CREATE INDEX "listings_jurisdiction_id_idx" ON "listings"("jurisdiction_id");

-- CreateIndex
CREATE UNIQUE INDEX "translations_jurisdiction_id_language_key" ON "translations"("jurisdiction_id", "language");

-- CreateIndex
CREATE UNIQUE INDEX "units_ami_chart_override_id_key" ON "units"("ami_chart_override_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_accounts_email_key" ON "user_accounts"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_preferences_user_id_key" ON "user_preferences"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "_ApplicationFlaggedSetToApplications_AB_unique" ON "_ApplicationFlaggedSetToApplications"("A", "B");

-- CreateIndex
CREATE INDEX "_ApplicationFlaggedSetToApplications_B_index" ON "_ApplicationFlaggedSetToApplications"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ApplicationsToUnitTypes_AB_unique" ON "_ApplicationsToUnitTypes"("A", "B");

-- CreateIndex
CREATE INDEX "_ApplicationsToUnitTypes_B_index" ON "_ApplicationsToUnitTypes"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_JurisdictionsToMultiselectQuestions_AB_unique" ON "_JurisdictionsToMultiselectQuestions"("A", "B");

-- CreateIndex
CREATE INDEX "_JurisdictionsToMultiselectQuestions_B_index" ON "_JurisdictionsToMultiselectQuestions"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_JurisdictionsToUserAccounts_AB_unique" ON "_JurisdictionsToUserAccounts"("A", "B");

-- CreateIndex
CREATE INDEX "_JurisdictionsToUserAccounts_B_index" ON "_JurisdictionsToUserAccounts"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ListingsToUserAccounts_AB_unique" ON "_ListingsToUserAccounts"("A", "B");

-- CreateIndex
CREATE INDEX "_ListingsToUserAccounts_B_index" ON "_ListingsToUserAccounts"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ListingsToUserPreferences_AB_unique" ON "_ListingsToUserPreferences"("A", "B");

-- CreateIndex
CREATE INDEX "_ListingsToUserPreferences_B_index" ON "_ListingsToUserPreferences"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UnitGroupToUnitTypes_AB_unique" ON "_UnitGroupToUnitTypes"("A", "B");

-- CreateIndex
CREATE INDEX "_UnitGroupToUnitTypes_B_index" ON "_UnitGroupToUnitTypes"("B");

-- AddForeignKey
ALTER TABLE "activity_log" ADD CONSTRAINT "activity_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_accounts"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "alternate_contact" ADD CONSTRAINT "alternate_contact_mailing_address_id_fkey" FOREIGN KEY ("mailing_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ami_chart" ADD CONSTRAINT "ami_chart_jurisdiction_id_fkey" FOREIGN KEY ("jurisdiction_id") REFERENCES "jurisdictions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "applicant" ADD CONSTRAINT "applicant_work_address_id_fkey" FOREIGN KEY ("work_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "applicant" ADD CONSTRAINT "applicant_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "application_flagged_set" ADD CONSTRAINT "application_flagged_set_resolving_user_id_fkey" FOREIGN KEY ("resolving_user_id") REFERENCES "user_accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "application_flagged_set" ADD CONSTRAINT "application_flagged_set_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "application_methods" ADD CONSTRAINT "application_methods_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_applicant_id_fkey" FOREIGN KEY ("applicant_id") REFERENCES "applicant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_accessibility_id_fkey" FOREIGN KEY ("accessibility_id") REFERENCES "accessibility"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_alternate_contact_id_fkey" FOREIGN KEY ("alternate_contact_id") REFERENCES "alternate_contact"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_alternate_address_id_fkey" FOREIGN KEY ("alternate_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_accounts"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_mailing_address_id_fkey" FOREIGN KEY ("mailing_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_demographics_id_fkey" FOREIGN KEY ("demographics_id") REFERENCES "demographics"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "household_member" ADD CONSTRAINT "household_member_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "household_member" ADD CONSTRAINT "household_member_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "household_member" ADD CONSTRAINT "household_member_work_address_id_fkey" FOREIGN KEY ("work_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listing_events" ADD CONSTRAINT "listing_events_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "assets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listing_events" ADD CONSTRAINT "listing_events_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listing_images" ADD CONSTRAINT "listing_images_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "assets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listing_images" ADD CONSTRAINT "listing_images_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listing_multiselect_questions" ADD CONSTRAINT "listing_multiselect_questions_multiselect_question_id_fkey" FOREIGN KEY ("multiselect_question_id") REFERENCES "multiselect_questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listing_multiselect_questions" ADD CONSTRAINT "listing_multiselect_questions_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_neighborhood_amenities_id_fkey" FOREIGN KEY ("neighborhood_amenities_id") REFERENCES "listing_neighborhood_amenities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_application_drop_off_address_id_fkey" FOREIGN KEY ("application_drop_off_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_reserved_community_type_id_fkey" FOREIGN KEY ("reserved_community_type_id") REFERENCES "reserved_community_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_building_selection_criteria_file_id_fkey" FOREIGN KEY ("building_selection_criteria_file_id") REFERENCES "assets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_result_id_fkey" FOREIGN KEY ("result_id") REFERENCES "assets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_utilities_id_fkey" FOREIGN KEY ("utilities_id") REFERENCES "listing_utilities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_application_mailing_address_id_fkey" FOREIGN KEY ("application_mailing_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_leasing_agent_address_id_fkey" FOREIGN KEY ("leasing_agent_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_features_id_fkey" FOREIGN KEY ("features_id") REFERENCES "listing_features"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_jurisdiction_id_fkey" FOREIGN KEY ("jurisdiction_id") REFERENCES "jurisdictions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_application_pick_up_address_id_fkey" FOREIGN KEY ("application_pick_up_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_building_address_id_fkey" FOREIGN KEY ("building_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "paper_applications" ADD CONSTRAINT "paper_applications_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "assets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "paper_applications" ADD CONSTRAINT "paper_applications_application_method_id_fkey" FOREIGN KEY ("application_method_id") REFERENCES "application_methods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reserved_community_types" ADD CONSTRAINT "reserved_community_types_jurisdiction_id_fkey" FOREIGN KEY ("jurisdiction_id") REFERENCES "jurisdictions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "translations" ADD CONSTRAINT "translations_jurisdiction_id_fkey" FOREIGN KEY ("jurisdiction_id") REFERENCES "jurisdictions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "units" ADD CONSTRAINT "units_unit_type_id_fkey" FOREIGN KEY ("unit_type_id") REFERENCES "unit_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "units" ADD CONSTRAINT "units_ami_chart_id_fkey" FOREIGN KEY ("ami_chart_id") REFERENCES "ami_chart"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "units" ADD CONSTRAINT "units_ami_chart_override_id_fkey" FOREIGN KEY ("ami_chart_override_id") REFERENCES "unit_ami_chart_overrides"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "units" ADD CONSTRAINT "units_priority_type_id_fkey" FOREIGN KEY ("priority_type_id") REFERENCES "unit_accessibility_priority_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "units" ADD CONSTRAINT "units_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "units" ADD CONSTRAINT "units_unit_rent_type_id_fkey" FOREIGN KEY ("unit_rent_type_id") REFERENCES "unit_rent_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "units_summary" ADD CONSTRAINT "units_summary_unit_type_id_fkey" FOREIGN KEY ("unit_type_id") REFERENCES "unit_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "units_summary" ADD CONSTRAINT "units_summary_priority_type_id_fkey" FOREIGN KEY ("priority_type_id") REFERENCES "unit_accessibility_priority_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "units_summary" ADD CONSTRAINT "units_summary_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ami_chart_item" ADD CONSTRAINT "ami_chart_item_ami_chart_id_fkey" FOREIGN KEY ("ami_chart_id") REFERENCES "ami_chart"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "unit_group" ADD CONSTRAINT "unit_group_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "unit_group" ADD CONSTRAINT "unit_group_priority_type_id_fkey" FOREIGN KEY ("priority_type_id") REFERENCES "unit_accessibility_priority_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "unit_group_ami_levels" ADD CONSTRAINT "unit_group_ami_levels_unit_group_id_fkey" FOREIGN KEY ("unit_group_id") REFERENCES "unit_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "unit_group_ami_levels" ADD CONSTRAINT "unit_group_ami_levels_ami_chart_id_fkey" FOREIGN KEY ("ami_chart_id") REFERENCES "ami_chart"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_accounts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "_ApplicationFlaggedSetToApplications" ADD CONSTRAINT "_ApplicationFlaggedSetToApplications_A_fkey" FOREIGN KEY ("A") REFERENCES "application_flagged_set"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApplicationFlaggedSetToApplications" ADD CONSTRAINT "_ApplicationFlaggedSetToApplications_B_fkey" FOREIGN KEY ("B") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApplicationsToUnitTypes" ADD CONSTRAINT "_ApplicationsToUnitTypes_A_fkey" FOREIGN KEY ("A") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApplicationsToUnitTypes" ADD CONSTRAINT "_ApplicationsToUnitTypes_B_fkey" FOREIGN KEY ("B") REFERENCES "unit_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JurisdictionsToMultiselectQuestions" ADD CONSTRAINT "_JurisdictionsToMultiselectQuestions_A_fkey" FOREIGN KEY ("A") REFERENCES "jurisdictions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JurisdictionsToMultiselectQuestions" ADD CONSTRAINT "_JurisdictionsToMultiselectQuestions_B_fkey" FOREIGN KEY ("B") REFERENCES "multiselect_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JurisdictionsToUserAccounts" ADD CONSTRAINT "_JurisdictionsToUserAccounts_A_fkey" FOREIGN KEY ("A") REFERENCES "jurisdictions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JurisdictionsToUserAccounts" ADD CONSTRAINT "_JurisdictionsToUserAccounts_B_fkey" FOREIGN KEY ("B") REFERENCES "user_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ListingsToUserAccounts" ADD CONSTRAINT "_ListingsToUserAccounts_A_fkey" FOREIGN KEY ("A") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ListingsToUserAccounts" ADD CONSTRAINT "_ListingsToUserAccounts_B_fkey" FOREIGN KEY ("B") REFERENCES "user_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ListingsToUserPreferences" ADD CONSTRAINT "_ListingsToUserPreferences_A_fkey" FOREIGN KEY ("A") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ListingsToUserPreferences" ADD CONSTRAINT "_ListingsToUserPreferences_B_fkey" FOREIGN KEY ("B") REFERENCES "user_preferences"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UnitGroupToUnitTypes" ADD CONSTRAINT "_UnitGroupToUnitTypes_A_fkey" FOREIGN KEY ("A") REFERENCES "unit_group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UnitGroupToUnitTypes" ADD CONSTRAINT "_UnitGroupToUnitTypes_B_fkey" FOREIGN KEY ("B") REFERENCES "unit_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;
