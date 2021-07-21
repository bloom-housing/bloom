import { MigrationInterface, QueryRunner } from "typeorm"

export class addFormMetadataToPreference1611265543779 implements MigrationInterface {
  name = "addFormMetadataToPreference1611265543779"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "preferences" ADD "form_metadata" jsonb`)
    await queryRunner.query(`ALTER TABLE "application_preference" ALTER COLUMN "data" SET NOT NULL`)
    await queryRunner.query(`COMMENT ON COLUMN "application_preference"."data" IS NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON COLUMN "application_preference"."data" IS NULL`)
    await queryRunner.query(
      `ALTER TABLE "application_preference" ALTER COLUMN "data" DROP NOT NULL`
    )
    await queryRunner.query(`ALTER TABLE "preferences" DROP COLUMN "form_metadata"`)
  }
}
