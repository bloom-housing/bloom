import React from "react"
import { fireEvent, waitFor } from "@testing-library/react"
import { useRouter } from "next/router"
import { AuthContext, MessageContext } from "@bloom-housing/shared-helpers"
import { Verify } from "../../src/pages/verify"
import { render, screen, within } from "../testUtils"

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}))

const TOAST_MESSAGE = {
  toastMessagesRef: { current: [] },
  addToast: jest.fn(),
}

const TEST_EMAIL = "admin@example.com"

const renderVerifyPage = (
  flowType: "create" | "login" | "loginReCaptcha" = "login",
  authContextOverrides = {}
) => {
  const mockRouter = {
    query: { email: TEST_EMAIL, flowType },
    push: jest.fn(),
  }
  ;(useRouter as jest.Mock).mockReturnValue(mockRouter)

  return {
    mockRouter,
    ...render(
      <AuthContext.Provider
        value={{
          initialStateLoaded: true,
          profile: undefined,
          requestSingleUseCode: jest.fn(),
          loginViaSingleUseCode: jest.fn(),
          ...authContextOverrides,
        }}
      >
        <MessageContext.Provider value={TOAST_MESSAGE}>
          <Verify />
        </MessageContext.Provider>
      </AuthContext.Provider>
    ),
  }
}

beforeAll(() => {
  window.scrollTo = jest.fn()
})

beforeEach(() => {
  jest.clearAllMocks()
})

describe("Verify Page Tests", () => {
  describe("Banner, fields, and links", () => {
    it("renders the page title, code field, sub-note, resend button, and continue button", () => {
      renderVerifyPage("login")

      expect(screen.getByRole("heading", { name: "Verify that it's you" })).toBeInTheDocument()
      expect(screen.getByLabelText("Your code")).toBeInTheDocument()
      expect(screen.getByText("Didn't receive your code?")).toBeInTheDocument()
      expect(screen.getByRole("button", { name: /resend/i })).toBeInTheDocument()
      expect(screen.getByRole("button", { name: /continue/i })).toBeInTheDocument()
      expect(
        screen.getByText(/if there is an account made with admin@example\.com/i)
      ).toBeInTheDocument()
      expect(
        screen.getByRole("button", { name: /sign in with your password/i })
      ).toBeInTheDocument()
    })
    it("does not render the 'Sign in with your password' button for the create flow", () => {
      renderVerifyPage("create")
      expect(
        screen.queryByRole("button", { name: /sign in with your password/i })
      ).not.toBeInTheDocument()
    })

    it("renders the create flow alert message containing the email address", () => {
      renderVerifyPage("create")
      expect(
        screen.getByText(
          /we sent a code to admin@example\.com to finish signing up. Be aware, the code will expire in 10 minutes/i
        )
      ).toBeInTheDocument()
    })

    it("renders the loginReCaptcha flow alert message containing the email address", () => {
      renderVerifyPage("loginReCaptcha")
      expect(
        screen.getByText(/we sent a code to admin@example\.com to finish logging in/i)
      ).toBeInTheDocument()
    })
  })

  describe("Resend dialog", () => {
    it("opens the resend dialog with the correct header and buttons when clicking 'Resend'", async () => {
      renderVerifyPage("login")

      fireEvent.click(screen.getByRole("button", { name: /resend/i }))

      expect(await screen.findByRole("dialog")).toBeInTheDocument()
      const dialog = await screen.findByRole("dialog")

      expect(within(dialog).getByRole("heading", { name: "Resend code" })).toBeInTheDocument()
      expect(within(dialog).getByRole("heading", { name: "Resend code" })).toBeInTheDocument()
      expect(within(dialog).getByRole("button", { name: /resend the code/i })).toBeInTheDocument()
      expect(within(dialog).getByRole("button", { name: /cancel/i })).toBeInTheDocument()
    })

    it("closes the dialog when clicking 'Cancel'", async () => {
      renderVerifyPage("login")

      fireEvent.click(screen.getByRole("button", { name: /resend/i }))
      expect(await screen.findByRole("dialog")).toBeInTheDocument()

      fireEvent.click(screen.getByRole("button", { name: /cancel/i }))

      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
      })
    })

    it("calls requestSingleUseCode, closes the dialog, and updates the banner message after clicking 'Resend the code'", async () => {
      const mockRequestSingleUseCode = jest.fn().mockResolvedValue({})
      renderVerifyPage("login", { requestSingleUseCode: mockRequestSingleUseCode })

      fireEvent.click(screen.getByRole("button", { name: /resend/i }))
      expect(await screen.findByRole("dialog")).toBeInTheDocument()

      fireEvent.click(screen.getByRole("button", { name: /resend the code/i }))

      await waitFor(() => {
        expect(mockRequestSingleUseCode).toHaveBeenCalledWith(TEST_EMAIL)
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
      })

      expect(
        screen.getByText(
          /A new code has been sent to admin@example\.com. Be aware, the code will expire in 10 minutes./i
        )
      ).toBeInTheDocument()
    })
  })

  describe("'Sign in with your password' button", () => {
    it("redirects to /sign-in with loginType=pwd query param when clicked", () => {
      const { mockRouter } = renderVerifyPage("login")

      fireEvent.click(screen.getByRole("button", { name: /sign in with your password/i }))

      expect(mockRouter.push).toHaveBeenCalledWith({
        pathname: "/sign-in",
        query: { loginType: "pwd" },
      })
    })
  })

  describe("Code submission", () => {
    it("shows a network error alert when an incorrect code is submitted", async () => {
      const mockLoginViaSingleUseCode = jest.fn().mockRejectedValue({
        response: { status: 401, data: { message: "" } },
      })
      renderVerifyPage("login", { loginViaSingleUseCode: mockLoginViaSingleUseCode })

      fireEvent.change(screen.getByLabelText("Your code"), { target: { value: "wrong-code" } })
      fireEvent.click(screen.getByRole("button", { name: /continue/i }))

      await waitFor(() => {
        expect(mockLoginViaSingleUseCode).toHaveBeenCalledWith(TEST_EMAIL, "wrong-code", undefined)
      })

      expect(await screen.findByText("Please enter a valid email and password")).toBeInTheDocument()
    })

    it("redirects to the dashboard when a correct code is submitted for the login flow", async () => {
      const mockLoginViaSingleUseCode = jest.fn().mockResolvedValue({ firstName: "User" })
      const { mockRouter } = renderVerifyPage("login", {
        loginViaSingleUseCode: mockLoginViaSingleUseCode,
      })

      fireEvent.change(screen.getByLabelText("Your code"), { target: { value: "123456" } })
      fireEvent.click(screen.getByRole("button", { name: /continue/i }))

      await waitFor(() => {
        expect(mockLoginViaSingleUseCode).toHaveBeenCalledWith(TEST_EMAIL, "123456", undefined)
        expect(mockRouter.push).toHaveBeenCalledWith({
          pathname: "/account/dashboard",
          query: {},
        })
      })
    })

    it("shows an account confirmed success toast when a correct code is submitted for the create flow", async () => {
      const mockAddToast = jest.fn()
      const mockLoginViaSingleUseCode = jest.fn().mockResolvedValue({ firstName: "User" })
      const mockRouter = {
        query: { email: TEST_EMAIL, flowType: "create" },
        push: jest.fn(),
      }
      ;(useRouter as jest.Mock).mockReturnValue(mockRouter)

      render(
        <AuthContext.Provider
          value={{
            initialStateLoaded: true,
            profile: undefined,
            loginViaSingleUseCode: mockLoginViaSingleUseCode,
          }}
        >
          <MessageContext.Provider value={{ ...TOAST_MESSAGE, addToast: mockAddToast }}>
            <Verify />
          </MessageContext.Provider>
        </AuthContext.Provider>
      )

      fireEvent.change(screen.getByLabelText("Your code"), { target: { value: "123456" } })
      fireEvent.click(screen.getByRole("button", { name: /continue/i }))

      await waitFor(() => {
        expect(mockAddToast).toHaveBeenCalledWith("Your account was successfully confirmed.", {
          variant: "success",
        })
      })
    })

    it("shows a welcome back success toast when a correct code is submitted for the login flow", async () => {
      const mockAddToast = jest.fn()
      const mockLoginViaSingleUseCode = jest.fn().mockResolvedValue({ firstName: "User" })
      const mockRouter = {
        query: { email: TEST_EMAIL, flowType: "login" },
        push: jest.fn(),
      }
      ;(useRouter as jest.Mock).mockReturnValue(mockRouter)

      render(
        <AuthContext.Provider
          value={{
            initialStateLoaded: true,
            profile: undefined,
            loginViaSingleUseCode: mockLoginViaSingleUseCode,
          }}
        >
          <MessageContext.Provider value={{ ...TOAST_MESSAGE, addToast: mockAddToast }}>
            <Verify />
          </MessageContext.Provider>
        </AuthContext.Provider>
      )

      fireEvent.change(screen.getByLabelText("Your code"), { target: { value: "123456" } })
      fireEvent.click(screen.getByRole("button", { name: /continue/i }))

      await waitFor(() => {
        expect(mockAddToast).toHaveBeenCalledWith("Welcome back, User!", {
          variant: "success",
        })
      })
    })
  })
})
