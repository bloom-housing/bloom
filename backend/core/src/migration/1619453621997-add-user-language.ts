import { MigrationInterface, QueryRunner } from "typeorm"

export class addUserLanguage1619453621997 implements MigrationInterface {
  name = "addUserLanguage1619453621997"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_accounts" ADD "language" character varying`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_accounts" DROP COLUMN "language"`)
  }
}
