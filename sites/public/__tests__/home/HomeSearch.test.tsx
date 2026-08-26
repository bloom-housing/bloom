import React from "react"
import userEvent from "@testing-library/user-event"
import {
  FeatureFlag,
  FeatureFlagEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { jurisdiction } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { HomeSearch } from "../../src/components/home/HomeSearch"
import { render, screen, mockNextRouter, waitFor, within } from "../testUtils"

jest.mock("@bloom-housing/shared-helpers", () => {
  const actual = jest.requireActual("@bloom-housing/shared-helpers")
  return {
    ...actual,
    tIfExists: jest.fn(actual.tIfExists),
  }
})

const { tIfExists } = require("@bloom-housing/shared-helpers")
const actualSharedHelpers = jest.requireActual("@bloom-housing/shared-helpers")

beforeAll(() => {
  mockNextRouter()
})

afterEach(() => {
  ;(tIfExists as jest.Mock).mockReset()
  ;(tIfExists as jest.Mock).mockImplementation(actualSharedHelpers.tIfExists)
})

describe("<HomeSearch>", () => {
  it("shows the filter fields on the 'Search by filter' tab", () => {
    render(<HomeSearch jurisdiction={jurisdiction} />)
    expect(screen.getByRole("tab", { name: "Search by filter" })).toBeInTheDocument()
    expect(screen.getByRole("combobox", { name: "Bedrooms" })).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: "Max rent" })).toBeInTheDocument()
    expect(
      screen.getByRole("checkbox", { name: "Show available units only (hide waitlists)" })
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "View listings" })).toBeInTheDocument()
    expect(screen.queryByLabelText("Listing name")).not.toBeInTheDocument()
  })

  it("shows the property fields on the 'Search by property' tab", async () => {
    render(<HomeSearch jurisdiction={jurisdiction} />)
    await userEvent.click(screen.getByRole("tab", { name: "Search by property" }))

    expect(screen.getByRole("textbox", { name: "Listing name" })).toBeInTheDocument()
    expect(
      screen.getByRole("checkbox", { name: "Show available units only (hide waitlists)" })
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "View listings" })).toBeInTheDocument()
    expect(screen.queryByLabelText("Bedrooms")).not.toBeInTheDocument()
    expect(screen.queryByLabelText("Max rent")).not.toBeInTheDocument()
  })

  it("shows the county field when enableFilterByCounty is true", () => {
    render(
      <HomeSearch
        jurisdiction={{
          ...jurisdiction,
          featureFlags: [
            { name: FeatureFlagEnum.enableFilterByCounty, active: true } as FeatureFlag,
          ],
          subJurisdictions: [
            { id: "county-1", name: "County 1" },
            { id: "county-2", name: "County 2" },
            { id: "county-3", name: "County 3" },
          ],
        }}
      />
    )
    const countySelect = screen.getByRole("combobox", { name: "County" })
    expect(countySelect).toBeInTheDocument()
    expect(within(countySelect).getByRole("option", { name: "County 1" })).toBeInTheDocument()
    expect(within(countySelect).getByRole("option", { name: "County 2" })).toBeInTheDocument()
    expect(within(countySelect).getByRole("option", { name: "County 3" })).toBeInTheDocument()
  })

  it("does not show the county field when enableFilterByCounty is false", () => {
    render(
      <HomeSearch
        jurisdiction={{
          ...jurisdiction,
          featureFlags: [
            { name: FeatureFlagEnum.enableFilterByCounty, active: false } as FeatureFlag,
          ],
          subJurisdictions: [{ id: "county-1", name: "Alameda" }],
        }}
      />
    )
    expect(screen.queryByLabelText("County")).not.toBeInTheDocument()
  })

  it("shows the welcome.searchSubNote content when the translation key exists", () => {
    ;(tIfExists as jest.Mock).mockReturnValue(
      "For additional listings, go to <a className='lined' href='https://www.exygy.com/' target='_blank'>Exygy</a>"
    )
    render(<HomeSearch jurisdiction={jurisdiction} />)
    expect(screen.getByRole("link", { name: "Exygy" })).toHaveAttribute(
      "href",
      "https://www.exygy.com/"
    )
  })

  it("does not show the welcome.searchSubNote content when the translation key does not exist", () => {
    ;(tIfExists as jest.Mock).mockReturnValue(null)
    render(<HomeSearch jurisdiction={jurisdiction} />)
    expect(screen.queryByRole("link", { name: "Exygy" })).not.toBeInTheDocument()
  })

  it("navigates to /listings with no query params when no filters are selected", async () => {
    const { pushMock } = mockNextRouter()
    render(<HomeSearch jurisdiction={jurisdiction} />)
    await userEvent.click(screen.getByRole("button", { name: "View listings" }))
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/listings")
    })
  })

  it("navigates with the selected bedroom type on the filter tab", async () => {
    const { pushMock } = mockNextRouter()
    render(<HomeSearch jurisdiction={jurisdiction} />)
    await userEvent.selectOptions(screen.getByLabelText("Bedrooms"), "3 Bedrooms")
    await userEvent.click(screen.getByRole("button", { name: "View listings" }))
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith(
        "/listings?bedroomTypes=threeBdrm,fourBdrm,fiveBdrm,sixBdrm,sevenBdrm"
      )
    })
  })

  it("navigates with the entered max rent on the filter tab", async () => {
    const { pushMock } = mockNextRouter()
    render(<HomeSearch jurisdiction={jurisdiction} />)
    await userEvent.type(screen.getByLabelText("Max rent"), "2000")
    await userEvent.click(screen.getByRole("button", { name: "View listings" }))
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/listings?monthlyRent=-2000")
    })
  })

  it("navigates with the availability filter on the filter tab", async () => {
    const { pushMock } = mockNextRouter()
    render(<HomeSearch jurisdiction={jurisdiction} />)
    await userEvent.click(screen.getByLabelText("Show available units only (hide waitlists)"))
    await userEvent.click(screen.getByRole("button", { name: "View listings" }))
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/listings?availabilities=unitsAvailable")
    })
  })

  it("navigates with the listing name and availability filter on the property tab", async () => {
    const { pushMock } = mockNextRouter()
    render(<HomeSearch jurisdiction={jurisdiction} />)
    await userEvent.click(screen.getByRole("tab", { name: "Search by property" }))
    await userEvent.type(screen.getByLabelText("Listing name"), "Test Listing")
    await userEvent.click(screen.getByLabelText("Show available units only (hide waitlists)"))
    await userEvent.click(screen.getByRole("button", { name: "View listings" }))
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith(
        "/listings?name=Test Listing&availabilities=unitsAvailable"
      )
    })
  })

  it("navigates with the selected county on the filter tab", async () => {
    const { pushMock } = mockNextRouter()
    render(
      <HomeSearch
        jurisdiction={{
          ...jurisdiction,
          featureFlags: [
            { name: FeatureFlagEnum.enableFilterByCounty, active: true } as FeatureFlag,
          ],
          subJurisdictions: [
            { id: "county-1", name: "County 1" },
            { id: "county-2", name: "County 2" },
          ],
        }}
      />
    )
    await userEvent.selectOptions(screen.getByLabelText("County"), "County 2")
    await userEvent.click(screen.getByRole("button", { name: "View listings" }))
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/listings?jurisdictions=county-2")
    })
  })
})
