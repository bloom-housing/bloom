import { MigrationInterface, QueryRunner } from "typeorm"

export class updateUnitsSummaryStructure1629225262377 implements MigrationInterface {
  name = "updateUnitsSummaryStructure1629225262377"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "units_summary" DROP CONSTRAINT "FK_a2b6519fc3d102d4611a0e2b879"`
    )
    await queryRunner.query(
      `ALTER TABLE "units_summary" DROP CONSTRAINT "PK_dd5b004243c1536a412e425a9ec"`
    )
    await queryRunner.query(`ALTER TABLE "units_summary" DROP COLUMN "property_id"`)
    await queryRunner.query(
      `ALTER TABLE "units_summary" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`
    )
    await queryRunner.query(`ALTER TABLE "units_summary" ADD "listing_id" uuid`)
    await queryRunner.query(`ALTER TABLE "units_summary" ALTER COLUMN "unit_type_id" DROP NOT NULL`)
    await queryRunner.query(`ALTER TABLE "units_summary" ALTER COLUMN "monthly_rent" DROP NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "units_summary" ADD CONSTRAINT "PK_8d8c4940fab2a9d1b2e7ddd9e49" PRIMARY KEY ("id")`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "units_summary" DROP CONSTRAINT "PK_8d8c4940fab2a9d1b2e7ddd9e49"`
    )
    await queryRunner.query(`ALTER TABLE "units_summary" ALTER COLUMN "monthly_rent" SET NOT NULL`)
    await queryRunner.query(`ALTER TABLE "units_summary" ALTER COLUMN "unit_type_id" SET NOT NULL`)
    await queryRunner.query(`ALTER TABLE "units_summary" DROP COLUMN "listing_id"`)
    await queryRunner.query(`ALTER TABLE "units_summary" DROP COLUMN "id"`)
    await queryRunner.query(`ALTER TABLE "units_summary" ADD "property_id" uuid NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "units_summary" ADD CONSTRAINT "PK_dd5b004243c1536a412e425a9ec" PRIMARY KEY ("monthly_rent", "unit_type_id", "property_id")`
    )
    await queryRunner.query(
      `ALTER TABLE "units_summary" ADD CONSTRAINT "FK_a2b6519fc3d102d4611a0e2b879" FOREIGN KEY ("property_id") REFERENCES "property"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }
}
