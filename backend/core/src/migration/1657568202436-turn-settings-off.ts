import { MigrationInterface, QueryRunner } from "typeorm"
import { CountyCode } from "../shared/types/county-code"

export class turnSettingsOff1657568202436 implements MigrationInterface {
  name = "turnSettingsOff1657568202436"

  public async up(queryRunner: QueryRunner): Promise<void> {
    const jurisdictions: Array<{
      id: string
      name: string
      public_url: string
    }> = await queryRunner.query(`SELECT id, name from jurisdictions`)

    const disableSettings = async (countyCode: CountyCode) => {
      const jurisdiction = jurisdictions.find((j) => j.name === countyCode)
      if (jurisdiction) {
        await queryRunner.query(
          `UPDATE jurisdictions SET enable_partner_settings = $1 WHERE id = $2`,
          [false, jurisdiction.id]
        )
      }
    }

    disableSettings(CountyCode.alameda)
    disableSettings(CountyCode.san_jose)
    disableSettings(CountyCode.san_mateo)
    disableSettings(CountyCode.detroit)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
