import { MigrationInterface, QueryRunner } from "typeorm"

export class addingReviewStatus1661788864862 implements MigrationInterface {
  name = "addingReviewStatus1661788864862"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "applications" ADD "review_status" character varying NOT NULL DEFAULT 'resolved'`
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "review_status"`)
  }
}
