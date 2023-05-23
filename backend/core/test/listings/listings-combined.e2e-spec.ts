import { HttpModule } from "@nestjs/axios"
import { Test } from "@nestjs/testing"
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm"
import supertest from "supertest"
import { ListingsModule } from "../../src/listings/listings.module"
import { applicationSetup } from "../../src/app.module"
import { getUserAccessToken } from "../utils/get-user-access-token"
import { setAuthorization } from "../utils/set-authorization-helper"
import { AssetsModule } from "../../src/assets/assets.module"
import { ApplicationMethodsModule } from "../../src/application-methods/applications-methods.module"
import { PaperApplicationsModule } from "../../src/paper-applications/paper-applications.module"
import qs from "qs"
import { MultiselectQuestion } from "../../src//multiselect-question/entities/multiselect-question.entity"
import { Repository } from "typeorm"
import { INestApplication } from "@nestjs/common"
import { Jurisdiction } from "../../src/jurisdictions/entities/jurisdiction.entity"
import { makeTestListing } from "../utils/make-test-listing"

// eslint-disable-next-line @typescript-eslint/no-var-requires
import dbOptions from "../../ormconfig.test"
import { getExternalListingSeedData } from "../../src/seeder/seeds/listings/external-listings-seed"

import cookieParser from "cookie-parser"
import { UnitDto } from "../../src/units/dto/unit.dto"

// Cypress brings in Chai types for the global expect, but we want to use jest
// expect here so we need to re-declare it.
// see: https://github.com/cypress-io/cypress/issues/1319#issuecomment-593500345
declare const expect: jest.Expect
jest.setTimeout(30000)

// REMOVE_WHEN_EXTERNAL_NOT_NEEDED
describe("CombinedListings", () => {
  let app: INestApplication
  let adminAccessToken: string
  let jurisdictionsRepository: Repository<Jurisdiction>

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(dbOptions),
        TypeOrmModule.forFeature([Jurisdiction]),
        ListingsModule,
        AssetsModule,
        ApplicationMethodsModule,
        PaperApplicationsModule,
        TypeOrmModule.forFeature([MultiselectQuestion]),
        HttpModule,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    app = applicationSetup(app)
    app.use(cookieParser())
    await app.init()
    adminAccessToken = await getUserAccessToken(app, "admin@example.com", "abcdef")
    jurisdictionsRepository = moduleRef.get<Repository<Jurisdiction>>(
      getRepositoryToken(Jurisdiction)
    )
  })

  describe("/listings/combined", () => {
    it("should return all listings", async () => {
      const res = await supertest(app.getHttpServer()).get("/listings/combined").expect(200)
      expect(res.body.items.map((listing) => listing.id).length).toBeGreaterThan(0)
    })

    it("should return the first page of paginated listings", async () => {
      // Make the limit 1 less than the full number of listings, so that the first page contains all
      // but the last listing.
      const page = "1"
      // This is the number of listings in ../../src/seed.ts minus 1
      const limit = 15
      const params = "/?page=" + page + "&limit=" + limit.toString()
      const res = await supertest(app.getHttpServer())
        .get("/listings/combined" + params)
        .expect(200)
      expect(res.body.items.length).toEqual(limit)
    })

    it("should return the last page of paginated listings", async () => {
      // Make the limit 1 less than the full number of listings, so that the second page contains
      // only one listing.
      // query to get max number of listings
      let queryParams = {
        limit: 1,
        page: 1,
        view: "base",
      }
      let query = qs.stringify(queryParams)
      let res = await supertest(app.getHttpServer()).get(`/listings/combined?${query}`).expect(200)
      const totalItems = res.body.meta.totalItems

      queryParams = {
        limit: totalItems - 1,
        page: 2,
        view: "base",
      }
      query = qs.stringify(queryParams)
      res = await supertest(app.getHttpServer()).get(`/listings/combined?${query}`).expect(200)
      expect(res.body.items.length).toEqual(1)
    })

    it("should return listings with matching zipcodes", async () => {
      const queryParams = {
        limit: "all",
        filter: [
          {
            $comparison: "IN",
            zipcode: "94621,94404",
          },
        ],
        view: "base",
      }
      const query = qs.stringify(queryParams)
      await supertest(app.getHttpServer()).get(`/listings/combined?${query}`).expect(200)
    })

    it("should have listings associated with the Bay Area", async () => {
      const jurisdictions = await jurisdictionsRepository.find()
      const bayArea = jurisdictions.find((jurisdiction) => jurisdiction.name === "Bay Area")
      const queryParamsOnlyBayArea = {
        limit: "all",
        view: "base",
        filter: [
          {
            $comparison: "=",
            jurisdiction: bayArea.id,
          },
        ],
      }
      const resBayArea = await supertest(app.getHttpServer())
        .get(`/listings/combined?${qs.stringify(queryParamsOnlyBayArea)}`)
        .expect(200)
      expect(resBayArea.body.items.length).not.toBe(0)
    })

    it("defaults to sorting listings by applicationDueDate", async () => {
      const res = await supertest(app.getHttpServer())
        .get(`/listings/combined?limit=all`)
        .expect(200)
      const listings = res.body.items

      // start at the beginning of the epoch
      let lastDueDate = new Date(0)
      let expectNull = false

      listings.forEach((listing) => {
        if (expectNull) {
          expect(listing.applicationDueDate).toBeNull()
        } else {
          // if not null, compare with last date
          if (listing.applicationDueDate != null) {
            const listingDate = new Date(listing.applicationDueDate)

            expect(listingDate.getTime()).toBeGreaterThanOrEqual(lastDueDate.getTime())

            lastDueDate = listingDate
          } else if (expectNull == false) {
            // if null, flag that all subsequent must be as well
            expectNull = true
          }
        }
      })
    })

    it("sorts listings by most recently updated when that orderBy param is set", async () => {
      const res = await supertest(app.getHttpServer())
        .get(`/listings/combined?orderBy[0]=mostRecentlyUpdated&orderDir[0]=ASC&limit=all`)
        .expect(200)

      // start at the beginning of the epoch
      let lastTime = new Date(0)
      const listings = res.body.items

      listings.forEach((listing) => {
        const listingDate = new Date(listing.updatedAt)

        expect(listingDate.getTime()).toBeGreaterThanOrEqual(lastTime.getTime())

        lastTime = listingDate
      })
    })

    it("fails if orderBy param doesn't conform to one of the enum values", async () => {
      await supertest(app.getHttpServer())
        .get(`/listings/combined?orderBy=notAValidOrderByParam`)
        .expect(400)
    })

    it("sorts results within a page, and across sequential pages", async () => {
      // Get the first page of 5 results.
      const firstPage = await supertest(app.getHttpServer())
        .get(`/listings/combined?orderBy[0]=mostRecentlyUpdated&orderDir[0]=DESC&limit=5&page=1`)
        .expect(200)

      // Verify that listings on the first page are ordered from most to least recently updated.
      for (let i = 0; i < 4; ++i) {
        const currentUpdatedAt = new Date(firstPage.body.items[i].updatedAt)
        const nextUpdatedAt = new Date(firstPage.body.items[i + 1].updatedAt)

        // Verify that each listing's updatedAt timestamp is more recent than the next listing's.
        expect(currentUpdatedAt.getTime()).toBeGreaterThan(nextUpdatedAt.getTime())
      }

      const lastListingOnFirstPageUpdateTimestamp = new Date(firstPage.body.items[4].updatedAt)

      // Get the second page of 5 results
      const secondPage = await supertest(app.getHttpServer())
        .get(`/listings/combined?orderBy[0]=mostRecentlyUpdated&orderDir[0]=DESC&limit=5&page=2`)
        .expect(200)

      // Verify that each of the listings on the second page was less recently updated than the last
      // first-page listing.
      for (const secondPageListing of secondPage.body.items) {
        const secondPageListingUpdateTimestamp = new Date(secondPageListing.updatedAt)
        expect(lastListingOnFirstPageUpdateTimestamp.getTime()).toBeGreaterThan(
          secondPageListingUpdateTimestamp.getTime()
        )
      }
    })

    it("should find listing by search", async () => {
      const anyJurisdiction = (await jurisdictionsRepository.find({ take: 1 }))[0]
      const newListingCreateDto = makeTestListing(anyJurisdiction.id)

      // must be different than the value in Listing test
      const newListingName = "combined-random-name"
      newListingCreateDto.name = newListingName

      let listingsSearchResponse = await supertest(app.getHttpServer())
        .get(`/listings/combined?search=combined`)
        .expect(200)

      expect(listingsSearchResponse.body.items.length).toBe(0)

      // post to local listings endpoint, not combined
      const listingResponse = await supertest(app.getHttpServer())
        .post(`/listings`)
        .send(newListingCreateDto)
        .set(...setAuthorization(adminAccessToken))
      expect(listingResponse.body.name).toBe(newListingName)

      listingsSearchResponse = await supertest(app.getHttpServer())
        .get(`/listings/combined`)
        .expect(200)
      expect(listingsSearchResponse.body.items.length).toBeGreaterThan(1)

      listingsSearchResponse = await supertest(app.getHttpServer())
        .get(`/listings/combined?search=combined`)
        .expect(200)

      expect(listingsSearchResponse.body.items.length).toBe(1)
      expect(listingsSearchResponse.body.items[0].name).toBe(newListingName)
    })

    it("should not be marked as external when created", async () => {
      const anyJurisdiction = (await jurisdictionsRepository.find({ take: 1 }))[0]
      const newListingCreateDto = makeTestListing(anyJurisdiction.id)

      newListingCreateDto.name = "is-external-test"
      newListingCreateDto.isExternal = true // set explicitly to verify

      // post to local listings endpoint, not combined
      const listingResponse = await supertest(app.getHttpServer())
        .post(`/listings`)
        .send(newListingCreateDto)
        .set(...setAuthorization(adminAccessToken))
      expect(listingResponse.body.isExternal).toBe(false)
    })

    it("properly applies isExternal filter", async () => {
      const queryParams = {
        // we're only interested in the totals, so no need to fetch more than 1
        limit: 1,
        page: 1,
        view: "base",
      }
      const localQuery = qs.stringify(queryParams)
      const localRes = await supertest(app.getHttpServer())
        .get(`/listings?${localQuery}`)
        .expect(200)

      const localCount = localRes.body.meta.totalItems

      // fetch internal only
      const combinedLocalQuery = qs.stringify({
        filter: [{ $comparison: "=", isExternal: false }],
      })
      const combinedLocalRes = await supertest(app.getHttpServer())
        .get(`/listings/combined?${combinedLocalQuery}`)
        .expect(200)

      const combinedLocalCount = combinedLocalRes.body.meta.totalItems

      // there should be the same number of internal listings pulled from both endpoints
      expect(localCount).toBe(combinedLocalCount)

      // fetch external only
      const combinedExternalQuery = qs.stringify({
        filter: [{ $comparison: "=", isExternal: true }],
      })
      const combinedExternalRes = await supertest(app.getHttpServer())
        .get(`/listings/combined?${combinedExternalQuery}`)
        .expect(200)

      const combinedExternalCount = combinedExternalRes.body.meta.totalItems

      // fetch all combined listings
      const combinedAllQuery = localQuery // same query as before
      const combinedAllRes = await supertest(app.getHttpServer())
        .get(`/listings/combined?${combinedAllQuery}`)
        .expect(200)

      const combinedAllCount = combinedAllRes.body.meta.totalItems
      expect(combinedExternalCount).toBe(combinedAllCount - combinedLocalCount)
    })

    it("returns the same object structure as /listings?view=base", async () => {
      const queryParams = {
        limit: "all",
        view: "base", // /listings/combined always returns view=base

        // we have to sort by name to ensure consistency
        // application_due_date is identical for some seed listings
        orderBy: ["name", "mostRecentlyUpdated"],
        orderDir: ["DESC", "DESC"],
      }
      const localQuery = qs.stringify(queryParams)
      const localRes = await supertest(app.getHttpServer())
        .get(`/listings?${localQuery}`)
        .expect(200)

      // make sure we are only comparing local listings
      const combinedQuery = qs.stringify({
        ...queryParams,
        filter: [{ $comparison: "=", isExternal: false }],
      })
      const combinedRes = await supertest(app.getHttpServer())
        .get(`/listings/combined?${combinedQuery}`)
        .expect(200)

      expect(localRes.body.items.length).toBe(combinedRes.body.items.length)

      // sort units by id
      const sortUnits = (a, b) => {
        return a.id.localeCompare(b.id)
      }

      // sort images by id
      const sortImages = (a, b) => {
        return a.image.id.localeCompare(b.image.id)
      }

      // sort questions by id
      const sortQuestions = (a, b) => {
        return a.multiselectQuestion.id.localeCompare(b.multiselectQuestion.id)
      }

      combinedRes.body.items.forEach((result, idx) => {
        const localListing = localRes.body.items[idx]

        // ignore props on result from combined endpoint
        delete result.showWaitlist // this is a generated value

        // sort units
        result.units.sort(sortUnits)
        localListing.units.sort(sortUnits)

        // sort images
        result.images.sort(sortImages)
        localListing.images.sort(sortImages)

        // sort multiselect questions
        result.listingMultiselectQuestions.sort(sortQuestions)
        localListing.listingMultiselectQuestions.sort(sortQuestions)

        /*
          Ignore unit summaries

          They're generated by the same code and there isn't a good way to sort
          them consistently for comparison
        */
        delete result.unitsSummarized
        delete localListing.unitsSummarized

        // these fields do not exist on the base view but are returned by combined
        // we include them because they are required for filtering
        result.units.forEach((unit) => {
          delete unit.amiPercentage
          delete unit.annualIncomeMax
          delete unit.annualIncomeMin
          delete unit.numBathrooms
          delete unit.numBedrooms
        })

        expect(localListing).toEqual(result)
      })
    })

    it("returns the same object structure as seed data", async () => {
      // get external listings only
      const getExternalQuery = qs.stringify({
        limit: "all",
        filter: [{ $comparison: "=", isExternal: true }],
      })
      const getExternalRes = await supertest(app.getHttpServer())
        .get(`/listings/combined?${getExternalQuery}`)
        .expect(200)

      const externalCount = getExternalRes.body.meta.totalItems
      const seedData = getExternalListingSeedData()

      // the number of external listings should match seed data
      expect(seedData.length).toBe(externalCount)

      // sort listings and seed data by id
      const sortListings = (a, b) => {
        return a.id.localeCompare(b.id)
      }

      const listings = getExternalRes.body.items
      listings.sort(sortListings)
      seedData.sort(sortListings)

      getExternalRes.body.items.forEach((listing, idx) => {
        const seed = seedData[idx]

        // remove some fields
        ;[
          // ignore dates because they are dynamically generated by the seed
          "applicationOpenDate",
          "applicationDueDate",
          "publishedAt",
          "updatedAt",
          "closedAt",
          "lastApplicationUpdateAt",

          // these are dynamically generated by the listing
          "unitsSummarized",
          "countyCode",
          "showWaitlist",

          // this is only set on the view
          "isExternal",

          // these are only used for filtering in the DB side
          "minMonthlyRent",
          "maxMonthlyRent",
          "minBedrooms",
          "maxBedrooms",
          "minBathrooms",
          "maxBathrooms",
          "minMonthlyIncomeMin",
          "maxMonthlyIncomeMin",
          "minOccupancy",
          "maxOccupancy",
          "minSqFeet",
          "maxSqFeet",
          "lowestFloor",
          "highestFloor",

          // not included in base listing view
          "householdSizeMin",
          "householdSizeMax",
          "isWaitlistOpen",
          "reservedCommunityTypeName",
        ].forEach((field) => {
          delete listing[field]
          delete seed[field]
        })

        // serde should be consistent, so shouldn't need to sort subitems

        expect(listing).toEqual(seed)
      })
    })

    it("should properly apply county filter", async () => {
      // this fictional county is set in external listings seed
      const countyName = "San Alameda"

      // The county filter only takes an array and only supports inclusive searches, not exclusive
      const equalsFilter = [{ $comparison: "IN", counties: [countyName] }]

      // check equality
      const equalsQuery = qs.stringify({
        limit: "all",
        filter: equalsFilter,
      })

      const equalRes = await supertest(app.getHttpServer())
        .get(`/listings/combined?${equalsQuery}`)
        .expect(200)

      // all values should match filter
      equalRes.body.items.forEach((listing) => {
        expect(listing.buildingAddress.county).toBe(countyName)
      })
    })

    it("should properly apply city filter", async () => {
      // this fictional city is set in external listings seed
      const cityName = "Anytown"
      const equalsFilter = [{ $comparison: "=", city: cityName }]
      const notEqualsFilter = [{ $comparison: "<>", city: cityName }]

      // check equality
      const equalsQuery = qs.stringify({
        limit: "all",
        filter: equalsFilter,
      })

      const equalRes = await supertest(app.getHttpServer())
        .get(`/listings/combined?${equalsQuery}`)
        .expect(200)

      // all values should match filter
      equalRes.body.items.forEach((listing) => {
        expect(listing.buildingAddress.city).toBe(cityName)
      })

      // check inequality
      const notEqualsQuery = qs.stringify({
        limit: "all",
        filter: notEqualsFilter,
      })

      const notEqualRes = await supertest(app.getHttpServer())
        .get(`/listings/combined?${notEqualsQuery}`)
        .expect(200)

      // no values should match filter
      notEqualRes.body.items.forEach((listing) => {
        expect(listing.buildingAddress.city).not.toBe(cityName)
      })
    })

    it("should properly apply unit filters", async () => {
      const tests: Array<{
        // an identifier for the test
        name: string
        // test data
        data: Record<string, number>
        // a function for generating filters based on test data
        filters: (data: Record<string, number>) => Array<object>
        // a function for verifying that a unit matches the filter criteria
        match: (unit: UnitDto, data: Record<string, number>) => boolean
      }> = [
        {
          name: "unit has at least 2 bedrooms",
          data: {
            minBedrooms: 2,
          },
          filters: (data) => [{ $comparison: ">=", numBedrooms: data.minBedrooms }],
          match: (unit, data) => unit.numBedrooms >= data.minBedrooms,
        },
        {
          name: "unit has at least 2 bathrooms",
          data: {
            minBathrooms: 2,
          },
          filters: (data) => [{ $comparison: ">=", numBathrooms: data.minBathrooms }],
          match: (unit, data) => unit.numBathrooms >= data.minBathrooms,
        },
        {
          name: "unit rent is less <= $2000/month",
          data: {
            maxRent: 2000,
          },
          filters: (data) => [{ $comparison: "<=", monthlyRent: data.maxRent }],
          match: (unit, data) => {
            // monthlyRent is still a string value and needs to be converted
            const parsedRent = parseInt(unit.monthlyRent)
            // If not a valid number, treat it as a zero
            const numMonthlyRent = isNaN(parsedRent) ? 0 : parsedRent

            return numMonthlyRent <= data.maxRent
          },
        },
        {
          name: "unit has at least 2 bedrooms and 1 bath",
          data: {
            minBedrooms: 2,
            minBathrooms: 1,
          },
          filters: (data) => [
            { $comparison: ">=", numBedrooms: data.minBedrooms },
            { $comparison: ">=", numBathrooms: data.minBathrooms },
          ],
          match: (unit, data) => {
            return unit.numBathrooms >= data.minBathrooms && unit.numBedrooms >= data.minBedrooms
          },
        },
        {
          name: "unit has at least 2 bedrooms for under $1400/month",
          data: {
            minBedrooms: 2,
            maxRent: 1400,
          },
          filters: (data) => [
            { $comparison: ">=", numBedrooms: data.minBedrooms },
            { $comparison: "<=", monthlyRent: data.maxRent },
          ],
          match: (unit, data) => {
            // monthlyRent is still a string value and needs to be converted
            const parsedRent = parseInt(unit.monthlyRent)
            // If not a valid number, treat it as a zero
            const numMonthlyRent = isNaN(parsedRent) ? 0 : parsedRent

            return numMonthlyRent <= data.maxRent && unit.numBedrooms >= data.minBedrooms
          },
        },
      ]

      // Run each test and validate results
      for (const test of tests) {
        const query = qs.stringify({
          limit: "all",
          filter: test.filters(test.data),
        })

        const res = await supertest(app.getHttpServer())
          .get(`/listings/combined?${query}`)
          .expect(200)

        // We need at least one result returned, otherwise the test isn't very useful
        expect(res.body.items.length).toBeGreaterThan(0)

        // at least one unit should match the bathroom requirement
        res.body.items.forEach((listing) => {
          // assume no matches
          let isMatch = false

          // It's only a match if all values are as expected
          listing.units.forEach((unit) => {
            if (test.match(unit, test.data)) {
              isMatch = true
            }
          })

          // If we don't have any matches, print out test name for debugging
          if (!isMatch) {
            console.log(test.name)
          }

          expect(isMatch).toBe(true)
        })
      }
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await app.close()
  })
})
