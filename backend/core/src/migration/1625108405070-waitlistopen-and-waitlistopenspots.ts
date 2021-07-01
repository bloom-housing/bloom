import { MigrationInterface, QueryRunner } from "typeorm"

export class waitlistopenAndWaitlistopenspots1625108405070 implements MigrationInterface {
  name = "waitlistopenAndWaitlistopenspots1625108405070"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listings" ADD "is_waitlist_open" boolean`)
    await queryRunner.query(`ALTER TABLE "listings" ADD "waitlist_open_spots" integer`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "waitlist_open_spots"`)
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "is_waitlist_open"`)
  }
}
