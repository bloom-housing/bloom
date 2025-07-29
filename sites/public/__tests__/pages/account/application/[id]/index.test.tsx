import React from "react"
import { setupServer } from "msw/lib/node"
import { mockNextRouter, render, screen, waitFor, within } from "../../../../testUtils"
import ApplicationView from "../../../../../src/pages/account/application/[id]/index"
import { application, listing, user } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { rest } from "msw"
import { AuthContext } from "@bloom-housing/shared-helpers"
import {
  ApplicationsService,
  ListingsService,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import userEvent from "@testing-library/user-event"

const server = setupServer()

beforeAll(() => {
  mockNextRouter({ id: "application_1" })
  server.listen()
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})

const renderApplicationView = () =>
  render(
    <AuthContext.Provider
      value={{
        profile: {
          ...user,
          listings: [],
          jurisdictions: [],
        },
        applicationsService: new ApplicationsService(),
        listingsService: new ListingsService(),
        doJurisdictionsHaveFeatureFlagOn: () => false,
      }}
    >
      <ApplicationView />
    </AuthContext.Provider>
  )

describe("Account Listing View", () => {
  it("should show no application error state", async () => {
    server.use(
      rest.get("http://localhost:3100/applications/application_1", (_req, res, ctx) => {
        return res(ctx.status(404))
      })
    )

    // Prevent the network console error on 404 status to avoid confusion
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    jest.spyOn(console, "error").mockImplementation(() => {})
    renderApplicationView()

    expect(await screen.findByRole("heading", { level: 1, name: /error/i })).toBeInTheDocument()
    expect(screen.getByText(/no application with that id exists/i)).toBeInTheDocument()
    const backButton = screen.getByRole("link", { name: /return to applications/i })
    expect(backButton).toBeInTheDocument()
    expect(backButton).toHaveAttribute("href", "/account/applications")
  })

  it("should show unauthorized error state", async () => {
    server.use(
      rest.get("http://localhost:3100/applications/application_1", (_req, res, ctx) => {
        return res(ctx.status(403))
      })
    )

    // Prevent the network console error on 403 status to avoid confusion
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    jest.spyOn(console, "error").mockImplementation(() => {})
    renderApplicationView()

    expect(await screen.findByRole("heading", { level: 1, name: /error/i })).toBeInTheDocument()
    expect(screen.getByText(/you are unauthorized to view this application/i)).toBeInTheDocument()
    const backButton = screen.getByRole("link", { name: /return to applications/i })
    expect(backButton).toBeInTheDocument()
    expect(backButton).toHaveAttribute("href", "/account/applications")
  })

  it("should render all application details", async () => {
    server.use(
      rest.get("http://localhost:3100/applications/application_1", (_req, res, ctx) => {
        return res(
          ctx.json({
            ...application,
            contactPreferences: ["email"],
            accessibility: {
              createdAt: new Date(),
              updatedAt: new Date(),
              id: "accessibility_id",
              mobility: true,
              vision: true,
              hearing: true,
            },
          })
        )
      }),
      rest.get("http://localhost/api/adapter/listings/Uvbk5qurpB2WI9V6WnNdH", (_req, res, ctx) => {
        return res(ctx.json(listing))
      })
    )

    renderApplicationView()

    // Listing heading
    expect(
      await screen.findByRole("heading", { level: 1, name: /archer studios/i })
    ).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /view the original listing/i })).toBeInTheDocument()

    // Application Heading
    const backButton = screen.getByRole("link", { name: /^back$/i })
    expect(backButton).toBeInTheDocument()
    expect(backButton).toHaveAttribute("href", "/account/applications")
    expect(
      screen.getByRole("heading", { level: 2, name: /here's the information you submitted./i })
    ).toBeInTheDocument()
    expect(screen.getByText(/submitted:/i)).toBeInTheDocument()
    expect(screen.getByText(/december 2, 2021/i)).toBeInTheDocument()
    expect(screen.getByText(/your confirmation number is:/i)).toBeInTheDocument()
    expect(screen.getByText("ABCD1234")).toBeInTheDocument()

    // --------------------------- Applicant Section ------------------------------------
    expect(screen.getByRole("heading", { level: 3, name: /you/i })).toBeInTheDocument()

    const applicantNameSection = screen.getByTestId("app-summary-applicant-name")
    expect(applicantNameSection).toBeInTheDocument()
    expect(within(applicantNameSection).getByText(/name/i)).toBeInTheDocument()
    expect(
      within(applicantNameSection).getByText(/Applicant First Applicant Middle Applicant Last/i)
    ).toBeInTheDocument()

    const applicantDobSection = screen.getByTestId("app-summary-applicant-dob")
    expect(applicantDobSection).toBeInTheDocument()
    expect(within(applicantDobSection).getByText(/date of birth/i)).toBeInTheDocument()
    expect(within(applicantDobSection).getByText(/10\/10\/1990/i)).toBeInTheDocument()

    const applicantPhoneSection = screen.getByTestId("app-summary-applicant-phone")
    expect(applicantPhoneSection).toBeInTheDocument()
    expect(within(applicantPhoneSection).getByText(/phone/i)).toBeInTheDocument()
    expect(within(applicantPhoneSection).getByText(/\(123\) 123-1231/i)).toBeInTheDocument()

    const applicantAdditionalPhoneSection = screen.getByTestId(
      "app-summary-applicant-additional-phone"
    )
    expect(applicantAdditionalPhoneSection).toBeInTheDocument()
    expect(
      within(applicantAdditionalPhoneSection).getByText(/additional phone/i)
    ).toBeInTheDocument()
    expect(
      within(applicantAdditionalPhoneSection).getByText(/\(456\) 456-4564/i)
    ).toBeInTheDocument()

    const applicantEmailSection = screen.getByTestId("app-summary-applicant-email")
    expect(applicantEmailSection).toBeInTheDocument()
    expect(within(applicantEmailSection).getByText(/email/i)).toBeInTheDocument()
    expect(within(applicantEmailSection).getByText(/first.last@example\.com/i)).toBeInTheDocument()

    const applicantAddressSection = screen.getByTestId("app-summary-applicant-address")
    expect(applicantAddressSection).toBeInTheDocument()
    expect(within(applicantAddressSection).getByText(/address/i)).toBeInTheDocument()
    expect(
      within(applicantAddressSection).getByText(/3200 Old Faithful Inn Rd/i)
    ).toBeInTheDocument()

    const applicantMailingAddressSection = screen.getByTestId(
      "app-summary-applicant-mailing-address"
    )
    expect(applicantMailingAddressSection).toBeInTheDocument()
    expect(within(applicantMailingAddressSection).getByText(/mailing address/i)).toBeInTheDocument()
    expect(within(applicantMailingAddressSection).getByText(/1000 US-36/i)).toBeInTheDocument()
    expect(
      within(applicantMailingAddressSection).getByText(/estes park, CO 80517/i)
    ).toBeInTheDocument()

    // Work address not in Doorway
    // const applicantWorkAddressSection = screen.getByTestId("app-summary-applicant-work-address")
    // expect(applicantWorkAddressSection).toBeInTheDocument()
    // expect(within(applicantWorkAddressSection).getByText(/work address/i)).toBeInTheDocument()
    // expect(within(applicantWorkAddressSection).getByText(/9035 village dr/i)).toBeInTheDocument()
    // expect(
    //   within(applicantWorkAddressSection).getByText(/yosemite valley, CA 95389/i)
    // ).toBeInTheDocument()

    // contact preference not in doorway
    // const contactPreferenceSection = screen.getByTestId("app-summary-contact-preference-type")
    // expect(contactPreferenceSection).toBeInTheDocument()
    // expect(
    //   within(contactPreferenceSection).getByText(/preferred contact type/i)
    // ).toBeInTheDocument()
    // expect(within(contactPreferenceSection).getByText(/email/i)).toBeInTheDocument()

    // --------------------------- Alternate Contact ------------------------------------

    expect(
      screen.getByRole("heading", { level: 3, name: /alternate contact/i })
    ).toBeInTheDocument()

    const alternateNameSection = screen.getByTestId("app-summary-alternate-name")
    expect(alternateNameSection).toBeInTheDocument()
    expect(within(alternateNameSection).getByText(/name/i)).toBeInTheDocument()
    expect(
      within(alternateNameSection).getByText(/Alternate First Alternate Last/i)
    ).toBeInTheDocument()

    const alternateEmailSection = screen.getByTestId("app-summary-alternate-email")
    expect(alternateEmailSection).toBeInTheDocument()
    expect(within(alternateEmailSection).getByText(/^email$/i)).toBeInTheDocument()
    expect(within(alternateEmailSection).getByText(/alternate@email\.com/i)).toBeInTheDocument()

    const alternatePhoneSection = screen.getByTestId("app-summary-alternate-phone")
    expect(alternatePhoneSection).toBeInTheDocument()
    expect(within(alternatePhoneSection).getByText(/phone/i)).toBeInTheDocument()
    expect(within(alternatePhoneSection).getByText(/\(789\) 012-3456/i)).toBeInTheDocument()

    const alternateMailingAddressSection = screen.getByTestId(
      "app-summary-alternate-mailing-address"
    )
    expect(alternateMailingAddressSection).toBeInTheDocument()
    expect(within(alternateMailingAddressSection).getByText(/address/i)).toBeInTheDocument()
    expect(
      within(alternateMailingAddressSection).getByText(/acadia national park/i)
    ).toBeInTheDocument()
    expect(
      within(alternateMailingAddressSection).getByText(/25 visitor center rd /i)
    ).toBeInTheDocument()
    expect(
      within(alternateMailingAddressSection).getByText(/bay harbor, me 04609/i)
    ).toBeInTheDocument()

    // --------------------------- Household Details ------------------------------------

    expect(
      screen.getByRole("heading", { level: 3, name: /household details/i })
    ).toBeInTheDocument()

    const preferredUnitTypeSection = screen.getByTestId("app-summary-preferred-units")
    expect(preferredUnitTypeSection).toBeInTheDocument()
    expect(within(preferredUnitTypeSection).getByText(/preferred unit type/i)).toBeInTheDocument()
    expect(within(preferredUnitTypeSection).getByText(/studio, 1 bedroom/i)).toBeInTheDocument()

    const adaAccessibleUnitsSection = screen.getByTestId("app-summary-ada")
    expect(adaAccessibleUnitsSection).toBeInTheDocument()
    expect(within(adaAccessibleUnitsSection).getByText(/ada accessible units/i)).toBeInTheDocument()
    expect(
      within(adaAccessibleUnitsSection).getByTestId("For Vision Impairments")
    ).toBeInTheDocument()
    expect(
      within(adaAccessibleUnitsSection).getByTestId("For Hearing Impairments")
    ).toBeInTheDocument()
    expect(
      within(adaAccessibleUnitsSection).getByTestId("For Mobility Impairments")
    ).toBeInTheDocument()

    const householdChangesSection = screen.getByTestId("app-summary-household-changes")
    expect(householdChangesSection).toBeInTheDocument()
    expect(
      within(householdChangesSection).getByText(/expecting household changes/i)
    ).toBeInTheDocument()
    expect(within(householdChangesSection).getByText(/yes/i)).toBeInTheDocument()

    const householdStudentSection = screen.getByTestId("app-summary-household-student")
    expect(householdStudentSection).toBeInTheDocument()
    expect(
      within(householdStudentSection).getByText(/household includes student or member nearing 18/i)
    ).toBeInTheDocument()
    expect(within(householdStudentSection).getByText(/no/i)).toBeInTheDocument()

    // --------------------------- Programs ------------------------------------

    expect(screen.getByRole("heading", { level: 3, name: /programs/i })).toBeInTheDocument()

    const vetranSection = screen.getByTestId("Veteran")
    expect(within(vetranSection).getByText(/veteran/i)).toBeInTheDocument()
    expect(within(vetranSection).getByText(/prefer not to say/i)).toBeInTheDocument()

    // --------------------------- Income ------------------------------------

    expect(screen.getByRole("heading", { level: 3, name: /income/i })).toBeInTheDocument()

    const vouchersSection = screen.getByTestId("app-summary-income-vouchers")
    expect(vouchersSection).toBeInTheDocument()
    expect(
      within(vouchersSection).getByText(/housing voucher or rental subsidy/i)
    ).toBeInTheDocument()
    expect(within(vouchersSection).getByText(/yes/i)).toBeInTheDocument()

    const incomeSection = screen.getByTestId("app-summary-income")
    expect(incomeSection).toBeInTheDocument()
    expect(within(incomeSection).getByText(/income/i)).toBeInTheDocument()
    expect(within(incomeSection).getByText(/40,000.00/i)).toBeInTheDocument()
    expect(within(incomeSection).getByText(/per year/i)).toBeInTheDocument()

    // --------------------------- Preferences ------------------------------------

    expect(screen.getByRole("heading", { level: 3, name: /preferences/i })).toBeInTheDocument()

    const workInCitySection1 = screen.getAllByTestId("Work in the city")[0]
    expect(workInCitySection1).toBeInTheDocument()
    expect(within(workInCitySection1).getByText(/^work in the city$/i)).toBeInTheDocument()
    expect(
      within(workInCitySection1).getByText(/at least one member of my household works in the city/i)
    ).toBeInTheDocument()

    // Second "Work in the city" section
    const workInCitySection2 = screen.getAllByTestId("Work in the city")[1]
    expect(workInCitySection2).toBeInTheDocument()
    expect(within(workInCitySection2).getByText(/^work in the city$/i)).toBeInTheDocument()
    expect(
      within(workInCitySection2).getByText(/all members of the household work in the city/i)
    ).toBeInTheDocument()

    // City Employees section
    const cityEmployeesSection = screen.getByTestId("City Employees")
    expect(cityEmployeesSection).toBeInTheDocument()
    expect(within(cityEmployeesSection).getByText(/city employees/i)).toBeInTheDocument()
    expect(
      within(cityEmployeesSection).getByText(
        /at least one member of my household is a city employee/i
      )
    ).toBeInTheDocument()

    // Card Footer
    expect(
      screen.getByRole("button", { name: /print a copy for your records/i })
    ).toBeInTheDocument()
  })

  it("should run window print on button click", async () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const windowSpy = jest.spyOn(window, "print").mockImplementation(() => {})

    server.use(
      rest.get("http://localhost:3100/applications/application_1", (_req, res, ctx) => {
        return res(ctx.json(application))
      }),
      rest.get("http://localhost/api/adapter/listings/Uvbk5qurpB2WI9V6WnNdH", (_req, res, ctx) => {
        return res(ctx.json(listing))
      })
    )

    renderApplicationView()

    const printButton = await screen.findByRole("button", {
      name: /print a copy for your records/i,
    })
    expect(printButton).toBeInTheDocument()

    await userEvent.click(printButton)
    await waitFor(() => {
      expect(windowSpy).toHaveBeenCalled()
    })
  })
})
