import { MigrationInterface, QueryRunner } from "typeorm"
import { CountyCode } from "../shared/types/county-code"

export class addSettingsJurisdictionToggle1654560903063 implements MigrationInterface {
  name = "addSettingsJurisdictionToggle1654560903063"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "jurisdictions" ADD "enable_partner_settings" boolean`)
    const jurisdictions: Array<{
      id: string
      name: string
      public_url: string
    }> = await queryRunner.query(`SELECT id, name from jurisdictions`)

    const setEnablePartnerSettings = async (enable: boolean, countyCode: CountyCode) => {
      const jurisdiction = jurisdictions.find((j) => j.name === countyCode)
      if (jurisdiction) {
        await queryRunner.query(
          `UPDATE jurisdictions SET enable_partner_settings = $1 WHERE id = $2`,
          [enable, jurisdiction.id]
        )
      }
    }

    setEnablePartnerSettings(true, CountyCode.alameda)
    setEnablePartnerSettings(true, CountyCode.san_jose)
    setEnablePartnerSettings(true, CountyCode.san_mateo)
    setEnablePartnerSettings(false, CountyCode.detroit)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "jurisdictions" DROP COLUMN "enable_partner_settings"`)
  }
}
