import { MigrationInterface, QueryRunner } from "typeorm"

export class addListingSubmissionDate1608200172832 implements MigrationInterface {
  name = "addListingSubmissionDate1608200172832"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "applications" ADD "submission_date" TIMESTAMP WITH TIME ZONE`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "submission_date"`)
  }
}
