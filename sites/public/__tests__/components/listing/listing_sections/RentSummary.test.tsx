import React from "react"
import { render, cleanup, screen, within } from "@testing-library/react"
import { RentSummary } from "../../../../src/components/listing/listing_sections/RentSummary"
import { listing } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import {
  EnumListingListingType,
  ReviewOrderTypeEnum,
  UnitTypeEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"

afterEach(cleanup)

describe("<RentSummary>", () => {
  it("shows all content for one percentage", () => {
    render(
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
    expect(screen.getAllByText("Rent").length).toBeGreaterThan(0)
    expect(screen.getByText("Unit type")).toBeDefined()
    expect(screen.getByText("Minimum income")).toBeDefined()
    expect(screen.getByText("Availability")).toBeDefined()
    expect(screen.queryByText("Section 8 Housing Choice Voucher")).toBeNull()
  })
  it("shows all content for multiple percentages", () => {
    render(
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
    expect(screen.getAllByText("Rent").length).toBeGreaterThan(0)
    expect(screen.getByText("30% AMI unit")).toBeDefined()
    expect(screen.getByText("60% AMI unit")).toBeDefined()
    expect(screen.getAllByText("Unit type").length).toBe(2)
    expect(screen.getAllByText("Minimum income").length).toBe(2)
    expect(screen.getAllByText("Availability").length).toBe(2)
    expect(screen.getByText("Section 8 Housing Choice Voucher")).toBeDefined()
  })
  it("shows nothing if no data", () => {
    render(
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
    expect(screen.queryByText("Rent")).toBeNull()
  })
  it("shows all content for non-regulated listings", () => {
    render(
      <RentSummary
        amiValues={[]}
        reviewOrderType={ReviewOrderTypeEnum.firstComeFirstServe}
        unitsSummarized={null}
        listing={{
          ...listing,
          listingType: EnumListingListingType.nonRegulated,
          unitGroupsSummarized: {
            unitGroupSummary: [
              {
                unitTypes: [
                  {
                    id: "unit_type_id_1",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    name: UnitTypeEnum.studio,
                    numBedrooms: 0,
                  },
                ],
                rentRange: {
                  min: "$2000",
                  max: "$2000",
                },
                openWaitlist: false,
                unitVacancies: 5,
                bathroomRange: {
                  min: 1,
                  max: 1,
                },
                floorRange: {
                  min: null,
                  max: null,
                },
                sqFeetRange: {
                  min: null,
                  max: null,
                },
                amiPercentageRange: null,
              },
              {
                unitTypes: [
                  {
                    id: "unit_type_id_2",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    name: UnitTypeEnum.oneBdrm,
                    numBedrooms: 1,
                  },
                  {
                    id: "unit_type_id_3",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    name: UnitTypeEnum.twoBdrm,
                    numBedrooms: 2,
                  },
                ],
                rentRange: {
                  min: "$200",
                  max: "$700",
                },
                openWaitlist: false,
                unitVacancies: null,
                bathroomRange: {
                  min: null,
                  max: null,
                },
                floorRange: {
                  min: null,
                  max: null,
                },
                sqFeetRange: {
                  min: null,
                  max: null,
                },
                amiPercentageRange: null,
              },
            ],
            householdMaxIncomeSummary: {
              columns: {
                householdSize: "householdSize",
                "30": 30,
              },
              rows: [
                {
                  householdSize: "1",
                  "30": 36000,
                },
                {
                  householdSize: "2",
                  "30": 48000,
                },
                {
                  householdSize: "3",
                  "30": 60000,
                },
              ],
            },
          },
        }}
        section8Acceptance={false}
      />
    )

    const rentTable = screen.getByRole("table")
    expect(rentTable).toBeInTheDocument()

    const [head, body] = within(rentTable).getAllByRole("rowgroup")

    const tableHeaders = within(head).getAllByRole("columnheader")
    expect(tableHeaders).toHaveLength(3)

    const [unitTypeHeader, rentHeader, availabilityHeader] = tableHeaders
    expect(unitTypeHeader).toHaveTextContent(/unit type/i)
    expect(rentHeader).toHaveTextContent(/rent/i)
    expect(availabilityHeader).toHaveTextContent(/availability/i)

    const rows = within(body).getAllByRole("row")
    expect(rows).toHaveLength(2)

    const [firstUnitType, firstRent, firstAvailability] = within(rows[0]).getAllByRole("cell")
    expect(firstUnitType).toHaveTextContent(/studio/i)
    expect(firstRent).toHaveTextContent(/\$2000/i)
    expect(firstAvailability).toHaveTextContent(/5 vacant units/i)

    const [secondUnitType, secondRent, secondAvailability] = within(rows[1]).getAllByRole("cell")
    expect(secondUnitType).toHaveTextContent(/1 BR, 2 BR/i)
    expect(secondRent).toHaveTextContent(/\$200.*\$700/i)
    expect(secondAvailability).not.toHaveTextContent()
  })
})
