import { MigrationInterface, QueryRunner } from "typeorm"

export class listingsApprovalPermissioning1694130645798 implements MigrationInterface {
  name = "listingsApprovalPermissioning1694130645798"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."jurisdictions_listing_approval_permissions_enum" AS ENUM('user', 'partner', 'admin', 'jurisdictionAdmin')`
    )
    await queryRunner.query(
      `ALTER TABLE "jurisdictions" ADD "listing_approval_permissions" "public"."jurisdictions_listing_approval_permissions_enum" array`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "jurisdictions" DROP COLUMN "listing_approval_permissions"`
    )
    await queryRunner.query(`DROP TYPE "public"."jurisdictions_listing_approval_permissions_enum"`)
  }
}
