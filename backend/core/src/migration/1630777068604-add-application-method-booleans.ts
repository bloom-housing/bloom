import { MigrationInterface, QueryRunner } from "typeorm"

export class addApplicationMethodBooleans1630777068604 implements MigrationInterface {
  name = "addApplicationMethodBooleans1630777068604"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "listings" ADD "digital_application" boolean NOT NULL DEFAULT false`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" ADD "common_digital_application" boolean NOT NULL DEFAULT true`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" ADD "paper_application" boolean NOT NULL DEFAULT false`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" ADD "referral_opportunity" boolean NOT NULL DEFAULT false`
    )

    // set new booleans according a listings application methods
    // cannot operate with enum value Referral, since it's added in same transaction
    const applicationMethods = await queryRunner.query(
      `SELECT type, listing_id FROM application_methods WHERE type IN ('Internal', 'ExternalLink', 'FileDownload')`
    )

    for (const method of applicationMethods) {
      let field: string
      let value: boolean

      switch (method.type) {
        case "FileDownload":
          field = "paper_application"
          value = true
          break
        case "Internal":
          field = "digital_application"
          value = true
          break
        case "ExternalLink":
          field = "common_digital_application"
          value = false
          // also set digital application to true
          await queryRunner.query(
            `UPDATE listings SET digital_application = true WHERE id = '${method.listing_id}'`
          )
          break
        /* case "Referral":
                    field = "referral_opportunity"
                    value = true
                    break */
        default:
      }

      if (field && value !== undefined) {
        await queryRunner.query(
          `UPDATE listings SET ${field} = ${value} WHERE id = '${method.listing_id}'`
        )
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "referral_opportunity"`)
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "paper_application"`)
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "common_digital_application"`)
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "digital_application"`)
  }
}
