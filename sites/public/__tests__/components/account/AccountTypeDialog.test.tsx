import React from "react"
import { useRouter } from "next/router"
import userEvent from "@testing-library/user-event"
import { AccountTypeDialog } from "../../../src/components/account/AccountTypeDialog"
import { render, screen } from "../../testUtils"

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}))

describe("AccountTypeDialog", () => {
  const mockOnClose = jest.fn()
  const mockPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      query: {},
    })
  })

  it("renders dialog content when open", () => {
    render(<AccountTypeDialog isOpen={true} onClose={mockOnClose} />)

    expect(
      screen.getByRole("heading", { name: "Choose an account type", level: 1 })
    ).toBeInTheDocument()
    expect(screen.getByText("Which describes you?")).toBeInTheDocument()
    expect(screen.getByLabelText("Housing applicant / tenant")).toBeInTheDocument()
    expect(screen.getByText("Create an account to apply for housing")).toBeInTheDocument()
    expect(screen.getByLabelText("Housing advocate")).toBeInTheDocument()
    expect(
      screen.getByText("Create an account to apply on behalf of a housing client")
    ).toBeInTheDocument()
  })

  it("routes by default to create account for applicant selection", async () => {
    render(<AccountTypeDialog isOpen={true} onClose={mockOnClose} />)

    await userEvent.click(screen.getByRole("button", { name: "Get started" }))
    expect(mockPush).toHaveBeenCalledWith("/create-account")
  })

  it("routes to create advocate account for advocate selection", async () => {
    render(<AccountTypeDialog isOpen={true} onClose={mockOnClose} />)

    await userEvent.click(screen.getByLabelText("Housing advocate"))
    await userEvent.click(screen.getByRole("button", { name: "Get started" }))
    expect(mockPush).toHaveBeenCalledWith("/create-advocate-account")
  })

  it("calls onClose when cancel is clicked", async () => {
    render(<AccountTypeDialog isOpen={true} onClose={mockOnClose} />)

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }))
    expect(mockOnClose).toHaveBeenCalled()
  })
})
