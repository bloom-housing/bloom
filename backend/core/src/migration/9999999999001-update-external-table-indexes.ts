import { MigrationInterface, QueryRunner } from "typeorm"

// REMOVE_WHEN_EXTERNAL_NOT_NEEDED
export class externalListingIndexes9999999999001 implements MigrationInterface {
  name = "externalListingIndexes9999999999001"
  indexedFields = [
    'min_monthly_rent',
    'max_monthly_rent',
    'min_bedrooms',
    'max_bedrooms',
    'min_bathrooms',
    'max_bathrooms',
    'min_monthly_income_min',
    'max_monthly_income_min',
    'min_occupancy',
    'max_occupancy',
    'min_sq_feet',
    'max_sq_feet',
    'lowest_floor',
    'highest_floor',
  ]

  public async up(queryRunner: QueryRunner): Promise<void> {

    // Not needed anymore
    await queryRunner.query(`DROP INDEX "public"."external_listings_num_bedrooms"`)

    // For filtering by city
    await queryRunner.query(
      `CREATE INDEX external_listings_city ON external_listings USING hash ((building_address->>'city'))`
    )

    // For filtering by county
    await queryRunner.query(
      `CREATE INDEX external_listings_county ON external_listings USING hash ((building_address->>'county'))`
    )

    this.indexedFields.forEach(async (field) => {
      await queryRunner.query(
        `CREATE INDEX external_listings_${field} ON external_listings USING hash (${field})`
      )
    })
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    this.indexedFields.forEach(async (field) => {
      await queryRunner.query(`DROP INDEX "public"."external_listings_${field}"`)
    })

    await queryRunner.query(`DROP INDEX "public"."external_listings_county"`)
    await queryRunner.query(`DROP INDEX "public"."external_listings_city"`)

    // Not needed anymore, but including for completeness
    await queryRunner.query(
      `CREATE INDEX external_listings_num_bedrooms ON external_listings USING btree ((units->>'num_bedrooms'))`
    )
  }
}
