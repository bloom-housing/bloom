import { MigrationInterface, QueryRunner } from "typeorm"

export class addFeatureCollection1705637577495 implements MigrationInterface {
  name = "addFeatureCollection1705637577495"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "map_layers" ADD "feature_collection" jsonb NOT NULL default '{}'::jsonb`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "map_layers" DROP COLUMN "feature_collection"`)
  }
}
