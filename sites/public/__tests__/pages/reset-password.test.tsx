import React from "react"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { user } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { ResetPassword } from "../../src/pages/reset-password"
import { AuthService } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { setupServer } from "msw/lib/node"
import { render, waitFor, fireEvent, mockNextRouter } from "../testUtils"

const server = setupServer()

beforeAll(() => {
  server.listen()
  mockNextRouter({ token: "abcdef" })
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  jest.spyOn(console, "error").mockImplementation(() => {})
  window.scrollTo = jest.fn()
})

afterEach(() => server.resetHandlers())

afterAll(() => server.close())

const renderResetPasswordPage = () =>
  render(
    <AuthContext.Provider
      value={{
        profile: { ...user, jurisdictions: [], listings: [] },
        authService: new AuthService(),
      }}
    >
      <ResetPassword />
    </AuthContext.Provider>
  )

describe("Public Reset Password Page", () => {
  it("should render all page contents, inputs and buttons", () => {
    const { getByText, getByLabelText } = renderResetPasswordPage()

    expect(getByText("Change Password", { selector: "h1" })).toBeInTheDocument()
    expect(getByLabelText("Password")).toBeInTheDocument()
    expect(getByLabelText("Password Confirmation")).toBeInTheDocument()
    expect(getByText("Change Password", { selector: "button" })).toBeInTheDocument()
  })

  describe("show validation errors", () => {
    it("show no errors messages on initial render", () => {
      const { queryByText } = renderResetPasswordPage()
      expect(queryByText("Please enter new login password")).not.toBeInTheDocument()
      expect(queryByText("The passwords do not match")).not.toBeInTheDocument()
    })

    it("show missing password on empty input", async () => {
      const { getByText, getByLabelText, findByText, queryByText } = renderResetPasswordPage()
      fireEvent.change(getByLabelText("Password"), { target: { value: "" } })
      fireEvent.click(getByText("Change Password", { selector: "button" }))

      expect(await findByText("Please enter new login password")).toBeInTheDocument()
      expect(queryByText("The passwords do not match")).not.toBeInTheDocument()
    })

    it("show not matching password error on empty password confiramtion input", async () => {
      const { getByText, getByLabelText, findByText, queryByText } = renderResetPasswordPage()
      fireEvent.change(getByLabelText("Password"), { target: { value: "Password_1" } })
      fireEvent.change(getByLabelText("Password Confirmation"), { target: { value: "Password_2" } })

      await waitFor(() => fireEvent.click(getByText("Change Password", { selector: "button" })))

      expect(queryByText("Please enter new login password")).not.toBeInTheDocument()
      expect(await findByText("The passwords do not match")).toBeInTheDocument()
    })

    it("should catch 400 status error", async () => {
      const { getByText, getByLabelText, queryByText, findByText } = renderResetPasswordPage()
      await waitFor(() => {
        fireEvent.change(getByLabelText("Password"), { target: { value: "Password" } })
        fireEvent.change(getByLabelText("Password Confirmation"), { target: { value: "Password" } })
      })
      fireEvent.click(getByText("Change Password", { selector: "button" }))

      expect(queryByText("Please enter new login password")).not.toBeInTheDocument()
      expect(queryByText("The passwords do not match")).not.toBeInTheDocument()
      expect(await findByText("Token not found. Please request for a new one.")).toBeInTheDocument()
    })
  })
})
