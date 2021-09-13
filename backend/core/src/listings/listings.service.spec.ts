import { Test, TestingModule } from "@nestjs/testing"
import { ListingsService } from "./listings.service"
import { getRepositoryToken } from "@nestjs/typeorm"
import { HttpException, HttpStatus } from "@nestjs/common"
import { Listing } from "./entities/listing.entity"
import { ListingsQueryParams, ListingFilterParams } from "./dto/listing.dto"
import { Compare } from "../shared/dto/filter.dto"
import { TranslationsService } from "../translations/translations.service"
import { AmiChart } from "../ami-charts/entities/ami-chart.entity"
import { OrderByFieldsEnum } from "./types/listing-orderby-enum"

// Cypress brings in Chai types for the global expect, but we want to use jest
// expect here so we need to re-declare it.
// see: https://github.com/cypress-io/cypress/issues/1319#issuecomment-593500345
declare const expect: jest.Expect

let service: ListingsService
const mockListings = [
  {
    id: "asdf1",
    property: { id: "test-property1", units: [] },
    preferences: [],
    status: "closed",
    unitsSummarized: { byUnitTypeAndRent: [] },
  },
  {
    id: "asdf2",
    property: { id: "test-property2", units: [] },
    preferences: [],
    status: "closed",
    unitsSummarized: { byUnitTypeAndRent: [] },
  },
  {
    id: "asdf3",
    property: { id: "test-property3", units: [] },
    preferences: [],
    status: "closed",
    unitsSummarized: { byUnitTypeAndRent: [] },
  },
  {
    id: "asdf4",
    property: { id: "test-property4", units: [] },
    preferences: [],
    status: "closed",
    unitsSummarized: { byUnitTypeAndRent: [] },
  },
  {
    id: "asdf5",
    property: { id: "test-property5", units: [] },
    preferences: [],
    status: "closed",
    unitsSummarized: { byUnitTypeAndRent: [] },
  },
  {
    id: "asdf6",
    property: { id: "test-property6", units: [] },
    preferences: [],
    status: "closed",
    unitsSummarized: { byUnitTypeAndRent: [] },
  },
  {
    id: "asdf7",
    property: { id: "test-property7", units: [] },
    preferences: [],
    status: "closed",
    unitsSummarized: { byUnitTypeAndRent: [] },
  },
]
const mockFilteredListings = mockListings.slice(0, 2)
const mockInnerQueryBuilder = {
  select: jest.fn().mockReturnThis(),
  leftJoin: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  addOrderBy: jest.fn().mockReturnThis(),
  groupBy: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  offset: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  getParameters: jest.fn().mockReturnValue({ param1: "param1value" }),
  getQuery: jest.fn().mockReturnValue("innerQuery"),
  getCount: jest.fn().mockReturnValue(7),
}
const mockQueryBuilder = {
  select: jest.fn().mockReturnThis(),
  leftJoin: jest.fn().mockReturnThis(),
  leftJoinAndSelect: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  setParameters: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  addOrderBy: jest.fn().mockReturnThis(),
  getMany: jest.fn().mockReturnValue(mockListings),
}
const mockListingsRepo = {
  createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  count: jest.fn().mockReturnValue(100),
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

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  describe("getListingsList", () => {
    it("should not add a WHERE clause if no filters are applied", async () => {
      mockListingsRepo.createQueryBuilder
        .mockReturnValueOnce(mockInnerQueryBuilder)
        .mockReturnValueOnce(mockQueryBuilder)

      const listings = await service.list({})

      expect(listings.items).toEqual(mockListings)
      expect(mockInnerQueryBuilder.andWhere).toHaveBeenCalledTimes(0)
    })

    it("should add a WHERE clause if the neighborhood filter is applied", async () => {
      mockListingsRepo.createQueryBuilder
        .mockReturnValueOnce(mockInnerQueryBuilder)
        .mockReturnValueOnce(mockQueryBuilder)
      const expectedNeighborhood = "Fox Creek"

      const queryParams: ListingsQueryParams = {
        filter: [
          {
            $comparison: Compare["="],
            neighborhood: expectedNeighborhood,
          },
        ],
      }

      const listings = await service.list(queryParams)

      expect(listings.items).toEqual(mockListings)
      expect(mockInnerQueryBuilder.andWhere).toHaveBeenCalledWith(
        "LOWER(CAST(property.neighborhood as text)) = LOWER(:neighborhood_0)",
        {
          neighborhood_0: expectedNeighborhood,
        }
      )
    })

    it("should support filters with comma-separated arrays", async () => {
      mockListingsRepo.createQueryBuilder
        .mockReturnValueOnce(mockInnerQueryBuilder)
        .mockReturnValueOnce(mockQueryBuilder)
      const expectedNeighborhoodString = "Fox Creek, , Coliseum," // intentional extra and trailing commas for test
      // lowercased, trimmed spaces, filtered empty
      const expectedNeighborhoodArray = ["fox creek", "coliseum"]

      const queryParams: ListingsQueryParams = {
        filter: [
          {
            $comparison: Compare["IN"],
            neighborhood: expectedNeighborhoodString,
          },
        ],
      }

      const listings = await service.list(queryParams)

      expect(listings.items).toEqual(mockListings)
      expect(mockInnerQueryBuilder.andWhere).toHaveBeenCalledWith(
        "LOWER(CAST(property.neighborhood as text)) IN (:...neighborhood_0)",
        {
          neighborhood_0: expectedNeighborhoodArray,
        }
      )
    })

    it("should throw an exception if an unsupported filter is used", async () => {
      mockListingsRepo.createQueryBuilder.mockReturnValueOnce(mockInnerQueryBuilder)

      const queryParams: ListingsQueryParams = {
        filter: [
          {
            $comparison: Compare["="],
            otherField: "otherField",
            // The querystring can contain unknown fields that aren't on the
            // ListingFilterParams type, so we force it to the type for testing.
          } as ListingFilterParams,
        ],
      }

      await expect(service.list(queryParams)).rejects.toThrow(
        new HttpException("Filter Not Implemented", HttpStatus.NOT_IMPLEMENTED)
      )
    })

    //TODO(avaleske): A lot of these tests should be moved to a spec file specific to the filters code.
    it("should throw an exception if an unsupported comparison is used", async () => {
      mockListingsRepo.createQueryBuilder.mockReturnValueOnce(mockInnerQueryBuilder)

      const queryParams: ListingsQueryParams = {
        filter: [
          {
            // The value of the filter[$comparison] query param is not validated,
            // and the type system trusts that whatever is provided is correct,
            // so we force it to an invalid type for testing.
            $comparison: "); DROP TABLE Students;" as Compare,
            name: "test name",
          } as ListingFilterParams,
        ],
      }

      await expect(service.list(queryParams)).rejects.toThrow(
        new HttpException("Comparison Not Implemented", HttpStatus.NOT_IMPLEMENTED)
      )
    })

    it("should not call limit() and offset() if pagination params are not specified", async () => {
      mockListingsRepo.createQueryBuilder
        .mockReturnValueOnce(mockInnerQueryBuilder)
        .mockReturnValueOnce(mockQueryBuilder)

      // Empty params (no pagination) -> no limit/offset
      const params = {}
      const listings = await service.list(params)

      expect(listings.items).toEqual(mockListings)
      expect(mockInnerQueryBuilder.limit).toHaveBeenCalledTimes(0)
      expect(mockInnerQueryBuilder.offset).toHaveBeenCalledTimes(0)
    })

    it("should not call limit() and offset() if incomplete pagination params are specified", async () => {
      mockListingsRepo.createQueryBuilder
        .mockReturnValueOnce(mockInnerQueryBuilder)
        .mockReturnValueOnce(mockQueryBuilder)

      // Invalid pagination params (page specified, but not limit) -> no limit/offset
      const params = { page: 3 }
      const listings = await service.list(params)

      expect(listings.items).toEqual(mockListings)
      expect(mockInnerQueryBuilder.limit).toHaveBeenCalledTimes(0)
      expect(mockInnerQueryBuilder.offset).toHaveBeenCalledTimes(0)
      expect(listings.meta).toEqual({
        currentPage: 1,
        itemCount: mockListings.length,
        itemsPerPage: mockListings.length,
        totalItems: mockListings.length,
        totalPages: 1,
      })
    })

    it("should not call limit() and offset() if invalid pagination params are specified", async () => {
      mockListingsRepo.createQueryBuilder
        .mockReturnValueOnce(mockInnerQueryBuilder)
        .mockReturnValueOnce(mockQueryBuilder)

      // Invalid pagination params (page specified, but not limit) -> no limit/offset
      const params = { page: ("hello" as unknown) as number } // force the type for testing
      const listings = await service.list(params)

      expect(listings.items).toEqual(mockListings)
      expect(mockInnerQueryBuilder.limit).toHaveBeenCalledTimes(0)
      expect(mockInnerQueryBuilder.offset).toHaveBeenCalledTimes(0)
      expect(listings.meta).toEqual({
        currentPage: 1,
        itemCount: mockListings.length,
        itemsPerPage: mockListings.length,
        totalItems: mockListings.length,
        totalPages: 1,
      })
    })

    it("should call limit() and offset() if pagination params are specified", async () => {
      mockQueryBuilder.getMany.mockReturnValueOnce(mockFilteredListings)
      mockListingsRepo.createQueryBuilder
        .mockReturnValueOnce(mockInnerQueryBuilder)
        .mockReturnValueOnce(mockQueryBuilder)

      // Valid pagination params -> offset and limit called appropriately
      const params = { page: 3, limit: 2 }
      const listings = await service.list(params)

      expect(listings.items).toEqual(mockFilteredListings)
      expect(mockInnerQueryBuilder.limit).toHaveBeenCalledWith(2)
      expect(mockInnerQueryBuilder.offset).toHaveBeenCalledWith(4)
      expect(mockInnerQueryBuilder.getCount).toHaveBeenCalledTimes(1)
      expect(listings.meta).toEqual({
        currentPage: 3,
        itemCount: 2,
        itemsPerPage: 2,
        totalItems: mockListings.length,
        totalPages: 4,
      })
    })
  })

  describe("ListingsService.list sorting", () => {
    it("defaults to ordering by application dates when no orderBy param is set", async () => {
      mockListingsRepo.createQueryBuilder
        .mockReturnValueOnce(mockInnerQueryBuilder)
        .mockReturnValueOnce(mockQueryBuilder)

      await service.list({})

      const expectedOrderByArgument = {
        "listings.applicationDueDate": "ASC",
        "listings.applicationOpenDate": "DESC",
      }

      // The inner query must be ordered so that the ordering applies across all pages (if pagination is requested)
      expect(mockInnerQueryBuilder.orderBy).toHaveBeenCalledTimes(1)
      expect(mockInnerQueryBuilder.orderBy).toHaveBeenCalledWith(expectedOrderByArgument)

      // The full query must be ordered so that the ordering is applied within a page (if pagination is requested)
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledTimes(1)
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(expectedOrderByArgument)

      // The full query is additionally ordered by the number of bedrooms (or max_occupancy) at the unit level.
      expect(mockQueryBuilder.addOrderBy).toHaveBeenCalledTimes(1)
      expect(mockQueryBuilder.addOrderBy).toHaveBeenCalledWith(
        "units.max_occupancy",
        "ASC",
        "NULLS LAST"
      )
    })

    it("orders by the orderBy param (when set)", async () => {
      mockListingsRepo.createQueryBuilder
        .mockReturnValueOnce(mockInnerQueryBuilder)
        .mockReturnValueOnce(mockQueryBuilder)

      await service.list({ orderBy: OrderByFieldsEnum.mostRecentlyUpdated })

      const expectedOrderByArgument = { "listings.updated_at": "DESC" }

      expect(mockInnerQueryBuilder.orderBy).toHaveBeenCalledTimes(1)
      expect(mockInnerQueryBuilder.orderBy).toHaveBeenCalledWith(expectedOrderByArgument)

      expect(mockQueryBuilder.orderBy).toHaveBeenCalledTimes(1)
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(expectedOrderByArgument)

      // Verify that the full query is still also ordered by the number of bedrooms
      // (or max_occupancy) at the unit level.
      expect(mockQueryBuilder.addOrderBy).toHaveBeenCalledTimes(1)
      expect(mockQueryBuilder.addOrderBy).toHaveBeenCalledWith(
        "units.max_occupancy",
        "ASC",
        "NULLS LAST"
      )
    })
  })
})
