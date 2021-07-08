import { MigrationInterface, QueryRunner } from "typeorm"

export class addPropertiesAndGroups1604669588916 implements MigrationInterface {
  name = "addPropertiesAndGroups1604669588916"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "units" DROP CONSTRAINT "FK_9aebcde52d6e054e5ac5d26228c"`)
    await queryRunner.query(`ALTER TABLE "units" RENAME COLUMN "listing_id" TO "property_id"`)
    await queryRunner.query(
      `CREATE TABLE "property_group" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "PK_30c4d5d238ffc95e72d94837e54" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "property" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "accessibility" text, "amenities" text, "building_address" jsonb, "building_total_units" integer, "developer" text, "household_size_max" integer, "household_size_min" integer, "neighborhood" text, "pet_policy" text, "smoking_policy" text, "units_available" integer, "unit_amenities" text, "year_built" integer, CONSTRAINT "PK_d80743e6191258a5003d5843b4f" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "property_group_properties_property" ("property_group_id" uuid NOT NULL, "property_id" uuid NOT NULL, CONSTRAINT "PK_7d88a8faf587c93493dd120dd83" PRIMARY KEY ("property_group_id", "property_id"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_84e6a1949911510df0eff691f0" ON "property_group_properties_property" ("property_group_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_c99e75ee805d56fea44bf2970f" ON "property_group_properties_property" ("property_id") `
    )
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "accessibility"`)
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "amenities"`)
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "building_address"`)
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "building_total_units"`)
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "developer"`)
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "household_size_max"`)
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "household_size_min"`)
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "image_url"`)
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "neighborhood"`)
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "pet_policy"`)
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "smoking_policy"`)
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "units_available"`)
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "unit_amenities"`)
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "year_built"`)
    await queryRunner.query(`ALTER TABLE "listings" ADD "property_id" uuid NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "units" ADD CONSTRAINT "FK_f221e6d7bfd686266003b982b5f" FOREIGN KEY ("property_id") REFERENCES "property"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" ADD CONSTRAINT "FK_9eef913a9013d6e3d09a92ec075" FOREIGN KEY ("property_id") REFERENCES "property"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "property_group_properties_property" ADD CONSTRAINT "FK_84e6a1949911510df0eff691f0d" FOREIGN KEY ("property_group_id") REFERENCES "property_group"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "property_group_properties_property" ADD CONSTRAINT "FK_c99e75ee805d56fea44bf2970f2" FOREIGN KEY ("property_id") REFERENCES "property"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "property_group_properties_property" DROP CONSTRAINT "FK_c99e75ee805d56fea44bf2970f2"`
    )
    await queryRunner.query(
      `ALTER TABLE "property_group_properties_property" DROP CONSTRAINT "FK_84e6a1949911510df0eff691f0d"`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" DROP CONSTRAINT "FK_9eef913a9013d6e3d09a92ec075"`
    )
    await queryRunner.query(`ALTER TABLE "units" DROP CONSTRAINT "FK_f221e6d7bfd686266003b982b5f"`)
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "property_id"`)
    await queryRunner.query(`ALTER TABLE "listings" ADD "year_built" integer`)
    await queryRunner.query(`ALTER TABLE "listings" ADD "unit_amenities" text`)
    await queryRunner.query(`ALTER TABLE "listings" ADD "units_available" integer`)
    await queryRunner.query(`ALTER TABLE "listings" ADD "smoking_policy" text`)
    await queryRunner.query(`ALTER TABLE "listings" ADD "pet_policy" text`)
    await queryRunner.query(`ALTER TABLE "listings" ADD "neighborhood" text`)
    await queryRunner.query(`ALTER TABLE "listings" ADD "image_url" text`)
    await queryRunner.query(`ALTER TABLE "listings" ADD "household_size_min" integer`)
    await queryRunner.query(`ALTER TABLE "listings" ADD "household_size_max" integer`)
    await queryRunner.query(`ALTER TABLE "listings" ADD "developer" text`)
    await queryRunner.query(`ALTER TABLE "listings" ADD "building_total_units" integer`)
    await queryRunner.query(`ALTER TABLE "listings" ADD "building_address" jsonb`)
    await queryRunner.query(`ALTER TABLE "listings" ADD "amenities" text`)
    await queryRunner.query(`ALTER TABLE "listings" ADD "accessibility" text`)
    await queryRunner.query(`DROP INDEX "IDX_c99e75ee805d56fea44bf2970f"`)
    await queryRunner.query(`DROP INDEX "IDX_84e6a1949911510df0eff691f0"`)
    await queryRunner.query(`DROP TABLE "property_group_properties_property"`)
    await queryRunner.query(`DROP TABLE "property"`)
    await queryRunner.query(`DROP TABLE "property_group"`)
    await queryRunner.query(`ALTER TABLE "units" RENAME COLUMN "property_id" TO "listing_id"`)
    await queryRunner.query(
      `ALTER TABLE "units" ADD CONSTRAINT "FK_9aebcde52d6e054e5ac5d26228c" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
  }
}
