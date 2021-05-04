import { MigrationInterface, QueryRunner } from "typeorm"

export class addUserConfirmationFields1616427736224 implements MigrationInterface {
  name = "addUserConfirmationFields1616427736224"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_accounts" ADD "confirmation_token" character varying`
    )
    await queryRunner.query(
      `ALTER TABLE "user_accounts" ADD "confirmed_at" TIMESTAMP WITH TIME ZONE`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_accounts" DROP COLUMN "confirmed_at"`)
    await queryRunner.query(`ALTER TABLE "user_accounts" DROP COLUMN "confirmation_token"`)
  }
}
