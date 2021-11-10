import { MigrationInterface, QueryRunner } from "typeorm"
import { Language } from "../shared/types/language-enum"

export class addJurisdictionalEmailSignatures1635546032998 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const sanJoseTranslation = {
      footer: {
        footer: "City of San José, Housing Department",
      },
    }
    const [{ id: sanJoseJurisdiction }] = await queryRunner.query(
      `SELECT id FROM jurisdictions WHERE name = 'San Jose' LIMIT 1`
    )

    const alamedaTranslation = {
      footer: {
        footer: "Alameda County - Housing and Community Development (HCD) Department",
      },
    }
    const [{ id: alamedaJurisdiction }] = await queryRunner.query(
      `SELECT id FROM jurisdictions WHERE name = 'Alameda' LIMIT 1`
    )

    const sanMateoTranslation = {
      footer: {
        footer: "San Mateo County - Department of Housing",
      },
    }
    const [{ id: sanMateoJurisdiction }] = await queryRunner.query(
      `SELECT id FROM jurisdictions WHERE name = 'San Mateo' LIMIT 1`
    )

    const existingAlamedaTranslations = await queryRunner.query(
      `SELECT translations FROM translations WHERE jurisdiction_id = ($1)`,
      [alamedaJurisdiction]
    )

    const existingGeneralTranslations = await queryRunner.query(
      `SELECT translations FROM translations WHERE jurisdiction_id is NULL`
    )
    const genericTranslation = {
      ...existingAlamedaTranslations["0"]["translations"],
      ...existingGeneralTranslations["0"]["translations"],
      footer: {
        footer: "",
        thankYou: "Thanks!",
      },
    }

    await queryRunner.query(
      `UPDATE "translations" SET translations = ($1) where jurisdiction_id = ($2) and language = ($3)`,
      [alamedaTranslation, alamedaJurisdiction, Language.en]
    )
    await queryRunner.query(
      `INSERT into "translations" (jurisdiction_id, language, translations) VALUES ($1, $2, $3)`,
      [sanJoseJurisdiction, Language.en, sanJoseTranslation]
    )
    await queryRunner.query(
      `INSERT into "translations" (jurisdiction_id, language, translations) VALUES ($1, $2, $3)`,
      [sanMateoJurisdiction, Language.en, sanMateoTranslation]
    )
    await queryRunner.query(
      `UPDATE "translations" SET translations = ($1) where jurisdiction_id is NULL and language = ($2)`,
      [genericTranslation, Language.en]
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
