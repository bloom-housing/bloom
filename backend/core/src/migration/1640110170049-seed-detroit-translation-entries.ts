import { MigrationInterface, QueryRunner } from "typeorm"
import { Language } from "../shared/types/language-enum"

export class seedDetroitTranslationEntries1640110170049 implements MigrationInterface {
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
            "The lottery will be held on %{lotteryDate}. Applicants will be contacted by the agent in lottery rank order until vacancies are filled.",
          noLottery:
            "Applicants will be contacted by the agent in waitlist order until vacancies are filled.",
        },
      },
      footer: {
        callToAction: "How are we doing? We'd like to get your ",
        callToActionUrl: "FEEDBACK URL UNIMPLEMENTED",
        feedback: "feedback",
        footer: "Detroit Home Connect",
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
      newListing: {
        title: "Rental opportunity at",
        applicationDue: "Application Due",
        addressLabel: "Address",
        unitsLabel: "Units",
        rentLabel: "Rent",
        seeListingLabel: "See Listing And Apply",
        dhcProjectLabel: "Detroit Home Connect is a project of the",
        hrdLabel: "Housing & Revitalization Department of the City of Detroit",
        unsubscribeMsg: "Unsubscribe from list",
      },
      updateListing: {
        title: "Reminder to update your listing",
        verifyMsg: "Verify the following information is correct.",
        listingLabel: "Listing",
        addressLabel: "Address",
        unitsLabel: "Units",
        rentLabel: "Rent",
        seeListingLabel: "See Listing",
        dhcProjectLabel: "Detroit Home Connect is a project of the",
        hrdLabel: "Housing & Revitalization Department of the City of Detroit",
        unsubscribeMsg: "Unsubscribe from list",
      },
    }

    const [{ id: detroit_jurisdiction_id }] = await queryRunner.query(
      `SELECT id FROM jurisdictions where name='Detroit'`
    )
    await queryRunner.query(
      `UPDATE "translations" (jurisdiction_id, language, translations) VALUES ($1, $2, $3)`,
      [detroit_jurisdiction_id, Language.en, defaultTranslation]
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
