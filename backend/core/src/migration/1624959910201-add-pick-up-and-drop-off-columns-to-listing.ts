import { MigrationInterface, QueryRunner } from "typeorm"

export class addPickUpAndDropOffColumnsToListing1624959910201 implements MigrationInterface {
  name = "addPickUpAndDropOffColumnsToListing1624959910201"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "listings_application_pick_up_address_type_enum" AS ENUM('leasingAgent', 'mailingAddress')`);
    await queryRunner.query(`ALTER TABLE "listings" ADD "application_pick_up_address_type" "listings_application_pick_up_address_type_enum"`);

    await queryRunner.query(`CREATE TYPE "listings_application_drop_off_address_type_enum" AS ENUM('leasingAgent', 'mailingAddress')`);
    await queryRunner.query(`ALTER TABLE "listings" ADD "application_drop_off_address_type" "listings_application_drop_off_address_type_enum"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "application_drop_off_address_type"`);
    await queryRunner.query(`DROP TYPE "listings_application_drop_off_address_type_enum"`);
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "application_pick_up_address_type"`);
    await queryRunner.query(`DROP TYPE "listings_application_pick_up_address_type_enum"`);
  }
}
