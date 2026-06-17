import React from "react"
import userEvent from "@testing-library/user-event"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { UserService } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { mockNextRouter, render, screen, waitFor } from "../testUtils"
import Unsubscribe from "../../src/pages/unsubscribe"

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}))

const mockUnsubscribeFromAll = jest.fn()

const renderPage = (email?: string, sig?: string, initialStateLoaded = true) => {
  const routerMocks = mockNextRouter(email && sig ? { email, sig } : {})
  render(
    <AuthContext.Provider
      value={{
        initialStateLoaded,
        userService: {
          unsubscribeFromAll: mockUnsubscribeFromAll,
        } as unknown as UserService,
      }}
    >
      <Unsubscribe />
    </AuthContext.Provider>
  )
  return routerMocks
}

beforeAll(() => {
  window.scrollTo = jest.fn()
})

beforeEach(() => {
  jest.clearAllMocks()
})

describe("Unsubscribe Page", () => {
  it("shows loading state before auth has initialized", () => {
    renderPage("test@example.com", "abc123", false)
    expect(screen.queryByText("Successfully unsubscribed")).not.toBeInTheDocument()
    expect(screen.queryByText("Unable to unsubscribe")).not.toBeInTheDocument()
    expect(mockUnsubscribeFromAll).not.toHaveBeenCalled()
  })

  it("shows success state after a valid unsubscribe call", async () => {
    mockUnsubscribeFromAll.mockResolvedValueOnce({ success: true })
    renderPage("test@example.com", "valid-sig")

    await waitFor(() =>
      expect(mockUnsubscribeFromAll).toHaveBeenCalledWith({
        body: { email: "test@example.com", sig: "valid-sig" },
      })
    )

    expect(await screen.findByText("Successfully unsubscribed")).toBeInTheDocument()
    expect(
      screen.getByText(
        "You have been unsubscribed from all email notifications. You can update your preferences at any time from your account settings."
      )
    ).toBeInTheDocument()
  })

  it("shows error state when the API call fails", async () => {
    mockUnsubscribeFromAll.mockRejectedValueOnce(new Error("invalid token"))
    renderPage("test@example.com", "bad-sig")

    expect(await screen.findByText("Unable to unsubscribe")).toBeInTheDocument()
    expect(
      screen.getByText(
        "This unsubscribe link is invalid or has expired. Please sign in to manage your notification preferences."
      )
    ).toBeInTheDocument()
  })

  it("shows error state when email or sig params are missing", async () => {
    renderPage()

    expect(await screen.findByText("Unable to unsubscribe")).toBeInTheDocument()
    expect(mockUnsubscribeFromAll).not.toHaveBeenCalled()
  })

  it("navigates to /account/notifications when manage subscriptions is clicked", async () => {
    mockUnsubscribeFromAll.mockResolvedValueOnce({ success: true })
    const { pushMock } = renderPage("test@example.com", "valid-sig")

    const button = await screen.findByRole("button", { name: "Manage subscriptions" })
    await userEvent.click(button)

    expect(pushMock).toHaveBeenCalledWith("/account/notifications")
  })
})
