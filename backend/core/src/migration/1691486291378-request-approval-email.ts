import { MigrationInterface, QueryRunner } from "typeorm"

export class requestApprovalEmail1691486291378 implements MigrationInterface {
  name = "requestApprovalEmail1691486291378"

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
        doorwayTitle: "Doorway Housing Portal",
      }

      data.requestApproval = {
        subject: "Listing approval requested",
        partnerRequest:
          "A Partner has submitted an approval request to publish the %{listingName} listing.",
        loginToReview:
          "Please log in to the <a href=%{partnersUrl}>Partner Portal</a> and navigate to the listing detail page to review and publish.",
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
