import axios from "axios"
import { Extractor } from "../../src/etl"

const urlInfo = {
  base: "https://base-url",
  path: "/path",
}

const jurisdictions = [
  {
    id: "d98fd25b-df6c-4f6a-b93f-bbd347b9da69",
    name: "External Jurisdiction 1",
  },
  {
    id: "bee730c3-31df-4026-8412-322a79bef8e1",
    name: "External Jurisdiction 2",
  },
]

const listings = [
  {
    id: "2dfca9a5-6b01-4683-be1c-e3fa0880800f",
    assets: [
      {
        fileId: "https://url.to/some/external/image.jpg",
        label: "building",
      },
    ],
    householdSizeMin: 1,
    householdSizeMax: 3,
    unitsAvailable: 2,
    applicationOpenDate: new Date().toDateString(),
    applicationDueDate: new Date().toDateString(),
    name: "Test: External Listing - Full",
    waitlistCurrentSize: 0,
    waitlistMaxSize: 5,
    isWaitlistOpen: false,
    status: "active",
    reviewOrderType: "lottery",
    publishedAt: new Date().toDateString(),
    updatedAt: new Date().toDateString(),
    lastApplicationUpdateAt: new Date().toDateString(),
    reservedCommunityTypeName: "senior62",
    urlSlug: "test_external_listing_full",
    images: [],
    listingMultiselectQuestions: [
      {
        ordinal: 1,
        multiselectQuestion: {
          id: "cc213d2b-6d4b-48a3-8177-b51932002099",
        },
      },
      {
        ordinal: 2,
        multiselectQuestion: {
          id: "64d292c4-8b14-4a35-8d1a-89839f4a6806",
        },
      },
    ],
    jurisdiction: jurisdictions[0],
    reservedCommunityType: {
      id: "8cf689ba-c820-4d61-a8ee-d76387a0e85a",
      name: "senior62",
    },
    units: [
      {
        monthlyIncomeMin: "1000.00",
        floor: 1,
        maxOccupancy: 3,
        minOccupancy: 1,
        monthlyRent: "1234.00",
        sqFeet: "1100",
        monthlyRentAsPercentOfIncome: null,
      },
      {
        monthlyIncomeMin: "2000.00",
        floor: 2,
        maxOccupancy: 5,
        minOccupancy: 2,
        monthlyRent: "5678.00",
        sqFeet: "1500",
        monthlyRentAsPercentOfIncome: null,
      },
    ],
    buildingAddress: {
      county: "San Alameda",
      city: "Anytown",
      street: "123 Sesame Street",
      zipCode: "90210",
      state: "CA",
      latitude: 37.7549632,
      longitude: -122.1968792,
    },
    features: {
      elevator: true,
      wheelchairRamp: false,
      serviceAnimalsAllowed: null,
      accessibleParking: true,
      parkingOnSite: false,
      inUnitWasherDryer: null,
      laundryInBuilding: true,
      barrierFreeEntrance: false,
      rollInShower: null,
      grabBars: true,
      heatingInUnit: false,
      acInUnit: null,
    },
    utilities: {
      water: true,
      gas: false,
      trash: null,
      sewer: true,
      electricity: false,
      cable: null,
      phone: true,
      internet: false,
    },
  },
  {
    id: "9beacfb5-9611-4e02-816f-89810b83d1ba",
    assets: [
      {
        fileId: "https://url.to/some/other/image.jpg",
        label: "building",
      },
    ],
    householdSizeMin: 1,
    householdSizeMax: 3,
    unitsAvailable: 0,
    applicationOpenDate: new Date().toDateString(),
    applicationDueDate: new Date().toDateString(),
    name: "Test: External Listing - Empty",
    waitlistCurrentSize: 0,
    waitlistMaxSize: 5,
    isWaitlistOpen: false,
    status: "active",
    reviewOrderType: "lottery",
    publishedAt: new Date().toDateString(),
    updatedAt: new Date().toDateString(),
    lastApplicationUpdateAt: new Date().toDateString(),
    reservedCommunityTypeName: null,
    urlSlug: "test_external_listing_empty",
    images: [],
    listingMultiselectQuestions: [],
    jurisdiction: jurisdictions[1],
    reservedCommunityType: null,
    units: [],
    buildingAddress: {
      county: "San Alameda",
      city: "Anytown",
      street: "123 Sesame Street",
      zipCode: "90210",
      state: "CA",
      latitude: 37.7549632,
      longitude: -122.1968792,
    },
    features: null,
    utilities: null,
  },
]

describe("Extractor", () => {
  jest.mock("axios")

  const mockAxios = jest.fn().mockReturnValue({
    get: jest.fn().mockImplementation((endpoint) => {
      // get the jurisdiction id from the endpoint url
      const regex =
        /\[jurisdiction\]=([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/
      const matches = endpoint.match(regex)
      const jurisdictionId = matches.length > 1 ? matches[1] : null

      // filter out the listings that match the jurisdictionId
      const endpointListings = jurisdictionId
        ? listings.filter((listing) => listing.jurisdiction.id == jurisdictionId)
        : []

      return Promise.resolve({
        data: { items: endpointListings },
        status: 200,
        statusText: "ok",
        headers: "",
        config: {},
      })
    }),
  })(
    // required for TS to be aware of mock methods/props
    axios as jest.Mocked<typeof axios>
  )

  beforeEach(() => {
    mockAxios.get.mockClear()
  })

  it("should generate the correct endpoint url", async () => {
    const jurisdiction = jurisdictions[0]
    const extractor = new Extractor(mockAxios, urlInfo)
    extractor.getLogger().printLogs = false

    await extractor.extract([jurisdiction])

    // only one jurisdiction
    expect(mockAxios.get).toHaveBeenCalledTimes(1)
    const endpoint = mockAxios.get.mock.lastCall[0]

    // should start with url
    expect(endpoint.startsWith(`${urlInfo.base}${urlInfo.path}`)).toBe(true)
    // and contain jurisdiction id
    expect(endpoint).toEqual(expect.stringContaining(jurisdiction.id))
  })

  it("should extract valid results", async () => {
    const extractor = new Extractor(mockAxios, urlInfo)
    extractor.getLogger().printLogs = false

    const results = await extractor.extract(jurisdictions)

    // get is called for each jurisdiction
    expect(mockAxios.get).toHaveBeenCalledTimes(jurisdictions.length)

    // all listings should be returned
    expect(results.length).toBe(listings.length)

    // sort listings and results to ensure consistent order
    const sortListings = (a, b) => {
      return a.id.localeCompare(b.id)
    }

    // make sure results are identical
    expect(results.sort(sortListings)).toEqual(listings.sort(sortListings))
  })

  it("should fail on fetch error", async () => {
    const extractor = new Extractor(mockAxios, urlInfo)
    extractor.getLogger().printLogs = false

    mockAxios.get.mockImplementationOnce(() => {
      throw new Error("get")
    })

    await expect(extractor.extract(jurisdictions)).rejects.toThrow("get")
  })
})
