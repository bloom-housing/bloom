import { MigrationInterface, QueryRunner } from "typeorm"
import { Language } from "../shared/types/language-enum"

export class updateProgressNavTranslations1658539336427 implements MigrationInterface {
  name = "updateProgressNavTranslations1658539336427"

  public async up(queryRunner: QueryRunner): Promise<void> {
    let generalTranslation = await queryRunner.query(
      `SELECT translations FROM translations WHERE jurisdiction_id IS NULL AND language = ($1)`,
      [Language.en]
    )

    generalTranslation = generalTranslation["0"]["translations"]

    generalTranslation.confirmation.applicationReceived = "Application <br />received"
    generalTranslation.confirmation.applicationsClosed = "Application <br />closed"
    generalTranslation.confirmation.applicationsRanked = "Application <br />ranked"

    await queryRunner.query(
      `UPDATE "translations" SET translations = ($1) where jurisdiction_id IS NULL and language = ($2)`,
      [generalTranslation, Language.en]
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
