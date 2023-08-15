import { MigrationInterface, QueryRunner } from "typeorm"

export class listingsApprovalEmails1692122923259 implements MigrationInterface {
  name = "listingsApprovalEmails1692122923259"

  public async up(queryRunner: QueryRunner): Promise<void> {
    const translations: { id: string; translations: any }[] = await queryRunner.query(`
        SELECT
            id,
            translations
        FROM translations
        WHERE language = 'en'
    `)
    translations.forEach(async (translation) => {
      let data = translation.translations
      data.t = {
        ...data.t,
        hello: "Hello",
        partnersPortal: "Partners Portal",
      }

      data.footer = {
        ...data.footer,
        thankYou: "Thank you",
      }

      data.requestApproval = {
        subject: "Listing Approval Requested",
        header: "Listing approval requested",
        partnerRequest:
          "A Partner has submitted an approval request to publish the %{listingName} listing.",
        loginToReviewStart: "Please log in to the",
        loginToReviewEnd: "and navigate to the listing detail page to review and publish.",
        accessListing: "To access the listing after logging in, please click the link below",
        reviewListing: "Review Listing",
      }
      data = JSON.stringify(data)
      await queryRunner.query(`
            UPDATE translations
            SET translations = '${data.replace(/'/g, "''")}'
            WHERE id = '${translation.id}'
        `)
    })
  }
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
