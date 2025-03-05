/* eslint-disable import/no-named-as-default */
import React from "react"
import { setupServer } from "msw/node"
import { fireEvent, mockNextRouter, render, waitFor, within } from "../../testUtils"
import { rest } from "msw"
import { application, listing, user } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import ApplicationsList from "../../../src/pages/application/[id]"
import {
  AlternateContactRelationship,
  LanguagesEnum,
  UnitTypeEnum,
  YesNoEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { ApplicationContext } from "../../../src/components/applications/ApplicationContext"
import DetailsApplicationData from "../../../src/components/applications/PaperApplicationDetails/sections/DetailsApplicationData"
import DetailsPrimaryApplicant from "../../../src/components/applications/PaperApplicationDetails/sections/DetailsPrimaryApplicant"
import DetailsAlternateContact from "../../../src/components/applications/PaperApplicationDetails/sections/DetailsAlternateContact"
import DetailsHouseholdDetails from "../../../src/components/applications/PaperApplicationDetails/sections/DetailsHouseholdDetails"
import DetailsHouseholdIncome from "../../../src/components/applications/PaperApplicationDetails/sections/DetailsHouseholdIncome"
import DetailsTerms from "../../../src/components/applications/PaperApplicationDetails/sections/DetailsTerms"
import DetailsHouseholdMembers from "../../../src/components/applications/PaperApplicationDetails/sections/DetailsHouseholdMembers"

const server = setupServer()

beforeAll(() => {
  server.listen()
})

beforeEach(() => {
  document.cookie = "access-token-available=True"
  server.use(
    rest.get("http://localhost/api/adapter/listings/Uvbk5qurpB2WI9V6WnNdH", (_req, res, ctx) => {
      return res(ctx.json(listing))
    }),
    rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
      return res(ctx.json(user))
    }),
    rest.delete("http://localhost/api/adapter/applications", (_req, res, ctx) => {
      return res(ctx.json({}))
    })
  )
})

afterEach(() => {
  server.resetHandlers()
  window.sessionStorage.clear()
})

afterAll(() => {
  server.close()
})

describe("partners_application_index", () => {
  it("should return null on no application", () => {
    mockNextRouter({ id: "application_1" })
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost:3100/applications/application_1", (_req, res, ctx) => {
        return res(ctx.json({}))
      })
    )

    const { container } = render(<ApplicationsList />)
    expect(container.firstChild).toBeNull()
  })

  it("should display proper submission status", async () => {
    mockNextRouter({ id: "application_1" })

    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost:3100/applications/application_1", (_req, res, ctx) => {
        return res(ctx.json(application))
      })
    )

    const { findByText } = render(<ApplicationsList />)
    const submissionStatus = await findByText("Submitted")
    expect(submissionStatus).toBeInTheDocument()
  })

  it("should display Application Data section info", () => {
    const { getByText } = render(
      <AuthContext.Provider
        value={{
          profile: { ...user, listings: [], jurisdictions: [] },
        }}
      >
        <ApplicationContext.Provider
          value={{
            ...application,
            language: LanguagesEnum.es,
            submissionDate: new Date("January 28, 2025 13:09:00"),
          }}
        >
          <DetailsApplicationData />
        </ApplicationContext.Provider>
      </AuthContext.Provider>
    )

    expect(getByText("Application Data")).toBeInTheDocument()
    expect(getByText("Confirmation Code")).toBeInTheDocument()
    expect(getByText("ABCD1234")).toBeInTheDocument()
    expect(getByText("Application Submission Type")).toBeInTheDocument()
    expect(getByText("Electronic")).toBeInTheDocument()
    expect(getByText("Application Submitted Date")).toBeInTheDocument()
    expect(getByText("1/28/2025")).toBeInTheDocument()
    expect(getByText("Application Submitted Time")).toBeInTheDocument()
    expect(getByText("1:09:00 PM UTC")).toBeInTheDocument()
    expect(getByText("Application Language")).toBeInTheDocument()
    expect(getByText("Español")).toBeInTheDocument()
    expect(getByText("Total Household Size")).toBeInTheDocument()
    expect(getByText("2")).toBeInTheDocument()
    expect(getByText("Submitted By")).toBeInTheDocument()
    expect(getByText("Applicant First Applicant Last")).toBeInTheDocument()
  })

  it("should display Primary Applicant section info", () => {
    const { getByText, getAllByText } = render(
      <ApplicationContext.Provider value={application}>
        <DetailsPrimaryApplicant />
      </ApplicationContext.Provider>
    )

    expect(getByText("Primary Applicant")).toBeInTheDocument()
    expect(getByText("First Name")).toBeInTheDocument()
    expect(getByText("Middle Name")).toBeInTheDocument()
    expect(getByText("Last Name")).toBeInTheDocument()
    expect(getByText("Date of Birth")).toBeInTheDocument()
    expect(getByText("Email")).toBeInTheDocument()
    expect(getByText("Phone")).toBeInTheDocument()
    expect(getByText("Second Phone")).toBeInTheDocument()
    expect(getByText("Residence Address")).toBeInTheDocument()
    expect(getByText("Mailing Address")).toBeInTheDocument()
    expect(getAllByText("Street Address")).toHaveLength(2)
    expect(getAllByText("Apt or Unit #")).toHaveLength(2)
    expect(getAllByText("City")).toHaveLength(2)
    expect(getAllByText("State")).toHaveLength(2)
    expect(getAllByText("Zip Code")).toHaveLength(2)
  })

  it("should display no contact Alternate Contact section info", () => {
    const { getByText, queryByText, getAllByText } = render(
      <ApplicationContext.Provider
        value={{
          ...application,
          alternateContact: {
            id: application.alternateContact.id,
            createdAt: application.alternateContact.createdAt,
            updatedAt: application.alternateContact.updatedAt,
            type: AlternateContactRelationship.noContact,
            address: application.alternateContact.address,
          },
        }}
      >
        <DetailsAlternateContact />
      </ApplicationContext.Provider>
    )

    expect(getByText("Alternate Contact")).toBeInTheDocument()
    expect(getByText("First Name")).toBeInTheDocument()
    expect(getByText("Last Name")).toBeInTheDocument()
    expect(getByText("Relationship")).toBeInTheDocument()
    expect(getByText("I don't have an alternate contact")).toBeInTheDocument()
    expect(getByText("Agency if Applicable")).toBeInTheDocument()
    expect(getByText("Email")).toBeInTheDocument()
    expect(getByText("Phone")).toBeInTheDocument()
    expect(getAllByText("n/a")).toHaveLength(5)
    expect(queryByText("Address")).not.toBeInTheDocument()
    expect(queryByText("Street Address")).not.toBeInTheDocument()
    expect(queryByText("Apt or Unit #")).not.toBeInTheDocument()
    expect(queryByText("City")).not.toBeInTheDocument()
    expect(queryByText("State")).not.toBeInTheDocument()
    expect(queryByText("Zip Code")).not.toBeInTheDocument()
  })

  it("should display family member Alterante Contact sction info", () => {
    const { getByText } = render(
      <ApplicationContext.Provider
        value={{
          ...application,
          alternateContact: {
            ...application.alternateContact,
            type: AlternateContactRelationship.familyMember,
            address: {
              ...application.alternateContact.address,
              street2: "25",
            },
          },
        }}
      >
        <DetailsAlternateContact />
      </ApplicationContext.Provider>
    )

    expect(getByText("Alternate Contact")).toBeInTheDocument()
    expect(getByText("First Name")).toBeInTheDocument()
    expect(getByText("Alternate First")).toBeInTheDocument()
    expect(getByText("Last Name")).toBeInTheDocument()
    expect(getByText("Alternate Last")).toBeInTheDocument()
    expect(getByText("Relationship")).toBeInTheDocument()
    expect(getByText("Family member")).toBeInTheDocument()
    expect(getByText("Agency if Applicable")).toBeInTheDocument()
    expect(getByText("Alternate Agency")).toBeInTheDocument()
    expect(getByText("Email")).toBeInTheDocument()
    expect(getByText("alternate@email.com")).toBeInTheDocument()
    expect(getByText("Phone")).toBeInTheDocument()
    expect(getByText("(789) 012-3456")).toBeInTheDocument()
    expect(getByText("Address")).toBeInTheDocument()
    expect(getByText("Street Address")).toBeInTheDocument()
    expect(getByText("25 Visitor Center Rd")).toBeInTheDocument()
    expect(getByText("Apt or Unit #")).toBeInTheDocument()
    expect(getByText("25")).toBeInTheDocument()
    expect(getByText("City")).toBeInTheDocument()
    expect(getByText("Bay Harbor")).toBeInTheDocument()
    expect(getByText("State")).toBeInTheDocument()
    expect(getByText("ME")).toBeInTheDocument()
    expect(getByText("Zip Code")).toBeInTheDocument()
  })

  it("should display Houshold Members section table", () => {
    const { getByText, getAllByText } = render(
      <ApplicationContext.Provider value={application}>
        {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
        <DetailsHouseholdMembers setMembersDrawer={() => {}} />
      </ApplicationContext.Provider>
    )

    expect(getByText("Household Members")).toBeInTheDocument()
    expect(getByText("Name")).toBeInTheDocument()
    expect(getByText("Household First Household Last")).toBeInTheDocument()
    expect(getByText("Relationship")).toBeInTheDocument()
    expect(getByText("Friend")).toBeInTheDocument()
    expect(getByText("Date of Birth")).toBeInTheDocument()
    expect(getByText("11/25/1966")).toBeInTheDocument()
    expect(getByText("Same Residence")).toBeInTheDocument()
    expect(getByText("No")).toBeInTheDocument()
    expect(getAllByText("View")).toHaveLength(1)
  })

  it("should display Houshold Details info", () => {
    const { getByText } = render(
      <ApplicationContext.Provider
        value={{
          ...application,
          householdExpectingChanges: true,
          preferredUnitTypes: [
            {
              id: "unit",
              createdAt: new Date(),
              updatedAt: new Date(),
              name: UnitTypeEnum.studio,
              numBedrooms: 1,
            },
          ],
          accessibility: {
            ...application.accessibility,
            vision: true,
          },
        }}
      >
        <DetailsHouseholdDetails />
      </ApplicationContext.Provider>
    )

    expect(getByText("Household Details")).toBeInTheDocument()
    expect(getByText("Preferred Unit Sizes")).toBeInTheDocument()
    expect(getByText("Studio")).toBeInTheDocument()
    expect(getByText("Expecting Household Changes")).toBeInTheDocument()
    expect(getByText("Yes")).toBeInTheDocument()
    expect(getByText("Household Includes Student or Member Nearing 18")).toBeInTheDocument()
    expect(getByText("No")).toBeInTheDocument()
    expect(getByText("ADA Priorities Selected")).toBeInTheDocument()
    expect(getByText("For Vision Impairments")).toBeInTheDocument()
  })

  it("should display Declared Houshold Income info", () => {
    mockNextRouter({ id: "application_1" })
    const { getByText } = render(
      <ApplicationContext.Provider
        value={{
          ...application,
          incomeVouchers: ["issuedVouchers", "none", "rentalAssistance"],
        }}
      >
        <DetailsHouseholdIncome />
      </ApplicationContext.Provider>
    )

    expect(getByText("Declared Household Income")).toBeInTheDocument()
    expect(getByText("Annual Income")).toBeInTheDocument()
    expect(getByText("$40,000")).toBeInTheDocument()
    expect(getByText("Monthly Income")).toBeInTheDocument()
    expect(getByText("n/a")).toBeInTheDocument()
    expect(getByText("Issued Vouchers or Rental Assistance")).toBeInTheDocument()
    expect(
      getByText(
        /Section 8 or Housing Authority Issued Vouchers(.*)None of the above(.*)Rental assistance from other sources/
      )
    ).toBeInTheDocument()
  })

  it("should display Terms section info", () => {
    const { getByText } = render(
      <ApplicationContext.Provider value={application}>
        <DetailsTerms />
      </ApplicationContext.Provider>
    )

    expect(getByText("Signature on Terms of Agreement")).toBeInTheDocument()
    expect(getByText("No")).toBeInTheDocument()
  })

  it("should display configured edit button", async () => {
    mockNextRouter({ id: "application_1" })

    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost:3100/applications/application_1", (_req, res, ctx) => {
        return res(ctx.json(application))
      })
    )

    const { findByText } = render(<ApplicationsList />)
    const editButton = await findByText("Edit")
    expect(editButton).toHaveAttribute("href", "/application/application_1/edit")
  })

  it("should delete application data", async () => {
    const { pushMock } = mockNextRouter({ id: "application_1" })

    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost:3100/applications/application_1", (_req, res, ctx) => {
        return res(ctx.json(application))
      })
    )

    const { findByText, getByText, queryByText, queryByTestId } = render(<ApplicationsList />)

    // Verify that the deletion confirmation modal is not visible
    expect(queryByText("Delete this application?")).not.toBeInTheDocument()
    expect(
      queryByText(
        "Deleting this application means you will lose all the information you've entered."
      )
    ).not.toBeInTheDocument()
    expect(queryByText("Cancel")).not.toBeInTheDocument()
    expect(queryByTestId("deleteConfirm")).not.toBeInTheDocument()

    const deleteButton = await findByText("Delete")
    fireEvent.click(deleteButton)

    expect(getByText("Delete this application?")).toBeInTheDocument()
    const modalElement = getByText("Delete this application?").parentElement.parentElement
    expect(
      getByText("Deleting this application means you will lose all the information you've entered.")
    ).toBeInTheDocument()
    expect(within(modalElement).getByText("Cancel")).toBeInTheDocument()

    const deleteConfirmButton = within(modalElement).getByText("Delete")
    expect(deleteConfirmButton).toBeInTheDocument()
    fireEvent.click(deleteConfirmButton)
    await waitFor(() =>
      expect(pushMock).toHaveBeenCalledWith("/listings/Uvbk5qurpB2WI9V6WnNdH/applications")
    )
  })

  it("should open Houshold Member Drawer only base data", async () => {
    mockNextRouter({ id: "application_1" })
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost:3100/applications/application_1", (_req, res, ctx) => {
        return res(
          ctx.json({
            ...application,
            householdMember: [
              {
                ...application.householdMember[0],
                sameAddress: YesNoEnum.yes,
                workInRegion: YesNoEnum.no,
              },
            ],
          })
        )
      })
    )

    const { getByText, findByText, queryByText } = render(<ApplicationsList />)
    const housholdMembersSection = await findByText("Household Members")
    expect(housholdMembersSection).toBeInTheDocument()
    expect(queryByText("Household Member")).not.toBeInTheDocument()
    expect(queryByText("Household Member Details")).not.toBeInTheDocument()
    expect(queryByText("Done")).not.toBeInTheDocument()

    const viewButton = await waitFor(() =>
      within(housholdMembersSection.parentElement).getByText("View")
    )
    expect(viewButton).toBeInTheDocument()

    fireEvent.click(viewButton)

    expect(getByText("Household Member")).toBeInTheDocument()
    expect(getByText("Done")).toBeInTheDocument()

    expect(getByText("Household Member Details")).toBeInTheDocument()
    const householdMemberDetailsSection = getByText("Household Member Details").parentElement
    expect(within(householdMemberDetailsSection).getByText("First Name")).toBeInTheDocument()
    expect(within(householdMemberDetailsSection).getByText("Household First")).toBeInTheDocument()
    expect(within(householdMemberDetailsSection).getByText("Middle Name")).toBeInTheDocument()
    expect(within(householdMemberDetailsSection).getByText("n/a")).toBeInTheDocument()
    expect(within(householdMemberDetailsSection).getByText("Last Name")).toBeInTheDocument()
    expect(within(householdMemberDetailsSection).getByText("Household Last")).toBeInTheDocument()
    expect(within(householdMemberDetailsSection).getByText("Date of Birth")).toBeInTheDocument()
    expect(within(householdMemberDetailsSection).getByText("11/25/1966")).toBeInTheDocument()
    expect(
      within(householdMemberDetailsSection).getByText("Same Address as Primary")
    ).toBeInTheDocument()
    expect(within(householdMemberDetailsSection).getAllByText("Yes")).toHaveLength(1)
    expect(within(householdMemberDetailsSection).getByText("Relationship")).toBeInTheDocument()
    expect(within(householdMemberDetailsSection).getByText("Friend")).toBeInTheDocument()

    expect(
      within(householdMemberDetailsSection).queryByText("Residence Address")
    ).not.toBeInTheDocument()
  })

  it("should open Houshold Member Drawer with residance address only", async () => {
    mockNextRouter({ id: "application_1" })
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost:3100/applications/application_1", (_req, res, ctx) => {
        return res(
          ctx.json({
            ...application,
            householdMember: [
              {
                ...application.householdMember[0],
                sameAddress: YesNoEnum.no,
                workInRegion: YesNoEnum.no,
              },
            ],
          })
        )
      })
    )

    const { getByText, findByText, queryByText } = render(<ApplicationsList />)
    const housholdMembersSection = await findByText("Household Members")
    expect(housholdMembersSection).toBeInTheDocument()
    expect(queryByText("Household Member")).not.toBeInTheDocument()
    expect(queryByText("Household Member Details")).not.toBeInTheDocument()
    expect(queryByText("Done")).not.toBeInTheDocument()

    const viewButton = await waitFor(() =>
      within(housholdMembersSection.parentElement).getByText("View")
    )
    expect(viewButton).toBeInTheDocument()

    fireEvent.click(viewButton)

    expect(getByText("Household Member")).toBeInTheDocument()
    expect(getByText("Done")).toBeInTheDocument()

    expect(getByText("Household Member Details")).toBeInTheDocument()
    const householdMemberDetailsSection = getByText("Household Member Details").parentElement

    expect(within(householdMemberDetailsSection).getByText("Residence Address")).toBeInTheDocument()
    expect(within(householdMemberDetailsSection).getByText("Street Address")).toBeInTheDocument()
    expect(within(householdMemberDetailsSection).getByText("25 E Center St")).toBeInTheDocument()
    expect(within(householdMemberDetailsSection).getByText("Apt or Unit #")).toBeInTheDocument()
    expect(within(householdMemberDetailsSection).getAllByText("n/a")).toHaveLength(2)
    expect(within(householdMemberDetailsSection).getByText("City")).toBeInTheDocument()
    expect(within(householdMemberDetailsSection).getByText("Moab")).toBeInTheDocument()
    expect(within(householdMemberDetailsSection).getByText("State")).toBeInTheDocument()
    expect(within(householdMemberDetailsSection).getByText("UT")).toBeInTheDocument()
    expect(within(householdMemberDetailsSection).getByText("Zip Code")).toBeInTheDocument()
    expect(within(householdMemberDetailsSection).getByText("84532")).toBeInTheDocument()
  })
})
