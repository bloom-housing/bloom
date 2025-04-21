import { render, screen, waitFor } from "@testing-library/react"
import React from "react"
import userEvent from "@testing-library/user-event"
import { act } from "react-dom/test-utils"
import { LanguagesEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { FormProviderWrapper } from "./helpers"
import { FormApplicationData } from "../../../../src/components/applications/PaperApplicationForm/sections/FormApplicationData"

describe("<FormApplicationData>", () => {
  it("renders the form with application data fields", () => {
    render(
      <FormProviderWrapper>
        <FormApplicationData />
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
        <FormApplicationData />
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

    await act(async () => {
      await userEvent.type(monthInput, "2")
      await userEvent.type(dayInput, "10")
      await userEvent.type(yearInput, "2025")
    })

    await waitFor(() => {
      expect(timeHours).not.toBeDisabled()
      expect(timeMinutes).not.toBeDisabled()
      expect(timePeriod).not.toBeDisabled()
    })
  })

  it("language selection works correctly", async () => {
    render(
      <FormProviderWrapper>
        <FormApplicationData />
      </FormProviderWrapper>
    )

    const languageSelect = screen.getByLabelText(/language submitted in/i)
    await userEvent.selectOptions(languageSelect, LanguagesEnum.en)

    expect((languageSelect as HTMLSelectElement).value).toBe(LanguagesEnum.en)
  })

  it("clearing date fields resets time fields", async () => {
    render(
      <FormProviderWrapper>
        <FormApplicationData />
      </FormProviderWrapper>
    )

    const timeHours = screen.getByTestId("timeSubmitted-hours")
    const timeMinutes = screen.getByTestId("timeSubmitted-minutes")
    const timePeriod = screen.getByTestId("timeSubmitted-period")
    const monthInput = screen.getByTestId("dateSubmitted-month")
    const dayInput = screen.getByTestId("dateSubmitted-day")
    const yearInput = screen.getByTestId("dateSubmitted-year")

    await act(async () => {
      await userEvent.type(monthInput, "2")
      await userEvent.type(dayInput, "10")
      await userEvent.type(yearInput, "2025")
    })

    await act(async () => {
      await userEvent.type(timeHours, "12")
      await userEvent.type(timeMinutes, "30")
      await userEvent.selectOptions(timePeriod, "pm")
    })

    expect((timeHours as HTMLInputElement).value).toBe("12")
    expect((timeMinutes as HTMLInputElement).value).toBe("30")
    expect((timePeriod as HTMLSelectElement).value).toBe("pm")

    await act(async () => {
      await userEvent.clear(monthInput)
      await userEvent.clear(dayInput)
      await userEvent.clear(yearInput)
    })

    expect(timeHours).toBeDisabled()
    expect(timeMinutes).toBeDisabled()
    expect(timePeriod).toBeDisabled()
    expect((timeHours as HTMLInputElement).value).toBe("")
    expect((timeMinutes as HTMLInputElement).value).toBe("")
    expect((timePeriod as HTMLSelectElement).value).toBe("pm")
  })
})
