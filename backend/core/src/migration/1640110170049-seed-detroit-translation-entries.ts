import { MigrationInterface, QueryRunner } from "typeorm"
import { Language } from "../shared/types/language-enum"

export class seedDetroitTranslationEntries1640110170049 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const defaultTranslation = {
      t: {
        hello: "Hello",
        dhcProjectLabel: "Detroit Home Connect is a project of the",
        hrdLabel: "Housing & Revitalization Department of the City of Detroit",
        unsubscribeMsg: "Unsubscribe from list",
      },
      newListing: {
        title: "Rental opportunity at",
        applicationDue: "Application Due",
        addressLabel: "Address",
        unitsLabel: "Units",
        rentLabel: "Rent",
        seeListingLabel: "See Listing And Apply",
      },
      updateListing: {
        title: "Reminder to update your listing",
        verifyMsg: "Verify the following information is correct.",
        listingLabel: "Listing",
        addressLabel: "Address",
        unitsLabel: "Units",
        rentLabel: "Rent",
        seeListingLabel: "See Listing",
      },
    }

    const [{ id: detroit_jurisdiction_id }] = await queryRunner.query(
      `SELECT id FROM jurisdictions where name='Detroit'`
    )
    await queryRunner.query(
      `INSERT into "translations" (jurisdiction_id, language, translations) VALUES ($1, $2, $3)`,
      [detroit_jurisdiction_id, Language.en, defaultTranslation]
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
