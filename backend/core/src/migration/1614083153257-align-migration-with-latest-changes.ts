import { MigrationInterface, QueryRunner } from "typeorm"

export class alignMigrationWithLatestChanges1614083153257 implements MigrationInterface {
  name = "alignMigrationWithLatestChanges1614083153257"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON COLUMN "applications"."preferences" IS NULL`)
    await queryRunner.query(`ALTER TABLE "applications" ALTER COLUMN "preferences" DROP DEFAULT`)
    await queryRunner.query(`COMMENT ON COLUMN "listings"."application_methods" IS NULL`)
    await queryRunner.query(
      `ALTER TABLE "listings" ALTER COLUMN "application_methods" DROP DEFAULT`
    )
    await queryRunner.query(`COMMENT ON COLUMN "listings"."assets" IS NULL`)
    await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "assets" DROP DEFAULT`)
    await queryRunner.query(`COMMENT ON COLUMN "listings"."events" IS NULL`)
    await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "events" DROP DEFAULT`)
    await queryRunner.query(`COMMENT ON COLUMN "ami_chart"."items" IS NULL`)
    await queryRunner.query(`ALTER TABLE "ami_chart" ALTER COLUMN "items" DROP DEFAULT`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ami_chart" ALTER COLUMN "items" SET DEFAULT '[]'`)
    await queryRunner.query(`COMMENT ON COLUMN "ami_chart"."items" IS NULL`)
    await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "events" SET DEFAULT '[]'`)
    await queryRunner.query(`COMMENT ON COLUMN "listings"."events" IS NULL`)
    await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "assets" SET DEFAULT '[]'`)
    await queryRunner.query(`COMMENT ON COLUMN "listings"."assets" IS NULL`)
    await queryRunner.query(
      `ALTER TABLE "listings" ALTER COLUMN "application_methods" SET DEFAULT '[]'`
    )
    await queryRunner.query(`COMMENT ON COLUMN "listings"."application_methods" IS NULL`)
    await queryRunner.query(
      `ALTER TABLE "applications" ALTER COLUMN "preferences" SET DEFAULT '[]'`
    )
    await queryRunner.query(`COMMENT ON COLUMN "applications"."preferences" IS NULL`)
  }
}
