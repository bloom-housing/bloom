import { MigrationInterface, QueryRunner } from "typeorm"

export class addCustomMapPinField1627511769797 implements MigrationInterface {
  name = "addCustomMapPinField1627511769797"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listings" ADD "custom_map_pin" boolean`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "custom_map_pin"`)
  }
}
