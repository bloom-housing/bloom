/* eslint-disable import/no-named-as-default */
import React from "react"
import { setupServer } from "msw/lib/node"
import { fireEvent, mockNextRouter, render, waitFor } from "./testUtils"
import ForgotPassword from "../src/pages/forgot-password"
import userEvent from "@testing-library/user-event"
import { rest } from "msw"

const server = setupServer()
window.scrollTo = jest.fn()

beforeAll(() => {
  server.listen()
})

afterEach(() => {
  server.resetHandlers()
  window.sessionStorage.clear()
})

afterAll(() => server.close())

describe("forgot-password", () => {
  it("should display all required inputs", () => {
    mockNextRouter()

    const { getByText, getByLabelText } = render(<ForgotPassword />)

    expect(getByText("Send email", { selector: "h1" }))
    expect(getByLabelText("Email"))
    expect(getByText("Send email", { selector: "button" }))
    expect(getByText("Cancel"))
  })

  describe("should show alert box messages", () => {
    it("should display no alert box at first render", () => {
      mockNextRouter()
      const { queryByText } = render(<ForgotPassword />)

      expect(
        queryByText("There are errors you'll need to resolve before moving on.")
      ).not.toBeInTheDocument()
      expect(queryByText("Please enter a valid email address")).not.toBeInTheDocument()
    })

    it("should display alert box on missing input", async () => {
      const { getByText, getByLabelText, findByText, queryByText } = render(<ForgotPassword />)

      const submitButton = getByText("Send email", { selector: "button" })
      const emailInput = getByLabelText("Email")
      await waitFor(() => fireEvent.click(submitButton))

      const inputErrorMessage = await findByText("Please enter a valid email address")
      const componentErrorMessage = await findByText(
        "There are errors you'll need to resolve before moving on."
      )

      expect(inputErrorMessage).toBeInTheDocument()
      expect(componentErrorMessage).toBeInTheDocument()

      // Should hide on valid input
      await waitFor(() => userEvent.type(emailInput, "test@example.com"))

      expect(
        queryByText("There are errors you'll need to resolve before moving on.")
      ).not.toBeInTheDocument()
      expect(queryByText("Please enter a valid email address")).not.toBeInTheDocument()
    })

    it("should display alert box on invalid input", async () => {
      const { getByText, getByLabelText, findByText, queryByText } = render(<ForgotPassword />)

      const submitButton = getByText("Send email", { selector: "button" })
      const emailInput = getByLabelText("Email")
      await waitFor(async () => {
        await userEvent.type(emailInput, "test")
        fireEvent.click(submitButton)
      })

      const inputErrorMessage = await findByText("Please enter a valid email address")
      const componentErrorMessage = await findByText(
        "There are errors you'll need to resolve before moving on."
      )

      expect(inputErrorMessage).toBeInTheDocument()
      expect(componentErrorMessage).toBeInTheDocument()

      // Should hide on valid input
      await waitFor(() => userEvent.type(emailInput, "test@example.com"))

      expect(
        queryByText("There are errors you'll need to resolve before moving on.")
      ).not.toBeInTheDocument()
      expect(queryByText("Please enter a valid email address")).not.toBeInTheDocument()
    })
  })

  it("should navigate back on cancel", async () => {
    const { backMock } = mockNextRouter()

    const { getByText } = render(<ForgotPassword />)

    const cancelButton = getByText("Cancel")
    fireEvent.click(cancelButton)
    await waitFor(() => expect(backMock).toHaveBeenCalledTimes(1))
  })

  it("should navigate to sign in page on submit", async () => {
    const { pushMock } = mockNextRouter()
    jest.spyOn(console, "error").mockImplementation()
    server.use(
      rest.put("http://localhost/api/adapter/user/forgot-password", (_req, res, ctx) => {
        return res(ctx.json({ success: true }))
      })
    )
    const { getByText, getByLabelText } = render(<ForgotPassword />)

    const submitButton = getByText("Send email", { selector: "button" })
    const emailInput = getByLabelText("Email")
    await waitFor(async () => {
      await userEvent.type(emailInput, "test@example.com")
      fireEvent.click(submitButton)
      expect(pushMock).toHaveBeenCalledWith("/sign-in")
    })
  })

  it("should show error message on failed submit", async () => {
    mockNextRouter()
    jest.spyOn(console, "error").mockImplementation()
    server.use(
      rest.put("http://localhost/api/adapter/user/forgot-password", (_req, res, ctx) => {
        return res(ctx.status(400), ctx.json({ message: "Failed" }))
      })
    )
    const { getByText, getByLabelText, findByText } = render(<ForgotPassword />)

    const submitButton = getByText("Send email", { selector: "button" })
    const emailInput = getByLabelText("Email")
    await waitFor(async () => {
      await userEvent.type(emailInput, "test@example.com")
      fireEvent.click(submitButton)
    })

    const genericError = await findByText("Please try again, or contact support for help.")
    expect(genericError).toBeInTheDocument()
  })
})
