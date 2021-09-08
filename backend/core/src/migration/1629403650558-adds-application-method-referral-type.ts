import { MigrationInterface, QueryRunner } from "typeorm"

export class addsApplicationMethodReferralType1629403650558 implements MigrationInterface {
  name = "addsApplicationMethodReferralType1629403650558"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TYPE "application_methods_type_enum" ADD VALUE 'Referral'`)

    const languageMap = {
      English: "en",
      Spanish: "es",
      Vietnamese: "vi",
      Chinese: "zh",
    }

    /**
     * moves applicable application methods to paper applications
     * I checked the live DB and the data was reliably consistent
     */
    const paperApplications = await queryRunner.query(
      `SELECT id, type, label, external_reference, listing_id FROM application_methods WHERE type = 'FileDownload'`
    )

    // create application index by listing_id
    const appIndex = paperApplications.reduce((obj, app) => {
      const paperApp = {
        language: languageMap[app.label],
        file_id: app.external_reference,
      }
      if (obj[app.listing_id] === undefined) {
        obj[app.listing_id] = [paperApp]
      } else {
        obj[app.listing_id].push(paperApp)
      }
      return obj
    }, {})

    // loop over the index, remove the application methods, add a new one and add corresponding paper applications
    for (const app in appIndex) {
      await queryRunner.query(`DELETE FROM application_methods WHERE listing_id = '${app}'`)
      // insert one application method per group
      const newMethod = await queryRunner.query(
        `INSERT INTO application_methods (type, label, listing_id) VALUES ('FileDownload', 'Paper Application', '${app}') RETURNING id`
      )
      console.log("newMethod = ", newMethod)
      // insert paper applications
      for (const paper of appIndex[app]) {
        await queryRunner.query(
          `INSERT INTO paper_applications (language, file_id, application_method_id) VALUES ('${paper.language}', '${paper.file_id}', '${newMethod}')`
        )
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // there is no equivalent statement to delete an enum value
    // see: https://stackoverflow.com/a/25812436
  }
}
