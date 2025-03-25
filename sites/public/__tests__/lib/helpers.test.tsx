import React from "react"
import dayjs from "dayjs"
import { render } from "@testing-library/react"
import {
  ListingsStatusEnum,
  MarketingSeasonEnum,
  MarketingTypeEnum,
  ReviewOrderTypeEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { listing, jurisdiction } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import {
  getListingStatusMessage,
  getListingStatusMessageContent,
  getStatusPrefix,
} from "../../src/lib/helpers"

describe("helpers", () => {
  describe("getStatusPrefix", () => {
    it("should return correctly for closed listings", () => {
      expect(getStatusPrefix({ ...listing, status: ListingsStatusEnum.closed }, false)).toEqual({
        label: "Applications Closed",
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
          false
        )
      ).toEqual({
        label: "First Come First Serve",
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
          true
        )
      ).toEqual({
        label: "Under Construction",
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
          false
        )
      ).toEqual({
        label: "Applications Closed",
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
          false
        )
      ).toEqual({
        label: "Open Waitlist",
        variant: "secondary",
      })
    })
  })

  describe("getListingStatusMessageContent", () => {
    it("should return correctly with under construction and marketing enabled", () => {
      expect(
        getListingStatusMessageContent(
          ListingsStatusEnum.active,
          dayjs(new Date()).add(5, "days").toDate(),
          true,
          MarketingTypeEnum.comingSoon,
          MarketingSeasonEnum.spring,
          new Date(2026, 1, 1),
          false
        )
      ).toEqual("Residents should apply in Spring 2026")
    })
    it("should return correctly under with construction and marketing disabled", () => {
      const result = getListingStatusMessageContent(
        ListingsStatusEnum.active,
        dayjs(new Date()).add(5, "days").hour(10).minute(30).toDate(),
        false,
        MarketingTypeEnum.comingSoon,
        MarketingSeasonEnum.spring,
        new Date(2026, 1, 1, 10, 30, 0),
        false
      )
      expect(result).toContain("Application Due:")
      expect(result).toContain("10:30AM")
    })
    it("should return date but hide time", () => {
      const result = getListingStatusMessageContent(
        ListingsStatusEnum.active,
        dayjs(new Date()).add(5, "days").hour(10).minute(30).toDate(),
        false,
        MarketingTypeEnum.comingSoon,
        MarketingSeasonEnum.spring,
        new Date(2026, 1, 1, 10, 30, 0),
        true
      )
      expect(result).toContain("Application Due:")
      expect(result).not.toContain("10:30AM")
    })
  })
  it("should return correctly for closed listing", () => {
    expect(
      getListingStatusMessageContent(
        ListingsStatusEnum.closed,
        dayjs(new Date()).subtract(5, "days").toDate(),
        false,
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
        null,
        null,
        null,
        false
      )
    ).toEqual("Applications Open")
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
      expect(view.getByText("Applications Closed")).toBeDefined()
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
})
