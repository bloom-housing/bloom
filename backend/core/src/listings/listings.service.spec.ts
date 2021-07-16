import { Test, TestingModule } from "@nestjs/testing"
import { ListingsService } from "./listings.service"
import { getRepositoryToken } from "@nestjs/typeorm"
import { Listing } from "./entities/listing.entity"
import { mapTo } from "../shared/mapTo"
import { ListingDto } from "./dto/listing.dto"
import { Compare } from "../shared/dto/filter.dto"
import { ListingsQueryParams } from "./listings.controller"

// Cypress brings in Chai types for the global expect, but we want to use jest
// expect here so we need to re-declare it.
// see: https://github.com/cypress-io/cypress/issues/1319#issuecomment-593500345
declare const expect: jest.Expect

let service: ListingsService
const origin = "localhost"
const mockListings = [
  { id: "asdf1", property: { id: "test-property1", units: [] }, preferences: [], status: "closed" },
  { id: "asdf2", property: { id: "test-property2", units: [] }, preferences: [], status: "closed" },
]
const mockListingsDto = mapTo<ListingDto, Listing>(ListingDto, mockListings as Listing[])
const mockQueryBuilder = {
  leftJoinAndSelect: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  getMany: jest.fn().mockReturnValue(mockListings),
}
const mockListingsRepo = {
  createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  count: jest.fn().mockReturnValue(100),
}

describe("ListingsService", () => {
  beforeEach(async () => {
    process.env.APP_SECRET = "SECRET"
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListingsService,
        {
          provide: getRepositoryToken(Listing),
          useValue: mockListingsRepo,
        },
      ],
    }).compile()

    service = module.get(ListingsService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  describe("getListingsList", () => {
    it("should not add a WHERE clause if no filters are applied", async () => {
      const listings = await service.list(origin, {})

      expect(listings.items).toEqual(mockListingsDto)
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledTimes(0)
    })

    it("should add a WHERE clause if the neighborhood filter is applied", async () => {
      const expectedNeighborhood = "Fox Creek"

      const queryParams: ListingsQueryParams = {
        filter: {
          $comparison: Compare["="],
          neighborhood: expectedNeighborhood,
        },
      }

      const listings = await service.list(origin, queryParams)

      expect(listings.items).toEqual(mockListingsDto)
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        "property.neighborhood = :neighborhood",
        {
          neighborhood: expectedNeighborhood,
        }
      )
    })
  })

  it("should call take() and skip() if pagination params are specified", async () => {
    // Empty params (no pagination) -> no take/skip
    let params = {}
    let listings = await service.list(origin, params)
    expect(listings.items).toEqual(mockListingsDto)
    expect(mockQueryBuilder.take).toHaveBeenCalledTimes(0)
    expect(mockQueryBuilder.skip).toHaveBeenCalledTimes(0)

    // Invalid pagination params (page specified, but not limit) -> no take/skip
    params = { page: 3 }
    listings = await service.list(origin, params)
    expect(listings.items).toEqual(mockListingsDto)
    expect(mockQueryBuilder.take).toHaveBeenCalledTimes(0)
    expect(mockQueryBuilder.skip).toHaveBeenCalledTimes(0)

    // Valid pagination params -> skip and take called appropriately
    params = { page: 3, limit: 7 }
    listings = await service.list(origin, params)
    expect(listings.items).toEqual(mockListingsDto)
    expect(mockQueryBuilder.take).toHaveBeenCalledWith(7)
    expect(mockQueryBuilder.skip).toHaveBeenCalledWith(14)
  })
})
