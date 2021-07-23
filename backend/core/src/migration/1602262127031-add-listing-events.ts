import { MigrationInterface, QueryRunner } from "typeorm"

export class addListingEvents1602262127031 implements MigrationInterface {
  name = "addListingEvents1602262127031"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "listing_events_type_enum" AS ENUM('openHouse', 'publicLottery')`
    )
    await queryRunner.query(
      `CREATE TABLE "listing_events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "type" "listing_events_type_enum" NOT NULL, "start_time" TIMESTAMP NOT NULL, "end_time" TIMESTAMP NOT NULL, "url" text, "note" text, "listing_id" uuid, CONSTRAINT "PK_a9a209828028e14e2caf8def25c" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_events" ADD CONSTRAINT "FK_d0b9892bc613e4d9f8b5c25d03e" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "listing_events" DROP CONSTRAINT "FK_d0b9892bc613e4d9f8b5c25d03e"`
    )
    await queryRunner.query(`DROP TABLE "listing_events"`)
    await queryRunner.query(`DROP TYPE "listing_events_type_enum"`)
  }
}
