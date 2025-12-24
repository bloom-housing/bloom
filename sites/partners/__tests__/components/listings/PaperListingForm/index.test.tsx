import React from "react"
import { act, fireEvent, screen, within } from "@testing-library/react"
import { setupServer } from "msw/lib/node"
import { rest } from "msw"
import { AuthContext } from "@bloom-housing/shared-helpers"
import {
  jurisdiction,
  mockBaseJurisdiction,
  mockUser,
} from "@bloom-housing/shared-helpers/__tests__/testHelpers"
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
      { name: FeatureFlagEnum.enableWhatToExpectAdditionalField, active: true } as FeatureFlag,
    ],
    whatToExpect: "Here's what you might expect from the process.",
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
          getJurisdictionLanguages: () => [],
        }}
      >
        <ListingForm jurisdictionId={"Bloomington"} />
      </AuthContext.Provider>
    )

    // Listing Details Tab
    expect(screen.getByRole("button", { name: "Listing details" }))
    expect(screen.getByRole("heading", { level: 2, name: "Listing intro" }))
    expect(screen.getByRole("heading", { level: 2, name: "Listing photos" }))
    expect(screen.getByRole("heading", { level: 2, name: "Building details" }))
    expect(screen.getByRole("heading", { level: 2, name: "Listing units" }))
    expect(screen.getByRole("heading", { level: 2, name: "Housing preferences" }))
    expect(screen.getByRole("heading", { level: 2, name: "Housing programs" }))
    expect(screen.getByRole("heading", { level: 2, name: "Additional fees" }))
    expect(screen.getByRole("heading", { level: 2, name: "Building features" }))
    expect(screen.getByRole("heading", { level: 2, name: "Additional eligibility rules" }))
    expect(screen.getByRole("heading", { level: 2, name: "Additional details" }))

    // Application Process tab
    expect(screen.getByRole("button", { name: "Application process" }))
    expect(screen.getByRole("heading", { level: 2, name: "Rankings & results" }))
    expect(screen.getByRole("heading", { level: 2, name: "Leasing agent" }))
    expect(screen.getByRole("heading", { level: 2, name: "Application types" }))
    expect(screen.getByRole("heading", { level: 2, name: "Application address" }))
    expect(screen.getByRole("heading", { level: 2, name: "Application dates" }))

    // Action buttons
    expect(screen.getByRole("button", { name: "Publish" }))
    expect(screen.getByRole("button", { name: "Save as draft" }))
    expect(screen.getByRole("button", { name: "Exit" }))
  })

  it("should render rich text field", async () => {
    window.URL.createObjectURL = jest.fn()
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(
          ctx.json({ id: "user1", userRoles: { id: "user1", isAdmin: true, isPartner: false } })
        )
      }),
      rest.get(
        "http://localhost/api/adapter/jurisdictions/67c22813-6080-441d-a496-03f2d06f2635",
        (_req, res, ctx) => {
          return res(ctx.json(jurisdiction))
        }
      ),
      rest.get("http://localhost:3100/reservedCommunityTypes", (_req, res, ctx) => {
        return res(ctx.json([]))
      }),
      rest.get("http://localhost:3100/multiselectQuestions", (_req, res, ctx) => {
        return res(ctx.json([]))
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
              case FeatureFlagEnum.enableWhatToExpectAdditionalField:
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
        <ListingForm jurisdictionId={"Bloomington"} />
      </AuthContext.Provider>
    )

    expect(screen.getByText("Rankings & results")).toBeInTheDocument()

    const whatToExpectEditorLabel = screen.getByText(
      /tell the applicant what to expect from the process/i
    )
    expect(whatToExpectEditorLabel).toBeInTheDocument()
    const whatToExpectEditorWrapper =
      whatToExpectEditorLabel.parentElement.parentElement.parentElement

    expect(
      await within(whatToExpectEditorWrapper).findByRole("menuitem", { name: "Bold" })
    ).toBeInTheDocument()
    expect(
      within(whatToExpectEditorWrapper).getByRole("menuitem", { name: "Bullet list" })
    ).toBeInTheDocument()
    expect(
      within(whatToExpectEditorWrapper).getByRole("menuitem", { name: "Numbered list" })
    ).toBeInTheDocument()
    expect(
      within(whatToExpectEditorWrapper).getByRole("menuitem", { name: "Line break" })
    ).toBeInTheDocument()
    expect(
      within(whatToExpectEditorWrapper).getByRole("menuitem", { name: "Set link" })
    ).toBeInTheDocument()
    expect(
      within(whatToExpectEditorWrapper).getByRole("menuitem", { name: "Unlink" })
    ).toBeInTheDocument()

    expect(
      within(whatToExpectEditorWrapper).getByText("Here's what you might expect from the process.")
    ).toBeInTheDocument()

    expect(
      within(whatToExpectEditorWrapper).getByText("You have 954 characters remaining")
    ).toBeInTheDocument()

    // Query issue: https://github.com/ueberdosis/tiptap/discussions/4008#discussioncomment-7623655
    const editor = screen.getByTestId("whatToExpect").firstElementChild.querySelector("p")
    act(() => {
      fireEvent.change(editor, {
        target: { textContent: "Custom what to expect text" },
      })
    })
    expect(
      within(whatToExpectEditorWrapper).getByText("Custom what to expect text")
    ).toBeInTheDocument()

    const whatToExpectAdditonalTextEditorLabel = screen.getByText(
      /Tell the applicant any additional information/i
    )
    expect(whatToExpectAdditonalTextEditorLabel).toBeInTheDocument()
    const whatToExpectAdditonalTextEditorWrapper =
      whatToExpectAdditonalTextEditorLabel.parentElement.parentElement

    expect(
      await within(whatToExpectAdditonalTextEditorWrapper).findByRole("menuitem", { name: "Bold" })
    ).toBeInTheDocument()
    expect(
      within(whatToExpectAdditonalTextEditorWrapper).getByRole("menuitem", { name: "Bullet list" })
    ).toBeInTheDocument()
    expect(
      within(whatToExpectAdditonalTextEditorWrapper).getByRole("menuitem", {
        name: "Numbered list",
      })
    ).toBeInTheDocument()
    expect(
      within(whatToExpectAdditonalTextEditorWrapper).getByRole("menuitem", { name: "Line break" })
    ).toBeInTheDocument()
    expect(
      within(whatToExpectAdditonalTextEditorWrapper).getByRole("menuitem", { name: "Set link" })
    ).toBeInTheDocument()
    expect(
      within(whatToExpectAdditonalTextEditorWrapper).getByRole("menuitem", { name: "Unlink" })
    ).toBeInTheDocument()

    expect(
      within(whatToExpectAdditonalTextEditorWrapper).getByText(
        "Property staff should walk you through the process to get on their waitlist."
      )
    ).toBeInTheDocument()

    expect(
      within(whatToExpectAdditonalTextEditorWrapper).getByText("You have 473 characters remaining")
    ).toBeInTheDocument()

    // Query issue: https://github.com/ueberdosis/tiptap/discussions/4008#discussioncomment-7623655
    const whatToExpectAdditonalTextEditor = screen
      .getByTestId("whatToExpectAdditionalText")
      .firstElementChild.querySelector("p")
    act(() => {
      fireEvent.change(whatToExpectAdditonalTextEditor, {
        target: { textContent: "Custom what to expect additional text" },
      })
    })
    expect(
      within(whatToExpectAdditonalTextEditorWrapper).getByText(
        "Custom what to expect additional text"
      )
    ).toBeInTheDocument()
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
        <ListingForm jurisdictionId={"Bloomington"} />
      </AuthContext.Provider>
    )

    const requiredFields = ["Listing name"]

    const unrequiredFields = [
      "Housing developer",
      "Photos",
      "Street address",
      "Neighborhood",
      "City",
      "State",
      "Zip code",
      "Year built",
      "Reserved community type",
      "Reserved community description",
      "Units",
      "Application fee",
      "Deposit helper text",
      "Costs not included",
      "Property amenities",
      "Additional accessibility",
      "Unit amenities",
      "Smoking policy",
      "Parking fee",
      "Pets policy",
      "Services offered",
      "Credit history",
      "Rental history",
      "Criminal background",
      "Rental assistance",
      "Required documents",
      "Important program rules",
      "Special notes",
      "Tell the applicant what to expect from the process",
      "Leasing agent name",
      "Email",
      "Phone",
      "Leasing agent title",
      "Company website",
      "Office hours",
      "Street address or PO box",
      "Is there a digital application?",
      "Is there a paper application?",
      "Is there a referral opportunity?",
      "Additional application submission notes",
      "Application due date",
      "Application due time",
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
              case FeatureFlagEnum.enableParkingFee:
                return jurisdictionsService
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
        <ListingForm jurisdictionId={"Bloomington"} />
      </AuthContext.Provider>
    )

    const possibleRequiredFields = [
      "Listing name",
      "Housing developer",
      "Photos",
      "Street address",
      "Neighborhood",
      "City",
      "State",
      "Zip code",
      "Region",
      "Year built",
      "Reserved community type",
      "Reserved community description",
      "Home type",
      "Units",
      "Application fee",
      "Deposit helper text",
      "Costs not included",
      "Property amenities",
      "Additional accessibility",
      "Unit amenities",
      "Smoking policy",
      "Pets policy",
      "Services offered",
      "Credit history",
      "Rental history",
      "Criminal background",
      "Rental assistance",
      "Required documents",
      "Important program rules",
      "Special notes",
      "Tell the applicant what to expect from the process",
      "Leasing agent name",
      "Email",
      "Phone",
      "Leasing agent title",
      "Company website",
      "Office hours",
      "Street address or PO box",
      "Is there a digital application?",
      "Is there a paper application?",
      "Is there a referral opportunity?",
      "Additional application submission notes",
      "Application due date",
    ]

    possibleRequiredFields.forEach((fieldName) => {
      const query = screen.getAllByText(fieldName)
      expect(query[0]).toHaveTextContent(`${fieldName} *`)
    })
  })
})
