import { Test, TestingModule } from "@nestjs/testing"
import { ListingsService } from "../listings.service"
import { getRepositoryToken } from "@nestjs/typeorm"
import { Listing } from "../entities/listing.entity"
import { TranslationsService } from "../../translations/translations.service"
import { AmiChart } from "../../ami-charts/entities/ami-chart.entity"
import { ListingStatus } from "../types/listing-status-enum"

// Cypress brings in Chai types for the global expect, but we want to use jest
// expect here so we need to re-declare it.
// see: https://github.com/cypress-io/cypress/issues/1319#issuecomment-593500345
declare const expect: jest.Expect

let service: ListingsService

const mockOverdueListings = [
  {
    id: "1",
    property: { id: "test-property1", units: [] },
    preferences: [],
    status: "active",
    unitsSummarized: { byUnitTypeAndRent: [] },
    applicationDueDate: new Date("1970-01-01"),
  },
  {
    id: "2",
    property: { id: "test-property1", units: [] },
    preferences: [],
    status: "closed",
    applicationDueDate: new Date(Date.now() + 1000 * 60),
    unitsSummarized: { byUnitTypeAndRent: [] },
  },
]

const mockQueryBuilder = {
  select: jest.fn().mockReturnThis(),
  leftJoin: jest.fn().mockReturnThis(),
  leftJoinAndSelect: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  setParameters: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  addOrderBy: jest.fn().mockReturnThis(),
  getMany: jest.fn().mockReturnValue(mockOverdueListings),
}
const mockListingsRepo = {
  createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  count: jest.fn().mockReturnValue(100),
  save: jest.fn(),
}

describe("ListingsService", () => {
  beforeEach(async () => {
    process.env.APP_SECRET = "SECRET"
    process.env.EMAIL_API_KEY = "SG.KEY"
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListingsService,
        {
          provide: getRepositoryToken(Listing),
          useValue: mockListingsRepo,
        },
        {
          provide: getRepositoryToken(AmiChart),
          useValue: jest.fn(),
        },
        {
          provide: TranslationsService,
          useValue: { translateListing: jest.fn() },
        },
      ],
    }).compile()

    service = module.get(ListingsService)
  })

  it("should close overdue listings", async () => {
    mockQueryBuilder.getMany.mockReturnValueOnce(mockOverdueListings)
    mockListingsRepo.createQueryBuilder.mockReturnValueOnce(mockQueryBuilder)

    await service.changeOverdueListingsStatusCron()

    expect(mockListingsRepo.save).toHaveBeenCalledTimes(1)
    expect(
      (mockListingsRepo.save.mock.calls[0][0] as Array<Partial<Listing>>).every(
        (listing) => listing.status === ListingStatus.closed
      )
    ).toBe(true)
  })
})
