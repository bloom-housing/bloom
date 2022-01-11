import { MigrationInterface, QueryRunner } from "typeorm"

export class addMailingAddressType1641860318345 implements MigrationInterface {
  name = "addMailingAddressType1641860318345"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "listings_application_mailing_address_type_enum" AS ENUM('leasingAgent')`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" ADD "application_mailing_address_type" "listings_application_mailing_address_type_enum"`
    )
    await queryRunner.query(
      `ALTER TYPE "listings_application_pick_up_address_type_enum" RENAME TO "listings_application_pick_up_address_type_enum_old"`
    )
    await queryRunner.query(
      `CREATE TYPE "listings_application_pick_up_address_type_enum" AS ENUM('leasingAgent')`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" ALTER COLUMN "application_pick_up_address_type" TYPE "listings_application_pick_up_address_type_enum" USING "application_pick_up_address_type"::"text"::"listings_application_pick_up_address_type_enum"`
    )
    await queryRunner.query(`DROP TYPE "listings_application_pick_up_address_type_enum_old"`)
    await queryRunner.query(
      `ALTER TYPE "listings_application_drop_off_address_type_enum" RENAME TO "listings_application_drop_off_address_type_enum_old"`
    )
    await queryRunner.query(
      `CREATE TYPE "listings_application_drop_off_address_type_enum" AS ENUM('leasingAgent')`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" ALTER COLUMN "application_drop_off_address_type" TYPE "listings_application_drop_off_address_type_enum" USING "application_drop_off_address_type"::"text"::"listings_application_drop_off_address_type_enum"`
    )
    await queryRunner.query(`DROP TYPE "listings_application_drop_off_address_type_enum_old"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "listings_application_drop_off_address_type_enum_old" AS ENUM('leasingAgent', 'mailingAddress')`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" ALTER COLUMN "application_drop_off_address_type" TYPE "listings_application_drop_off_address_type_enum_old" USING "application_drop_off_address_type"::"text"::"listings_application_drop_off_address_type_enum_old"`
    )
    await queryRunner.query(`DROP TYPE "listings_application_drop_off_address_type_enum"`)
    await queryRunner.query(
      `ALTER TYPE "listings_application_drop_off_address_type_enum_old" RENAME TO "listings_application_drop_off_address_type_enum"`
    )
    await queryRunner.query(
      `CREATE TYPE "listings_application_pick_up_address_type_enum_old" AS ENUM('leasingAgent', 'mailingAddress')`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" ALTER COLUMN "application_pick_up_address_type" TYPE "listings_application_pick_up_address_type_enum_old" USING "application_pick_up_address_type"::"text"::"listings_application_pick_up_address_type_enum_old"`
    )
    await queryRunner.query(`DROP TYPE "listings_application_pick_up_address_type_enum"`)
    await queryRunner.query(
      `ALTER TYPE "listings_application_pick_up_address_type_enum_old" RENAME TO "listings_application_pick_up_address_type_enum"`
    )
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "application_mailing_address_type"`)
    await queryRunner.query(`DROP TYPE "listings_application_mailing_address_type_enum"`)
  }
}
