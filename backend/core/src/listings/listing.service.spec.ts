import { Test, TestingModule } from "@nestjs/testing"
import { ListingsService } from "./listings.service"
import { getRepositoryToken } from "@nestjs/typeorm"
import { Listing } from "../entity/listing.entity"
import { Repository } from "typeorm/index"
import {
  makeListing,
  makeRelation,
  RelationTypes,
} from "../seeder/listings-seeder/listings-seeder.service"
import listingsSeeds from "../../seeds.json"

const ALL_LISTINGS = listingsSeeds.map((listingDefinition) => {
  const [listing, relatedEntities] = makeListing(listingDefinition)
  for (const key in relatedEntities) {
    listing[key] = makeRelation(key as RelationTypes, listing, relatedEntities[key])
  }
  return listing
})

// Cypress brings in Chai types for the global expect, but we want to use jest
// expect here so we need to re-declare it.
// see: https://github.com/cypress-io/cypress/issues/1319#issuecomment-593500345
declare const expect: jest.Expect

describe("ListingService", () => {
  let service: ListingsService
  let repo: Repository<Listing>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListingsService,
        {
          provide: getRepositoryToken(Listing),
          useClass: Repository,
        },
      ],
    }).compile()

    repo = module.get(getRepositoryToken(Listing))
    service = module.get(ListingsService)
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  describe("list", () => {
    let jsonpath
    let languages
    const subject = () => service.list(jsonpath, languages)

    beforeEach(() => {
      const mockListings = ALL_LISTINGS.map((listing) => {
        listing.translations = []
        return listing
      })
      const mockQueryBuilder: any = {
        apply: () => mockQueryBuilder,
        leftJoinAndSelect: () => mockQueryBuilder,
        getMany: () => mockListings,
      }

      jest.spyOn(repo, "createQueryBuilder").mockImplementation(mockQueryBuilder)
    })

    it("Should return the correct number of listings", async () => {
      const { listings } = await subject()
      expect(listings.length).toEqual(ALL_LISTINGS.length)
    })
  })
})
