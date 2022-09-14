import { MigrationInterface, QueryRunner } from "typeorm"

export class addingReviewStatus1661788864862 implements MigrationInterface {
  name = "addingReviewStatus1661788864862"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "applications" ADD "review_status" character varying NOT NULL DEFAULT 'valid'`
    )
    await queryRunner.query(`
        UPDATE applications 
        SET review_status = 'flagged' 
        WHERE id IN (
            SELECT
                apps.applications_id
            FROM application_flagged_set_applications_applications apps
                JOIN application_flagged_set afs ON afs.id = apps.application_flagged_set_id
            WHERE afs.status = 'flagged'
        )
    `)

    await queryRunner.query(
      `ALTER TABLE "application_flagged_set" ALTER COLUMN "status" SET DEFAULT 'pending'`
    )
    await queryRunner.query(`
        UPDATE application_flagged_set
        SET status = 'pending'
        WHERE status = 'flagged'
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "review_status"`)
    await queryRunner.query(
      `ALTER TABLE "application_flagged_set" ALTER COLUMN "status" SET DEFAULT 'flagged'`
    )
  }
}
