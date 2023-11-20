import { MigrationInterface, QueryRunner } from "typeorm"

export class enableGeocodingFlag1699916046696 implements MigrationInterface {
  name = "enableGeocodingFlag1699916046696"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "jurisdictions" ADD "enable_geocoding_preferences" boolean NOT NULL DEFAULT false`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "jurisdictions" DROP COLUMN "enable_geocoding_preferences"`
    )
  }
}
