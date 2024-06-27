import React from "react"
import { MessageProvider } from "@bloom-housing/shared-helpers"
import { fireEvent } from "@testing-library/react"
import { rest } from "msw"
import { setupServer } from "msw/node"
import { listing } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import ListingsList from "../../../src/pages/index"
import { mockNextRouter, render } from "../../testUtils"

const server = setupServer()

beforeAll(() => {
  server.listen()
  mockNextRouter()
})

afterEach(() => {
  server.resetHandlers()
  window.sessionStorage.clear()
})

afterAll(() => server.close())

describe("listings", () => {
  it("should not render Export to CSV when user is not admin", async () => {
    window.URL.createObjectURL = jest.fn()
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost:3100/listings", (_req, res, ctx) => {
        return res(ctx.json({ items: [listing], meta: { totalItems: 1, totalPages: 1 } }))
      }),
      rest.get("http://localhost/api/adapter/listings", (_req, res, ctx) => {
        return res(ctx.json({ items: [listing], meta: { totalItems: 1, totalPages: 1 } }))
      }),
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(
          ctx.json({ id: "user1", roles: { id: "user1", isAdmin: false, isPartner: true } })
        )
      }),
      rest.post("http://localhost:3100/auth/token", (_req, res, ctx) => {
        return res(ctx.json(""))
      })
    )

    const { findByText, queryByText } = render(<ListingsList />)
    const header = await findByText("Listings")
    expect(header).toBeInTheDocument()
    const exportButton = queryByText("Export to CSV")
    expect(exportButton).not.toBeInTheDocument()
  })

  // Skipping for now until the CSV endpoints are created
  it.skip("should render the error text when listings csv api call fails", async () => {
    window.URL.createObjectURL = jest.fn()
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost:3100/listings", (_req, res, ctx) => {
        return res(ctx.json({ items: [listing], meta: { totalItems: 1, totalPages: 1 } }))
      }),
      rest.get("http://localhost/api/adapter/listings", (_req, res, ctx) => {
        return res(ctx.json({ items: [listing], meta: { totalItems: 1, totalPages: 1 } }))
      }),
      rest.get("http://localhost/api/adapter/listings/csv", (_req, res, ctx) => {
        return res(ctx.status(500), ctx.json(""))
      }),
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(ctx.json({ id: "user1", roles: { id: "user1", isAdmin: true } }))
      }),
      rest.post("http://localhost:3100/auth/token", (_req, res, ctx) => {
        return res(ctx.json(""))
      })
    )

    const { findByText, getByText } = render(<ListingsList />)
    const header = await findByText("Listings")
    expect(header).toBeInTheDocument()
    const exportButton = getByText("Export to CSV")
    expect(exportButton).toBeInTheDocument()
    fireEvent.click(exportButton)
    const error = await findByText(
      "There was an error. Please try again, or contact support for help.",
      {
        exact: false,
      }
    )
    expect(error).toBeInTheDocument()
  })

  // Skipping for now until the CSV endpoints are created
  it.skip("should render Export to CSV when user is admin and success message when clicked", async () => {
    window.URL.createObjectURL = jest.fn()
    //Prevent error from clicking anchor tag within test
    HTMLAnchorElement.prototype.click = jest.fn()
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost:3100/listings", (_req, res, ctx) => {
        return res(ctx.json({ items: [listing], meta: { totalItems: 1, totalPages: 1 } }))
      }),
      rest.get("http://localhost/api/adapter/listings/csv", (_req, res, ctx) => {
        return res(ctx.json({ listingCSV: "", unitCSV: "" }))
      }),
      rest.get("http://localhost:3100/listings/csv", (_req, res, ctx) => {
        return res(ctx.json({ listingCSV: "", unitCSV: "" }))
      }),
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(ctx.json({ id: "user1", roles: { id: "user1", isAdmin: true } }))
      }),
      rest.post("http://localhost:3100/auth/token", (_req, res, ctx) => {
        return res(ctx.json(""))
      })
    )

    const { findByText, getByText } = render(
      <MessageProvider>
        <ListingsList />
      </MessageProvider>
    )

    const header = await findByText("Listings")
    expect(header).toBeInTheDocument()
    const exportButton = getByText("Export to CSV")
    expect(exportButton).toBeInTheDocument()
    fireEvent.click(exportButton)
    const success = await findByText("The file has been exported")
    expect(success).toBeInTheDocument()
  })
})
