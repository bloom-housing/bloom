import { Test, TestingModule } from "@nestjs/testing"
import { SendGridService, SendGridModule } from "@anchan828/nest-sendgrid"
import { User } from "../entity/user.entity"
import { EmailService } from "./email.service"

declare const expect: jest.Expect

const sendMock = jest.fn()
const user = new User()
user.firstName = "Test"
user.lastName = "User"
user.email = "test@xample.com"

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
      expect(sendMock.mock.calls[0][0].html.substring(0, 26)).toEqual("<h1>Welcome Test User</h1>")
    })
  })
})
