import { MigrationInterface, QueryRunner } from "typeorm"

export class addForgetPasswordFields1610577576914 implements MigrationInterface {
  name = "addForgetPasswordFields1610577576914"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_accounts" ADD "reset_token" character varying`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_accounts" DROP COLUMN "reset_token"`)
  }
}
