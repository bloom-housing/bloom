import { render, screen, waitFor } from "@testing-library/react"
import React from "react"
import userEvent from "@testing-library/user-event"
import {
  LanguagesEnum,
  ApplicationStatusEnum,
  ReviewOrderTypeEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { FormProviderWrapper } from "../../../../testUtils"
import { FormApplicationData } from "../../../../../src/components/applications/PaperApplicationForm/sections/FormApplicationData"

describe("<FormApplicationData>", () => {
  it("renders the form with application data fields", () => {
    render(
      <FormProviderWrapper>
        <FormApplicationData enableApplicationStatus={false} />
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
        <FormApplicationData enableApplicationStatus={false} />
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
        <FormApplicationData enableApplicationStatus={false} />
      </FormProviderWrapper>
    )

    const languageSelect = screen.getByLabelText(/language submitted in/i)
    await userEvent.selectOptions(languageSelect, LanguagesEnum.en)

    expect((languageSelect as HTMLSelectElement).value).toBe(LanguagesEnum.en)
  })

  it("clearing date fields does not resets time fields", async () => {
    render(
      <FormProviderWrapper>
        <FormApplicationData enableApplicationStatus={false} />
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

  describe("application status dropdown", () => {
    it("does not render when enableApplicationStatus is false", () => {
      render(
        <FormProviderWrapper>
          <FormApplicationData enableApplicationStatus={false} />
        </FormProviderWrapper>
      )

      expect(screen.queryByLabelText(/status/i)).not.toBeInTheDocument()
    })

    it("allows selecting different application status values", async () => {
      render(
        <FormProviderWrapper>
          <FormApplicationData enableApplicationStatus={true} />
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
          <FormApplicationData enableApplicationStatus={true} />
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
          <FormApplicationData enableApplicationStatus={true} />
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
          <FormApplicationData enableApplicationStatus={true} />
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
})
