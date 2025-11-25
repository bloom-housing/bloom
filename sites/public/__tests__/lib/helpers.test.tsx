import React from "react"
import dayjs from "dayjs"
import { render } from "@testing-library/react"
import {
  EnumUnitGroupAmiLevelMonthlyRentDeterminationType,
  ListingsStatusEnum,
  MarketingSeasonEnum,
  MarketingTypeEnum,
  MonthEnum,
  ReviewOrderTypeEnum,
  UnitTypeEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { listing, jurisdiction } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import {
  getApplicationSeason,
  getListingStatusMessage,
  getListingStatusMessageContent,
  getStatusPrefix,
} from "../../src/lib/helpers"

describe("helpers", () => {
  describe("getStatusPrefix", () => {
    it("should return correctly for closed listings", () => {
      expect(
        getStatusPrefix({ ...listing, status: ListingsStatusEnum.closed }, false, false)
      ).toEqual({
        label: "Applications closed",
        variant: "secondary-inverse",
      })
    })
    it("should not show under construction if toggle is off", () => {
      expect(
        getStatusPrefix(
          {
            ...listing,
            reviewOrderType: ReviewOrderTypeEnum.firstComeFirstServe,
            status: ListingsStatusEnum.active,
            applicationDueDate: dayjs(new Date()).add(5, "days").toDate(),
            marketingType: MarketingTypeEnum.comingSoon,
          },
          false,
          false
        )
      ).toEqual({
        label: "First come first serve",
        variant: "primary",
      })
    })
    it("should show under construction if toggle is on", () => {
      expect(
        getStatusPrefix(
          {
            ...listing,
            reviewOrderType: ReviewOrderTypeEnum.firstComeFirstServe,
            status: ListingsStatusEnum.active,
            applicationDueDate: dayjs(new Date()).add(5, "days").toDate(),
            marketingType: MarketingTypeEnum.comingSoon,
          },
          true,
          false
        )
      ).toEqual({
        label: "Under construction",
        variant: "warn",
      })
    })
    it("should show closed on an active listing if due date is in the past", () => {
      expect(
        getStatusPrefix(
          {
            ...listing,
            reviewOrderType: ReviewOrderTypeEnum.firstComeFirstServe,
            status: ListingsStatusEnum.active,
          },
          false,
          false
        )
      ).toEqual({
        label: "Applications closed",
        variant: "secondary-inverse",
      })
    })
    it("should return correctly for lottery listings", () => {
      expect(
        getStatusPrefix(
          {
            ...listing,
            reviewOrderType: ReviewOrderTypeEnum.lottery,
            status: ListingsStatusEnum.active,
            applicationDueDate: dayjs(new Date()).add(5, "days").toDate(),
          },
          false,
          false
        )
      ).toEqual({
        label: "Lottery",
        variant: "primary",
      })
    })
    it("should return correctly for waitlist listings", () => {
      expect(
        getStatusPrefix(
          {
            ...listing,
            reviewOrderType: ReviewOrderTypeEnum.waitlist,
            status: ListingsStatusEnum.active,
            applicationDueDate: dayjs(new Date()).add(5, "days").toDate(),
          },
          false,
          false
        )
      ).toEqual({
        label: "Open waitlist",
        variant: "secondary",
      })
    })
    it("should return correctly for lottery listings with unit groups on", () => {
      expect(
        getStatusPrefix(
          {
            ...listing,
            reviewOrderType: ReviewOrderTypeEnum.lottery,
            status: ListingsStatusEnum.active,
            applicationDueDate: dayjs(new Date()).add(5, "days").toDate(),
          },
          false,
          true
        )
      ).toEqual({
        label: "Lottery",
        variant: "primary",
      })
    })
    it("should return correctly for FCFS and no unit groups with unit groups on", () => {
      expect(
        getStatusPrefix(
          {
            ...listing,
            reviewOrderType: ReviewOrderTypeEnum.firstComeFirstServe,
            status: ListingsStatusEnum.active,
            applicationDueDate: dayjs(new Date()).add(5, "days").toDate(),
          },
          false,
          true
        )
      ).toEqual({
        label: "Availability unknown",
        variant: "warn",
      })
    })
    it("should return correctly for waitlist listings with unit groups on", () => {
      expect(
        getStatusPrefix(
          {
            ...listing,
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
            reviewOrderType: ReviewOrderTypeEnum.firstComeFirstServe,
            status: ListingsStatusEnum.active,
            applicationDueDate: dayjs(new Date()).add(5, "days").toDate(),
          },
          false,
          true
        )
      ).toEqual({
        label: "Open waitlist",
        variant: "secondary",
      })
    })
    it("should return correctly for fcfs listings with unit groups on", () => {
      expect(
        getStatusPrefix(
          {
            ...listing,
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
                totalAvailable: 10,
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
            reviewOrderType: ReviewOrderTypeEnum.firstComeFirstServe,
            status: ListingsStatusEnum.active,
            applicationDueDate: dayjs(new Date()).add(5, "days").toDate(),
          },
          false,
          true
        )
      ).toEqual({
        label: "First come first serve",
        variant: "primary",
      })
    })
    it("should return correctly for fcfs listings with unit groups waitlist closed and no available units", () => {
      expect(
        getStatusPrefix(
          {
            ...listing,
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
                totalAvailable: 10,
                bathroomMin: 1,
                bathroomMax: 3,
                openWaitlist: false,
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
              {
                id: "2d4971f5-b651-430c-9a2f-4655534f1bda",
                createdAt: new Date(),
                updatedAt: new Date(),
                openWaitlist: false,
                unitGroupAmiLevels: [],
                unitTypes: [
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
            reviewOrderType: ReviewOrderTypeEnum.firstComeFirstServe,
            status: ListingsStatusEnum.active,
            applicationDueDate: dayjs(new Date()).add(5, "days").toDate(),
          },
          false,
          true
        )
      ).toEqual({
        label: "Closed waitlist",
        variant: "secondary-inverse",
      })
    })
  })

  describe("getListingStatusMessageContent", () => {
    it("should return correctly with under construction and marketing enabled only year", () => {
      expect(
        getListingStatusMessageContent(
          ListingsStatusEnum.active,
          dayjs(new Date()).add(5, "days").toDate(),
          true,
          false,
          MarketingTypeEnum.comingSoon,
          null,
          null,
          2026,
          false
        )
      ).toEqual("Residents should apply in 2026")
    })
    it("should return correctly with under construction and marketing season enabled", () => {
      expect(
        getListingStatusMessageContent(
          ListingsStatusEnum.active,
          dayjs(new Date()).add(5, "days").toDate(),
          true,
          false,
          MarketingTypeEnum.comingSoon,
          MarketingSeasonEnum.spring,
          MonthEnum.april,
          2026,
          false
        )
      ).toEqual("Residents should apply in Spring 2026")
    })
    it("should return correctly with under construction and marketing month enabled", () => {
      expect(
        getListingStatusMessageContent(
          ListingsStatusEnum.active,
          dayjs(new Date()).add(5, "days").toDate(),
          true,
          true,
          MarketingTypeEnum.comingSoon,
          MarketingSeasonEnum.spring,
          MonthEnum.april,
          2026,
          false
        )
      ).toEqual("Residents should apply in April 2026")
    })
    it("should return correctly under with construction and marketing disabled", () => {
      const result = getListingStatusMessageContent(
        ListingsStatusEnum.active,
        dayjs(new Date()).add(5, "days").hour(10).minute(30).toDate(),
        false,
        false,
        MarketingTypeEnum.comingSoon,
        MarketingSeasonEnum.spring,
        MonthEnum.april,
        2026,
        false
      )
      expect(result).toContain("Application due:")
      expect(result).toContain("10:30AM")
    })
    it("should return date but hide time", () => {
      const result = getListingStatusMessageContent(
        ListingsStatusEnum.active,
        dayjs(new Date()).add(5, "days").hour(10).minute(30).toDate(),
        false,
        false,
        MarketingTypeEnum.comingSoon,
        MarketingSeasonEnum.spring,
        null,
        2026,
        true
      )
      expect(result).toContain("Application due:")
      expect(result).not.toContain("10:30AM")
    })
  })
  it("should return correctly for closed listing", () => {
    expect(
      getListingStatusMessageContent(
        ListingsStatusEnum.closed,
        dayjs(new Date()).subtract(5, "days").toDate(),
        false,
        false,
        null,
        null,
        null,
        null,
        false
      )
    ).toEqual("")
  })
  it("should return correctly for active listing with no due date", () => {
    expect(
      getListingStatusMessageContent(
        ListingsStatusEnum.active,
        null,
        false,
        false,
        null,
        null,
        null,
        null,
        false
      )
    ).toEqual("Applications open")
  })

  describe("getListingStatusMessage", () => {
    it("should return correctly for closed listing", () => {
      const view = render(
        getListingStatusMessage(
          {
            ...listing,
            applicationDueDate: dayjs(new Date()).subtract(5, "days").toDate(),
            status: ListingsStatusEnum.closed,
          },
          jurisdiction,
          null,
          false,
          false
        )
      )
      expect(view.getByText("Applications closed")).toBeDefined()
    })
  })
  it("should return correctly for open listing with date", () => {
    const view = render(
      getListingStatusMessage(
        {
          ...listing,
          applicationDueDate: dayjs(new Date()).add(5, "days").hour(10).minute(30).toDate(),
          status: ListingsStatusEnum.active,
        },
        jurisdiction,
        null,
        false,
        false
      )
    )
    expect(view.getByText("10:30AM", { exact: false })).toBeDefined()
  })
  it("should return correctly for open listing without date", () => {
    const view = render(
      getListingStatusMessage(
        {
          ...listing,
          applicationDueDate: dayjs(new Date()).add(5, "days").hour(10).minute(30).toDate(),
          status: ListingsStatusEnum.active,
        },
        jurisdiction,
        null,
        false,
        true
      )
    )
    expect(view.queryByText("10:30AM", { exact: false })).toBeNull()
  })
  it("should return correctly for null listing", () => {
    expect(getListingStatusMessage(null, jurisdiction, null, false, false)).toBeUndefined()
  })
  it("should render custom content", () => {
    const view = render(
      getListingStatusMessage(
        {
          ...listing,
          applicationDueDate: dayjs(new Date()).add(5, "days").toDate(),
          status: ListingsStatusEnum.active,
        },
        jurisdiction,
        <div>Custom content</div>,
        false,
        false
      )
    )
    expect(view.getByText("Custom content")).toBeDefined()
  })

  describe("getApplicationSeason", () => {
    it("should return empty if no data", () => {
      expect(getApplicationSeason(null, null, null)).toEqual(null)
    })
    it("should return only month", () => {
      expect(getApplicationSeason(null, MonthEnum.april, null)).toEqual(
        "Residents should apply in April"
      )
    })
    it("should return only season", () => {
      expect(getApplicationSeason(MarketingSeasonEnum.spring, null, null)).toEqual(
        "Residents should apply in Spring"
      )
    })
    it("should return only year", () => {
      expect(getApplicationSeason(null, null, 2027)).toEqual("Residents should apply in 2027")
    })
    it("should return month and year", () => {
      expect(getApplicationSeason(null, MonthEnum.april, 2027)).toEqual(
        "Residents should apply in April 2027"
      )
    })
    it("should return season and year", () => {
      expect(getApplicationSeason(MarketingSeasonEnum.spring, null, 2027)).toEqual(
        "Residents should apply in Spring 2027"
      )
    })
  })
})
