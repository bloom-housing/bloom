import { MigrationInterface, QueryRunner } from "typeorm"

export class addListingAvailabilityField1652833763955 implements MigrationInterface {
  name = "addListingAvailabilityField1652833763955"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "units" DROP COLUMN "status"`)
    await queryRunner.query(`DROP TYPE "public"."units_status_enum"`)
    await queryRunner.query(
      `CREATE TYPE "listings_listing_availability_enum" AS ENUM('availableUnits', 'openWaitlist')`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" ADD "listing_availability" "listings_listing_availability_enum"`
    )
    await queryRunner.query(
      `ALTER TABLE "jurisdictions" ALTER COLUMN "rental_assistance_default" DROP DEFAULT`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "jurisdictions" ALTER COLUMN "rental_assistance_default" SET DEFAULT 'Housing Choice Vouchers, Section 8, and other valid rental assistance programs will be considered for this property. In the case of a valid rental subsidy, the required minimum income will be based on the portion of the rent that the tenant pays after the use of the subsidy.'`
    )
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "listing_availability"`)
    await queryRunner.query(`DROP TYPE "listings_listing_availability_enum"`)
    await queryRunner.query(
      `CREATE TYPE "public"."units_status_enum" AS ENUM('unknown', 'available', 'occupied', 'unavailable')`
    )
    await queryRunner.query(
      `ALTER TABLE "units" ADD "status" "units_status_enum" NOT NULL DEFAULT 'unknown'`
    )
  }
}
