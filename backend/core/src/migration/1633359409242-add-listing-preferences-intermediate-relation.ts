import { MigrationInterface, QueryRunner } from "typeorm"

export class addListingPreferencesIntermediateRelation1633359409242 implements MigrationInterface {
  name = "addListingPreferencesIntermediateRelation1633359409242"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "listing_preferences" ("ordinal" integer, "page" integer, "listing_id" uuid NOT NULL, "preference_id" uuid NOT NULL, CONSTRAINT "PK_3a99e1cc861df8e2b81ab885839" PRIMARY KEY ("listing_id", "preference_id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_preferences" ADD CONSTRAINT "FK_b7fad48d744befbd6532d8a04a0" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_preferences" ADD CONSTRAINT "FK_797708bfa7897f574b8eb73cdcb" FOREIGN KEY ("preference_id") REFERENCES "preferences"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )

    const uniquePreferences: [
      { id: string; title: string; ordinal: number }
    ] = await queryRunner.query(`SELECT DISTINCT id, title, ordinal, page FROM preferences`)

    const uniquePreferencesMap = uniquePreferences.reduce((acc, val) => {
      acc[val.title] = val
      return acc
    }, {})

    const listings: [{ listing_id: string; preference_title: string }] = await queryRunner.query(
      `SELECT listings.id as listing_id, preferences.title as preference_title FROM listings INNER JOIN preferences preferences ON preferences.listing_id = listings.id`
    )
    for (const listing of listings) {
      const uniquePreference = uniquePreferencesMap[listing.preference_title]
      await queryRunner.query(
        `INSERT INTO listing_preferences (listing_id, preference_id, ordinal, page) VALUES ($1, $2, $3, $4)`,
        [listing.listing_id, uniquePreference.id, uniquePreference.ordinal, uniquePreference.page]
      )
    }

    await queryRunner.query(`DELETE FROM preferences where NOT (id = ANY($1::uuid[]))`, [
      uniquePreferences.map((pref) => pref.id),
    ])
    await queryRunner.query(`ALTER TABLE "preferences" DROP COLUMN "ordinal"`)
    await queryRunner.query(`ALTER TABLE "preferences" DROP COLUMN "page"`)
    await queryRunner.query(
      `ALTER TABLE "preferences" DROP CONSTRAINT "FK_91017f2182ec7b0dcd4abe68b5a"`
    )
    await queryRunner.query(`ALTER TABLE "preferences" DROP COLUMN "listing_id"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "preferences" ADD "listing_id" uuid`)
    await queryRunner.query(
      `ALTER TABLE "preferences" ADD CONSTRAINT "FK_91017f2182ec7b0dcd4abe68b5a" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(`ALTER TABLE "preferences" ADD "ordinal" integer`)
    await queryRunner.query(`ALTER TABLE "preferences" ADD "page" integer`)
    await queryRunner.query(
      `ALTER TABLE "listing_preferences" DROP CONSTRAINT "FK_797708bfa7897f574b8eb73cdcb"`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_preferences" DROP CONSTRAINT "FK_b7fad48d744befbd6532d8a04a0"`
    )
    await queryRunner.query(`DROP TABLE "listing_preferences"`)
  }
}
