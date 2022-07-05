import { MigrationInterface, QueryRunner } from "typeorm"
import { Language } from "../shared/types/language-enum"
export class updateInviteEmailText1655122535654 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const [{ language, translations }] = await queryRunner.query(
      `SELECT language, translations from translations WHERE language = 'en' LIMIT 1`
    )

    translations["invite"] = {
        hello: "Welcome to the Partners Portal",
        confirmMyAccount: "Confirm my account",
        inviteManageListings: "You will now be able to manage listings and applications that you are a part of from one centralized location.",
        inviteWelcomeMessage: "Welcome to the Partners Portal at %{appUrl}.",
        toCompleteAccountCreation: "To complete your account creation, please click the link below:"
    }

    await queryRunner.query(`UPDATE "translations" SET translations = ($1) where jurisdiction_id is NULL and language = ($2)`, [translations, Language.en])
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
