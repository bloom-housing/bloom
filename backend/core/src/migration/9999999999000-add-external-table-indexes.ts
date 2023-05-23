import { MigrationInterface, QueryRunner } from "typeorm"

// REMOVE_WHEN_EXTERNAL_NOT_NEEDED
export class externalListingIndexes9999999999000 implements MigrationInterface {
  name = "externalListingIndexes9999999999000"

  public async up(queryRunner: QueryRunner): Promise<void> {
    // // For filtering by zip code
    // await queryRunner.query(
    //   `CREATE INDEX external_listings_zip_code ON external_listings USING hash ((building_address->>'zip_code'))`
    // )

    // // For filtering by jurisdiction id
    // await queryRunner.query(
    //   `CREATE INDEX external_listings_jurisdiction_id ON external_listings USING hash ((jurisdiction->>'id'))`
    // )

    // // For filtering by city
    // await queryRunner.query(
    //   `CREATE INDEX external_listings_city ON external_listings USING hash ((building_address->>'city'))`
    // )

    // // For filtering by county
    // await queryRunner.query(
    //   `CREATE INDEX external_listings_county ON external_listings USING hash ((building_address->>'county'))`
    // )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(`DROP INDEX "public"."external_listings_zip_code"`)
    // await queryRunner.query(`DROP INDEX "public"."external_listings_jurisdiction_id"`)
    // await queryRunner.query(`DROP INDEX "public"."external_listings_county"`)
    // await queryRunner.query(`DROP INDEX "public"."external_listings_city"`)
  }
}
