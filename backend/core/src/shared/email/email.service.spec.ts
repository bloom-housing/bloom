import { Test, TestingModule } from "@nestjs/testing"
import { SendGridModule, SendGridService } from "@anchan828/nest-sendgrid"
import { User } from "../../auth/entities/user.entity"
import { EmailService } from "./email.service"
import { ConfigModule } from "@nestjs/config"
import { ArcherListing } from "../../../types"
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm"
import { TranslationsService } from "../../translations/translations.service"
import { Translation } from "../../translations/entities/translation.entity"
import { Language } from "../types/language-enum"
import { Repository } from "typeorm"
import { REQUEST } from "@nestjs/core"

import dbOptions = require("../../../ormconfig.test")
import { JurisdictionResolverService } from "../../jurisdictions/services/jurisdiction-resolver.service"
import { JurisdictionsService } from "../../jurisdictions/services/jurisdictions.service"
import { Jurisdiction } from "../../jurisdictions/entities/jurisdiction.entity"

declare const expect: jest.Expect
const user = new User()
user.firstName = "Test"
user.lastName = "User"
user.email = "test@xample.com"

const listing = Object.assign({}, ArcherListing)

const application = {
  applicant: { emailAddress: "test@xample.com", firstName: "Test", lastName: "User" },
  id: "abcdefg",
}
let sendMock

describe("EmailService", () => {
  let service: EmailService
  let module: TestingModule
  let sendGridService: SendGridService

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(dbOptions),
        TypeOrmModule.forFeature([Translation, Jurisdiction]),
        ConfigModule,
        SendGridModule.forRoot({
          apikey: "SG.fake",
        }),
      ],
      providers: [
        EmailService,
        TranslationsService,
        JurisdictionsService,
        JurisdictionResolverService,
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

    const jurisdictionService = await module.resolve<JurisdictionsService>(JurisdictionsService)
    const jurisdiction = await jurisdictionService.findOne({ where: { name: "Alameda" } })

    const translationsRepository = module.get<Repository<Translation>>(
      getRepositoryToken(Translation)
    )
    await translationsRepository.createQueryBuilder().delete().execute()
    const translationsService = await module.resolve<TranslationsService>(TranslationsService)
    await translationsService.create({
      jurisdiction: {
        id: jurisdiction.id,
      },
      language: Language.en,
      translations: {
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
          toConfirmAccountMessage:
            "To complete your account creation, please click the link below:",
          welcome: "Welcome",
          welcomeMessage:
            "Thank you for setting up your account on %{appUrl}. It will now be easier for you to start, save, and submit online applications for listings that appear on the site.",
        },
        t: {
          hello: "Hello",
        },
      },
    })
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
    it("should generate html body", async () => {
      await service.welcome(user, "http://localhost:3000", "http://localhost:3000/?token=")
      expect(sendMock).toHaveBeenCalled()
      expect(sendMock.mock.calls[0][0].to).toEqual(user.email)
      expect(sendMock.mock.calls[0][0].subject).toEqual("Welcome to Bloom")
      // Check if translation is working correctly
      expect(sendMock.mock.calls[0][0].html.substring(0, 26)).toEqual("<h1>Hello Test \n User</h1>")
    })
  })

  describe("confirmation", () => {
    it("should generate html body", async () => {
      const service = await module.resolve(EmailService)
      // TODO Remove BaseEntity from inheritance from all entities
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await service.confirmation(listing, application, "http://localhost:3000")
      expect(sendMock).toHaveBeenCalled()
      expect(sendMock.mock.calls[0][0].to).toEqual(user.email)
      expect(sendMock.mock.calls[0][0].subject).toEqual("Your Application Confirmation")
      expect(sendMock.mock.calls[0][0].html).toMatch(
        /Applicants will be contacted by the agent in waitlist order until vacancies are filled/
      )
      expect(sendMock.mock.calls[0][0].html).toMatch(
        /http:\/\/localhost:3000\/listing\/Uvbk5qurpB2WI9V6WnNdH/
      )
      // contains application id
      expect(sendMock.mock.calls[0][0].html).toMatch(/abcdefg/)
    })
  })

  afterAll(async () => {
    await module.close()
  })
})
