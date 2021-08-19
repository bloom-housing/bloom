import { MigrationInterface, QueryRunner } from "typeorm"

export class AddNumBedroomsFieldToUnitType1628631437422 implements MigrationInterface {
  name = "AddNumBedroomsFieldToUnitType1628631437422"

  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`ALTER TABLE "unit_types" ADD "num_bedrooms" integer`)
    queryRunner.query(`UPDATE "unit_types" SET "num_bedrooms" = CASE
  WHEN "name" = 'studio' THEN 0
  WHEN "name" = 'oneBdrm' THEN 1
  WHEN "name" = 'twoBdrm' THEN 2
  WHEN "name" = 'threeBdrm' THEN 3
  WHEN "name" = 'fourBdrm' THEN 4
  WHEN "name" = 'fiveBdrm' THEN 5
END`)
    queryRunner.query(`ALTER TABLE "unit_types" ALTER COLUMN "num_bedrooms" SET NOT NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "unit_types" DROP COLUMN "num_bedrooms"`)
  }
}
