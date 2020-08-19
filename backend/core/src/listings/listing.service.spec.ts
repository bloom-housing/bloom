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
import { ListingTranslation } from "../entity/listing-translation.entity"

const loadListings = () =>
  listingsSeeds.map((listingDefinition) => {
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
    let jsonpath: string
    let languages: string[]
    let mockListings: Listing[]
    let translation: ListingTranslation
    const subject = () => service.list(jsonpath, languages)

    const addTranslation = (language) => {
      translation = new ListingTranslation()
      translation.accessibility = "Translated"
      translation.languageCode = language
      translation.listing = mockListings[0]
      mockListings[0].translations = [translation]
    }

    beforeEach(() => {
      mockListings = loadListings().map((listing) => {
        listing.translations = []
        return listing
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockQueryBuilder: any = {
        apply: () => mockQueryBuilder,
        leftJoinAndSelect: () => mockQueryBuilder,
        getMany: () => mockListings,
      }

      jest.spyOn(repo, "createQueryBuilder").mockImplementation(mockQueryBuilder)
    })

    const itShouldReturnAllListings = () => {
      it("Should return the correct number of listings", async () => {
        const { listings } = await subject()
        expect(listings.length).toEqual(mockListings.length)
      })
    }

    itShouldReturnAllListings()

    describe("with a language", () => {
      beforeEach(() => {
        languages = ["es"]
      })

      describe("that doesn't have a translation", () => {
        itShouldReturnAllListings()
      })

      describe("with a translation that matches", () => {
        beforeEach(() => addTranslation("es"))

        it("should translate the fields that are provided", async () => {
          const {
            listings: [listing],
          } = await subject()
          expect(listing.accessibility).toEqual(translation.accessibility)
        })

        it("should default to base values for fields not provided", async () => {
          const {
            listings: [listing],
          } = await subject()
          expect(listing.amenities).toEqual(mockListings[0].amenities)
          expect(listing.amenities).not.toEqual(translation.amenities)
        })

        it("should set the listings languageCode", async () => {
          const {
            listings: [listing],
          } = await subject()
          expect(listing.languageCode).toEqual(translation.languageCode)
        })
      })
    })

    describe("with multiple languages", () => {
      beforeEach(() => {
        languages = ["pt", "es"]
        addTranslation("es")
      })

      it("should translate using the first language that exists", async () => {
        const {
          listings: [listing],
        } = await subject()
        expect(listing.accessibility).toEqual(translation.accessibility)
      })

      describe("including english as the first language", () => {
        beforeEach(() => {
          languages = ["en", "es"]
        })
        it("should not translate fields", async () => {
          const {
            listings: [listing],
          } = await subject()
          expect(listing.accessibility).toEqual(mockListings[0].accessibility)
          expect(listing.accessibility).not.toEqual(translation.accessibility)
        })
      })
    })

    describe("with a locale code", () => {
      beforeEach(() => {
        languages = ["pt", "es-SP", "en"]
        addTranslation("es")
      })

      it("should translate if the base language matches", async () => {
        const {
          listings: [listing],
        } = await subject()
        expect(listing.accessibility).toEqual(translation.accessibility)
      })
    })
  })
})
