import { MigrationInterface, QueryRunner } from "typeorm"

export class updatedIntegerListingFieldsToNumeric1649273182040 implements MigrationInterface {
  name = "updatedIntegerListingFieldsToNumeric1649273182040"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "unit_group_ami_levels" ALTER COLUMN "flat_rent_value" TYPE numeric `
    )
    await queryRunner.query(
      `ALTER TABLE "unit_group_ami_levels" ALTER COLUMN "percentage_of_income_value" TYPE numeric `
    )
    await queryRunner.query(`ALTER TABLE "unit_group" ALTER COLUMN "sq_feet_min" TYPE numeric `)
    await queryRunner.query(`ALTER TABLE "unit_group" ALTER COLUMN "sq_feet_max" TYPE numeric `)
    await queryRunner.query(`ALTER TABLE "unit_group" ALTER COLUMN "bathroom_min" TYPE numeric `)
    await queryRunner.query(`ALTER TABLE "unit_group" ALTER COLUMN "bathroom_max" TYPE numeric `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "unit_group" ALTER COLUMN "bathroom_max" TYPE integer `)
    await queryRunner.query(`ALTER TABLE "unit_group" ALTER COLUMN "bathroom_min" TYPE integer `)
    await queryRunner.query(`ALTER TABLE "unit_group" ALTER COLUMN "sq_feet_max" TYPE integer `)
    await queryRunner.query(`ALTER TABLE "unit_group" ALTER COLUMN "sq_feet_min" TYPE integer `)
    await queryRunner.query(
      `ALTER TABLE "unit_group_ami_levels" ALTER COLUMN "percentage_of_income_value" TYPE integer `
    )
    await queryRunner.query(
      `ALTER TABLE "unit_group_ami_levels" ALTER COLUMN "flat_rent_value" TYPE integer `
    )
  }
}
