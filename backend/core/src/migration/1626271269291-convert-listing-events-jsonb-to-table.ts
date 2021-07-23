import { MigrationInterface, QueryRunner } from "typeorm"
import { ListingEvent } from "../listings/entities/listing-event.entity"

export class convertListingEventsJsonbToTable1626271269291 implements MigrationInterface {
  name = "convertListingEventsJsonbToTable1626271269291"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "listing_events" DROP CONSTRAINT "FK_d0b9892bc613e4d9f8b5c25d03e"`
    )
    await queryRunner.query(`ALTER TABLE "listing_events" ADD "label" text`)
    await queryRunner.query(
      `ALTER TYPE "listing_events_type_enum" RENAME TO "listing_events_type_enum_old"`
    )
    await queryRunner.query(
      `CREATE TYPE "listing_events_type_enum" AS ENUM('openHouse', 'publicLottery', 'lotteryResults')`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_events" ALTER COLUMN "type" TYPE "listing_events_type_enum" USING "type"::"text"::"listing_events_type_enum"`
    )
    await queryRunner.query(`DROP TYPE "listing_events_type_enum_old"`)
    await queryRunner.query(`ALTER TABLE "listing_events" DROP COLUMN "start_time"`)
    await queryRunner.query(
      `ALTER TABLE "listing_events" ADD "start_time" TIMESTAMP WITH TIME ZONE`
    )
    await queryRunner.query(`ALTER TABLE "listing_events" DROP COLUMN "end_time"`)
    await queryRunner.query(`ALTER TABLE "listing_events" ADD "end_time" TIMESTAMP WITH TIME ZONE`)
    await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "name" SET NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "listing_events" ADD CONSTRAINT "FK_d0b9892bc613e4d9f8b5c25d03e" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )

    const listings = await queryRunner.query(`SELECT id, events FROM listings`)
    for (const listing of listings) {
      if (listing.events && listing.events.length) {
        const events = listing.events as Array<ListingEvent>
        for (const event of events) {
          await queryRunner.query(
            `INSERT INTO "listing_events" (type, url, note, listing_id, label, start_time, end_time) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              event.type,
              event.url,
              event.note,
              listing.id,
              event.label,
              event.startTime,
              event.endTime,
            ]
          )
        }
      }
    }

    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "events"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "listing_events" DROP CONSTRAINT "FK_d0b9892bc613e4d9f8b5c25d03e"`
    )
    await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "name" DROP NOT NULL`)
    await queryRunner.query(`ALTER TABLE "listing_events" DROP COLUMN "end_time"`)
    await queryRunner.query(`ALTER TABLE "listing_events" ADD "end_time" TIMESTAMP NOT NULL`)
    await queryRunner.query(`ALTER TABLE "listing_events" DROP COLUMN "start_time"`)
    await queryRunner.query(`ALTER TABLE "listing_events" ADD "start_time" TIMESTAMP NOT NULL`)
    await queryRunner.query(
      `CREATE TYPE "listing_events_type_enum_old" AS ENUM('openHouse', 'publicLottery')`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_events" ALTER COLUMN "type" TYPE "listing_events_type_enum_old" USING "type"::"text"::"listing_events_type_enum_old"`
    )
    await queryRunner.query(`DROP TYPE "listing_events_type_enum"`)
    await queryRunner.query(
      `ALTER TYPE "listing_events_type_enum_old" RENAME TO "listing_events_type_enum"`
    )
    await queryRunner.query(`ALTER TABLE "listing_events" DROP COLUMN "label"`)
    await queryRunner.query(`ALTER TABLE "listings" ADD "events" jsonb NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "listing_events" ADD CONSTRAINT "FK_d0b9892bc613e4d9f8b5c25d03e" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
  }
}
