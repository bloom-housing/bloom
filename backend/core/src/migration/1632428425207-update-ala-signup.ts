import { MigrationInterface, QueryRunner } from "typeorm"
import { CountyCode } from "../shared/types/county-code"

export class updateAlaSignup1632428425207 implements MigrationInterface {
  name = "updateAlaSignup1632428425207"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "jurisdictions" SET notifications_sign_up_url = 'https://public.govdelivery.com/accounts/CAALAME/signup/29652' WHERE name = ($1)`,
      [CountyCode.alameda]
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "jurisdictions" SET notifications_sign_up_url = 'https://public.govdelivery.com/accounts/CAALAME/signup/29386' WHERE name = ($1)`,
      [CountyCode.alameda]
    )
  }
}
