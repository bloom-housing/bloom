import { MigrationInterface, QueryRunner } from "typeorm"
import { Language } from "../shared/types/language-enum"

export class updateReviewOrderTranslations1646281685647 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    let sanJoseJurisdiction = await queryRunner.query(
      `SELECT id FROM jurisdictions WHERE name = 'San Jose' LIMIT 1`
    )

    if (sanJoseJurisdiction.length === 0) return

    sanJoseJurisdiction = sanJoseJurisdiction[0].id

    let generalTranslation = await queryRunner.query(
      `SELECT translations FROM translations WHERE jurisdiction_id IS NULL AND language = ($1)`,
      [Language.en]
    )

    generalTranslation = generalTranslation["0"]["translations"]
    generalTranslation.confirmation.whatToExpect.lottery =
      generalTranslation.confirmation.whatToExpect.noLottery
    delete generalTranslation.confirmation.whatToExpect.noLottery

    await queryRunner.query(
      `UPDATE "translations" SET translations = ($1) where jurisdiction_id IS NULL and language = ($2)`,
      [generalTranslation, Language.en]
    )

    let sanJoseSpanishTranslation = await queryRunner.query(
      `SELECT translations FROM translations WHERE jurisdiction_id = ($1) AND language = ($2)`,
      [sanJoseJurisdiction, Language.es]
    )

    sanJoseSpanishTranslation = sanJoseSpanishTranslation["0"]["translations"]
    sanJoseSpanishTranslation.confirmation.whatToExpect.lottery =
      sanJoseSpanishTranslation.confirmation.whatToExpect.noLottery
    delete sanJoseSpanishTranslation.confirmation.whatToExpect.noLottery

    await queryRunner.query(
      `UPDATE "translations" SET translations = ($1) where jurisdiction_id = ($2) AND language = ($3)`,
      [sanJoseSpanishTranslation, sanJoseJurisdiction, Language.es]
    )

    let sanJoseChineseTranslation = await queryRunner.query(
      `SELECT translations FROM translations WHERE jurisdiction_id = ($1) AND language = ($2)`,
      [sanJoseJurisdiction, Language.zh]
    )

    sanJoseChineseTranslation = sanJoseChineseTranslation["0"]["translations"]
    sanJoseChineseTranslation.confirmation.whatToExpect.lottery =
      sanJoseChineseTranslation.confirmation.whatToExpect.noLottery
    delete sanJoseChineseTranslation.confirmation.whatToExpect.noLottery

    await queryRunner.query(
      `UPDATE "translations" SET translations = ($1) where jurisdiction_id = ($2) AND language = ($3)`,
      [sanJoseChineseTranslation, sanJoseJurisdiction, Language.zh]
    )

    let sanJoseVietnameseTranslation = await queryRunner.query(
      `SELECT translations FROM translations WHERE jurisdiction_id = ($1) AND language = ($2)`,
      [sanJoseJurisdiction, Language.vi]
    )

    sanJoseVietnameseTranslation = sanJoseVietnameseTranslation["0"]["translations"]
    sanJoseVietnameseTranslation.confirmation.whatToExpect.lottery =
      sanJoseVietnameseTranslation.confirmation.whatToExpect.noLottery
    delete sanJoseVietnameseTranslation.confirmation.whatToExpect.noLottery

    await queryRunner.query(
      `UPDATE "translations" SET translations = ($1) where jurisdiction_id = ($2) AND language = ($3)`,
      [sanJoseVietnameseTranslation, sanJoseJurisdiction, Language.vi]
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
