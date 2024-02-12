import { MigrationInterface, QueryRunner } from "typeorm"

export class addSpokenLanguageToDemographics1707263888401 implements MigrationInterface {
  name = "addSpokenLanguageToDemographics1707263888401"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "demographics" ADD "spoken_language" text`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "demographics" DROP COLUMN "spoken_language"`)
  }
}
