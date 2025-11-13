import React from "react"
import dayjs from "dayjs"
import { render, cleanup } from "@testing-library/react"
import { listing, jurisdiction } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import {
  EnumUnitGroupAmiLevelMonthlyRentDeterminationType,
  FeatureFlag,
  FeatureFlagEnum,
  ListingsStatusEnum,
  MarketingSeasonEnum,
  MarketingTypeEnum,
  MonthEnum,
  ReviewOrderTypeEnum,
  UnitTypeEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { Availability } from "../../../../src/components/listing/listing_sections/Availability"

afterEach(cleanup)

describe("<Availability>", () => {
  describe("with unit groups off", () => {
    it("shows reserved community type", () => {
      const view = render(
        <Availability
          listing={{
            ...listing,
            reservedCommunityDescription: "Community type description",
            reservedCommunityTypes: { id: "id", name: "veteran" },
            reviewOrderType: ReviewOrderTypeEnum.firstComeFirstServe,
            status: ListingsStatusEnum.closed,
            unitsAvailable: 100,
          }}
          jurisdiction={jurisdiction}
        />
      )
      expect(view.getByText("Applications closed")).toBeDefined()
      expect(view.getByText("Availability")).toBeDefined()
      expect(view.getByText("Reserved building")).toBeDefined()
      expect(view.getByText("Veteran")).toBeDefined()
      expect(view.getByText("Community type description")).toBeDefined()
    })
    it("shows correct data for closed fcfs listing", () => {
      const dueDate = dayjs(new Date()).subtract(5, "days").hour(10).minute(30).toDate()
      const view = render(
        <Availability
          listing={{
            ...listing,
            reservedCommunityDescription: null,
            reservedCommunityTypes: null,
            reviewOrderType: ReviewOrderTypeEnum.firstComeFirstServe,
            status: ListingsStatusEnum.closed,
            unitsAvailable: 100,
            applicationDueDate: dueDate,
            isWaitlistOpen: undefined,
          }}
          jurisdiction={jurisdiction}
        />
      )
      expect(view.getByText("Applications closed")).toBeDefined()
      expect(view.getByText("Availability")).toBeDefined()
      expect(view.getByText("First come first serve")).toBeDefined()
      expect(view.queryByText("Vacant units available")).toBeNull()
      expect(
        view.getByText(
          "Eligible applicants will be contacted on a first come first serve basis until vacancies are filled."
        )
      ).toBeDefined()
      expect(view.getByText("100 units")).toBeDefined()
    })
    it("shows correct data for open fcfs listing", () => {
      const dueDate = dayjs(new Date()).add(5, "days").hour(10).minute(30).toDate()
      const view = render(
        <Availability
          listing={{
            ...listing,
            reviewOrderType: ReviewOrderTypeEnum.firstComeFirstServe,
            status: ListingsStatusEnum.active,
            unitsAvailable: 1,
            applicationDueDate: dueDate,
            isWaitlistOpen: undefined,
          }}
          jurisdiction={jurisdiction}
        />
      )
      expect(view.queryByText("Applications closed")).toBeNull()
      expect(view.getByText("Availability")).toBeDefined()
      expect(view.getByText("First come first serve")).toBeDefined()
      expect(view.getByText("Vacant units available")).toBeDefined()
      expect(view.getByText("Application due:", { exact: false })).toBeDefined()
      expect(view.getByText(dayjs(dueDate).format("MMM DD, YYYY"), { exact: false })).toBeDefined()
      expect(
        view.getByText(
          "Eligible applicants will be contacted on a first come first serve basis until vacancies are filled."
        )
      ).toBeDefined()
      expect(view.getByText("1 unit")).toBeDefined()
    })
    it("shows correct data for closed lottery listing", () => {
      const dueDate = dayjs(new Date()).subtract(5, "days").hour(10).minute(30).toDate()
      const view = render(
        <Availability
          listing={{
            ...listing,
            reviewOrderType: ReviewOrderTypeEnum.lottery,
            status: ListingsStatusEnum.closed,
            unitsAvailable: 100,
            applicationDueDate: dueDate,
            isWaitlistOpen: undefined,
          }}
          jurisdiction={jurisdiction}
        />
      )
      expect(view.getByText("Applications closed")).toBeDefined()
      expect(view.getByText("Availability")).toBeDefined()
      expect(view.getByText("Lottery")).toBeDefined()
      expect(view.queryByText("Vacant units available")).toBeNull()
      expect(view.queryByText("Application due:", { exact: false })).toBeNull()
      expect(view.queryByText(dayjs(dueDate).format("MMM DD, YYYY"), { exact: false })).toBeNull()
      expect(
        view.getByText(
          "Applicants will be reviewed in lottery rank order until all vacancies are filled."
        )
      ).toBeDefined()
      expect(view.getByText("100 units")).toBeDefined()
    })

    it("shows correct data for open lottery listing", () => {
      const dueDate = dayjs(new Date()).add(5, "days").hour(10).minute(30).toDate()
      const view = render(
        <Availability
          listing={{
            ...listing,
            reviewOrderType: ReviewOrderTypeEnum.lottery,
            status: ListingsStatusEnum.active,
            unitsAvailable: 100,
            applicationDueDate: dueDate,
            isWaitlistOpen: undefined,
          }}
          jurisdiction={jurisdiction}
        />
      )
      expect(view.queryByText("Applications closed")).toBeNull()
      expect(view.getByText("Availability")).toBeDefined()
      expect(view.getByText("Lottery")).toBeDefined()
      expect(view.getByText("Vacant units available")).toBeDefined()
      expect(view.getByText("Application due:", { exact: false })).toBeDefined()
      expect(view.getByText(dayjs(dueDate).format("MMM DD, YYYY"), { exact: false })).toBeDefined()
      expect(
        view.getByText(
          "Applicants will be reviewed in lottery rank order until all vacancies are filled."
        )
      ).toBeDefined()
      expect(view.getByText("100 units")).toBeDefined()
    })

    it("shows correct data for under construction with enableMarketingStatus season on", () => {
      const dueDate = dayjs(new Date()).add(5, "days").hour(10).minute(30).toDate()
      const view = render(
        <Availability
          listing={{
            ...listing,
            reviewOrderType: ReviewOrderTypeEnum.firstComeFirstServe,
            status: ListingsStatusEnum.active,
            waitlistOpenSpots: null,
            applicationDueDate: dueDate,
            marketingType: MarketingTypeEnum.comingSoon,
            marketingSeason: MarketingSeasonEnum.spring,
            marketingYear: 2026,
          }}
          jurisdiction={{
            ...jurisdiction,
            featureFlags: [
              { name: FeatureFlagEnum.enableMarketingStatus, active: true } as FeatureFlag,
            ],
          }}
        />
      )
      expect(view.getByText("Availability")).toBeDefined()
      expect(view.getAllByText("Under construction").length).toBe(2)
      expect(view.queryByText("First come first serve")).toBeNull()
      expect(view.queryByText("Vacant units available")).toBeNull()
      expect(view.getByText("Residents should apply in Spring 2026")).toBeDefined()
      expect(view.queryByText("Application due:", { exact: false })).toBeNull()
      expect(
        view.getByText(
          "Eligible applicants will be contacted on a first come first serve basis until vacancies are filled."
        )
      )
    })

    it("shows correct data for under construction with enableMarketingStatus month on", () => {
      const dueDate = dayjs(new Date()).add(5, "days").hour(10).minute(30).toDate()
      const view = render(
        <Availability
          listing={{
            ...listing,
            reviewOrderType: ReviewOrderTypeEnum.firstComeFirstServe,
            status: ListingsStatusEnum.active,
            waitlistOpenSpots: null,
            applicationDueDate: dueDate,
            marketingType: MarketingTypeEnum.comingSoon,
            marketingSeason: MarketingSeasonEnum.spring,
            marketingMonth: MonthEnum.april,
            marketingYear: 2026,
          }}
          jurisdiction={{
            ...jurisdiction,
            featureFlags: [
              { name: FeatureFlagEnum.enableMarketingStatus, active: true } as FeatureFlag,
              { name: FeatureFlagEnum.enableMarketingStatusMonths, active: true } as FeatureFlag,
            ],
          }}
        />
      )
      expect(view.getByText("Availability")).toBeDefined()
      expect(view.getAllByText("Under construction").length).toBe(2)
      expect(view.getByText("Residents should apply in April 2026")).toBeDefined()
      expect(view.queryByText("Application due:", { exact: false })).toBeNull()
    })

    it("shows correct data for closed waitlist listing, due date, no spots", () => {
      const dueDate = dayjs(new Date()).subtract(5, "days").hour(10).minute(30).toDate()
      const view = render(
        <Availability
          listing={{
            ...listing,
            reviewOrderType: ReviewOrderTypeEnum.waitlist,
            status: ListingsStatusEnum.closed,
            waitlistOpenSpots: null,
            applicationDueDate: dueDate,
          }}
          jurisdiction={jurisdiction}
        />
      )
      expect(view.getByText("Applications closed")).toBeDefined()
      expect(view.getByText("Availability")).toBeDefined()
      expect(view.getByText("Waitlist")).toBeDefined()
      expect(view.queryByText("Waitlist is open")).toBeNull()
      expect(view.queryByText("Open waitlist slots")).toBeNull()
      expect(view.queryByText("Application due:", { exact: false })).toBeNull()
      expect(view.queryByText(dayjs(dueDate).format("MMM DD, YYYY"), { exact: false })).toBeNull()
      expect(view.queryByText("Submit an application for an open slot on the waitlist.")).toBeNull()
    })

    it("shows correct data for open waitlist listing, due date, no spots", () => {
      const dueDate = dayjs(new Date()).add(5, "days").hour(10).minute(30).toDate()
      const view = render(
        <Availability
          listing={{
            ...listing,
            reviewOrderType: ReviewOrderTypeEnum.waitlist,
            status: ListingsStatusEnum.active,
            waitlistOpenSpots: null,
            applicationDueDate: dueDate,
          }}
          jurisdiction={jurisdiction}
        />
      )
      expect(view.queryByText("Applications closed")).toBeNull()
      expect(view.getByText("Availability")).toBeDefined()
      expect(view.getByText("Waitlist")).toBeDefined()
      expect(view.getByText("Waitlist is open")).toBeDefined()
      expect(view.queryByText("Open waitlist slots")).toBeNull()
      expect(view.getByText("Application due:", { exact: false })).toBeDefined()
      expect(view.getByText(dayjs(dueDate).format("MMM DD, YYYY"), { exact: false })).toBeDefined()
      expect(
        view.getByText("Submit an application for an open slot on the waitlist.")
      ).toBeDefined()
    })

    it("shows correct data for closed waitlist listing, no due date, no spots", () => {
      const view = render(
        <Availability
          listing={{
            ...listing,
            reviewOrderType: ReviewOrderTypeEnum.waitlist,
            status: ListingsStatusEnum.closed,
            waitlistOpenSpots: null,
            applicationDueDate: null,
          }}
          jurisdiction={jurisdiction}
        />
      )
      expect(view.getByText("Applications closed")).toBeDefined()
      expect(view.getByText("Availability")).toBeDefined()
      expect(view.getByText("Waitlist")).toBeDefined()
      expect(view.queryByText("Waitlist is open")).toBeNull()
      expect(view.queryByText("Open waitlist slots")).toBeNull()
      expect(view.queryByText("Application due:", { exact: false })).toBeNull()
      expect(view.queryByText("Submit an application for an open slot on the waitlist.")).toBeNull()
    })

    it("shows correct data for open waitlist listing, no due date, no spots", () => {
      const view = render(
        <Availability
          listing={{
            ...listing,
            reviewOrderType: ReviewOrderTypeEnum.waitlist,
            status: ListingsStatusEnum.active,
            waitlistOpenSpots: null,
            applicationDueDate: null,
          }}
          jurisdiction={jurisdiction}
        />
      )
      expect(view.queryByText("Applications closed")).toBeNull()
      expect(view.getByText("Availability")).toBeDefined()
      expect(view.getByText("Waitlist")).toBeDefined()
      expect(view.getByText("Waitlist is open")).toBeDefined()
      expect(view.queryByText("Open waitlist slots")).toBeNull()
      expect(view.queryByText("Application due:", { exact: false })).toBeNull()
      expect(view.getByText("Applications open")).toBeDefined()
      expect(
        view.getByText("Submit an application for an open slot on the waitlist.")
      ).toBeDefined()
    })

    it("shows correct data for closed waitlist listing, with spots", () => {
      const view = render(
        <Availability
          listing={{
            ...listing,
            reviewOrderType: ReviewOrderTypeEnum.waitlist,
            status: ListingsStatusEnum.closed,
            waitlistOpenSpots: 50,
            applicationDueDate: null,
          }}
          jurisdiction={jurisdiction}
        />
      )
      expect(view.getByText("Applications closed")).toBeDefined()
      expect(view.getByText("Availability")).toBeDefined()
      expect(view.getByText("Waitlist")).toBeDefined()
      expect(view.queryByText("Waitlist is open")).toBeNull()
      expect(view.getByText("50 open waitlist slots")).toBeDefined()
      expect(view.queryByText("Application due:", { exact: false })).toBeNull()
      expect(view.queryByText("Submit an application for an open slot on the waitlist.")).toBeNull()
    })

    it("shows correct data for open waitlist listing, with spots", () => {
      const view = render(
        <Availability
          listing={{
            ...listing,
            reviewOrderType: ReviewOrderTypeEnum.waitlist,
            status: ListingsStatusEnum.active,
            waitlistOpenSpots: 50,
            applicationDueDate: null,
          }}
          jurisdiction={jurisdiction}
        />
      )
      expect(view.queryByText("Applications closed")).toBeNull()
      expect(view.getByText("Availability")).toBeDefined()
      expect(view.getByText("Waitlist")).toBeDefined()
      expect(view.getByText("Waitlist is open")).toBeDefined()
      expect(view.getByText("50 open waitlist slots")).toBeDefined()
      expect(view.queryByText("Application due:", { exact: false })).toBeNull()
      expect(view.getByText("Applications open")).toBeDefined()
      expect(
        view.getByText("Submit an application for an open slot on the waitlist.")
      ).toBeDefined()
    })

    it("shows correct data for under construction with enableMarketingStatus off", () => {
      const dueDate = dayjs(new Date()).add(5, "days").hour(10).minute(30).toDate()
      const view = render(
        <Availability
          listing={{
            ...listing,
            reviewOrderType: ReviewOrderTypeEnum.firstComeFirstServe,
            status: ListingsStatusEnum.active,
            waitlistOpenSpots: null,
            applicationDueDate: dueDate,
            marketingType: MarketingTypeEnum.comingSoon,
            marketingSeason: MarketingSeasonEnum.spring,
            marketingYear: 2026,
          }}
          jurisdiction={{
            ...jurisdiction,
            featureFlags: [
              { name: FeatureFlagEnum.enableMarketingStatus, active: false } as FeatureFlag,
            ],
          }}
        />
      )
      expect(view.getByText("Availability")).toBeDefined()
      expect(view.queryByText("Under construction")).toBeNull()
      expect(view.getByText("First come first serve")).toBeDefined()
      expect(view.getByText("Vacant units available")).toBeDefined()
      expect(view.getByText("Application due:", { exact: false })).toBeDefined()
      expect(
        view.getByText(
          "Eligible applicants will be contacted on a first come first serve basis until vacancies are filled."
        )
      ).toBeDefined()
    })

    it("shows correct data for under construction with enableMarketingStatus on", () => {
      const dueDate = dayjs(new Date()).add(5, "days").hour(10).minute(30).toDate()
      const view = render(
        <Availability
          listing={{
            ...listing,
            reviewOrderType: ReviewOrderTypeEnum.firstComeFirstServe,
            status: ListingsStatusEnum.active,
            waitlistOpenSpots: null,
            applicationDueDate: dueDate,
            marketingType: MarketingTypeEnum.comingSoon,
            marketingSeason: MarketingSeasonEnum.spring,
            marketingYear: 2026,
          }}
          jurisdiction={{
            ...jurisdiction,
            featureFlags: [
              { name: FeatureFlagEnum.enableMarketingStatus, active: true } as FeatureFlag,
            ],
          }}
        />
      )
      expect(view.getByText("Availability")).toBeDefined()
      expect(view.getAllByText("Under construction").length).toBe(2)
      expect(view.queryByText("First come first serve")).toBeNull()
      expect(view.queryByText("Vacant units available")).toBeNull()
      expect(view.getByText("Residents should apply in Spring 2026")).toBeDefined()
      expect(view.queryByText("Application due:", { exact: false })).toBeNull()
      expect(
        view.getByText(
          "Eligible applicants will be contacted on a first come first serve basis until vacancies are filled."
        )
      ).toBeDefined()
    })
  })
  describe("with unit groups on", () => {
    it("shows correct data for under construction with enableMarketingStatus on and enableUnitGroups on", () => {
      const dueDate = dayjs(new Date()).add(5, "days").hour(10).minute(30).toDate()
      const view = render(
        <Availability
          listing={{
            ...listing,
            reviewOrderType: ReviewOrderTypeEnum.firstComeFirstServe,
            status: ListingsStatusEnum.active,
            waitlistOpenSpots: null,
            applicationDueDate: dueDate,
            marketingType: MarketingTypeEnum.comingSoon,
            marketingSeason: MarketingSeasonEnum.spring,
            marketingYear: 2026,
          }}
          jurisdiction={{
            ...jurisdiction,
            featureFlags: [
              { name: FeatureFlagEnum.enableMarketingStatus, active: true } as FeatureFlag,
              { name: FeatureFlagEnum.enableUnitGroups, active: true } as FeatureFlag,
            ],
          }}
        />
      )
      expect(view.getByText("Availability")).toBeDefined()
      expect(view.getAllByText("Under construction").length).toBe(2)
      expect(view.queryByText("First come first serve")).toBeNull()
      expect(view.queryByText("Vacant units available")).toBeNull()
      expect(view.getByText("Residents should apply in Spring 2026")).toBeDefined()
      expect(view.queryByText("Application due:", { exact: false })).toBeNull()
      expect(
        view.queryByText(
          "Eligible applicants will be contacted on a first come first serve basis until vacancies are filled."
        )
      ).toBeNull()
    })
    it("shows nothing for marketing listings with enableMarketingStatus on and enableUnitGroups on with available units and no waitlist values", () => {
      const view = render(
        <Availability
          listing={{
            ...listing,
            status: ListingsStatusEnum.active,
            reviewOrderType: ReviewOrderTypeEnum.waitlist,
            waitlistOpenSpots: null,
            waitlistMaxSize: null,
            waitlistCurrentSize: null,
            applicationDueDate: null,
            marketingType: MarketingTypeEnum.marketing,
          }}
          jurisdiction={{
            ...jurisdiction,
            featureFlags: [
              { name: FeatureFlagEnum.enableMarketingStatus, active: true } as FeatureFlag,
              { name: FeatureFlagEnum.enableUnitGroups, active: true } as FeatureFlag,
            ],
          }}
        />
      )
      expect(view.queryByText("Availability")).toBeNull()
      expect(view.queryByText("Applications closed")).toBeNull()
      expect(view.queryByText("Availability")).toBeNull()
      expect(view.queryByText("Waitlist")).toBeNull()
      expect(view.queryByText("Waitlist is open")).toBeNull()
      expect(view.queryByText("Open waitlist slots")).toBeNull()
      expect(view.queryByText("Application due:", { exact: false })).toBeNull()
      expect(view.queryByText("Applications open")).toBeNull()
      expect(view.queryByText("Submit an application for an open slot on the waitlist.")).toBeNull()
      expect(view.queryAllByText("Under construction").length).toBe(0)
    })
    it("shows waitlist section for marketing listings with enableMarketingStatus on and enableUnitGroups on with available units and waitlist values and no additional waitlist fields", () => {
      const view = render(
        <Availability
          listing={{
            ...listing,
            status: ListingsStatusEnum.active,
            reviewOrderType: ReviewOrderTypeEnum.waitlist,
            waitlistOpenSpots: 90,
            waitlistMaxSize: 100,
            waitlistCurrentSize: 10,
            applicationDueDate: null,
            marketingType: MarketingTypeEnum.marketing,
          }}
          jurisdiction={{
            ...jurisdiction,
            featureFlags: [
              { name: FeatureFlagEnum.enableMarketingStatus, active: true } as FeatureFlag,
              { name: FeatureFlagEnum.enableUnitGroups, active: true } as FeatureFlag,
            ],
          }}
        />
      )
      expect(view.getByText("Availability")).toBeDefined()
      expect(view.queryByText("10 current waitlist size")).toBeNull()
      expect(view.getByText("90 open waitlist slots")).toBeDefined()
      expect(view.queryByText("100 final waitlist size")).toBeNull()
    })
    it("shows waitlist section for marketing listings with enableMarketingStatus on and enableUnitGroups on with available units and waitlist values and additional waitlist fields", () => {
      const view = render(
        <Availability
          listing={{
            ...listing,
            status: ListingsStatusEnum.active,
            reviewOrderType: ReviewOrderTypeEnum.waitlist,
            waitlistOpenSpots: 90,
            waitlistMaxSize: 100,
            waitlistCurrentSize: 10,
            applicationDueDate: null,
            marketingType: MarketingTypeEnum.marketing,
          }}
          jurisdiction={{
            ...jurisdiction,
            featureFlags: [
              { name: FeatureFlagEnum.enableMarketingStatus, active: true } as FeatureFlag,
              { name: FeatureFlagEnum.enableUnitGroups, active: true } as FeatureFlag,
              { name: FeatureFlagEnum.enableWaitlistAdditionalFields, active: true } as FeatureFlag,
            ],
          }}
        />
      )
      expect(view.getByText("Availability")).toBeDefined()
      expect(view.getByText("10 current waitlist size")).toBeDefined()
      expect(view.getByText("90 open waitlist slots")).toBeDefined()
      expect(view.getByText("100 final waitlist size")).toBeDefined()
    })
    it("shows waitlist section for marketing listings with enableUnitGroups on", () => {
      const view = render(
        <Availability
          listing={{
            ...listing,
            status: ListingsStatusEnum.active,
            reviewOrderType: ReviewOrderTypeEnum.firstComeFirstServe,
            applicationDueDate: null,
            marketingType: MarketingTypeEnum.marketing,
            waitlistCurrentSize: 10,
            waitlistOpenSpots: 90,
            waitlistMaxSize: 100,
            reservedCommunityTypes: null,

            unitGroups: [
              {
                id: "1d4971f5-b651-430c-9a2f-4655534f1bda",
                createdAt: new Date(),
                updatedAt: new Date(),
                maxOccupancy: 4,
                minOccupancy: 1,
                floorMin: 1,
                floorMax: 4,
                totalCount: 2,
                totalAvailable: null,
                bathroomMin: 1,
                bathroomMax: 3,
                openWaitlist: true,
                sqFeetMin: 340,
                sqFeetMax: 725,
                unitGroupAmiLevels: [
                  {
                    id: "8025f0c3-4103-4321-8261-da536e489572",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    amiPercentage: 20,
                    monthlyRentDeterminationType:
                      EnumUnitGroupAmiLevelMonthlyRentDeterminationType.flatRent,
                    percentageOfIncomeValue: null,
                    flatRentValue: 1500,
                    amiChart: {
                      id: "cf8574bb-599f-40fa-9468-87c1e16be898",
                      createdAt: new Date(),
                      updatedAt: new Date(),
                      items: [],
                      name: "Divine Orchard",
                      jurisdictions: {
                        id: "e674b260-d26f-462a-9090-abaabe939cae",
                        name: "Bloomington",
                      },
                    },
                  },
                ],
                unitTypes: [
                  {
                    id: "d20ada5f-3b33-4ec6-86b8-ce9412bb8844",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    name: UnitTypeEnum.studio,
                    numBedrooms: 0,
                  },
                  {
                    id: "a7195b0a-2311-494c-9765-7304a3637312",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    name: UnitTypeEnum.oneBdrm,
                    numBedrooms: 1,
                  },
                ],
              },
            ],
          }}
          jurisdiction={{
            ...jurisdiction,
            featureFlags: [
              { name: FeatureFlagEnum.enableMarketingStatus, active: true } as FeatureFlag,
              { name: FeatureFlagEnum.enableUnitGroups, active: true } as FeatureFlag,
              { name: FeatureFlagEnum.enableWaitlistAdditionalFields, active: true } as FeatureFlag,
            ],
          }}
        />
      )
      expect(view.getByText("Availability")).toBeDefined()
      expect(view.getByText("10 current waitlist size")).toBeDefined()
      expect(view.getByText("90 open waitlist slots")).toBeDefined()
      expect(view.getByText("100 final waitlist size")).toBeDefined()
    })
    it("does not show waitlist section for marketing listings with enableUnitGroups on if there are no waitlist numbers", () => {
      const view = render(
        <Availability
          listing={{
            ...listing,
            status: ListingsStatusEnum.active,
            reviewOrderType: ReviewOrderTypeEnum.firstComeFirstServe,
            applicationDueDate: null,
            marketingType: MarketingTypeEnum.marketing,
            waitlistCurrentSize: null,
            waitlistOpenSpots: null,
            waitlistMaxSize: null,
            reservedCommunityTypes: null,

            unitGroups: [
              {
                id: "1d4971f5-b651-430c-9a2f-4655534f1bda",
                createdAt: new Date(),
                updatedAt: new Date(),
                maxOccupancy: 4,
                minOccupancy: 1,
                floorMin: 1,
                floorMax: 4,
                totalCount: 2,
                totalAvailable: null,
                bathroomMin: 1,
                bathroomMax: 3,
                openWaitlist: true,
                sqFeetMin: 340,
                sqFeetMax: 725,
                unitGroupAmiLevels: [
                  {
                    id: "8025f0c3-4103-4321-8261-da536e489572",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    amiPercentage: 20,
                    monthlyRentDeterminationType:
                      EnumUnitGroupAmiLevelMonthlyRentDeterminationType.flatRent,
                    percentageOfIncomeValue: null,
                    flatRentValue: 1500,
                    amiChart: {
                      id: "cf8574bb-599f-40fa-9468-87c1e16be898",
                      createdAt: new Date(),
                      updatedAt: new Date(),
                      items: [],
                      name: "Divine Orchard",
                      jurisdictions: {
                        id: "e674b260-d26f-462a-9090-abaabe939cae",
                        name: "Bloomington",
                      },
                    },
                  },
                ],
                unitTypes: [
                  {
                    id: "d20ada5f-3b33-4ec6-86b8-ce9412bb8844",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    name: UnitTypeEnum.studio,
                    numBedrooms: 0,
                  },
                  {
                    id: "a7195b0a-2311-494c-9765-7304a3637312",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    name: UnitTypeEnum.oneBdrm,
                    numBedrooms: 1,
                  },
                ],
              },
            ],
          }}
          jurisdiction={{
            ...jurisdiction,
            featureFlags: [
              { name: FeatureFlagEnum.enableMarketingStatus, active: true } as FeatureFlag,
              { name: FeatureFlagEnum.enableUnitGroups, active: true } as FeatureFlag,
              { name: FeatureFlagEnum.enableWaitlistAdditionalFields, active: true } as FeatureFlag,
            ],
          }}
        />
      )
      expect(view.queryByText("Availability")).toBeNull()
    })
  })
})
