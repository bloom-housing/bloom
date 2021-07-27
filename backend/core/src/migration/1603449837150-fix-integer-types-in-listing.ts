import { MigrationInterface, QueryRunner } from "typeorm"

export class fixIntegerTypesInListing1603449837150 implements MigrationInterface {
  name = "fixIntegerTypesInListing1603449837150"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "listings" ALTER COLUMN "building_total_units" TYPE integer`
    )
    await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "household_size_max" TYPE integer`)
    await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "household_size_min" TYPE integer`)
    await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "units_available" TYPE integer`)
    await queryRunner.query(
      `ALTER TABLE "listings" ALTER COLUMN "waitlist_current_size" TYPE integer`
    )
    await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "waitlist_max_size" TYPE integer`)
    await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "year_built" TYPE integer`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "year_built" TYPE numeric`)
    await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "waitlist_max_size" TYPE numeric`)
    await queryRunner.query(
      `ALTER TABLE "listings" ALTER COLUMN "waitlist_current_size" TYPE numeric`
    )
    await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "units_available" TYPE numeric`)
    await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "household_size_min" TYPE numeric`)
    await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "household_size_max" TYPE numeric`)
    await queryRunner.query(
      `ALTER TABLE "listings" ALTER COLUMN "building_total_units" TYPE numeric`
    )
  }
}
