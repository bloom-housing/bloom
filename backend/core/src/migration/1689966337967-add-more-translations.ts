import { MigrationInterface, QueryRunner } from "typeorm"

export class addMoreTranslations1689966337967 implements MigrationInterface {
  name = "addMoreTranslations1689966337967"

  public async up(queryRunner: QueryRunner): Promise<void> {
    const translations: { id: string; translations: any }[] = await queryRunner.query(`
        SELECT
            id,
            translations
        FROM translations
        WHERE language = 'en'
    `)

    translations.forEach(async (translation) => {
      let data = translation.translations
      data.footer = {
        line1:
          "Doorway Housing Portal is a program of the Bay Area Housing Finance Authority (BAHFA)",
        line2: "",
        thankYou: "Thank you",
        footer: "Bay Area Housing Finance Authority (BAHFA)",
      }
      data.header = {
        ...data.header,
        logoUrl: "https://housingbayarea.mtc.ca.gov/images/doorway-logo.png",
      }
      data.t = { hello: "Hello" }
      data.forgotPassword = {
        subject: "Forgot your password?",
        callToAction:
          "If you did make this request, please click on the link below to reset your password:",
        passwordInfo:
          "Your password won't change until you access the link above and create a new one.",
        resetRequest:
          "A request to reset your Bloom Housing Portal website password for %{appUrl} has recently been made.",
        ignoreRequest: "If you didn't request this, please ignore this email.",
        changePassword: "Change my password",
      }
      data = JSON.stringify(data)
      await queryRunner.query(`
            UPDATE translations
            SET translations = '${data.replace(/'/g, "''")}'
            WHERE id = '${translation.id}'
        `)
    })
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
