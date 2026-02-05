/* eslint-disable import/no-named-as-default */
import React from "react"
import { setupServer } from "msw/lib/node"
import { fireEvent, mockNextRouter, render, waitFor } from "../../testUtils"
import TermsPage from "../../../src/pages/users/terms"
import { rest } from "msw"

const server = setupServer()

beforeAll(() => {
  server.listen()
})

beforeEach(() => {
  document.cookie = "access-token-available=True"
  server.use(
    rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
      return res(
        ctx.json({
          id: "user1",
          roles: { id: "user1", isAdmin: true, isPartner: false },
          jurisdictions: [{ id: "id1", partnerTerms: "Example Terms" }],
        })
      )
    }),
    rest.post("http://localhost:3100/auth/token", (_req, res, ctx) => {
      return res(ctx.json(""))
    }),
    rest.put("http://localhost/api/adapter/user/%7Bid%7D", (_req, res, ctx) => {
      return res(ctx.json(""))
    })
  )
})

afterEach(() => {
  server.resetHandlers()
  window.sessionStorage.clear()
})

afterAll(() => server.close())

describe("User Terms", () => {
  it("should render terms modal", async () => {
    mockNextRouter()
    const { getByText, getByLabelText, findByText } = render(<TermsPage />)
    const markdownContent = await findByText("Example Terms")
    expect(getByText("Please review the Terms of Service")).toBeInTheDocument()
    expect(getByText("To continue you must accept the Terms of Service")).toBeInTheDocument()
    expect(markdownContent).toBeInTheDocument()
    expect(getByLabelText("I accept the Terms of Service")).toBeInTheDocument()
    expect(getByText("Submit")).toBeInTheDocument()
  })

  it("should show error on no accept", async () => {
    mockNextRouter()
    const { getByText, queryByText, getByLabelText, findByText } = render(<TermsPage />)

    const submitButton = getByText("Submit")
    const agreeCheckbox = getByLabelText("I accept the Terms of Service")
    // Check if the error is not rendered before any action from the user
    expect(queryByText("You must agree to the terms in order to continue")).not.toBeInTheDocument()
    fireEvent.click(submitButton)
    expect(await findByText("You must agree to the terms in order to continue")).toBeInTheDocument()
    fireEvent.click(agreeCheckbox)
    // Check if the error will disappear after user checks the agreement
    expect(queryByText("You must agree to the terms in order to continue")).not.toBeInTheDocument()
  })

  it("should navigate to dashboard on submit", async () => {
    const { pushMock } = mockNextRouter()
    const { findByText, getByLabelText } = render(<TermsPage />)

    const submitButton = await findByText("Submit")
    const agreeCheckbox = getByLabelText("I accept the Terms of Service")
    await waitFor(() => fireEvent.click(agreeCheckbox))
    fireEvent.click(submitButton)
    await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/"))
  })
})
