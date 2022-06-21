import { MigrationInterface, QueryRunner } from "typeorm"

export class addingSection81654884722218 implements MigrationInterface {
  name = "addingSection81654884722218"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listings" ADD "section8_acceptance" boolean`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "section8_acceptance"`)
  }
}
