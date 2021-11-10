import { MigrationInterface, QueryRunner } from "typeorm"

export class addLanguageToJurisdiction1634213955270 implements MigrationInterface {
  name = "addLanguageToJurisdiction1634213955270"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "jurisdictions_languages_enum" AS ENUM('en', 'es', 'vi', 'zh')`
    )
    await queryRunner.query(
      `ALTER TABLE "jurisdictions" ADD "languages" "jurisdictions_languages_enum" array NOT NULL DEFAULT '{en}'`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "jurisdictions" DROP COLUMN "languages"`)
    await queryRunner.query(`DROP TYPE "jurisdictions_languages_enum"`)
  }
}
