import React from "react"
import { AuthContext, MessageContext } from "@bloom-housing/shared-helpers"
import { AuthService, UserService } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { render, screen, waitFor, mockNextRouter } from "../../testUtils"
import { ConfirmationModal } from "../../../src/components/account/ConfirmationModal"

const TOAST_MESSAGE = {
  toastMessagesRef: { current: [] },
  addToast: jest.fn(),
}

const mockConfirmAccount = jest.fn()
const mockResendConfirmation = jest.fn()

const renderConfirmationModal = (
  authContextOverrides: Record<string, unknown> = {},
  query: Record<string, unknown> = {}
) => {
  mockNextRouter(query)
  return render(
    <MessageContext.Provider value={TOAST_MESSAGE}>
      <AuthContext.Provider
        value={{
          initialStateLoaded: true,
          profile: undefined,
          confirmAccount: mockConfirmAccount,
          resendConfirmation: mockResendConfirmation,
          userService: {} as UserService,
          authService: {} as AuthService,
          ...authContextOverrides,
        }}
      >
        <ConfirmationModal />
      </AuthContext.Provider>
    </MessageContext.Provider>
  )
}

beforeAll(() => {
  window.scrollTo = jest.fn()
})

beforeEach(() => {
  jest.clearAllMocks()
})

describe("ConfirmationModal", () => {
  it("does not call confirmAccount when there is no token in the URL", async () => {
    mockConfirmAccount.mockResolvedValue(undefined)
    renderConfirmationModal({}, {})

    await waitFor(() => {
      expect(mockConfirmAccount).not.toHaveBeenCalled()
    })
  })

  it("does not call confirmAccount when initialStateLoaded is false", async () => {
    mockConfirmAccount.mockResolvedValue(undefined)
    renderConfirmationModal({ initialStateLoaded: false }, { token: "abc123" })

    await waitFor(() => {
      expect(mockConfirmAccount).not.toHaveBeenCalled()
    })
  })

  it("calls confirmAccount and redirects to dashboard when token is present and state is loaded", async () => {
    const { pushMock } = mockNextRouter({ token: "abc123" })
    mockConfirmAccount.mockResolvedValue(undefined)

    render(
      <MessageContext.Provider value={TOAST_MESSAGE}>
        <AuthContext.Provider
          value={{
            initialStateLoaded: true,
            profile: undefined,
            confirmAccount: mockConfirmAccount,
            resendConfirmation: mockResendConfirmation,
          }}
        >
          <ConfirmationModal />
        </AuthContext.Provider>
      </MessageContext.Provider>
    )

    await waitFor(() => {
      expect(mockConfirmAccount).toHaveBeenCalledWith("abc123")
    })
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith(
        expect.objectContaining({ pathname: "/account/dashboard" })
      )
    })
  })

  it("always calls confirmAccount with the token from the URL", async () => {
    const { pushMock } = mockNextRouter({ token: "my-token-123" })
    mockConfirmAccount.mockResolvedValue(undefined)

    render(
      <MessageContext.Provider value={TOAST_MESSAGE}>
        <AuthContext.Provider
          value={{
            initialStateLoaded: true,
            profile: undefined,
            confirmAccount: mockConfirmAccount,
            resendConfirmation: mockResendConfirmation,
          }}
        >
          <ConfirmationModal />
        </AuthContext.Provider>
      </MessageContext.Provider>
    )

    await waitFor(() => {
      expect(mockConfirmAccount).toHaveBeenCalledWith("my-token-123")
    })
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith(
        expect.objectContaining({ pathname: "/account/dashboard" })
      )
    })
  })

  it("opens the resend dialog when confirmAccount fails with a 500", async () => {
    mockNextRouter({ token: "bad-token" })
    mockConfirmAccount.mockRejectedValue({
      response: { data: { statusCode: 500, message: "serverError" } },
    })

    render(
      <MessageContext.Provider value={TOAST_MESSAGE}>
        <AuthContext.Provider
          value={{
            initialStateLoaded: true,
            profile: undefined,
            confirmAccount: mockConfirmAccount,
            resendConfirmation: mockResendConfirmation,
          }}
        >
          <ConfirmationModal />
        </AuthContext.Provider>
      </MessageContext.Provider>
    )

    await waitFor(() => {
      expect(screen.getByText("Your link has expired")).toBeInTheDocument()
    })
  })
})
