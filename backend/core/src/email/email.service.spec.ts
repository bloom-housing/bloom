import { Test, TestingModule } from "@nestjs/testing"
import { SendGridModule, SendGridService } from "@anchan828/nest-sendgrid"
import { User } from "../auth/entities/user.entity"
import { EmailService } from "./email.service"
import { ConfigModule } from "@nestjs/config"
import { ArcherListing, Language } from "../../types"
import { getRepositoryToken } from "@nestjs/typeorm"
import { TranslationsService } from "../translations/services/translations.service"
import { Translation } from "../translations/entities/translation.entity"
import { REQUEST } from "@nestjs/core"

import { JurisdictionResolverService } from "../jurisdictions/services/jurisdiction-resolver.service"
import { JurisdictionsService } from "../jurisdictions/services/jurisdictions.service"
import { GeneratedListingTranslation } from "../translations/entities/generated-listing-translation.entity"
import { GoogleTranslateService } from "../translations/services/google-translate.service"
import { ListingReviewOrder } from "../listings/types/listing-review-order-enum"

declare const expect: jest.Expect
jest.setTimeout(30000)
const user = new User()
user.firstName = "Test"
user.lastName = "User"
user.email = "test@xample.com"

const listing = Object.assign({}, ArcherListing)

const application = {
  applicant: { emailAddress: "test@xample.com", firstName: "Test", lastName: "User" },
  id: "abcdefg",
  confirmationCode: "abc123",
}
let sendMock

const translationRepositoryMock = {}

const translationServiceMock = {
  getTranslationByLanguageAndJurisdictionOrDefaultEn: (language) => {
    return language === "es"
      ? {
          jurisdictionId: "",
          language: Language.es,
          translations: {
            confirmation: {
              yourConfirmationNumber: "SPANISH NUMBER", // UPDATED
            },
            footer: {
              line1: "SPANISH Alameda County Housing Portal is a project of the",
            },
          },
        }
      : {
          jurisdictionId: "",
          language: Language.en,
          translations: {
            confirmation: {
              gotYourConfirmationNumber: "We got your application for",
              yourConfirmationNumber: "Your Confirmation Number", // UPDATED
              applicationReceived: "Application <br />received",
              applicationsClosed: "Application <br />closed",
              applicationsRanked: "Application <br />ranked",
              whatHappensNext: "What happens next?",
              applicationPeriodCloses:
                "JURISDICTION: Once the application period closes, the property manager will begin processing applications.",
              eligibleApplicants: {
                FCFS:
                  "Eligible applicants will be placed in order based on <strong>first come first serve</strong> basis.",
                lotteryDate: "The lottery will be held on %{lotteryDate}.",
                lottery:
                  "Eligible applicants will be placed in order <strong>based on preference and lottery rank</strong>.",
              },
              eligible: {
                fcfs:
                  "Eligible applicants will be contacted on a first come first serve basis until vacancies are filled.",
                fcfsPreference:
                  "Housing preferences, if applicable, will affect first come first serve order.",
                lottery:
                  "Once the application period closes, eligible applicants will be placed in order based on lottery rank order.",
                lotteryPreference:
                  "Housing preferences, if applicable, will affect lottery rank order.",
                waitlist:
                  "Eligible applicants will be placed on the waitlist on a first come first serve basis until waitlist spots are filled.",
                waitlistPreference:
                  "Housing preferences, if applicable, will affect waitlist order.",
                waitlistContact:
                  "You may be contacted while on the waitlist to confirm that you wish to remain on the waitlist.",
              },
              interview:
                "If you are contacted for an interview, you will be asked to fill out a more detailed application and provide supporting documents.",
              contactedForAnInterview:
                "If you are contacted for an interview, you will need to fill out a more detailed application and provide supporting documents.",
              prepareForNextSteps: "Prepare for next steps",
              whileYouWait:
                "While you wait, there are things you can do to prepare for potential next steps and future opportunities.",
              readHowYouCanPrepare: "Read about how you can prepare for next steps",
              needToMakeUpdates: "Need to make updates?",
              ifYouNeedToUpdateInformation: "",
              shouldBeChosen:
                "Should your application be chosen, be prepared to fill out a more detailed application and provide required supporting documents.",
              subject: "Your Application Confirmation",
              thankYouForApplying: "Thanks for applying. We have received your application for",
              whatToExpectNext: "What to expect next:",
              nextStepsUrl: "Next steps",
            },
            header: {
              logoTitle: "Alameda County Housing Portal",
              logoUrl:
                "https://res.cloudinary.com/mariposta/image/upload/v1652326298/testing/alameda-portal.png",
            },
            footer: {
              callToAction: "How are we doing? We'd like to get your ",
              callToActionUrl:
                "https://docs.google.com/forms/d/e/1FAIpQLScr7JuVwiNW8q-ifFUWTFSWqEyV5ndA08jAhJQSlQ4ETrnl9w/viewform",
              feedback: "feedback",
              footer: "Alameda County - Housing and Community Development (HCD) Department",
              line1: "Alameda County Housing Portal is a project of the",
              line2: "Alameda County - Housing and Community Development (HCD) Department",
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
                "If you need to update information on your application, do not apply again. Instead, contact the agent for this listing.", // UPDATED"
              propertyManager: "Property Manager",
              officeHours: "Office Hours:",
            },
            register: {
              confirmMyAccount: "Confirm my account",
              toConfirmAccountMessage:
                "To complete your account creation, please click the link below:",
              welcome: "Welcome",
              welcomeMessage:
                "Thank you for setting up your account on %{appUrl}. It will now be easier for you to start, save, and submit online applications for listings that appear on the site.",
            },
            requestApproval: {
              subject: "Listing Approval Requested",
              header: "Listing approval requested",
              partnerRequest:
                "A Partner has submitted an approval request to publish the %{listingName} listing.",
              logInToReviewStart: "Please log into the",
              logInToReviewEnd: "and navigate to the listing detail page to review and publish.",
              accessListing: "To access the listing after logging in, please click the link below",
            },
            changesRequested: {
              header: "Listing changes requested",
              adminRequestStart:
                "An administrator is requesting changes to the %{listingName} listing. Please log into the",
              adminRequestEnd:
                "and navigate to the listing detail page to view the request and edit the listing. To access the listing after logging in, please click the link below",
            },
            listingApproved: {
              header: "New published listing",
              adminApproved:
                "The %{listingName} listing has been approved and published by an administrator.",
              viewPublished: "To view the published listing, please click on the link below",
            },
            t: {
              hello: "Hello",
              seeListing: "See Listing",
              partnersPortal: "Partners Portal",
              viewListing: "View Listing",
              editListing: "Edit Listing",
              reviewListing: "Review Listing",
            },
          },
        }
  },
}

const generatedListingTranslationRepositoryMock = {
  findOne: jest.fn(),
  save: jest.fn(),
}

describe("EmailService", () => {
  let service: EmailService
  let module: TestingModule
  let sendGridService: SendGridService

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule,
        SendGridModule.forRoot({
          apikey: "SG.fake",
        }),
      ],
      providers: [
        EmailService,
        {
          provide: getRepositoryToken(Translation),
          useValue: translationRepositoryMock,
        },
        {
          provide: TranslationsService,
          useValue: translationServiceMock,
        },
        {
          provide: getRepositoryToken(GeneratedListingTranslation),
          useValue: generatedListingTranslationRepositoryMock,
        },
        {
          provide: JurisdictionsService,
          useValue: {},
        },
        {
          provide: JurisdictionResolverService,
          useValue: {
            getJurisdiction: () => ({
              emailFromAddress: "myeamil@from",
            }),
          },
        },
        GoogleTranslateService,
        {
          provide: REQUEST,
          useValue: {
            get: () => {
              return "Alameda"
            },
          },
        },
      ],
    }).compile()
  })

  beforeEach(async () => {
    jest.useFakeTimers()
    sendGridService = module.get<SendGridService>(SendGridService)
    sendMock = jest.fn()
    sendGridService.send = sendMock
    service = await module.resolve(EmailService)
  })

  it("should be defined", async () => {
    const service = await module.resolve(EmailService)
    expect(service).toBeDefined()
  })

  describe("welcome", () => {
    it("should generate html body, jurisdictional footer", async () => {
      await service.welcome(user, "http://localhost:3000", "http://localhost:3000/?token=")
      expect(sendMock).toHaveBeenCalled()
      expect(sendMock.mock.calls[0][0].to).toEqual(user.email)
      expect(sendMock.mock.calls[0][0].subject).toEqual("Welcome")
      // Check if translation is working correctly
      expect(sendMock.mock.calls[0][0].html).toContain(
        "Alameda County - Housing and Community Development (HCD) Department"
      )
      expect(sendMock.mock.calls[0][0].html).toContain("<h1>Hello Test \n User</h1>")
    })
  })

  describe("confirmation", () => {
    it("should generate html body", async () => {
      const service = await module.resolve(EmailService)
      // TODO Remove BaseEntity from inheritance from all entities
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await service.confirmation(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        { ...listing, reviewOrderType: ListingReviewOrder.firstComeFirstServe },
        application,
        "http://localhost:3000"
      )

      expect(sendMock).toHaveBeenCalled()
      const emailMock = sendMock.mock.calls[0][0]
      expect(emailMock.to).toEqual(user.email)
      expect(emailMock.subject).toEqual("Your Application Confirmation")
      expect(emailMock.html).toMatch(
        `<img src="https://res.cloudinary.com/mariposta/image/upload/v1652326298/testing/alameda-portal.png" alt="Alameda County Housing Portal" width="254" height="137" />`
      )
      expect(emailMock.html).toMatch("Your Confirmation Number")
      expect(emailMock.html).toMatch("Marisela Baca")
      expect(emailMock.html).toMatch(
        /Eligible applicants will be contacted on a first come first serve basis until vacancies are filled./
      )
      expect(emailMock.html).toMatch(/http:\/\/localhost:3000\/listing\/Uvbk5qurpB2WI9V6WnNdH/)
      // contains application id
      expect(emailMock.html).toMatch(/abc123/)
    })

    it("should support lottery order", async () => {
      const service = await module.resolve(EmailService)
      // TODO Remove BaseEntity from inheritance from all entities
      await service.confirmation(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        { ...listing, reviewOrderType: ListingReviewOrder.lottery },
        application,
        "http://localhost:3000"
      )

      const emailMock = sendMock.mock.calls[0][0]
      expect(emailMock.html).toMatch(
        /Once the application period closes, eligible applicants will be placed in order based on lottery rank order./
      )
    })

    it("should support translations", async () => {
      // translationServiceMock.getTranslationByLanguageAndJurisdictionOrDefaultEn.mockResolvedValueOnce()
      const service = await module.resolve(EmailService)
      await service.confirmation(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        listing,
        { ...application, language: "es" },
        "http://localhost:3000"
      )

      const emailMock = sendMock.mock.calls[0][0]
      expect(emailMock.html).toMatch("SPANISH NUMBER")
      expect(emailMock.html).toMatch("SPANISH Alameda County Housing Portal is a project of the")
    })
  })
  describe("request approval", () => {
    it("should generate html body", async () => {
      const emailArr = ["testOne@xample.com", "testTwo@example.com"]
      const service = await module.resolve(EmailService)
      await service.requestApproval(
        user,
        { id: listing.id, name: listing.name },
        emailArr,
        "http://localhost:3001"
      )

      expect(sendMock).toHaveBeenCalled()
      const emailMock = sendMock.mock.calls[0][0]
      expect(emailMock.to).toEqual(emailArr)
      expect(emailMock.subject).toEqual("Listing approval requested")
      expect(emailMock.html).toMatch(
        `<img src="https://res.cloudinary.com/mariposta/image/upload/v1652326298/testing/alameda-portal.png" alt="Alameda County Housing Portal" width="254" height="137" />`
      )
      expect(emailMock.html).toMatch("Hello,")
      expect(emailMock.html).toMatch("Listing approval requested")
      expect(emailMock.html).toMatch(
        `A Partner has submitted an approval request to publish the ${listing.name} listing.`
      )
      expect(emailMock.html).toMatch("Please log into the")
      expect(emailMock.html).toMatch("Partners Portal")
      expect(emailMock.html).toMatch(/http:\/\/localhost:3001/)
      expect(emailMock.html).toMatch(
        "and navigate to the listing detail page to review and publish."
      )
      expect(emailMock.html).toMatch(
        "To access the listing after logging in, please click the link below"
      )
      expect(emailMock.html).toMatch("Review Listing")
      expect(emailMock.html).toMatch(/http:\/\/localhost:3001\/listings\/Uvbk5qurpB2WI9V6WnNdH/)
      expect(emailMock.html).toMatch("Thank you,")
      expect(emailMock.html).toMatch("Alameda County Housing Portal")
      expect(emailMock.html).toMatch("Alameda County Housing Portal is a project of the")
      expect(emailMock.html).toMatch(
        "Alameda County - Housing and Community Development (HCD) Department"
      )
    })
  })

  describe("changes requested", () => {
    it("should generate html body", async () => {
      const emailArr = ["testOne@xample.com", "testTwo@example.com"]
      const service = await module.resolve(EmailService)
      await service.changesRequested(
        user,
        { id: listing.id, name: listing.name },
        emailArr,
        "http://localhost:3001"
      )

      expect(sendMock).toHaveBeenCalled()
      const emailMock = sendMock.mock.calls[0][0]
      expect(emailMock.to).toEqual(emailArr)
      expect(emailMock.subject).toEqual("Listing changes requested")
      expect(emailMock.html).toMatch(
        `<img src="https://res.cloudinary.com/mariposta/image/upload/v1652326298/testing/alameda-portal.png" alt="Alameda County Housing Portal" width="254" height="137" />`
      )
      expect(emailMock.html).toMatch("Listing changes requested")
      expect(emailMock.html).toMatch("Hello,")
      expect(emailMock.html).toMatch(
        `An administrator is requesting changes to the ${listing.name} listing. Please log into the `
      )
      expect(emailMock.html).toMatch("Partners Portal")
      expect(emailMock.html).toMatch(/http:\/\/localhost:3001/)

      expect(emailMock.html).toMatch(
        " and navigate to the listing detail page to view the request and edit the listing."
      )
      expect(emailMock.html).toMatch(
        "and navigate to the listing detail page to view the request and edit the listing."
      )
      expect(emailMock.html).toMatch(/http:\/\/localhost:3001/)
      expect(emailMock.html).toMatch(
        "To access the listing after logging in, please click the link below"
      )
      expect(emailMock.html).toMatch("Edit Listing")
      expect(emailMock.html).toMatch(/http:\/\/localhost:3001\/listings\/Uvbk5qurpB2WI9V6WnNdH/)
      expect(emailMock.html).toMatch("Thank you,")
      expect(emailMock.html).toMatch("Alameda County Housing Portal")
      expect(emailMock.html).toMatch("Alameda County Housing Portal is a project of the")
      expect(emailMock.html).toMatch(
        "Alameda County - Housing and Community Development (HCD) Department"
      )
    })
  })

  describe("published listing", () => {
    it("should generate html body", async () => {
      const emailArr = ["testOne@xample.com", "testTwo@example.com"]
      const service = await module.resolve(EmailService)
      await service.listingApproved(
        user,
        { id: listing.id, name: listing.name },
        emailArr,
        "http://localhost:3000"
      )

      expect(sendMock).toHaveBeenCalled()
      const emailMock = sendMock.mock.calls[0][0]
      expect(emailMock.to).toEqual(emailArr)
      expect(emailMock.subject).toEqual("New published listing")
      expect(emailMock.html).toMatch(
        `<img src="https://res.cloudinary.com/mariposta/image/upload/v1652326298/testing/alameda-portal.png" alt="Alameda County Housing Portal" width="254" height="137" />`
      )
      expect(emailMock.html).toMatch("New published listing")
      expect(emailMock.html).toMatch("Hello,")
      expect(emailMock.html).toMatch(
        `The ${listing.name} listing has been approved and published by an administrator.`
      )
      expect(emailMock.html).toMatch(
        "To view the published listing, please click on the link below"
      )
      expect(emailMock.html).toMatch("View Listing")
      expect(emailMock.html).toMatch(/http:\/\/localhost:3000\/listing\/Uvbk5qurpB2WI9V6WnNdH/)
      expect(emailMock.html).toMatch("Thank you,")
      expect(emailMock.html).toMatch("Alameda County Housing Portal")
      expect(emailMock.html).toMatch("Alameda County Housing Portal is a project of the")
      expect(emailMock.html).toMatch(
        "Alameda County - Housing and Community Development (HCD) Department"
      )
    })
  })

  afterAll(async () => {
    await module.close()
  })
})
