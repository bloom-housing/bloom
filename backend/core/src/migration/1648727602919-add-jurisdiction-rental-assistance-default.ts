import { MigrationInterface, QueryRunner } from "typeorm"

export class addJurisdictionRentalAssistanceDefault1648727602919 implements MigrationInterface {
  name = "addJurisdictionRentalAssistanceDefault1648727602919"

  public async up(queryRunner: QueryRunner): Promise<void> {
    const sjCopy =
      "Housing Choice Vouchers, Section 8 and other valid rental assistance programs will be considered for this property. In the case of a valid rental subsidy, the required minimum income will be based on the portion of the rent that the tenant pays after use of the subsidy."
    const smcCopy =
      "Housing Choice Vouchers, Section 8, and other valid rental assistance programs will be considered for this property. In the case of a valid rental subsidy, the required minimum income will be based on the portion of the rent that the tenant pays after the use of the subsidy."
    const alamedaCopy =
      "Housing Choice Vouchers, Section 8, and other valid rental assistance programs will be considered for this property. In the case of a valid rental subsidy, the required minimum income will be based on the portion of the rent that the tenant pays after the use of the subsidy."
    const defaultCopy = alamedaCopy

    const rentalAssistanceCopyMap = {
      Alameda: alamedaCopy,
      "San Jose": sjCopy,
      "San Mateo": smcCopy,
    }

    await queryRunner.query('ALTER TABLE "jurisdictions" ADD "rental_assistance_default" text')
    await queryRunner.query(
      `ALTER TABLE "jurisdictions" ALTER COLUMN "rental_assistance_default" SET DEFAULT '${defaultCopy}'`
    )
    await queryRunner.query(
      `UPDATE "jurisdictions" SET "rental_assistance_default" = '${defaultCopy}'`
    )
    await queryRunner.query(
      'ALTER TABLE "jurisdictions" ALTER COLUMN "rental_assistance_default" SET NOT NULL'
    )

    for (const countyName of ["Alameda", "San Jose", "San Mateo"]) {
      await queryRunner.query(
        `UPDATE jurisdictions SET rental_assistance_default = $1 WHERE name = $2`,
        [rentalAssistanceCopyMap[countyName], countyName]
      )
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "jurisdictions" DROP COLUMN "rental_assistance_default"`)
  }
}
