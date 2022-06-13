import { MigrationInterface, QueryRunner } from "typeorm"

export class updateInviteEmailText1655122535654 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const [{ language, translations }] = await queryRunner.query(
      `SELECT language, translations from translations WHERE language = 'en' LIMIT 1`
    )

    translations["invite"] = {
        hello: "Welcome to the Partners Portal",
        confirmMyAccount: "Confirm my account",
        inviteManageListings: "You will now be able to manage listings and applications that you are a part of from one centralized location test.",
        inviteWelcomeMessage: "Welcome to the Partners Portal on %{appUrl}.",
        toCompleteAccountCreation: "To complete your account creation, please click the link below:"
    }

    await queryRunner.query(`INSERT INTO translations (language, translations) VALUES ($1, $2)`, [
      language,
      translations,
    ])
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
