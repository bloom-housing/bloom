import { MigrationInterface, QueryRunner } from "typeorm"

export class makeListingAssetsAJsonbColumn1612778538403 implements MigrationInterface {
  name = "makeListingAssetsAJsonbColumn1612778538403"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "listings" ADD "assets" jsonb NOT NULL default '[]'::jsonb`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "assets"`)
  }
}
