import { MigrationInterface, QueryRunner } from "typeorm"

export class fixYesNoAnswersDbColumnType1611163327131 implements MigrationInterface {
  name = "fixYesNoAnswersDbColumnType1611163327131"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "household_member" DROP COLUMN "same_address"`)
    await queryRunner.query(`ALTER TABLE "household_member" ADD "same_address" text`)
    await queryRunner.query(`ALTER TABLE "household_member" DROP COLUMN "work_in_region"`)
    await queryRunner.query(`ALTER TABLE "household_member" ADD "work_in_region" text`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "household_member" DROP COLUMN "work_in_region"`)
    await queryRunner.query(`ALTER TABLE "household_member" ADD "work_in_region" boolean`)
    await queryRunner.query(`ALTER TABLE "household_member" DROP COLUMN "same_address"`)
    await queryRunner.query(`ALTER TABLE "household_member" ADD "same_address" boolean`)
  }
}
