import { MigrationInterface, QueryRunner } from "typeorm"

export class addListingMarketing1648548425458 implements MigrationInterface {
  name = "addListingMarketing1648548425458"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "listings_marketing_type_enum" AS ENUM('marketing', 'comingSoon')`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" ADD "marketing_type" "listings_marketing_type_enum" NOT NULL DEFAULT 'marketing'`
    )
    await queryRunner.query(`ALTER TABLE "listings" ADD "marketing_date" TIMESTAMP WITH TIME ZONE`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "marketing_date"`)
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "marketing_type"`)
    await queryRunner.query(`DROP TYPE "listings_marketing_type_enum"`)
  }
}
