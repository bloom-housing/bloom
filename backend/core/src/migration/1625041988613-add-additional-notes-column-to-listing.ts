import { MigrationInterface, QueryRunner } from "typeorm"

export class addAdditionalNotesColumnToListing1625041988613 implements MigrationInterface {
  name = "addAdditionalNotesColumnToListing1625041988613"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "listings" ADD "additional_application_submission_notes" text`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "listings" DROP COLUMN "additional_application_submission_notes"`
    )
  }
}
