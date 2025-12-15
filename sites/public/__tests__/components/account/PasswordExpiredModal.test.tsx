import React from "react"
import { useRouter } from "next/router"
// eslint-disable-next-line import/no-named-as-default
import PasswordExpiredModal from "../../../src/components/account/PasswordExpiredModal"
import userEvent from "@testing-library/user-event"
import { waitFor } from "../../../../partners/__tests__/testUtils"
import { render, screen } from "@testing-library/react"

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
    render(<PasswordExpiredModal isOpen={true} onClose={mockOnClose} />)

    expect(screen.getByRole("heading", { level: 1, name: "Password Expired" })).toBeInTheDocument()
    expect(
      screen.getByText(
        "Your password has expired. Click continue to reset your password and access your account."
      )
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Continue" })).toBeInTheDocument()
  })

  it("does not render modal content when isOpen is false", () => {
    render(<PasswordExpiredModal isOpen={false} onClose={mockOnClose} />)

    expect(screen.queryByText("Password Expired")).not.toBeInTheDocument()
    expect(
      screen.queryByText(
        "Your password has expired. Click continue to reset your password and access your account."
      )
    ).not.toBeInTheDocument()
  })

  it("navigates to forgot-password page when continue button is clicked", async () => {
    render(<PasswordExpiredModal isOpen={true} onClose={mockOnClose} />)

    const continueButton = screen.getByRole("button", { name: "Continue" })
    await userEvent.click(continueButton)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/forgot-password")
    })
  })
})
