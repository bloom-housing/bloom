import { MigrationInterface, QueryRunner } from "typeorm"

export class addMissingListingFields1619558199145 implements MigrationInterface {
  name = "addMissingListingFields1619558199145"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listings" ADD "special_notes" text`)
    await queryRunner.query(`ALTER TABLE "property" ADD "services_offered" text`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "services_offered"`)
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "special_notes"`)
  }
}
