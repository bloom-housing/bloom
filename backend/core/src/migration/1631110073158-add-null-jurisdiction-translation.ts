import { MigrationInterface, QueryRunner } from "typeorm"

export class addNullJurisdictionTranslation1631110073158 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const [{ language, translations }] = await queryRunner.query(
      `SELECT language, translations from translations WHERE language = 'en' LIMIT 1`
    )

    translations["invite"] = {
      inviteMessage:
        "Thank you for setting up your account on %{appUrl}. It will now be easier for you to start, save, and submit online applications for listings that appear on the site.",
      toCompleteAccountCreation: "To complete your account creation, please the link below:",
      confirmMyAccount: "Confirm my account",
    }

    await queryRunner.query(`INSERT INTO translations (language, translations) VALUES ($1, $2)`, [
      language,
      translations,
    ])
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
