import { MigrationInterface, QueryRunner } from "typeorm"

export class addAfsRelatedMigrations1617096743504 implements MigrationInterface {
  name = "addAfsRelatedMigrations1617096743504"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "application_flagged_set" DROP CONSTRAINT "FK_f2ace84eebd770f1387b47e5e45"`
    )
    await queryRunner.query(
      `ALTER TABLE "application_flagged_set" ALTER COLUMN "listing_id" SET NOT NULL`
    )
    await queryRunner.query(`COMMENT ON COLUMN "application_flagged_set"."listing_id" IS NULL`)
    await queryRunner.query(
      `ALTER TABLE "application_flagged_set" ADD CONSTRAINT "FK_f2ace84eebd770f1387b47e5e45" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "application_flagged_set" DROP CONSTRAINT "FK_f2ace84eebd770f1387b47e5e45"`
    )
    await queryRunner.query(`COMMENT ON COLUMN "application_flagged_set"."listing_id" IS NULL`)
    await queryRunner.query(
      `ALTER TABLE "application_flagged_set" ALTER COLUMN "listing_id" DROP NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "application_flagged_set" ADD CONSTRAINT "FK_f2ace84eebd770f1387b47e5e45" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }
}
