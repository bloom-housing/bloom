import { MigrationInterface, QueryRunner } from "typeorm"
import { CountyCode } from "../shared/types/county-code"

export class migrationReset1675268723433 implements MigrationInterface {
  name = "migrationReset1675268723433"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "address" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "place_name" text, "city" text, "county" text, "state" text, "street" text, "street2" text, "zip_code" text, "latitude" numeric, "longitude" numeric, CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "applicant" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "first_name" text, "middle_name" text, "last_name" text, "birth_month" text, "birth_day" text, "birth_year" text, "email_address" text, "no_email" boolean, "phone_number" text, "phone_number_type" text, "no_phone" boolean, "work_in_region" text, "work_address_id" uuid, "address_id" uuid, CONSTRAINT "REL_7d357035705ebbbe91b5034678" UNIQUE ("work_address_id"), CONSTRAINT "REL_8ba2b09030c3a2b857dda5f83f" UNIQUE ("address_id"), CONSTRAINT "PK_f4a6e907b8b17f293eb073fc5ea" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "alternate_contact" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "type" text, "other_type" text, "first_name" text, "last_name" text, "agency" text, "phone_number" text, "email_address" text, "mailing_address_id" uuid, CONSTRAINT "REL_5eb038a51b9cd6872359a687b1" UNIQUE ("mailing_address_id"), CONSTRAINT "PK_4b35560218b2062cccb339975e7" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "accessibility" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "mobility" boolean, "vision" boolean, "hearing" boolean, CONSTRAINT "PK_9729339e162bc7ec98a8815758c" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "demographics" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "ethnicity" text, "gender" text, "sexual_orientation" text, "how_did_you_hear" text array NOT NULL, "race" text array, CONSTRAINT "PK_17bf4db5727bd0ad0462c67eda9" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "household_member" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "order_id" integer, "first_name" text, "middle_name" text, "last_name" text, "birth_month" text, "birth_day" text, "birth_year" text, "same_address" text, "relationship" text, "work_in_region" text, "address_id" uuid, "work_address_id" uuid, "application_id" uuid, CONSTRAINT "REL_7b61da64f1b7a6bbb48eb5bbb4" UNIQUE ("address_id"), CONSTRAINT "REL_f390552cbb929761927c70b7a0" UNIQUE ("work_address_id"), CONSTRAINT "PK_84e1d1f2553646d38e7c8b72a10" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_520996eeecf9f6fb9425dc7352" ON "household_member" ("application_id") `
    )
    await queryRunner.query(
      `CREATE TABLE "unit_types" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" text NOT NULL, "num_bedrooms" integer NOT NULL, CONSTRAINT "PK_105c42fcf447c1da21fd20bcb85" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "applications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "app_url" text, "additional_phone" boolean, "additional_phone_number" text, "additional_phone_number_type" text, "contact_preferences" text array NOT NULL, "household_size" integer, "housing_status" text, "send_mail_to_mailing_address" boolean, "household_expecting_changes" boolean, "household_student" boolean, "income_vouchers" boolean, "income" text, "income_period" character varying, "preferences" jsonb NOT NULL, "programs" jsonb, "status" character varying NOT NULL, "language" character varying, "submission_type" character varying NOT NULL, "accepted_terms" boolean, "submission_date" TIMESTAMP WITH TIME ZONE, "marked_as_duplicate" boolean NOT NULL DEFAULT false, "confirmation_code" text NOT NULL, "review_status" character varying NOT NULL DEFAULT 'valid', "user_id" uuid, "listing_id" uuid, "applicant_id" uuid, "mailing_address_id" uuid, "alternate_address_id" uuid, "alternate_contact_id" uuid, "accessibility_id" uuid, "demographics_id" uuid, CONSTRAINT "UQ_556c258a4439f1b7f53de2ed74f" UNIQUE ("listing_id", "confirmation_code"), CONSTRAINT "REL_194d0fca275b8661a56e486cb6" UNIQUE ("applicant_id"), CONSTRAINT "REL_b72ba26ebc88981f441b30fe3c" UNIQUE ("mailing_address_id"), CONSTRAINT "REL_7fc41f89f22ca59ffceab5da80" UNIQUE ("alternate_address_id"), CONSTRAINT "REL_56abaa378952856aaccc64d7eb" UNIQUE ("alternate_contact_id"), CONSTRAINT "REL_3a4c71bc34dce9f6c196f11093" UNIQUE ("accessibility_id"), CONSTRAINT "REL_fed5da45b7b4dafd9f025a37dd" UNIQUE ("demographics_id"), CONSTRAINT "PK_938c0a27255637bde919591888f" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_cc9d65c58d8deb0ef5353e9037" ON "applications" ("listing_id") `
    )
    await queryRunner.query(
      `CREATE TYPE "public"."multiselect_questions_application_section_enum" AS ENUM('programs', 'preferences')`
    )
    await queryRunner.query(
      `CREATE TABLE "multiselect_questions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "text" text NOT NULL, "sub_text" text, "description" text, "links" jsonb, "options" jsonb, "opt_out_text" text, "hide_from_listing" boolean, "application_section" "public"."multiselect_questions_application_section_enum" NOT NULL, CONSTRAINT "PK_671931eccff7fb3b7cf2050cce0" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TYPE "public"."jurisdictions_languages_enum" AS ENUM('en', 'es', 'vi', 'zh', 'tl')`
    )
    await queryRunner.query(
      `CREATE TABLE "jurisdictions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" text NOT NULL, "notifications_sign_up_url" text, "languages" "public"."jurisdictions_languages_enum" array NOT NULL DEFAULT '{en}', "partner_terms" text, "public_url" text NOT NULL DEFAULT '', "email_from_address" text, "rental_assistance_default" text NOT NULL, "enable_partner_settings" boolean NOT NULL DEFAULT false, "enable_accessibility_features" boolean NOT NULL DEFAULT false, "enable_utilities_included" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_60b3294568b273d896687dea59f" UNIQUE ("name"), CONSTRAINT "PK_7cc0bed21c9e2b32866c1109ec5" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "reserved_community_types" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" text NOT NULL, "description" text, "jurisdiction_id" uuid NOT NULL, CONSTRAINT "PK_af3937276e7bb53c30159d6ca0b" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "assets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "file_id" text NOT NULL, "label" text NOT NULL, CONSTRAINT "PK_da96729a8b113377cfb6a62439c" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TYPE "public"."listing_events_type_enum" AS ENUM('openHouse', 'publicLottery', 'lotteryResults')`
    )
    await queryRunner.query(
      `CREATE TABLE "listing_events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "type" "public"."listing_events_type_enum" NOT NULL, "start_date" TIMESTAMP WITH TIME ZONE, "start_time" TIMESTAMP WITH TIME ZONE, "end_time" TIMESTAMP WITH TIME ZONE, "url" text, "note" text, "label" text, "listing_id" uuid, "file_id" uuid, CONSTRAINT "PK_a9a209828028e14e2caf8def25c" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "paper_applications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "language" character varying NOT NULL, "file_id" uuid, "application_method_id" uuid, CONSTRAINT "PK_1bc5b0234d874ec03f500621d43" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TYPE "public"."application_methods_type_enum" AS ENUM('Internal', 'FileDownload', 'ExternalLink', 'PaperPickup', 'POBox', 'LeasingAgent', 'Referral')`
    )
    await queryRunner.query(
      `CREATE TABLE "application_methods" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "type" "public"."application_methods_type_enum" NOT NULL, "label" text, "external_reference" text, "accepts_postmarked_applications" boolean, "phone_number" text, "listing_id" uuid, CONSTRAINT "PK_c58506819ffaba3863a4edc5e9e" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "unit_accessibility_priority_types" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" text NOT NULL, CONSTRAINT "PK_2cf31d2ceea36e6a6b970608565" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "units_summary" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "monthly_rent_min" integer, "monthly_rent_max" integer, "monthly_rent_as_percent_of_income" numeric(8,2), "ami_percentage" integer, "minimum_income_min" text, "minimum_income_max" text, "max_occupancy" integer, "min_occupancy" integer, "floor_min" integer, "floor_max" integer, "sq_feet_min" numeric(8,2), "sq_feet_max" numeric(8,2), "total_count" integer, "total_available" integer, "unit_type_id" uuid, "listing_id" uuid, "priority_type_id" uuid, CONSTRAINT "PK_8d8c4940fab2a9d1b2e7ddd9e49" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "listing_features" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "elevator" boolean, "wheelchair_ramp" boolean, "service_animals_allowed" boolean, "accessible_parking" boolean, "parking_on_site" boolean, "in_unit_washer_dryer" boolean, "laundry_in_building" boolean, "barrier_free_entrance" boolean, "roll_in_shower" boolean, "grab_bars" boolean, "heating_in_unit" boolean, "ac_in_unit" boolean, "hearing" boolean, "visual" boolean, "mobility" boolean, CONSTRAINT "PK_88e4fe3e46d21d8b4fdadeb7599" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "listing_images" ("ordinal" integer, "listing_id" uuid NOT NULL, "image_id" uuid NOT NULL, CONSTRAINT "PK_beb1c8e9f64f578908135aa6899" PRIMARY KEY ("listing_id", "image_id"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_94041359df3c1b14c4420808d1" ON "listing_images" ("listing_id") `
    )
    await queryRunner.query(
      `CREATE TABLE "listing_utilities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "water" boolean, "gas" boolean, "trash" boolean, "sewer" boolean, "electricity" boolean, "cable" boolean, "phone" boolean, "internet" boolean, CONSTRAINT "PK_8e88f883b389f7b31d331de764f" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "ami_chart" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "items" jsonb NOT NULL, "name" character varying NOT NULL, "jurisdiction_id" uuid NOT NULL, CONSTRAINT "PK_e079bbfad233fdc79072acb33b5" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "unit_rent_types" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" text NOT NULL, CONSTRAINT "PK_fb6b318fdee0a5b30521f63c516" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "unit_ami_chart_overrides" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "items" jsonb NOT NULL, CONSTRAINT "PK_839676df1bd1ac12ff09b9d920d" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "units" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "ami_percentage" text, "annual_income_min" text, "monthly_income_min" text, "floor" integer, "annual_income_max" text, "max_occupancy" integer, "min_occupancy" integer, "monthly_rent" text, "num_bathrooms" integer, "num_bedrooms" integer, "number" text, "sq_feet" numeric(8,2), "monthly_rent_as_percent_of_income" numeric(8,2), "bmr_program_chart" boolean, "ami_chart_id" uuid, "listing_id" uuid, "unit_type_id" uuid, "unit_rent_type_id" uuid, "priority_type_id" uuid, "ami_chart_override_id" uuid, CONSTRAINT "REL_4ca3d4c823e6bd5149ecaad363" UNIQUE ("ami_chart_override_id"), CONSTRAINT "PK_5a8f2f064919b587d93936cb223" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "listing_multiselect_questions" ("ordinal" integer, "listing_id" uuid NOT NULL, "multiselect_question_id" uuid NOT NULL, CONSTRAINT "PK_42d86daebffadee893f602506c2" PRIMARY KEY ("listing_id", "multiselect_question_id"))`
    )
    await queryRunner.query(
      `CREATE TYPE "public"."listings_application_pick_up_address_type_enum" AS ENUM('leasingAgent')`
    )
    await queryRunner.query(
      `CREATE TYPE "public"."listings_application_drop_off_address_type_enum" AS ENUM('leasingAgent')`
    )
    await queryRunner.query(
      `CREATE TYPE "public"."listings_application_mailing_address_type_enum" AS ENUM('leasingAgent')`
    )
    await queryRunner.query(
      `CREATE TYPE "public"."listings_status_enum" AS ENUM('active', 'pending', 'closed')`
    )
    await queryRunner.query(
      `CREATE TYPE "public"."listings_review_order_type_enum" AS ENUM('lottery', 'firstComeFirstServe', 'waitlist')`
    )
    await queryRunner.query(
      `CREATE TABLE "listings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "additional_application_submission_notes" text, "digital_application" boolean, "common_digital_application" boolean, "paper_application" boolean, "referral_opportunity" boolean, "assets" jsonb NOT NULL, "accessibility" text, "amenities" text, "building_total_units" integer, "developer" text, "household_size_max" integer, "household_size_min" integer, "neighborhood" text, "pet_policy" text, "smoking_policy" text, "units_available" integer, "unit_amenities" text, "services_offered" text, "year_built" integer, "application_due_date" TIMESTAMP WITH TIME ZONE, "application_open_date" TIMESTAMP WITH TIME ZONE, "application_fee" text, "application_organization" text, "application_pick_up_address_office_hours" text, "application_pick_up_address_type" "public"."listings_application_pick_up_address_type_enum", "application_drop_off_address_office_hours" text, "application_drop_off_address_type" "public"."listings_application_drop_off_address_type_enum", "application_mailing_address_type" "public"."listings_application_mailing_address_type_enum", "building_selection_criteria" text, "costs_not_included" text, "credit_history" text, "criminal_background" text, "deposit_min" text, "deposit_max" text, "deposit_helper_text" text, "disable_units_accordion" boolean, "leasing_agent_email" text, "leasing_agent_name" text, "leasing_agent_office_hours" text, "leasing_agent_phone" text, "leasing_agent_title" text, "name" text NOT NULL, "postmarked_applications_received_by_date" TIMESTAMP WITH TIME ZONE, "program_rules" text, "rental_assistance" text, "rental_history" text, "required_documents" text, "special_notes" text, "waitlist_current_size" integer, "waitlist_max_size" integer, "what_to_expect" text, "status" "public"."listings_status_enum" NOT NULL DEFAULT 'pending', "review_order_type" "public"."listings_review_order_type_enum", "display_waitlist_size" boolean NOT NULL, "reserved_community_description" text, "reserved_community_min_age" integer, "result_link" text, "is_waitlist_open" boolean, "waitlist_open_spots" integer, "custom_map_pin" boolean, "published_at" TIMESTAMP WITH TIME ZONE, "closed_at" TIMESTAMP WITH TIME ZONE, "afs_last_run_at" TIMESTAMP WITH TIME ZONE DEFAULT '1970-01-01', "last_application_update_at" TIMESTAMP WITH TIME ZONE DEFAULT '1970-01-01', "building_address_id" uuid, "application_pick_up_address_id" uuid, "application_drop_off_address_id" uuid, "application_mailing_address_id" uuid, "building_selection_criteria_file_id" uuid, "jurisdiction_id" uuid, "leasing_agent_address_id" uuid, "reserved_community_type_id" uuid, "result_id" uuid, "features_id" uuid, "utilities_id" uuid, CONSTRAINT "REL_ac59a58a02199c57a588f04583" UNIQUE ("features_id"), CONSTRAINT "REL_61b80a947c9db249548ba3c73a" UNIQUE ("utilities_id"), CONSTRAINT "PK_520ecac6c99ec90bcf5a603cdcb" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_ba0026e02ecfe91791aed1a481" ON "listings" ("jurisdiction_id") `
    )
    await queryRunner.query(
      `CREATE TABLE "user_roles" ("is_admin" boolean NOT NULL DEFAULT false, "is_jurisdictional_admin" boolean NOT NULL DEFAULT false, "is_partner" boolean NOT NULL DEFAULT false, "user_id" uuid NOT NULL, CONSTRAINT "REL_87b8888186ca9769c960e92687" UNIQUE ("user_id"), CONSTRAINT "PK_87b8888186ca9769c960e926870" PRIMARY KEY ("user_id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "user_accounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "password_hash" character varying NOT NULL, "password_updated_at" TIMESTAMP NOT NULL DEFAULT NOW(), "password_valid_for_days" integer NOT NULL DEFAULT '180', "reset_token" character varying, "confirmation_token" character varying, "confirmed_at" TIMESTAMP WITH TIME ZONE, "email" character varying NOT NULL, "first_name" character varying NOT NULL, "middle_name" character varying, "last_name" character varying NOT NULL, "dob" TIMESTAMP, "phone_number" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "language" character varying, "mfa_enabled" boolean NOT NULL DEFAULT false, "mfa_code" character varying, "mfa_code_updated_at" TIMESTAMP WITH TIME ZONE, "last_login_at" TIMESTAMP NOT NULL DEFAULT NOW(), "failed_login_attempts_count" integer NOT NULL DEFAULT '0', "phone_number_verified" boolean DEFAULT false, "agreed_to_terms_of_service" boolean NOT NULL DEFAULT false, "hit_confirmation_url" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_df3802ec9c31dd9491e3589378d" UNIQUE ("email"), CONSTRAINT "PK_125e915cf23ad1cfb43815ce59b" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "activity_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "module" character varying NOT NULL, "record_id" uuid NOT NULL, "action" character varying NOT NULL, "metadata" jsonb, "user_id" uuid, CONSTRAINT "PK_f25287b6140c5ba18d38776a796" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "application_flagged_set" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "rule" character varying NOT NULL, "rule_key" character varying NOT NULL, "resolved_time" TIMESTAMP WITH TIME ZONE, "listing_id" uuid NOT NULL, "show_confirmation_alert" boolean NOT NULL DEFAULT false, "status" character varying NOT NULL DEFAULT 'pending', "resolving_user_id" uuid, CONSTRAINT "UQ_2983d3205a16bfae28323d021ea" UNIQUE ("rule_key"), CONSTRAINT "PK_81969e689800a802b75ffd883cc" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_f2ace84eebd770f1387b47e5e4" ON "application_flagged_set" ("listing_id") `
    )
    await queryRunner.query(
      `CREATE TABLE "revoked_tokens" ("token" character varying NOT NULL, "revoked_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f38f625b4823c8903e819bfedd1" PRIMARY KEY ("token"))`
    )
    await queryRunner.query(
      `CREATE TABLE "cron_job" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text, "last_run_date" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3f180d097e1216411578b642513" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "generated_listing_translations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "listing_id" character varying NOT NULL, "jurisdiction_id" character varying NOT NULL, "language" character varying NOT NULL, "translations" jsonb NOT NULL, "timestamp" TIMESTAMP NOT NULL, CONSTRAINT "PK_4059452831439aefc27c1990b20" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "translations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "language" character varying NOT NULL, "translations" jsonb NOT NULL, "jurisdiction_id" uuid, CONSTRAINT "PK_aca248c72ae1fb2390f1bf4cd87" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_4655e7b2c26deb4b8156ea8100" ON "translations" ("jurisdiction_id", "language") `
    )
    await queryRunner.query(
      `CREATE TABLE "applications_preferred_unit_unit_types" ("applications_id" uuid NOT NULL, "unit_types_id" uuid NOT NULL, CONSTRAINT "PK_63f7ac5b0db34696dd8c5098b87" PRIMARY KEY ("applications_id", "unit_types_id"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_8249d47edacc30250c18c53915" ON "applications_preferred_unit_unit_types" ("applications_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_5838635fbe9294cac64d1a0b60" ON "applications_preferred_unit_unit_types" ("unit_types_id") `
    )
    await queryRunner.query(
      `CREATE TABLE "jurisdictions_multiselect_questions_multiselect_questions" ("jurisdictions_id" uuid NOT NULL, "multiselect_questions_id" uuid NOT NULL, CONSTRAINT "PK_b43958a0ef8fbfef97db9c23f8f" PRIMARY KEY ("jurisdictions_id", "multiselect_questions_id"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_3f7126f5da7c0368aea2f9459c" ON "jurisdictions_multiselect_questions_multiselect_questions" ("jurisdictions_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_ab91e5d403a6cf21656f7d5ae2" ON "jurisdictions_multiselect_questions_multiselect_questions" ("multiselect_questions_id") `
    )
    await queryRunner.query(
      `CREATE TABLE "listings_leasing_agents_user_accounts" ("listings_id" uuid NOT NULL, "user_accounts_id" uuid NOT NULL, CONSTRAINT "PK_6c10161c8ebb6e0291145688c56" PRIMARY KEY ("listings_id", "user_accounts_id"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_f7b22af2c421e823f60c5f7d28" ON "listings_leasing_agents_user_accounts" ("listings_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_de53131bc8a08f824a5d3dd51e" ON "listings_leasing_agents_user_accounts" ("user_accounts_id") `
    )
    await queryRunner.query(
      `CREATE TABLE "user_accounts_jurisdictions_jurisdictions" ("user_accounts_id" uuid NOT NULL, "jurisdictions_id" uuid NOT NULL, CONSTRAINT "PK_66ae1ae446619b775cafb03ce4a" PRIMARY KEY ("user_accounts_id", "jurisdictions_id"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_e51e812700e143101aeaabbccc" ON "user_accounts_jurisdictions_jurisdictions" ("user_accounts_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_fe359f4430f9e0e7b278e03f0f" ON "user_accounts_jurisdictions_jurisdictions" ("jurisdictions_id") `
    )
    await queryRunner.query(
      `CREATE TABLE "application_flagged_set_applications_applications" ("application_flagged_set_id" uuid NOT NULL, "applications_id" uuid NOT NULL, CONSTRAINT "PK_ceffc85d4559c5de81c20081c5e" PRIMARY KEY ("application_flagged_set_id", "applications_id"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_93f583f2d43fb21c5d7ceac57e" ON "application_flagged_set_applications_applications" ("application_flagged_set_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_bbae218ba0eff977157fad5ea3" ON "application_flagged_set_applications_applications" ("applications_id") `
    )
    await queryRunner.query(
      `ALTER TABLE "applicant" ADD CONSTRAINT "FK_7d357035705ebbbe91b50346781" FOREIGN KEY ("work_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "applicant" ADD CONSTRAINT "FK_8ba2b09030c3a2b857dda5f83fe" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "alternate_contact" ADD CONSTRAINT "FK_5eb038a51b9cd6872359a687b18" FOREIGN KEY ("mailing_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "household_member" ADD CONSTRAINT "FK_7b61da64f1b7a6bbb48eb5bbb43" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "household_member" ADD CONSTRAINT "FK_f390552cbb929761927c70b7a0d" FOREIGN KEY ("work_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "household_member" ADD CONSTRAINT "FK_520996eeecf9f6fb9425dc7352c" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "applications" ADD CONSTRAINT "FK_9e7594d5b474d9cbebba15c1ae7" FOREIGN KEY ("user_id") REFERENCES "user_accounts"("id") ON DELETE SET NULL ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "applications" ADD CONSTRAINT "FK_cc9d65c58d8deb0ef5353e9037d" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "applications" ADD CONSTRAINT "FK_194d0fca275b8661a56e486cb64" FOREIGN KEY ("applicant_id") REFERENCES "applicant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "applications" ADD CONSTRAINT "FK_b72ba26ebc88981f441b30fe3c5" FOREIGN KEY ("mailing_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "applications" ADD CONSTRAINT "FK_7fc41f89f22ca59ffceab5da80e" FOREIGN KEY ("alternate_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "applications" ADD CONSTRAINT "FK_56abaa378952856aaccc64d7eb3" FOREIGN KEY ("alternate_contact_id") REFERENCES "alternate_contact"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "applications" ADD CONSTRAINT "FK_3a4c71bc34dce9f6c196f110935" FOREIGN KEY ("accessibility_id") REFERENCES "accessibility"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "applications" ADD CONSTRAINT "FK_fed5da45b7b4dafd9f025a37dd1" FOREIGN KEY ("demographics_id") REFERENCES "demographics"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "reserved_community_types" ADD CONSTRAINT "FK_8b43c85a0dd0c39ca795c369edc" FOREIGN KEY ("jurisdiction_id") REFERENCES "jurisdictions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_events" ADD CONSTRAINT "FK_d0b9892bc613e4d9f8b5c25d03e" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_events" ADD CONSTRAINT "FK_4fd176b179ce281bedb1b7b9f2b" FOREIGN KEY ("file_id") REFERENCES "assets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "paper_applications" ADD CONSTRAINT "FK_493291d04c708dda2ffe5b521e7" FOREIGN KEY ("file_id") REFERENCES "assets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "paper_applications" ADD CONSTRAINT "FK_bd67da96ae3e2c0e37394ba1dd3" FOREIGN KEY ("application_method_id") REFERENCES "application_methods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "application_methods" ADD CONSTRAINT "FK_3057650361c2aeab15dfee5c3cc" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "units_summary" ADD CONSTRAINT "FK_0eae6ec11a6109496d80d9a88f9" FOREIGN KEY ("unit_type_id") REFERENCES "unit_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "units_summary" ADD CONSTRAINT "FK_4edda29192dbc0c6a18e15437a0" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "units_summary" ADD CONSTRAINT "FK_4791099ef82551aa9819a71d8f5" FOREIGN KEY ("priority_type_id") REFERENCES "unit_accessibility_priority_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_images" ADD CONSTRAINT "FK_94041359df3c1b14c4420808d16" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_images" ADD CONSTRAINT "FK_6fc0fefe11fb46d5ee863ed483a" FOREIGN KEY ("image_id") REFERENCES "assets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "ami_chart" ADD CONSTRAINT "FK_5566b52b2e7c0056e3b81c171f1" FOREIGN KEY ("jurisdiction_id") REFERENCES "jurisdictions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "units" ADD CONSTRAINT "FK_35571c6bd2a1ff690201d1dff08" FOREIGN KEY ("ami_chart_id") REFERENCES "ami_chart"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "units" ADD CONSTRAINT "FK_9aebcde52d6e054e5ac5d26228c" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "units" ADD CONSTRAINT "FK_1e193f5ffdda908517e47d4e021" FOREIGN KEY ("unit_type_id") REFERENCES "unit_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "units" ADD CONSTRAINT "FK_ff9559bf9a1daecef4a89bad4a9" FOREIGN KEY ("unit_rent_type_id") REFERENCES "unit_rent_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "units" ADD CONSTRAINT "FK_6981f323d01ba8d55190480078d" FOREIGN KEY ("priority_type_id") REFERENCES "unit_accessibility_priority_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "units" ADD CONSTRAINT "FK_4ca3d4c823e6bd5149ecaad363a" FOREIGN KEY ("ami_chart_override_id") REFERENCES "unit_ami_chart_overrides"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_multiselect_questions" ADD CONSTRAINT "FK_d123697625fe564c2bae54dcecf" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_multiselect_questions" ADD CONSTRAINT "FK_92adcb35f2f14e316b4cb12a84e" FOREIGN KEY ("multiselect_question_id") REFERENCES "multiselect_questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" ADD CONSTRAINT "FK_e5d5291cd6ab92cbec304aab905" FOREIGN KEY ("building_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" ADD CONSTRAINT "FK_d54596fd877e83a3126d3953f36" FOREIGN KEY ("application_pick_up_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" ADD CONSTRAINT "FK_17e861d96c1bde13c1f4c344cb6" FOREIGN KEY ("application_drop_off_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" ADD CONSTRAINT "FK_7cedb0a800e3c0af7ede27ab1ec" FOREIGN KEY ("application_mailing_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" ADD CONSTRAINT "FK_2634b9bcb29ec36a629d9e379f0" FOREIGN KEY ("building_selection_criteria_file_id") REFERENCES "assets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" ADD CONSTRAINT "FK_ba0026e02ecfe91791aed1a4818" FOREIGN KEY ("jurisdiction_id") REFERENCES "jurisdictions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" ADD CONSTRAINT "FK_8a93cc462d190d3f1a04fa69156" FOREIGN KEY ("leasing_agent_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" ADD CONSTRAINT "FK_1f6fac73d27c81b656cc6100267" FOREIGN KEY ("reserved_community_type_id") REFERENCES "reserved_community_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" ADD CONSTRAINT "FK_3f7b2aedbfccd6297923943e311" FOREIGN KEY ("result_id") REFERENCES "assets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" ADD CONSTRAINT "FK_ac59a58a02199c57a588f045830" FOREIGN KEY ("features_id") REFERENCES "listing_features"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" ADD CONSTRAINT "FK_61b80a947c9db249548ba3c73a5" FOREIGN KEY ("utilities_id") REFERENCES "listing_utilities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "user_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "activity_logs" ADD CONSTRAINT "FK_d54f841fa5478e4734590d44036" FOREIGN KEY ("user_id") REFERENCES "user_accounts"("id") ON DELETE SET NULL ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "application_flagged_set" ADD CONSTRAINT "FK_3aed12c210529ed798beee9d09e" FOREIGN KEY ("resolving_user_id") REFERENCES "user_accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "application_flagged_set" ADD CONSTRAINT "FK_f2ace84eebd770f1387b47e5e45" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "translations" ADD CONSTRAINT "FK_181f8168d13457f0fd00b08b359" FOREIGN KEY ("jurisdiction_id") REFERENCES "jurisdictions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "applications_preferred_unit_unit_types" ADD CONSTRAINT "FK_8249d47edacc30250c18c53915a" FOREIGN KEY ("applications_id") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "applications_preferred_unit_unit_types" ADD CONSTRAINT "FK_5838635fbe9294cac64d1a0b605" FOREIGN KEY ("unit_types_id") REFERENCES "unit_types"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "jurisdictions_multiselect_questions_multiselect_questions" ADD CONSTRAINT "FK_3f7126f5da7c0368aea2f9459c0" FOREIGN KEY ("jurisdictions_id") REFERENCES "jurisdictions"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "jurisdictions_multiselect_questions_multiselect_questions" ADD CONSTRAINT "FK_ab91e5d403a6cf21656f7d5ae20" FOREIGN KEY ("multiselect_questions_id") REFERENCES "multiselect_questions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "listings_leasing_agents_user_accounts" ADD CONSTRAINT "FK_f7b22af2c421e823f60c5f7d28b" FOREIGN KEY ("listings_id") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "listings_leasing_agents_user_accounts" ADD CONSTRAINT "FK_de53131bc8a08f824a5d3dd51e3" FOREIGN KEY ("user_accounts_id") REFERENCES "user_accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "user_accounts_jurisdictions_jurisdictions" ADD CONSTRAINT "FK_e51e812700e143101aeaabbccc6" FOREIGN KEY ("user_accounts_id") REFERENCES "user_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "user_accounts_jurisdictions_jurisdictions" ADD CONSTRAINT "FK_fe359f4430f9e0e7b278e03f0f3" FOREIGN KEY ("jurisdictions_id") REFERENCES "jurisdictions"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "application_flagged_set_applications_applications" ADD CONSTRAINT "FK_93f583f2d43fb21c5d7ceac57e7" FOREIGN KEY ("application_flagged_set_id") REFERENCES "application_flagged_set"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "application_flagged_set_applications_applications" ADD CONSTRAINT "FK_bbae218ba0eff977157fad5ea31" FOREIGN KEY ("applications_id") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )

    const jurisDefault =
      "Housing Choice Vouchers, Section 8, and other valid rental assistance programs will be considered for this property. In the case of a valid rental subsidy, the required minimum income will be based on the portion of the rent that the tenant pays after the use of the subsidy."
    for (const jurisdictionName of [CountyCode.bay_area]) {
      await queryRunner.query(
        `INSERT INTO "jurisdictions" (name, rental_assistance_default, partner_terms) VALUES ($1, $2, $3)`,
        [jurisdictionName, jurisDefault, "Example Terms Go here"]
      )
    }
    for (const unitType of [
      { num_bedrooms: 0, name: "SRO" },
      { num_bedrooms: 0, name: "studio" },
      { num_bedrooms: 1, name: "oneBdrm" },
      { num_bedrooms: 2, name: "twoBdrm" },
      { num_bedrooms: 3, name: "threeBdrm" },
      { num_bedrooms: 4, name: "fourBdrm" },
      { num_bedrooms: 5, name: "fiveBdrm" },
    ]) {
      await queryRunner.query(`INSERT INTO "unit_types" (name, num_bedrooms) VALUES ($1, $2)`, [
        unitType.name,
        unitType.num_bedrooms,
      ])
    }
    for (const priorityType of [
      "Mobility",
      "Hearing",
      "Visual",
      "Hearing and Visual",
      "Mobility and Hearing",
      "Mobility and Visual",
      "Mobility, Hearing and Visual",
    ]) {
      await queryRunner.query(
        `INSERT INTO "unit_accessibility_priority_types" (name) VALUES ($1)`,
        [priorityType]
      )
    }
    for (const unitRentType of ["fixed", "percentageOfIncome"]) {
      await queryRunner.query(`INSERT INTO "unit_rent_types" (name) VALUES ($1)`, [unitRentType])
    }

    const [{ id: jurisdictionId }] = await queryRunner.query(
      `SELECT id FROM jurisdictions WHERE name = 'Bay Area' LIMIT 1`
    )

    for (const communityType of ["specialNeeds", "senior55", "senior62"]) {
      await queryRunner.query(
        `INSERT INTO reserved_community_types (name, jurisdiction_id) VALUES ($1, $2)`,
        [communityType, jurisdictionId]
      )
    }

    const translations = {
      changeEmail: {
        message: "An email address change has been requested for your account.",
        onChangeEmailMessage:
          "To confirm the change to your email address, please click the link below:",
        changeMyEmail: "Confirm email change",
      },
      invite: {
        hello: "Welcome to the Partners Portal",
        inviteMessage:
          "Welcome to the Partners Portal on %{appUrl}. You will now be able to manage listings and applications that you are a part of from one centralized location.",
        inviteManageListings:
          "You will now be able to manage listings and applications that you are a part of from one centralized location.",
        inviteWelcomeMessage: "Welcome to the Partners Portal at %{appUrl}.",
        toCompleteAccountCreation:
          "To complete your account creation, please click the link below:",
        confirmMyAccount: "Confirm my account",
      },
      mfaCodeEmail: {
        message: "Access code for your account has been requested.",
        mfaCode: "Your access code is: %{mfaCode}",
      },
      header: {
        logoUrl:
          "https://res.cloudinary.com/exygy/image/upload/v1652459319/housingbayarea/163838489-d5a1bc08-7d69-4c4a-8a94-8485617d8b46_dkkqvw.png",
        logoTitle: "Alameda County Housing Portal",
      },
      footer: {
        line1:
          "Alameda County Housing Portal is a project of the Alameda County - Housing and Community Development (HCD) Department",
        line2: "",
      },
    }

    await queryRunner.query(
      `INSERT INTO translations (language, translations, jurisdiction_id) VALUES ($1, $2, $3)`,
      ["en", JSON.stringify(translations), jurisdictionId]
    )

    await queryRunner.query(`INSERT INTO translations (language, translations) VALUES ($1, $2)`, [
      "en",
      JSON.stringify(translations),
    ])
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "application_flagged_set_applications_applications" DROP CONSTRAINT "FK_bbae218ba0eff977157fad5ea31"`
    )
    await queryRunner.query(
      `ALTER TABLE "application_flagged_set_applications_applications" DROP CONSTRAINT "FK_93f583f2d43fb21c5d7ceac57e7"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_accounts_jurisdictions_jurisdictions" DROP CONSTRAINT "FK_fe359f4430f9e0e7b278e03f0f3"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_accounts_jurisdictions_jurisdictions" DROP CONSTRAINT "FK_e51e812700e143101aeaabbccc6"`
    )
    await queryRunner.query(
      `ALTER TABLE "listings_leasing_agents_user_accounts" DROP CONSTRAINT "FK_de53131bc8a08f824a5d3dd51e3"`
    )
    await queryRunner.query(
      `ALTER TABLE "listings_leasing_agents_user_accounts" DROP CONSTRAINT "FK_f7b22af2c421e823f60c5f7d28b"`
    )
    await queryRunner.query(
      `ALTER TABLE "jurisdictions_multiselect_questions_multiselect_questions" DROP CONSTRAINT "FK_ab91e5d403a6cf21656f7d5ae20"`
    )
    await queryRunner.query(
      `ALTER TABLE "jurisdictions_multiselect_questions_multiselect_questions" DROP CONSTRAINT "FK_3f7126f5da7c0368aea2f9459c0"`
    )
    await queryRunner.query(
      `ALTER TABLE "applications_preferred_unit_unit_types" DROP CONSTRAINT "FK_5838635fbe9294cac64d1a0b605"`
    )
    await queryRunner.query(
      `ALTER TABLE "applications_preferred_unit_unit_types" DROP CONSTRAINT "FK_8249d47edacc30250c18c53915a"`
    )
    await queryRunner.query(
      `ALTER TABLE "translations" DROP CONSTRAINT "FK_181f8168d13457f0fd00b08b359"`
    )
    await queryRunner.query(
      `ALTER TABLE "application_flagged_set" DROP CONSTRAINT "FK_f2ace84eebd770f1387b47e5e45"`
    )
    await queryRunner.query(
      `ALTER TABLE "application_flagged_set" DROP CONSTRAINT "FK_3aed12c210529ed798beee9d09e"`
    )
    await queryRunner.query(
      `ALTER TABLE "activity_logs" DROP CONSTRAINT "FK_d54f841fa5478e4734590d44036"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_87b8888186ca9769c960e926870"`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" DROP CONSTRAINT "FK_61b80a947c9db249548ba3c73a5"`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" DROP CONSTRAINT "FK_ac59a58a02199c57a588f045830"`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" DROP CONSTRAINT "FK_3f7b2aedbfccd6297923943e311"`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" DROP CONSTRAINT "FK_1f6fac73d27c81b656cc6100267"`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" DROP CONSTRAINT "FK_8a93cc462d190d3f1a04fa69156"`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" DROP CONSTRAINT "FK_ba0026e02ecfe91791aed1a4818"`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" DROP CONSTRAINT "FK_2634b9bcb29ec36a629d9e379f0"`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" DROP CONSTRAINT "FK_7cedb0a800e3c0af7ede27ab1ec"`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" DROP CONSTRAINT "FK_17e861d96c1bde13c1f4c344cb6"`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" DROP CONSTRAINT "FK_d54596fd877e83a3126d3953f36"`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" DROP CONSTRAINT "FK_e5d5291cd6ab92cbec304aab905"`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_multiselect_questions" DROP CONSTRAINT "FK_92adcb35f2f14e316b4cb12a84e"`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_multiselect_questions" DROP CONSTRAINT "FK_d123697625fe564c2bae54dcecf"`
    )
    await queryRunner.query(`ALTER TABLE "units" DROP CONSTRAINT "FK_4ca3d4c823e6bd5149ecaad363a"`)
    await queryRunner.query(`ALTER TABLE "units" DROP CONSTRAINT "FK_6981f323d01ba8d55190480078d"`)
    await queryRunner.query(`ALTER TABLE "units" DROP CONSTRAINT "FK_ff9559bf9a1daecef4a89bad4a9"`)
    await queryRunner.query(`ALTER TABLE "units" DROP CONSTRAINT "FK_1e193f5ffdda908517e47d4e021"`)
    await queryRunner.query(`ALTER TABLE "units" DROP CONSTRAINT "FK_9aebcde52d6e054e5ac5d26228c"`)
    await queryRunner.query(`ALTER TABLE "units" DROP CONSTRAINT "FK_35571c6bd2a1ff690201d1dff08"`)
    await queryRunner.query(
      `ALTER TABLE "ami_chart" DROP CONSTRAINT "FK_5566b52b2e7c0056e3b81c171f1"`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_images" DROP CONSTRAINT "FK_6fc0fefe11fb46d5ee863ed483a"`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_images" DROP CONSTRAINT "FK_94041359df3c1b14c4420808d16"`
    )
    await queryRunner.query(
      `ALTER TABLE "units_summary" DROP CONSTRAINT "FK_4791099ef82551aa9819a71d8f5"`
    )
    await queryRunner.query(
      `ALTER TABLE "units_summary" DROP CONSTRAINT "FK_4edda29192dbc0c6a18e15437a0"`
    )
    await queryRunner.query(
      `ALTER TABLE "units_summary" DROP CONSTRAINT "FK_0eae6ec11a6109496d80d9a88f9"`
    )
    await queryRunner.query(
      `ALTER TABLE "application_methods" DROP CONSTRAINT "FK_3057650361c2aeab15dfee5c3cc"`
    )
    await queryRunner.query(
      `ALTER TABLE "paper_applications" DROP CONSTRAINT "FK_bd67da96ae3e2c0e37394ba1dd3"`
    )
    await queryRunner.query(
      `ALTER TABLE "paper_applications" DROP CONSTRAINT "FK_493291d04c708dda2ffe5b521e7"`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_events" DROP CONSTRAINT "FK_4fd176b179ce281bedb1b7b9f2b"`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_events" DROP CONSTRAINT "FK_d0b9892bc613e4d9f8b5c25d03e"`
    )
    await queryRunner.query(
      `ALTER TABLE "reserved_community_types" DROP CONSTRAINT "FK_8b43c85a0dd0c39ca795c369edc"`
    )
    await queryRunner.query(
      `ALTER TABLE "applications" DROP CONSTRAINT "FK_fed5da45b7b4dafd9f025a37dd1"`
    )
    await queryRunner.query(
      `ALTER TABLE "applications" DROP CONSTRAINT "FK_3a4c71bc34dce9f6c196f110935"`
    )
    await queryRunner.query(
      `ALTER TABLE "applications" DROP CONSTRAINT "FK_56abaa378952856aaccc64d7eb3"`
    )
    await queryRunner.query(
      `ALTER TABLE "applications" DROP CONSTRAINT "FK_7fc41f89f22ca59ffceab5da80e"`
    )
    await queryRunner.query(
      `ALTER TABLE "applications" DROP CONSTRAINT "FK_b72ba26ebc88981f441b30fe3c5"`
    )
    await queryRunner.query(
      `ALTER TABLE "applications" DROP CONSTRAINT "FK_194d0fca275b8661a56e486cb64"`
    )
    await queryRunner.query(
      `ALTER TABLE "applications" DROP CONSTRAINT "FK_cc9d65c58d8deb0ef5353e9037d"`
    )
    await queryRunner.query(
      `ALTER TABLE "applications" DROP CONSTRAINT "FK_9e7594d5b474d9cbebba15c1ae7"`
    )
    await queryRunner.query(
      `ALTER TABLE "household_member" DROP CONSTRAINT "FK_520996eeecf9f6fb9425dc7352c"`
    )
    await queryRunner.query(
      `ALTER TABLE "household_member" DROP CONSTRAINT "FK_f390552cbb929761927c70b7a0d"`
    )
    await queryRunner.query(
      `ALTER TABLE "household_member" DROP CONSTRAINT "FK_7b61da64f1b7a6bbb48eb5bbb43"`
    )
    await queryRunner.query(
      `ALTER TABLE "alternate_contact" DROP CONSTRAINT "FK_5eb038a51b9cd6872359a687b18"`
    )
    await queryRunner.query(
      `ALTER TABLE "applicant" DROP CONSTRAINT "FK_8ba2b09030c3a2b857dda5f83fe"`
    )
    await queryRunner.query(
      `ALTER TABLE "applicant" DROP CONSTRAINT "FK_7d357035705ebbbe91b50346781"`
    )
    await queryRunner.query(`DROP INDEX "public"."IDX_bbae218ba0eff977157fad5ea3"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_93f583f2d43fb21c5d7ceac57e"`)
    await queryRunner.query(`DROP TABLE "application_flagged_set_applications_applications"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_fe359f4430f9e0e7b278e03f0f"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_e51e812700e143101aeaabbccc"`)
    await queryRunner.query(`DROP TABLE "user_accounts_jurisdictions_jurisdictions"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_de53131bc8a08f824a5d3dd51e"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_f7b22af2c421e823f60c5f7d28"`)
    await queryRunner.query(`DROP TABLE "listings_leasing_agents_user_accounts"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_ab91e5d403a6cf21656f7d5ae2"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_3f7126f5da7c0368aea2f9459c"`)
    await queryRunner.query(
      `DROP TABLE "jurisdictions_multiselect_questions_multiselect_questions"`
    )
    await queryRunner.query(`DROP INDEX "public"."IDX_5838635fbe9294cac64d1a0b60"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_8249d47edacc30250c18c53915"`)
    await queryRunner.query(`DROP TABLE "applications_preferred_unit_unit_types"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_4655e7b2c26deb4b8156ea8100"`)
    await queryRunner.query(`DROP TABLE "translations"`)
    await queryRunner.query(`DROP TABLE "generated_listing_translations"`)
    await queryRunner.query(`DROP TABLE "cron_job"`)
    await queryRunner.query(`DROP TABLE "revoked_tokens"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_f2ace84eebd770f1387b47e5e4"`)
    await queryRunner.query(`DROP TABLE "application_flagged_set"`)
    await queryRunner.query(`DROP TABLE "activity_logs"`)
    await queryRunner.query(`DROP TABLE "user_accounts"`)
    await queryRunner.query(`DROP TABLE "user_roles"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_ba0026e02ecfe91791aed1a481"`)
    await queryRunner.query(`DROP TABLE "listings"`)
    await queryRunner.query(`DROP TYPE "public"."listings_review_order_type_enum"`)
    await queryRunner.query(`DROP TYPE "public"."listings_status_enum"`)
    await queryRunner.query(`DROP TYPE "public"."listings_application_mailing_address_type_enum"`)
    await queryRunner.query(`DROP TYPE "public"."listings_application_drop_off_address_type_enum"`)
    await queryRunner.query(`DROP TYPE "public"."listings_application_pick_up_address_type_enum"`)
    await queryRunner.query(`DROP TABLE "listing_multiselect_questions"`)
    await queryRunner.query(`DROP TABLE "units"`)
    await queryRunner.query(`DROP TABLE "unit_ami_chart_overrides"`)
    await queryRunner.query(`DROP TABLE "unit_rent_types"`)
    await queryRunner.query(`DROP TABLE "ami_chart"`)
    await queryRunner.query(`DROP TABLE "listing_utilities"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_94041359df3c1b14c4420808d1"`)
    await queryRunner.query(`DROP TABLE "listing_images"`)
    await queryRunner.query(`DROP TABLE "listing_features"`)
    await queryRunner.query(`DROP TABLE "units_summary"`)
    await queryRunner.query(`DROP TABLE "unit_accessibility_priority_types"`)
    await queryRunner.query(`DROP TABLE "application_methods"`)
    await queryRunner.query(`DROP TYPE "public"."application_methods_type_enum"`)
    await queryRunner.query(`DROP TABLE "paper_applications"`)
    await queryRunner.query(`DROP TABLE "listing_events"`)
    await queryRunner.query(`DROP TYPE "public"."listing_events_type_enum"`)
    await queryRunner.query(`DROP TABLE "assets"`)
    await queryRunner.query(`DROP TABLE "reserved_community_types"`)
    await queryRunner.query(`DROP TABLE "jurisdictions"`)
    await queryRunner.query(`DROP TYPE "public"."jurisdictions_languages_enum"`)
    await queryRunner.query(`DROP TABLE "multiselect_questions"`)
    await queryRunner.query(`DROP TYPE "public"."multiselect_questions_application_section_enum"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_cc9d65c58d8deb0ef5353e9037"`)
    await queryRunner.query(`DROP TABLE "applications"`)
    await queryRunner.query(`DROP TABLE "unit_types"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_520996eeecf9f6fb9425dc7352"`)
    await queryRunner.query(`DROP TABLE "household_member"`)
    await queryRunner.query(`DROP TABLE "demographics"`)
    await queryRunner.query(`DROP TABLE "accessibility"`)
    await queryRunner.query(`DROP TABLE "alternate_contact"`)
    await queryRunner.query(`DROP TABLE "applicant"`)
    await queryRunner.query(`DROP TABLE "address"`)
  }
}
