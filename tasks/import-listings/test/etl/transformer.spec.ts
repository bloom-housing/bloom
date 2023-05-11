import { Transformer } from "../../src/etl"
import {
  defaultMap,
  getUnitPropMaxValue,
  getUnitPropMinValue,
  jsonOrNull,
} from "../../src/etl/transform/map"
import { Jurisdiction, Listing } from "../../src/types"

describe("Transformer", () => {
  it("treats a string value as a property name", () => {
    const transformer = new Transformer({
      value: "name",
    })
    transformer.getLogger().printLogs = false

    const listing = new Listing()
    listing.name = "some-test-value"

    const result = transformer.mapListingToRow(listing)

    expect(result).toHaveProperty("value", listing.name)
  })

  it("calls a function to get a value", () => {
    const transformer = new Transformer({
      combined_id: (listing: Listing) => listing.id + "-" + listing.name,
    })
    transformer.getLogger().printLogs = false

    const listing = new Listing()
    listing.id = "listing-id"
    listing.name = "listing-name"

    const result = transformer.mapListingToRow(listing)

    expect(result).toHaveProperty("combined_id", listing.id + "-" + listing.name)
  })

  it("should get valid json values", () => {
    const transformer = new Transformer({
      obj: (listing: Listing) => jsonOrNull(listing.assets),
      null: (listing: Listing) => jsonOrNull(listing.unitsSummarized),
      bool: (listing: Listing) => jsonOrNull(listing.isWaitListOpen),
      num: (listing: Listing) => jsonOrNull(listing.unitsAvailable),
    })
    transformer.getLogger().printLogs = false

    const listing = new Listing()
    listing.unitsSummarized = null
    listing.isWaitListOpen = true
    listing.unitsAvailable = 3
    listing.assets = [
      {
        id: "1",
      },
    ]

    const result = transformer.mapListingToRow(listing)

    expect(result).toHaveProperty("obj", JSON.stringify(listing.assets))
    expect(result).toHaveProperty("null", "null")
    expect(result).toHaveProperty("bool", "true")
    expect(result).toHaveProperty("num", "3")
  })

  it("maps all results", () => {
    const transformer = new Transformer({
      name: "name",
    })
    transformer.getLogger().printLogs = false

    const listings = ["test1", "test2", "test3"].map((name) => {
      const listing = new Listing()
      listing.name = name
      return listing
    })

    const result = transformer.mapAll(listings)

    expect(result).toHaveLength(3)
  })

  it("should have a valid default map", () => {
    const transformer = new Transformer(defaultMap)

    // use a base object like what would be received from the API response
    const listingData = {
      id: "6239c2ee-9f1c-4dcd-83a9-c2c4d6f1631f",
      assets: [
        {
          fileId:
            "https://regional-dahlia-staging.s3-us-west-1.amazonaws.com/listings/triton/thetriton.png",
          label: "building",
        },
      ],
      unitsAvailable: 2,
      applicationDueDate: "2023-04-12T22:52:06.244Z",
      applicationOpenDate: "2023-04-02T22:52:06.244Z",
      name: "[doorway] Test: Default, No Preferences",
      waitlistCurrentSize: null,
      waitlistMaxSize: null,
      status: "active",
      reviewOrderType: "lottery",
      showWaitlist: false,
      publishedAt: "2023-04-07T21:52:06.206Z",
      closedAt: null,
      images: [
        {
          ordinal: 1,
          image: {
            fileId:
              "https://regional-dahlia-staging.s3-us-west-1.amazonaws.com/listings/triton/thetriton.png",
            label: "building",
            id: "0aea3036-cab5-4cfd-8c2d-856e5a679559",
          },
        },
      ],
      jurisdiction: {
        id: "804e0977-0f80-45e9-805d-28f6ec616ebb",
        name: "Bay Area",
      },
      reservedCommunityType: null,
      units: [
        {
          id: "6e0d95b9-e2ee-4eb3-9b1f-2e87cae1b0ef",
          monthlyIncomeMin: "3468",
          floor: 2,
          maxOccupancy: 5,
          minOccupancy: 2,
          numBedrooms: 3,
          numBathrooms: 2,
          monthlyRent: "1387",
          sqFeet: "748",
          monthlyRentAsPercentOfIncome: null,
          unitType: {
            name: "twoBdrm",
            id: "0f7d5a7c-3973-4300-a3ce-de04fdfae4c7",
          },
        },
        {
          id: "ee4afbaa-0ccf-4c1b-975a-732bd51d8992",
          monthlyIncomeMin: "3014",
          floor: 1,
          maxOccupancy: 3,
          minOccupancy: 1,
          numBedrooms: 2,
          numBathrooms: 1,
          monthlyRent: "1219",
          sqFeet: "635",
          monthlyRentAsPercentOfIncome: null,
          unitType: {
            name: "oneBdrm",
            id: "dd73968a-e347-417c-8967-f3450176f4e2",
          },
        },
      ],
      buildingAddress: {
        city: "San Francisco",
        state: "CA",
        street: "548 Market Street",
        street2: "Suite #59930",
        zipCode: "94104",
        latitude: 37.789673,
        longitude: -122.40151,
      },
      urlSlug: "doorway_test_default_no_preferences_548_market_street_san_francisco_ca",
      countyCode: "Bay Area",
      features: null,
      utilities: null,
    }

    const listing = new Listing()

    // copy raw data into listing
    Object.keys(listingData).forEach((key) => {
      listing[key] = listingData[key]
    })

    const results = transformer.mapAll([listing])

    expect(results).toHaveLength(1)

    const result = results[0]

    // these are fields that directly map to object properties
    expect(result).toHaveProperty("id", listing.id)
    expect(result).toHaveProperty("units_available", listing.unitsAvailable)
    expect(result).toHaveProperty("application_due_date", listing.applicationDueDate)
    expect(result).toHaveProperty("name", listing.name)
    expect(result).toHaveProperty("waitlist_current_size", listing.waitlistCurrentSize)
    expect(result).toHaveProperty("waitlist_max_size", listing.waitlistMaxSize)
    expect(result).toHaveProperty("is_waitlist_open", listing.isWaitListOpen)
    expect(result).toHaveProperty("status", listing.status)
    expect(result).toHaveProperty("review_order_type", listing.reviewOrderType)
    expect(result).toHaveProperty("published_at", listing.publishedAt)
    expect(result).toHaveProperty("closed_at", listing.closedAt)
    expect(result).toHaveProperty("updated_at", listing.updatedAt)
    expect(result).toHaveProperty("neighborhood", listing.neighborhood)
    expect(result).toHaveProperty(
      "reserved_community_type_name",
      listing.reservedCommunityType?.name
    )
    expect(result).toHaveProperty("url_slug", listing.urlSlug)

    expect(result).toHaveProperty("min_monthly_rent", 1219)
    expect(result).toHaveProperty("max_monthly_rent", 1387)
    expect(result).toHaveProperty("min_bedrooms", listingData.units[1].numBedrooms)
    expect(result).toHaveProperty("max_bedrooms", listingData.units[0].numBedrooms)
    expect(result).toHaveProperty("min_bathrooms", listingData.units[1].numBathrooms)
    expect(result).toHaveProperty("max_bathrooms", listingData.units[0].numBathrooms)
    expect(result).toHaveProperty("min_monthly_income_min", 3014)
    expect(result).toHaveProperty("max_monthly_income_min", 3468)
    expect(result).toHaveProperty("min_occupancy", listingData.units[1].minOccupancy)
    expect(result).toHaveProperty("max_occupancy", listingData.units[0].maxOccupancy)
    expect(result).toHaveProperty("min_sq_feet", 635)
    expect(result).toHaveProperty("max_sq_feet", 748)
    expect(result).toHaveProperty("lowest_floor", listingData.units[1].floor)
    expect(result).toHaveProperty("highest_floor", listingData.units[0].floor)

    // these are complex types that are converted into JSON by defaultMap
    // we can assume that if the jsonOrNull tests above pass then the values here are as expected
    expect(result).toHaveProperty("assets")
    expect(result).toHaveProperty("units_summarized")
    expect(result).toHaveProperty("images")
    expect(result).toHaveProperty("multiselect_questions")
    expect(result).toHaveProperty("jurisdiction")
    expect(result).toHaveProperty("reserved_community_type")
    expect(result).toHaveProperty("units")
    expect(result).toHaveProperty("building_address")
    expect(result).toHaveProperty("features")
    expect(result).toHaveProperty("utilities")
  })

  it("should generate the correct county", () => {
    const transformer = new Transformer(defaultMap)
    transformer.getLogger().printLogs = false

    const tests = [
      {
        // specific to Alameda
        jurisdiction: "Alameda",
        expect: "Alameda",
      },
      {
        // specific to San Jose
        jurisdiction: "San Jose",
        expect: "Santa Clara",
      },
      {
        // specific to San Mateo
        jurisdiction: "San Mateo",
        expect: "San Mateo",
      },
      {
        // default behavior
        jurisdiction: "Detroit",
        expect: "Detroit",
      },
    ]

    // Create a set of listings with different jurisdictions
    const listings = tests.map((test) => {
      const listing = new Listing()
      const jurisdiction = new Jurisdiction()
      jurisdiction.name = test.jurisdiction
      listing.jurisdiction = jurisdiction
      listing.buildingAddress = { city: "" }
      return listing
    })

    const results = transformer.mapAll(listings)

    // Check that each mapped result contains a serialized address with the county set
    results.forEach((mapped, index) => {
      expect(JSON.parse(mapped.building_address as string)).toHaveProperty(
        "county",
        tests[index].expect
      )
    })
  })
})

describe("Mapping functions", () => {
  it("should return the highest value for a property", () => {
    const tests = [
      {
        // numeric values
        arr: [{ value: 1 }, { value: 10 }, { value: 100 }],
        expect: 100,
      },
      {
        // string values
        arr: [
          { value: "1" },
          { value: "123" }, // order shouldn't matter
          { value: "12" },
        ],
        expect: 123,
      },
      {
        // invalid values
        arr: [{ value: "" }, { value: "one" }, { value: " " }],
        expect: 0, // zero is the default value
      },
      {
        // missing values
        arr: [{ wrongName: 1 }],
        expect: 0, // zero is the default value
      },
      {
        // empty array
        arr: [],
        expect: 0, // zero is the default value
      },
    ]

    tests.forEach((test) => {
      expect(getUnitPropMaxValue(test.arr, "value")).toEqual(test.expect)
    })
  })

  it("should return the lowest value for a property", () => {
    const tests = [
      {
        // numeric values
        arr: [{ value: 1 }, { value: 10 }, { value: 100 }],
        expect: 1,
      },
      {
        // string values
        arr: [
          { value: "1" },
          { value: "123" }, // order shouldn't matter
          { value: "12" },
        ],
        expect: 1,
      },
      {
        // invalid values
        arr: [{ value: "" }, { value: "one" }, { value: " " }],
        expect: 0, // zero is the default value
      },
      {
        // missing values
        arr: [{ wrongName: 1 }],
        expect: 0, // zero is the default value
      },
      {
        // empty array
        arr: [],
        expect: 0, // zero is the default value
      },
    ]

    tests.forEach((test) => {
      expect(getUnitPropMinValue(test.arr, "value")).toEqual(test.expect)
    })
  })
})
