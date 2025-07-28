import React from "react"
import dayjs from "dayjs"
import { render, cleanup } from "@testing-library/react"
import { listing, jurisdiction } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import {
  FeatureFlag,
  FeatureFlagEnum,
  ListingsStatusEnum,
  MarketingSeasonEnum,
  MarketingTypeEnum,
  ReviewOrderTypeEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { Availability } from "../../../../src/components/listing/listing_sections/Availability"

afterEach(cleanup)

describe("<Availability>", () => {
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
    expect(view.getByText("Applications Closed")).toBeDefined()
    expect(view.getByText("Availability")).toBeDefined()
    expect(view.getByText("Reserved Building")).toBeDefined()
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
    expect(view.getByText("Applications Closed")).toBeDefined()
    expect(view.getByText("Availability")).toBeDefined()
    expect(view.getByText("First Come First Serve")).toBeDefined()
    expect(view.queryByText("Vacant Units Available")).toBeNull()
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
    expect(view.queryByText("Applications Closed")).toBeNull()
    expect(view.getByText("Availability")).toBeDefined()
    expect(view.getByText("First Come First Serve")).toBeDefined()
    expect(view.getByText("Vacant Units Available")).toBeDefined()
    expect(view.getByText("Application Due:", { exact: false })).toBeDefined()
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
    expect(view.getByText("Applications Closed")).toBeDefined()
    expect(view.getByText("Availability")).toBeDefined()
    expect(view.getByText("Lottery")).toBeDefined()
    expect(view.queryByText("Vacant Units Available")).toBeNull()
    expect(view.queryByText("Application Due:", { exact: false })).toBeNull()
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
    expect(view.queryByText("Applications Closed")).toBeNull()
    expect(view.getByText("Availability")).toBeDefined()
    expect(view.getByText("Lottery")).toBeDefined()
    expect(view.getByText("Vacant Units Available")).toBeDefined()
    expect(view.getByText("Application Due:", { exact: false })).toBeDefined()
    expect(view.getByText(dayjs(dueDate).format("MMM DD, YYYY"), { exact: false })).toBeDefined()
    expect(
      view.getByText(
        "Applicants will be reviewed in lottery rank order until all vacancies are filled."
      )
    ).toBeDefined()
    expect(view.getByText("100 units")).toBeDefined()
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
    expect(view.getByText("Applications Closed")).toBeDefined()
    expect(view.getByText("Availability")).toBeDefined()
    expect(view.getByText("Waitlist")).toBeDefined()
    expect(view.queryByText("Waitlist is open")).toBeNull()
    expect(view.queryByText("Open Waitlist Slots")).toBeNull()
    expect(view.queryByText("Application Due:", { exact: false })).toBeNull()
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
    expect(view.queryByText("Applications Closed")).toBeNull()
    expect(view.getByText("Availability")).toBeDefined()
    expect(view.getByText("Waitlist")).toBeDefined()
    expect(view.getByText("Waitlist is open")).toBeDefined()
    expect(view.queryByText("Open Waitlist Slots")).toBeNull()
    expect(view.getByText("Application Due:", { exact: false })).toBeDefined()
    expect(view.getByText(dayjs(dueDate).format("MMM DD, YYYY"), { exact: false })).toBeDefined()
    expect(view.getByText("Submit an application for an open slot on the waitlist.")).toBeDefined()
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
    expect(view.getByText("Applications Closed")).toBeDefined()
    expect(view.getByText("Availability")).toBeDefined()
    expect(view.getByText("Waitlist")).toBeDefined()
    expect(view.queryByText("Waitlist is open")).toBeNull()
    expect(view.queryByText("Open Waitlist Slots")).toBeNull()
    expect(view.queryByText("Application Due:", { exact: false })).toBeNull()
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
    expect(view.queryByText("Applications Closed")).toBeNull()
    expect(view.getByText("Availability")).toBeDefined()
    expect(view.getByText("Waitlist")).toBeDefined()
    expect(view.getByText("Waitlist is open")).toBeDefined()
    expect(view.queryByText("Open Waitlist Slots")).toBeNull()
    expect(view.queryByText("Application Due:", { exact: false })).toBeNull()
    expect(view.getByText("Applications Open")).toBeDefined()
    expect(view.getByText("Submit an application for an open slot on the waitlist.")).toBeDefined()
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
    expect(view.getByText("Applications Closed")).toBeDefined()
    expect(view.getByText("Availability")).toBeDefined()
    expect(view.getByText("Waitlist")).toBeDefined()
    expect(view.queryByText("Waitlist is open")).toBeNull()
    expect(view.getByText("50 open waitlist slots")).toBeDefined()
    expect(view.queryByText("Application Due:", { exact: false })).toBeNull()
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
    expect(view.queryByText("Applications Closed")).toBeNull()
    expect(view.getByText("Availability")).toBeDefined()
    expect(view.getByText("Waitlist")).toBeDefined()
    expect(view.getByText("Waitlist is open")).toBeDefined()
    expect(view.getByText("50 open waitlist slots")).toBeDefined()
    expect(view.queryByText("Application Due:", { exact: false })).toBeNull()
    expect(view.getByText("Applications Open")).toBeDefined()
    expect(view.getByText("Submit an application for an open slot on the waitlist.")).toBeDefined()
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
          marketingDate: new Date(2026, 1, 1, 10, 30, 0),
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
    expect(view.queryByText("Under Construction")).toBeNull()
    expect(view.getByText("First Come First Serve")).toBeDefined()
    expect(view.getByText("Vacant Units Available")).toBeDefined()
    expect(view.getByText("Application Due:", { exact: false })).toBeDefined()
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
          marketingDate: new Date(2026, 1, 1, 10, 30, 0),
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
    expect(view.getAllByText("Under Construction").length).toBe(2)
    expect(view.queryByText("First Come First Serve")).toBeNull()
    expect(view.queryByText("Vacant Units Available")).toBeNull()
    expect(view.getByText("Residents should apply in Spring 2026")).toBeDefined()
    expect(view.queryByText("Application Due:", { exact: false })).toBeNull()
    expect(
      view.getByText(
        "Eligible applicants will be contacted on a first come first serve basis until vacancies are filled."
      )
    ).toBeDefined()
  })
})
