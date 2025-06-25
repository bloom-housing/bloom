import React from "react"
import { cleanup, screen } from "@testing-library/react"
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
import userEvent from "@testing-library/user-event"

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
  duplicateListingPermissions: [],
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

const mockOnlyAdminAndJurisAdminCopyJurisdiction: Jurisdiction = {
  ...mockBaseJurisdiction,
  duplicateListingPermissions: [UserRoleEnum.admin, UserRoleEnum.jurisdictionAdmin],
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

const ListingFormActionsComponent = ({
  user,
  listingStatus,
  formActionType,
  lotteryOptIn,
  submitFormWithStatus,
}: {
  user: User
  listingStatus: ListingsStatusEnum
  formActionType: ListingFormActionsType
  lotteryOptIn?: boolean
  submitFormWithStatus?: () => void
}) => {
  return (
    <AuthContext.Provider
      value={{
        profile: user,
        doJurisdictionsHaveFeatureFlagOn,
      }}
    >
      <ListingContext.Provider
        value={{ ...listing, status: listingStatus, lotteryOptIn: lotteryOptIn, listingEvents: [] }}
      >
        <ListingFormActions type={formActionType} submitFormWithStatus={submitFormWithStatus} />
      </ListingContext.Provider>
    </AuthContext.Provider>
  )
}

describe("<ListingFormActions>", () => {
  beforeAll(() => {
    mockNextRouter()
  })

  describe("with listings approval off", () => {
    describe("as an admin", () => {
      beforeAll(() => (adminUser = { ...adminUser, jurisdictions: [mockBaseJurisdiction] }))
      it("renders correct buttons in a new listing edit state", () => {
        render(
          <ListingFormActionsComponent
            user={adminUser}
            listingStatus={ListingsStatusEnum.pending}
            formActionType={ListingFormActionsType.add}
          />
        )
        expect(screen.getByRole("button", { name: "Save as Draft" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Publish" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Exit" })).toBeInTheDocument()
      })

      it("renders correct buttons in a draft detail state", () => {
        render(
          <ListingFormActionsComponent
            user={adminUser}
            listingStatus={ListingsStatusEnum.pending}
            formActionType={ListingFormActionsType.details}
          />
        )
        expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument()
        expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument()
      })

      it("renders correct buttons in a draft edit state", () => {
        render(
          <ListingFormActionsComponent
            user={adminUser}
            listingStatus={ListingsStatusEnum.pending}
            formActionType={ListingFormActionsType.edit}
          />
        )
        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Publish" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Exit" })).toBeInTheDocument()
      })

      it("renders correct buttons in an open detail state", () => {
        render(
          <ListingFormActionsComponent
            user={adminUser}
            listingStatus={ListingsStatusEnum.active}
            formActionType={ListingFormActionsType.details}
          />
        )
        expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument()
        expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument()
      })

      it("renders correct buttons in an open edit state", () => {
        render(
          <ListingFormActionsComponent
            user={adminUser}
            listingStatus={ListingsStatusEnum.active}
            formActionType={ListingFormActionsType.edit}
          />
        )
        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Unpublish" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Exit" })).toBeInTheDocument()
      })

      it("renders correct buttons in a closed detail state", () => {
        render(
          <ListingFormActionsComponent
            user={adminUser}
            listingStatus={ListingsStatusEnum.closed}
            formActionType={ListingFormActionsType.details}
          />
        )
        expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument()
        expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument()
      })

      it("renders correct buttons in a closed edit state", () => {
        render(
          <ListingFormActionsComponent
            user={adminUser}
            listingStatus={ListingsStatusEnum.closed}
            formActionType={ListingFormActionsType.edit}
          />
        )
        expect(screen.getByRole("button", { name: "Reopen" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Unpublish" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Exit" })).toBeInTheDocument()
      })
    })

    describe("as a jurisdictionalAdmin", () => {
      beforeAll(
        () =>
          (jurisdictionAdminUser = {
            ...jurisdictionAdminUser,
            jurisdictions: [mockBaseJurisdiction],
          })
      )
      it("renders correct buttons in a new listing edit state", () => {
        render(
          <ListingFormActionsComponent
            user={jurisdictionAdminUser}
            listingStatus={ListingsStatusEnum.pending}
            formActionType={ListingFormActionsType.add}
          />
        )
        expect(screen.getByRole("button", { name: "Save as Draft" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Publish" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Exit" })).toBeInTheDocument()
      })

      it("renders correct buttons in a draft detail state", () => {
        render(
          <ListingFormActionsComponent
            user={jurisdictionAdminUser}
            listingStatus={ListingsStatusEnum.pending}
            formActionType={ListingFormActionsType.details}
          />
        )
        expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument()
        expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument()
      })

      it("renders correct buttons in a draft edit state", () => {
        render(
          <ListingFormActionsComponent
            user={jurisdictionAdminUser}
            listingStatus={ListingsStatusEnum.pending}
            formActionType={ListingFormActionsType.edit}
          />
        )
        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Publish" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Exit" })).toBeInTheDocument()
      })

      it("renders correct buttons in an open detail state", () => {
        render(
          <ListingFormActionsComponent
            user={jurisdictionAdminUser}
            listingStatus={ListingsStatusEnum.active}
            formActionType={ListingFormActionsType.details}
          />
        )
        expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument()
        expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument()
      })

      it("renders correct buttons in an open edit state", () => {
        render(
          <ListingFormActionsComponent
            user={jurisdictionAdminUser}
            listingStatus={ListingsStatusEnum.active}
            formActionType={ListingFormActionsType.edit}
          />
        )
        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Unpublish" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Exit" })).toBeInTheDocument()
      })

      it("renders correct buttons in a closed detail state", () => {
        render(
          <ListingFormActionsComponent
            user={jurisdictionAdminUser}
            listingStatus={ListingsStatusEnum.closed}
            formActionType={ListingFormActionsType.details}
          />
        )
        expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument()
        expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument()
      })

      it("renders correct buttons in a closed edit state", () => {
        render(
          <ListingFormActionsComponent
            user={jurisdictionAdminUser}
            listingStatus={ListingsStatusEnum.closed}
            formActionType={ListingFormActionsType.edit}
          />
        )
        expect(screen.getByRole("button", { name: "Reopen" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Unpublish" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Exit" })).toBeInTheDocument()
      })
    })

    describe("as a partner", () => {
      beforeAll(
        () =>
          (partnerUser = {
            ...partnerUser,
            jurisdictions: [mockBaseJurisdiction],
          })
      )
      it("renders correct buttons in a new listing edit state", () => {
        render(
          <ListingFormActionsComponent
            user={partnerUser}
            listingStatus={ListingsStatusEnum.pending}
            formActionType={ListingFormActionsType.add}
          />
        )
        expect(screen.getByRole("button", { name: "Save as Draft" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Publish" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Exit" })).toBeInTheDocument()
      })

      it("renders correct buttons in a draft detail state", () => {
        render(
          <ListingFormActionsComponent
            user={partnerUser}
            listingStatus={ListingsStatusEnum.pending}
            formActionType={ListingFormActionsType.details}
          />
        )
        expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument()
        // expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument()
        expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument()
      })

      it("renders correct buttons in a draft edit state", () => {
        render(
          <ListingFormActionsComponent
            user={partnerUser}
            listingStatus={ListingsStatusEnum.pending}
            formActionType={ListingFormActionsType.edit}
          />
        )
        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Publish" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Exit" })).toBeInTheDocument()
      })

      it("renders correct buttons in an open detail state", () => {
        render(
          <ListingFormActionsComponent
            user={partnerUser}
            listingStatus={ListingsStatusEnum.active}
            formActionType={ListingFormActionsType.details}
          />
        )
        expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument()
        // expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument()
        expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument()
      })

      it("renders correct buttons in an open edit state", () => {
        render(
          <ListingFormActionsComponent
            user={partnerUser}
            listingStatus={ListingsStatusEnum.active}
            formActionType={ListingFormActionsType.edit}
          />
        )
        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Unpublish" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Exit" })).toBeInTheDocument()
      })

      it("renders correct buttons in a closed detail state", () => {
        render(
          <ListingFormActionsComponent
            user={partnerUser}
            listingStatus={ListingsStatusEnum.closed}
            formActionType={ListingFormActionsType.details}
          />
        )
        expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument()
        // expect(screen.getByRole("link", { name: "Copy" })).toBeInTheDocument()
        expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument()
      })

      it("renders correct buttons in a closed edit state", () => {
        render(
          <ListingFormActionsComponent
            user={partnerUser}
            listingStatus={ListingsStatusEnum.closed}
            formActionType={ListingFormActionsType.edit}
          />
        )
        expect(screen.getByRole("button", { name: "Unpublish" })).toBeInTheDocument()
        // Disabled for Doorway
        // expect(screen.getByRole("button", { name: "Post Results" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Exit" })).toBeInTheDocument()
      })
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
        render(
          <ListingFormActionsComponent
            user={adminUser}
            listingStatus={ListingsStatusEnum.pending}
            formActionType={ListingFormActionsType.add}
          />
        )
        expect(screen.getByRole("button", { name: "Publish" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Save as Draft" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Exit" })).toBeInTheDocument()
      })

      it("renders correct buttons in a draft detail state", () => {
        render(
          <ListingFormActionsComponent
            user={adminUser}
            listingStatus={ListingsStatusEnum.pending}
            formActionType={ListingFormActionsType.details}
          />
        )
        expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument()
        expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument()
      })

      it("renders correct buttons in a draft edit state", () => {
        render(
          <ListingFormActionsComponent
            user={adminUser}
            listingStatus={ListingsStatusEnum.pending}
            formActionType={ListingFormActionsType.edit}
          />
        )
        expect(screen.getByRole("button", { name: "Publish" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Exit" })).toBeInTheDocument()
      })

      it("renders correct buttons in a pending approval detail state", () => {
        render(
          <ListingFormActionsComponent
            user={adminUser}
            listingStatus={ListingsStatusEnum.pendingReview}
            formActionType={ListingFormActionsType.details}
          />
        )
        expect(screen.getByRole("button", { name: "Approve & Publish" })).toBeInTheDocument()
        expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument()
        expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument()
      })

      it("renders correct buttons in a pending approval edit state", () => {
        render(
          <ListingFormActionsComponent
            user={adminUser}
            listingStatus={ListingsStatusEnum.pendingReview}
            formActionType={ListingFormActionsType.edit}
          />
        )
        expect(screen.getByRole("button", { name: "Approve & Publish" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Request Changes" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Exit" })).toBeInTheDocument()
      })

      it("renders correct buttons in a changes requested detail state", () => {
        render(
          <ListingFormActionsComponent
            user={adminUser}
            listingStatus={ListingsStatusEnum.changesRequested}
            formActionType={ListingFormActionsType.details}
          />
        )
        expect(screen.getByRole("button", { name: "Approve & Publish" })).toBeInTheDocument()
        expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument()
        expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument()
      })

      it("renders correct buttons in a changes requested edit state", () => {
        render(
          <ListingFormActionsComponent
            user={adminUser}
            listingStatus={ListingsStatusEnum.changesRequested}
            formActionType={ListingFormActionsType.edit}
          />
        )
        expect(screen.getByRole("button", { name: "Approve & Publish" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Exit" })).toBeInTheDocument()
      })
      it("renders correct buttons in an open detail state", () => {
        render(
          <ListingFormActionsComponent
            user={adminUser}
            listingStatus={ListingsStatusEnum.active}
            formActionType={ListingFormActionsType.details}
          />
        )
        expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument()
        expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument()
      })

      it("renders correct buttons in an open edit state", () => {
        render(
          <ListingFormActionsComponent
            user={adminUser}
            listingStatus={ListingsStatusEnum.active}
            formActionType={ListingFormActionsType.edit}
          />
        )
        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Unpublish" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Exit" })).toBeInTheDocument()
      })

      it("renders correct buttons in a closed detail state", () => {
        render(
          <ListingFormActionsComponent
            user={adminUser}
            listingStatus={ListingsStatusEnum.closed}
            formActionType={ListingFormActionsType.details}
          />
        )
        expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument()
        expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument()
      })

      it("renders correct buttons in a closed edit state", () => {
        render(
          <ListingFormActionsComponent
            user={adminUser}
            listingStatus={ListingsStatusEnum.closed}
            formActionType={ListingFormActionsType.edit}
          />
        )

        expect(screen.getByRole("button", { name: "Reopen" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Unpublish" })).toBeInTheDocument()
        // Disabled for Doorway
        // expect(screen.getByRole("button", { name: "Post Results" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Exit" })).toBeInTheDocument()
      })

      it("click approve and publish in edit mode", async () => {
        const submitMock = jest.fn()
        render(
          <ListingFormActionsComponent
            user={adminUser}
            listingStatus={ListingsStatusEnum.pendingReview}
            formActionType={ListingFormActionsType.edit}
            submitFormWithStatus={submitMock}
          />
        )

        await userEvent.click(screen.getByRole("button", { name: "Approve & Publish" }))
        expect(submitMock).toBeCalledWith("redirect", ListingsStatusEnum.active)
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
        render(
          <ListingFormActionsComponent
            user={jurisdictionAdminUser}
            listingStatus={ListingsStatusEnum.pending}
            formActionType={ListingFormActionsType.add}
          />
        )
        expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Save as Draft" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Exit" })).toBeInTheDocument()
      })

      it("renders correct buttons in a draft detail state", () => {
        render(
          <ListingFormActionsComponent
            user={jurisdictionAdminUser}
            listingStatus={ListingsStatusEnum.pending}
            formActionType={ListingFormActionsType.details}
          />
        )
        expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument()
        expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument()
      })

      it("renders correct buttons in a draft edit state", () => {
        render(
          <ListingFormActionsComponent
            user={jurisdictionAdminUser}
            listingStatus={ListingsStatusEnum.pending}
            formActionType={ListingFormActionsType.edit}
          />
        )
        expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Exit" })).toBeInTheDocument()
      })

      it("renders correct buttons in a pending approval detail state", () => {
        render(
          <ListingFormActionsComponent
            user={jurisdictionAdminUser}
            listingStatus={ListingsStatusEnum.pendingReview}
            formActionType={ListingFormActionsType.details}
          />
        )
        expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument()
        expect(screen.queryByText("Edit")).toBeFalsy()
      })

      it("renders correct buttons in a changes requested detail state", () => {
        render(
          <ListingFormActionsComponent
            user={jurisdictionAdminUser}
            listingStatus={ListingsStatusEnum.changesRequested}
            formActionType={ListingFormActionsType.details}
          />
        )
        expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument()
        expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument()
      })

      it("renders correct buttons in a changes requested edit state", () => {
        render(
          <ListingFormActionsComponent
            user={jurisdictionAdminUser}
            listingStatus={ListingsStatusEnum.changesRequested}
            formActionType={ListingFormActionsType.edit}
          />
        )
        expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Exit" })).toBeInTheDocument()
      })

      it("renders correct buttons in an open detail state", () => {
        render(
          <ListingFormActionsComponent
            user={jurisdictionAdminUser}
            listingStatus={ListingsStatusEnum.active}
            formActionType={ListingFormActionsType.details}
          />
        )
        expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument()
        expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument()
      })

      it("renders correct buttons in an open edit state", () => {
        render(
          <ListingFormActionsComponent
            user={jurisdictionAdminUser}
            listingStatus={ListingsStatusEnum.active}
            formActionType={ListingFormActionsType.edit}
          />
        )
        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Unpublish" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Exit" })).toBeInTheDocument()
      })

      it("renders correct buttons in a closed detail state", () => {
        render(
          <ListingFormActionsComponent
            user={jurisdictionAdminUser}
            listingStatus={ListingsStatusEnum.closed}
            formActionType={ListingFormActionsType.details}
          />
        )
        expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument()
        expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument()
      })

      it("renders correct buttons in a closed edit state", () => {
        render(
          <ListingFormActionsComponent
            user={jurisdictionAdminUser}
            listingStatus={ListingsStatusEnum.closed}
            formActionType={ListingFormActionsType.edit}
          />
        )
        expect(screen.queryByText("Reopen")).toBeFalsy()
        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Unpublish" })).toBeInTheDocument()
        // Disabled for Doorway
        // expect(screen.getByRole("button", { name: "Post Results" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Exit" })).toBeInTheDocument()
      })
    })

    describe("as a partner", () => {
      beforeAll(
        () => (partnerUser = { ...partnerUser, jurisdictions: [mockAdminOnlyApprovalJurisdiction] })
      )
      it("renders correct buttons in a new listing edit state", () => {
        render(
          <ListingFormActionsComponent
            user={partnerUser}
            listingStatus={ListingsStatusEnum.pending}
            formActionType={ListingFormActionsType.add}
          />
        )
        expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Save as Draft" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Exit" })).toBeInTheDocument()
      })

      it("renders correct buttons in a draft detail state", () => {
        render(
          <ListingFormActionsComponent
            user={partnerUser}
            listingStatus={ListingsStatusEnum.pending}
            formActionType={ListingFormActionsType.details}
          />
        )
        expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument()
        expect(screen.queryByText("Copy")).toBeFalsy()
        expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument()
      })

      it("renders correct buttons in a draft edit state", () => {
        render(
          <ListingFormActionsComponent
            user={partnerUser}
            listingStatus={ListingsStatusEnum.pending}
            formActionType={ListingFormActionsType.edit}
          />
        )
        expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Exit" })).toBeInTheDocument()
      })

      it("renders correct buttons in a pending approval detail state", () => {
        render(
          <ListingFormActionsComponent
            user={partnerUser}
            listingStatus={ListingsStatusEnum.pendingReview}
            formActionType={ListingFormActionsType.details}
          />
        )
        expect(screen.queryByText("Copy")).toBeFalsy()
        expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument()
        expect(screen.queryByText("Edit")).toBeFalsy()
      })

      it("renders correct buttons in a changes requested detail state", () => {
        render(
          <ListingFormActionsComponent
            user={partnerUser}
            listingStatus={ListingsStatusEnum.changesRequested}
            formActionType={ListingFormActionsType.details}
          />
        )
        expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument()
        expect(screen.queryByText("Copy")).toBeFalsy()
        expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument()
      })

      it("renders correct buttons in a changes requested edit state", () => {
        render(
          <ListingFormActionsComponent
            user={partnerUser}
            listingStatus={ListingsStatusEnum.changesRequested}
            formActionType={ListingFormActionsType.edit}
          />
        )
        expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Exit" })).toBeInTheDocument()
      })

      it("renders correct buttons in an open detail state", () => {
        render(
          <ListingFormActionsComponent
            user={partnerUser}
            listingStatus={ListingsStatusEnum.active}
            formActionType={ListingFormActionsType.details}
          />
        )
        expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument()
        expect(screen.queryByText("Copy")).toBeFalsy()
        expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument()
      })

      it("renders correct buttons in an open edit state", () => {
        render(
          <ListingFormActionsComponent
            user={partnerUser}
            listingStatus={ListingsStatusEnum.active}
            formActionType={ListingFormActionsType.edit}
          />
        )
        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Unpublish" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Exit" })).toBeInTheDocument()
      })

      it("renders correct buttons in a closed detail state", () => {
        render(
          <ListingFormActionsComponent
            user={partnerUser}
            listingStatus={ListingsStatusEnum.closed}
            formActionType={ListingFormActionsType.details}
          />
        )
        expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument()
        expect(screen.queryByText("Copy")).toBeFalsy()
        expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument()
      })

      it("renders correct buttons in a closed edit state", () => {
        render(
          <ListingFormActionsComponent
            user={partnerUser}
            listingStatus={ListingsStatusEnum.closed}
            formActionType={ListingFormActionsType.edit}
          />
        )

        expect(screen.queryByText("Reopen")).toBeFalsy()
        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Unpublish" })).toBeInTheDocument()
        // Disabled for Doorway
        // expect(screen.getByRole("button", { name: "Post Results" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Exit" })).toBeInTheDocument()
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
        render(
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
        expect(screen.getByRole("button", { name: "Publish" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Save as Draft" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Exit" })).toBeInTheDocument()
      })

      it("renders correct buttons in a draft detail state", () => {
        render(
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
        expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument()
        expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument()
      })

      it("renders correct buttons in a draft edit state", () => {
        render(
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
        expect(screen.getByRole("button", { name: "Publish" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Exit" })).toBeInTheDocument()
      })

      it("renders correct buttons in a pending approval detail state", () => {
        render(
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
        expect(screen.getByRole("button", { name: "Approve & Publish" })).toBeInTheDocument()
        expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument()
        expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument()
      })

      it("renders correct buttons in a pending approval edit state", () => {
        render(
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
        expect(screen.getByRole("button", { name: "Approve & Publish" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Request Changes" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Exit" })).toBeInTheDocument()
      })

      it("renders correct buttons in a changes requested detail state", () => {
        render(
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
        expect(screen.getByRole("button", { name: "Approve & Publish" })).toBeInTheDocument()
        expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument()
        expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument()
      })

      it("renders correct buttons in a changes requested edit state", () => {
        render(
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
        expect(screen.getByRole("button", { name: "Approve & Publish" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Exit" })).toBeInTheDocument()
      })
      it("renders correct buttons in an open detail state", () => {
        render(
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
        expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument()
        expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument()
      })

      it("renders correct buttons in an open edit state", () => {
        render(
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
        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Unpublish" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Exit" })).toBeInTheDocument()
      })

      it("renders correct buttons in a closed detail state", () => {
        render(
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
        expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument()
        expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument()
      })

      it("renders correct buttons in a closed edit state", () => {
        render(
          <ListingFormActionsComponent
            user={adminUser}
            listingStatus={ListingsStatusEnum.closed}
            formActionType={ListingFormActionsType.edit}
          />
        )
        expect(screen.getByRole("button", { name: "Reopen" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Unpublish" })).toBeInTheDocument()
        expect(screen.queryAllByRole("button", { name: "Post Results" })).toHaveLength(0)
        expect(screen.getByRole("button", { name: "Exit" })).toBeInTheDocument()
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
        render(
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
        expect(screen.getByRole("button", { name: "Publish" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Save as Draft" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Exit" })).toBeInTheDocument()
      })

      it("renders correct buttons in a draft detail state", () => {
        render(
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
        expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument()
        expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument()
      })

      it("renders correct buttons in a draft edit state", () => {
        render(
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
        expect(screen.getByRole("button", { name: "Publish" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Exit" })).toBeInTheDocument()
      })

      it("renders correct buttons in a pending approval detail state", () => {
        render(
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
        expect(screen.getByRole("button", { name: "Approve & Publish" })).toBeInTheDocument()
        expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument()
        expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument()
      })

      it("renders correct buttons in a pending approval edit state", () => {
        render(
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
        expect(screen.getByRole("button", { name: "Approve & Publish" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Request Changes" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Exit" })).toBeInTheDocument()
      })

      it("renders correct buttons in a changes requested detail state", () => {
        render(
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
        expect(screen.getByRole("button", { name: "Approve & Publish" })).toBeInTheDocument()
        expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument()
        expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument()
      })

      it("renders correct buttons in a changes requested edit state", () => {
        render(
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
        expect(screen.getByRole("button", { name: "Approve & Publish" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Exit" })).toBeInTheDocument()
      })
      it("renders correct buttons in an open detail state", () => {
        render(
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
        expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument()
        expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument()
      })

      it("renders correct buttons in an open edit state", () => {
        render(
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
        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Unpublish" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Exit" })).toBeInTheDocument()
      })

      it("renders correct buttons in a closed detail state", () => {
        render(
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
        expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument()
        expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument()
      })

      it("renders correct buttons in a closed edit state", () => {
        render(
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
        expect(screen.getByRole("button", { name: "Reopen" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Unpublish" })).toBeInTheDocument()
        // Disabled for Doorway
        // expect(screen.getByRole("button", { name: "Post Results" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Exit" })).toBeInTheDocument()
      })
    })

    describe("as a partner", () => {
      beforeAll(
        () => (partnerUser = { ...partnerUser, jurisdictions: [mockAdminOnlyApprovalJurisdiction] })
      )
      it("renders correct buttons in a new listing edit state", () => {
        render(
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
        expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Save as Draft" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Exit" })).toBeInTheDocument()
      })

      it("renders correct buttons in a draft detail state", () => {
        render(
          <ListingFormActionsComponent
            user={partnerUser}
            listingStatus={ListingsStatusEnum.pending}
            formActionType={ListingFormActionsType.details}
          />
        )
        expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument()
        expect(screen.queryByText("Copy")).toBeFalsy()
        expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument()
      })

      it("renders correct buttons in a draft edit state", () => {
        render(
          <ListingFormActionsComponent
            user={partnerUser}
            listingStatus={ListingsStatusEnum.pending}
            formActionType={ListingFormActionsType.edit}
          />
        )
        expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Exit" })).toBeInTheDocument()
      })

      it("renders correct buttons in a pending approval detail state", () => {
        render(
          <ListingFormActionsComponent
            user={partnerUser}
            listingStatus={ListingsStatusEnum.pendingReview}
            formActionType={ListingFormActionsType.details}
          />
        )
        expect(screen.queryByText("Copy")).toBeFalsy()
        expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument()
        expect(screen.queryByText("Edit")).toBeFalsy()
      })

      it("renders correct buttons in a pending approval edit state", () => {
        render(
          <ListingFormActionsComponent
            user={partnerUser}
            listingStatus={ListingsStatusEnum.pendingReview}
            formActionType={ListingFormActionsType.edit}
          />
        )
        expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Exit" })).toBeInTheDocument()
      })

      it("renders correct buttons in a changes requested detail state", () => {
        render(
          <ListingFormActionsComponent
            user={partnerUser}
            listingStatus={ListingsStatusEnum.changesRequested}
            formActionType={ListingFormActionsType.details}
          />
        )
        expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument()
        expect(screen.queryByText("Copy")).toBeFalsy()
        expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument()
      })

      it("renders correct buttons in a changes requested edit state", () => {
        render(
          <ListingFormActionsComponent
            user={partnerUser}
            listingStatus={ListingsStatusEnum.changesRequested}
            formActionType={ListingFormActionsType.edit}
          />
        )
        expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Exit" })).toBeInTheDocument()
      })

      it("renders correct buttons in an open detail state", () => {
        render(
          <ListingFormActionsComponent
            user={partnerUser}
            listingStatus={ListingsStatusEnum.active}
            formActionType={ListingFormActionsType.details}
          />
        )
        expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument()
        expect(screen.queryByText("Copy")).toBeFalsy()
        expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument()
      })

      it("renders correct buttons in an open edit state", () => {
        render(
          <ListingFormActionsComponent
            user={partnerUser}
            listingStatus={ListingsStatusEnum.active}
            formActionType={ListingFormActionsType.edit}
          />
        )
        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Unpublish" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Exit" })).toBeInTheDocument()
      })

      it("renders correct buttons in a closed detail state", () => {
        render(
          <ListingFormActionsComponent
            user={partnerUser}
            listingStatus={ListingsStatusEnum.closed}
            formActionType={ListingFormActionsType.details}
          />
        )
        expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument()
        expect(screen.queryByText("Copy")).toBeFalsy()
        expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument()
      })

      it("renders correct buttons in a closed edit state", () => {
        render(
          <ListingFormActionsComponent
            user={partnerUser}
            listingStatus={ListingsStatusEnum.closed}
            formActionType={ListingFormActionsType.edit}
          />
        )

        expect(screen.queryByText("Reopen")).toBeFalsy()
        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Unpublish" })).toBeInTheDocument()
        // Disabled for Doorway
        // expect(screen.getByRole("button", { name: "Post Results" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Exit" })).toBeInTheDocument()
      })
    })
  })

  describe("with lotteries on", () => {
    beforeAll(() => {
      process.env.showLottery = "TRUE"
      adminUser = { ...adminUser, jurisdictions: [mockBaseJurisdiction] }
    })

    it("renders correct buttons in a closed edit state with lottery opted in", () => {
      render(
        <ListingFormActionsComponent
          user={adminUser}
          listingStatus={ListingsStatusEnum.closed}
          formActionType={ListingFormActionsType.edit}
          lotteryOptIn={true}
        />
      )
      expect(screen.queryByText("Post Results")).not.toBeInTheDocument()
    })

    it("renders correct buttons in a closed edit state with lottery opted out", () => {
      render(
        <ListingFormActionsComponent
          user={adminUser}
          listingStatus={ListingsStatusEnum.closed}
          formActionType={ListingFormActionsType.edit}
          lotteryOptIn={false}
        />
      )
      expect(screen.queryByText("Post Results")).toBeInTheDocument()
    })
  })

  describe("with all users able to copy", () => {
    describe("as an admin", () => {
      beforeAll(() => {
        adminUser = { ...adminUser, jurisdictions: [mockAllUserCopyJurisdiction] }
      })
      it("renders correct buttons in a draft detail state", () => {
        render(
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
        expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument()
        expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument()
      })

      it("renders correct buttons in a detail state", () => {
        render(
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
        expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument()
        expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument()
      })
      it("renders correct buttons in a closed detail state", () => {
        render(
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
        expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument()
        expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument()
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
        render(
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
        expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument()
        expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument()
      })

      it("renders correct buttons in a detail state", () => {
        render(
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
        expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument()
        expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument()
      })
      it("renders correct buttons in a closed detail state", () => {
        render(
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
        expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument()
        expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument()
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
        render(
          <ListingFormActionsComponent
            user={limitedJurisdictionAdminUser}
            listingStatus={ListingsStatusEnum.pending}
            formActionType={ListingFormActionsType.details}
          />
        )
        expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument()
        expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument()
      })

      it("renders correct buttons in a detail state", () => {
        render(
          <ListingFormActionsComponent
            user={limitedJurisdictionAdminUser}
            listingStatus={ListingsStatusEnum.active}
            formActionType={ListingFormActionsType.details}
          />
        )
        expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument()
        expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument()
      })
      it("renders correct buttons in a closed detail state", () => {
        render(
          <ListingFormActionsComponent
            user={limitedJurisdictionAdminUser}
            listingStatus={ListingsStatusEnum.closed}
            formActionType={ListingFormActionsType.details}
          />
        )
        expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument()
        expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument()
      })
    })

    describe("as a partner", () => {
      beforeAll(() => {
        partnerUser = { ...partnerUser, jurisdictions: [mockAllUserCopyJurisdiction] }
      })
      it("renders correct buttons in a draft detail state", () => {
        render(
          <ListingFormActionsComponent
            user={partnerUser}
            listingStatus={ListingsStatusEnum.pending}
            formActionType={ListingFormActionsType.details}
          />
        )
        expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument()
        expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument()
      })

      it("renders correct buttons in a detail state", () => {
        render(
          <ListingFormActionsComponent
            user={partnerUser}
            listingStatus={ListingsStatusEnum.active}
            formActionType={ListingFormActionsType.details}
          />
        )
        expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument()
        expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument()
      })
      it("renders correct buttons in a closed detail state", () => {
        render(
          <ListingFormActionsComponent
            user={partnerUser}
            listingStatus={ListingsStatusEnum.closed}
            formActionType={ListingFormActionsType.details}
          />
        )
        expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument()
        expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument()
      })
    })
  })

  describe("with partners not able to copy", () => {
    describe("as a partner", () => {
      beforeAll(() => {
        partnerUser = {
          ...partnerUser,
          jurisdictions: [mockOnlyAdminAndJurisAdminCopyJurisdiction],
        }
      })
      it("renders correct buttons in a draft detail state", () => {
        render(
          <ListingFormActionsComponent
            user={partnerUser}
            listingStatus={ListingsStatusEnum.pending}
            formActionType={ListingFormActionsType.details}
          />
        )
        expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument()
        expect(screen.queryAllByRole("button", { name: "Copy" })).toHaveLength(0)
        expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument()
      })

      it("renders correct buttons in a detail state", () => {
        render(
          <ListingFormActionsComponent
            user={partnerUser}
            listingStatus={ListingsStatusEnum.active}
            formActionType={ListingFormActionsType.details}
          />
        )
        expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument()
        expect(screen.queryAllByRole("button", { name: "Copy" })).toHaveLength(0)
        expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument()
      })
      it("renders correct buttons in a closed detail state", () => {
        render(
          <ListingFormActionsComponent
            user={partnerUser}
            listingStatus={ListingsStatusEnum.closed}
            formActionType={ListingFormActionsType.details}
          />
        )
        expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument()
        expect(screen.queryAllByRole("button", { name: "Copy" })).toHaveLength(0)
        expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument()
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
        render(
          <ListingFormActionsComponent
            user={adminUser}
            listingStatus={ListingsStatusEnum.closed}
            formActionType={ListingFormActionsType.details}
          />
        )
        expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument()
        expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument()
      })

      it("renders correct buttons in a closed edit state", () => {
        render(
          <ListingFormActionsComponent
            user={adminUser}
            listingStatus={ListingsStatusEnum.closed}
            formActionType={ListingFormActionsType.edit}
          />
        )
        expect(screen.queryByText("Reopen")).toBeFalsy()
        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Unpublish" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Post Results" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Exit" })).toBeInTheDocument()
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
        render(
          <ListingFormActionsComponent
            user={jurisdictionAdminUser}
            listingStatus={ListingsStatusEnum.closed}
            formActionType={ListingFormActionsType.details}
          />
        )
        expect(screen.queryByText("Edit")).toBeFalsy()
        expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument()
      })

      it("renders correct buttons in a closed edit state", () => {
        render(
          <ListingFormActionsComponent
            user={adminUser}
            listingStatus={ListingsStatusEnum.closed}
            formActionType={ListingFormActionsType.edit}
          />
        )
        expect(screen.queryByText("Reopen")).toBeFalsy()
        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Unpublish" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Post Results" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Exit" })).toBeInTheDocument()
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
        render(
          <ListingFormActionsComponent
            user={limitedJurisdictionAdminUser}
            listingStatus={ListingsStatusEnum.closed}
            formActionType={ListingFormActionsType.details}
          />
        )
        expect(screen.queryAllByRole("link", { name: "Edit" })).toHaveLength(0)
        expect(screen.queryAllByRole("button", { name: "Copy" })).toHaveLength(0)
        expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument()
      })

      it("renders correct buttons in a closed edit state", () => {
        render(
          <ListingFormActionsComponent
            user={limitedJurisdictionAdminUser}
            listingStatus={ListingsStatusEnum.closed}
            formActionType={ListingFormActionsType.edit}
          />
        )
        expect(screen.queryAllByRole("button", { name: "Reopen" })).toHaveLength(0)
        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Unpublish" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Post Results" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Exit" })).toBeInTheDocument()
      })
    })

    describe("as a partner", () => {
      beforeAll(() => {
        partnerUser = { ...partnerUser, jurisdictions: [mockBaseJurisdiction] }
      })

      it("renders correct buttons in a closed detail state", () => {
        render(
          <ListingFormActionsComponent
            user={partnerUser}
            listingStatus={ListingsStatusEnum.closed}
            formActionType={ListingFormActionsType.details}
          />
        )

        expect(screen.queryByText("Copy")).toBeFalsy()
        expect(screen.queryByText("Edit")).toBeFalsy()
        expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument()
      })

      it("renders correct buttons in a closed edit state", () => {
        render(
          <ListingFormActionsComponent
            user={adminUser}
            listingStatus={ListingsStatusEnum.closed}
            formActionType={ListingFormActionsType.edit}
          />
        )
        expect(screen.queryByText("Reopen")).toBeFalsy()
        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Unpublish" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Post Results" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Exit" })).toBeInTheDocument()
      })
    })
  })

  describe("with hideCloseListingButton flag enabled", () => {
    beforeAll(() => {
      doJurisdictionsHaveFeatureFlagOn = () => true
    })
    describe("as admin", () => {
      it("should not render the close button", () => {
        render(
          <ListingFormActionsComponent
            user={adminUser}
            listingStatus={ListingsStatusEnum.active}
            formActionType={ListingFormActionsType.edit}
          />
        )
        expect(screen.queryByText("Close")).toBeFalsy()
      })
    })
    describe("as partner", () => {
      it("should not render the close button", () => {
        render(
          <ListingFormActionsComponent
            user={partnerUser}
            listingStatus={ListingsStatusEnum.active}
            formActionType={ListingFormActionsType.edit}
          />
        )
        expect(screen.queryByText("Close")).toBeFalsy()
      })
    })
    describe("as jurisdiction admin", () => {
      it("should not render the close button", () => {
        render(
          <ListingFormActionsComponent
            user={jurisdictionAdminUser}
            listingStatus={ListingsStatusEnum.active}
            formActionType={ListingFormActionsType.edit}
          />
        )
        expect(screen.queryByText("Close")).toBeFalsy()
      })
    })
  })
})
