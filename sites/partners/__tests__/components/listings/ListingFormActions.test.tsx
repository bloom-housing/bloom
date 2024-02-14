import React from "react"
import { cleanup } from "@testing-library/react"
import {
  EnumJurisdictionLanguages,
  EnumJurisdictionListingApprovalPermissions,
  Jurisdiction,
  ListingStatus,
  User,
} from "@bloom-housing/backend-core"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { listing } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { ListingContext } from "../../../src/components/listings/ListingContext"
import ListingFormActions, {
  ListingFormActionsType,
} from "../../../src/components/listings/ListingFormActions"
import { mockNextRouter, render } from "../../testUtils"

afterEach(cleanup)

const mockBaseJurisdiction: Jurisdiction = {
  id: "id",
  createdAt: new Date(),
  updatedAt: new Date(),
  name: "San Jose",
  multiselectQuestions: [],
  languages: [EnumJurisdictionLanguages.en],
  publicUrl: "http://localhost:3000",
  emailFromAddress: "Alameda: Housing Bay Area <bloom-no-reply@exygy.dev>",
  rentalAssistanceDefault:
    "Housing Choice Vouchers, Section 8 and other valid rental assistance programs will be considered for this property. In the case of a valid rental subsidy, the required minimum income will be based on the portion of the rent that the tenant pays after use of the subsidy.",
  enablePartnerSettings: true,
  enableAccessibilityFeatures: false,
  enableUtilitiesIncluded: true,
  enableGeocodingPreferences: false,
  enableListingOpportunity: false,
}

const mockAdminOnlyJurisdiction: Jurisdiction = {
  ...mockBaseJurisdiction,
  listingApprovalPermissions: [EnumJurisdictionListingApprovalPermissions.admin],
}

const mockAdminJurisAdminJurisdiction: Jurisdiction = {
  ...mockBaseJurisdiction,
  listingApprovalPermissions: [
    EnumJurisdictionListingApprovalPermissions.admin,
    EnumJurisdictionListingApprovalPermissions.jurisdictionAdmin,
  ],
}

const mockUser: User = {
  id: "123",
  email: "test@test.com",
  firstName: "Test",
  lastName: "User",
  dob: new Date("2020-01-01"),
  createdAt: new Date("2020-01-01"),
  updatedAt: new Date("2020-01-01"),
  jurisdictions: [],
  mfaEnabled: false,
  passwordUpdatedAt: new Date("2020-01-01"),
  passwordValidForDays: 180,
  agreedToTermsOfService: true,
}

let adminUser: User = {
  ...mockUser,
  roles: { user: { id: "123" }, userId: "123", isAdmin: true },
}

let jurisdictionAdminUser = {
  ...mockUser,
  roles: { user: { id: "123" }, userId: "123", isJurisdictionalAdmin: true },
}

let partnerUser: User = {
  ...mockUser,
  roles: { user: { id: "123" }, userId: "123", isPartner: true },
}

describe("<ListingFormActions>", () => {
  beforeAll(() => {
    mockNextRouter()
  })

  describe("with listings approval off", () => {
    beforeAll(() => (adminUser = { ...adminUser, jurisdictions: [mockBaseJurisdiction] }))
    it("renders correct buttons in a new listing edit state", () => {
      const { getByText } = render(
        <AuthContext.Provider value={{ profile: adminUser }}>
          <ListingContext.Provider value={{ ...listing, status: ListingStatus.pending }}>
            <ListingFormActions type={ListingFormActionsType.add} />
          </ListingContext.Provider>
        </AuthContext.Provider>
      )
      expect(getByText("Save as Draft")).toBeTruthy()
      expect(getByText("Publish")).toBeTruthy()
      expect(getByText("Cancel")).toBeTruthy()
    })

    it("renders correct buttons in a draft detail state", () => {
      const { getByText } = render(
        <AuthContext.Provider value={{ profile: adminUser }}>
          <ListingContext.Provider value={{ ...listing, status: ListingStatus.pending }}>
            <ListingFormActions type={ListingFormActionsType.details} />
          </ListingContext.Provider>
        </AuthContext.Provider>
      )
      expect(getByText("Edit")).toBeTruthy()
      expect(getByText("Preview")).toBeTruthy()
    })

    it("renders correct buttons in a draft edit state", () => {
      const { getByText } = render(
        <AuthContext.Provider value={{ profile: adminUser }}>
          <ListingContext.Provider value={{ ...listing, status: ListingStatus.pending }}>
            <ListingFormActions type={ListingFormActionsType.edit} />
          </ListingContext.Provider>
        </AuthContext.Provider>
      )
      expect(getByText("Save & Exit")).toBeTruthy()
      expect(getByText("Publish")).toBeTruthy()
      expect(getByText("Cancel")).toBeTruthy()
    })

    it("renders correct buttons in an open detail state", () => {
      const { getByText } = render(
        <AuthContext.Provider value={{ profile: adminUser }}>
          <ListingContext.Provider value={{ ...listing, status: ListingStatus.active }}>
            <ListingFormActions type={ListingFormActionsType.details} />
          </ListingContext.Provider>
        </AuthContext.Provider>
      )
      expect(getByText("Edit")).toBeTruthy()
      expect(getByText("Preview")).toBeTruthy()
    })

    it("renders correct buttons in an open edit state", () => {
      const { getByText } = render(
        <AuthContext.Provider value={{ profile: adminUser }}>
          <ListingContext.Provider value={{ ...listing, status: ListingStatus.active }}>
            <ListingFormActions type={ListingFormActionsType.edit} />
          </ListingContext.Provider>
        </AuthContext.Provider>
      )
      expect(getByText("Save & Exit")).toBeTruthy()
      expect(getByText("Close")).toBeTruthy()
      expect(getByText("Unpublish")).toBeTruthy()
      expect(getByText("Cancel")).toBeTruthy()
    })

    it("renders correct buttons in a closed detail state", () => {
      const { getByText } = render(
        <AuthContext.Provider value={{ profile: adminUser }}>
          <ListingContext.Provider value={{ ...listing, status: ListingStatus.closed }}>
            <ListingFormActions type={ListingFormActionsType.details} />
          </ListingContext.Provider>
        </AuthContext.Provider>
      )
      expect(getByText("Edit")).toBeTruthy()
      expect(getByText("Preview")).toBeTruthy()
    })

    it("renders correct buttons in a closed edit state", () => {
      const { getByText } = render(
        <AuthContext.Provider value={{ profile: adminUser }}>
          <ListingContext.Provider value={{ ...listing, status: ListingStatus.closed }}>
            <ListingFormActions type={ListingFormActionsType.edit} />
          </ListingContext.Provider>
        </AuthContext.Provider>
      )
      expect(getByText("Reopen")).toBeTruthy()
      expect(getByText("Save & Exit")).toBeTruthy()
      expect(getByText("Unpublish")).toBeTruthy()
      expect(getByText("Cancel")).toBeTruthy()
    })
  })

  describe("with listings approval on for admin only", () => {
    beforeEach(() => {
      jest.resetModules()
    })

    describe("as an admin", () => {
      beforeAll(() => (adminUser = { ...adminUser, jurisdictions: [mockAdminOnlyJurisdiction] }))
      it("renders correct buttons in a new listing edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: adminUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.pending }}>
              <ListingFormActions type={ListingFormActionsType.add} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Publish")).toBeTruthy()
        expect(getByText("Save as Draft")).toBeTruthy()
        expect(getByText("Cancel")).toBeTruthy()
      })

      it("renders correct buttons in a draft detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: adminUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.pending }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in a draft edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: adminUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.pending }}>
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Publish")).toBeTruthy()
        expect(getByText("Save & Exit")).toBeTruthy()
        expect(getByText("Cancel")).toBeTruthy()
      })

      it("renders correct buttons in a pending approval detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: adminUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.pendingReview }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Approve & Publish")).toBeTruthy()
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in a pending approval edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: adminUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.pendingReview }}>
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Approve & Publish")).toBeTruthy()
        expect(getByText("Save & Exit")).toBeTruthy()
        expect(getByText("Request Changes")).toBeTruthy()
        expect(getByText("Cancel")).toBeTruthy()
      })

      it("renders correct buttons in a changes requested detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: adminUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.changesRequested }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Approve & Publish")).toBeTruthy()
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in a changes requested edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: adminUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.changesRequested }}>
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Approve & Publish")).toBeTruthy()
        expect(getByText("Save & Exit")).toBeTruthy()
        expect(getByText("Cancel")).toBeTruthy()
      })
      it("renders correct buttons in an open detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: adminUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.active }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in an open edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: adminUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.active }}>
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Save & Exit")).toBeTruthy()
        expect(getByText("Close")).toBeTruthy()
        expect(getByText("Unpublish")).toBeTruthy()
        expect(getByText("Cancel")).toBeTruthy()
      })

      it("renders correct buttons in a closed detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: adminUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.closed }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in a closed edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: adminUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.closed }}>
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Reopen")).toBeTruthy()
        expect(getByText("Save & Exit")).toBeTruthy()
        expect(getByText("Unpublish")).toBeTruthy()
        expect(getByText("Post Results")).toBeTruthy()
        expect(getByText("Cancel")).toBeTruthy()
      })
    })
    describe("as a jurisdictional admin", () => {
      beforeAll(
        () =>
          (jurisdictionAdminUser = {
            ...jurisdictionAdminUser,
            jurisdictions: [mockAdminOnlyJurisdiction],
          })
      )
      it("renders correct buttons in a new listing edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: jurisdictionAdminUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.pending }}>
              <ListingFormActions type={ListingFormActionsType.add} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Submit")).toBeTruthy()
        expect(getByText("Save as Draft")).toBeTruthy()
        expect(getByText("Cancel")).toBeTruthy()
      })

      it("renders correct buttons in a draft detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: jurisdictionAdminUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.pending }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in a draft edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: jurisdictionAdminUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.pending }}>
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Submit")).toBeTruthy()
        expect(getByText("Save & Exit")).toBeTruthy()
        expect(getByText("Cancel")).toBeTruthy()
      })

      it("renders correct buttons in a pending approval detail state", () => {
        const { getByText, queryByText } = render(
          <AuthContext.Provider value={{ profile: jurisdictionAdminUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.pendingReview }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Preview")).toBeTruthy()
        expect(queryByText("Edit")).toBeFalsy()
      })

      it("renders correct buttons in a changes requested detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: jurisdictionAdminUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.changesRequested }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in a changes requested edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: jurisdictionAdminUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.changesRequested }}>
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Submit")).toBeTruthy()
        expect(getByText("Save & Exit")).toBeTruthy()
        expect(getByText("Cancel")).toBeTruthy()
      })

      it("renders correct buttons in an open detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: jurisdictionAdminUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.active }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in an open edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: jurisdictionAdminUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.active }}>
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Save & Exit")).toBeTruthy()
        expect(getByText("Close")).toBeTruthy()
        expect(getByText("Unpublish")).toBeTruthy()
        expect(getByText("Cancel")).toBeTruthy()
      })

      it("renders correct buttons in a closed detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: jurisdictionAdminUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.closed }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in a closed edit state", () => {
        const { getByText, queryByText } = render(
          <AuthContext.Provider value={{ profile: jurisdictionAdminUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.closed }}>
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(queryByText("Reopen")).toBeFalsy()
        expect(getByText("Save & Exit")).toBeTruthy()
        expect(getByText("Unpublish")).toBeTruthy()
        expect(getByText("Post Results")).toBeTruthy()
        expect(getByText("Cancel")).toBeTruthy()
      })
    })

    describe("as a partner", () => {
      beforeAll(
        () => (partnerUser = { ...partnerUser, jurisdictions: [mockAdminOnlyJurisdiction] })
      )
      it("renders correct buttons in a new listing edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: partnerUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.pending }}>
              <ListingFormActions type={ListingFormActionsType.add} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Submit")).toBeTruthy()
        expect(getByText("Save as Draft")).toBeTruthy()
        expect(getByText("Cancel")).toBeTruthy()
      })

      it("renders correct buttons in a draft detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: partnerUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.pending }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in a draft edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: partnerUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.pending }}>
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Submit")).toBeTruthy()
        expect(getByText("Save & Exit")).toBeTruthy()
        expect(getByText("Cancel")).toBeTruthy()
      })

      it("renders correct buttons in a pending approval detail state", () => {
        const { getByText, queryByText } = render(
          <AuthContext.Provider value={{ profile: partnerUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.pendingReview }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Preview")).toBeTruthy()
        expect(queryByText("Edit")).toBeFalsy()
      })

      it("renders correct buttons in a changes requested detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: partnerUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.changesRequested }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in a changes requested edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: partnerUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.changesRequested }}>
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Submit")).toBeTruthy()
        expect(getByText("Save & Exit")).toBeTruthy()
        expect(getByText("Cancel")).toBeTruthy()
      })

      it("renders correct buttons in an open detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: partnerUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.active }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in an open edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: partnerUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.active }}>
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Save & Exit")).toBeTruthy()
        expect(getByText("Close")).toBeTruthy()
        expect(getByText("Unpublish")).toBeTruthy()
        expect(getByText("Cancel")).toBeTruthy()
      })

      it("renders correct buttons in a closed detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: partnerUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.closed }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in a closed edit state", () => {
        const { getByText, queryByText } = render(
          <AuthContext.Provider value={{ profile: partnerUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.closed }}>
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(queryByText("Reopen")).toBeFalsy()
        expect(getByText("Save & Exit")).toBeTruthy()
        expect(getByText("Unpublish")).toBeTruthy()
        expect(getByText("Post Results")).toBeTruthy()
        expect(getByText("Cancel")).toBeTruthy()
      })
    })
  })

  describe("with listings approval on for admin and jurisdictional admin", () => {
    beforeEach(() => {
      jest.resetModules()
    })

    describe("as an admin", () => {
      beforeAll(
        () => (adminUser = { ...adminUser, jurisdictions: [mockAdminJurisAdminJurisdiction] })
      )
      it("renders correct buttons in a new listing edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: adminUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.pending }}>
              <ListingFormActions type={ListingFormActionsType.add} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Publish")).toBeTruthy()
        expect(getByText("Save as Draft")).toBeTruthy()
        expect(getByText("Cancel")).toBeTruthy()
      })

      it("renders correct buttons in a draft detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: adminUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.pending }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in a draft edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: adminUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.pending }}>
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Publish")).toBeTruthy()
        expect(getByText("Save & Exit")).toBeTruthy()
        expect(getByText("Cancel")).toBeTruthy()
      })

      it("renders correct buttons in a pending approval detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: adminUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.pendingReview }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Approve & Publish")).toBeTruthy()
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in a pending approval edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: adminUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.pendingReview }}>
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Approve & Publish")).toBeTruthy()
        expect(getByText("Save & Exit")).toBeTruthy()
        expect(getByText("Request Changes")).toBeTruthy()
        expect(getByText("Cancel")).toBeTruthy()
      })

      it("renders correct buttons in a changes requested detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: adminUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.changesRequested }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Approve & Publish")).toBeTruthy()
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in a changes requested edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: adminUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.changesRequested }}>
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Approve & Publish")).toBeTruthy()
        expect(getByText("Save & Exit")).toBeTruthy()
        expect(getByText("Cancel")).toBeTruthy()
      })
      it("renders correct buttons in an open detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: adminUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.active }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in an open edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: adminUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.active }}>
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Save & Exit")).toBeTruthy()
        expect(getByText("Close")).toBeTruthy()
        expect(getByText("Unpublish")).toBeTruthy()
        expect(getByText("Cancel")).toBeTruthy()
      })

      it("renders correct buttons in a closed detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: adminUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.closed }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in a closed edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: adminUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.closed }}>
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Reopen")).toBeTruthy()
        expect(getByText("Save & Exit")).toBeTruthy()
        expect(getByText("Unpublish")).toBeTruthy()
        expect(getByText("Post Results")).toBeTruthy()
        expect(getByText("Cancel")).toBeTruthy()
      })
    })
    describe("as a jurisdictional admin", () => {
      beforeAll(
        () =>
          (jurisdictionAdminUser = {
            ...jurisdictionAdminUser,
            jurisdictions: [mockAdminJurisAdminJurisdiction],
          })
      )
      it("renders correct buttons in a new listing edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: jurisdictionAdminUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.pending }}>
              <ListingFormActions type={ListingFormActionsType.add} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Publish")).toBeTruthy()
        expect(getByText("Save as Draft")).toBeTruthy()
        expect(getByText("Cancel")).toBeTruthy()
      })

      it("renders correct buttons in a draft detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: jurisdictionAdminUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.pending }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in a draft edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: jurisdictionAdminUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.pending }}>
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Publish")).toBeTruthy()
        expect(getByText("Save & Exit")).toBeTruthy()
        expect(getByText("Cancel")).toBeTruthy()
      })

      it("renders correct buttons in a pending approval detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: jurisdictionAdminUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.pendingReview }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Approve & Publish")).toBeTruthy()
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in a pending approval edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: jurisdictionAdminUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.pendingReview }}>
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Approve & Publish")).toBeTruthy()
        expect(getByText("Save & Exit")).toBeTruthy()
        expect(getByText("Request Changes")).toBeTruthy()
        expect(getByText("Cancel")).toBeTruthy()
      })

      it("renders correct buttons in a changes requested detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: jurisdictionAdminUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.changesRequested }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Approve & Publish")).toBeTruthy()
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in a changes requested edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: jurisdictionAdminUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.changesRequested }}>
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Approve & Publish")).toBeTruthy()
        expect(getByText("Save & Exit")).toBeTruthy()
        expect(getByText("Cancel")).toBeTruthy()
      })
      it("renders correct buttons in an open detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: jurisdictionAdminUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.active }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in an open edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: jurisdictionAdminUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.active }}>
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Save & Exit")).toBeTruthy()
        expect(getByText("Close")).toBeTruthy()
        expect(getByText("Unpublish")).toBeTruthy()
        expect(getByText("Cancel")).toBeTruthy()
      })

      it("renders correct buttons in a closed detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: jurisdictionAdminUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.closed }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in a closed edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: jurisdictionAdminUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.closed }}>
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Reopen")).toBeTruthy()
        expect(getByText("Save & Exit")).toBeTruthy()
        expect(getByText("Unpublish")).toBeTruthy()
        expect(getByText("Post Results")).toBeTruthy()
        expect(getByText("Cancel")).toBeTruthy()
      })
    })

    describe("as a partner", () => {
      beforeAll(
        () => (partnerUser = { ...partnerUser, jurisdictions: [mockAdminOnlyJurisdiction] })
      )
      it("renders correct buttons in a new listing edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: partnerUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.pending }}>
              <ListingFormActions type={ListingFormActionsType.add} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Submit")).toBeTruthy()
        expect(getByText("Save as Draft")).toBeTruthy()
        expect(getByText("Cancel")).toBeTruthy()
      })

      it("renders correct buttons in a draft detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: partnerUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.pending }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in a draft edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: partnerUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.pending }}>
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Submit")).toBeTruthy()
        expect(getByText("Save & Exit")).toBeTruthy()
        expect(getByText("Cancel")).toBeTruthy()
      })

      it("renders correct buttons in a pending approval detail state", () => {
        const { getByText, queryByText } = render(
          <AuthContext.Provider value={{ profile: partnerUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.pendingReview }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Preview")).toBeTruthy()
        expect(queryByText("Edit")).toBeFalsy()
      })

      it("renders correct buttons in a changes requested detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: partnerUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.changesRequested }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in a changes requested edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: partnerUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.changesRequested }}>
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Submit")).toBeTruthy()
        expect(getByText("Save & Exit")).toBeTruthy()
        expect(getByText("Cancel")).toBeTruthy()
      })

      it("renders correct buttons in an open detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: partnerUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.active }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in an open edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: partnerUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.active }}>
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Save & Exit")).toBeTruthy()
        expect(getByText("Close")).toBeTruthy()
        expect(getByText("Unpublish")).toBeTruthy()
        expect(getByText("Cancel")).toBeTruthy()
      })

      it("renders correct buttons in a closed detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: partnerUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.closed }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in a closed edit state", () => {
        const { getByText, queryByText } = render(
          <AuthContext.Provider value={{ profile: partnerUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.closed }}>
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(queryByText("Reopen")).toBeFalsy()
        expect(getByText("Save & Exit")).toBeTruthy()
        expect(getByText("Unpublish")).toBeTruthy()
        expect(getByText("Post Results")).toBeTruthy()
        expect(getByText("Cancel")).toBeTruthy()
      })
    })
  })
})
