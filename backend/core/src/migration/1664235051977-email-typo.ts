import { MigrationInterface, QueryRunner } from "typeorm"
import { Language } from "../shared/types/language-enum"

export class emailTypo1664235051977 implements MigrationInterface {
  name = "emailTypo1664235051977"

  public async up(queryRunner: QueryRunner): Promise<void> {
    let generalTranslation = await queryRunner.query(
      `SELECT translations FROM translations WHERE jurisdiction_id IS NULL AND language = ($1)`,
      [Language.en]
    )

    generalTranslation = generalTranslation["0"]["translations"]

    generalTranslation.confirmation = {
      ...generalTranslation.confirmation,
      eligible: {
        fcfs:
          "Eligible applicants will be contacted on a first come first serve basis until vacancies are filled.",
        waitlist:
          "Eligible applicants will be placed on the waitlist on a first come first serve basis until waitlist spots are filled.",
      },
    }

    await queryRunner.query(
      `UPDATE "translations" SET translations = ($1) where jurisdiction_id IS NULL and language = ($2)`,
      [generalTranslation, Language.en]
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
