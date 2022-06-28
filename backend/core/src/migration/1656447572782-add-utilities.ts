import { MigrationInterface, QueryRunner } from "typeorm"

export class addUtilities1656447572782 implements MigrationInterface {
  name = "addUtilities1656447572782"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "listing_utilities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "water" boolean, "gas" boolean, "trash" boolean, "sewer" boolean, "electricity" boolean, "cable" boolean, "phone" boolean, "internet" boolean, CONSTRAINT "PK_8e88f883b389f7b31d331de764f" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "jurisdictions" ADD "enable_utilities_included" boolean NOT NULL DEFAULT FALSE`
    )
    await queryRunner.query(`ALTER TABLE "listings" ADD "utilities_id" uuid`)
    await queryRunner.query(
      `ALTER TABLE "listings" ADD CONSTRAINT "UQ_61b80a947c9db249548ba3c73a5" UNIQUE ("utilities_id")`
    )
    await queryRunner.query(
      `ALTER TABLE "jurisdictions" ALTER COLUMN "enable_accessibility_features" DROP DEFAULT`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" ADD CONSTRAINT "FK_61b80a947c9db249548ba3c73a5" FOREIGN KEY ("utilities_id") REFERENCES "listing_utilities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "listings" DROP CONSTRAINT "FK_61b80a947c9db249548ba3c73a5"`
    )
    await queryRunner.query(
      `ALTER TABLE "jurisdictions" ALTER COLUMN "enable_accessibility_features" SET DEFAULT false`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" DROP CONSTRAINT "UQ_61b80a947c9db249548ba3c73a5"`
    )
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "utilities_id"`)
    await queryRunner.query(`ALTER TABLE "jurisdictions" DROP COLUMN "enable_utilities_included"`)
    await queryRunner.query(`DROP TABLE "listing_utilities"`)
  }
}
