import { MigrationInterface, QueryRunner } from "typeorm"

export class listingOpportunity1699380281858 implements MigrationInterface {
  name = "listingOpportunity1699380281858"

  public async up(queryRunner: QueryRunner): Promise<void> {
    const translations = await queryRunner.query(`
            SELECT
                id,
                translations
            FROM translations
            WHERE language = 'en'
          `)
    translations.forEach(async (translation) => {
      let data = translation.translations
      data.rentalOpportunity = {
        subject: "New rental opportunity",
        intro: "Rental opportunity at",
        applicationsDue: "Applications Due",
        community: "Community",
        address: "Address",
        rent: "Rent",
        minIncome: "Minimum Income",
        maxIncome: "Maximum Income",
        lottery: "Lottery Date",
        viewButton: "View Listing & Apply",
        studio: "Studios",
        oneBdrm: "1 Bedrooms",
        twoBdrm: "2 Bedrooms",
        threeBdrm: "3 Bedrooms",
        fourBdrm: "4 Bedrooms",
        fiveBdrm: "5 Bedrooms",
        SRO: "SROs"
      }
      data = JSON.stringify(data)
      await queryRunner.query(`
            UPDATE translations
            SET translations = '${data.replace(/'/g, "''")}'
            WHERE id = '${translation.id}'
        `)
    })

    await queryRunner.query(
      `ALTER TABLE "jurisdictions" ADD "enable_listing_opportunity" boolean default FALSE`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
