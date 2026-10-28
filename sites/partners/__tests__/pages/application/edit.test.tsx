import React from "react"
import { expect } from "@jest/globals"
import EditApplication from "../../../src/pages/application/[id]/edit"
import { render, screen, mockNextRouter } from "../../testUtils"
import userEvent from "@testing-library/user-event"
import {
  ApplicationDeclineReasonEnum,
  ApplicationStatusEnum,
  FeatureFlag,
  FeatureFlagEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { application, listing, user } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { rest } from "msw"
import { setupServer } from "msw/lib/node"

const server = setupServer()

beforeAll(() => {
  mockNextRouter()
  server.listen()
})

describe("application edit page", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(require("../../../src/lib/hooks"), "useSingleListingData").mockReturnValue({
      listingDto: listing,
    })
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(
          ctx.json({
            ...user,
            listings: [{ id: listing.id }],
            jurisdictions: [
              {
                id: "id",
                name: "Bloomington",
                featureFlags: [
                  {
                    name: FeatureFlagEnum.enableApplicationStatus,
                    active: true,
                  } as FeatureFlag,
                ],
              },
            ],
          })
        )
      })
    )
  })

  it("renders when preferences and programs are not arrays", async () => {
    mockNextRouter({ id: "application_1" })
    jest.spyOn(require("../../../src/lib/hooks"), "useSingleApplicationData").mockReturnValue({
      application: {
        ...application,
        preferences: {},
        programs: {},
      },
    })

    render(<EditApplication />)

    expect(await screen.findByRole("button", { name: /save & exit/i })).toBeInTheDocument()
  })

  describe("confirmation modal when application status changes and waitlist numbers are updated", () => {
    it("opens confirmation modal when application got wait list numbers and status changes to non wait list", async () => {
      mockNextRouter({ id: "application_1" })
      jest.spyOn(require("../../../src/lib/hooks"), "useSingleApplicationData").mockReturnValue({
        application: {
          ...application,
          status: ApplicationStatusEnum.waitlist,
          accessibleUnitWaitlistNumber: 3,
          conventionalUnitWaitlistNumber: 8,
        },
      })

      render(<EditApplication />)

      expect(screen.queryByText("Are you sure?")).toBeNull()

      const statusSelect = await screen.findByLabelText(/status/i)
      await userEvent.selectOptions(statusSelect, ApplicationStatusEnum.declined)

      const declineSelect = screen.getByLabelText(/decline reason/i)
      await userEvent.selectOptions(
        declineSelect,
        ApplicationDeclineReasonEnum.householdIncomeTooHigh
      )

      const saveButton = screen.getByRole("button", { name: "Save & exit" })
      await userEvent.click(saveButton)

      expect(await screen.findByText("Are you sure?")).toBeInTheDocument()
      expect(
        screen.getByText(
          "Saving will send an email to the applicant summarizing the following change(s):"
        )
      ).toBeInTheDocument()
      expect(screen.getByText("Status: Declined")).toBeInTheDocument()
      expect(
        screen.getByText("The following will no longer be accessible to the applicant:")
      ).toBeInTheDocument()
      expect(screen.getByText("Accessible Wait list #: 3")).toBeInTheDocument()
      expect(screen.getByText("Conventional Wait list #: 8")).toBeInTheDocument()
    })
    it("opens confirmation modal when application got wait list numbers and status changes from wait list to wait list - declined", async () => {
      mockNextRouter({ id: "application_1" })
      jest.spyOn(require("../../../src/lib/hooks"), "useSingleApplicationData").mockReturnValue({
        application: {
          ...application,
          status: ApplicationStatusEnum.waitlist,
          accessibleUnitWaitlistNumber: 3,
          conventionalUnitWaitlistNumber: 8,
        },
      })

      render(<EditApplication />)

      const statusSelect = await screen.findByLabelText("Status")
      await userEvent.selectOptions(statusSelect, ApplicationStatusEnum.waitlistDeclined)

      const saveButton = screen.getByRole("button", { name: "Save & exit" })
      await userEvent.click(saveButton)

      expect(await screen.findByText("Are you sure?")).toBeInTheDocument()
      expect(
        screen.getByText(
          "Saving will send an email to the applicant summarizing the following change(s):"
        )
      ).toBeInTheDocument()
      expect(screen.getByText("Status: Wait list - Declined")).toBeInTheDocument()
      expect(
        screen.queryByText("The following will no longer be accessible to the applicant:")
      ).not.toBeInTheDocument()
      expect(screen.queryByText("Accessible Wait list #: 3")).not.toBeInTheDocument()
      expect(screen.queryByText("Conventional Wait list #: 8")).not.toBeInTheDocument()
    })

    it("application submited status to wait list with wait list numbers", async () => {
      mockNextRouter({ id: "application_1" })
      jest.spyOn(require("../../../src/lib/hooks"), "useSingleApplicationData").mockReturnValue({
        application: {
          ...application,
          status: ApplicationStatusEnum.submitted,
          accessibleUnitWaitlistNumber: undefined,
          conventionalUnitWaitlistNumber: undefined,
        },
      })

      render(<EditApplication />)

      const statusSelect = await screen.findByLabelText("Status")
      await userEvent.selectOptions(statusSelect, ApplicationStatusEnum.waitlist)

      const accessibleInput = screen.getByLabelText("Accessible unit wait list (AUWL)")
      await userEvent.clear(accessibleInput)
      await userEvent.type(accessibleInput, "3")

      const conventionalInput = screen.getByLabelText("Conventional unit wait list (CUWL)")
      await userEvent.clear(conventionalInput)
      await userEvent.type(conventionalInput, "8")

      const saveButton = screen.getByRole("button", { name: "Save & exit" })
      await userEvent.click(saveButton)

      expect(await screen.findByText("Are you sure?")).toBeInTheDocument()
      expect(
        await screen.findByText(
          "Saving will send an email to the applicant summarizing the following change(s):"
        )
      ).toBeInTheDocument()
      expect(await screen.findByText("Status: Wait list")).toBeInTheDocument()
      expect(await screen.findByText("Accessible Wait list #: 3")).toBeInTheDocument()
      expect(await screen.findByText("Conventional Wait list #: 8")).toBeInTheDocument()
    })

    it("lists wait list removals when numbers are cleared", async () => {
      mockNextRouter({ id: "application_1" })
      jest.spyOn(require("../../../src/lib/hooks"), "useSingleApplicationData").mockReturnValue({
        application: {
          ...application,
          status: ApplicationStatusEnum.waitlist,
          accessibleUnitWaitlistNumber: 2,
          conventionalUnitWaitlistNumber: 4,
        },
      })

      render(<EditApplication />)

      const accessibleInput = await screen.findByLabelText("Accessible unit wait list (AUWL)")
      await userEvent.clear(accessibleInput)

      const conventionalInput = screen.getByLabelText("Conventional unit wait list (CUWL)")
      await userEvent.clear(conventionalInput)

      const saveButton = screen.getByRole("button", { name: "Save & exit" })
      await userEvent.click(saveButton)

      expect(await screen.findByText("Are you sure?")).toBeInTheDocument()
      expect(
        screen.queryByText(
          "Saving will send an email to the applicant summarizing the following change(s):"
        )
      ).not.toBeInTheDocument()
      expect(
        screen.getByText("The following will no longer be accessible to the applicant:")
      ).toBeInTheDocument()
      expect(screen.getByText("Accessible Wait list #: 2")).toBeInTheDocument()
      expect(screen.getByText("Conventional Wait list #: 4")).toBeInTheDocument()
    })
  })
})
