import { MigrationInterface, QueryRunner } from "typeorm"
import { Language } from "../shared/types/language-enum"

export class newConfirmationEmailTranslations1663104141106 implements MigrationInterface {
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
          "Eligibile applicants will be contacted on a first come first serve basis until vacancies are filled.",
        fcfsPreference:
          "Housing preferences, if applicable, will affect first come, first serve order.",
        lottery:
          "Once the application period closes, eligible applicants will be placed in order based on lottery rank order.",
        lotteryPreference: "Housing preferences, if applicable, will affect lottery rank order.",
        waitlist:
          "Eligibile applicants will be placed on the waitlist on a first come first serve basis until waitlist spots are filled.",
        waitlistPreference: "Housing preferences, if applicable, will affect waitlist order.",
        waitlistContact:
          "You may be contacted while on the waitlist to confirm that you wish to remain on the waitlist.",
      },
      interview:
        "If you are contacted for an interview, you will be asked to fill out a more detailed application and provide supporting documents.",
    }

    await queryRunner.query(
      `UPDATE "translations" SET translations = ($1) where jurisdiction_id IS NULL and language = ($2)`,
      [generalTranslation, Language.en]
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
