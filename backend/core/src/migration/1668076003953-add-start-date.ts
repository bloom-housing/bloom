import { MigrationInterface, QueryRunner } from "typeorm"

export class addStartDate1668076003953 implements MigrationInterface {
  name = "addStartDate1668076003953"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "listing_events" ADD "start_date" TIMESTAMP WITH TIME ZONE`
    )
    await queryRunner.query(`UPDATE "listing_events" SET "start_date" = "start_time"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listing_events" DROP COLUMN "start_date"`)
  }
}
