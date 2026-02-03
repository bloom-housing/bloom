-- AlterTable
ALTER TABLE "listing_neighborhood_amenities" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "listings" ALTER COLUMN "deposit_value" SET DATA TYPE DECIMAL(8,2);
ALTER TABLE "listings" ALTER COLUMN "listing_type" SET NOT NULL;

-- AlterTable
ALTER TABLE "unit_group" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "unit_group_ami_levels" ALTER COLUMN "updated_at" DROP DEFAULT;

-- DropTable
DROP TABLE "migrations";

-- CreateTable
CREATE TABLE "accessibility_snapshot" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "original_id" UUID NOT NULL,
    "original_created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "hearing" BOOLEAN,
    "mobility" BOOLEAN,
    "other" BOOLEAN,
    "vision" BOOLEAN,

    CONSTRAINT "accessibility_snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "address_snapshot" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "original_id" UUID NOT NULL,
    "original_created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "city" TEXT,
    "county" TEXT,
    "latitude" DECIMAL,
    "longitude" DECIMAL,
    "place_name" TEXT,
    "state" TEXT,
    "street" TEXT,
    "street2" TEXT,
    "zip_code" TEXT,

    CONSTRAINT "address_snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alternate_contact_snapshot_snapshot" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "original_id" UUID NOT NULL,
    "original_created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "agency" TEXT,
    "email_address" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "mailing_address_snapshot_id" UUID,
    "other_type" TEXT,
    "phone_number" TEXT,
    "type" TEXT,

    CONSTRAINT "alternate_contact_snapshot_snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applicant_snapshot" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "original_id" UUID NOT NULL,
    "original_created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "address_snapshot_id" UUID,
    "birth_day" INTEGER,
    "birth_month" INTEGER,
    "birth_year" INTEGER,
    "email_address" TEXT,
    "first_name" TEXT,
    "full_time_student" "yes_no_enum",
    "last_name" TEXT,
    "middle_name" TEXT,
    "no_email" BOOLEAN,
    "no_phone" BOOLEAN,
    "phone_number" TEXT,
    "phone_number_type" TEXT,
    "work_address_snapshot_id" UUID,
    "work_in_region" "yes_no_enum",

    CONSTRAINT "applicant_snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_method_snapshot" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "original_id" UUID NOT NULL,
    "original_created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "accepts_postmarked_applications" BOOLEAN,
    "external_reference" TEXT,
    "label" TEXT,
    "listing_snapshot_id" UUID,
    "phone_number" TEXT,
    "type" "application_methods_type_enum" NOT NULL,

    CONSTRAINT "application_method_snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_snapshot" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "original_id" UUID NOT NULL,
    "original_created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "accepted_terms" BOOLEAN,
    "accessibility_snapshot_id" UUID,
    "accessible_unit_waitlist_number" INTEGER,
    "additional_phone" BOOLEAN,
    "additional_phone_number" TEXT,
    "additional_phone_number_type" TEXT,
    "alternate_address_snapshot_id" UUID,
    "alternate_contact_snapshot_id" UUID,
    "applicant_snapshot_id" UUID,
    "app_url" TEXT,
    "confirmation_code" TEXT NOT NULL,
    "contact_preferences" TEXT[],
    "conventional_unit_waitlist_number" INTEGER,
    "deleted_at" TIMESTAMP(6),
    "demographic_snapshot_id" UUID,
    "expire_after" TIMESTAMP(6),
    "household_expecting_changes" BOOLEAN,
    "household_size" INTEGER,
    "household_student" BOOLEAN,
    "housing_status" TEXT,
    "income" TEXT,
    "income_period" "income_period_enum",
    "income_vouchers" BOOLEAN,
    "is_newest" BOOLEAN DEFAULT false,
    "language" "languages_enum",
    "listing_id" UUID,
    "mailing_address_snapshot_id" UUID,
    "manual_lottery_position_number" INTEGER,
    "marked_as_duplicate" BOOLEAN NOT NULL DEFAULT false,
    "preferences" JSONB NOT NULL,
    "programs" JSONB,
    "review_status" "application_review_status_enum" NOT NULL DEFAULT 'pending',
    "send_mail_to_mailing_address" BOOLEAN,
    "status" "application_status_enum" NOT NULL DEFAULT 'submitted',
    "submission_date" TIMESTAMPTZ(6),
    "submission_type" "application_submission_type_enum" NOT NULL,
    "user_id" UUID,
    "was_created_externally" BOOLEAN NOT NULL DEFAULT false,
    "was_pii_cleared" BOOLEAN DEFAULT false,

    CONSTRAINT "application_snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_selection_option_snapshot" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "original_id" UUID NOT NULL,
    "original_created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "address_holder_address_snapshot_id" UUID,
    "address_holder_name" TEXT,
    "address_holder_relationship" TEXT,
    "application_selection_snapshot_id" UUID NOT NULL,
    "is_geocoding_verified" BOOLEAN,
    "multiselect_option_id" UUID NOT NULL,

    CONSTRAINT "application_selection_option_snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_selection_snapshot" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "original_id" UUID NOT NULL,
    "original_created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "application_snapshot_id" UUID NOT NULL,
    "has_opted_out" BOOLEAN,
    "multiselect_question_id" UUID NOT NULL,

    CONSTRAINT "application_selection_snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset_snapshot" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "original_id" UUID NOT NULL,
    "original_created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "file_id" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "asset_snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "demographic_snapshot" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "original_id" UUID NOT NULL,
    "original_created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "ethnicity" TEXT,
    "gender" TEXT,
    "how_did_you_hear" TEXT[],
    "race" TEXT[],
    "sexual_orientation" TEXT,

    CONSTRAINT "demographic_snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "household_member_snapshot" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "original_id" UUID NOT NULL,
    "original_created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "address_snapshot_id" UUID,
    "application_snapshot_id" UUID,
    "birth_day" INTEGER,
    "birth_month" INTEGER,
    "birth_year" INTEGER,
    "first_name" TEXT,
    "full_time_student" "yes_no_enum",
    "last_name" TEXT,
    "middle_name" TEXT,
    "order_id" INTEGER,
    "relationship" TEXT,
    "same_address" "yes_no_enum",
    "work_address_snapshot_id" UUID,
    "work_in_region" "yes_no_enum",

    CONSTRAINT "household_member_snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listing_document_snapshot" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "original_id" UUID NOT NULL,
    "original_created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "birth_certificate" BOOLEAN,
    "current_landlord_reference" BOOLEAN,
    "government_issued_id" BOOLEAN,
    "previous_landlord_reference" BOOLEAN,
    "proof_of_assets" BOOLEAN,
    "proof_of_custody" BOOLEAN,
    "proof_of_income" BOOLEAN,
    "residency_documents" BOOLEAN,
    "social_security_card" BOOLEAN,

    CONSTRAINT "listing_document_snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listing_event_snapshot" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "original_id" UUID NOT NULL,
    "original_created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "end_time" TIMESTAMPTZ(6),
    "file_snapshot_id" UUID,
    "label" TEXT,
    "listing_snapshot_id" UUID,
    "note" TEXT,
    "start_date" TIMESTAMPTZ(6),
    "start_time" TIMESTAMPTZ(6),
    "type" "listing_events_type_enum" NOT NULL,
    "url" TEXT,

    CONSTRAINT "listing_event_snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listing_feature_snapshot" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "original_id" UUID NOT NULL,
    "original_created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "accessible_height_toilet" BOOLEAN,
    "accessible_parking" BOOLEAN,
    "ac_in_unit" BOOLEAN,
    "barrier_free_bathroom" BOOLEAN,
    "barrier_free_entrance" BOOLEAN,
    "barrier_free_property_entrance" BOOLEAN,
    "barrier_free_unit_entrance" BOOLEAN,
    "bath_grab_bars_or_reinforcements" BOOLEAN,
    "bathroom_counter_lowered" BOOLEAN,
    "braille_signage_in_building" BOOLEAN,
    "carbon_monoxide_detector_with_strobe" BOOLEAN,
    "carpet_in_unit" BOOLEAN,
    "elevator" BOOLEAN,
    "extra_audible_carbon_monoxide_detector" BOOLEAN,
    "extra_audible_smoke_detector" BOOLEAN,
    "fire_suppression_sprinkler_system" BOOLEAN,
    "front_controls_dishwasher" BOOLEAN,
    "front_controls_stove_cook_top" BOOLEAN,
    "grab_bars" BOOLEAN,
    "hard_flooring_in_unit" BOOLEAN,
    "hearing" BOOLEAN,
    "hearing_and_vision" BOOLEAN,
    "heating_in_unit" BOOLEAN,
    "in_unit_washer_dryer" BOOLEAN,
    "kitchen_counter_lowered" BOOLEAN,
    "laundry_in_building" BOOLEAN,
    "lever_handles_on_doors" BOOLEAN,
    "lever_handles_on_faucets" BOOLEAN,
    "lowered_cabinets" BOOLEAN,
    "lowered_light_switch" BOOLEAN,
    "mobility" BOOLEAN,
    "no_entry_stairs" BOOLEAN,
    "non_digital_kitchen_appliances" BOOLEAN,
    "no_stairs_to_parking_spots" BOOLEAN,
    "no_stairs_within_unit" BOOLEAN,
    "parking_on_site" BOOLEAN,
    "refrigerator_with_bottom_door_freezer" BOOLEAN,
    "roll_in_shower" BOOLEAN,
    "service_animals_allowed" BOOLEAN,
    "smoke_detector_with_strobe" BOOLEAN,
    "street_level_entrance" BOOLEAN,
    "toilet_grab_bars_or_reinforcements" BOOLEAN,
    "tty_amplified_phone" BOOLEAN,
    "turning_circle_in_bathrooms" BOOLEAN,
    "visual" BOOLEAN,
    "walk_in_shower" BOOLEAN,
    "wheelchair_ramp" BOOLEAN,
    "wide_doorways" BOOLEAN,

    CONSTRAINT "listing_feature_snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listing_image_snapshot" (
    "description" TEXT,
    "image_snapshot_id" UUID NOT NULL,
    "listing_snapshot_id" UUID NOT NULL,
    "ordinal" INTEGER,

    CONSTRAINT "listing_image_snapshot_pkey" PRIMARY KEY ("listing_snapshot_id","image_snapshot_id")
);

-- CreateTable
CREATE TABLE "listing_multiselect_question_snapshot" (
    "listing_snapshot_id" UUID NOT NULL,
    "multiselect_question_id" UUID NOT NULL,
    "ordinal" INTEGER,

    CONSTRAINT "listing_multiselect_question_snapshot_pkey" PRIMARY KEY ("listing_snapshot_id","multiselect_question_id")
);

-- CreateTable
CREATE TABLE "listing_neighborhood_amenity_snapshot" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "original_id" UUID NOT NULL,
    "original_created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "bus_stops" TEXT,
    "grocery_stores" TEXT,
    "health_care_resources" TEXT,
    "hospitals" TEXT,
    "parks_and_community_centers" TEXT,
    "pharmacies" TEXT,
    "playgrounds" TEXT,
    "public_transportation" TEXT,
    "recreational_facilities" TEXT,
    "schools" TEXT,
    "senior_centers" TEXT,
    "shopping_venues" TEXT,

    CONSTRAINT "listing_neighborhood_amenity_snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listing_snapshot" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "original_id" UUID NOT NULL,
    "original_created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "accessibility" TEXT,
    "accessible_marketing_flyer" TEXT,
    "accessible_marketing_flyer_file_snapshot_id" UUID,
    "additional_application_submission_notes" TEXT,
    "afs_last_run_at" TIMESTAMPTZ(6) DEFAULT '1970-01-01 00:00:00-07'::timestamp with time zone,
    "allows_cats" BOOLEAN,
    "allows_dogs" BOOLEAN,
    "amenities" TEXT,
    "ami_percentage_max" INTEGER,
    "ami_percentage_min" INTEGER,
    "application_drop_off_address_snapshot_id" UUID,
    "application_drop_off_address_office_hours" TEXT,
    "application_drop_off_address_type" "listings_application_address_type_enum",
    "application_due_date" TIMESTAMPTZ(6),
    "application_fee" TEXT,
    "application_mailing_address_snapshot_id" UUID,
    "application_mailing_address_type" "listings_application_address_type_enum",
    "application_open_date" TIMESTAMPTZ(6),
    "application_organization" TEXT,
    "application_pick_up_address_snapshot_id" UUID,
    "application_pick_up_address_office_hours" TEXT,
    "application_pick_up_address_type" "listings_application_address_type_enum",
    "assets" JSONB NOT NULL,
    "building_address_snapshot_id" UUID,
    "building_selection_criteria" TEXT,
    "building_selection_criteria_file_snapshot_id" UUID,
    "building_total_units" INTEGER,
    "closed_at" TIMESTAMPTZ(6),
    "coc_info" TEXT,
    "common_digital_application" BOOLEAN,
    "community_disclaimer_description" TEXT,
    "community_disclaimer_title" TEXT,
    "configurable_region" TEXT,
    "content_updated_at" TIMESTAMPTZ(6),
    "copy_of_id" UUID,
    "costs_not_included" TEXT,
    "credit_history" TEXT,
    "credit_screening_fee" TEXT,
    "criminal_background" TEXT,
    "custom_map_pin" BOOLEAN,
    "deposit_helper_text" TEXT,
    "deposit_max" TEXT,
    "deposit_min" TEXT,
    "deposit_type" "deposit_type_enum",
    "deposit_value" DECIMAL(8,2),
    "developer" TEXT,
    "digital_application" BOOLEAN,
    "disable_units_accordion" BOOLEAN,
    "display_waitlist_size" BOOLEAN NOT NULL,
    "document_snapshot_id" UUID,
    "feature_snapshot_id" UUID,
    "has_hud_ebll_clearance" BOOLEAN,
    "home_type" "listings_home_type_enum",
    "household_size_max" INTEGER,
    "household_size_min" INTEGER,
    "hrd_id" TEXT,
    "include_community_disclaimer" BOOLEAN,
    "is_verified" BOOLEAN DEFAULT false,
    "is_waitlist_open" BOOLEAN,
    "jurisdiction_id" UUID,
    "last_application_update_at" TIMESTAMPTZ(6) DEFAULT '1970-01-01 00:00:00-07'::timestamp with time zone,
    "last_updated_by_user_id" UUID,
    "leasing_agent_address_snapshot_id" UUID,
    "leasing_agent_email" TEXT,
    "leasing_agent_name" TEXT,
    "leasing_agent_office_hours" TEXT,
    "leasing_agent_phone" TEXT,
    "leasing_agent_title" TEXT,
    "listing_file_number" TEXT,
    "listing_type" "listing_type_enum" NOT NULL DEFAULT 'regulated',
    "lottery_last_published_at" TIMESTAMPTZ(6),
    "lottery_last_run_at" TIMESTAMPTZ(6),
    "lottery_opt_in" BOOLEAN,
    "lottery_status" "lottery_status_enum",
    "management_company" TEXT,
    "management_website" TEXT,
    "marketing_flyer" TEXT,
    "marketing_flyer_file_snapshot_id" UUID,
    "marketing_month" "month_enum",
    "marketing_season" "listings_marketing_season_enum",
    "marketing_type" "listings_marketing_type_enum" NOT NULL DEFAULT 'marketing',
    "marketing_year" INTEGER,
    "name" TEXT NOT NULL,
    "neighborhood" TEXT,
    "neighborhood_amenity_snapshot_id" UUID,
    "owner_company" TEXT,
    "paper_application" BOOLEAN,
    "parking_fee" TEXT,
    "pet_policy" TEXT,
    "phone_number" TEXT,
    "postmarked_applications_received_by_date" TIMESTAMPTZ(6),
    "program_rules" TEXT,
    "property_snapshot_id" UUID,
    "published_at" TIMESTAMPTZ(6),
    "referral_opportunity" BOOLEAN,
    "region" "property_region_enum",
    "rental_assistance" TEXT,
    "rental_history" TEXT,
    "requested_changes" TEXT,
    "requested_changes_date" TIMESTAMPTZ(6) DEFAULT '1970-01-01 00:00:00-07'::timestamp with time zone,
    "requested_changes_user_id" UUID,
    "required_documents" TEXT,
    "reserved_community_description" TEXT,
    "reserved_community_min_age" INTEGER,
    "reserved_community_type_id" UUID,
    "result_snapshot_id" UUID,
    "result_link" TEXT,
    "review_order_type" "listings_review_order_type_enum",
    "section8_acceptance" BOOLEAN,
    "services_offered" TEXT,
    "smoking_policy" TEXT,
    "special_notes" TEXT,
    "status" "listings_status_enum" NOT NULL DEFAULT 'pending',
    "temporary_listing_id" INTEGER,
    "unit_amenities" TEXT,
    "units_available" INTEGER,
    "utility_snapshot_id" UUID,
    "verified_at" TIMESTAMPTZ(6),
    "waitlist_current_size" INTEGER,
    "waitlist_max_size" INTEGER,
    "waitlist_open_spots" INTEGER,
    "was_created_externally" BOOLEAN NOT NULL DEFAULT false,
    "what_to_expect" TEXT,
    "what_to_expect_additional_text" TEXT,
    "year_built" INTEGER,

    CONSTRAINT "listing_snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listing_utility_snapshot" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "original_id" UUID NOT NULL,
    "original_created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "cable" BOOLEAN,
    "electricity" BOOLEAN,
    "gas" BOOLEAN,
    "internet" BOOLEAN,
    "phone" BOOLEAN,
    "sewer" BOOLEAN,
    "trash" BOOLEAN,
    "water" BOOLEAN,

    CONSTRAINT "listing_utility_snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paper_application_snapshot" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "application_method_snapshot_id" UUID,
    "file_snapshot_id" UUID,
    "language" "languages_enum" NOT NULL,

    CONSTRAINT "paper_application_snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_snapshot" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "original_id" UUID NOT NULL,
    "original_created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "description" TEXT,
    "jurisdiction_id" UUID,
    "name" TEXT NOT NULL,
    "url" TEXT,
    "url_title" TEXT,

    CONSTRAINT "property_snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unit_ami_chart_override_snapshot" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "original_id" UUID NOT NULL,
    "original_created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "items" JSONB NOT NULL,

    CONSTRAINT "unit_ami_chart_override_snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unit_group_snapshot" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "original_id" UUID NOT NULL,
    "original_created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "bathroom_max" DECIMAL,
    "bathroom_min" DECIMAL,
    "flat_rent_value_from" DECIMAL,
    "flat_rent_value_to" DECIMAL,
    "floor_max" INTEGER,
    "floor_min" INTEGER,
    "listing_snapshot_id" UUID,
    "max_occupancy" INTEGER,
    "min_occupancy" INTEGER,
    "monthly_rent" DECIMAL,
    "open_waitlist" BOOLEAN NOT NULL DEFAULT true,
    "priority_type_id" UUID,
    "rent_type" "rent_type_enum",
    "sq_feet_max" DECIMAL,
    "sq_feet_min" DECIMAL,
    "total_available" INTEGER,
    "total_count" INTEGER,

    CONSTRAINT "unit_group_snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unit_group_ami_level_snapshot" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "original_id" UUID NOT NULL,
    "original_created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "ami_chart_id" UUID,
    "ami_percentage" INTEGER,
    "flat_rent_value" DECIMAL,
    "monthly_rent_determination_type" "monthly_rent_determination_type_enum" NOT NULL,
    "percentage_of_income_value" DECIMAL,
    "unit_group_snapshot_id" UUID,

    CONSTRAINT "unit_group_ami_level_snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unit_snapshot" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "original_id" UUID NOT NULL,
    "original_created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "ami_chart_id" UUID,
    "ami_chart_override_snapshot_id" UUID,
    "ami_percentage" TEXT,
    "annual_income_max" TEXT,
    "annual_income_min" TEXT,
    "bmr_program_chart" BOOLEAN,
    "floor" INTEGER,
    "listing_snapshot_id" UUID,
    "max_occupancy" INTEGER,
    "min_occupancy" INTEGER,
    "monthly_income_min" TEXT,
    "monthly_rent" TEXT,
    "monthly_rent_as_percent_of_income" DECIMAL(8,2),
    "num_bathrooms" INTEGER,
    "num_bedrooms" INTEGER,
    "number" TEXT,
    "priority_type_id" UUID,
    "sq_feet" DECIMAL(8,2),
    "status" "units_status_enum" NOT NULL DEFAULT 'unknown',
    "unit_rent_type_id" UUID,
    "unit_type_id" UUID,

    CONSTRAINT "unit_snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "units_summary_snapshot" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ami_percentage" INTEGER,
    "floor_max" INTEGER,
    "floor_min" INTEGER,
    "listing_snapshot_id" UUID,
    "max_occupancy" INTEGER,
    "minimum_income_max" TEXT,
    "minimum_income_min" TEXT,
    "min_occupancy" INTEGER,
    "monthly_rent_as_percent_of_income" DECIMAL(8,2),
    "monthly_rent_max" INTEGER,
    "monthly_rent_min" INTEGER,
    "priority_type_id" UUID,
    "sq_feet_max" DECIMAL(8,2),
    "sq_feet_min" DECIMAL(8,2),
    "total_available" INTEGER,
    "total_count" INTEGER,
    "unit_type_id" UUID,

    CONSTRAINT "units_summary_snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_account_snapshot" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "original_id" UUID NOT NULL,
    "original_created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "active_access_token" VARCHAR,
    "active_refresh_token" VARCHAR,
    "agreed_to_terms_of_service" BOOLEAN NOT NULL DEFAULT false,
    "confirmation_token" VARCHAR,
    "confirmed_at" TIMESTAMPTZ(6),
    "dob" TIMESTAMP(6),
    "email" VARCHAR NOT NULL,
    "failed_login_attempts_count" INTEGER NOT NULL DEFAULT 0,
    "first_name" VARCHAR NOT NULL,
    "hit_confirmation_url" TIMESTAMPTZ(6),
    "language" "languages_enum",
    "last_login_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_name" VARCHAR NOT NULL,
    "mfa_enabled" BOOLEAN NOT NULL DEFAULT false,
    "middle_name" VARCHAR,
    "password_hash" VARCHAR NOT NULL,
    "password_updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "password_valid_for_days" INTEGER NOT NULL DEFAULT 365,
    "phone_number" VARCHAR,
    "phone_number_verified" BOOLEAN DEFAULT false,
    "reset_token" VARCHAR,
    "single_use_code" VARCHAR,
    "single_use_code_updated_at" TIMESTAMPTZ(6),
    "was_warned_of_deletion" BOOLEAN DEFAULT false,

    CONSTRAINT "user_account_snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_role_snapshot" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "is_jurisdictional_admin" BOOLEAN NOT NULL DEFAULT false,
    "is_limited_jurisdictional_admin" BOOLEAN NOT NULL DEFAULT false,
    "is_partner" BOOLEAN NOT NULL DEFAULT false,
    "is_super_admin" BOOLEAN NOT NULL DEFAULT false,
    "is_support_admin" BOOLEAN NOT NULL DEFAULT false,
    "user_snapshot_id" UUID NOT NULL,

    CONSTRAINT "user_role_snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ApplicationSnapshotToUnitTypes" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_JurisdictionsToUserAccountSnapshot" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_ListingSnapshotToUserAccountSnapshot" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_UnitGroupSnapshotToUnitTypes" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "alternate_contact_snapshot_snapshot_mailing_address_snapsho_key" ON "alternate_contact_snapshot_snapshot"("mailing_address_snapshot_id");

-- CreateIndex
CREATE UNIQUE INDEX "applicant_snapshot_address_snapshot_id_key" ON "applicant_snapshot"("address_snapshot_id");

-- CreateIndex
CREATE UNIQUE INDEX "applicant_snapshot_work_address_snapshot_id_key" ON "applicant_snapshot"("work_address_snapshot_id");

-- CreateIndex
CREATE UNIQUE INDEX "application_snapshot_accessibility_snapshot_id_key" ON "application_snapshot"("accessibility_snapshot_id");

-- CreateIndex
CREATE UNIQUE INDEX "application_snapshot_alternate_address_snapshot_id_key" ON "application_snapshot"("alternate_address_snapshot_id");

-- CreateIndex
CREATE UNIQUE INDEX "application_snapshot_alternate_contact_snapshot_id_key" ON "application_snapshot"("alternate_contact_snapshot_id");

-- CreateIndex
CREATE UNIQUE INDEX "application_snapshot_applicant_snapshot_id_key" ON "application_snapshot"("applicant_snapshot_id");

-- CreateIndex
CREATE UNIQUE INDEX "application_snapshot_demographic_snapshot_id_key" ON "application_snapshot"("demographic_snapshot_id");

-- CreateIndex
CREATE UNIQUE INDEX "application_snapshot_mailing_address_snapshot_id_key" ON "application_snapshot"("mailing_address_snapshot_id");

-- CreateIndex
CREATE INDEX "application_snapshot_listing_id_idx" ON "application_snapshot"("listing_id");

-- CreateIndex
CREATE INDEX "application_snapshot_user_id_idx" ON "application_snapshot"("user_id");

-- CreateIndex
CREATE INDEX "application_snapshot_is_newest_idx" ON "application_snapshot"("is_newest");

-- CreateIndex
CREATE UNIQUE INDEX "application_snapshot_listing_id_confirmation_code_key" ON "application_snapshot"("listing_id", "confirmation_code");

-- CreateIndex
CREATE UNIQUE INDEX "application_selection_option_snapshot_address_holder_addres_key" ON "application_selection_option_snapshot"("address_holder_address_snapshot_id");

-- CreateIndex
CREATE UNIQUE INDEX "household_member_snapshot_address_snapshot_id_key" ON "household_member_snapshot"("address_snapshot_id");

-- CreateIndex
CREATE UNIQUE INDEX "household_member_snapshot_work_address_snapshot_id_key" ON "household_member_snapshot"("work_address_snapshot_id");

-- CreateIndex
CREATE INDEX "household_member_snapshot_application_snapshot_id_idx" ON "household_member_snapshot"("application_snapshot_id");

-- CreateIndex
CREATE INDEX "listing_image_snapshot_listing_snapshot_id_idx" ON "listing_image_snapshot"("listing_snapshot_id");

-- CreateIndex
CREATE UNIQUE INDEX "listing_snapshot_document_snapshot_id_key" ON "listing_snapshot"("document_snapshot_id");

-- CreateIndex
CREATE UNIQUE INDEX "listing_snapshot_feature_snapshot_id_key" ON "listing_snapshot"("feature_snapshot_id");

-- CreateIndex
CREATE UNIQUE INDEX "listing_snapshot_neighborhood_amenity_snapshot_id_key" ON "listing_snapshot"("neighborhood_amenity_snapshot_id");

-- CreateIndex
CREATE UNIQUE INDEX "listing_snapshot_utility_snapshot_id_key" ON "listing_snapshot"("utility_snapshot_id");

-- CreateIndex
CREATE INDEX "listing_snapshot_jurisdiction_id_idx" ON "listing_snapshot"("jurisdiction_id");

-- CreateIndex
CREATE INDEX "property_snapshot_id_idx" ON "property_snapshot"("id");

-- CreateIndex
CREATE INDEX "property_snapshot_name_idx" ON "property_snapshot"("name");

-- CreateIndex
CREATE UNIQUE INDEX "unit_snapshot_ami_chart_override_snapshot_id_key" ON "unit_snapshot"("ami_chart_override_snapshot_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_account_snapshot_email_key" ON "user_account_snapshot"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_role_snapshot_user_snapshot_id_key" ON "user_role_snapshot"("user_snapshot_id");

-- CreateIndex
CREATE UNIQUE INDEX "_ApplicationSnapshotToUnitTypes_AB_unique" ON "_ApplicationSnapshotToUnitTypes"("A", "B");

-- CreateIndex
CREATE INDEX "_ApplicationSnapshotToUnitTypes_B_index" ON "_ApplicationSnapshotToUnitTypes"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_JurisdictionsToUserAccountSnapshot_AB_unique" ON "_JurisdictionsToUserAccountSnapshot"("A", "B");

-- CreateIndex
CREATE INDEX "_JurisdictionsToUserAccountSnapshot_B_index" ON "_JurisdictionsToUserAccountSnapshot"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ListingSnapshotToUserAccountSnapshot_AB_unique" ON "_ListingSnapshotToUserAccountSnapshot"("A", "B");

-- CreateIndex
CREATE INDEX "_ListingSnapshotToUserAccountSnapshot_B_index" ON "_ListingSnapshotToUserAccountSnapshot"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UnitGroupSnapshotToUnitTypes_AB_unique" ON "_UnitGroupSnapshotToUnitTypes"("A", "B");

-- CreateIndex
CREATE INDEX "_UnitGroupSnapshotToUnitTypes_B_index" ON "_UnitGroupSnapshotToUnitTypes"("B");

-- AddForeignKey
ALTER TABLE "alternate_contact_snapshot_snapshot" ADD CONSTRAINT "alternate_contact_snapshot_snapshot_mailing_address_snapsh_fkey" FOREIGN KEY ("mailing_address_snapshot_id") REFERENCES "address_snapshot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "applicant_snapshot" ADD CONSTRAINT "applicant_snapshot_address_snapshot_id_fkey" FOREIGN KEY ("address_snapshot_id") REFERENCES "address_snapshot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "applicant_snapshot" ADD CONSTRAINT "applicant_snapshot_work_address_snapshot_id_fkey" FOREIGN KEY ("work_address_snapshot_id") REFERENCES "address_snapshot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "application_method_snapshot" ADD CONSTRAINT "application_method_snapshot_listing_snapshot_id_fkey" FOREIGN KEY ("listing_snapshot_id") REFERENCES "listing_snapshot"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "application_snapshot" ADD CONSTRAINT "application_snapshot_accessibility_snapshot_id_fkey" FOREIGN KEY ("accessibility_snapshot_id") REFERENCES "accessibility_snapshot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "application_snapshot" ADD CONSTRAINT "application_snapshot_alternate_contact_snapshot_id_fkey" FOREIGN KEY ("alternate_contact_snapshot_id") REFERENCES "alternate_contact_snapshot_snapshot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "application_snapshot" ADD CONSTRAINT "application_snapshot_applicant_snapshot_id_fkey" FOREIGN KEY ("applicant_snapshot_id") REFERENCES "applicant_snapshot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "application_snapshot" ADD CONSTRAINT "application_snapshot_alternate_address_snapshot_id_fkey" FOREIGN KEY ("alternate_address_snapshot_id") REFERENCES "address_snapshot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "application_snapshot" ADD CONSTRAINT "application_snapshot_mailing_address_snapshot_id_fkey" FOREIGN KEY ("mailing_address_snapshot_id") REFERENCES "address_snapshot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "application_snapshot" ADD CONSTRAINT "application_snapshot_demographic_snapshot_id_fkey" FOREIGN KEY ("demographic_snapshot_id") REFERENCES "demographic_snapshot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "application_selection_option_snapshot" ADD CONSTRAINT "application_selection_option_snapshot_address_holder_addre_fkey" FOREIGN KEY ("address_holder_address_snapshot_id") REFERENCES "address_snapshot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "application_selection_option_snapshot" ADD CONSTRAINT "application_selection_option_snapshot_application_selectio_fkey" FOREIGN KEY ("application_selection_snapshot_id") REFERENCES "application_selection_snapshot"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "application_selection_option_snapshot" ADD CONSTRAINT "application_selection_option_snapshot_multiselect_option_i_fkey" FOREIGN KEY ("multiselect_option_id") REFERENCES "multiselect_options"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "application_selection_snapshot" ADD CONSTRAINT "application_selection_snapshot_application_snapshot_id_fkey" FOREIGN KEY ("application_snapshot_id") REFERENCES "application_snapshot"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "application_selection_snapshot" ADD CONSTRAINT "application_selection_snapshot_multiselect_question_id_fkey" FOREIGN KEY ("multiselect_question_id") REFERENCES "multiselect_questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "household_member_snapshot" ADD CONSTRAINT "household_member_snapshot_application_snapshot_id_fkey" FOREIGN KEY ("application_snapshot_id") REFERENCES "application_snapshot"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "household_member_snapshot" ADD CONSTRAINT "household_member_snapshot_address_snapshot_id_fkey" FOREIGN KEY ("address_snapshot_id") REFERENCES "address_snapshot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "household_member_snapshot" ADD CONSTRAINT "household_member_snapshot_work_address_snapshot_id_fkey" FOREIGN KEY ("work_address_snapshot_id") REFERENCES "address_snapshot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listing_event_snapshot" ADD CONSTRAINT "listing_event_snapshot_file_snapshot_id_fkey" FOREIGN KEY ("file_snapshot_id") REFERENCES "asset_snapshot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listing_event_snapshot" ADD CONSTRAINT "listing_event_snapshot_listing_snapshot_id_fkey" FOREIGN KEY ("listing_snapshot_id") REFERENCES "listing_snapshot"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listing_image_snapshot" ADD CONSTRAINT "listing_image_snapshot_image_snapshot_id_fkey" FOREIGN KEY ("image_snapshot_id") REFERENCES "asset_snapshot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listing_image_snapshot" ADD CONSTRAINT "listing_image_snapshot_listing_snapshot_id_fkey" FOREIGN KEY ("listing_snapshot_id") REFERENCES "listing_snapshot"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listing_multiselect_question_snapshot" ADD CONSTRAINT "listing_multiselect_question_snapshot_listing_snapshot_id_fkey" FOREIGN KEY ("listing_snapshot_id") REFERENCES "listing_snapshot"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listing_multiselect_question_snapshot" ADD CONSTRAINT "listing_multiselect_question_snapshot_multiselect_question_fkey" FOREIGN KEY ("multiselect_question_id") REFERENCES "multiselect_questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listing_snapshot" ADD CONSTRAINT "listing_snapshot_jurisdiction_id_fkey" FOREIGN KEY ("jurisdiction_id") REFERENCES "jurisdictions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listing_snapshot" ADD CONSTRAINT "listing_snapshot_feature_snapshot_id_fkey" FOREIGN KEY ("feature_snapshot_id") REFERENCES "listing_feature_snapshot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listing_snapshot" ADD CONSTRAINT "listing_snapshot_neighborhood_amenity_snapshot_id_fkey" FOREIGN KEY ("neighborhood_amenity_snapshot_id") REFERENCES "listing_neighborhood_amenity_snapshot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listing_snapshot" ADD CONSTRAINT "listing_snapshot_accessible_marketing_flyer_file_snapshot__fkey" FOREIGN KEY ("accessible_marketing_flyer_file_snapshot_id") REFERENCES "asset_snapshot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listing_snapshot" ADD CONSTRAINT "listing_snapshot_application_drop_off_address_snapshot_id_fkey" FOREIGN KEY ("application_drop_off_address_snapshot_id") REFERENCES "address_snapshot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listing_snapshot" ADD CONSTRAINT "listing_snapshot_application_mailing_address_snapshot_id_fkey" FOREIGN KEY ("application_mailing_address_snapshot_id") REFERENCES "address_snapshot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listing_snapshot" ADD CONSTRAINT "listing_snapshot_application_pick_up_address_snapshot_id_fkey" FOREIGN KEY ("application_pick_up_address_snapshot_id") REFERENCES "address_snapshot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listing_snapshot" ADD CONSTRAINT "listing_snapshot_building_address_snapshot_id_fkey" FOREIGN KEY ("building_address_snapshot_id") REFERENCES "address_snapshot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listing_snapshot" ADD CONSTRAINT "listing_snapshot_building_selection_criteria_file_snapshot_fkey" FOREIGN KEY ("building_selection_criteria_file_snapshot_id") REFERENCES "asset_snapshot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listing_snapshot" ADD CONSTRAINT "listing_snapshot_leasing_agent_address_snapshot_id_fkey" FOREIGN KEY ("leasing_agent_address_snapshot_id") REFERENCES "address_snapshot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listing_snapshot" ADD CONSTRAINT "listing_snapshot_marketing_flyer_file_snapshot_id_fkey" FOREIGN KEY ("marketing_flyer_file_snapshot_id") REFERENCES "asset_snapshot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listing_snapshot" ADD CONSTRAINT "listing_snapshot_result_snapshot_id_fkey" FOREIGN KEY ("result_snapshot_id") REFERENCES "asset_snapshot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listing_snapshot" ADD CONSTRAINT "listing_snapshot_utility_snapshot_id_fkey" FOREIGN KEY ("utility_snapshot_id") REFERENCES "listing_utility_snapshot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listing_snapshot" ADD CONSTRAINT "listing_snapshot_property_snapshot_id_fkey" FOREIGN KEY ("property_snapshot_id") REFERENCES "property_snapshot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listing_snapshot" ADD CONSTRAINT "listing_snapshot_document_snapshot_id_fkey" FOREIGN KEY ("document_snapshot_id") REFERENCES "listing_document_snapshot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listing_snapshot" ADD CONSTRAINT "listing_snapshot_reserved_community_type_id_fkey" FOREIGN KEY ("reserved_community_type_id") REFERENCES "reserved_community_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "paper_application_snapshot" ADD CONSTRAINT "paper_application_snapshot_application_method_snapshot_id_fkey" FOREIGN KEY ("application_method_snapshot_id") REFERENCES "application_method_snapshot"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "paper_application_snapshot" ADD CONSTRAINT "paper_application_snapshot_file_snapshot_id_fkey" FOREIGN KEY ("file_snapshot_id") REFERENCES "asset_snapshot"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "property_snapshot" ADD CONSTRAINT "property_snapshot_jurisdiction_id_fkey" FOREIGN KEY ("jurisdiction_id") REFERENCES "jurisdictions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "unit_group_snapshot" ADD CONSTRAINT "unit_group_snapshot_listing_snapshot_id_fkey" FOREIGN KEY ("listing_snapshot_id") REFERENCES "listing_snapshot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "unit_group_snapshot" ADD CONSTRAINT "unit_group_snapshot_priority_type_id_fkey" FOREIGN KEY ("priority_type_id") REFERENCES "unit_accessibility_priority_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "unit_group_ami_level_snapshot" ADD CONSTRAINT "unit_group_ami_level_snapshot_unit_group_snapshot_id_fkey" FOREIGN KEY ("unit_group_snapshot_id") REFERENCES "unit_group_snapshot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "unit_group_ami_level_snapshot" ADD CONSTRAINT "unit_group_ami_level_snapshot_ami_chart_id_fkey" FOREIGN KEY ("ami_chart_id") REFERENCES "ami_chart"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "unit_snapshot" ADD CONSTRAINT "unit_snapshot_ami_chart_id_fkey" FOREIGN KEY ("ami_chart_id") REFERENCES "ami_chart"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "unit_snapshot" ADD CONSTRAINT "unit_snapshot_listing_snapshot_id_fkey" FOREIGN KEY ("listing_snapshot_id") REFERENCES "listing_snapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unit_snapshot" ADD CONSTRAINT "unit_snapshot_priority_type_id_fkey" FOREIGN KEY ("priority_type_id") REFERENCES "unit_accessibility_priority_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "unit_snapshot" ADD CONSTRAINT "unit_snapshot_ami_chart_override_snapshot_id_fkey" FOREIGN KEY ("ami_chart_override_snapshot_id") REFERENCES "unit_ami_chart_override_snapshot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "unit_snapshot" ADD CONSTRAINT "unit_snapshot_unit_rent_type_id_fkey" FOREIGN KEY ("unit_rent_type_id") REFERENCES "unit_rent_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "unit_snapshot" ADD CONSTRAINT "unit_snapshot_unit_type_id_fkey" FOREIGN KEY ("unit_type_id") REFERENCES "unit_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "units_summary_snapshot" ADD CONSTRAINT "units_summary_snapshot_listing_snapshot_id_fkey" FOREIGN KEY ("listing_snapshot_id") REFERENCES "listing_snapshot"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "units_summary_snapshot" ADD CONSTRAINT "units_summary_snapshot_priority_type_id_fkey" FOREIGN KEY ("priority_type_id") REFERENCES "unit_accessibility_priority_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "units_summary_snapshot" ADD CONSTRAINT "units_summary_snapshot_unit_type_id_fkey" FOREIGN KEY ("unit_type_id") REFERENCES "unit_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_role_snapshot" ADD CONSTRAINT "user_role_snapshot_user_snapshot_id_fkey" FOREIGN KEY ("user_snapshot_id") REFERENCES "user_account_snapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApplicationSnapshotToUnitTypes" ADD CONSTRAINT "_ApplicationSnapshotToUnitTypes_A_fkey" FOREIGN KEY ("A") REFERENCES "application_snapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApplicationSnapshotToUnitTypes" ADD CONSTRAINT "_ApplicationSnapshotToUnitTypes_B_fkey" FOREIGN KEY ("B") REFERENCES "unit_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JurisdictionsToUserAccountSnapshot" ADD CONSTRAINT "_JurisdictionsToUserAccountSnapshot_A_fkey" FOREIGN KEY ("A") REFERENCES "jurisdictions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JurisdictionsToUserAccountSnapshot" ADD CONSTRAINT "_JurisdictionsToUserAccountSnapshot_B_fkey" FOREIGN KEY ("B") REFERENCES "user_account_snapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ListingSnapshotToUserAccountSnapshot" ADD CONSTRAINT "_ListingSnapshotToUserAccountSnapshot_A_fkey" FOREIGN KEY ("A") REFERENCES "listing_snapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ListingSnapshotToUserAccountSnapshot" ADD CONSTRAINT "_ListingSnapshotToUserAccountSnapshot_B_fkey" FOREIGN KEY ("B") REFERENCES "user_account_snapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UnitGroupSnapshotToUnitTypes" ADD CONSTRAINT "_UnitGroupSnapshotToUnitTypes_A_fkey" FOREIGN KEY ("A") REFERENCES "unit_group_snapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UnitGroupSnapshotToUnitTypes" ADD CONSTRAINT "_UnitGroupSnapshotToUnitTypes_B_fkey" FOREIGN KEY ("B") REFERENCES "unit_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;
