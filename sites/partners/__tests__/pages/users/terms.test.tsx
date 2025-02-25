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
  it("should render terms modal", () => {
    mockNextRouter()
    const { getByText, getByLabelText } = render(<TermsPage />)
    expect(getByText("Review Terms of Service"))
    expect(getByText("You must accept the Terms of Use before continuing.")).toBeInTheDocument()
    expect(getByText("Terms of Use", { selector: "h2" })).toBeInTheDocument()
    expect(
      getByText(
        /I have reviewed the(.*) for this Website, as that term is defined in the Terms of Use, and agree to comply with all requirements described therein that relate to my use as a Professional Partner or Local Government. If I am agreeing to comply with the Terms of Use on behalf of a Professional Partner or Local Government, I warrant that I am authorized to enter into agreements such as the Terms of Use on behalf of such Professional Partner or Local Government./
      )
    ).toBeInTheDocument()
    const termsOfUseLink = getByText("Terms of Use", { selector: "a" })
    expect(termsOfUseLink).toBeInTheDocument()
    expect(termsOfUseLink).toHaveAttribute(
      "href",
      "https://mtc.ca.gov/doorway-housing-portal-terms-use"
    )
    expect(
      getByLabelText("I have reviewed, understand and agree to the Terms of Use.")
    ).toBeInTheDocument()
    expect(getByText("Submit")).toBeInTheDocument()
  })

  it("should change submit button state on change", () => {
    mockNextRouter()
    const { getByText, getByLabelText } = render(<TermsPage />)

    const submitButton = getByText("Submit")
    const agreeCheckbox = getByLabelText(
      "I have reviewed, understand and agree to the Terms of Use."
    )
    // Check if the submit button is disabled
    expect(submitButton).toHaveAttribute("disabled")
    // Check if the button becomes available after checkbox change
    fireEvent.click(agreeCheckbox)
    expect(submitButton).not.toHaveAttribute("disabled")
    // Should revert to disabled on unclick
    fireEvent.click(agreeCheckbox)
    expect(submitButton).toHaveAttribute("disabled")
  })

  it("should navigate to dashboard on submit", async () => {
    const { pushMock } = mockNextRouter()
    const { findByText, getByLabelText } = render(<TermsPage />)

    const submitButton = await findByText("Submit")
    const agreeCheckbox = getByLabelText(
      "I have reviewed, understand and agree to the Terms of Use."
    )
    await waitFor(() => fireEvent.click(agreeCheckbox))
    fireEvent.click(submitButton)
    await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/"))
  })
})
