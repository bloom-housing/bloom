import { MigrationInterface, QueryRunner } from "typeorm"
import { Language } from "../shared/types/language-enum"
export class addDefaultEmailTranslations1655299904609 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const [{ language, translations }] = await queryRunner.query(
      `SELECT language, translations from translations WHERE language = 'en' LIMIT 1`
    )

    translations["header"] = {
      logoUrl:
        "https://res.cloudinary.com/exygy/image/upload/v1652459319/housingbayarea/163838489-d5a1bc08-7d69-4c4a-8a94-8485617d8b46_dkkqvw.png",
      logoTitle: "Alameda County Housing Portal",
    }

    translations["footer"] = {
      line1:
        "Alameda County Housing Portal is a project of the Alameda County - Housing and Community Development (HCD) Department",
      line2: "",
    }

    await queryRunner.query(
      `UPDATE "translations" SET translations = ($1) where jurisdiction_id is NULL and language = ($2)`,
      [translations, Language.en]
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
