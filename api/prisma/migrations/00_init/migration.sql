-- This init differs from Core as it is the baseline for Detroit prod from 03/01/2025

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateEnum
CREATE TYPE "application_methods_type_enum" AS ENUM ('Internal', 'FileDownload', 'ExternalLink', 'PaperPickup', 'POBox', 'LeasingAgent', 'Referral');

-- CreateEnum
CREATE TYPE "listing_events_type_enum" AS ENUM ('openHouse', 'publicLottery', 'lotteryResults');

-- CreateEnum
CREATE TYPE "listings_review_order_type_enum" AS ENUM ('lottery', 'firstComeFirstServe');

-- CreateEnum
CREATE TYPE "listings_status_enum" AS ENUM ('active', 'pending', 'closed');

-- CreateEnum
CREATE TYPE "units_status_enum" AS ENUM ('unknown', 'available', 'occupied', 'unavailable');

-- CreateEnum
CREATE TYPE "listings_home_type_enum" AS ENUM ('apartment', 'duplex', 'house', 'townhome');

-- CreateEnum
CREATE TYPE "listings_marketing_season_enum" AS ENUM ('spring', 'summer', 'fall', 'winter');

-- CreateEnum
CREATE TYPE "listings_marketing_type_enum" AS ENUM ('marketing', 'comingSoon');

-- CreateEnum
CREATE TYPE "property_region_enum" AS ENUM ('Greater Downtown', 'Eastside', 'Southwest', 'Westside');

-- CreateEnum
CREATE TYPE "jurisdictions_languages_enum" AS ENUM ('en', 'es', 'vi', 'zh', 'tl');

-- CreateEnum
CREATE TYPE "listings_application_drop_off_address_type_enum" AS ENUM ('leasingAgent');

-- CreateEnum
CREATE TYPE "listings_application_mailing_address_type_enum" AS ENUM ('leasingAgent');

-- CreateEnum
CREATE TYPE "listings_application_pick_up_address_type_enum" AS ENUM ('leasingAgent');

-- CreateEnum
CREATE TYPE "unit_group_ami_levels_monthly_rent_determination_type_enum" AS ENUM ('flatRent', 'percentageOfIncome');

-- CreateTable
CREATE TABLE "accessibility" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mobility" BOOLEAN,
    "vision" BOOLEAN,
    "hearing" BOOLEAN,

    CONSTRAINT "PK_9729339e162bc7ec98a8815758c" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "address" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "place_name" TEXT,
    "city" TEXT,
    "county" TEXT,
    "state" TEXT,
    "street" TEXT,
    "street2" TEXT,
    "zip_code" TEXT,
    "latitude" DECIMAL,
    "longitude" DECIMAL,

    CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alternate_contact" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT,
    "other_type" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "agency" TEXT,
    "phone_number" TEXT,
    "email_address" TEXT,
    "mailing_address_id" UUID,

    CONSTRAINT "PK_4b35560218b2062cccb339975e7" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ami_chart" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR NOT NULL,
    "items" JSONB NOT NULL,
    "jurisdiction_id" UUID NOT NULL,

    CONSTRAINT "PK_e079bbfad233fdc79072acb33b5" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applicant" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
    "work_in_region" TEXT,
    "work_address_id" UUID,
    "address_id" UUID,

    CONSTRAINT "PK_f4a6e907b8b17f293eb073fc5ea" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_flagged_set" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rule" VARCHAR NOT NULL,
    "resolved_time" TIMESTAMPTZ(6),
    "status" VARCHAR NOT NULL DEFAULT 'flagged',
    "listing_id" UUID NOT NULL,
    "resolving_user_id" UUID,

    CONSTRAINT "PK_81969e689800a802b75ffd883cc" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_methods" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "application_methods_type_enum" NOT NULL,
    "label" TEXT,
    "external_reference" TEXT,
    "accepts_postmarked_applications" BOOLEAN,
    "listing_id" UUID,
    "phone_number" TEXT,

    CONSTRAINT "PK_c58506819ffaba3863a4edc5e9e" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applications" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "app_url" TEXT,
    "user_id" UUID,
    "listing_id" UUID,
    "additional_phone" BOOLEAN,
    "additional_phone_number" TEXT,
    "additional_phone_number_type" TEXT,
    "contact_preferences" TEXT[],
    "household_size" INTEGER,
    "housing_status" TEXT,
    "send_mail_to_mailing_address" BOOLEAN,
    "income_vouchers" BOOLEAN,
    "income" TEXT,
    "income_period" VARCHAR,
    "language" VARCHAR,
    "submission_type" VARCHAR NOT NULL,
    "accepted_terms" BOOLEAN,
    "applicant_id" UUID,
    "mailing_address_id" UUID,
    "alternate_address_id" UUID,
    "alternate_contact_id" UUID,
    "accessibility_id" UUID,
    "demographics_id" UUID,
    "status" VARCHAR NOT NULL,
    "submission_date" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMP(6),
    "preferences" JSONB NOT NULL,
    "marked_as_duplicate" BOOLEAN NOT NULL DEFAULT false,
    "confirmation_code" TEXT NOT NULL,
    "programs" JSONB,
    "household_expecting_changes" BOOLEAN,
    "household_student" BOOLEAN,

    CONSTRAINT "PK_938c0a27255637bde919591888f" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assets" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "label" TEXT NOT NULL,
    "file_id" TEXT NOT NULL,

    CONSTRAINT "PK_da96729a8b113377cfb6a62439c" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "demographics" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ethnicity" TEXT,
    "gender" TEXT,
    "sexual_orientation" TEXT,
    "how_did_you_hear" TEXT[],
    "race" TEXT[],

    CONSTRAINT "PK_17bf4db5727bd0ad0462c67eda9" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "generated_listing_translations" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "listing_id" VARCHAR NOT NULL,
    "jurisdiction_id" VARCHAR NOT NULL,
    "language" VARCHAR NOT NULL,
    "translations" JSONB NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "PK_4059452831439aefc27c1990b20" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "household_member" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "order_id" INTEGER,
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
    "relationship" TEXT,
    "address_id" UUID,
    "work_address_id" UUID,
    "application_id" UUID,
    "same_address" TEXT,
    "work_in_region" TEXT,

    CONSTRAINT "PK_84e1d1f2553646d38e7c8b72a10" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jurisdictions" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "notifications_sign_up_url" TEXT,
    "languages" "jurisdictions_languages_enum"[] DEFAULT ARRAY['en']::"jurisdictions_languages_enum"[],
    "partner_terms" TEXT,
    "public_url" TEXT NOT NULL DEFAULT '',
    "email_from_address" TEXT,

    CONSTRAINT "PK_7cc0bed21c9e2b32866c1109ec5" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listing_events" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "listing_events_type_enum" NOT NULL,
    "url" TEXT,
    "note" TEXT,
    "listing_id" UUID,
    "label" TEXT,
    "start_time" TIMESTAMPTZ(6),
    "end_time" TIMESTAMPTZ(6),
    "file_id" UUID,

    CONSTRAINT "PK_a9a209828028e14e2caf8def25c" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listing_features" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
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

    CONSTRAINT "PK_88e4fe3e46d21d8b4fdadeb7599" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listing_images" (
    "ordinal" INTEGER,
    "listing_id" UUID NOT NULL,
    "image_id" UUID NOT NULL,

    CONSTRAINT "PK_beb1c8e9f64f578908135aa6899" PRIMARY KEY ("listing_id","image_id")
);

-- CreateTable
CREATE TABLE "listing_utilities" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "water" BOOLEAN,
    "gas" BOOLEAN,
    "trash" BOOLEAN,
    "sewer" BOOLEAN,
    "electricity" BOOLEAN,
    "cable" BOOLEAN,
    "phone" BOOLEAN,
    "internet" BOOLEAN,

    CONSTRAINT "PK_8e88f883b389f7b31d331de764f" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listings" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "application_fee" TEXT,
    "application_organization" TEXT,
    "building_selection_criteria" TEXT,
    "costs_not_included" TEXT,
    "credit_history" TEXT,
    "criminal_background" TEXT,
    "deposit_min" TEXT,
    "deposit_max" TEXT,
    "disable_units_accordion" BOOLEAN,
    "leasing_agent_email" TEXT,
    "leasing_agent_name" TEXT,
    "leasing_agent_office_hours" TEXT,
    "leasing_agent_phone" TEXT,
    "leasing_agent_title" TEXT,
    "name" TEXT NOT NULL,
    "program_rules" TEXT,
    "rental_history" TEXT,
    "required_documents" TEXT,
    "waitlist_current_size" INTEGER,
    "waitlist_max_size" INTEGER,
    "status" "listings_status_enum" NOT NULL DEFAULT 'pending',
    "rental_assistance" TEXT,
    "application_pick_up_address_office_hours" TEXT,
    "property_id" UUID NOT NULL,
    "application_due_date" TIMESTAMPTZ(6),
    "application_open_date" TIMESTAMPTZ(6),
    "postmarked_applications_received_by_date" TIMESTAMPTZ(6),
    "display_waitlist_size" BOOLEAN NOT NULL,
    "assets" JSONB NOT NULL,
    "special_notes" TEXT,
    "jurisdiction_id" UUID,
    "reserved_community_min_age" INTEGER,
    "reserved_community_type_id" UUID,
    "result_id" UUID,
    "result_link" TEXT,
    "is_waitlist_open" BOOLEAN,
    "waitlist_open_spots" INTEGER,
    "application_pick_up_address_type" "listings_application_pick_up_address_type_enum",
    "application_drop_off_address_type" "listings_application_drop_off_address_type_enum",
    "application_drop_off_address_office_hours" TEXT,
    "additional_application_submission_notes" TEXT,
    "application_pick_up_address_id" UUID,
    "application_drop_off_address_id" UUID,
    "application_mailing_address_id" UUID,
    "leasing_agent_address_id" UUID,
    "reserved_community_description" TEXT,
    "custom_map_pin" BOOLEAN,
    "hrd_id" TEXT,
    "owner_company" TEXT,
    "management_company" TEXT,
    "management_website" TEXT,
    "ami_percentage_min" INTEGER,
    "ami_percentage_max" INTEGER,
    "what_to_expect" TEXT,
    "review_order_type" "listings_review_order_type_enum",
    "phone_number" TEXT,
    "digital_application" BOOLEAN,
    "common_digital_application" BOOLEAN,
    "paper_application" BOOLEAN,
    "referral_opportunity" BOOLEAN,
    "building_selection_criteria_file_id" UUID,
    "deposit_helper_text" TEXT,
    "features_id" UUID,
    "application_mailing_address_type" "listings_application_mailing_address_type_enum",
    "temporary_listing_id" INTEGER,
    "is_verified" BOOLEAN DEFAULT false,
    "published_at" TIMESTAMPTZ(6),
    "closed_at" TIMESTAMPTZ(6),
    "marketing_type" "listings_marketing_type_enum" NOT NULL DEFAULT 'marketing',
    "marketing_date" TIMESTAMPTZ(6),
    "marketing_season" "listings_marketing_season_enum",
    "what_to_expect_additional_text" TEXT,
    "section8_acceptance" BOOLEAN,
    "utilities_id" UUID,
    "neighborhood_amenities_id" UUID,
    "verified_at" TIMESTAMPTZ(6),
    "home_type" "listings_home_type_enum",

    CONSTRAINT "PK_520ecac6c99ec90bcf5a603cdcb" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "migrations" (
    "id" SERIAL NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "name" VARCHAR NOT NULL,

    CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paper_applications" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "language" VARCHAR NOT NULL,
    "file_id" UUID,
    "application_method_id" UUID,

    CONSTRAINT "PK_1bc5b0234d874ec03f500621d43" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reserved_community_types" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "jurisdiction_id" UUID NOT NULL,

    CONSTRAINT "PK_af3937276e7bb53c30159d6ca0b" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "translations" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "language" VARCHAR NOT NULL,
    "translations" JSONB NOT NULL,
    "jurisdiction_id" UUID,

    CONSTRAINT "PK_7aef875e43ab80d34a0cdd39c70" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unit_accessibility_priority_types" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,

    CONSTRAINT "PK_2cf31d2ceea36e6a6b970608565" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unit_ami_chart_overrides" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "items" JSONB NOT NULL,

    CONSTRAINT "PK_839676df1bd1ac12ff09b9d920d" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unit_rent_types" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,

    CONSTRAINT "PK_fb6b318fdee0a5b30521f63c516" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unit_types" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "num_bedrooms" INTEGER NOT NULL,

    CONSTRAINT "PK_105c42fcf447c1da21fd20bcb85" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "units" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
    "status" "units_status_enum" NOT NULL DEFAULT 'unknown',
    "monthly_rent_as_percent_of_income" DECIMAL(8,2),
    "property_id" UUID,
    "bmr_program_chart" BOOLEAN,
    "ami_chart_id" UUID,
    "unit_type_id" UUID,
    "priority_type_id" UUID,
    "unit_rent_type_id" UUID,
    "ami_chart_override_id" UUID,

    CONSTRAINT "PK_5a8f2f064919b587d93936cb223" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_accounts" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "password_hash" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "first_name" VARCHAR NOT NULL,
    "middle_name" VARCHAR,
    "last_name" VARCHAR NOT NULL,
    "dob" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reset_token" VARCHAR,
    "confirmation_token" VARCHAR,
    "confirmed_at" TIMESTAMPTZ(6),
    "language" VARCHAR,
    "phone_number" VARCHAR,
    "last_login_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "failed_login_attempts_count" INTEGER NOT NULL DEFAULT 0,
    "password_updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "password_valid_for_days" INTEGER NOT NULL DEFAULT 180,
    "mfa_enabled" BOOLEAN NOT NULL DEFAULT false,
    "mfa_code" VARCHAR,
    "mfa_code_updated_at" TIMESTAMPTZ(6),
    "phone_number_verified" BOOLEAN DEFAULT false,
    "hit_confirmation_url" TIMESTAMPTZ(6),
    "agreed_to_terms_of_service" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PK_125e915cf23ad1cfb43815ce59b" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "is_partner" BOOLEAN NOT NULL DEFAULT false,
    "user_id" UUID NOT NULL,

    CONSTRAINT "PK_87b8888186ca9769c960e926870" PRIMARY KEY ("user_id")
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

    CONSTRAINT "PK_4822e277c626fd1d94cddbb9826" PRIMARY KEY ("id")
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

    CONSTRAINT "PK_8d8c4940fab2a9d1b2e7ddd9e49" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unit_group_ami_levels" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "ami_percentage" INTEGER,
    "monthly_rent_determination_type" "unit_group_ami_levels_monthly_rent_determination_type_enum" NOT NULL,
    "percentage_of_income_value" DECIMAL,
    "ami_chart_id" UUID,
    "unit_group_id" UUID,
    "flat_rent_value" DECIMAL,

    CONSTRAINT "PK_4b540cae0d35b199c0448610378" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_preferences" (
    "send_email_notifications" BOOLEAN NOT NULL DEFAULT false,
    "send_sms_notifications" BOOLEAN NOT NULL DEFAULT false,
    "user_id" UUID NOT NULL,
    "favorite_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "PK_458057fa75b66e68a275647da2e" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "activity_logs" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "module" VARCHAR NOT NULL,
    "record_id" UUID NOT NULL,
    "action" VARCHAR NOT NULL,
    "metadata" JSONB,
    "user_id" UUID,

    CONSTRAINT "PK_f25287b6140c5ba18d38776a796" PRIMARY KEY ("id")
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

    CONSTRAINT "PK_50c1f3d69f4675d775e08d7465e" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_flagged_set_applications_applications" (
    "application_flagged_set_id" UUID NOT NULL,
    "applications_id" UUID NOT NULL,

    CONSTRAINT "PK_ceffc85d4559c5de81c20081c5e" PRIMARY KEY ("application_flagged_set_id","applications_id")
);

-- CreateTable
CREATE TABLE "application_preference" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data" JSONB NOT NULL,
    "application_id" UUID,
    "preference_id" UUID,

    CONSTRAINT "PK_e24d88ff86742179cf93434fcae" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_preferences" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "live_in" BOOLEAN NOT NULL,
    "none" BOOLEAN NOT NULL,
    "work_in" BOOLEAN NOT NULL,

    CONSTRAINT "PK_97729a397c6bff3aaa3bde8be94" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applications_preferred_unit_unit_types" (
    "applications_id" UUID NOT NULL,
    "unit_types_id" UUID NOT NULL,

    CONSTRAINT "PK_63f7ac5b0db34696dd8c5098b87" PRIMARY KEY ("applications_id","unit_types_id")
);

-- CreateTable
CREATE TABLE "jurisdictions_preferences_preferences" (
    "jurisdictions_id" UUID NOT NULL,
    "preferences_id" UUID NOT NULL,

    CONSTRAINT "PK_e5e8a8e6f1d02a2e228444aef76" PRIMARY KEY ("jurisdictions_id","preferences_id")
);

-- CreateTable
CREATE TABLE "jurisdictions_programs_programs" (
    "jurisdictions_id" UUID NOT NULL,
    "programs_id" UUID NOT NULL,

    CONSTRAINT "PK_5e2009964fd0aab1366091610d3" PRIMARY KEY ("jurisdictions_id","programs_id")
);

-- CreateTable
CREATE TABLE "listing_preferences" (
    "ordinal" INTEGER,
    "listing_id" UUID NOT NULL,
    "preference_id" UUID NOT NULL,

    CONSTRAINT "PK_3a99e1cc861df8e2b81ab885839" PRIMARY KEY ("listing_id","preference_id")
);

-- CreateTable
CREATE TABLE "listing_programs" (
    "ordinal" INTEGER,
    "listing_id" UUID NOT NULL,
    "program_id" UUID NOT NULL,

    CONSTRAINT "PK_84171c3ea1066baeed32822b139" PRIMARY KEY ("listing_id","program_id")
);

-- CreateTable
CREATE TABLE "listings_leasing_agents_user_accounts" (
    "listings_id" UUID NOT NULL,
    "user_accounts_id" UUID NOT NULL,

    CONSTRAINT "PK_6c10161c8ebb6e0291145688c56" PRIMARY KEY ("listings_id","user_accounts_id")
);

-- CreateTable
CREATE TABLE "preferences" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT,
    "subtitle" TEXT,
    "description" TEXT,
    "links" JSONB,
    "form_metadata" JSONB,

    CONSTRAINT "PK_17f8855e4145192bbabd91a51be" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "programs" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "subtitle" TEXT,
    "form_metadata" JSONB,
    "title" TEXT,

    CONSTRAINT "PK_d43c664bcaafc0e8a06dfd34e05" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
    "year_built" INTEGER,
    "building_address_id" UUID,
    "services_offered" TEXT,
    "region" "property_region_enum",

    CONSTRAINT "PK_d80743e6191258a5003d5843b4f" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_group" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR NOT NULL,

    CONSTRAINT "PK_30c4d5d238ffc95e72d94837e54" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_group_properties_property" (
    "property_group_id" UUID NOT NULL,
    "property_id" UUID NOT NULL,

    CONSTRAINT "PK_7d88a8faf587c93493dd120dd83" PRIMARY KEY ("property_group_id","property_id")
);

-- CreateTable
CREATE TABLE "revoked_tokens" (
    "token" VARCHAR NOT NULL,
    "revoked_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_f38f625b4823c8903e819bfedd1" PRIMARY KEY ("token")
);

-- CreateTable
CREATE TABLE "typeorm_metadata" (
    "type" VARCHAR NOT NULL,
    "database" VARCHAR,
    "schema" VARCHAR,
    "table" VARCHAR,
    "name" VARCHAR,
    "value" TEXT
);

-- CreateTable
CREATE TABLE "unit_group_unit_type_unit_types" (
    "unit_group_id" UUID NOT NULL,
    "unit_types_id" UUID NOT NULL,

    CONSTRAINT "PK_4f2d90a894495a3cb72e5f0d2c8" PRIMARY KEY ("unit_group_id","unit_types_id")
);

-- CreateTable
CREATE TABLE "user_accounts_jurisdictions_jurisdictions" (
    "user_accounts_id" UUID NOT NULL,
    "jurisdictions_id" UUID NOT NULL,

    CONSTRAINT "PK_66ae1ae446619b775cafb03ce4a" PRIMARY KEY ("user_accounts_id","jurisdictions_id")
);

-- CreateTable
CREATE TABLE "user_preferences_favorites_listings" (
    "user_preferences_user_id" UUID NOT NULL,
    "listings_id" UUID NOT NULL,

    CONSTRAINT "PK_a2e38b75e1a538e046de2fba364" PRIMARY KEY ("user_preferences_user_id","listings_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UQ_5eb038a51b9cd6872359a687b18" ON "alternate_contact"("mailing_address_id");

-- CreateIndex
CREATE UNIQUE INDEX "REL_7d357035705ebbbe91b5034678" ON "applicant"("work_address_id");

-- CreateIndex
CREATE UNIQUE INDEX "REL_8ba2b09030c3a2b857dda5f83f" ON "applicant"("address_id");

-- CreateIndex
CREATE INDEX "IDX_f2ace84eebd770f1387b47e5e4" ON "application_flagged_set"("listing_id");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_194d0fca275b8661a56e486cb64" ON "applications"("applicant_id");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_b72ba26ebc88981f441b30fe3c5" ON "applications"("mailing_address_id");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_7fc41f89f22ca59ffceab5da80e" ON "applications"("alternate_address_id");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_56abaa378952856aaccc64d7eb3" ON "applications"("alternate_contact_id");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_3a4c71bc34dce9f6c196f110935" ON "applications"("accessibility_id");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_fed5da45b7b4dafd9f025a37dd1" ON "applications"("demographics_id");

-- CreateIndex
CREATE INDEX "IDX_cc9d65c58d8deb0ef5353e9037" ON "applications"("listing_id");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_556c258a4439f1b7f53de2ed74f" ON "applications"("listing_id", "confirmation_code");

-- CreateIndex
CREATE UNIQUE INDEX "REL_7b61da64f1b7a6bbb48eb5bbb4" ON "household_member"("address_id");

-- CreateIndex
CREATE UNIQUE INDEX "REL_f390552cbb929761927c70b7a0" ON "household_member"("work_address_id");

-- CreateIndex
CREATE INDEX "IDX_520996eeecf9f6fb9425dc7352" ON "household_member"("application_id");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_60b3294568b273d896687dea59f" ON "jurisdictions"("name");

-- CreateIndex
CREATE INDEX "IDX_94041359df3c1b14c4420808d1" ON "listing_images"("listing_id");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_ac59a58a02199c57a588f045830" ON "listings"("features_id");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_61b80a947c9db249548ba3c73a5" ON "listings"("utilities_id");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_59b4618dfbe6dca2edda375b8d3" ON "listings"("neighborhood_amenities_id");

-- CreateIndex
CREATE INDEX "IDX_ba0026e02ecfe91791aed1a481" ON "listings"("jurisdiction_id");

-- CreateIndex
CREATE UNIQUE INDEX "IDX_4655e7b2c26deb4b8156ea8100" ON "translations"("jurisdiction_id", "language");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_4ca3d4c823e6bd5149ecaad363a" ON "units"("ami_chart_override_id");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_df3802ec9c31dd9491e3589378d" ON "user_accounts"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_87b8888186ca9769c960e926870" ON "user_roles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_458057fa75b66e68a275647da2e" ON "user_preferences"("user_id");

-- CreateIndex
CREATE INDEX "IDX_93f583f2d43fb21c5d7ceac57e" ON "application_flagged_set_applications_applications"("application_flagged_set_id");

-- CreateIndex
CREATE INDEX "IDX_bbae218ba0eff977157fad5ea3" ON "application_flagged_set_applications_applications"("applications_id");

-- CreateIndex
CREATE INDEX "IDX_5838635fbe9294cac64d1a0b60" ON "applications_preferred_unit_unit_types"("unit_types_id");

-- CreateIndex
CREATE INDEX "IDX_8249d47edacc30250c18c53915" ON "applications_preferred_unit_unit_types"("applications_id");

-- CreateIndex
CREATE INDEX "IDX_46e20b8b62dbdabfd76955e95b" ON "jurisdictions_preferences_preferences"("jurisdictions_id");

-- CreateIndex
CREATE INDEX "IDX_7a0eef07c822800c4e9b9d4361" ON "jurisdictions_preferences_preferences"("preferences_id");

-- CreateIndex
CREATE INDEX "IDX_1ec5e2b056309e1248fb43bb08" ON "jurisdictions_programs_programs"("jurisdictions_id");

-- CreateIndex
CREATE INDEX "IDX_cc8517c9311a8e8a4bbabac30f" ON "jurisdictions_programs_programs"("programs_id");

-- CreateIndex
CREATE INDEX "IDX_de53131bc8a08f824a5d3dd51e" ON "listings_leasing_agents_user_accounts"("user_accounts_id");

-- CreateIndex
CREATE INDEX "IDX_f7b22af2c421e823f60c5f7d28" ON "listings_leasing_agents_user_accounts"("listings_id");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_f0f7062f34738e0b338163786fd" ON "property"("building_address_id");

-- CreateIndex
CREATE INDEX "IDX_84e6a1949911510df0eff691f0" ON "property_group_properties_property"("property_group_id");

-- CreateIndex
CREATE INDEX "IDX_c99e75ee805d56fea44bf2970f" ON "property_group_properties_property"("property_id");

-- CreateIndex
CREATE INDEX "IDX_0cf027359361dfd394f08686da" ON "unit_group_unit_type_unit_types"("unit_types_id");

-- CreateIndex
CREATE INDEX "IDX_1ea90313ee94f48800e9eef751" ON "unit_group_unit_type_unit_types"("unit_group_id");

-- CreateIndex
CREATE INDEX "IDX_e51e812700e143101aeaabbccc" ON "user_accounts_jurisdictions_jurisdictions"("user_accounts_id");

-- CreateIndex
CREATE INDEX "IDX_fe359f4430f9e0e7b278e03f0f" ON "user_accounts_jurisdictions_jurisdictions"("jurisdictions_id");

-- CreateIndex
CREATE INDEX "IDX_0115bda0994ab10a4c1a883504" ON "user_preferences_favorites_listings"("user_preferences_user_id");

-- CreateIndex
CREATE INDEX "IDX_c971c586f08b7fe93fcaf29ec0" ON "user_preferences_favorites_listings"("listings_id");

-- AddForeignKey
ALTER TABLE "alternate_contact" ADD CONSTRAINT "FK_5eb038a51b9cd6872359a687b18" FOREIGN KEY ("mailing_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ami_chart" ADD CONSTRAINT "FK_5566b52b2e7c0056e3b81c171f1" FOREIGN KEY ("jurisdiction_id") REFERENCES "jurisdictions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "applicant" ADD CONSTRAINT "FK_7d357035705ebbbe91b50346781" FOREIGN KEY ("work_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "applicant" ADD CONSTRAINT "FK_8ba2b09030c3a2b857dda5f83fe" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "application_flagged_set" ADD CONSTRAINT "FK_3aed12c210529ed798beee9d09e" FOREIGN KEY ("resolving_user_id") REFERENCES "user_accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "application_flagged_set" ADD CONSTRAINT "FK_f2ace84eebd770f1387b47e5e45" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "application_methods" ADD CONSTRAINT "FK_3057650361c2aeab15dfee5c3cc" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "FK_194d0fca275b8661a56e486cb64" FOREIGN KEY ("applicant_id") REFERENCES "applicant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "FK_3a4c71bc34dce9f6c196f110935" FOREIGN KEY ("accessibility_id") REFERENCES "accessibility"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "FK_56abaa378952856aaccc64d7eb3" FOREIGN KEY ("alternate_contact_id") REFERENCES "alternate_contact"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "FK_7fc41f89f22ca59ffceab5da80e" FOREIGN KEY ("alternate_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "FK_9e7594d5b474d9cbebba15c1ae7" FOREIGN KEY ("user_id") REFERENCES "user_accounts"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "FK_b72ba26ebc88981f441b30fe3c5" FOREIGN KEY ("mailing_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "FK_cc9d65c58d8deb0ef5353e9037d" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "FK_fed5da45b7b4dafd9f025a37dd1" FOREIGN KEY ("demographics_id") REFERENCES "demographics"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "household_member" ADD CONSTRAINT "FK_520996eeecf9f6fb9425dc7352c" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "household_member" ADD CONSTRAINT "FK_7b61da64f1b7a6bbb48eb5bbb43" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "household_member" ADD CONSTRAINT "FK_f390552cbb929761927c70b7a0d" FOREIGN KEY ("work_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listing_events" ADD CONSTRAINT "FK_4fd176b179ce281bedb1b7b9f2b" FOREIGN KEY ("file_id") REFERENCES "assets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listing_events" ADD CONSTRAINT "FK_d0b9892bc613e4d9f8b5c25d03e" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listing_images" ADD CONSTRAINT "FK_6fc0fefe11fb46d5ee863ed483a" FOREIGN KEY ("image_id") REFERENCES "assets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listing_images" ADD CONSTRAINT "FK_94041359df3c1b14c4420808d16" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "FK_17e861d96c1bde13c1f4c344cb6" FOREIGN KEY ("application_drop_off_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "FK_1f6fac73d27c81b656cc6100267" FOREIGN KEY ("reserved_community_type_id") REFERENCES "reserved_community_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "FK_2634b9bcb29ec36a629d9e379f0" FOREIGN KEY ("building_selection_criteria_file_id") REFERENCES "assets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "FK_3f7b2aedbfccd6297923943e311" FOREIGN KEY ("result_id") REFERENCES "assets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "FK_59b4618dfbe6dca2edda375b8d3" FOREIGN KEY ("neighborhood_amenities_id") REFERENCES "listing_neighborhood_amenities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "FK_61b80a947c9db249548ba3c73a5" FOREIGN KEY ("utilities_id") REFERENCES "listing_utilities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "FK_7cedb0a800e3c0af7ede27ab1ec" FOREIGN KEY ("application_mailing_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "FK_8a93cc462d190d3f1a04fa69156" FOREIGN KEY ("leasing_agent_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "FK_9eef913a9013d6e3d09a92ec075" FOREIGN KEY ("property_id") REFERENCES "property"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "FK_ac59a58a02199c57a588f045830" FOREIGN KEY ("features_id") REFERENCES "listing_features"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "FK_ba0026e02ecfe91791aed1a4818" FOREIGN KEY ("jurisdiction_id") REFERENCES "jurisdictions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "FK_d54596fd877e83a3126d3953f36" FOREIGN KEY ("application_pick_up_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "paper_applications" ADD CONSTRAINT "FK_493291d04c708dda2ffe5b521e7" FOREIGN KEY ("file_id") REFERENCES "assets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "paper_applications" ADD CONSTRAINT "FK_bd67da96ae3e2c0e37394ba1dd3" FOREIGN KEY ("application_method_id") REFERENCES "application_methods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reserved_community_types" ADD CONSTRAINT "FK_8b43c85a0dd0c39ca795c369edc" FOREIGN KEY ("jurisdiction_id") REFERENCES "jurisdictions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "translations" ADD CONSTRAINT "FK_181f8168d13457f0fd00b08b359" FOREIGN KEY ("jurisdiction_id") REFERENCES "jurisdictions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "units" ADD CONSTRAINT "FK_1e193f5ffdda908517e47d4e021" FOREIGN KEY ("unit_type_id") REFERENCES "unit_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "units" ADD CONSTRAINT "FK_35571c6bd2a1ff690201d1dff08" FOREIGN KEY ("ami_chart_id") REFERENCES "ami_chart"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "units" ADD CONSTRAINT "FK_4ca3d4c823e6bd5149ecaad363a" FOREIGN KEY ("ami_chart_override_id") REFERENCES "unit_ami_chart_overrides"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "units" ADD CONSTRAINT "FK_6981f323d01ba8d55190480078d" FOREIGN KEY ("priority_type_id") REFERENCES "unit_accessibility_priority_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "units" ADD CONSTRAINT "FK_f221e6d7bfd686266003b982b5f" FOREIGN KEY ("property_id") REFERENCES "property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "units" ADD CONSTRAINT "FK_ff9559bf9a1daecef4a89bad4a9" FOREIGN KEY ("unit_rent_type_id") REFERENCES "unit_rent_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "user_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unit_group" ADD CONSTRAINT "FK_926790e4013043593a3976d84bd" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "unit_group" ADD CONSTRAINT "FK_e2660f5da2ff575954d765d920b" FOREIGN KEY ("priority_type_id") REFERENCES "unit_accessibility_priority_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "unit_group_ami_levels" ADD CONSTRAINT "FK_ce82398e48c10dc23920c6ff05a" FOREIGN KEY ("unit_group_id") REFERENCES "unit_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "unit_group_ami_levels" ADD CONSTRAINT "FK_ff3f8de67facd164607f1ef43ae" FOREIGN KEY ("ami_chart_id") REFERENCES "ami_chart"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_preferences" ADD CONSTRAINT "FK_458057fa75b66e68a275647da2e" FOREIGN KEY ("user_id") REFERENCES "user_accounts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "FK_d54f841fa5478e4734590d44036" FOREIGN KEY ("user_id") REFERENCES "user_accounts"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ami_chart_item" ADD CONSTRAINT "FK_98d10c0d335d9e4aca6fb5335b3" FOREIGN KEY ("ami_chart_id") REFERENCES "ami_chart"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "application_flagged_set_applications_applications" ADD CONSTRAINT "FK_93f583f2d43fb21c5d7ceac57e7" FOREIGN KEY ("application_flagged_set_id") REFERENCES "application_flagged_set"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_flagged_set_applications_applications" ADD CONSTRAINT "FK_bbae218ba0eff977157fad5ea31" FOREIGN KEY ("applications_id") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_preference" ADD CONSTRAINT "FK_3a650c5299b1063f57bf6a2422e" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "application_preference" ADD CONSTRAINT "FK_fb3200f0f8c9469aee290c37158" FOREIGN KEY ("preference_id") REFERENCES "preferences"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "applications_preferred_unit_unit_types" ADD CONSTRAINT "FK_5838635fbe9294cac64d1a0b605" FOREIGN KEY ("unit_types_id") REFERENCES "unit_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications_preferred_unit_unit_types" ADD CONSTRAINT "FK_8249d47edacc30250c18c53915a" FOREIGN KEY ("applications_id") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jurisdictions_preferences_preferences" ADD CONSTRAINT "FK_46e20b8b62dbdabfd76955e95b1" FOREIGN KEY ("jurisdictions_id") REFERENCES "jurisdictions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jurisdictions_preferences_preferences" ADD CONSTRAINT "FK_7a0eef07c822800c4e9b9d43619" FOREIGN KEY ("preferences_id") REFERENCES "preferences"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "jurisdictions_programs_programs" ADD CONSTRAINT "FK_1ec5e2b056309e1248fb43bb08b" FOREIGN KEY ("jurisdictions_id") REFERENCES "jurisdictions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jurisdictions_programs_programs" ADD CONSTRAINT "FK_cc8517c9311a8e8a4bbabac30f3" FOREIGN KEY ("programs_id") REFERENCES "programs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listing_preferences" ADD CONSTRAINT "FK_797708bfa7897f574b8eb73cdcb" FOREIGN KEY ("preference_id") REFERENCES "preferences"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listing_preferences" ADD CONSTRAINT "FK_b7fad48d744befbd6532d8a04a0" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listing_programs" ADD CONSTRAINT "FK_0fc46ddd2b9468b011d567740b5" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listing_programs" ADD CONSTRAINT "FK_89b3daa7bbc2dbd95f2760958c2" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listings_leasing_agents_user_accounts" ADD CONSTRAINT "FK_de53131bc8a08f824a5d3dd51e3" FOREIGN KEY ("user_accounts_id") REFERENCES "user_accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listings_leasing_agents_user_accounts" ADD CONSTRAINT "FK_f7b22af2c421e823f60c5f7d28b" FOREIGN KEY ("listings_id") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property" ADD CONSTRAINT "FK_f0f7062f34738e0b338163786fd" FOREIGN KEY ("building_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "property_group_properties_property" ADD CONSTRAINT "FK_84e6a1949911510df0eff691f0d" FOREIGN KEY ("property_group_id") REFERENCES "property_group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_group_properties_property" ADD CONSTRAINT "FK_c99e75ee805d56fea44bf2970f2" FOREIGN KEY ("property_id") REFERENCES "property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unit_group_unit_type_unit_types" ADD CONSTRAINT "FK_0cf027359361dfd394f08686da2" FOREIGN KEY ("unit_types_id") REFERENCES "unit_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unit_group_unit_type_unit_types" ADD CONSTRAINT "FK_1ea90313ee94f48800e9eef751e" FOREIGN KEY ("unit_group_id") REFERENCES "unit_group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_accounts_jurisdictions_jurisdictions" ADD CONSTRAINT "FK_e51e812700e143101aeaabbccc6" FOREIGN KEY ("user_accounts_id") REFERENCES "user_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_accounts_jurisdictions_jurisdictions" ADD CONSTRAINT "FK_fe359f4430f9e0e7b278e03f0f3" FOREIGN KEY ("jurisdictions_id") REFERENCES "jurisdictions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_preferences_favorites_listings" ADD CONSTRAINT "FK_0115bda0994ab10a4c1a883504e" FOREIGN KEY ("user_preferences_user_id") REFERENCES "user_preferences"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_preferences_favorites_listings" ADD CONSTRAINT "FK_c971c586f08b7fe93fcaf29ec05" FOREIGN KEY ("listings_id") REFERENCES "listings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
