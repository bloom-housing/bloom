import { HttpException } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing"
import { Listing } from "../../listings/entities/listing.entity"
import { UserService } from "../../auth/services/user.service"
import { SmsService } from "./sms.service"
import { TwilioService } from "./twilio.service"

// Cypress brings in Chai types for the global expect, but we want to use jest
// expect here so we need to re-declare it.
// see: https://github.com/cypress-io/cypress/issues/1319#issuecomment-593500345
declare const expect: jest.Expect

const mockedTwilioService = { send: jest.fn() }
const mockedUserService = { listAllUsers: jest.fn() }

const mockListing: Listing = {
  name: "Mock Listing",
  id: "",
  createdAt: null,
  updatedAt: null,
  referralApplication: null,
  property: null,
  applications: [],
  showWaitlist: false,
  unitsSummarized: null,
  unitsSummary: null,
  applicationMethods: [],
  applicationDropOffAddress: null,
  applicationMailingAddress: null,
  events: [],
  jurisdiction: null,
  assets: [],
  status: null,
  displayWaitlistSize: false,
  hasId: null,
  listingPreferences: [],
  save: jest.fn(),
  remove: jest.fn(),
  softRemove: jest.fn(),
  recover: jest.fn(),
  reload: jest.fn(),
}

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
        {
          provide: UserService,
          useValue: mockedUserService,
        },
      ],
    }).compile()

    mockedTwilioService.send = jest.fn().mockResolvedValue({ errorCode: 0 })
    service = await module.resolve<SmsService>(SmsService)
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  describe("listing notifications", () => {
    it("sends a new-listing notification to opted-in users (who have phone numbers)", async () => {
      mockedUserService.listAllUsers.mockResolvedValue([
        // User with a phone number, who is opted in for SMS notifications
        { phoneNumber: "+12222222222", preferences: { sendSmsNotifications: true } },
        // User with a phone number, who is opted out of SMS notifications
        { phoneNumber: "+13333333333", preferences: { sendSmsNotifications: false } },
        // User who is opted in for SMS notifications, but has no phone number
        { preferences: { sendSmsNotifications: true } },
      ])

      await service.sendNewListingNotification(mockListing)

      expect(mockedTwilioService.send).toHaveBeenCalledTimes(1)
      expect(mockedTwilioService.send).toHaveBeenCalledWith(
        "A new listing was recently added to Detroit Home Connect: Mock Listing.",
        "+12222222222"
      )
    })

    it("throws an exception if the Twilio call returns an error", async () => {
      mockedUserService.listAllUsers.mockResolvedValue([
        { phoneNumber: "+12222222222", preferences: { sendSmsNotifications: true } },
      ])
      mockedTwilioService.send.mockResolvedValue({
        errorCode: 1,
        errorMessage: "test error message",
      })

      await expect(service.sendNewListingNotification(mockListing)).rejects.toThrow(HttpException)
    })
  })

  describe("send", () => {
    it("sends to Twilio", async () => {
      await service.send({ phoneNumber: "+15555555555", body: "test body" })

      expect(mockedTwilioService.send).toHaveBeenCalledWith("test body", "+15555555555")
    })

    it("throws an exception when Twilio errors out", async () => {
      mockedTwilioService.send.mockResolvedValue({
        errorCode: 1,
        errorMessage: "test error message",
      })

      await expect(
        service.send({ phoneNumber: "+15555555555", body: "test body" })
      ).rejects.toThrow(HttpException)
    })
  })
})
