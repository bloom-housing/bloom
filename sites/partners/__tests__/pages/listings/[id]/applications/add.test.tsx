import React from "react"
import NewApplication from "../../../../../src/pages/listings/[id]/applications/add"
import { mockNextRouter, render, screen, waitFor } from "../../../../testUtils"
import { setupServer } from "msw/lib/node"
import { rest } from "msw"
import { application, listing } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import userEvent from "@testing-library/user-event"
const server = setupServer()

beforeAll(() => {
  server.listen()
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})

describe("listing applications add page", () => {
  it("should render all application form sections and controll buttons", () => {
    mockNextRouter({ id: "test_listing_id" })
    server.use(
      rest.get("http://localhost:3100/listings/test_listing_id", (_req, res, ctx) => {
        return res(ctx.json(listing))
      })
    )
    render(<NewApplication />)

    expect(screen.getByRole("heading", { level: 1, name: /new application/i })).toBeInTheDocument()
    expect(screen.getByText(/draft/i)).toBeInTheDocument()

    //Aapplication form buttons side section
    expect(screen.getByRole("button", { name: /^submit$/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /submit & new/i })).toBeInTheDocument()
    const cancelButton = screen.getByRole("link", { name: /cancel/i })
    expect(cancelButton).toBeInTheDocument()
    expect(cancelButton).toHaveAttribute("href", "/listings/test_listing_id/applications")

    // Check only for sections titles as the components themselves have separate test files
    expect(screen.getByRole("heading", { level: 2, name: /application data/i })).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { level: 2, name: /primary applicant/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { level: 2, name: /alternate contact/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { level: 2, name: /household members/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { level: 2, name: /household details/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { level: 2, name: /application programs/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { level: 2, name: /declared household income/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { level: 2, name: /application preferences/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { level: 2, name: /demographic information/i })
    ).toBeInTheDocument()
    expect(screen.getByRole("heading", { level: 2, name: /terms/i })).toBeInTheDocument()
  })

  it("should navigate to preview on submit click", async () => {
    const { pushMock } = mockNextRouter({ id: "test_id" })
    server.use(
      rest.get("http://localhost:3100/listings/test_id", (_req, res, ctx) => {
        return res(ctx.json({ ...listing, listingMultiselectQuestions: [] }))
      }),
      rest.post("http://localhost/api/adapter/applications", (_req, res, ctx) => {
        return res(
          ctx.json({ ...application, programs: [], preferences: [], id: "application_id" })
        )
      })
    )
    render(<NewApplication />)

    const submitButton = screen.getByRole("button", { name: /^submit$/i })
    expect(submitButton).toBeInTheDocument()
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/application/application_id")
    })
  })

  it("should navigate to new form on submit & new click", async () => {
    const { pushMock } = mockNextRouter({ id: "test_id" })
    server.use(
      rest.get("http://localhost:3100/listings/test_id", (_req, res, ctx) => {
        return res(ctx.json({ ...listing, listingMultiselectQuestions: [] }))
      }),
      rest.post("http://localhost/api/adapter/applications", (_req, res, ctx) => {
        return res(
          ctx.json({ ...application, programs: [], preferences: [], id: "application_id" })
        )
      })
    )
    render(<NewApplication />)

    const submitButton = screen.getByRole("button", { name: /submit & new/i })
    expect(submitButton).toBeInTheDocument()
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/listings/test_id/applications/add")
    })
  })
})
