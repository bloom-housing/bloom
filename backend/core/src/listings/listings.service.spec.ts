import { Test, TestingModule } from "@nestjs/testing"
import { ListingsService } from "./listings.service"
import { getRepositoryToken } from "@nestjs/typeorm"
import { Listing } from "./entities/listing.entity"

// Cypress brings in Chai types for the global expect, but we want to use jest
// expect here so we need to re-declare it.
// see: https://github.com/cypress-io/cypress/issues/1319#issuecomment-593500345
declare const expect: jest.Expect

let service: ListingsService
const mockListings = [{ id: "asdf1" }, { id: "asdf2" }]
const mockQueryBuilder = {
  leftJoinAndSelect: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  getMany: jest.fn().mockReturnValue(mockListings),
}
const mockListingsRepo = { createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder) }

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
      const listings = await service.list({})

      expect(listings).toEqual(mockListings)
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledTimes(0)
    })

    it("should add a WHERE clause if the neighborhood filter is applied", async () => {
      const expectedNeighborhood = "Fox Creek"

      const listings = await service.list({ neighborhood: expectedNeighborhood })

      expect(listings).toEqual(mockListings)
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        "property.neighborhood = :neighborhood",
        {
          neighborhood: expectedNeighborhood,
        }
      )
    })
  })
})
