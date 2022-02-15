import { MigrationInterface, QueryRunner } from "typeorm"

export class addMfaRelatedColumnsToUserEntity1639051722043 implements MigrationInterface {
  name = "addMfaRelatedColumnsToUserEntity1639051722043"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_accounts" ADD "mfa_enabled" boolean NOT NULL`)
    await queryRunner.query(`ALTER TABLE "user_accounts" ADD "mfa_code" character varying`)
    await queryRunner.query(
      `ALTER TABLE "user_accounts" ADD "mfa_code_updated_at" TIMESTAMP WITH TIME ZONE`
    )
    const mfaCodeEmail = {
      message: "Access token for your account has been requested.",
      mfaCode: "Your access token is: %{mfaCode}",
    }
    const translations = await queryRunner.query(`SELECT * from translations`)
    for (const t of translations) {
      await queryRunner.query(`UPDATE translations SET translations = ($1) WHERE id = ($2)`, [
        { ...t.translations, mfaCodeEmail },
        t.id,
      ])
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_accounts" DROP COLUMN "mfa_code_updated_at"`)
    await queryRunner.query(`ALTER TABLE "user_accounts" DROP COLUMN "mfa_code"`)
    await queryRunner.query(`ALTER TABLE "user_accounts" DROP COLUMN "mfa_enabled"`)
  }
}
