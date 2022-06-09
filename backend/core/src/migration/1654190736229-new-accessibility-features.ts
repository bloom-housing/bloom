import { MigrationInterface, QueryRunner } from "typeorm"

export class newAccessibilityFeatures1654190736229 implements MigrationInterface {
  name = "newAccessibilityFeatures1654190736229"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "listing_features" ADD "barrier_free_unit_entrance" boolean`
    )
    await queryRunner.query(`ALTER TABLE "listing_features" ADD "lowered_light_switch" boolean`)
    await queryRunner.query(`ALTER TABLE "listing_features" ADD "barrier_free_bathroom" boolean`)
    await queryRunner.query(`ALTER TABLE "listing_features" ADD "wide_doorways" boolean`)
    await queryRunner.query(`ALTER TABLE "listing_features" ADD "lowered_cabinets" boolean`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listing_features" DROP COLUMN "lowered_cabinets"`)
    await queryRunner.query(`ALTER TABLE "listing_features" DROP COLUMN "wide_doorways"`)
    await queryRunner.query(`ALTER TABLE "listing_features" DROP COLUMN "barrier_free_bathroom"`)
    await queryRunner.query(`ALTER TABLE "listing_features" DROP COLUMN "lowered_light_switch"`)
    await queryRunner.query(
      `ALTER TABLE "listing_features" DROP COLUMN "barrier_free_unit_entrance"`
    )
  }
}
