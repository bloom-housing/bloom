import React from "react"
import { cleanup } from "@testing-library/react"
import { ListingStatus, User } from "@bloom-housing/backend-core"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { listing } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { ListingContext } from "../../../src/components/listings/ListingContext"
import ListingFormActions from "../../../src/components/listings/ListingFormActions"
import { mockNextRouter, render } from "../../testUtils"

afterEach(cleanup)

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

const adminUser: User = {
  ...mockUser,
  roles: { user: { id: "123" }, userId: "123", isAdmin: true },
}

const partnerUser: User = {
  ...mockUser,
  roles: { user: { id: "123" }, userId: "123", isPartner: true },
}

describe("<ListingFormActions>", () => {
  beforeAll(() => {
    mockNextRouter()
  })

  describe("with listings approval off", () => {
    it("renders correct buttons in a new listing edit state", () => {
      const { getByText } = render(
        <ListingContext.Provider value={{ ...listing, status: ListingStatus.pending }}>
          <ListingFormActions type={"add"} />
        </ListingContext.Provider>
      )
      expect(getByText("Save as Draft")).toBeTruthy()
      expect(getByText("Publish")).toBeTruthy()
      expect(getByText("Cancel")).toBeTruthy()
    })

    it("renders correct buttons in a draft detail state", () => {
      const { getByText } = render(
        <ListingContext.Provider value={{ ...listing, status: ListingStatus.pending }}>
          <ListingFormActions type={"details"} />
        </ListingContext.Provider>
      )
      expect(getByText("Edit")).toBeTruthy()
      expect(getByText("Preview")).toBeTruthy()
    })

    it("renders correct buttons in a draft edit state", () => {
      const { getByText } = render(
        <ListingContext.Provider value={{ ...listing, status: ListingStatus.pending }}>
          <ListingFormActions type={"edit"} />
        </ListingContext.Provider>
      )
      expect(getByText("Save & Exit")).toBeTruthy()
      expect(getByText("Publish")).toBeTruthy()
      expect(getByText("Cancel")).toBeTruthy()
    })

    it("renders correct buttons in an open detail state", () => {
      const { getByText } = render(
        <ListingContext.Provider value={{ ...listing, status: ListingStatus.active }}>
          <ListingFormActions type={"details"} />
        </ListingContext.Provider>
      )
      expect(getByText("Edit")).toBeTruthy()
      expect(getByText("Preview")).toBeTruthy()
    })

    it("renders correct buttons in an open edit state", () => {
      const { getByText } = render(
        <ListingContext.Provider value={{ ...listing, status: ListingStatus.active }}>
          <ListingFormActions type={"edit"} />
        </ListingContext.Provider>
      )
      expect(getByText("Save & Exit")).toBeTruthy()
      expect(getByText("Close")).toBeTruthy()
      expect(getByText("Unpublish")).toBeTruthy()
      expect(getByText("Cancel")).toBeTruthy()
    })

    it("renders correct buttons in a closed detail state", () => {
      const { getByText } = render(
        <ListingContext.Provider value={{ ...listing, status: ListingStatus.closed }}>
          <ListingFormActions type={"details"} />
        </ListingContext.Provider>
      )
      expect(getByText("Edit")).toBeTruthy()
      expect(getByText("Preview")).toBeTruthy()
    })

    it("renders correct buttons in a closed edit state", () => {
      const { getByText } = render(
        <ListingContext.Provider value={{ ...listing, status: ListingStatus.closed }}>
          <ListingFormActions type={"edit"} />
        </ListingContext.Provider>
      )
      expect(getByText("Reopen")).toBeTruthy()
      expect(getByText("Save & Exit")).toBeTruthy()
      expect(getByText("Unpublish")).toBeTruthy()
      expect(getByText("Cancel")).toBeTruthy()
    })
  })

  describe("with listings approval on", () => {
    const OLD_ENV = process.env

    beforeEach(() => {
      jest.resetModules()
      process.env = { ...OLD_ENV, featureListingsApproval: "TRUE" }
    })

    afterAll(() => {
      process.env = OLD_ENV
    })

    describe("as an admin", () => {
      it("renders correct buttons in a new listing edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: adminUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.pending }}>
              <ListingFormActions type={"add"} />
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
              <ListingFormActions type={"details"} />
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
              <ListingFormActions type={"edit"} />
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
              <ListingFormActions type={"details"} />
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
              <ListingFormActions type={"edit"} />
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
              <ListingFormActions type={"details"} />
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
              <ListingFormActions type={"edit"} />
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
              <ListingFormActions type={"details"} />
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
              <ListingFormActions type={"edit"} />
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
              <ListingFormActions type={"details"} />
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
              <ListingFormActions type={"edit"} />
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
      it("renders correct buttons in a new listing edit state", () => {
        const { getByText } = render(
          <AuthContext.Provider value={{ profile: partnerUser }}>
            <ListingContext.Provider value={{ ...listing, status: ListingStatus.pending }}>
              <ListingFormActions type={"add"} />
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
              <ListingFormActions type={"details"} />
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
              <ListingFormActions type={"edit"} />
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
              <ListingFormActions type={"details"} />
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
              <ListingFormActions type={"details"} />
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
              <ListingFormActions type={"edit"} />
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
              <ListingFormActions type={"details"} />
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
              <ListingFormActions type={"edit"} />
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
              <ListingFormActions type={"details"} />
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
              <ListingFormActions type={"edit"} />
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
