import { MigrationInterface, QueryRunner } from "typeorm"
import { Language } from "../shared/types/language-enum"

export class seedDetroitTranslationEntries1640110170049 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const listingEmail = {
      newListing: {
        title: "Rental opportunity at",
        applicationDue: "Application Due",
        addressLabel: "Address",
        unitsLabel: "Units",
        rentLabel: "Rent",
        seeListingLabel: "See Listing And Apply",
        dhcProjectLabel: "Detroit Home Connect is a project of the",
        hrdLabel: "Housing & Revitalization Department of the City of Detroit",
        unsubscribeMsg: "Unsubscribe from list",
      },
      updateListing: {
        title: "Reminder to update your listing",
        verifyMsg: "Verify the following information is correct.",
        listingLabel: "Listing",
        addressLabel: "Address",
        unitsLabel: "Units",
        rentLabel: "Rent",
        seeListingLabel: "See Listing",
        dhcProjectLabel: "Detroit Home Connect is a project of the",
        hrdLabel: "Housing & Revitalization Department of the City of Detroit",
        unsubscribeMsg: "Unsubscribe from list",
      },
    }
    const translations = await queryRunner.query(`SELECT * from translations`)
    for (const t of translations) {
      await queryRunner.query(
        `UPDATE "translations" (jurisdiction_id, language, translations) VALUES ($1, $2, $3)`,
        [{ ...t.translations, listingEmail }, t.id]
      )
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
