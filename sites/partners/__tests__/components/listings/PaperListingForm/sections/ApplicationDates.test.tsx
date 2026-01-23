import React from "react"
import { setupServer } from "msw/node"
import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { FormProviderWrapper, mockNextRouter, render } from "../../../../testUtils"
import { FormListing } from "../../../../../src/lib/listings/formTypes"
import ApplicationDates from "../../../../../src/components/listings/PaperListingForm/sections/ApplicationDates"

const server = setupServer()

// Enable API mocking before tests.
beforeAll(() => {
  server.listen()
  mockNextRouter()
})

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers())

// Disable API mocking after the tests are done.
afterAll(() => server.close())

describe("ApplicationDates", () => {
  it("should render the ApplicationDates section with default fields", () => {
    render(
      <FormProviderWrapper>
        <ApplicationDates
          enableMarketingStatus={false}
          enableMarketingStatusMonths={false}
          listing={{} as unknown as FormListing}
          requiredFields={[]}
          openHouseEvents={[]}
          setOpenHouseEvents={() => {
            return
          }}
        />
      </FormProviderWrapper>
    )
    expect(screen.getByRole("heading", { level: 2, name: "Application dates" })).toBeInTheDocument()
    expect(
      screen.getByText("Tell us about important dates related to this listing.")
    ).toBeInTheDocument()
    expect(screen.getByRole("group", { name: "Application due date" })).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: "Month" })).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: "Day" })).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: "Year" })).toBeInTheDocument()
    expect(screen.getByRole("group", { name: "Application due time" })).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: "Hour" })).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: "minutes" })).toBeInTheDocument()
    expect(screen.getByRole("combobox", { name: "time" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "AM" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "PM" })).toBeInTheDocument()
    expect(screen.getByText("When applications close to the public")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Add open house" })).toBeInTheDocument()
    expect(screen.queryByText("Marketing status")).not.toBeInTheDocument()
  })

  it("should mark due date as required", () => {
    render(
      <FormProviderWrapper>
        <ApplicationDates
          enableMarketingStatus={false}
          enableMarketingStatusMonths={false}
          listing={{} as unknown as FormListing}
          requiredFields={["applicationDueDate"]}
          openHouseEvents={[]}
          setOpenHouseEvents={() => {
            return
          }}
        />
      </FormProviderWrapper>
    )

    expect(screen.getByRole("group", { name: "Application due date *" })).toBeInTheDocument()
    expect(screen.getByRole("group", { name: "Application due time *" })).toBeInTheDocument()
  })

  it("should show marketing status section with seasons", async () => {
    render(
      <FormProviderWrapper>
        <ApplicationDates
          enableMarketingStatus={true}
          enableMarketingStatusMonths={false}
          listing={{} as unknown as FormListing}
          requiredFields={[]}
          openHouseEvents={[]}
          setOpenHouseEvents={() => {
            return
          }}
        />
      </FormProviderWrapper>
    )
    await screen.findByRole("group", { name: "Marketing status" })
    expect(screen.getByRole("group", { name: "Marketing status" })).toBeInTheDocument()
    expect(screen.getByRole("radio", { name: "Marketing" })).toBeInTheDocument()
    const underConstructionOpen = screen.getByRole("radio", { name: "Under construction" })
    await userEvent.click(underConstructionOpen)
    expect(screen.getByRole("group", { name: "Marketing start date" })).toBeInTheDocument()
    expect(screen.getByRole("combobox", { name: "Season" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "Spring" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "Summer" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "Fall" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "Winter" })).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: "Marketing year" })).toBeInTheDocument()
    expect(screen.queryByRole("textbox", { name: "Marketing month" })).not.toBeInTheDocument()
    expect(
      screen.getByText("When the opportunity becomes available to the public")
    ).toBeInTheDocument()
  })

  it("should show marketing status section with months", async () => {
    render(
      <FormProviderWrapper>
        <ApplicationDates
          enableMarketingStatus={true}
          enableMarketingStatusMonths={true}
          listing={{} as unknown as FormListing}
          requiredFields={[]}
          openHouseEvents={[]}
          setOpenHouseEvents={() => {
            return
          }}
        />
      </FormProviderWrapper>
    )
    await screen.findByRole("group", { name: "Marketing status" })
    expect(screen.getByRole("group", { name: "Marketing status" })).toBeInTheDocument()
    expect(screen.getByRole("radio", { name: "Marketing" })).toBeInTheDocument()
    const underConstructionOpen = screen.getByRole("radio", { name: "Under construction" })
    await userEvent.click(underConstructionOpen)
    expect(screen.getByRole("group", { name: "Marketing start date" })).toBeInTheDocument()
    expect(screen.queryByRole("combobox", { name: "Season" })).not.toBeInTheDocument()
    expect(screen.getByRole("combobox", { name: "Month" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "January" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "February" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "March" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "April" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "May" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "June" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "July" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "August" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "September" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "October" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "November" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "December" })).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: "Marketing year" })).toBeInTheDocument()
    expect(
      screen.getByText("When the opportunity becomes available to the public")
    ).toBeInTheDocument()
  })

  it("should not show marketing section unless both feature flags are on", () => {
    render(
      <FormProviderWrapper>
        <ApplicationDates
          enableMarketingStatus={false}
          enableMarketingStatusMonths={true}
          listing={{} as unknown as FormListing}
          requiredFields={[]}
          openHouseEvents={[]}
          setOpenHouseEvents={() => {
            return
          }}
        />
      </FormProviderWrapper>
    )
    expect(screen.queryByText("Marketing status")).not.toBeInTheDocument()
  })
})
