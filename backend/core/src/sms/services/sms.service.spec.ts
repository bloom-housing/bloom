import { HttpException, HttpStatus } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing"
import { UserService } from "../../auth/services/user.service"
import { SmsService } from "./sms.service"
import { TwilioService } from "./twilio.service"

// Cypress brings in Chai types for the global expect, but we want to use jest
// expect here so we need to re-declare it.
// see: https://github.com/cypress-io/cypress/issues/1319#issuecomment-593500345
declare const expect: jest.Expect

const mockedTwilioService = { send: jest.fn() }

describe("SmsService", () => {
  let service: SmsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SmsService,
        {
          provide: TwilioService,
          useValue: mockedTwilioService,
        },
      ],
    }).compile()

    service = await module.resolve<SmsService>(SmsService)
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  describe("send", () => {
    it("sends to Twilio", async () => {
      await service.send({ phoneNumber: "+15555555555", body: "test body" })

      expect(mockedTwilioService.send).toHaveBeenCalledWith("test body", "+15555555555")
    })
  })
})
