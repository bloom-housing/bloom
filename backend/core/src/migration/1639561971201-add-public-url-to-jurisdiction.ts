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
      if (alamedaJurisdiction) {
        alamedaJurisdiction.public_url = "https://ala.bloom.exygy.dev"
      }
      if (sanJoseJurisdiction) {
        sanJoseJurisdiction.public_url = "https://sj.bloom.exygy.dev"
      }
      if (sanMateoJurisdiction) {
        sanMateoJurisdiction.public_url = "https://smc.bloom.exygy.dev"
      }
    } else if (process.env.PARTNERS_PORTAL_URL === "https://partners.housingbayarea.org") {
      // production
      if (alamedaJurisdiction) {
        alamedaJurisdiction.public_url = "https://housing.acgov.org"
      }
      if (sanJoseJurisdiction) {
        sanJoseJurisdiction.public_url = "https://housing.sanjoseca.gov"
      }
      if (sanMateoJurisdiction) {
        sanMateoJurisdiction.public_url = "https://smc.housingbayarea.org"
      }
    } else if (process.env.PARTNERS_PORTAL_URL === "https://dev-partners-bloom.netlify.app"){
      // dev
      if (alamedaJurisdiction) {
        alamedaJurisdiction.public_url = "https://dev-bloom.netlify.app"
      }
      if (sanJoseJurisdiction) {
        sanJoseJurisdiction.public_url = "https://dev-bloom.netlify.app"
      }
      if (sanMateoJurisdiction) {
        sanMateoJurisdiction.public_url = "https://dev-bloom.netlify.app"
      }
      if (detroitJurisdiction) {
        detroitJurisdiction.public_url = "https://detroit-public-dev.netlify.app"
      }
    } else if (process.env.PARTNERS_PORTAL_URL === "http://localhost:3001"){
      // local
      if (alamedaJurisdiction) {
        alamedaJurisdiction.public_url = "http://localhost:3000"
      }
      if (sanJoseJurisdiction) {
        sanJoseJurisdiction.public_url = "http://localhost:3000"
      }
      if (sanMateoJurisdiction) {
        sanMateoJurisdiction.public_url = "http://localhost:3000"
      }
      if (detroitJurisdiction) {
        detroitJurisdiction.public_url = "http://localhost:3000"
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
