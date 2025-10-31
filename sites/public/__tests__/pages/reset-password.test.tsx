import React from "react"
import { user } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { ResetPassword } from "../../src/pages/reset-password"
import { setupServer } from "msw/lib/node"
import { render, mockNextRouter, screen, waitFor } from "../testUtils"
import userEvent from "@testing-library/user-event"
import { rest } from "msw"

window.scrollTo = jest.fn()
const server = setupServer()

beforeAll(() => {
  server.listen()
  mockNextRouter({ token: "ex4mpl3-tok3n" })
})

afterEach(() => server.resetHandlers())

afterAll(() => server.close())

describe("Public Reset Password Page", () => {
  it("should render all page contents, inputs and buttons", () => {
    render(<ResetPassword />)

    expect(screen.getByRole("heading", { name: /change password/i, level: 1 })).toBeInTheDocument()
    const passwordInput = screen.getByLabelText(/^password$/i, { selector: "input" })
    expect(passwordInput).toBeInTheDocument()
    expect(passwordInput).toHaveAttribute("type", "password")
    const confirmPasswordInput = screen.getByLabelText(/password confirmation/i, {
      selector: "input",
    })
    expect(confirmPasswordInput).toBeInTheDocument()
    expect(confirmPasswordInput).toHaveAttribute("type", "password")
    expect(screen.getByRole("button", { name: /change password/i })).toBeInTheDocument()
  })

  describe("show validation errors", () => {
    it("show no errors messages on initial render", () => {
      render(<ResetPassword />)
      expect(screen.getByLabelText(/^password$/i, { selector: "input" })).toBeValid()
      expect(screen.queryByText("Please enter new login password")).not.toBeInTheDocument()
      expect(screen.getByLabelText(/password confirmation/i, { selector: "input" })).toBeValid()
      expect(screen.queryByText("The passwords do not match")).not.toBeInTheDocument()
    })

    it("show missing password on empty input", async () => {
      render(<ResetPassword />)

      const passwordInput = screen.getByLabelText(/^password$/i, { selector: "input" })
      const confirmPasswordInput = screen.getByLabelText(/password confirmation/i, {
        selector: "input",
      })

      await userEvent.click(screen.getByRole("button", { name: /change password/i }))

      expect(passwordInput).toBeInvalid()
      expect(confirmPasswordInput).toBeValid()
      expect(await screen.findByText("Please enter new login password")).toBeInTheDocument()
      expect(screen.queryByText("The passwords do not match")).not.toBeInTheDocument()
    })

    it("show not matching password error on empty password confirmation input", async () => {
      render(<ResetPassword />)

      const passwordInput = screen.getByLabelText(/^password$/i, { selector: "input" })
      const confirmPasswordInput = screen.getByLabelText(/password confirmation/i, {
        selector: "input",
      })

      await userEvent.type(passwordInput, "Password_1")
      await userEvent.type(confirmPasswordInput, "Password_2")
      await userEvent.click(screen.getByRole("button", { name: /change password/i }))

      expect(passwordInput).toBeValid()
      expect(confirmPasswordInput).toBeInvalid()
      expect(screen.queryByText("Please enter new login password")).not.toBeInTheDocument()
      expect(await screen.findByText("The passwords do not match")).toBeInTheDocument()
    })
  })

  describe("should show proper error messages", () => {
    const ERROR_RESPONSES = [
      {
        title: "Email not Found",
        message: "emailNotFound",
        value:
          "Email not found. Please make sure your email has an account with us and is confirmed.",
      },
      {
        title: "Password to Weak",
        message: "passwordTooWeak",
        value:
          "Password is too weak. Must be at least 12 characters and include at least one lowercase letter, one uppercase letter, one number, and one special character (#?!@$%^&*-).",
      },
      {
        title: "Expired Token",
        message: "tokenExpired",
        value: "Reset password token expired. Please request for a new one.",
      },
      {
        title: "Missing Token",
        message: "tokenMissing",
        value: "Token not found. Please request for a new one.",
      },
    ].map((entry) =>
      Object.assign(entry, {
        toString: function () {
          return this.title
        },
      })
    )

    it.each(ERROR_RESPONSES)("should show 400 %s error", async (response) => {
      const { message, value } = response

      server.use(
        rest.put("http://localhost/api/adapter/auth/update-password", (_req, res, ctx) => {
          return res(
            ctx.status(400),
            ctx.json({
              message: message,
            })
          )
        })
      )
      render(<ResetPassword />)

      const passwordInput = screen.getByLabelText(/^password$/i, { selector: "input" })
      const confirmPasswordInput = screen.getByLabelText(/password confirmation/i, {
        selector: "input",
      })

      await userEvent.type(passwordInput, "Password")
      await userEvent.type(confirmPasswordInput, "Password")
      await userEvent.click(screen.getByRole("button", { name: /change password/i }))

      expect(await screen.findByText(value)).toBeInTheDocument()
    })

    it("should show generic error message", async () => {
      // Hide the console.error statment in the component submit handler
      jest.spyOn(console, "error").mockImplementation()
      server.use(
        rest.put("http://localhost/api/adapter/auth/update-password", (_req, res, ctx) => {
          return res(ctx.status(401))
        })
      )
      render(<ResetPassword />)

      const passwordInput = screen.getByLabelText(/^password$/i, { selector: "input" })
      const confirmPasswordInput = screen.getByLabelText(/password confirmation/i, {
        selector: "input",
      })

      await userEvent.type(passwordInput, "Password")
      await userEvent.type(confirmPasswordInput, "Password")
      await userEvent.click(screen.getByRole("button", { name: /change password/i }))

      expect(
        await screen.findByText(
          "There was an error. Please try again, or contact support for help."
        )
      ).toBeInTheDocument()
    })
  })

  it("should navigate on success", async () => {
    const { pushMock } = mockNextRouter({ token: "ex4mpl3-tok3n" })
    server.use(
      rest.put("http://localhost/api/adapter/auth/update-password", (_req, res, ctx) => {
        return res(
          ctx.json({
            success: true,
          })
        )
      }),
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(
          ctx.json({ ...user, firstName: "John", listings: [], agreedToTermsOfService: true })
        )
      })
    )
    render(<ResetPassword />)

    const passwordInput = screen.getByLabelText(/^password$/i, { selector: "input" })
    const confirmPasswordInput = screen.getByLabelText(/password confirmation/i, {
      selector: "input",
    })

    await userEvent.type(passwordInput, "Password")
    await userEvent.type(confirmPasswordInput, "Password")
    await userEvent.click(screen.getByRole("button", { name: /change password/i }))

    expect(screen.queryByText("Please enter new login password")).not.toBeInTheDocument()
    expect(screen.queryByText("The passwords do not match")).not.toBeInTheDocument()

    expect(await screen.findByText("Welcome back, John!"))
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/account/applications")
    })
  })
})
