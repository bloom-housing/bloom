import { Test, TestingModule } from "@nestjs/testing"
import { SmsService } from "../services/sms.service"
import { SmsController } from "./sms.controller"
import { AuthzService } from "../../auth/services/authz.service"
import { HttpException } from "@nestjs/common"

// Cypress brings in Chai types for the global expect, but we want to use jest
// expect here so we need to re-declare it.
// see: https://github.com/cypress-io/cypress/issues/1319#issuecomment-593500345
declare const expect: jest.Expect

const mockedSmsService = { send: jest.fn() }

describe("SmsController", () => {
  let controller: SmsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: AuthzService, useValue: {} },
        { provide: SmsService, useValue: mockedSmsService },
      ],
      controllers: [SmsController],
    }).compile()

    controller = module.get<SmsController>(SmsController)
  })

  it("should be defined", () => {
    expect(controller).toBeDefined()
  })

  describe("send", () => {
    it("as non-admin throws exception", async () => {
      await expect(
        controller.send(
          { user: { roles: { isAdmin: false } } },
          { body: "test body", userEmail: "test@example.com" }
        )
      ).rejects.toThrow(HttpException)
    })

    it("as admin sends to service", async () => {
      await controller.send(
        { user: { roles: { isAdmin: true } } },
        { body: "test body", userEmail: "test@example.com" }
      )

      expect(mockedSmsService.send).toHaveBeenCalledWith({
        body: "test body",
        userEmail: "test@example.com",
      })
    })
  })
})
