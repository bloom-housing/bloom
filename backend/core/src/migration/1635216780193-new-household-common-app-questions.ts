import { MigrationInterface, QueryRunner } from "typeorm"

export class newHouseholdCommonAppQuestions1635216780193 implements MigrationInterface {
  name = "newHouseholdCommonAppQuestions1635216780193"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "applications" ADD "household_expecting_changes" boolean`)
    await queryRunner.query(`ALTER TABLE "applications" ADD "household_student" boolean`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "household_student"`)
    await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "household_expecting_changes"`)
  }
}
