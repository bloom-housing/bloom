import { MigrationInterface, QueryRunner } from "typeorm"

export class initial1599673143230 implements MigrationInterface {
  name = "initial1599673143230"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "units" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "ami_percentage" text, "annual_income_min" text, "monthly_income_min" text, "floor" numeric, "annual_income_max" text, "max_occupancy" numeric, "min_occupancy" numeric, "monthly_rent" text, "num_bathrooms" numeric, "num_bedrooms" numeric, "number" text, "priority_type" text, "reserved_type" text, "sq_feet" numeric(8,2), "status" text, "unit_type" text, "ami_chart_id" numeric, "monthly_rent_as_percent_of_income" numeric(8,2), "listing_id" uuid, "bmr_program_chart" boolean, CONSTRAINT "PK_5a8f2f064919b587d93936cb223" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "user_accounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "password_hash" character varying NOT NULL, "email" character varying NOT NULL, "first_name" character varying NOT NULL, "middle_name" character varying, "last_name" character varying NOT NULL, "dob" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_125e915cf23ad1cfb43815ce59b" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "applications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "app_url" text NOT NULL, "application" jsonb, "user_id" uuid, "listing_id" uuid, CONSTRAINT "PK_938c0a27255637bde919591888f" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "assets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "label" text NOT NULL, "file_id" text NOT NULL, "listing_id" uuid, CONSTRAINT "PK_da96729a8b113377cfb6a62439c" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "preferences" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "ordinal" text, "title" text, "subtitle" text, "description" text, "links" jsonb, "listing_id" uuid, CONSTRAINT "PK_17f8855e4145192bbabd91a51be" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(`CREATE TYPE "listings_status_enum" AS ENUM('active', 'pending')`)
    await queryRunner.query(
      `CREATE TABLE "listings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "accessibility" text, "amenities" text, "application_due_date" text, "application_open_date" text, "application_fee" text, "application_organization" text, "application_address" jsonb, "blank_paper_application_can_be_picked_up" boolean, "building_address" jsonb, "building_total_units" numeric, "building_selection_criteria" text, "costs_not_included" text, "credit_history" text, "criminal_background" text, "deposit_min" text, "deposit_max" text, "developer" text, "disable_units_accordion" boolean, "household_size_max" numeric, "household_size_min" numeric, "image_url" text, "leasing_agent_address" jsonb, "leasing_agent_email" text, "leasing_agent_name" text, "leasing_agent_office_hours" text, "leasing_agent_phone" text, "leasing_agent_title" text, "name" text, "neighborhood" text, "pet_policy" text, "postmarked_applications_received_by_date" text, "program_rules" text, "rental_history" text, "required_documents" text, "smoking_policy" text, "units_available" numeric, "unit_amenities" text, "waitlist_current_size" numeric, "waitlist_max_size" numeric, "what_to_expect" jsonb, "year_built" numeric, "status" "listings_status_enum" NOT NULL DEFAULT 'pending', CONSTRAINT "PK_520ecac6c99ec90bcf5a603cdcb" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TYPE "application_methods_type_enum" AS ENUM('Internal', 'FileDownload', 'ExternalLink', 'PaperPickup', 'POBox', 'LeasingAgent')`
    )
    await queryRunner.query(
      `CREATE TABLE "application_methods" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "type" "application_methods_type_enum" NOT NULL, "label" text, "external_reference" text, "accepts_postmarked_applications" boolean, "listing_id" uuid, CONSTRAINT "PK_c58506819ffaba3863a4edc5e9e" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "revoked_tokens" ("token" character varying NOT NULL, "revoked_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f38f625b4823c8903e819bfedd1" PRIMARY KEY ("token"))`
    )
    await queryRunner.query(
      `ALTER TABLE "units" ADD CONSTRAINT "FK_9aebcde52d6e054e5ac5d26228c" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "applications" ADD CONSTRAINT "FK_9e7594d5b474d9cbebba15c1ae7" FOREIGN KEY ("user_id") REFERENCES "user_accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "applications" ADD CONSTRAINT "FK_cc9d65c58d8deb0ef5353e9037d" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "assets" ADD CONSTRAINT "FK_8cb54e950245d30651b903a4c61" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "preferences" ADD CONSTRAINT "FK_91017f2182ec7b0dcd4abe68b5a" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "application_methods" ADD CONSTRAINT "FK_3057650361c2aeab15dfee5c3cc" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "application_methods" DROP CONSTRAINT "FK_3057650361c2aeab15dfee5c3cc"`
    )
    await queryRunner.query(
      `ALTER TABLE "preferences" DROP CONSTRAINT "FK_91017f2182ec7b0dcd4abe68b5a"`
    )
    await queryRunner.query(`ALTER TABLE "assets" DROP CONSTRAINT "FK_8cb54e950245d30651b903a4c61"`)
    await queryRunner.query(
      `ALTER TABLE "applications" DROP CONSTRAINT "FK_cc9d65c58d8deb0ef5353e9037d"`
    )
    await queryRunner.query(
      `ALTER TABLE "applications" DROP CONSTRAINT "FK_9e7594d5b474d9cbebba15c1ae7"`
    )
    await queryRunner.query(`ALTER TABLE "units" DROP CONSTRAINT "FK_9aebcde52d6e054e5ac5d26228c"`)
    await queryRunner.query(`DROP TABLE "revoked_tokens"`)
    await queryRunner.query(`DROP TABLE "application_methods"`)
    await queryRunner.query(`DROP TYPE "application_methods_type_enum"`)
    await queryRunner.query(`DROP TABLE "listings"`)
    await queryRunner.query(`DROP TYPE "listings_status_enum"`)
    await queryRunner.query(`DROP TABLE "preferences"`)
    await queryRunner.query(`DROP TABLE "assets"`)
    await queryRunner.query(`DROP TABLE "applications"`)
    await queryRunner.query(`DROP TABLE "user_accounts"`)
    await queryRunner.query(`DROP TABLE "units"`)
  }
}
