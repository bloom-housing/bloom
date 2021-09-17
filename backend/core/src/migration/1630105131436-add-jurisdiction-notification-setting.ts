import { MigrationInterface, QueryRunner } from "typeorm"
import { CountyCode } from "../shared/types/county-code"

export class addJurisdictionNotificationSetting1630105131436 implements MigrationInterface {
  name = "addJurisdictionNotificationSetting1630105131436"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "jurisdictions" ADD "notifications_sign_up_url" text`)

    await queryRunner.query(
      `UPDATE "jurisdictions" SET notifications_sign_up_url = 'https://public.govdelivery.com/accounts/CAALAME/signup/29386' WHERE name = ($1)`,
      [CountyCode.alameda]
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "jurisdictions" DROP COLUMN "notifications_sign_up_url"`)
  }
}
