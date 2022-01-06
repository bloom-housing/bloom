import { MigrationInterface, QueryRunner } from "typeorm"

export class addUserLoginMetadataToUserEntity1637924287461 implements MigrationInterface {
  name = "addUserLoginMetadataToUserEntity1637924287461"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_accounts" ADD "last_login_at" TIMESTAMP NOT NULL DEFAULT NOW()`
    )
    await queryRunner.query(
      `ALTER TABLE "user_accounts" ADD "failed_login_attempts_count" integer NOT NULL DEFAULT '0'`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_accounts" DROP COLUMN "failed_login_attempts_count"`)
    await queryRunner.query(`ALTER TABLE "user_accounts" DROP COLUMN "last_login_at"`)
  }
}
