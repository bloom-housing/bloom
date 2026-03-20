import React from "react"
import dayjs from "dayjs"
import { render, screen } from "@testing-library/react"
import { ListingView } from "../../../src/components/listing/ListingView"
import { listing, jurisdiction } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import {
  ApplicationMethodsTypeEnum,
  ListingsStatusEnum,
  ReviewOrderTypeEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { AuthContext } from "@bloom-housing/shared-helpers"

const renderListingView = (listingOverrides = {}, jurisdictionOverrides = {}, authOverrides = {}) =>
  render(
    <AuthContext.Provider
      value={{
        doJurisdictionsHaveFeatureFlagOn: () => false,
        ...authOverrides,
      }}
    >
      <ListingView
        listing={{ ...listing, ...listingOverrides }}
        jurisdiction={{ ...jurisdiction, ...jurisdictionOverrides }}
      />
    </AuthContext.Provider>
  )

describe("<ListingView>", () => {
  describe("'Apply Online' button visibility", () => {
    it("does not show if the due date is in the past", () => {
      const pastDate = dayjs().subtract(7, "day").toDate()
      const view = render(
        <AuthContext.Provider
          value={{
            doJurisdictionsHaveFeatureFlagOn: () => true,
          }}
        >
          <ListingView
            listing={{
              ...listing,
              applicationDueDate: pastDate,
            }}
            jurisdiction={jurisdiction}
          />
        </AuthContext.Provider>
      )
      expect(view.getByText(/Applications closed/)).toBeInTheDocument()
      expect(view.queryByRole("link", { name: "Apply online" })).toBeNull()
    })

    it("shows if the due date is in the future", () => {
      const futureDate = dayjs().add(7, "day").toDate()
      const view = render(
        <AuthContext.Provider
          value={{
            doJurisdictionsHaveFeatureFlagOn: () => true,
          }}
        >
          <ListingView
            listing={{
              ...listing,
              applicationDueDate: futureDate,
            }}
            jurisdiction={jurisdiction}
          />
        </AuthContext.Provider>
      )
      expect(view.getByRole("link", { name: "Apply online" })).toBeInTheDocument()
    })

    it("does not show for paper applications even with a future due date", () => {
      const futureDate = dayjs().add(7, "day").toDate()
      const view = render(
        <AuthContext.Provider
          value={{
            doJurisdictionsHaveFeatureFlagOn: () => true,
          }}
        >
          <ListingView
            listing={{
              ...listing,
              applicationDueDate: futureDate,
              applicationMethods: [
                {
                  ...listing.applicationMethods[0],
                  type: ApplicationMethodsTypeEnum.PaperPickup,
                },
              ],
            }}
            jurisdiction={jurisdiction}
          />
        </AuthContext.Provider>
      )
      expect(view.queryByRole("link", { name: "Apply online" })).toBeNull()
    })
  })

  describe("listing header", () => {
    it("renders the listing name as the primary heading, developer name,  building address, google maps link for the building address", () => {
      renderListingView()
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(listing.name)
      expect(screen.getByText(listing.developer)).toBeInTheDocument()
      expect(screen.getByRole("heading", { level: 2, name: /Archer Street/i })).toBeInTheDocument()
      const mapLink = screen.getByText("View on map")
      expect(mapLink).toBeInTheDocument()
      expect(mapLink).toHaveAttribute("href", expect.stringContaining("google.com/maps"))
    })
  })

  describe("reserved community types", () => {
    it("shows a reserved community tag and warning message when reserved community type is set", () => {
      renderListingView()
      const veteranElements = screen.getAllByText(/veteran/i, { exact: false })
      expect(veteranElements.length).toBeGreaterThan(0)
      expect(screen.getByText(/Reserved for Veterans/i)).toBeInTheDocument()
    })

    it("does not show a reserved community warning when not set", () => {
      renderListingView({ reservedCommunityTypes: null })
      expect(screen.queryByText(/Reserved for/i)).toBeNull()
    })
  })

  describe("application status display", () => {
    it("shows 'Applications closed' status when application due date is in the past", () => {
      const pastDate = dayjs().subtract(7, "day").toDate()
      renderListingView({ applicationDueDate: pastDate })
      expect(screen.getByText(/Applications closed/i, { exact: false })).toBeInTheDocument()
    })

    it("shows 'First come first serve' review order type in status", () => {
      renderListingView({ reviewOrderType: ReviewOrderTypeEnum.firstComeFirstServe })
      expect(screen.getByText(/First come first serve/i, { exact: false })).toBeInTheDocument()
    })

    it("shows 'Application due' when applications are still open", () => {
      const futureDate = dayjs().add(7, "day").toDate()
      renderListingView({ applicationDueDate: futureDate })
      expect(screen.getByText(/Application due/i, { exact: false })).toBeInTheDocument()
    })
  })

  describe("section 8 acceptance", () => {
    it("shows section 8 voucher info in main content area when section8Acceptance is true", () => {
      renderListingView({ section8Acceptance: true })
      expect(screen.getByText(/Section 8/i, { exact: false })).toBeInTheDocument()
    })

    it("does not show section 8 voucher info when section8Acceptance is false", () => {
      renderListingView({ section8Acceptance: false })
      expect(screen.queryByText(/Section 8/i, { exact: false })).toBeNull()
    })
  })

  describe("closed listings", () => {
    it("does not show the apply button when listing status is closed", () => {
      const futureDate = dayjs().add(7, "day").toDate()
      renderListingView({ status: ListingsStatusEnum.closed, applicationDueDate: futureDate })
      expect(screen.queryByRole("link", { name: "Apply online" })).toBeNull()
    })

    it("does not show apply button when listing is closed even if applications are open", () => {
      const futureDate = dayjs().add(7, "day").toDate()
      renderListingView({
        status: ListingsStatusEnum.closed,
        applicationDueDate: futureDate,
        applicationMethods: [
          {
            type: ApplicationMethodsTypeEnum.Internal,
            label: "Label",
            externalReference: "",
            acceptsPostmarkedApplications: false,
            phoneNumber: "123",
            id: "id",
            createdAt: new Date(),
            updatedAt: new Date(),
            paperApplications: [],
          },
        ],
      })
      expect(screen.queryByRole("link", { name: "Apply online" })).toBeNull()
    })
  })

  describe("waitlist section in mobile sidebar", () => {
    it("shows waitlist is open section when review order is waitlist and applications are open", () => {
      const futureDate = dayjs().add(7, "day").toDate()
      renderListingView({
        reviewOrderType: ReviewOrderTypeEnum.waitlist,
        applicationDueDate: futureDate,
        waitlistOpenSpots: 10,
      })
      expect(
        screen.getByRole("heading", { level: 4, name: /Waitlist is open/i })
      ).toBeInTheDocument()
    })

    it("shows vacant units section when review order is FCFS and applications are open", () => {
      const futureDate = dayjs().add(7, "day").toDate()
      renderListingView({
        reviewOrderType: ReviewOrderTypeEnum.firstComeFirstServe,
        applicationDueDate: futureDate,
        unitsAvailable: 5,
      })
      expect(
        screen.getByRole("heading", { level: 4, name: /Vacant units available/i })
      ).toBeInTheDocument()
    })

    it("does not show availability section when applications are closed", () => {
      const pastDate = dayjs().subtract(7, "day").toDate()
      renderListingView({
        reviewOrderType: ReviewOrderTypeEnum.waitlist,
        applicationDueDate: pastDate,
        waitlistOpenSpots: 10,
      })
      expect(screen.queryByRole("heading", { level: 4, name: /Waitlist is open/i })).toBeNull()
    })
  })

  describe("apply sidebar in mobile view", () => {
    it("shows GetApplication component when applications are open with internal method", () => {
      const futureDate = dayjs().add(7, "day").toDate()
      renderListingView({
        applicationDueDate: futureDate,
        applicationMethods: [
          {
            type: ApplicationMethodsTypeEnum.Internal,
            label: "Label",
            externalReference: "",
            acceptsPostmarkedApplications: false,
            phoneNumber: "123",
            id: "id",
            createdAt: new Date(),
            updatedAt: new Date(),
            paperApplications: [],
          },
        ],
      })
      expect(screen.getByRole("link", { name: "Apply online" })).toBeInTheDocument()
    })

    it("shows 'How to apply' section header when applications are open", () => {
      const futureDate = dayjs().add(7, "day").toDate()
      renderListingView({
        applicationDueDate: futureDate,
        applicationMethods: [
          {
            type: ApplicationMethodsTypeEnum.Internal,
            label: "Label",
            externalReference: "",
            acceptsPostmarkedApplications: false,
            phoneNumber: "123",
            id: "id",
            createdAt: new Date(),
            updatedAt: new Date(),
            paperApplications: [],
          },
        ],
      })
      expect(screen.getByRole("heading", { level: 2, name: /How to apply/i })).toBeInTheDocument()
    })

    it("does not show the apply sidebar when only referral method exists", () => {
      const futureDate = dayjs().add(7, "day").toDate()
      renderListingView({
        applicationDueDate: futureDate,
        applicationMethods: [
          {
            type: ApplicationMethodsTypeEnum.Referral,
            id: "id",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      })
      expect(screen.queryByRole("link", { name: "Apply online" })).toBeNull()
      expect(screen.queryByText(/Get application/i)).toBeNull()
    })
  })
})
