import { MigrationInterface, QueryRunner } from "typeorm"

export class translationCleanUp1682009156841 implements MigrationInterface {
  name = "translationCleanUp1682009156841"

  public async up(queryRunner: QueryRunner): Promise<void> {
    const translations = await queryRunner.query(`
            SELECT
                id,
                translations
            FROM translations
            WHERE language = 'en'
        `)

    for (let i = 0; i < translations.length; i++) {
      const translation = translations[i]
      let data = translation.translations
      data.mfaCodeEmail = {
        message: "Access code for your account has been requested.",
        mfaCode: "Your access code is: %{mfaCode}",
      }
      data = JSON.stringify(data)
      await queryRunner.query(`
            UPDATE translations
            SET translations = '${data}'
            WHERE id = '${translation.id}'
        `)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
