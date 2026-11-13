import React from "react"
import { rest } from "msw"
import { setupServer } from "msw/lib/node"
import userEvent from "@testing-library/user-event"
import { mockNextRouter, render, screen } from "../../../testUtils"
import ApplicationSummary from "../../../../src/pages/applications/review/summary"

window.scrollTo = jest.fn()

const server = setupServer()

beforeAll(() => {
  server.listen()
  mockNextRouter()
})

afterEach(() => server.resetHandlers())

afterAll(() => server.close())

describe("applications pages", () => {
  afterAll(() => {
    jest.clearAllMocks()
  })

  describe("summary step", () => {
    it("should render page content", () => {
      const { getByText } = render(<ApplicationSummary />)

      expect(
        getByText("Take a moment to review your information before submitting your application.")
      ).toBeInTheDocument()
    })

    it("shows a session expired error banner when submission fails with a 401", async () => {
      jest.spyOn(console, "error").mockImplementation()
      server.use(
        rest.post("http://localhost/api/adapter/applications/verify", (_req, res, ctx) => {
          return res(ctx.status(401))
        })
      )

      render(<ApplicationSummary />)

      await userEvent.click(screen.getByRole("button", { name: /confirm/i }))

      expect(
        await screen.findByText(
          "Your session has expired. Please sign in again before submitting your application."
        )
      ).toBeInTheDocument()
    })

    it("shows the generic validation error banner when submission fails with a non-401 error", async () => {
      jest.spyOn(console, "error").mockImplementation()
      server.use(
        rest.post("http://localhost/api/adapter/applications/verify", (_req, res, ctx) => {
          return res(ctx.status(400))
        })
      )

      render(<ApplicationSummary />)

      await userEvent.click(screen.getByRole("button", { name: /confirm/i }))

      expect(
        await screen.findByText(
          "Your application is missing required fields. Please go back and correct this before submitting."
        )
      ).toBeInTheDocument()
    })
  })
})
