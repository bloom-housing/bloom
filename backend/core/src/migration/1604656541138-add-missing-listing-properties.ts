import { MigrationInterface, QueryRunner } from "typeorm"

export class addMissingListingProperties1604656541138 implements MigrationInterface {
  name = "addMissingListingProperties1604656541138"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listings" ADD "application_pick_up_address" jsonb`)
    await queryRunner.query(
      `ALTER TABLE "listings" ADD "application_pick_up_address_office_hours" text`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "listings" DROP COLUMN "application_pick_up_address_office_hours"`
    )
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "application_pick_up_address"`)
  }
}
