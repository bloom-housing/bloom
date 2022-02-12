import { MigrationInterface, QueryRunner } from "typeorm"

export class addUserPasswordOutdatingFields1638356116695 implements MigrationInterface {
  name = "addUserPasswordOutdatingFields1638356116695"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_accounts" ADD "password_updated_at" TIMESTAMP NOT NULL DEFAULT NOW()`
    )
    await queryRunner.query(
      `ALTER TABLE "user_accounts" ADD "password_valid_for_days" integer NOT NULL DEFAULT '180'`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_accounts" DROP COLUMN "password_valid_for_days"`)
    await queryRunner.query(`ALTER TABLE "user_accounts" DROP COLUMN "password_updated_at"`)
  }
}
