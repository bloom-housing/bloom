import { Test, TestingModule } from "@nestjs/testing"
import { getRepositoryToken } from "@nestjs/typeorm"
import { HttpException, HttpStatus } from "@nestjs/common"
import { ListingsService } from "../listings.service"
import { TranslationsService } from "../../translations/services/translations.service"
import { AmiChart } from "../../ami-charts/entities/ami-chart.entity"
import { ListingsQueryParams } from "../dto/listings-query-params"
import { Compare } from "../../shared/dto/filter.dto"
import { ListingFilterParams } from "../dto/listing-filter-params"
import { OrderByFieldsEnum } from "../types/listing-orderby-enum"
import { OrderParam } from "../../applications/types/order-param"
import { AuthzService } from "../../auth/services/authz.service"
import { ApplicationFlaggedSetsService } from "../../application-flagged-sets/application-flagged-sets.service"
import { ListingsQueryBuilder } from "../db/listing-query-builder"
import { Listing } from "../entities/listing.entity"
import { User } from "../../auth/entities/user.entity"
import { UserService } from "../../auth/services/user.service"
import { HttpService } from "@nestjs/axios"
import { CachePurgeService } from "../cache-purge.service"
import { JurisdictionsService } from "../../jurisdictions/services/jurisdictions.service"
import { EmailService } from "../../../src/email/email.service"
import { ConfigService } from "@nestjs/config"

/* eslint-disable @typescript-eslint/unbound-method */

// Cypress brings in Chai types for the global expect, but we want to use jest
// expect here so we need to re-declare it.
// see: https://github.com/cypress-io/cypress/issues/1319#issuecomment-593500345
declare const expect: jest.Expect

let service: ListingsService
const mockListings = [
  {
    id: "asdf1",
    units: [],
    multiselectQuestions: [],
    status: "closed",
    unitsSummarized: { byUnitTypeAndRent: [] },
  },
  {
    id: "asdf2",
    units: [],
    multiselectQuestions: [],
    status: "closed",
    unitsSummarized: { byUnitTypeAndRent: [] },
  },
  {
    id: "asdf3",
    units: [],
    multiselectQuestions: [],
    status: "closed",
    unitsSummarized: { byUnitTypeAndRent: [] },
  },
  {
    id: "asdf4",
    units: [],
    multiselectQuestions: [],
    status: "closed",
    unitsSummarized: { byUnitTypeAndRent: [] },
  },
  {
    id: "asdf5",
    units: [],
    multiselectQuestions: [],
    status: "closed",
    unitsSummarized: { byUnitTypeAndRent: [] },
  },
  {
    id: "asdf6",
    units: [],
    multiselectQuestions: [],
    status: "closed",
    unitsSummarized: { byUnitTypeAndRent: [] },
  },
  {
    id: "asdf7",
    units: [],
    multiselectQuestions: [],
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
  addGroupBy: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  offset: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  getParameters: jest.fn().mockReturnValue({ param1: "param1value" }),
  getQuery: jest.fn().mockReturnValue("innerQuery"),
  getCount: jest.fn().mockReturnValue(7),
  addFilters: ListingsQueryBuilder.prototype.addFilters,
  addOrderConditions: ListingsQueryBuilder.prototype.addOrderConditions,
  addSearchByListingNameCondition: ListingsQueryBuilder.prototype.addOrderConditions,
  paginate: ListingsQueryBuilder.prototype.paginate,
}
const mockQueryBuilder = {
  select: jest.fn().mockReturnThis(),
  leftJoin: jest.fn().mockReturnThis(),
  leftJoinAndSelect: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  setParameters: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  addOrderBy: jest.fn().mockReturnThis(),
  getMany: jest.fn().mockReturnValue(mockListings),
  offset: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  addFilters: ListingsQueryBuilder.prototype.addFilters,
  addOrderConditions: ListingsQueryBuilder.prototype.addOrderConditions,
  addSearchByListingNameCondition: ListingsQueryBuilder.prototype.addOrderConditions,
  paginate: ListingsQueryBuilder.prototype.paginate,
  addInnerFilteredQuery: ListingsQueryBuilder.prototype.addInnerFilteredQuery,
  getManyPaginated: ListingsQueryBuilder.prototype.getManyPaginated,
  getOne: jest.fn().mockReturnValue({ id: "asdf1", units: [] }),
}
const mockListingsRepo = {
  createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  count: jest.fn().mockReturnValue(100),
  save: jest.fn(),
}

const mockUserRepo = {
  findOne: jest.fn(),
  save: jest.fn(),
  createQueryBuilder: jest.fn(),
  findByEmail: jest.fn(),
  findByResetToken: jest.fn(),
}

describe("ListingsService", () => {
  beforeEach(async () => {
    process.env.APP_SECRET = "SECRET"
    process.env.EMAIL_API_KEY = "SG.KEY"
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListingsService,
        CachePurgeService,
        {
          provide: ApplicationFlaggedSetsService,
          useValue: { scheduleAfsProcessing: jest.fn() },
        },
        AuthzService,
        {
          provide: getRepositoryToken(Listing),
          useValue: mockListingsRepo,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepo,
        },
        {
          provide: getRepositoryToken(AmiChart),
          useValue: jest.fn(),
        },
        {
          provide: HttpService,
          useValue: jest.fn(),
        },
        {
          provide: TranslationsService,
          useValue: { translateListing: jest.fn() },
        },
        {
          provide: UserService,
          useValue: {
            getJurisdiction: jest.fn(),
          },
        },
        {
          provide: JurisdictionsService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: EmailService,
          useValue: {
            requestApproval: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn() },
        },
      ],
    }).compile()

    service = await module.resolve(ListingsService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  describe("getListingsList", () => {
    it("should not add a WHERE clause if no filters are applied", async () => {
      jest
        .spyOn(service, "createQueryBuilder")
        .mockReturnValueOnce((mockInnerQueryBuilder as unknown) as ListingsQueryBuilder)
      jest
        .spyOn(service, "createQueryBuilder")
        .mockReturnValueOnce((mockQueryBuilder as unknown) as ListingsQueryBuilder)

      const listings = await service.list({})

      expect(listings.items).toEqual(mockListings)
      expect(mockInnerQueryBuilder.andWhere).toHaveBeenCalledTimes(0)
    })

    it("should add a WHERE clause if the neighborhood filter is applied", async () => {
      jest
        .spyOn(service, "createQueryBuilder")
        .mockReturnValueOnce((mockInnerQueryBuilder as unknown) as ListingsQueryBuilder)
      jest
        .spyOn(service, "createQueryBuilder")
        .mockReturnValueOnce((mockQueryBuilder as unknown) as ListingsQueryBuilder)
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
        "(LOWER(CAST(listings.neighborhood as text)) = LOWER(:neighborhood_0))",
        {
          neighborhood_0: expectedNeighborhood,
        }
      )
    })

    it("should support filters with comma-separated arrays", async () => {
      jest
        .spyOn(service, "createQueryBuilder")
        .mockReturnValueOnce((mockInnerQueryBuilder as unknown) as ListingsQueryBuilder)
      jest
        .spyOn(service, "createQueryBuilder")
        .mockReturnValueOnce((mockQueryBuilder as unknown) as ListingsQueryBuilder)
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
        "(LOWER(CAST(listings.neighborhood as text)) IN (:...neighborhood_0))",
        {
          neighborhood_0: expectedNeighborhoodArray,
        }
      )
    })

    it("should throw an exception if an unsupported filter is used", async () => {
      jest
        .spyOn(service, "createQueryBuilder")
        .mockReturnValueOnce((mockInnerQueryBuilder as unknown) as ListingsQueryBuilder)

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
      jest
        .spyOn(service, "createQueryBuilder")
        .mockReturnValueOnce((mockInnerQueryBuilder as unknown) as ListingsQueryBuilder)

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
      jest
        .spyOn(service, "createQueryBuilder")
        .mockReturnValueOnce((mockInnerQueryBuilder as unknown) as ListingsQueryBuilder)
      jest
        .spyOn(service, "createQueryBuilder")
        .mockReturnValueOnce((mockQueryBuilder as unknown) as ListingsQueryBuilder)

      // Empty params (no pagination) -> no limit/offset
      const params = {}
      const listings = await service.list(params)

      expect(listings.items).toEqual(mockListings)
      expect(mockInnerQueryBuilder.limit).toHaveBeenCalledTimes(0)
      expect(mockInnerQueryBuilder.offset).toHaveBeenCalledTimes(0)
    })

    it("should not call limit() and offset() if incomplete pagination params are specified", async () => {
      jest
        .spyOn(service, "createQueryBuilder")
        .mockReturnValueOnce((mockInnerQueryBuilder as unknown) as ListingsQueryBuilder)
      jest
        .spyOn(service, "createQueryBuilder")
        .mockReturnValueOnce((mockQueryBuilder as unknown) as ListingsQueryBuilder)

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
      jest
        .spyOn(service, "createQueryBuilder")
        .mockReturnValueOnce((mockInnerQueryBuilder as unknown) as ListingsQueryBuilder)
      jest
        .spyOn(service, "createQueryBuilder")
        .mockReturnValueOnce((mockQueryBuilder as unknown) as ListingsQueryBuilder)
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
      jest
        .spyOn(service, "createQueryBuilder")
        .mockReturnValueOnce((mockInnerQueryBuilder as unknown) as ListingsQueryBuilder)
      jest
        .spyOn(service, "createQueryBuilder")
        .mockReturnValueOnce((mockQueryBuilder as unknown) as ListingsQueryBuilder)

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
    it("orders by the orderBy param (when set)", async () => {
      jest
        .spyOn(service, "createQueryBuilder")
        .mockReturnValueOnce((mockInnerQueryBuilder as unknown) as ListingsQueryBuilder)
      jest
        .spyOn(service, "createQueryBuilder")
        .mockReturnValueOnce((mockQueryBuilder as unknown) as ListingsQueryBuilder)

      await service.list({
        orderBy: [OrderByFieldsEnum.mostRecentlyUpdated],
        orderDir: [OrderParam.DESC],
      })

      expect(mockInnerQueryBuilder.addOrderBy).toHaveBeenCalledTimes(2)
      expect(mockInnerQueryBuilder.addOrderBy).toHaveBeenCalledWith(
        "listings.updated_at",
        "DESC",
        undefined
      )

      expect(mockQueryBuilder.addOrderBy).toHaveBeenCalledTimes(1)
      expect(mockQueryBuilder.addOrderBy).toHaveBeenCalledWith(
        "listings.updated_at",
        "DESC",
        undefined
      )

      // Verify that the full query is still also ordered by the number of bedrooms
      // (or max_occupancy) at the unit level.
      expect(mockQueryBuilder.addOrderBy).toHaveBeenCalledTimes(1)
      expect(mockQueryBuilder.addOrderBy).toHaveBeenCalledWith(
        "listings.updated_at",
        "DESC",
        undefined
      )
    })
  })
})
