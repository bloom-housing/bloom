import { MigrationInterface, QueryRunner } from "typeorm"
import { CountyCode } from "../shared/types/county-code"

export class addCustomEmailFrom1644365733034 implements MigrationInterface {
  name = "addCustomEmailFrom1644365733034"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "jurisdictions" ADD "email_from_address" text`)
    const jurisdictions: Array<{
      id: string
      name: string
      public_url: string
    }> = await queryRunner.query(`SELECT id, name, public_url from jurisdictions`)

    const setEmailFromAddress = async (emailFromAddress: string, countyCode: CountyCode) => {
      const jurisdiction = jurisdictions.find((j) => j.name === countyCode)
      if (jurisdiction) {
        await queryRunner.query(`UPDATE jurisdictions SET email_from_address = $1 WHERE id = $2`, [
          emailFromAddress,
          jurisdiction.id,
        ])
      }
    }

    setEmailFromAddress("Alameda: Housing Bay Area <bloom-no-reply@exygy.dev>", CountyCode.alameda)
    setEmailFromAddress("SJ: HousingBayArea.org <bloom-no-reply@exygy.dev>", CountyCode.san_jose)
    setEmailFromAddress("SMC: HousingBayArea.org <bloom-no-reply@exygy.dev>", CountyCode.san_mateo)
    setEmailFromAddress("Detroit Housing <bloom-no-reply@exygy.dev>", CountyCode.detroit)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "jurisdictions" DROP COLUMN "email_from_address"`)
  }
}
