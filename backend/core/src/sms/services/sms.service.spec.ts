import { HttpException, HttpStatus } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing"
import { any } from "joi"
import { UserService } from "../../auth/services/user.service"
import { SmsService } from "./sms.service"
import { TwilioService } from "./twilio.service"

// Cypress brings in Chai types for the global expect, but we want to use jest
// expect here so we need to re-declare it.
// see: https://github.com/cypress-io/cypress/issues/1319#issuecomment-593500345
declare const expect: jest.Expect

const mockedUserService = { findByEmail: jest.fn() }
const mockedTwilioService = { send: jest.fn() }

describe("SmsService", () => {
  let service: SmsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SmsService,
        {
          provide: UserService,
          useValue: mockedUserService,
        },
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
    it("without user phone number fails", async () => {
      mockedUserService.findByEmail = jest.fn().mockResolvedValue({ phoneNumber: null })

      await expect(
        service.send({ userEmail: "test@example.com", body: "test body" })
      ).rejects.toThrow(HttpException)
    })

    it("sends to Twilio", async () => {
      mockedUserService.findByEmail = jest.fn().mockResolvedValue({ phoneNumber: "+1234567890" })

      await service.send({ userEmail: "test@example.com", body: "test body" })

      expect(mockedTwilioService.send).toHaveBeenCalledWith("test body", "+1234567890")
    })
  })
})
