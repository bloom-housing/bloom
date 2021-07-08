import { MigrationInterface, QueryRunner } from "typeorm"

export class makeListingEventsAJsonbColumn1612779568745 implements MigrationInterface {
  name = "makeListingEventsAJsonbColumn1612779568745"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "listings" ADD "events" jsonb NOT NULL default '[]'::jsonb`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "events"`)
  }
}
