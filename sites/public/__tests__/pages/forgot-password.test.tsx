import React from "react"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { fireEvent, mockNextRouter, render, waitFor } from "../testUtils"
import { user } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { ForgotPassword } from "../../src/pages/forgot-password"

beforeAll(() => {
  mockNextRouter()
  window.scrollTo = jest.fn()
})

const renderForgotPasswordPage = () =>
  render(
    <AuthContext.Provider
      value={{
        profile: { ...user, listings: [], jurisdictions: [] },
      }}
    >
      <ForgotPassword />
    </AuthContext.Provider>
  )

describe("Forgot Password Page", () => {
  it("renders all page elements including fields, buttons and links", () => {
    const { getByText, getByLabelText } = renderForgotPasswordPage()

    expect(getByText("Enter your email to get a password reset link")).toBeInTheDocument()
    expect(
      getByText(
        "Please enter your email address so we can send you a password reset link. If you don’t receive an email, you may not have an account."
      )
    ).toBeInTheDocument()
    expect(getByLabelText("Email")).toBeInTheDocument()
    expect(getByText("Send email", { selector: "button" })).toBeInTheDocument()
    expect(getByText("Cancel", { selector: "button" })).toBeInTheDocument()
  })

  describe("Field validation errors", () => {
    it("show validation error on empty email submit", async () => {
      const { findByText, getByText, queryByText } = renderForgotPasswordPage()

      expect(
        queryByText("There are errors you'll need to resolve before moving on.")
      ).not.toBeInTheDocument()
      expect(queryByText("Please enter a valid email address")).not.toBeInTheDocument()

      fireEvent.click(getByText("Send email", { selector: "button" }))
      expect(
        await findByText("There are errors you'll need to resolve before moving on.")
      ).toBeInTheDocument()
      expect(await findByText("Please enter a valid email address")).toBeInTheDocument()
    })

    it("show validation error on invalid email", async () => {
      const { findByText, getByText, getByLabelText, queryByText } = renderForgotPasswordPage()

      expect(
        queryByText("There are errors you'll need to resolve before moving on.")
      ).not.toBeInTheDocument()
      expect(queryByText("Please enter a valid email address")).not.toBeInTheDocument()

      fireEvent.change(getByLabelText("Email"), { target: { value: "test" } })
      fireEvent.click(getByText("Send email", { selector: "button" }))
      expect(
        await findByText("There are errors you'll need to resolve before moving on.")
      ).toBeInTheDocument()
      expect(await findByText("Please enter a valid email address")).toBeInTheDocument()
    })
  })

  it("should navigate back on cancel", async () => {
    const { backMock } = mockNextRouter()
    const { getByText } = renderForgotPasswordPage()

    fireEvent.click(getByText("Cancel", { selector: "button" }))
    await waitFor(() => expect(backMock).toBeCalled())
  })

  it("should navigate to sign-in on submit", async () => {
    const { pushMock } = mockNextRouter()
    const { getByText, getByLabelText } = renderForgotPasswordPage()
    fireEvent.change(getByLabelText("Email"), { target: { value: "example@admin.com" } })
    fireEvent.click(getByText("Send email", { selector: "button" }))
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/sign-in")
    })
  })
})
