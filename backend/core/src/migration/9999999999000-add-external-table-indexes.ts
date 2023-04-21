import { MigrationInterface, QueryRunner } from "typeorm"

// REMOVE_WHEN_EXTERNAL_NOT_NEEDED
export class externalListingIndexes9999999999000 implements MigrationInterface {
  name = "externalListingIndexes9999999999000"

  public async up(queryRunner: QueryRunner): Promise<void> {

    // For filtering by num_bedrooms
    await queryRunner.query(
      `CREATE INDEX external_listings_num_bedrooms ON external_listings USING btree ((units->>'num_bedrooms'))`
    )

    // For filtering by zip code
    await queryRunner.query(
      `CREATE INDEX external_listings_zip_code ON external_listings USING hash ((building_address->>'zip_code'))`
    )

    // For filtering by jurisdiction id
    await queryRunner.query(
      `CREATE INDEX external_listings_jurisdiction_id ON external_listings USING hash ((jurisdiction->>'id'))`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."external_listings_num_bedrooms"`)
    await queryRunner.query(`DROP INDEX "public"."external_listings_zip_code"`)
    await queryRunner.query(`DROP INDEX "public"."external_listings_jurisdiction_id"`)
  }
}
