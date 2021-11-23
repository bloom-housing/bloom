import { MigrationInterface, QueryRunner } from "typeorm"
import { CountyCode } from "../shared/types/county-code"
import { Language } from "../shared/types/language-enum"

export class seedTranslationEntries1620660845209 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const defaultTranslation = {
      confirmation: {
        yourConfirmationNumber: "Here is your confirmation number:",
        shouldBeChosen:
          "Should your application be chosen, be prepared to fill out a more detailed application and provide required supporting documents.",
        subject: "Your Application Confirmation",
        thankYouForApplying: "Thanks for applying. We have received your application for",
        whatToExpectNext: "What to expect next:",
        whatToExpect: {
          FCFS:
            "Applicants will be contacted by the property agent on a first come first serve basis until vacancies are filled.",
          lottery:
            "Applicants will be contacted by the agent in lottery rank order until vacancies are filled.",
          noLottery:
            "Applicants will be contacted by the agent in waitlist order until vacancies are filled.",
        },
      },
      footer: {
        callToAction: "How are we doing? We'd like to get your ",
        callToActionUrl:
          "https://docs.google.com/forms/d/e/1FAIpQLScr7JuVwiNW8q-ifFUWTFSWqEyV5ndA08jAhJQSlQ4ETrnl9w/viewform",
        feedback: "feedback",
        footer: "Alameda County - Housing and Community Development (HCD) Department",
        thankYou: "Thank you",
      },
      forgotPassword: {
        callToAction:
          "If you did make this request, please click on the link below to reset your password:",
        changePassword: "Change my password",
        ignoreRequest: "If you didn't request this, please ignore this email.",
        passwordInfo:
          "Your password won't change until you access the link above and create a new one.",
        resetRequest:
          "A request to reset your Bloom Housing Portal website password for %{appUrl} has recently been made.",
        subject: "Forgot your password?",
      },
      leasingAgent: {
        contactAgentToUpdateInfo:
          "If you need to update information on your application, do not apply again. Contact the agent. See below for contact information for the Agent for this listing.",
        officeHours: "Office Hours:",
      },
      register: {
        confirmMyAccount: "Confirm my account",
        toConfirmAccountMessage: "To complete your account creation, please click the link below:",
        welcome: "Welcome",
        welcomeMessage:
          "Thank you for setting up your account on %{appUrl}. It will now be easier for you to start, save, and submit online applications for listings that appear on the site.",
      },
      t: {
        hello: "Hello",
      },
    }
    await queryRunner.query(
      `INSERT into "translations" (county_code, language, translations) VALUES ($1, $2, $3)`,
      [CountyCode.alameda, Language.en, defaultTranslation]
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
