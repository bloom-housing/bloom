/* eslint-disable import/no-named-as-default */
import React from "react"
import {
  ApplicationDeclineReasonEnum,
  ApplicationStatusEnum,
  ApplicationSubmissionTypeEnum,
  LanguagesEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { application, user } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { mockNextRouter, render, screen, within } from "../../../../testUtils"
import DetailsApplicationData from "../../../../../src/components/applications/PaperApplicationDetails/sections/DetailsApplicationData"
import { ApplicationContext } from "../../../../../src/components/applications/ApplicationContext"
import { AuthContext } from "@bloom-housing/shared-helpers"

const renderDetailsApplicationData = ({
  applicationOverrides = {},
  enableApplicationStatus = false,
  enableReceivedAtAndByFields = false,
}: {
  applicationOverrides?: Partial<typeof application>
  enableApplicationStatus?: boolean
  enableReceivedAtAndByFields?: boolean
} = {}) => {
  mockNextRouter({ id: "application_1" })
  return render(
    <AuthContext.Provider
      value={{
        profile: { ...user, listings: [], jurisdictions: [] },
      }}
    >
      <ApplicationContext.Provider
        value={{
          ...application,
          ...applicationOverrides,
        }}
      >
        <DetailsApplicationData
          enableApplicationStatus={enableApplicationStatus}
          enableReceivedAtAndByFields={enableReceivedAtAndByFields}
        />
      </ApplicationContext.Provider>
    </AuthContext.Provider>
  )
}

describe("DetailApplicationData", () => {
  it("should display Application Data section info", () => {
    renderDetailsApplicationData({
      applicationOverrides: {
        language: LanguagesEnum.es,
        submissionDate: new Date("January 28, 2025 13:09:00"),
      },
    })

    expect(screen.getByRole("heading", { name: "Application data", level: 2 })).toBeInTheDocument()
    expect(within(screen.getByTestId("number")).getByText("Confirmation code")).toBeInTheDocument()
    expect(within(screen.getByTestId("number")).getByText("ABCD1234")).toBeInTheDocument()
    expect(
      within(screen.getByTestId("type")).getByText("Application submission type")
    ).toBeInTheDocument()
    expect(within(screen.getByTestId("type")).getByText("Electronic")).toBeInTheDocument()
    expect(
      within(screen.getByTestId("submittedDate")).getByText("Application submitted date")
    ).toBeInTheDocument()
    expect(within(screen.getByTestId("submittedDate")).getByText("1/28/2025")).toBeInTheDocument()
    expect(
      within(screen.getByTestId("timeDate")).getByText("Application submitted time")
    ).toBeInTheDocument()
    expect(within(screen.getByTestId("timeDate")).getByText("1:09:00 PM UTC")).toBeInTheDocument()
    expect(
      within(screen.getByTestId("language")).getByText("Application language")
    ).toBeInTheDocument()
    expect(within(screen.getByTestId("language")).getByText("Español")).toBeInTheDocument()
    expect(
      within(screen.getByTestId("totalSize")).getByText("Total household size")
    ).toBeInTheDocument()
    expect(within(screen.getByTestId("totalSize")).getByText("2")).toBeInTheDocument()
    expect(within(screen.getByTestId("submittedBy")).getByText("Submitted by")).toBeInTheDocument()
    expect(
      within(screen.getByTestId("submittedBy")).getByText("Applicant First Applicant Last")
    ).toBeInTheDocument()
  })

  it("does not display received fields when the feature flag is disabled", () => {
    renderDetailsApplicationData({
      applicationOverrides: {
        submissionType: ApplicationSubmissionTypeEnum.paper,
        receivedAt: new Date("January 29, 2025 14:10:00"),
        receivedBy: "Leasing Office",
      },
    })

    expect(screen.queryByTestId("receivedDate")).not.toBeInTheDocument()
    expect(screen.queryByTestId("receivedTime")).not.toBeInTheDocument()
    expect(screen.queryByTestId("receivedBy")).not.toBeInTheDocument()
  })

  it("displays received fields for paper applications when the feature flag is enabled", () => {
    renderDetailsApplicationData({
      applicationOverrides: {
        submissionType: ApplicationSubmissionTypeEnum.paper,
        receivedAt: new Date("January 29, 2025 14:10:00"),
        receivedBy: "Leasing Office",
      },
      enableReceivedAtAndByFields: true,
    })

    expect(
      within(screen.getByTestId("receivedDate")).getByText("Application received date")
    ).toBeInTheDocument()
    expect(within(screen.getByTestId("receivedDate")).getByText("1/29/2025")).toBeInTheDocument()
    expect(
      within(screen.getByTestId("receivedTime")).getByText("Application received time")
    ).toBeInTheDocument()
    expect(
      within(screen.getByTestId("receivedTime")).getByText("2:10:00 PM UTC")
    ).toBeInTheDocument()
    expect(within(screen.getByTestId("receivedBy")).getByText("Received by")).toBeInTheDocument()
    expect(within(screen.getByTestId("receivedBy")).getByText("Leasing Office")).toBeInTheDocument()
  })

  it("does not display received fields for electronic applications", () => {
    renderDetailsApplicationData({
      applicationOverrides: {
        submissionType: ApplicationSubmissionTypeEnum.electronical,
        receivedAt: new Date("January 29, 2025 14:10:00"),
        receivedBy: "Leasing Office",
      },
      enableReceivedAtAndByFields: true,
    })

    expect(screen.queryByTestId("receivedDate")).not.toBeInTheDocument()
    expect(screen.queryByTestId("receivedTime")).not.toBeInTheDocument()
    expect(screen.queryByTestId("receivedBy")).not.toBeInTheDocument()
  })

  describe("decline reason", () => {
    it("does not display decline reason when enableApplicationStatus is false", () => {
      renderDetailsApplicationData({
        applicationOverrides: {
          status: ApplicationStatusEnum.declined,
          applicationDeclineReason: ApplicationDeclineReasonEnum.householdIncomeTooHigh,
        },
        enableApplicationStatus: false,
      })

      expect(screen.queryByText(/decline reason/i)).not.toBeInTheDocument()
    })

    it("does not display decline reason when status is not declined", () => {
      renderDetailsApplicationData({
        applicationOverrides: {
          status: ApplicationStatusEnum.submitted,
          applicationDeclineReason: undefined,
        },
        enableApplicationStatus: true,
      })

      expect(screen.queryByText(/decline reason/i)).not.toBeInTheDocument()
    })

    it("displays decline reason label with n/a when status is declined but no reason is set", () => {
      renderDetailsApplicationData({
        applicationOverrides: {
          status: ApplicationStatusEnum.declined,
          applicationDeclineReason: undefined,
        },
        enableApplicationStatus: true,
      })

      expect(
        within(screen.getByTestId("applicationDeclineReason")).getByText("n/a")
      ).toBeInTheDocument()
      expect(
        within(screen.getByTestId("applicationDeclineReasonAdditionalDetails")).getByText("n/a")
      ).toBeInTheDocument()
    })

    it("displays additional details when provided and n/a when not", () => {
      const { unmount } = renderDetailsApplicationData({
        applicationOverrides: {
          status: ApplicationStatusEnum.declined,
          applicationDeclineReason: ApplicationDeclineReasonEnum.householdIncomeTooHigh,
          applicationDeclineReasonAdditionalDetails: "Some extra context",
        },
        enableApplicationStatus: true,
      })
      expect(screen.getByText("Some extra context")).toBeInTheDocument()
      unmount()

      renderDetailsApplicationData({
        applicationOverrides: {
          status: ApplicationStatusEnum.declined,
          applicationDeclineReason: ApplicationDeclineReasonEnum.householdIncomeTooHigh,
          applicationDeclineReasonAdditionalDetails: undefined,
        },
        enableApplicationStatus: true,
      })
      expect(
        within(screen.getByTestId("applicationDeclineReasonAdditionalDetails")).getByText("n/a")
      ).toBeInTheDocument()
    })

    it("displays decline reason label and translated value when status is declined", () => {
      renderDetailsApplicationData({
        applicationOverrides: {
          status: ApplicationStatusEnum.declined,
          applicationDeclineReason: ApplicationDeclineReasonEnum.householdIncomeTooHigh,
        },
        enableApplicationStatus: true,
      })

      expect(screen.getByText("Decline reason")).toBeInTheDocument()
      expect(screen.getByText(/household income too high/i)).toBeInTheDocument()
    })

    it("displays the correct label for each decline reason value", () => {
      const cases: [ApplicationDeclineReasonEnum, RegExp][] = [
        [ApplicationDeclineReasonEnum.householdIncomeTooHigh, /household income too high/i],
        [ApplicationDeclineReasonEnum.householdIncomeTooLow, /household income too low/i],
        [ApplicationDeclineReasonEnum.householdSizeTooLarge, /household size too large/i],
        [ApplicationDeclineReasonEnum.householdSizeTooSmall, /household size too small/i],
        [ApplicationDeclineReasonEnum.attemptedToContactNoResponse, /attempted to contact/i],
        [ApplicationDeclineReasonEnum.applicantDeclinedUnit, /applicant declined unit/i],
        [
          ApplicationDeclineReasonEnum.doesNotMeetSeniorBuildingRequirement,
          /does not meet senior building requirement/i,
        ],
        [
          ApplicationDeclineReasonEnum.householdDoesNotNeedAccessibleUnit,
          /household does not need accessible unit/i,
        ],
        [ApplicationDeclineReasonEnum.other, /^other$/i],
      ]

      cases.forEach(([reason, labelPattern]) => {
        const { unmount } = renderDetailsApplicationData({
          applicationOverrides: {
            status: ApplicationStatusEnum.declined,
            applicationDeclineReason: reason,
          },
          enableApplicationStatus: true,
        })
        expect(screen.getByText(labelPattern)).toBeInTheDocument()
        unmount()
      })
    })
  })
})
