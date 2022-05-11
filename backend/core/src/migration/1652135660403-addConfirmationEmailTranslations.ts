import { MigrationInterface, QueryRunner } from "typeorm"
import { Language } from "../shared/types/language-enum"

export class addConfirmationEmailTranslations1652135660403 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    let generalTranslation = await queryRunner.query(
      `SELECT translations FROM translations WHERE jurisdiction_id IS NULL AND language = ($1)`,
      [Language.en]
    )

    generalTranslation = generalTranslation["0"]["translations"]

    generalTranslation.confirmation.yourConfirmationNumber = "Your Confirmation Number"
    generalTranslation.confirmation = {
      ...generalTranslation.confirmation,
      gotYourConfirmationNumber: "We got your application for",
      whatHappensNext: "What happens next?",
      applicationPeriodCloses:
        "Once the application period closes, the property manager will begin processing applications.",
      eligibleApplicants: {
        FCFS:
          "Eligible applicants will be placed in order based on <strong>first come first serve</strong> basis.",
        lotteryDate: "The lottery will be held on %{lotteryDate}.",
        lottery:
          "Eligible applicants will be placed in order <strong>based on preference and lottery rank</strong>.",
      },
      contactedForAnInterview:
        "If you are contacted for an interview, you will need to fill out a more detailed application and provide supporting documents.",
      prepareForNextSteps: "Prepare for next steps",
      whileYouWait:
        "While you wait, there are things you can do to prepare for potential next steps and future opportunities.",
      readHowYouCanPrepare: "Read about how you can prepare for next steps",
      needToMakeUpdates: "Need to make updates?",
    }

    generalTranslation.leasingAgent.contactAgentToUpdateInfo =
      "If you need to update information on your application, do not apply again. Instead, contact the agent for this listing."
    generalTranslation.leasingAgent.propertyManager = "Property Manager"

    generalTranslation.t.seeListing = "See Listing"

    await queryRunner.query(
      `UPDATE "translations" SET translations = ($1) where jurisdiction_id IS NULL and language = ($2)`,
      [generalTranslation, Language.en]
    )

    const [{ id: alamedaJurisdiction }] = await queryRunner.query(
      `SELECT id FROM jurisdictions WHERE name = 'Alameda' LIMIT 1`
    )

    let alamedaTranslation = await queryRunner.query(
      `SELECT translations FROM translations WHERE jurisdiction_id = ($1) AND language = ($2)`,
      [alamedaJurisdiction, Language.en]
    )
    alamedaTranslation = alamedaTranslation["0"]["translations"]

    alamedaTranslation.footer.line1 = "Alameda County Housing Portal is a project of the"
    alamedaTranslation.footer.line2 =
      "Alameda County - Housing and Community Development (HCD) Department"

    await queryRunner.query(
      `UPDATE "translations" SET translations = ($1) where jurisdiction_id = ($2) and language = ($3)`,
      [alamedaTranslation, alamedaJurisdiction, Language.en]
    )

    let [{ id: sanJoseJurisdiction }] = await queryRunner.query(
      `SELECT id FROM jurisdictions WHERE name = 'San Jose' LIMIT 1`
    )

    let sanJoseTranslation = await queryRunner.query(
      `SELECT translations FROM translations WHERE jurisdiction_id = ($1) AND language = ($2)`,
      [sanJoseJurisdiction, Language.en]
    )
    sanJoseTranslation = sanJoseTranslation["0"]["translations"]

    sanJoseTranslation.footer.line1 = "City of San José Housing Portal is a project of the"
    sanJoseTranslation.footer.line2 = "City of San José - Housing Department"

    await queryRunner.query(
      `UPDATE "translations" SET translations = ($1) where jurisdiction_id = ($2) and language = ($3)`,
      [sanJoseTranslation, sanJoseJurisdiction, Language.en]
    )

    let [{ id: sanMateoJurisdiction }] = await queryRunner.query(
      `SELECT id FROM jurisdictions WHERE name = 'San Mateo' LIMIT 1`
    )

    let sanMateoTranslation = await queryRunner.query(
      `SELECT translations FROM translations WHERE jurisdiction_id = ($1) AND language = ($2)`,
      [sanMateoJurisdiction, Language.en]
    )
    sanMateoTranslation = sanMateoTranslation["0"]["translations"]

    sanMateoTranslation.footer.line1 = "San Mateo County Housing Portal is a project of the"
    sanMateoTranslation.footer.line2 = "San Mateo County - Department of Housing (DOH)"

    await queryRunner.query(
      `UPDATE "translations" SET translations = ($1) where jurisdiction_id = ($2) and language = ($3)`,
      [sanMateoTranslation, sanMateoJurisdiction, Language.en]
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
