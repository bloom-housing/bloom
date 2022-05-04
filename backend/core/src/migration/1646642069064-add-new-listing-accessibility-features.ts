import { MigrationInterface, QueryRunner } from "typeorm"

export class addNewListingAccessibilityFeatures1646642069064 implements MigrationInterface {
  name = "addNewListingAccessibilityFeatures1646642069064"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listing_features" ADD "hearing" boolean`)
    await queryRunner.query(`ALTER TABLE "listing_features" ADD "visual" boolean`)
    await queryRunner.query(`ALTER TABLE "listing_features" ADD "mobility" boolean`)
    await queryRunner.query(`ALTER TABLE "listings" ADD "temporary_listing_id" integer`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "temporary_listing_id"`)
    await queryRunner.query(`ALTER TABLE "listing_features" DROP COLUMN "mobility"`)
    await queryRunner.query(`ALTER TABLE "listing_features" DROP COLUMN "visual"`)
    await queryRunner.query(`ALTER TABLE "listing_features" DROP COLUMN "hearing"`)
  }
}
