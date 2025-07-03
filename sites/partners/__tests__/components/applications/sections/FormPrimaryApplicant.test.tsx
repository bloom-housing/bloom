import { render, screen, waitFor, within } from "@testing-library/react"
import React from "react"
import { FormPrimaryApplicant } from "../../../../src/components/applications/PaperApplicationForm/sections/FormPrimaryApplicant"
import { FormProviderWrapper } from "./helpers"
import userEvent from "@testing-library/user-event"
import { act } from "react-dom/test-utils"

describe("<FormPrimaryApplicant>", () => {
  it("renders the form with primary applicant fields", () => {
    render(
      <FormProviderWrapper>
        <FormPrimaryApplicant />
      </FormProviderWrapper>
    )

    expect(
      screen.getByRole("heading", { level: 2, name: /primary applicant/i })
    ).toBeInTheDocument()

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/middle name \(optional\)/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()

    const dobTitle = screen.getByText(/date of birth/i)
    expect(dobTitle).toBeInTheDocument()
    const dobSection = dobTitle.parentElement
    expect(within(dobSection).getByLabelText(/month/i)).toBeInTheDocument()
    expect(within(dobSection).getByLabelText(/day/i)).toBeInTheDocument()
    expect(within(dobSection).getByLabelText(/year/i)).toBeInTheDocument()
    expect(screen.getAllByLabelText(/email/i)).toHaveLength(2)
    expect(screen.getAllByText(/^phone$/i)).toHaveLength(2)

    expect(screen.getByLabelText(/what type of number is this\?/i)).toBeInTheDocument()
    expect(screen.getByText(/^additional phone$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/additional phone type/i)).toBeInTheDocument()

    expect(screen.getByText(/preferred contact type/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/letter/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/text/i)).toBeInTheDocument()
    expect(screen.getByText(/work in the region\?/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/yes/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/no/i)).toBeInTheDocument()

    expect(screen.getByText(/residence address/i)).toBeInTheDocument()
    expect(screen.getAllByLabelText(/street address/i)).toHaveLength(1)
    expect(screen.getAllByLabelText(/apt or unit #/i)).toHaveLength(1)
    expect(screen.getAllByLabelText(/city/i)).toHaveLength(1)
    expect(screen.getAllByLabelText(/state/i)).toHaveLength(1)
    expect(screen.getAllByLabelText(/zip code/i)).toHaveLength(1)

    expect(screen.getByLabelText(/send my mail to a different address/i))

    expect(screen.queryByText(/mailing address/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/work address/i)).not.toBeInTheDocument()
  })

  it("enables number type select when phone number is given", async () => {
    render(
      <FormProviderWrapper>
        <FormPrimaryApplicant />
      </FormProviderWrapper>
    )

    const phoneTypeSelect = screen.getByLabelText(/what type of number is this\?/i)
    expect(phoneTypeSelect).toBeInTheDocument()
    expect(phoneTypeSelect).toBeDisabled()

    const phoneInput = within(screen.getByTestId("phoneNumber")).getByRole("textbox")

    expect(phoneInput).toBeInTheDocument()

    await act(async () => {
      await userEvent.type(phoneInput, "(424) 242-4242")
    })

    expect(phoneTypeSelect).toBeEnabled()
  })

  it("enables additional phone type selection when additional phone type is filled", async () => {
    render(
      <FormProviderWrapper>
        <FormPrimaryApplicant />
      </FormProviderWrapper>
    )

    const additionalPhoneTypeSelect = screen.getByLabelText(/additional phone type/i)
    expect(additionalPhoneTypeSelect).toBeInTheDocument()
    expect(additionalPhoneTypeSelect).toBeDisabled()

    const additonalPhoneInput = within(
      screen.getByTestId("additionalPhoneNumber").parentElement
    ).getByRole("textbox")

    expect(additonalPhoneInput).toBeInTheDocument()

    await act(async () => {
      await userEvent.type(additonalPhoneInput, "(424) 242-4242")
    })

    expect(additionalPhoneTypeSelect).toBeEnabled()
  })

  it("show work address fields an work in the region is checked", async () => {
    render(
      <FormProviderWrapper>
        <FormPrimaryApplicant />
      </FormProviderWrapper>
    )

    const workInTheRegionButton = screen.getByLabelText("Yes")

    await act(() => userEvent.click(workInTheRegionButton))

    await waitFor(() => {
      expect(workInTheRegionButton).toBeChecked()
    })

    expect(screen.getByText(/work address/i)).toBeInTheDocument()
    expect(screen.getAllByLabelText(/street address/i)).toHaveLength(2)
    expect(screen.getAllByLabelText(/apt or unit #/i)).toHaveLength(2)
    expect(screen.getAllByLabelText(/city/i)).toHaveLength(2)
    expect(screen.getAllByLabelText(/state/i)).toHaveLength(2)
    expect(screen.getAllByLabelText(/zip code/i)).toHaveLength(2)
  })

  it("show mailing address fields an send my mail to a different address is checked", async () => {
    render(
      <FormProviderWrapper>
        <FormPrimaryApplicant />
      </FormProviderWrapper>
    )

    const sendMailToAddress = screen.getByLabelText(/send my mail to a different address/i)

    await act(() => userEvent.click(sendMailToAddress))

    await waitFor(() => {
      expect(sendMailToAddress).toBeChecked()
    })

    expect(screen.getByText(/mailing address/i)).toBeInTheDocument()
    expect(screen.getAllByLabelText(/street address/i)).toHaveLength(2)
    expect(screen.getAllByLabelText(/apt or unit #/i)).toHaveLength(2)
    expect(screen.getAllByLabelText(/city/i)).toHaveLength(2)
    expect(screen.getAllByLabelText(/state/i)).toHaveLength(2)
    expect(screen.getAllByLabelText(/zip code/i)).toHaveLength(2)
  })

  it("should render the full time student question", () => {
    render(
      <FormProviderWrapper>
        <FormPrimaryApplicant enableFullTimeStudentQuestion={true} />
      </FormProviderWrapper>
    )

    expect(screen.getByText(/Full-time Student/i)).toBeInTheDocument()
    expect(screen.getAllByRole("radio", { name: "Yes" })).toHaveLength(2)
    expect(screen.getAllByRole("radio", { name: "No" })).toHaveLength(2)
  })
})
