import { MigrationInterface, QueryRunner } from "typeorm"
import { Language } from "../shared/types/language-enum"

export class updateSanJoseEmailTranslations1643956852233 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // First update the existing English translation for San Jose:
    const [{ id: sanJoseJurisdiction }] = await queryRunner.query(
      `SELECT id FROM jurisdictions WHERE name = 'San Jose' LIMIT 1`
    )

    let sanJoseTranslation = await queryRunner.query(
      `SELECT translations FROM translations WHERE jurisdiction_id = ($1) AND language = ($2)`,
      [sanJoseJurisdiction, Language.en]
    )
    sanJoseTranslation = sanJoseTranslation["0"]["translations"]

    if (!sanJoseTranslation.confirmation) sanJoseTranslation.confirmation = {}
    sanJoseTranslation.confirmation.thankYouForApplying =
      "Thanks for applying for housing from the San Jose Doorway Portal. We have received your application for"
    ;(sanJoseTranslation.footer.thankYou = "Thanks!"),
      await queryRunner.query(
        `UPDATE "translations" SET translations = ($1) where jurisdiction_id = ($2) and language = ($3)`,
        [sanJoseTranslation, sanJoseJurisdiction, Language.en]
      )

    // Now add additional translations

    // Spanish
    let sanJoseSpanish = await queryRunner.query(
      `SELECT translations FROM translations WHERE jurisdiction_id = ($1) AND language = ($2)`,
      [sanJoseJurisdiction, Language.es]
    )
    if (sanJoseSpanish.length === 0) {
      console.log("Inserting Spanish !!")
      sanJoseSpanish = {
        t: {
          hello: "Hola",
        },
        confirmation: {
          yourConfirmationNumber: "Aquí tiene su número de confirmación:",
          shouldBeChosen:
            "Si su solicitud es elegida, prepárese para llenar una solicitud más detallada y proporcionar los documentos de apoyo necesarios.",
          subject: "Confirmación de su solicitud",
          thankYouForApplying:
            "Gracias por solicitar una vivienda desde el Portal de San José. Hemos recibido su solicitud para",
          whatToExpectNext: "Qué esperar a continuación:",
          whatToExpect: {
            FCFS:
              "El agente inmobiliario se pondrá en contacto con los solicitantes por orden de llegada hasta que se cubran las vacantes.",
            noLottery:
              "Los solicitantes serán contactados por el agente en orden de lista de espera hasta que se cubran las vacantes.",
          },
        },
        leasingAgent: {
          contactAgentToUpdateInfo:
            "Si necesita actualizar la información de su solicitud, no vuelva a presentarla. Póngase en contacto con el agente. Vea a continuación la información de contacto del agente para este listado.",
          officeHours: "Horario de oficina:",
        },
        footer: {
          footer: "Ciudad de San José, Departamento de Vivienda",
          thankYou: "¡Gracias!",
        },
        register: {
          confirmMyAccount: "Confirmar mi cuenta",
          toConfirmAccountMessage:
            "Para completar la creación de su cuenta, haga clic en el siguiente enlace:",
          welcome: "¡Bienvenido!",
          welcomeMessage:
            "Gracias por crear su cuenta en %{appUrl}. Ahora le será más fácil iniciar, guardar y enviar solicitudes en línea para los listados que aparecen en el sitio.",
        },
        forgotPassword: {
          callToAction:
            "Si usted hizo esta solicitud, haga clic en el enlace de abajo para restablecer su contraseña:",
          changePassword: "Cambiar mi contraseña",
          ignoreRequest: "Si usted no lo solicitó, ignore este correo electrónico.",
          passwordInfo:
            "Su contraseña no cambiará hasta que acceda al enlace anterior y cree una nueva.",
          resetRequest:
            "Recientemente se ha solicitado el restablecimiento de su contraseña del sitio web del Portal de Vivienda Bloom para %{appUrl}.",
          subject: "Forgot your password?",
        },
      }
      await queryRunner.query(
        `INSERT into "translations" (jurisdiction_id, language, translations) VALUES ($1, $2, $3)`,
        [sanJoseJurisdiction, Language.es, sanJoseSpanish]
      )
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
