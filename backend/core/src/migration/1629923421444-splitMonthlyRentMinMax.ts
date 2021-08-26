import { MigrationInterface, QueryRunner } from "typeorm"

export class splitMonthlyRentMinMax1629923421444 implements MigrationInterface {
  name = "splitMonthlyRentMinMax1629923421444"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "units_summary" DROP COLUMN "monthly_rent"`)
    await queryRunner.query(`ALTER TABLE "units_summary" ADD "monthly_rent_min" integer`)
    await queryRunner.query(`ALTER TABLE "units_summary" ADD "monthly_rent_max" integer`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "units_summary" DROP COLUMN "monthly_rent_max"`)
    await queryRunner.query(`ALTER TABLE "units_summary" DROP COLUMN "monthly_rent_min"`)
    await queryRunner.query(`ALTER TABLE "units_summary" ADD "monthly_rent" integer`)
  }
}
