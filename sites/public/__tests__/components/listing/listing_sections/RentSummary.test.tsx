import React from "react"
import { render, cleanup } from "@testing-library/react"
import { RentSummary } from "../../../../src/components/listing/listing_sections/RentSummary"
import { listing } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { ReviewOrderTypeEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

afterEach(cleanup)

describe("<RentSummary>", () => {
  it("shows all content for one percentage", () => {
    const { getAllByText, getByText, queryByText } = render(
      <RentSummary
        amiValues={[30]}
        reviewOrderType={ReviewOrderTypeEnum.firstComeFirstServe}
        unitsSummarized={{
          unitTypes: [],
          priorityTypes: [],
          amiPercentages: [],
          byUnitTypeAndRent: [],
          byUnitType: [],
          byAMI: [],
          hmi: null,
        }}
        listing={listing}
        section8Acceptance={false}
      />
    )
    expect(getAllByText("Rent").length).toBeGreaterThan(0)
    expect(getByText("Unit Type")).toBeDefined()
    expect(getByText("Minimum Income")).toBeDefined()
    expect(getByText("Availability")).toBeDefined()
    expect(queryByText("Section 8 Housing Choice Voucher")).toBeNull()
  })
  it("shows all content for multiple percentages", () => {
    const { getAllByText, getByText } = render(
      <RentSummary
        amiValues={[30, 60]}
        reviewOrderType={ReviewOrderTypeEnum.firstComeFirstServe}
        unitsSummarized={{
          unitTypes: [],
          priorityTypes: [],
          amiPercentages: [],
          byUnitTypeAndRent: [],
          byUnitType: [],
          byAMI: [
            { percent: "30", byUnitType: [] },
            { percent: "60", byUnitType: [] },
          ],
          hmi: null,
        }}
        listing={listing}
        section8Acceptance={true}
      />
    )
    expect(getAllByText("Rent").length).toBeGreaterThan(0)
    expect(getByText("30% AMI Unit")).toBeDefined()
    expect(getByText("60% AMI Unit")).toBeDefined()
    expect(getAllByText("Unit Type").length).toBe(2)
    expect(getAllByText("Minimum Income").length).toBe(2)
    expect(getAllByText("Availability").length).toBe(2)
    expect(getByText("Section 8 Housing Choice Voucher")).toBeDefined()
  })
  it("shows nothing if no data", () => {
    const { queryByText } = render(
      <RentSummary
        amiValues={[]}
        reviewOrderType={ReviewOrderTypeEnum.firstComeFirstServe}
        unitsSummarized={{
          unitTypes: [],
          priorityTypes: [],
          amiPercentages: [],
          byUnitTypeAndRent: [],
          byUnitType: [],
          byAMI: [],
          hmi: null,
        }}
        listing={{ ...listing, units: [] }}
        section8Acceptance={false}
      />
    )
    expect(queryByText("Rent")).toBeNull()
  })
})
