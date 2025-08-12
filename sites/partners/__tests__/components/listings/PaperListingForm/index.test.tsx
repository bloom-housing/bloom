import React from "react"
import { act, fireEvent, screen } from "@testing-library/react"
import { setupServer } from "msw/lib/node"
import { rest } from "msw"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { mockBaseJurisdiction, mockUser } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import {
  FeatureFlag,
  FeatureFlagEnum,
  Jurisdiction,
  JurisdictionsService,
  LanguagesEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import ListingForm from "../../../../src/components/listings/PaperListingForm"
import { mockNextRouter, mockTipTapEditor, render } from "../../../testUtils"

const server = setupServer()

const jurisdictions = [
  {
    ...mockBaseJurisdiction,
    id: "Bloomington",
    name: "Bloomington",
    featureFlags: [
      { name: FeatureFlagEnum.enableRegions, active: true } as FeatureFlag,
      { name: FeatureFlagEnum.enableHomeType, active: true } as FeatureFlag,
      { name: FeatureFlagEnum.enableCompanyWebsite, active: true } as FeatureFlag,
    ],
    requiredListingFields: [
      "listingsBuildingAddress",
      "name",
      "developer",
      "listingImages",
      "leasingAgentEmail",
      "leasingAgentName",
      "leasingAgentPhone",
      "jurisdictions",
      "units",
      "digitalApplication",
      "paperApplication",
      "referralOpportunity",
      "rentalAssistance",
      "neighborhood",
      "yearBuilt",
      "reservedCommunityTypes",
      "reservedCommunityDescription",
      "communityDisclaimerTitle",
      "disableUnitsAccordion",
      "homeType",
      "applicationFee",
      "depositMin",
      "depositMax",
      "depositHelperText",
      "costsNotIncluded",
      "amenities",
      "accessibility",
      "unitAmenities",
      "smokingPolicy",
      "petPolicy",
      "servicesOffered",
      "creditHistory",
      "rentalHistory",
      "criminalBackground",
      "requiredDocuments",
      "programRules",
      "specialNotes",
      "whatToExpect",
      "leasingAgentTitle",
      "managementWebsite",
      "leasingAgentOfficeHours",
      "listingsLeasingAgentAddress",
      "additionalApplicationSubmissionNotes",
      "applicationDueDate",
      "region",
    ],
  },
]

const getJurisdictionLanguages = () => {
  return [LanguagesEnum.en]
}

beforeAll(() => {
  server.listen()
  mockNextRouter()
  mockTipTapEditor()
})

afterEach(() => {
  server.resetHandlers()
  window.sessionStorage.clear()
})

afterAll(() => server.close())

describe("add listing", () => {
  it("should render the add listing page", () => {
    window.URL.createObjectURL = jest.fn()
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(
          ctx.json({ id: "user1", userRoles: { id: "user1", isAdmin: true, isPartner: false } })
        )
      }),
      rest.get("http://localhost:3100/reservedCommunityTypes", (_req, res, ctx) => {
        return res(ctx.json([]))
      }),
      rest.get("http://localhost:3100/multiselectQuestions", (_req, res, ctx) => {
        return res(ctx.json([]))
      })
    )
    render(
      <AuthContext.Provider
        value={{
          doJurisdictionsHaveFeatureFlagOn: (featureFlag: FeatureFlagEnum) => {
            switch (featureFlag) {
              case FeatureFlagEnum.swapCommunityTypeWithPrograms:
                return false
              default:
                return false
            }
          },
        }}
      >
        <ListingForm />
      </AuthContext.Provider>
    )

    // Listing Details Tab
    expect(screen.getByRole("button", { name: "Listing Details" }))
    expect(screen.getByRole("heading", { level: 2, name: "Listing Intro" }))
    expect(screen.getByRole("heading", { level: 2, name: "Listing Photo" }))
    expect(screen.getByRole("heading", { level: 2, name: "Building Details" }))
    expect(screen.getByRole("heading", { level: 2, name: "Listing Units" }))
    expect(screen.getByRole("heading", { level: 2, name: "Housing Preferences" }))
    expect(screen.getByRole("heading", { level: 2, name: "Housing Programs" }))
    expect(screen.getByRole("heading", { level: 2, name: "Additional Fees" }))
    expect(screen.getByRole("heading", { level: 2, name: "Building Features" }))
    expect(screen.getByRole("heading", { level: 2, name: "Additional Eligibility Rules" }))
    expect(screen.getByRole("heading", { level: 2, name: "Additional Details" }))

    // Application Process tab
    expect(screen.getByRole("button", { name: "Application Process" }))
    expect(screen.getByRole("heading", { level: 2, name: "Rankings & Results" }))
    expect(screen.getByRole("heading", { level: 2, name: "Leasing Agent" }))
    expect(screen.getByRole("heading", { level: 2, name: "Application Types" }))
    expect(screen.getByRole("heading", { level: 2, name: "Application Address" }))
    expect(screen.getByRole("heading", { level: 2, name: "Application Dates" }))

    // Action buttons
    expect(screen.getByRole("button", { name: "Publish" }))
    expect(screen.getByRole("button", { name: "Save as Draft" }))
    expect(screen.getByRole("button", { name: "Exit" }))
  })

  it("should render rich text field", () => {
    window.URL.createObjectURL = jest.fn()
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(
          ctx.json({ id: "user1", userRoles: { id: "user1", isAdmin: true, isPartner: false } })
        )
      }),
      rest.get("http://localhost:3100/reservedCommunityTypes", (_req, res, ctx) => {
        return res(ctx.json([]))
      }),
      rest.get("http://localhost:3100/multiselectQuestions", (_req, res, ctx) => {
        return res(ctx.json([]))
      })
    )
    render(
      <AuthContext.Provider
        value={{
          doJurisdictionsHaveFeatureFlagOn: (featureFlag: FeatureFlagEnum) => {
            switch (featureFlag) {
              case FeatureFlagEnum.swapCommunityTypeWithPrograms:
                return false
              default:
                return false
            }
          },
        }}
      >
        <ListingForm />
      </AuthContext.Provider>
    )
    expect(screen.getByText("Rankings & Results")).toBeInTheDocument()
    expect(
      screen.getByText(
        "Applicants will be contacted by the property agent in rank order until vacancies are filled. All of the information that you have provided will be verified and your eligibility confirmed. Your application will be removed from the waitlist if you have made any fraudulent statements. If we cannot verify a housing preference that you have claimed, you will not receive the preference but will not be otherwise penalized. Should your application be chosen, be prepared to fill out a more detailed application and provide required supporting documents."
      )
    ).toBeInTheDocument()
    expect(screen.getByText("You have 451 characters remaining")).toBeInTheDocument()
    expect(screen.getByRole("menuitem", { name: "Bold" })).toBeInTheDocument()
    expect(screen.getByRole("menuitem", { name: "Bullet list" })).toBeInTheDocument()
    expect(screen.getByRole("menuitem", { name: "Numbered list" })).toBeInTheDocument()
    expect(screen.getByRole("menuitem", { name: "Line break" })).toBeInTheDocument()
    expect(screen.getByRole("menuitem", { name: "Set link" })).toBeInTheDocument()
    expect(screen.getByRole("menuitem", { name: "Unlink" })).toBeInTheDocument()
    // Query issue: https://github.com/ueberdosis/tiptap/discussions/4008#discussioncomment-7623655
    const editor = screen.getByTestId("whatToExpect").firstElementChild.querySelector("p")
    act(() => {
      fireEvent.change(editor, {
        target: { textContent: "Custom what to expect text" },
      })
    })
    expect(screen.getByText("Custom what to expect text")).toBeInTheDocument()
  })

  it.todo("should successfully save and show correct toast")
  it.todo("should open the save before exit dialog when exiting")
  it.todo("should open the close listing dialog when closing listing")
  it.todo("should open the publish listing dialog when publishing listing")
  it.todo("should open the live confirmation dialog when listing is already active")
  it.todo("should open the listing approval dialog when submitting for approval")
  it.todo("should open the request changes dialog when requesting changes")

  it("without selected jurisdiction, show asterisks only on always-required fields", () => {
    window.URL.createObjectURL = jest.fn()
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(
          ctx.json({
            id: "user1",
            userRoles: { id: "user1", isAdmin: true, isPartner: false },
            jurisdictions,
          })
        )
      }),
      rest.get("http://localhost:3100/reservedCommunityTypes", (_req, res, ctx) => {
        return res(ctx.json([]))
      }),
      rest.get("http://localhost:3100/multiselectQuestions", (_req, res, ctx) => {
        return res(ctx.json([]))
      }),
      rest.get("http://localhost/api/adapter/jurisdictions", (_req, res, ctx) => {
        return res(ctx.json(jurisdictions))
      })
    )

    const mockRetrieve = jest.fn().mockResolvedValue({})

    render(
      <AuthContext.Provider
        value={{
          doJurisdictionsHaveFeatureFlagOn: (featureFlag: FeatureFlagEnum) => {
            switch (featureFlag) {
              case FeatureFlagEnum.enableRegions:
                return true
              case FeatureFlagEnum.enableHomeType:
                return true
              case FeatureFlagEnum.enableCompanyWebsite:
                return true
              default:
                return false
            }
          },
          getJurisdictionLanguages,
          jurisdictionsService: {
            retrieve: mockRetrieve,
          } as unknown as JurisdictionsService,
        }}
      >
        <ListingForm />
      </AuthContext.Provider>
    )

    const requiredFields = ["Listing Name", "Jurisdiction"]

    const unrequiredFields = [
      "Housing Developer",
      "Photos",
      "Street Address",
      "Neighborhood",
      "City",
      "State",
      "Zip Code",
      "Year Built",
      "Reserved Community Type",
      "Reserved Community Description",
      "Units",
      "Application Fee",
      "Deposit Min",
      "Deposit Max",
      "Deposit Helper Text",
      "Costs Not Included",
      "Property Amenities",
      "Additional Accessibility",
      "Unit Amenities",
      "Smoking Policy",
      "Pets Policy",
      "Services Offered",
      "Credit History",
      "Rental History",
      "Criminal Background",
      "Rental Assistance",
      "Required Documents",
      "Important Program Rules",
      "Special Notes",
      "Tell the applicant what to expect from the process",
      "Leasing Agent Name",
      "Email",
      "Phone",
      "Leasing Agent Title",
      "Company Website",
      "Office Hours",
      "Street Address or PO Box",
      "Is there a digital application?",
      "Is there a paper application?",
      "Additional Application Submission Notes",
      "Application Due Date",
      "Application Due Time",
    ]

    requiredFields.forEach((fieldName) => {
      const query = screen.getAllByText(fieldName)
      expect(query[0]).toHaveTextContent(`${fieldName} *`)
    })

    unrequiredFields.forEach((fieldName) => {
      const query = screen.getAllByText(fieldName)
      expect(query[0].textContent).not.toContain("*")
    })
  })

  it("show asterisks on every possible configurable required field", () => {
    window.URL.createObjectURL = jest.fn()
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(
          ctx.json({
            id: "user1",
            userRoles: { id: "user1", isAdmin: true, isPartner: false },
            jurisdictions,
          })
        )
      }),
      rest.get("http://localhost:3100/reservedCommunityTypes", (_req, res, ctx) => {
        return res(ctx.json([]))
      }),
      rest.get("http://localhost:3100/multiselectQuestions", (_req, res, ctx) => {
        return res(ctx.json([]))
      }),
      rest.get("http://localhost/api/adapter/jurisdictions", (_req, res, ctx) => {
        return res(ctx.json(jurisdictions))
      })
    )
    const mockRetrieve = jest.fn().mockResolvedValue({})

    render(
      <AuthContext.Provider
        value={{
          doJurisdictionsHaveFeatureFlagOn: (featureFlag: FeatureFlagEnum) => {
            switch (featureFlag) {
              case FeatureFlagEnum.enableRegions:
                return true
              case FeatureFlagEnum.enableHomeType:
                return true
              case FeatureFlagEnum.enableCompanyWebsite:
                return true
              default:
                return false
            }
          },
          getJurisdictionLanguages,
          profile: {
            ...mockUser,
            listings: [],
            jurisdictions: jurisdictions as Jurisdiction[],
            userRoles: {
              isAdmin: true,
            },
          },
          jurisdictionsService: {
            retrieve: mockRetrieve,
          } as unknown as JurisdictionsService,
        }}
      >
        <ListingForm />
      </AuthContext.Provider>
    )

    const possibleRequiredFields = [
      "Listing Name",
      "Jurisdiction",
      "Housing Developer",
      "Photos",
      "Street Address",
      "Neighborhood",
      "City",
      "State",
      "Zip Code",
      "Region",
      "Year Built",
      "Reserved Community Type",
      "Reserved Community Description",
      "Home Type",
      "Units",
      "Application Fee",
      "Deposit Min",
      "Deposit Max",
      "Deposit Helper Text",
      "Costs Not Included",
      "Property Amenities",
      "Additional Accessibility",
      "Unit Amenities",
      "Smoking Policy",
      "Pets Policy",
      "Services Offered",
      "Credit History",
      "Rental History",
      "Criminal Background",
      "Rental Assistance",
      "Required Documents",
      "Important Program Rules",
      "Special Notes",
      "Tell the applicant what to expect from the process",
      "Leasing Agent Name",
      "Email",
      "Phone",
      "Leasing Agent Title",
      "Company Website",
      "Office Hours",
      "Street Address or PO Box",
      "Is there a digital application?",
      "Is there a paper application?",
      "Additional Application Submission Notes",
      "Application Due Date",
    ]

    possibleRequiredFields.forEach((fieldName) => {
      const query = screen.getAllByText(fieldName)
      expect(query[0]).toHaveTextContent(`${fieldName} *`)
    })
  })
})
