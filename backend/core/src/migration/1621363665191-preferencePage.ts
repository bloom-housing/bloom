import { MigrationInterface, QueryRunner } from "typeorm"

export class preferencePage1621363665191 implements MigrationInterface {
  name = "preferencePage1621363665191"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "preferences" ADD "page" integer NOT NULL DEFAULT 1`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "preferences" DROP COLUMN "page"`)
  }
}
