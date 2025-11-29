import React from "react"
import { useRouter } from "next/router"
// eslint-disable-next-line import/no-named-as-default
import PasswordExpiredModal from "../../../src/components/account/PasswordExpiredModal"
import userEvent from "@testing-library/user-event"
import { render, waitFor } from "../../../../partners/__tests__/testUtils"

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}))

beforeAll(() => {
  window.scrollTo = jest.fn()
})

describe("PasswordExpiredModal", () => {
  const mockOnClose = jest.fn()
  const mockPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
  })

  it("renders modal when isOpen is true", () => {
    const { getByText, getByRole } = render(
      <PasswordExpiredModal isOpen={true} onClose={mockOnClose} />
    )

    expect(getByText("Password Expired")).toBeInTheDocument()
    expect(
      getByText("The password tied to your account has expired. Please reset it to continue.")
    ).toBeInTheDocument()
    expect(getByRole("button", { name: "Continue" })).toBeInTheDocument()
  })

  it("does not render modal content when isOpen is false", () => {
    const { queryByText } = render(<PasswordExpiredModal isOpen={false} onClose={mockOnClose} />)

    expect(queryByText("Password Expired")).not.toBeInTheDocument()
    expect(
      queryByText("The password tied to your account has expired. Please reset it to continue.")
    ).not.toBeInTheDocument()
  })

  it("navigates to forgot-password page when continue button is clicked", async () => {
    const { getByRole } = render(<PasswordExpiredModal isOpen={true} onClose={mockOnClose} />)

    const continueButton = getByRole("button", { name: "Continue" })
    await userEvent.click(continueButton)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/forgot-password")
    })
  })
})
