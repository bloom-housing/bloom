import { MigrationInterface, QueryRunner } from "typeorm"

export class addNullJurisdictionTranslation1631110073158 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const [{ language, translations }] = await queryRunner.query(
      `SELECT language, translations from translations WHERE language = 'en' LIMIT 1`
    )

    translations["invitePartner"] = {
      hello: "Welcome to the Partners Portal",
      inviteMessage:
        "Welcome to the Partners Portal on %{appUrl}. You will now be able to manage listings and applications that you are a part of from one centralized location.",
      toCompleteAccountCreation: "To complete your account creation, please click the link below:",
      confirmMyAccount: "Confirm my account",
    }

    await queryRunner.query(`INSERT INTO translations (language, translations) VALUES ($1, $2)`, [
      language,
      translations,
    ])
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
