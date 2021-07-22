import { MigrationInterface, QueryRunner } from "typeorm"

export class updatePropertyBuildingAddress1606386989965 implements MigrationInterface {
  name = "updatePropertyBuildingAddress1606386989965"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "property" RENAME COLUMN "building_address" TO "building_address_id"`
    )
    await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "building_address_id"`)
    await queryRunner.query(`ALTER TABLE "property" ADD "building_address_id" uuid`)
    await queryRunner.query(
      `ALTER TABLE "property" ADD CONSTRAINT "UQ_f0f7062f34738e0b338163786fd" UNIQUE ("building_address_id")`
    )
    await queryRunner.query(
      `ALTER TABLE "property" ADD CONSTRAINT "FK_f0f7062f34738e0b338163786fd" FOREIGN KEY ("building_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "property" DROP CONSTRAINT "FK_f0f7062f34738e0b338163786fd"`
    )
    await queryRunner.query(
      `ALTER TABLE "property" DROP CONSTRAINT "UQ_f0f7062f34738e0b338163786fd"`
    )
    await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "building_address_id"`)
    await queryRunner.query(`ALTER TABLE "property" ADD "building_address_id" jsonb`)
    await queryRunner.query(
      `ALTER TABLE "property" RENAME COLUMN "building_address_id" TO "building_address"`
    )
  }
}
