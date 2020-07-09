import {MigrationInterface, QueryRunner} from "typeorm";

export class initialMigration1593085069033 implements MigrationInterface {
    name = 'initialMigration1593085069033'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_accounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "password_hash" character varying NOT NULL, "email" character varying NOT NULL, "first_name" character varying NOT NULL, "middle_name" character varying, "last_name" character varying NOT NULL, "dob" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_125e915cf23ad1cfb43815ce59b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "units" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ami_percentage" text, "annual_income_min" text, "monthly_income_min" numeric(8,2), "floor" numeric, "annual_income_max" text, "max_occupancy" numeric, "min_occupancy" numeric, "monthly_rent" numeric(8,2), "num_bathrooms" numeric, "num_bedrooms" numeric, "number" text, "priority_type" text, "reserved_type" text, "sq_feet" numeric(8,2), "status" text, "unit_type" text, "created_at" date, "updated_at" date, "ami_chart_id" numeric, "monthly_rent_as_percent_of_income" numeric(8,2), "listing_id" uuid, CONSTRAINT "PK_5a8f2f064919b587d93936cb223" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "preferences" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ordinal" text, "title" text, "subtitle" text, "description" text, "links" jsonb, "listing_id" uuid, CONSTRAINT "PK_17f8855e4145192bbabd91a51be" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "attachments_type_enum" AS ENUM('1', '2')`);
        await queryRunner.query(`CREATE TABLE "attachments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "label" text, "file_url" text, "type" "attachments_type_enum", "listing_id" uuid, CONSTRAINT "PK_5e1f050bcff31e3084a1d662412" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "listings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "accepting_applications_at_leasing_agent" boolean, "accepting_applications_by_po_box" boolean, "accepting_online_applications" boolean, "accepts_postmarked_applications" boolean, "accessibility" text, "amenities" text, "application_due_date" text, "application_open_date" text, "application_fee" text, "application_organization" text, "application_address" jsonb, "blank_paper_application_can_be_picked_up" boolean, "building_address" jsonb, "building_total_units" numeric, "building_selection_criteria" text, "costs_not_included" text, "credit_history" text, "criminal_background" text, "deposit_min" text, "deposit_max" text, "developer" text, "disable_units_accordion" boolean, "image_url" text, "leasing_agent_address" jsonb, "leasing_agent_email" text, "leasing_agent_name" text, "leasing_agent_office_hours" text, "leasing_agent_phone" text, "leasing_agent_title" text, "name" text, "neighborhood" text, "pet_policy" text, "postmarked_applications_received_by_date" text, "program_rules" text, "rental_history" text, "required_documents" text, "smoking_policy" text, "units_available" numeric, "unit_amenities" text, "waitlist_current_size" numeric, "waitlist_max_size" numeric, "what_to_expect" jsonb, "year_built" numeric, CONSTRAINT "PK_520ecac6c99ec90bcf5a603cdcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "applications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "listing_id" uuid NOT NULL, "application" jsonb, CONSTRAINT "PK_938c0a27255637bde919591888f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "revoked_tokens" ("token" character varying NOT NULL, "revoked_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f38f625b4823c8903e819bfedd1" PRIMARY KEY ("token"))`);
        await queryRunner.query(`ALTER TABLE "units" ADD CONSTRAINT "FK_9aebcde52d6e054e5ac5d26228c" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "preferences" ADD CONSTRAINT "FK_91017f2182ec7b0dcd4abe68b5a" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "attachments" ADD CONSTRAINT "FK_4f28a952892a175dbb21d05d96d" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "applications" ADD CONSTRAINT "FK_9e7594d5b474d9cbebba15c1ae7" FOREIGN KEY ("user_id") REFERENCES "user_accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "applications" ADD CONSTRAINT "FK_cc9d65c58d8deb0ef5353e9037d" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "applications" DROP CONSTRAINT "FK_cc9d65c58d8deb0ef5353e9037d"`);
        await queryRunner.query(`ALTER TABLE "applications" DROP CONSTRAINT "FK_9e7594d5b474d9cbebba15c1ae7"`);
        await queryRunner.query(`ALTER TABLE "attachments" DROP CONSTRAINT "FK_4f28a952892a175dbb21d05d96d"`);
        await queryRunner.query(`ALTER TABLE "preferences" DROP CONSTRAINT "FK_91017f2182ec7b0dcd4abe68b5a"`);
        await queryRunner.query(`ALTER TABLE "units" DROP CONSTRAINT "FK_9aebcde52d6e054e5ac5d26228c"`);
        await queryRunner.query(`DROP TABLE "revoked_tokens"`);
        await queryRunner.query(`DROP TABLE "applications"`);
        await queryRunner.query(`DROP TABLE "listings"`);
        await queryRunner.query(`DROP TABLE "attachments"`);
        await queryRunner.query(`DROP TYPE "attachments_type_enum"`);
        await queryRunner.query(`DROP TABLE "preferences"`);
        await queryRunner.query(`DROP TABLE "units"`);
        await queryRunner.query(`DROP TABLE "user_accounts"`);
    }

}
