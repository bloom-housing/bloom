import { MigrationInterface, QueryRunner } from "typeorm"

export class flagForFeatures1655309692011 implements MigrationInterface {
  name = "flagForFeatures1655309692011"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "jurisdictions" ADD "enable_accessibility_features" boolean NOT NULL DEFAULT FALSE`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "jurisdictions" DROP COLUMN "enable_accessibility_features"`
    )
  }
}
