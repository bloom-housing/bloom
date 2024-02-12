import { MigrationInterface, QueryRunner } from "typeorm"

export class changeApplicationsIncomeVouchers1706588813779 implements MigrationInterface {
  name = "changeApplicationsIncomeVouchers1706588813779"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "income_vouchers"`)
    await queryRunner.query(`ALTER TABLE "applications" ADD "income_vouchers" text array`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "income_vouchers"`)
    await queryRunner.query(`ALTER TABLE "applications" ADD "income_vouchers" boolean`)
  }
}
