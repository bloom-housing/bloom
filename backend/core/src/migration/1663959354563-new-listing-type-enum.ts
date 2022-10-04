import { MigrationInterface, QueryRunner } from "typeorm"

export class newListingTypeEnum1663959354563 implements MigrationInterface {
  name = "newListingTypeEnum1663959354563"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."listings_review_order_type_enum" RENAME TO "listings_review_order_type_enum_old"`
    )
    await queryRunner.query(
      `CREATE TYPE "public"."listings_review_order_type_enum" AS ENUM('lottery', 'firstComeFirstServe', 'waitlist')`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" ALTER COLUMN "review_order_type" TYPE "public"."listings_review_order_type_enum" USING "review_order_type"::"text"::"public"."listings_review_order_type_enum"`
    )
    await queryRunner.query(`DROP TYPE "public"."listings_review_order_type_enum_old"`)

    const listings = await queryRunner.query(`SELECT id, listing_availability FROM listings`)

    for (const l of listings) {
      if (l.listing_availability === "openWaitlist") {
        await queryRunner.query(`UPDATE listings SET review_order_type = ($1) WHERE id = ($2)`, [
          "waitlist",
          l.id,
        ])
      }
    }
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "listing_availability"`)
    await queryRunner.query(`DROP TYPE "public"."listings_listing_availability_enum"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "listings" ADD "listing_availability" "public"."listings_listing_availability_enum"`
    )
    await queryRunner.query(
      `CREATE TYPE "public"."listings_listing_availability_enum" AS ENUM('availableUnits', 'openWaitlist')`
    )
    const listings = await queryRunner.query(`SELECT id, review_order_type FROM listings`)

    for (const l of listings) {
      if (l.review_order_type === "waitlist") {
        await queryRunner.query(`UPDATE listings SET listing_availability = ($1) WHERE id = ($2)`, [
          "openWaitlist",
          l.id,
        ])
      }
    }

    await queryRunner.query(
      `CREATE TYPE "public"."listings_review_order_type_enum_old" AS ENUM('lottery', 'firstComeFirstServe')`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" ALTER COLUMN "review_order_type" TYPE "public"."listings_review_order_type_enum_old" USING "review_order_type"::"text"::"public"."listings_review_order_type_enum_old"`
    )
    await queryRunner.query(`DROP TYPE "public"."listings_review_order_type_enum"`)
    await queryRunner.query(
      `ALTER TYPE "public"."listings_review_order_type_enum_old" RENAME TO "listings_review_order_type_enum"`
    )
  }
}
