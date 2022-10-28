import { MigrationInterface, QueryRunner } from "typeorm"

export class addAppFlagNotificationBoolean1661810986580 implements MigrationInterface {
  name = "addAppFlagNotificationBoolean1661810986580"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "application_flagged_set" ADD "show_confirmation_alert" boolean NOT NULL DEFAULT false`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "application_flagged_set" DROP COLUMN "show_confirmation_alert"`
    )
  }
}
