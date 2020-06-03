import { MigrationInterface, QueryRunner } from "typeorm"

export class InitialDB1591216428086 implements MigrationInterface {
  name = "InitialDB1591216428086"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "unit" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ami_percentage" text, "annual_income_min" text, "monthly_income_min" numeric(8,2), "floor" numeric, "annual_income_max" text, "max_occupancy" numeric, "min_occupancy" numeric, "monthly_rent" numeric(8,2), "num_bathrooms" numeric, "num_bedrooms" numeric, "number" text, "priority_type" text, "reserved_type" text, "sq_feet" numeric(8,2), "status" text, "unit_type" text, "created_at" date, "updated_at" date, "ami_chart_id" numeric, "monthly_rent_as_percent_of_income" numeric(8,2), "listing_id" uuid, CONSTRAINT "PK_4252c4be609041e559f0c80f58a" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "preference" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ordinal" text, "title" text, "subtitle" text, "description" text, "links" jsonb, "listing_id" uuid, CONSTRAINT "PK_5c4cbf49a1e97dcbc695bf462a6" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "listing" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "accepting_applications_at_leasing_agent" boolean, "accepting_applications_by_po_box" boolean, "accepting_online_applications" boolean, "accepts_postmarked_applications" boolean, "accessibility" text, "amenities" text, "application_due_date" text, "application_open_date" text, "application_fee" text, "application_organization" text, "application_address" jsonb, "blank_paper_application_can_be_picked_up" boolean, "building_address" jsonb, "building_total_units" numeric, "building_selection_criteria" text, "costs_not_included" text, "credit_history" text, "criminal_background" text, "deposit_min" text, "deposit_max" text, "developer" text, "disable_units_accordion" boolean, "image_url" text, "leasing_agent_address" jsonb, "leasing_agent_email" text, "leasing_agent_name" text, "leasing_agent_office_hours" text, "leasing_agent_phone" text, "leasing_agent_title" text, "name" text, "neighborhood" text, "pet_policy" text, "postmarked_applications_received_by_date" text, "program_rules" text, "rental_history" text, "required_documents" text, "smoking_policy" text, "units_available" numeric, "unit_amenities" text, "waitlist_current_size" numeric, "waitlist_max_size" numeric, "year_built" numeric, CONSTRAINT "PK_381d45ebb8692362c156d6b87d7" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(`CREATE TYPE "attachment_type_enum" AS ENUM('1', '2')`)
    await queryRunner.query(
      `CREATE TABLE "attachment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "label" text, "file_url" text, "type" "attachment_type_enum", "listing_id" uuid, CONSTRAINT "PK_d2a80c3a8d467f08a750ac4b420" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "unit" ADD CONSTRAINT "FK_864734eff00c6024f03ea8f4a76" FOREIGN KEY ("listing_id") REFERENCES "listing"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "preference" ADD CONSTRAINT "FK_77277ff36d4816ea826f1832b3d" FOREIGN KEY ("listing_id") REFERENCES "listing"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "attachment" ADD CONSTRAINT "FK_3182c0e8d5e659520b1795208c3" FOREIGN KEY ("listing_id") REFERENCES "listing"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "attachment" DROP CONSTRAINT "FK_3182c0e8d5e659520b1795208c3"`
    )
    await queryRunner.query(
      `ALTER TABLE "preference" DROP CONSTRAINT "FK_77277ff36d4816ea826f1832b3d"`
    )
    await queryRunner.query(`ALTER TABLE "unit" DROP CONSTRAINT "FK_864734eff00c6024f03ea8f4a76"`)
    await queryRunner.query(`DROP TABLE "attachment"`)
    await queryRunner.query(`DROP TYPE "attachment_type_enum"`)
    await queryRunner.query(`DROP TABLE "listing"`)
    await queryRunner.query(`DROP TABLE "preference"`)
    await queryRunner.query(`DROP TABLE "unit"`)
  }
}
