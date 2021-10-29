import { MigrationInterface, QueryRunner } from "typeorm"

export class allowMultipleRaceCheckboxes1635535204972 implements MigrationInterface {
  name = "allowMultipleRaceCheckboxes1635535204972"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "demographics" DROP COLUMN "race"`)
    await queryRunner.query(`ALTER TABLE "demographics" ADD "race" text array`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "demographics" DROP COLUMN "race"`)
    await queryRunner.query(`ALTER TABLE "demographics" ADD "race" text`)
  }
}
