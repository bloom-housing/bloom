import { MigrationInterface, QueryRunner } from "typeorm"

export class addAdminFlag1600106987673 implements MigrationInterface {
  name = "addAdminFlag1600106987673"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_accounts" ADD "is_admin" boolean NOT NULL DEFAULT false`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_accounts" DROP COLUMN "is_admin"`)
  }
}
