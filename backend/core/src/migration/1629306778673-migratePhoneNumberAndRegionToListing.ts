import { MigrationInterface, QueryRunner } from "typeorm"

export class migratePhoneNumberAndRegionToListing1629306778673 implements MigrationInterface {
  name = "migratePhoneNumberAndRegionToListing1629306778673"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "region"`)
    await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "phone_number"`)
    await queryRunner.query(`ALTER TABLE "listings" ADD "phone_number" text`)
    await queryRunner.query(`ALTER TABLE "listings" ADD "region" text`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "region"`)
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "phone_number"`)
    await queryRunner.query(`ALTER TABLE "property" ADD "phone_number" text`)
    await queryRunner.query(`ALTER TABLE "property" ADD "region" text`)
  }
}
