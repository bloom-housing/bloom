import { MigrationInterface, QueryRunner } from "typeorm"

export class makeReviewOrderNotComputed1629225078065 implements MigrationInterface {
  name = "makeReviewOrderNotComputed1629225078065"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "listings_review_order_type_enum" AS ENUM('lottery', 'firstComeFirstServe')`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" ADD "review_order_type" "listings_review_order_type_enum"`
    )

    const listingsIDsWithoutReviewOrderType = await queryRunner.query(
      "SELECT id FROM listings WHERE review_order_type IS NULL"
    )

    for (const listing of listingsIDsWithoutReviewOrderType) {
      const listingEventTypes = await queryRunner.query(
        `SELECT type FROM listing_events WHERE listing_id = '${listing.id}'`
      )
      if (listingEventTypes.some((eventType) => eventType.type === "publicLottery")) {
        await queryRunner.query(
          `UPDATE listings SET review_order_type = 'lottery' where id = '${listing.id}'`
        )
      } else {
        await queryRunner.query(
          `UPDATE listings SET review_order_type = 'firstComeFirstServe' where id = '${listing.id}'`
        )
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "review_order_type"`)
    await queryRunner.query(`DROP TYPE "listings_review_order_type_enum"`)
  }
}
