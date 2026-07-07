/* eslint-disable import/no-named-as-default */
import React from "react"
import { setupServer } from "msw/lib/node"
import { fireEvent, mockNextRouter, render, waitFor } from "../testUtils"
import ResetPassword from "../../src/pages/reset-password"
import { rest } from "msw"
import userEvent from "@testing-library/user-event"
import { user } from "@bloom-housing/shared-helpers/__tests__/testHelpers"

window.scrollTo = jest.fn()
const server = setupServer()

beforeAll(() => server.listen())

afterEach(() => {
  server.resetHandlers()
  window.sessionStorage.clear()
})

afterAll(() => server.close())

describe("reset-password", () => {
  it("should display all required data and inputs", () => {
    mockNextRouter()
    const { getByText, getByLabelText } = render(<ResetPassword />)

    expect(getByText("Change password", { selector: "h1" })).toBeInTheDocument()
    const passwordInput = getByLabelText("Password")
    expect(passwordInput).toBeInTheDocument()
    expect(passwordInput).toHaveAttribute("type", "password")
    expect(getByText("Change password", { selector: "button" })).toBeInTheDocument()

    const showPasswordCheckbox = getByLabelText("Show password")
    expect(showPasswordCheckbox).toBeInTheDocument()
    fireEvent.click(showPasswordCheckbox)
    expect(passwordInput).toHaveAttribute("type", "text")
    expect(getByLabelText("Hide password")).toBeInTheDocument()
  })

  describe("should show errors on missing inputs", () => {
    mockNextRouter()
    it("should not show error messages at start", () => {
      const { queryByText } = render(<ResetPassword />)
      expect(queryByText("Please enter new login password")).not.toBeInTheDocument()
      expect(
        queryByText(
          "There was an error. Please try again, or contact support at email@email.com for help."
        )
      ).not.toBeInTheDocument()
      expect(
        queryByText(
          "Email not found. Please make sure your email has an account with us and is confirmed."
        )
      ).not.toBeInTheDocument()
      expect(
        queryByText(
          "Password is too weak. Must be at least 12 characters and include at least one lowercase letter, one uppercase letter, one number, and one special character (#?!@$%^&*-)."
        )
      ).not.toBeInTheDocument()
      expect(
        queryByText("Reset password token expired. Please request for a new one.")
      ).not.toBeInTheDocument()
      expect(queryByText("Token not found. Please request for a new one.")).not.toBeInTheDocument()
    })

    it("should show only password input error", async () => {
      const { getByLabelText, getByText, findByText, queryByText } = render(<ResetPassword />)
      const passwordInput = getByLabelText("Password")
      const submitButton = getByText("Change password", { selector: "button" })

      await waitFor(() => fireEvent.click(submitButton))
      const passwordErrorMessage = await findByText("Please enter new login password")
      expect(passwordErrorMessage).toBeInTheDocument()

      //Should hide password input error after input
      await waitFor(() => userEvent.type(passwordInput, "abcd"))
      expect(queryByText("Please enter new login password")).not.toBeInTheDocument()
    })
  })

  it("should navigate to dashboard on submit success", async () => {
    const { pushMock } = mockNextRouter({ token: "abcdef" })
    document.cookie = "access-token-available=True"
    server.use(
      rest.put("http://localhost/api/adapter/auth/update-password", (_req, res, ctx) => {
        return res(ctx.json({ success: true }))
      }),
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(ctx.json(user))
      })
    )

    const { getByLabelText, getByText } = render(<ResetPassword />)

    const passwordInput = getByLabelText("Password")
    const submitButton = getByText("Change password", { selector: "button" })

    await waitFor(async () => {
      await userEvent.type(passwordInput, "abcd")
      fireEvent.click(submitButton)
      expect(pushMock).toHaveBeenCalledWith("/")
    })
  })

  it("should show generic error on non-400 submit fail", async () => {
    mockNextRouter({ token: "abcdef" })
    document.cookie = "access-token-available=True"
    // Hide the console.error statment in the component submit handler
    jest.spyOn(console, "error").mockImplementation()
    server.use(
      rest.put("http://localhost/api/adapter/auth/update-password", (_req, res, ctx) => {
        return res(ctx.status(404), ctx.json({ message: "Failed to update password" }))
      }),
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(ctx.json(user))
      })
    )

    const { getByLabelText, getByText } = render(<ResetPassword />)

    const passwordInput = getByLabelText("Password")
    const submitButton = getByText("Change password", { selector: "button" })

    await waitFor(async () => {
      await userEvent.type(passwordInput, "abcd")
      fireEvent.click(submitButton)
    })

    const errorMessage = await waitFor(() =>
      getByText(
        "There was an error. Please try again, or contact support at email@email.com for help."
      )
    )
    expect(errorMessage).toBeInTheDocument()
  })

  describe("should show response messages on 400 submit fails", () => {
    const errorResponses = {
      emailError: {
        code: "emailNotFound",
        message:
          "Email not found. Please make sure your email has an account with us and is confirmed.",
      },
      weakPassword: {
        code: "passwordTooWeak",
        message:
          "Password is too weak. Must be at least 12 characters and include at least one lowercase letter, one uppercase letter, one number, and one special character (#?!@$%^&*-).",
      },
      expiredToken: {
        code: "tokenExpired",
        message: "Reset password token expired. Please request for a new one.",
      },
      missingToken: {
        code: "tokenMissing",
        message: "Token not found. Please request for a new one.",
      },
    }

    function setupErrorMock(errorCode: string) {
      mockNextRouter({ token: "abcdef" })
      document.cookie = "access-token-available=True"

      server.use(
        rest.put("http://localhost/api/adapter/auth/update-password", (_req, res, ctx) => {
          return res(ctx.status(400), ctx.json({ message: errorCode }))
        }),
        rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
          return res(ctx.json(user))
        })
      )
    }

    it("should show email not found error", async () => {
      const { code, message } = errorResponses.emailError
      setupErrorMock(code)
      const { getByLabelText, getByText } = render(<ResetPassword />)

      const passwordInput = getByLabelText("Password")
      const submitButton = getByText("Change password", { selector: "button" })

      await waitFor(async () => {
        await userEvent.type(passwordInput, "abcd")
        fireEvent.click(submitButton)
      })

      const errorMessage = await waitFor(() => getByText(message))
      expect(errorMessage).toBeInTheDocument()
    })

    it("should show weak password error", async () => {
      const { code, message } = errorResponses.weakPassword
      setupErrorMock(code)
      const { getByLabelText, getByText } = render(<ResetPassword />)

      const passwordInput = getByLabelText("Password")
      const submitButton = getByText("Change password", { selector: "button" })

      await waitFor(async () => {
        await userEvent.type(passwordInput, "abcd")
        fireEvent.click(submitButton)
      })

      const errorMessage = await waitFor(() => getByText(message))
      expect(errorMessage).toBeInTheDocument()
    })

    it("should show missing toker error", async () => {
      const { code, message } = errorResponses.missingToken
      setupErrorMock(code)
      const { getByLabelText, getByText } = render(<ResetPassword />)

      const passwordInput = getByLabelText("Password")
      const submitButton = getByText("Change password", { selector: "button" })

      await waitFor(async () => {
        await userEvent.type(passwordInput, "abcd")
        fireEvent.click(submitButton)
      })

      const errorMessage = await waitFor(() => getByText(message))
      expect(errorMessage).toBeInTheDocument()
    })

    it("should show expired toker error", async () => {
      const { code, message } = errorResponses.expiredToken
      setupErrorMock(code)
      const { getByLabelText, getByText } = render(<ResetPassword />)

      const passwordInput = getByLabelText("Password")
      const submitButton = getByText("Change password", { selector: "button" })

      await waitFor(async () => {
        await userEvent.type(passwordInput, "abcd")
        fireEvent.click(submitButton)
      })

      const errorMessage = await waitFor(() => getByText(message))
      expect(errorMessage).toBeInTheDocument()
    })
  })
})
