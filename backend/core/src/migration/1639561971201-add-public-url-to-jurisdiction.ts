import { MigrationInterface, QueryRunner } from "typeorm"
import { CountyCode } from "../shared/types/county-code"

export class addPublicUrlToJurisdiction1639561971201 implements MigrationInterface {
  name = "addPublicUrlToJurisdiction1639561971201"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "jurisdictions" ADD "public_url" text NOT NULL DEFAULT ''`)
    const jurisdictions: Array<{
      id: string
      name: string
      public_url: string
    }> = await queryRunner.query(`SELECT id, name, public_url from jurisdictions`)

    const alamedaJurisdiction = jurisdictions.find((j) => j.name === CountyCode.alameda)
    const sanJoseJurisdiction = jurisdictions.find((j) => j.name === CountyCode.san_jose)
    const sanMateoJurisdiction = jurisdictions.find((j) => j.name === CountyCode.san_mateo)
    const detroitJurisdiction = jurisdictions.find((j) => j.name === CountyCode.detroit)

    if (process.env.PARTNERS_PORTAL_URL === "https://partners.housingbayarea.bloom.exygy.dev") {
      // staging
      alamedaJurisdiction.public_url = "https://ala.bloom.exygy.dev"
      sanJoseJurisdiction.public_url = "https://sj.bloom.exygy.dev"
      sanMateoJurisdiction.public_url = "https://smc.bloom.exygy.dev"
    } else if (process.env.PARTNERS_PORTAL_URL === "https://partners.housingbayarea.org") {
      // production
      alamedaJurisdiction.public_url = "https://housing.acgov.org"
      sanJoseJurisdiction.public_url = "https://housing.sanjoseca.gov"
      sanMateoJurisdiction.public_url = "https://smc.housingbayarea.org"
    } else {
      // local and dev
      alamedaJurisdiction.public_url = "https://dev-bloom.netlify.app"
      sanJoseJurisdiction.public_url = "https://dev-bloom.netlify.app"
      sanMateoJurisdiction.public_url = "https://dev-bloom.netlify.app"
      if (detroitJurisdiction) {
        detroitJurisdiction.public_url = "https://detroit-public-dev.netlify.app"
      }
    }

    for (const jurisdiction of [
      alamedaJurisdiction,
      sanJoseJurisdiction,
      sanMateoJurisdiction,
      detroitJurisdiction,
    ]) {
      if (jurisdiction) {
        await queryRunner.query(`UPDATE jurisdictions SET public_url = $1 WHERE id = $2`, [
          jurisdiction.public_url,
          jurisdiction.id,
        ])
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "jurisdictions" DROP COLUMN "public_url"`)
  }
}
