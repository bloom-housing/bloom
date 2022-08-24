import { MigrationInterface, QueryRunner } from "typeorm"

export class migrationCleanUp1661291342324 implements MigrationInterface {
  name = "migrationCleanUp1661291342324"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE jurisdictions SET enable_partner_settings = false WHERE enable_partner_settings IS null;`
    )
    await queryRunner.query(
      `ALTER TABLE "jurisdictions" ALTER COLUMN "enable_partner_settings" SET NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "jurisdictions" ALTER COLUMN "enable_partner_settings" SET DEFAULT false`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "jurisdictions" ALTER COLUMN "enable_partner_settings" DROP DEFAULT`
    )
    await queryRunner.query(
      `ALTER TABLE "jurisdictions" ALTER COLUMN "enable_partner_settings" DROP NOT NULL`
    )
  }
}
