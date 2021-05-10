import { Test, TestingModule } from "@nestjs/testing"
import { SendGridService, SendGridModule } from "@anchan828/nest-sendgrid"
import { User } from "../../user/entities/user.entity"
import { EmailService } from "./email.service"
import { ConfigModule } from "@nestjs/config"
import { ArcherListing } from "../../../types"
import { TypeOrmModule } from "@nestjs/typeorm"
import { TranslationsService } from "../../translations/translations.service"
const dbOptions = require("../../../ormconfig.test")

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
  let sendGridService: SendGridService

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(dbOptions),
        ConfigModule,
        SendGridModule.forRoot({
          apikey: "SG.fake",
        }),
      ],
      providers: [
        EmailService,
        {
          provide: TranslationsService,
          useFactory: () => {
            let getTranslationByLanguageAndCountyCodeMock = jest.fn()
            getTranslationByLanguageAndCountyCodeMock.mockReturnValue({translations: {
              // TODO Add translations?
              }})
            return {
              getTranslationByLanguageAndCountyCode: getTranslationByLanguageAndCountyCodeMock,
            }
          },
        },
      ],
    }).compile()
    sendGridService = module.get<SendGridService>(SendGridService)
    service = await module.resolve(EmailService)
    sendMock = jest.fn()
    sendGridService.send = sendMock
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  describe("welcome", () => {
    it("should generate html body", async () => {
      await service.welcome(user, "http://localhost:3000")
      expect(sendMock).toHaveBeenCalled()
      expect(sendMock.mock.calls[0][0].to).toEqual(user.email)
      expect(sendMock.mock.calls[0][0].subject).toEqual("Welcome to Bloom")
      // Check if translation is working correctly
      expect(sendMock.mock.calls[0][0].html.substring(0, 26)).toEqual("<h1>Hello Test \n User</h1>")
    })
  })

  describe("confirmation", () => {
    it("should generate html body", async () => {
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
})
