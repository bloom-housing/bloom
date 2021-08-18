import { BaseView, FullView, getView } from "./view"
import { views } from "./config"

const mockQueryBuilder = {
  select: jest.fn().mockReturnThis(),
  leftJoin: jest.fn().mockReturnThis(),
  leftJoinAndSelect: jest.fn().mockReturnThis(),
}

const mockListingsRepo = {
  createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
}

const mockUnitTypes = [
  { id: "unit-1", name: "oneBdrm" },
  { id: "unit-2", name: "twoBdrm" },
  { id: "unit-3", name: "threeBdrm" },
]

const mockListings = [
  {
    id: "listing-1",
    property: {
      units: [
        { unitType: mockUnitTypes[0], minimumIncome: "0", rent: "100" },
        { unitType: mockUnitTypes[0], minimumIncome: "1", rent: "101" },
        { unitType: mockUnitTypes[1], minimumIncome: "0", rent: "100" },
      ],
    },
  },
  {
    id: "listing-2",
    property: {
      units: [
        { unitType: mockUnitTypes[0], minimumIncome: "0", rent: "100" },
        { unitType: mockUnitTypes[1], minimumIncome: "1", rent: "101" },
        { unitType: mockUnitTypes[2], minimumIncome: "2", rent: "102" },
      ],
    },
  },
]

describe("listing views", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("BaseView", () => {
    it("should create a new BaseView with qb view properties", () => {
      const view = new BaseView(mockListingsRepo.createQueryBuilder())

      expect(view.qb).toEqual(mockQueryBuilder)
      expect(view.view).toEqual(views.base)
    })

    it("should call getView qb select and leftJoin", () => {
      const view = new BaseView(mockListingsRepo.createQueryBuilder())

      view.getViewQb()

      expect(mockQueryBuilder.select).toHaveBeenCalledTimes(1)
      expect(mockQueryBuilder.leftJoin).toHaveBeenCalledTimes(7)
    })

    it("should map unitSummary to listings", () => {
      const view = new BaseView(mockListingsRepo.createQueryBuilder())

      const listings = view.mapUnitSummary(mockListings)

      listings.forEach((listing) => {
        expect(listing).toHaveProperty("unitsSummarized")
        expect(listing.unitsSummarized).toHaveProperty("byUnitTypeAndRent")
      })
    })
  })

  describe("FullView", () => {
    it("should call getView qb leftJoinAndSelect", () => {
      const view = new FullView(mockListingsRepo.createQueryBuilder())

      view.getViewQb()

      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledTimes(23)
    })
  })

  describe("view function", () => {
    it("should create a new BaseView with view param", () => {
      const listingView = getView(mockListingsRepo.createQueryBuilder(), "base")

      expect(listingView.qb).toEqual(mockQueryBuilder)
      expect(listingView.view).toEqual(views.base)
    })

    it("should create a new FullView without view param", () => {
      const listingView = getView(mockListingsRepo.createQueryBuilder())

      expect(listingView.qb).toEqual(mockQueryBuilder)
      expect(listingView.view).toEqual(views.base)
    })

    it("should create a new FullView with view param", () => {
      const listingView = getView(mockListingsRepo.createQueryBuilder(), "full")

      expect(listingView.qb).toEqual(mockQueryBuilder)
      expect(listingView.view).toEqual(views.full)
    })

    it("should create a new DetailView with view param", () => {
      const view = getView(mockListingsRepo.createQueryBuilder(), "detail")

      expect(view.qb).toEqual(mockQueryBuilder)
      expect(view.view).toEqual(views.detail)
    })
  })
})
