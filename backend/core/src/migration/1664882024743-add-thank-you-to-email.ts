import { MigrationInterface, QueryRunner } from "typeorm"
import { Language } from "../shared/types/language-enum"

export class addThankYouToEmail1664882024743 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const [{ id: alamedaJurisdiction }] = await queryRunner.query(
      `SELECT id FROM jurisdictions WHERE name = 'Alameda' LIMIT 1`
    )

    const [{ id: sanMateoJurisdiction }] = await queryRunner.query(
      `SELECT id FROM jurisdictions WHERE name = 'San Mateo' LIMIT 1`
    )

    let generalTranslation = await queryRunner.query(
      `SELECT translations FROM translations WHERE jurisdiction_id IS NULL AND language = ($1)`,
      [Language.en]
    )
    generalTranslation = generalTranslation["0"]["translations"]
    generalTranslation.footer.thankYou = "Thank you"

    let existingAlamedaTranslations = await queryRunner.query(
      `SELECT translations FROM translations WHERE jurisdiction_id = ($1)`,
      [alamedaJurisdiction]
    )
    existingAlamedaTranslations = existingAlamedaTranslations["0"]["translations"]
    existingAlamedaTranslations.footer.thankYou = "Thank you"

    let existingSanMateoTranslations = await queryRunner.query(
      `SELECT translations FROM translations WHERE jurisdiction_id = ($1)`,
      [sanMateoJurisdiction]
    )
    existingSanMateoTranslations = existingSanMateoTranslations["0"]["translations"]
    existingSanMateoTranslations.footer.thankYou = "Thank you"

    await queryRunner.query(
      `UPDATE "translations" SET translations = ($1) where jurisdiction_id IS NULL and language = ($2)`,
      [generalTranslation, Language.en]
    )
    await queryRunner.query(
      `UPDATE "translations" SET translations = ($1) where jurisdiction_id = ($2) and language = ($3)`,
      [existingAlamedaTranslations, alamedaJurisdiction, Language.en]
    )
    await queryRunner.query(
      `UPDATE "translations" SET translations = ($1) where jurisdiction_id = ($2) and language = ($3)`,
      [existingSanMateoTranslations, sanMateoJurisdiction, Language.en]
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
