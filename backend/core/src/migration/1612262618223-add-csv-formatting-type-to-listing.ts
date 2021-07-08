import { MigrationInterface, QueryRunner } from "typeorm"

export class addCsvFormattingTypeToListing1612262618223 implements MigrationInterface {
  name = "addCsvFormattingTypeToListing1612262618223"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "listings" ADD "csv_formatting_type" character varying NOT NULL DEFAULT 'basic'`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "csv_formatting_type"`)
  }
}
