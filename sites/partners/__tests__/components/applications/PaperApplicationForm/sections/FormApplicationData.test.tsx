import { render, screen, waitFor } from "@testing-library/react"
import React from "react"
import userEvent from "@testing-library/user-event"
import {
  LanguagesEnum,
  ApplicationDeclineReasonEnum,
  ApplicationStatusEnum,
  ReviewOrderTypeEnum,
  ApplicationSubmissionTypeEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { FormProviderWrapper } from "../../../../testUtils"
import { FormApplicationData } from "../../../../../src/components/applications/PaperApplicationForm/sections/FormApplicationData"

const defaultFormApplicationDataProps = {
  enableApplicationStatus: false,
  enableReceivedAtAndByFields: false,
  appType: ApplicationSubmissionTypeEnum.paper,
}

describe("<FormApplicationData>", () => {
  it("renders the form with application data fields", () => {
    render(
      <FormProviderWrapper>
        <FormApplicationData {...defaultFormApplicationDataProps} />
      </FormProviderWrapper>
    )
    expect(screen.getByRole("heading", { level: 2, name: /application data/i })).toBeInTheDocument()

    expect(screen.getByText(/date submitted/i)).toBeInTheDocument()
    expect(screen.getByTestId("dateSubmitted-month")).toBeInTheDocument()
    expect(screen.getByTestId("dateSubmitted-day")).toBeInTheDocument()
    expect(screen.getByTestId("dateSubmitted-year")).toBeInTheDocument()

    expect(screen.getByText(/time submitted/i)).toBeInTheDocument()
    expect(screen.getByTestId("timeSubmitted-hours")).toBeInTheDocument()
    expect(screen.getByTestId("timeSubmitted-minutes")).toBeInTheDocument()
    expect(screen.getByTestId("timeSubmitted-period")).toBeInTheDocument()

    expect(screen.getByLabelText(/language submitted in/i)).toBeInTheDocument()
  })

  it("time fields are disabled when date is not fully entered", async () => {
    render(
      <FormProviderWrapper>
        <FormApplicationData {...defaultFormApplicationDataProps} />
      </FormProviderWrapper>
    )

    const timeHours = screen.getByTestId("timeSubmitted-hours")
    const timeMinutes = screen.getByTestId("timeSubmitted-minutes")
    const timePeriod = screen.getByTestId("timeSubmitted-period")

    expect(timeHours).toBeDisabled()
    expect(timeMinutes).toBeDisabled()
    expect(timePeriod).toBeDisabled()

    const monthInput = screen.getByTestId("dateSubmitted-month")
    const dayInput = screen.getByTestId("dateSubmitted-day")
    const yearInput = screen.getByTestId("dateSubmitted-year")

    await userEvent.type(monthInput, "2")
    await userEvent.type(dayInput, "10")
    await userEvent.type(yearInput, "2025")

    await waitFor(() => {
      expect(timeHours).not.toBeDisabled()
      expect(timeMinutes).not.toBeDisabled()
      expect(timePeriod).not.toBeDisabled()
    })
  })

  it("language selection works correctly", async () => {
    render(
      <FormProviderWrapper>
        <FormApplicationData {...defaultFormApplicationDataProps} />
      </FormProviderWrapper>
    )

    const languageSelect = screen.getByLabelText(/language submitted in/i)
    await userEvent.selectOptions(languageSelect, LanguagesEnum.en)

    expect((languageSelect as HTMLSelectElement).value).toBe(LanguagesEnum.en)
  })

  it("clearing date fields does not resets time fields", async () => {
    render(
      <FormProviderWrapper>
        <FormApplicationData {...defaultFormApplicationDataProps} />
      </FormProviderWrapper>
    )

    const timeHours = screen.getByTestId("timeSubmitted-hours")
    const timeMinutes = screen.getByTestId("timeSubmitted-minutes")
    const timePeriod = screen.getByTestId("timeSubmitted-period")
    const monthInput = screen.getByTestId("dateSubmitted-month")
    const dayInput = screen.getByTestId("dateSubmitted-day")
    const yearInput = screen.getByTestId("dateSubmitted-year")

    await userEvent.type(monthInput, "2")
    await userEvent.type(dayInput, "10")
    await userEvent.type(yearInput, "2025")

    await userEvent.type(timeHours, "12")
    await userEvent.type(timeMinutes, "30")
    await userEvent.selectOptions(timePeriod, "pm")

    expect((timeHours as HTMLInputElement).value).toBe("12")
    expect((timeMinutes as HTMLInputElement).value).toBe("30")
    expect((timePeriod as HTMLSelectElement).value).toBe("pm")

    await userEvent.clear(monthInput)
    await userEvent.clear(dayInput)
    await userEvent.clear(yearInput)

    expect(timeHours).toBeDisabled()
    expect(timeMinutes).toBeDisabled()
    expect(timePeriod).toBeDisabled()
    expect((timeHours as HTMLInputElement).value).toBe("12")
    expect((timeMinutes as HTMLInputElement).value).toBe("30")
    expect((timePeriod as HTMLSelectElement).value).toBe("pm")
  })

  describe("received at and by fields", () => {
    it("does not render received fields when the feature flag is disabled", () => {
      render(
        <FormProviderWrapper>
          <FormApplicationData {...defaultFormApplicationDataProps} />
        </FormProviderWrapper>
      )

      expect(screen.queryByText(/date received at/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/time received at/i)).not.toBeInTheDocument()
      expect(screen.queryByLabelText(/received by/i)).not.toBeInTheDocument()
    })

    it("renders received fields for paper applications when the feature flag is enabled", async () => {
      render(
        <FormProviderWrapper>
          <FormApplicationData
            {...defaultFormApplicationDataProps}
            enableReceivedAtAndByFields={true}
          />
        </FormProviderWrapper>
      )

      expect(screen.getByText(/date received at/i)).toBeInTheDocument()
      expect(screen.getByTestId("dateReceived-month")).toBeInTheDocument()
      expect(screen.getByTestId("dateReceived-day")).toBeInTheDocument()
      expect(screen.getByTestId("dateReceived-year")).toBeInTheDocument()

      const timeReceivedHours = screen.getByTestId("timeReceived-hours")
      const timeReceivedMinutes = screen.getByTestId("timeReceived-minutes")
      const timeReceivedPeriod = screen.getByTestId("timeReceived-period")

      expect(screen.getByText(/time received at/i)).toBeInTheDocument()
      expect(timeReceivedHours).toBeDisabled()
      expect(timeReceivedMinutes).toBeDisabled()
      expect(timeReceivedPeriod).toBeDisabled()

      const receivedByInput = screen.getByLabelText(/received by/i)
      await userEvent.type(receivedByInput, "Leasing Office")
      expect((receivedByInput as HTMLInputElement).value).toBe("Leasing Office")
    })

    it("does not render received fields for electronic applications", () => {
      render(
        <FormProviderWrapper>
          <FormApplicationData
            {...defaultFormApplicationDataProps}
            enableReceivedAtAndByFields={true}
            appType={ApplicationSubmissionTypeEnum.electronical}
          />
        </FormProviderWrapper>
      )

      expect(screen.queryByText(/date received at/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/time received at/i)).not.toBeInTheDocument()
      expect(screen.queryByLabelText(/received by/i)).not.toBeInTheDocument()
    })
  })

  describe("application status dropdown", () => {
    it("does not render when enableApplicationStatus is false", () => {
      render(
        <FormProviderWrapper>
          <FormApplicationData {...defaultFormApplicationDataProps} />
        </FormProviderWrapper>
      )

      expect(screen.queryByLabelText(/status/i)).not.toBeInTheDocument()
    })

    it("allows selecting different application status values", async () => {
      render(
        <FormProviderWrapper>
          <FormApplicationData
            {...defaultFormApplicationDataProps}
            enableApplicationStatus={true}
          />
        </FormProviderWrapper>
      )

      const statusSelect = screen.getByLabelText(/status/i)

      await userEvent.selectOptions(statusSelect, ApplicationStatusEnum.submitted)
      expect((statusSelect as HTMLSelectElement).value).toBe(ApplicationStatusEnum.submitted)

      await userEvent.selectOptions(statusSelect, ApplicationStatusEnum.declined)
      expect((statusSelect as HTMLSelectElement).value).toBe(ApplicationStatusEnum.declined)

      await userEvent.selectOptions(statusSelect, ApplicationStatusEnum.receivedUnit)
      expect((statusSelect as HTMLSelectElement).value).toBe(ApplicationStatusEnum.receivedUnit)

      await userEvent.selectOptions(statusSelect, ApplicationStatusEnum.waitlist)
      expect((statusSelect as HTMLSelectElement).value).toBe(ApplicationStatusEnum.waitlist)

      await userEvent.selectOptions(statusSelect, ApplicationStatusEnum.waitlistDeclined)
      expect((statusSelect as HTMLSelectElement).value).toBe(ApplicationStatusEnum.waitlistDeclined)
    })
  })

  describe("Application status fields", () => {
    it("renders waitlist fields when status is waitlist", async () => {
      render(
        <FormProviderWrapper>
          <FormApplicationData
            {...defaultFormApplicationDataProps}
            enableApplicationStatus={true}
          />
        </FormProviderWrapper>
      )

      const statusSelect = screen.getByLabelText(/status/i)
      await userEvent.selectOptions(statusSelect, ApplicationStatusEnum.waitlist)

      const auwlInput = screen.getByLabelText(/accessible unit wait list \(AUWL\)/i)
      const cuwlInput = screen.getByLabelText(/conventional unit wait list \(CUWL\)/i)
      expect(auwlInput).toBeInTheDocument()
      expect(cuwlInput).toBeInTheDocument()
      expect(auwlInput.closest(".hidden")).not.toBeInTheDocument()
      expect(cuwlInput.closest(".hidden")).not.toBeInTheDocument()
      expect(screen.queryByLabelText(/lottery number/i)).not.toBeInTheDocument()
    })

    it("renders waitlist fields when status is waitlistDeclined", async () => {
      render(
        <FormProviderWrapper>
          <FormApplicationData
            {...defaultFormApplicationDataProps}
            enableApplicationStatus={true}
          />
        </FormProviderWrapper>
      )

      const statusSelect = screen.getByLabelText(/status/i)
      await userEvent.selectOptions(statusSelect, ApplicationStatusEnum.waitlistDeclined)

      const auwlInput = screen.getByLabelText(/accessible unit wait list \(AUWL\)/i)
      const cuwlInput = screen.getByLabelText(/conventional unit wait list \(CUWL\)/i)
      expect(auwlInput).toBeInTheDocument()
      expect(cuwlInput).toBeInTheDocument()
      expect(auwlInput.closest(".hidden")).not.toBeInTheDocument()
      expect(cuwlInput.closest(".hidden")).not.toBeInTheDocument()
    })

    it("does not render waitlist fields when status is not waitlist and no numbers are present", async () => {
      render(
        <FormProviderWrapper>
          <FormApplicationData
            {...defaultFormApplicationDataProps}
            enableApplicationStatus={true}
          />
        </FormProviderWrapper>
      )

      const statusSelect = screen.getByLabelText(/status/i)
      await userEvent.selectOptions(statusSelect, ApplicationStatusEnum.submitted)

      const auwlInput = screen.getByLabelText(/accessible unit wait list/i)
      const cuwlInput = screen.getByLabelText(/conventional unit wait list/i)

      // Check if the closest Grid.Cell has the hidden class
      expect(auwlInput.closest(".hidden")).toBeInTheDocument()
      expect(cuwlInput.closest(".hidden")).toBeInTheDocument()
    })

    it("renders lottery position field when reviewOrderType is lottery", () => {
      render(
        <FormProviderWrapper>
          <FormApplicationData
            {...defaultFormApplicationDataProps}
            enableApplicationStatus={true}
            reviewOrderType={ReviewOrderTypeEnum.lottery}
          />
        </FormProviderWrapper>
      )

      expect(screen.getByLabelText(/lottery number/i)).toBeInTheDocument()
    })

    it("shows disabled display fields when status controls are disabled", () => {
      render(
        <FormProviderWrapper>
          <FormApplicationData
            {...defaultFormApplicationDataProps}
            enableApplicationStatus={true}
            disableApplicationStatusControls={true}
            reviewOrderType={ReviewOrderTypeEnum.lottery}
          />
        </FormProviderWrapper>
      )

      const activeStatusSelect = screen.getByTestId("applicationStatusSelect")
      const displayStatusSelect = screen.getByTestId("applicationStatusSelectDisplay")
      expect(activeStatusSelect.closest(".hidden")).toBeInTheDocument()
      expect(displayStatusSelect).toBeDisabled()

      const activeAuwlInput = screen.getByTestId("applicationAccessibleUnitWaitlistNumber")
      const displayAuwlInput = screen.getByTestId("applicationAccessibleUnitWaitlistNumberDisplay")
      expect(activeAuwlInput.closest(".hidden")).toBeInTheDocument()
      expect(displayAuwlInput).toBeDisabled()

      const activeCuwlInput = screen.getByTestId("applicationConventionalUnitWaitlistNumber")
      const displayCuwlInput = screen.getByTestId(
        "applicationConventionalUnitWaitlistNumberDisplay"
      )
      expect(activeCuwlInput.closest(".hidden")).toBeInTheDocument()
      expect(displayCuwlInput).toBeDisabled()

      const activeLotteryInput = screen.getByTestId("applicationManualLotteryPositionNumber")
      const displayLotteryInput = screen.getByTestId(
        "applicationManualLotteryPositionNumberDisplay"
      )
      expect(activeLotteryInput.closest(".hidden")).toBeInTheDocument()
      expect(displayLotteryInput).toBeDisabled()
    })
  })

  describe("decline reason dropdown", () => {
    it("does not render when enableApplicationStatus is false", () => {
      render(
        <FormProviderWrapper>
          <FormApplicationData {...defaultFormApplicationDataProps} />
        </FormProviderWrapper>
      )

      expect(screen.queryByTestId("applicationDeclineReasonSelect")).not.toBeInTheDocument()
    })

    it("does not render when status is not declined", async () => {
      render(
        <FormProviderWrapper>
          <FormApplicationData
            {...defaultFormApplicationDataProps}
            enableApplicationStatus={true}
          />
        </FormProviderWrapper>
      )

      const statusSelect = screen.getByTestId("applicationStatusSelect")
      await userEvent.selectOptions(statusSelect, ApplicationStatusEnum.submitted)

      const declineReasonCell = screen
        .getByTestId("applicationDeclineReasonSelect")
        .closest(".hidden")
      expect(declineReasonCell).toBeInTheDocument()
    })

    it("renders and is interactive when status is declined", async () => {
      render(
        <FormProviderWrapper>
          <FormApplicationData
            {...defaultFormApplicationDataProps}
            enableApplicationStatus={true}
          />
        </FormProviderWrapper>
      )

      const statusSelect = screen.getByTestId("applicationStatusSelect")
      await userEvent.selectOptions(statusSelect, ApplicationStatusEnum.declined)

      const declineSelect = screen.getByTestId("applicationDeclineReasonSelect")
      expect(declineSelect.closest(".hidden")).not.toBeInTheDocument()

      await userEvent.selectOptions(declineSelect, ApplicationDeclineReasonEnum.doesNotQualify)
      expect((declineSelect as HTMLSelectElement).value).toBe(
        ApplicationDeclineReasonEnum.doesNotQualify
      )
    })

    it("allows selecting all decline reason options", async () => {
      render(
        <FormProviderWrapper>
          <FormApplicationData
            {...defaultFormApplicationDataProps}
            enableApplicationStatus={true}
          />
        </FormProviderWrapper>
      )

      const statusSelect = screen.getByTestId("applicationStatusSelect")
      await userEvent.selectOptions(statusSelect, ApplicationStatusEnum.declined)

      const declineSelect = screen.getByTestId("applicationDeclineReasonSelect")

      for (const reason of Object.values(ApplicationDeclineReasonEnum)) {
        await userEvent.selectOptions(declineSelect, reason)
        expect((declineSelect as HTMLSelectElement).value).toBe(reason)
      }
    })

    it("hides the active select and shows disabled display when controls are disabled", async () => {
      render(
        <FormProviderWrapper>
          <FormApplicationData
            {...defaultFormApplicationDataProps}
            enableApplicationStatus={true}
            disableApplicationStatusControls={true}
          />
        </FormProviderWrapper>
      )

      const activeSelect = screen.getByTestId("applicationDeclineReasonSelect")
      const displaySelect = screen.getByTestId("applicationDeclineReasonSelectDisplay")
      expect(activeSelect.closest(".hidden")).toBeInTheDocument()
      expect(displaySelect).toBeDisabled()
    })
  })
})
