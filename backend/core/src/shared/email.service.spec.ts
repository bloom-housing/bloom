import { Test, TestingModule } from "@nestjs/testing"
import { SendGridService, SendGridModule } from "@anchan828/nest-sendgrid"
import { User } from "../entity/user.entity"
import { EmailService } from "./email.service"
import Archer from "@bloom-housing/listings-service/listings/archer.json"

declare const expect: jest.Expect
const user = new User()
user.firstName = "Test"
user.lastName = "User"
user.email = "test@xample.com"

const listing = Object.assign({}, Archer) as any

const applicationCreateDto = {
  applicant: { emailAddress: "test@xample.com", firstName: "Test", lastName: "User" },
}
let sendMock

describe("EmailService", () => {
  let service: EmailService
  let sendGridService: SendGridService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        SendGridModule.forRoot({
          apikey: "SG.fake",
        }),
      ],
      providers: [EmailService],
    }).compile()
    sendGridService = module.get<SendGridService>(SendGridService)
    service = module.get(EmailService)
    sendMock = jest.fn()
    sendGridService.send = sendMock
    // jest.spyOn(catsService, 'findAll').mockImplementation
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  describe("welcome", () => {
    it("should generate html body", async () => {
      await service.welcome(user)
      expect(sendMock).toHaveBeenCalled()
      expect(sendMock.mock.calls[0][0].to).toEqual(user.email)
      expect(sendMock.mock.calls[0][0].subject).toEqual("Welcome to Bloom")
      // Check if translation is working correctly
      expect(sendMock.mock.calls[0][0].html.substring(0, 28)).toEqual(
        "<h1>Welcome Test \n User</h1>"
      )
    })
  })

  describe("confirmation", () => {
    it("should generate html body", async () => {
      await service.confirmation(listing, applicationCreateDto, "http://localhost:3000")
      expect(sendMock).toHaveBeenCalled()
      expect(sendMock.mock.calls[0][0].to).toEqual(user.email)
      expect(sendMock.mock.calls[0][0].subject).toEqual("Your Application Confirmation")
      expect(sendMock.mock.calls[0][0].html).toMatch(
        /Applicants will be contacted by the agent in waitlist order until vacancies are filled/
      )
      expect(sendMock.mock.calls[0][0].html).toMatch(
        /http:\/\/localhost:3000\/listing\/Uvbk5qurpB2WI9V6WnNdH/
      )
    })
  })
})
