import { MigrationInterface, QueryRunner } from "typeorm"

export class updateApplicantEmail1606488094709 implements MigrationInterface {
  name = "updateApplicantEmail1606488094709"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "applicant" ALTER COLUMN "email_address" DROP NOT NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "applicant" ALTER COLUMN "email_address" SET NOT NULL`)
  }
}
