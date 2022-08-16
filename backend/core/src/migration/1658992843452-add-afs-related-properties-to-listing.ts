import { MigrationInterface, QueryRunner } from "typeorm"

export class addAfsRelatedPropertiesToListing1658992843452 implements MigrationInterface {
  name = "addAfsRelatedPropertiesToListing1658992843452"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "listings" ADD "afs_last_run_at" TIMESTAMP WITH TIME ZONE DEFAULT '1970-01-01'`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" ADD "last_application_update_at" TIMESTAMP WITH TIME ZONE DEFAULT '1970-01-01'`
    )
    await queryRunner.query(
      `ALTER TABLE "application_flagged_set" ADD "rule_key" character varying NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "application_flagged_set" ADD CONSTRAINT "UQ_2983d3205a16bfae28323d021ea" UNIQUE ("rule_key")`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "last_application_update_at"`)
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "afs_last_run_at"`)
    await queryRunner.query(
      `ALTER TABLE "application_flagged_set" DROP CONSTRAINT "UQ_2983d3205a16bfae28323d021ea"`
    )
    await queryRunner.query(`ALTER TABLE "application_flagged_set" DROP COLUMN "rule_key"`)
  }
}
