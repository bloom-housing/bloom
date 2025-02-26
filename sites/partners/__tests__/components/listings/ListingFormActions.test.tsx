import React from "react"
import { cleanup } from "@testing-library/react"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { listing } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { ListingContext } from "../../../src/components/listings/ListingContext"
import ListingFormActions, {
  ListingFormActionsType,
} from "../../../src/components/listings/ListingFormActions"
import { mockNextRouter, render } from "../../testUtils"
import {
  UserRoleEnum,
  Jurisdiction,
  LanguagesEnum,
  ListingsStatusEnum,
  User,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"

afterEach(cleanup)

const mockBaseJurisdiction: Jurisdiction = {
  id: "id",
  createdAt: new Date(),
  updatedAt: new Date(),
  name: "San Jose",
  multiselectQuestions: [],
  languages: [LanguagesEnum.en],
  publicUrl: "http://localhost:3000",
  emailFromAddress: "Alameda: Housing Bay Area <bloom-no-reply@exygy.dev>",
  rentalAssistanceDefault:
    "Housing Choice Vouchers, Section 8 and other valid rental assistance programs will be considered for this property. In the case of a valid rental subsidy, the required minimum income will be based on the portion of the rent that the tenant pays after use of the subsidy.",
  enablePartnerSettings: true,
  listingApprovalPermissions: [],
  duplicateListingPermissions: [
    UserRoleEnum.admin,
    UserRoleEnum.jurisdictionAdmin,
    UserRoleEnum.limitedJurisdictionAdmin,
  ],
  enableGeocodingPreferences: false,
  enableListingOpportunity: false,
  allowSingleUseCodeLogin: false,
}

const mockAdminOnlyApprovalJurisdiction: Jurisdiction = {
  ...mockBaseJurisdiction,
  listingApprovalPermissions: [UserRoleEnum.admin],
}

const mockAdminJurisAdminApprovalJurisdiction: Jurisdiction = {
  ...mockBaseJurisdiction,
  listingApprovalPermissions: [UserRoleEnum.admin, UserRoleEnum.jurisdictionAdmin],
}

const mockAllUserCopyJurisdiction: Jurisdiction = {
  ...mockBaseJurisdiction,
  duplicateListingPermissions: [
    UserRoleEnum.admin,
    UserRoleEnum.jurisdictionAdmin,
    UserRoleEnum.limitedJurisdictionAdmin,
    UserRoleEnum.partner,
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
  listings: [],
}

let adminUser: User = {
  ...mockUser,
  userRoles: { isAdmin: true },
}

let jurisdictionAdminUser = {
  ...mockUser,
  userRoles: { isJurisdictionalAdmin: true },
}

let limitedJurisdictionAdminUser = {
  ...mockUser,
  userRoles: { isLimitedJurisdictionalAdmin: true },
}

let partnerUser: User = {
  ...mockUser,
  userRoles: { isPartner: true },
}

let doJurisdictionsHaveFeatureFlagOn = () => {
  return false
}

describe("<ListingFormActions>", () => {
  beforeAll(() => {
    mockNextRouter()
  })

  describe("with listings approval off", () => {
    beforeAll(() => (adminUser = { ...adminUser, jurisdictions: [mockBaseJurisdiction] }))
    it("renders correct buttons in a new listing edit state", () => {
      const { getByText } = render(
        <AuthContext.Provider
          value={{
            profile: adminUser,
            doJurisdictionsHaveFeatureFlagOn,
          }}
        >
          <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.pending }}>
            <ListingFormActions type={ListingFormActionsType.add} />
          </ListingContext.Provider>
        </AuthContext.Provider>
      )
      expect(getByText("Save as Draft")).toBeTruthy()
      expect(getByText("Publish")).toBeTruthy()
      expect(getByText("Exit")).toBeTruthy()
    })

    it("renders correct buttons in a draft detail state", () => {
      const { getByText } = render(
        <AuthContext.Provider
          value={{
            profile: adminUser,
            doJurisdictionsHaveFeatureFlagOn,
          }}
        >
          <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.pending }}>
            <ListingFormActions type={ListingFormActionsType.details} />
          </ListingContext.Provider>
        </AuthContext.Provider>
      )
      expect(getByText("Edit")).toBeTruthy()
      expect(getByText("Copy")).toBeTruthy()
      expect(getByText("Preview")).toBeTruthy()
    })

    it("renders correct buttons in a draft edit state", () => {
      const { getByText } = render(
        <AuthContext.Provider
          value={{
            profile: adminUser,
            doJurisdictionsHaveFeatureFlagOn,
          }}
        >
          <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.pending }}>
            <ListingFormActions type={ListingFormActionsType.edit} />
          </ListingContext.Provider>
        </AuthContext.Provider>
      )
      expect(getByText("Save")).toBeTruthy()
      expect(getByText("Publish")).toBeTruthy()
      expect(getByText("Exit")).toBeTruthy()
    })

    it("renders correct buttons in an open detail state", () => {
      const { getByText } = render(
        <AuthContext.Provider
          value={{
            profile: adminUser,
            doJurisdictionsHaveFeatureFlagOn,
          }}
        >
          <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.active }}>
            <ListingFormActions type={ListingFormActionsType.details} />
          </ListingContext.Provider>
        </AuthContext.Provider>
      )
      expect(getByText("Edit")).toBeTruthy()
      expect(getByText("Copy")).toBeTruthy()
      expect(getByText("Preview")).toBeTruthy()
    })

    it("renders correct buttons in an open edit state", () => {
      const { getByText } = render(
        <AuthContext.Provider
          value={{
            profile: adminUser,
            doJurisdictionsHaveFeatureFlagOn,
          }}
        >
          <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.active }}>
            <ListingFormActions type={ListingFormActionsType.edit} />
          </ListingContext.Provider>
        </AuthContext.Provider>
      )
      expect(getByText("Save")).toBeTruthy()
      expect(getByText("Close")).toBeTruthy()
      expect(getByText("Unpublish")).toBeTruthy()
      expect(getByText("Exit")).toBeTruthy()
    })

    it("renders correct buttons in a closed detail state", () => {
      const { getByText } = render(
        <AuthContext.Provider
          value={{
            profile: adminUser,
            doJurisdictionsHaveFeatureFlagOn,
          }}
        >
          <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.closed }}>
            <ListingFormActions type={ListingFormActionsType.details} />
          </ListingContext.Provider>
        </AuthContext.Provider>
      )
      expect(getByText("Edit")).toBeTruthy()
      expect(getByText("Copy")).toBeTruthy()
      expect(getByText("Preview")).toBeTruthy()
    })

    it("renders correct buttons in a closed edit state", () => {
      const { getByText } = render(
        <AuthContext.Provider
          value={{
            profile: adminUser,
            doJurisdictionsHaveFeatureFlagOn,
          }}
        >
          <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.closed }}>
            <ListingFormActions type={ListingFormActionsType.edit} />
          </ListingContext.Provider>
        </AuthContext.Provider>
      )
      expect(getByText("Reopen")).toBeTruthy()
      expect(getByText("Save")).toBeTruthy()
      expect(getByText("Unpublish")).toBeTruthy()
      expect(getByText("Exit")).toBeTruthy()
    })
  })

  describe("with listings approval on for admin only", () => {
    beforeEach(() => {
      jest.resetModules()
    })

    describe("as an admin", () => {
      beforeAll(
        () => (adminUser = { ...adminUser, jurisdictions: [mockAdminOnlyApprovalJurisdiction] })
      )
      it("renders correct buttons in a new listing edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{
              profile: adminUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.pending }}>
              <ListingFormActions type={ListingFormActionsType.add} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Publish")).toBeTruthy()
        expect(getByText("Save as Draft")).toBeTruthy()
        expect(getByText("Exit")).toBeTruthy()
      })

      it("renders correct buttons in a draft detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{
              profile: adminUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.pending }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Copy")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in a draft edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{
              profile: adminUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.pending }}>
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Publish")).toBeTruthy()
        expect(getByText("Save")).toBeTruthy()
        expect(getByText("Exit")).toBeTruthy()
      })

      it("renders correct buttons in a pending approval detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{
              profile: adminUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider
              value={{ ...listing, status: ListingsStatusEnum.pendingReview }}
            >
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Approve & Publish")).toBeTruthy()
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Copy")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in a pending approval edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{
              profile: adminUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider
              value={{ ...listing, status: ListingsStatusEnum.pendingReview }}
            >
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Approve & Publish")).toBeTruthy()
        expect(getByText("Save")).toBeTruthy()
        expect(getByText("Request Changes")).toBeTruthy()
        expect(getByText("Exit")).toBeTruthy()
      })

      it("renders correct buttons in a changes requested detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{
              profile: adminUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider
              value={{ ...listing, status: ListingsStatusEnum.changesRequested }}
            >
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Approve & Publish")).toBeTruthy()
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Copy")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in a changes requested edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{
              profile: adminUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider
              value={{ ...listing, status: ListingsStatusEnum.changesRequested }}
            >
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Approve & Publish")).toBeTruthy()
        expect(getByText("Save")).toBeTruthy()
        expect(getByText("Exit")).toBeTruthy()
      })
      it("renders correct buttons in an open detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{
              profile: adminUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.active }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Copy")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in an open edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{
              profile: adminUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.active }}>
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Save")).toBeTruthy()
        expect(getByText("Close")).toBeTruthy()
        expect(getByText("Unpublish")).toBeTruthy()
        expect(getByText("Exit")).toBeTruthy()
      })

      it("renders correct buttons in a closed detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{
              profile: adminUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.closed }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Copy")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in a closed edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{
              profile: adminUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.closed }}>
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Reopen")).toBeTruthy()
        expect(getByText("Save")).toBeTruthy()
        expect(getByText("Unpublish")).toBeTruthy()
        // Disabled for Doorway
        // expect(getByText("Post Results")).toBeTruthy()
        expect(getByText("Exit")).toBeTruthy()
      })
    })
    describe("as a jurisdictional admin", () => {
      beforeAll(
        () =>
          (jurisdictionAdminUser = {
            ...jurisdictionAdminUser,
            jurisdictions: [mockAdminOnlyApprovalJurisdiction],
          })
      )
      it("renders correct buttons in a new listing edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{
              profile: jurisdictionAdminUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.pending }}>
              <ListingFormActions type={ListingFormActionsType.add} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Submit")).toBeTruthy()
        expect(getByText("Save as Draft")).toBeTruthy()
        expect(getByText("Exit")).toBeTruthy()
      })

      it("renders correct buttons in a draft detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{
              profile: jurisdictionAdminUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.pending }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Copy")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in a draft edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{
              profile: jurisdictionAdminUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.pending }}>
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Submit")).toBeTruthy()
        expect(getByText("Save")).toBeTruthy()
        expect(getByText("Exit")).toBeTruthy()
      })

      it("renders correct buttons in a pending approval detail state", () => {
        const { getByText, queryByText } = render(
          <AuthContext.Provider
            value={{
              profile: jurisdictionAdminUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider
              value={{ ...listing, status: ListingsStatusEnum.pendingReview }}
            >
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Preview")).toBeTruthy()
        expect(getByText("Copy")).toBeTruthy()
        expect(queryByText("Edit")).toBeFalsy()
      })

      it("renders correct buttons in a changes requested detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{
              profile: jurisdictionAdminUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider
              value={{ ...listing, status: ListingsStatusEnum.changesRequested }}
            >
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Copy")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in a changes requested edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{
              profile: jurisdictionAdminUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider
              value={{ ...listing, status: ListingsStatusEnum.changesRequested }}
            >
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Submit")).toBeTruthy()
        expect(getByText("Save")).toBeTruthy()
        expect(getByText("Exit")).toBeTruthy()
      })

      it("renders correct buttons in an open detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{
              profile: jurisdictionAdminUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.active }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Copy")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in an open edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{
              profile: jurisdictionAdminUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.active }}>
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Save")).toBeTruthy()
        expect(getByText("Close")).toBeTruthy()
        expect(getByText("Unpublish")).toBeTruthy()
        expect(getByText("Exit")).toBeTruthy()
      })

      it("renders correct buttons in a closed detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{
              profile: jurisdictionAdminUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.closed }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Copy")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in a closed edit state", () => {
        const { getByText, queryByText } = render(
          <AuthContext.Provider
            value={{
              profile: jurisdictionAdminUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.closed }}>
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(queryByText("Reopen")).toBeFalsy()
        expect(getByText("Save")).toBeTruthy()
        expect(getByText("Unpublish")).toBeTruthy()
        // Disabled for Doorway
        // expect(getByText("Post Results")).toBeTruthy()
        expect(getByText("Exit")).toBeTruthy()
      })
    })

    describe("as a partner", () => {
      beforeAll(
        () => (partnerUser = { ...partnerUser, jurisdictions: [mockAdminOnlyApprovalJurisdiction] })
      )
      it("renders correct buttons in a new listing edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{
              profile: partnerUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.pending }}>
              <ListingFormActions type={ListingFormActionsType.add} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Submit")).toBeTruthy()
        expect(getByText("Save as Draft")).toBeTruthy()
        expect(getByText("Exit")).toBeTruthy()
      })

      it("renders correct buttons in a draft detail state", () => {
        const { getByText, queryByText } = render(
          <AuthContext.Provider
            value={{
              profile: partnerUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.pending }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Edit")).toBeTruthy()
        expect(queryByText("Copy")).toBeFalsy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in a draft edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{
              profile: partnerUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.pending }}>
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Submit")).toBeTruthy()
        expect(getByText("Save")).toBeTruthy()
        expect(getByText("Exit")).toBeTruthy()
      })

      it("renders correct buttons in a pending approval detail state", () => {
        const { getByText, queryByText } = render(
          <AuthContext.Provider
            value={{
              profile: partnerUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider
              value={{ ...listing, status: ListingsStatusEnum.pendingReview }}
            >
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(queryByText("Copy")).toBeFalsy()
        expect(getByText("Preview")).toBeTruthy()
        expect(queryByText("Edit")).toBeFalsy()
      })

      it("renders correct buttons in a changes requested detail state", () => {
        const { getByText, queryByText } = render(
          <AuthContext.Provider
            value={{
              profile: partnerUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider
              value={{ ...listing, status: ListingsStatusEnum.changesRequested }}
            >
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Edit")).toBeTruthy()
        expect(queryByText("Copy")).toBeFalsy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in a changes requested edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{
              profile: partnerUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider
              value={{ ...listing, status: ListingsStatusEnum.changesRequested }}
            >
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Submit")).toBeTruthy()
        expect(getByText("Save")).toBeTruthy()
        expect(getByText("Exit")).toBeTruthy()
      })

      it("renders correct buttons in an open detail state", () => {
        const { getByText, queryByText } = render(
          <AuthContext.Provider
            value={{
              profile: partnerUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.active }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Edit")).toBeTruthy()
        expect(queryByText("Copy")).toBeFalsy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in an open edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{
              profile: partnerUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.active }}>
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Save")).toBeTruthy()
        expect(getByText("Close")).toBeTruthy()
        expect(getByText("Unpublish")).toBeTruthy()
        expect(getByText("Exit")).toBeTruthy()
      })

      it("renders correct buttons in a closed detail state", () => {
        const { getByText, queryByText } = render(
          <AuthContext.Provider
            value={{
              profile: partnerUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.closed }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Edit")).toBeTruthy()
        expect(queryByText("Copy")).toBeFalsy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in a closed edit state", () => {
        const { getByText, queryByText } = render(
          <AuthContext.Provider
            value={{
              profile: partnerUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.closed }}>
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(queryByText("Reopen")).toBeFalsy()
        expect(getByText("Save")).toBeTruthy()
        expect(getByText("Unpublish")).toBeTruthy()
        // Disabled for Doorway
        // expect(getByText("Post Results")).toBeTruthy()
        expect(getByText("Exit")).toBeTruthy()
      })
    })
  })

  describe("with listings approval on for admin and jurisdictional admin", () => {
    beforeEach(() => {
      jest.resetModules()
    })

    describe("as an admin", () => {
      beforeAll(
        () =>
          (adminUser = { ...adminUser, jurisdictions: [mockAdminJurisAdminApprovalJurisdiction] })
      )
      it("renders correct buttons in a new listing edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{
              profile: adminUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.pending }}>
              <ListingFormActions type={ListingFormActionsType.add} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Publish")).toBeTruthy()
        expect(getByText("Save as Draft")).toBeTruthy()
        expect(getByText("Exit")).toBeTruthy()
      })

      it("renders correct buttons in a draft detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{
              profile: adminUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.pending }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Copy")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in a draft edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{
              profile: adminUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.pending }}>
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Publish")).toBeTruthy()
        expect(getByText("Save")).toBeTruthy()
        expect(getByText("Exit")).toBeTruthy()
      })

      it("renders correct buttons in a pending approval detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{
              profile: adminUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider
              value={{ ...listing, status: ListingsStatusEnum.pendingReview }}
            >
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Approve & Publish")).toBeTruthy()
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Copy")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in a pending approval edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{
              profile: adminUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider
              value={{ ...listing, status: ListingsStatusEnum.pendingReview }}
            >
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Approve & Publish")).toBeTruthy()
        expect(getByText("Save")).toBeTruthy()
        expect(getByText("Request Changes")).toBeTruthy()
        expect(getByText("Exit")).toBeTruthy()
      })

      it("renders correct buttons in a changes requested detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{
              profile: adminUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider
              value={{ ...listing, status: ListingsStatusEnum.changesRequested }}
            >
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Approve & Publish")).toBeTruthy()
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Copy")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in a changes requested edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{
              profile: adminUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider
              value={{ ...listing, status: ListingsStatusEnum.changesRequested }}
            >
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Approve & Publish")).toBeTruthy()
        expect(getByText("Save")).toBeTruthy()
        expect(getByText("Exit")).toBeTruthy()
      })
      it("renders correct buttons in an open detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{
              profile: adminUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.active }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Copy")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in an open edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{
              profile: adminUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.active }}>
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Save")).toBeTruthy()
        expect(getByText("Close")).toBeTruthy()
        expect(getByText("Unpublish")).toBeTruthy()
        expect(getByText("Exit")).toBeTruthy()
      })

      it("renders correct buttons in a closed detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{
              profile: adminUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.closed }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Copy")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in a closed edit state", () => {
        const { getByText, queryAllByText } = render(
          <AuthContext.Provider value={{ profile: adminUser, doJurisdictionsHaveFeatureFlagOn }}>
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.closed }}>
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Reopen")).toBeTruthy()
        expect(getByText("Save")).toBeTruthy()
        expect(getByText("Unpublish")).toBeTruthy()
        expect(queryAllByText("Post Results")).toHaveLength(0)
        expect(getByText("Exit")).toBeTruthy()
      })
      it("renders correct buttons in a closed edit state if lottery is turned on", () => {
        process.env.showLottery = "TRUE"
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: adminUser, doJurisdictionsHaveFeatureFlagOn }}>
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.closed }}>
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Reopen")).toBeInTheDocument()
        expect(getByText("Save")).toBeInTheDocument()
        expect(getByText("Unpublish")).toBeInTheDocument()
        expect(getByText("Post Results")).toBeInTheDocument()
        expect(getByText("Exit")).toBeInTheDocument()
      })
    })
    describe("as a jurisdictional admin", () => {
      beforeAll(
        () =>
          (jurisdictionAdminUser = {
            ...jurisdictionAdminUser,
            jurisdictions: [mockAdminJurisAdminApprovalJurisdiction],
          })
      )
      it("renders correct buttons in a new listing edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{
              profile: jurisdictionAdminUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.pending }}>
              <ListingFormActions type={ListingFormActionsType.add} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Publish")).toBeTruthy()
        expect(getByText("Save as Draft")).toBeTruthy()
        expect(getByText("Exit")).toBeTruthy()
      })

      it("renders correct buttons in a draft detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{
              profile: jurisdictionAdminUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.pending }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Copy")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in a draft edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{
              profile: jurisdictionAdminUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.pending }}>
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Publish")).toBeTruthy()
        expect(getByText("Save")).toBeTruthy()
        expect(getByText("Exit")).toBeTruthy()
      })

      it("renders correct buttons in a pending approval detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{
              profile: jurisdictionAdminUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider
              value={{ ...listing, status: ListingsStatusEnum.pendingReview }}
            >
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Approve & Publish")).toBeTruthy()
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Copy")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in a pending approval edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{
              profile: jurisdictionAdminUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider
              value={{ ...listing, status: ListingsStatusEnum.pendingReview }}
            >
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Approve & Publish")).toBeTruthy()
        expect(getByText("Save")).toBeTruthy()
        expect(getByText("Request Changes")).toBeTruthy()
        expect(getByText("Exit")).toBeTruthy()
      })

      it("renders correct buttons in a changes requested detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{
              profile: jurisdictionAdminUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider
              value={{ ...listing, status: ListingsStatusEnum.changesRequested }}
            >
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Approve & Publish")).toBeTruthy()
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Copy")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in a changes requested edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{
              profile: jurisdictionAdminUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider
              value={{ ...listing, status: ListingsStatusEnum.changesRequested }}
            >
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Approve & Publish")).toBeTruthy()
        expect(getByText("Save")).toBeTruthy()
        expect(getByText("Exit")).toBeTruthy()
      })
      it("renders correct buttons in an open detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{
              profile: jurisdictionAdminUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.active }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Copy")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in an open edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{
              profile: jurisdictionAdminUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.active }}>
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Save")).toBeTruthy()
        expect(getByText("Close")).toBeTruthy()
        expect(getByText("Unpublish")).toBeTruthy()
        expect(getByText("Exit")).toBeTruthy()
      })

      it("renders correct buttons in a closed detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{
              profile: jurisdictionAdminUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.closed }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Copy")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in a closed edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{
              profile: jurisdictionAdminUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.closed }}>
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Reopen")).toBeTruthy()
        expect(getByText("Save")).toBeTruthy()
        expect(getByText("Unpublish")).toBeTruthy()
        // Disabled for Doorway
        // expect(getByText("Post Results")).toBeTruthy()
        expect(getByText("Exit")).toBeTruthy()
      })
    })

    describe("as a partner", () => {
      beforeAll(
        () => (partnerUser = { ...partnerUser, jurisdictions: [mockAdminOnlyApprovalJurisdiction] })
      )
      it("renders correct buttons in a new listing edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{
              profile: partnerUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.pending }}>
              <ListingFormActions type={ListingFormActionsType.add} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Submit")).toBeTruthy()
        expect(getByText("Save as Draft")).toBeTruthy()
        expect(getByText("Exit")).toBeTruthy()
      })

      it("renders correct buttons in a draft detail state", () => {
        const { getByText, queryByText } = render(
          <AuthContext.Provider
            value={{
              profile: partnerUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.pending }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Edit")).toBeTruthy()
        expect(queryByText("Copy")).toBeFalsy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in a draft edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{
              profile: partnerUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.pending }}>
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Submit")).toBeTruthy()
        expect(getByText("Save")).toBeTruthy()
        expect(getByText("Exit")).toBeTruthy()
      })

      it("renders correct buttons in a pending approval detail state", () => {
        const { getByText, queryByText } = render(
          <AuthContext.Provider
            value={{
              profile: partnerUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider
              value={{ ...listing, status: ListingsStatusEnum.pendingReview }}
            >
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(queryByText("Copy")).toBeFalsy()
        expect(getByText("Preview")).toBeTruthy()
        expect(queryByText("Edit")).toBeFalsy()
      })

      it("renders correct buttons in a changes requested detail state", () => {
        const { getByText, queryByText } = render(
          <AuthContext.Provider
            value={{
              profile: partnerUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider
              value={{ ...listing, status: ListingsStatusEnum.changesRequested }}
            >
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Edit")).toBeTruthy()
        expect(queryByText("Copy")).toBeFalsy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in a changes requested edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{
              profile: partnerUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider
              value={{ ...listing, status: ListingsStatusEnum.changesRequested }}
            >
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Submit")).toBeTruthy()
        expect(getByText("Save")).toBeTruthy()
        expect(getByText("Exit")).toBeTruthy()
      })

      it("renders correct buttons in an open detail state", () => {
        const { getByText, queryByText } = render(
          <AuthContext.Provider
            value={{
              profile: partnerUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.active }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Edit")).toBeTruthy()
        expect(queryByText("Copy")).toBeFalsy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in an open edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{
              profile: partnerUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.active }}>
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Save")).toBeTruthy()
        expect(getByText("Close")).toBeTruthy()
        expect(getByText("Unpublish")).toBeTruthy()
        expect(getByText("Exit")).toBeTruthy()
      })

      it("renders correct buttons in a closed detail state", () => {
        const { getByText, queryByText } = render(
          <AuthContext.Provider
            value={{
              profile: partnerUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.closed }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Edit")).toBeTruthy()
        expect(queryByText("Copy")).toBeFalsy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in a closed edit state", () => {
        const { getByText, queryByText } = render(
          <AuthContext.Provider
            value={{
              profile: partnerUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.closed }}>
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(queryByText("Reopen")).toBeFalsy()
        expect(getByText("Save")).toBeTruthy()
        expect(getByText("Unpublish")).toBeTruthy()
        // Disabled for Doorway
        // expect(getByText("Post Results")).toBeTruthy()
        expect(getByText("Exit")).toBeTruthy()
      })
    })
  })

  describe("with lotteries on", () => {
    beforeAll(() => {
      process.env.showLottery = "TRUE"
      adminUser = { ...adminUser, jurisdictions: [mockBaseJurisdiction] }
    })

    it("renders correct buttons in a closed edit state with lottery opted in", () => {
      const { queryByText } = render(
        <AuthContext.Provider
          value={{
            profile: adminUser,
            doJurisdictionsHaveFeatureFlagOn,
          }}
        >
          <ListingContext.Provider
            value={{
              ...listing,
              status: ListingsStatusEnum.closed,
              lotteryOptIn: true,
              listingEvents: [],
            }}
          >
            <ListingFormActions type={ListingFormActionsType.edit} />
          </ListingContext.Provider>
        </AuthContext.Provider>
      )
      expect(queryByText("Post Results")).not.toBeInTheDocument()
    })

    it("renders correct buttons in a closed edit state with lottery opted out", () => {
      const { queryByText } = render(
        <AuthContext.Provider
          value={{
            profile: adminUser,
            doJurisdictionsHaveFeatureFlagOn,
          }}
        >
          <ListingContext.Provider
            value={{
              ...listing,
              status: ListingsStatusEnum.closed,
              lotteryOptIn: false,
              listingEvents: [],
            }}
          >
            <ListingFormActions type={ListingFormActionsType.edit} />
          </ListingContext.Provider>
        </AuthContext.Provider>
      )

      expect(queryByText("Post Results")).toBeTruthy()
    })
  })

  describe("with all users able to copy", () => {
    describe("as an admin", () => {
      beforeAll(() => {
        adminUser = { ...adminUser, jurisdictions: [mockAllUserCopyJurisdiction] }
      })
      it("renders correct buttons in a draft detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{
              profile: adminUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.pending }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Copy")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in a detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{
              profile: adminUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.active }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Copy")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })
      it("renders correct buttons in a closed detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{
              profile: adminUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.closed }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Copy")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })
    })

    describe("as a jurisdictional admin", () => {
      beforeAll(() => {
        jurisdictionAdminUser = {
          ...jurisdictionAdminUser,
          jurisdictions: [mockAllUserCopyJurisdiction],
        }
      })
      it("renders correct buttons in a draft detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{
              profile: jurisdictionAdminUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.pending }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Copy")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in a detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{
              profile: jurisdictionAdminUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.active }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Copy")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })
      it("renders correct buttons in a closed detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{
              profile: jurisdictionAdminUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.closed }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Copy")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })
    })

    describe("as a limited jurisdictional admin", () => {
      beforeAll(() => {
        limitedJurisdictionAdminUser = {
          ...limitedJurisdictionAdminUser,
          jurisdictions: [mockAllUserCopyJurisdiction],
        }
      })
      it("renders correct buttons in a draft detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{ profile: limitedJurisdictionAdminUser, doJurisdictionsHaveFeatureFlagOn }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.pending }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Copy")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in a detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{ profile: limitedJurisdictionAdminUser, doJurisdictionsHaveFeatureFlagOn }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.active }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Copy")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })
      it("renders correct buttons in a closed detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{ profile: limitedJurisdictionAdminUser, doJurisdictionsHaveFeatureFlagOn }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.closed }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Copy")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })
    })

    describe("as a partner", () => {
      beforeAll(() => {
        partnerUser = { ...partnerUser, jurisdictions: [mockAllUserCopyJurisdiction] }
      })
      it("renders correct buttons in a draft detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{
              profile: partnerUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.pending }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Copy")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in a detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{
              profile: partnerUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.active }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Copy")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })
      it("renders correct buttons in a closed detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{
              profile: partnerUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.closed }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Copy")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })
    })
  })

  describe("with limit closed listing actions flag enabled", () => {
    beforeAll(() => {
      process.env.limitClosedListingActions = "TRUE"
    })
    describe("as an admin", () => {
      beforeAll(() => {
        adminUser = { ...adminUser, jurisdictions: [mockBaseJurisdiction] }
      })
      it("renders correct buttons in a closed detail state", () => {
        const { getByText } = render(
          <AuthContext.Provider
            value={{
              profile: adminUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.closed }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(getByText("Edit")).toBeTruthy()
        expect(getByText("Copy")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in a closed edit state", () => {
        const { getByText, queryByText } = render(
          <AuthContext.Provider
            value={{
              profile: adminUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.closed }}>
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(queryByText("Reopen")).toBeFalsy()
        expect(getByText("Save")).toBeTruthy()
        expect(getByText("Unpublish")).toBeTruthy()
        expect(getByText("Post Results")).toBeTruthy()
        expect(getByText("Exit")).toBeTruthy()
      })
    })

    describe("as a jurisdictional admin", () => {
      beforeAll(() => {
        jurisdictionAdminUser = {
          ...jurisdictionAdminUser,
          jurisdictions: [mockBaseJurisdiction],
        }
      })
      it("renders correct buttons in a closed detail state", () => {
        const { getByText, queryByText } = render(
          <AuthContext.Provider
            value={{
              profile: jurisdictionAdminUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.closed }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(queryByText("Edit")).toBeFalsy()
        expect(queryByText("Copy")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in a closed edit state", () => {
        const { getByText, queryByText } = render(
          <AuthContext.Provider
            value={{ profile: jurisdictionAdminUser, doJurisdictionsHaveFeatureFlagOn }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.closed }}>
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(queryByText("Reopen")).toBeFalsy()
        expect(getByText("Save")).toBeTruthy()
        expect(getByText("Unpublish")).toBeTruthy()
        expect(getByText("Post Results")).toBeTruthy()
        expect(getByText("Exit")).toBeTruthy()
      })
    })

    describe("as a limited jurisdictional admin", () => {
      beforeAll(() => {
        limitedJurisdictionAdminUser = {
          ...limitedJurisdictionAdminUser,
          jurisdictions: [mockBaseJurisdiction],
        }
      })
      it("renders correct buttons in a closed detail state", () => {
        const { getByText, queryByText } = render(
          <AuthContext.Provider
            value={{ profile: limitedJurisdictionAdminUser, doJurisdictionsHaveFeatureFlagOn }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.closed }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(queryByText("Edit")).toBeFalsy()
        expect(getByText("Copy")).toBeTruthy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in a closed edit state", () => {
        const { getByText, queryByText } = render(
          <AuthContext.Provider
            value={{ profile: limitedJurisdictionAdminUser, doJurisdictionsHaveFeatureFlagOn }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.closed }}>
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(queryByText("Reopen")).toBeFalsy()
        expect(getByText("Save")).toBeTruthy()
        expect(getByText("Unpublish")).toBeTruthy()
        expect(getByText("Post Results")).toBeTruthy()
        expect(getByText("Exit")).toBeTruthy()
      })
    })

    describe("as a partner", () => {
      beforeAll(() => {
        partnerUser = { ...partnerUser, jurisdictions: [mockBaseJurisdiction] }
      })

      it("renders correct buttons in a closed detail state", () => {
        const { getByText, queryByText } = render(
          <AuthContext.Provider
            value={{
              profile: partnerUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.closed }}>
              <ListingFormActions type={ListingFormActionsType.details} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )

        expect(queryByText("Copy")).toBeFalsy()
        expect(queryByText("Edit")).toBeFalsy()
        expect(getByText("Preview")).toBeTruthy()
      })

      it("renders correct buttons in a closed edit state", () => {
        const { getByText, queryByText } = render(
          <AuthContext.Provider
            value={{
              profile: adminUser,
              doJurisdictionsHaveFeatureFlagOn,
            }}
          >
            <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.closed }}>
              <ListingFormActions type={ListingFormActionsType.edit} />
            </ListingContext.Provider>
          </AuthContext.Provider>
        )
        expect(queryByText("Reopen")).toBeFalsy()
        expect(getByText("Save")).toBeTruthy()
        expect(getByText("Unpublish")).toBeTruthy()
        expect(getByText("Post Results")).toBeTruthy()
        expect(getByText("Exit")).toBeTruthy()
      })
    })
  })
  describe("as admin with hideCloseListingButton flag enabled", () => {
    beforeAll(() => {
      doJurisdictionsHaveFeatureFlagOn = () => true
    })
    it("should not render the close button", () => {
      const { queryByText } = render(
        <AuthContext.Provider
          value={{
            profile: adminUser,
            doJurisdictionsHaveFeatureFlagOn,
          }}
        >
          <ListingContext.Provider value={{ ...listing, status: ListingsStatusEnum.active }}>
            <ListingFormActions type={ListingFormActionsType.edit} />
          </ListingContext.Provider>
        </AuthContext.Provider>
      )
      expect(queryByText("Close")).toBeFalsy()
    })
  })
})
