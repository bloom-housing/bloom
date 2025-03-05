import React from "react"
import { fireEvent } from "@testing-library/react"
import { rest } from "msw"
import { setupServer } from "msw/node"
import { application, listing } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import {
  Listing,
  ListingsStatusEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import ApplicationsList from "../../../../src/pages/listings/[id]/applications/index"
import { mockNextRouter, render } from "../../../testUtils"

const server = setupServer()

beforeAll(() => {
  server.listen()
})

afterEach(() => {
  server.resetHandlers()
  window.sessionStorage.clear()
})

afterAll(() => {
  server.close()
})

describe("applications", () => {
  it("should render error text when the api call fails", async () => {
    mockNextRouter({ id: "Uvbk5qurpB2WI9V6WnNdH" })

    server.use(
      rest.get("http://localhost:3100/listings/Uvbk5qurpB2WI9V6WnNdH", (_req, res, ctx) => {
        return res(ctx.json(listing))
      }),
      rest.get("http://localhost:3100/applications", (_req, res, ctx) => {
        return res(ctx.status(500), ctx.json(""))
      }),
      rest.get("http://localhost:3100/applicationFlaggedSets", (_req, res, ctx) => {
        return res(ctx.json({ items: [], meta: { totalItems: 0, totalPages: 0 } }))
      }),
      rest.get("http://localhost/api/adapter/applicationFlaggedSets/meta", (_req, res, ctx) => {
        return res(ctx.json({ totalCount: 1 }))
      })
    )
    const { findByText } = render(<ApplicationsList />)

    const error = await findByText("An error has occurred.")
    expect(error).toBeInTheDocument()
  })

  it("should render applications table when data is returned", async () => {
    mockNextRouter({ id: "Uvbk5qurpB2WI9V6WnNdH" })

    server.use(
      rest.get("http://localhost:3100/listings/Uvbk5qurpB2WI9V6WnNdH", (_req, res, ctx) => {
        return res(ctx.json(listing))
      }),
      rest.get("http://localhost:3100/applications", (_req, res, ctx) => {
        return res(ctx.json({ items: [application], meta: { totalItems: 1, totalPages: 1 } }))
      }),
      rest.get("http://localhost:3100/applicationFlaggedSets", (_req, res, ctx) => {
        return res(ctx.json({ items: [], meta: { totalItems: 0, totalPages: 0 } }))
      }),
      rest.get("http://localhost:3100/applicationFlaggedSets/meta", (_req, res, ctx) => {
        return res(ctx.json({ totalCount: 1 }))
      }),
      rest.get("http://localhost/api/adapter/applicationFlaggedSets/meta", (_req, res, ctx) => {
        return res(ctx.json({ totalCount: 1 }))
      })
    )
    const { getByText, getAllByText, findAllByText } = render(<ApplicationsList />)

    const header = await findAllByText("Applications")
    expect(header.length).toBeGreaterThan(0)

    expect(getAllByText("Archer Studios").length).toBeGreaterThan(0)
    expect(getByText("Add Application")).toBeInTheDocument()
    expect(getByText("Export")).toBeInTheDocument()
    expect(getAllByText("All Applications").length).toBeGreaterThan(0)

    expect(getByText("Application Type")).toBeInTheDocument()
    expect(getByText("Electronic")).toBeInTheDocument()
    expect(getByText("First Name")).toBeInTheDocument()
    expect(getByText("Applicant First")).toBeInTheDocument()
    expect(getByText("Last Name")).toBeInTheDocument()
    expect(getByText("Applicant Last")).toBeInTheDocument()
    expect(getByText("Household Size")).toBeInTheDocument()
    expect(getByText("2")).toBeInTheDocument()
    expect(getByText("Declared Annual Income")).toBeInTheDocument()
    expect(getByText("$40,000")).toBeInTheDocument()
    expect(getByText("Subsidy or Voucher")).toBeInTheDocument()
    expect(getByText("Primary DOB")).toBeInTheDocument()
    expect(getByText("10/10/1990")).toBeInTheDocument()
    expect(getByText("Phone")).toBeInTheDocument()
    expect(getByText("(123) 123-1231")).toBeInTheDocument()
    expect(getByText("Phone Type")).toBeInTheDocument()
    expect(getByText("Home")).toBeInTheDocument()
    expect(getByText("Additional Phone")).toBeInTheDocument()
    expect(getByText("(456) 456-4564")).toBeInTheDocument()
    expect(getByText("Addtl. Phone Type")).toBeInTheDocument()
    expect(getByText("Cell")).toBeInTheDocument()
    expect(getByText("Residence Street Address")).toBeInTheDocument()
    expect(getByText("3200 Old Faithful Inn Rd")).toBeInTheDocument()
    expect(getByText("Residence City")).toBeInTheDocument()
    expect(getByText("Yellowstone National Park")).toBeInTheDocument()
    expect(getByText("Residence State")).toBeInTheDocument()
    expect(getByText("WY")).toBeInTheDocument()
    expect(getByText("Residence Zip")).toBeInTheDocument()
    expect(getByText("82190")).toBeInTheDocument()
    expect(getByText("Mailing Street Address")).toBeInTheDocument()
    expect(getByText("1000 US-36")).toBeInTheDocument()
    expect(getByText("Mailing City")).toBeInTheDocument()
    expect(getByText("Estes Park")).toBeInTheDocument()
    expect(getByText("Mailing State")).toBeInTheDocument()
    expect(getByText("CO")).toBeInTheDocument()
    expect(getByText("Mailing Zip")).toBeInTheDocument()
    expect(getByText("80517")).toBeInTheDocument()
    expect(getByText("Alt Contact First Name")).toBeInTheDocument()
    expect(getByText("Alternate First")).toBeInTheDocument()
    expect(getByText("Alt Contact Last Name")).toBeInTheDocument()
    expect(getByText("Alternate Last")).toBeInTheDocument()
    expect(getByText("Alt Contact Agency")).toBeInTheDocument()
    expect(getByText("Alternate Agency")).toBeInTheDocument()
    expect(getByText("Alt Contact Email")).toBeInTheDocument()
    expect(getByText("alternate@email.com")).toBeInTheDocument()
    expect(getByText("Alt Contact Phone")).toBeInTheDocument()
    expect(getByText("(789) 012-3456")).toBeInTheDocument()
    expect(getByText("Alt Contact Street Address")).toBeInTheDocument()
    expect(getByText("25 Visitor Center Rd")).toBeInTheDocument()
    expect(getByText("Alt Contact City")).toBeInTheDocument()
    expect(getByText("Bay Harbor")).toBeInTheDocument()
    expect(getByText("Alt Contact State")).toBeInTheDocument()
    expect(getByText("ME")).toBeInTheDocument()
    expect(getByText("Alt Contact Zip")).toBeInTheDocument()
    expect(getByText("04609")).toBeInTheDocument()
    expect(getByText("First Name HH:1")).toBeInTheDocument()
    expect(getByText("Household First")).toBeInTheDocument()
    expect(getByText("Last Name HH:1")).toBeInTheDocument()
    expect(getByText("Household Last")).toBeInTheDocument()
    expect(getByText("Household DOB HH:1")).toBeInTheDocument()
    expect(getByText("11/25/1966")).toBeInTheDocument()
    expect(getByText("Relationship HH:1")).toBeInTheDocument()
    expect(getByText("Friend")).toBeInTheDocument()
    expect(getByText("Same Address as Primary HH:1")).toBeInTheDocument()
    expect(getAllByText("Yes")).toHaveLength(2)
    expect(getByText("Flagged as Duplicate")).toBeInTheDocument()
    expect(getByText("Marked as Duplicate")).toBeInTheDocument()
    expect(getByText("No")).toBeInTheDocument()
  })

  it("should directly open application add page when add application is clicked while listing is open", async () => {
    const { pushMock } = mockNextRouter({ id: "Uvbk5qurpB2WI9V6WnNdH" })

    server.use(
      rest.get("http://localhost:3100/listings/Uvbk5qurpB2WI9V6WnNdH", (_req, res, ctx) => {
        return res(ctx.json(listing))
      }),
      rest.get("http://localhost:3100/applications", (_req, res, ctx) => {
        return res(ctx.json({ items: [application], meta: { totalItems: 1, totalPages: 1 } }))
      }),
      rest.get("http://localhost:3100/applicationFlaggedSets", (_req, res, ctx) => {
        return res(ctx.json({ items: [], meta: { totalItems: 0, totalPages: 0 } }))
      }),
      rest.get("http://localhost:3100/applicationFlaggedSets/meta", (_req, res, ctx) => {
        return res(ctx.json({ totalCount: 1 }))
      }),
      rest.get("http://localhost/api/adapter/applicationFlaggedSets/meta", (_req, res, ctx) => {
        return res(ctx.json({ totalCount: 1 }))
      })
    )
    const { findAllByText, getByText } = render(<ApplicationsList />)

    const header = await findAllByText("Applications")
    expect(header.length).toBeGreaterThan(0)

    fireEvent.click(getByText("Add Application"))
    expect(pushMock).toHaveBeenCalledWith("/listings/Uvbk5qurpB2WI9V6WnNdH/applications/add")
  })

  it("should not allow new applications when a listing is closed and the user is not an admin", async () => {
    mockNextRouter({ id: "Uvbk5qurpB2WI9V6WnNdH" })

    const closedListing: Listing = { ...listing, status: ListingsStatusEnum.closed }
    server.use(
      rest.get("http://localhost:3100/listings/Uvbk5qurpB2WI9V6WnNdH", (_req, res, ctx) => {
        return res(ctx.json(closedListing))
      }),
      rest.get("http://localhost/api/adapter/applications", (_req, res, ctx) => {
        return res(ctx.json({ items: [application], meta: { totalItems: 1, totalPages: 1 } }))
      }),
      rest.get("http://localhost:3100/applications", (_req, res, ctx) => {
        return res(ctx.json({ items: [application], meta: { totalItems: 1, totalPages: 1 } }))
      }),
      rest.get("http://localhost:3100/applicationFlaggedSets", (_req, res, ctx) => {
        return res(ctx.json({ items: [], meta: { totalItems: 0, totalPages: 0 } }))
      }),
      rest.get("http://localhost/api/adapter/applicationFlaggedSets/meta", (_req, res, ctx) => {
        return res(ctx.json({ totalCount: 1 }))
      }),
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(ctx.json({ id: "user1", userRoles: { isAdmin: false } }))
      }),
      rest.post("http://localhost:3100/auth/token", (_req, res, ctx) => {
        return res(ctx.json(""))
      })
    )
    const { findAllByText, queryByText } = render(<ApplicationsList />)

    const header = await findAllByText("Applications")
    expect(header.length).toBeGreaterThan(0)

    expect(queryByText("Add Application")).not.toBeInTheDocument()
  })

  it("should open confirmation modal when application add is clicked while listing is closed and user is an admin", async () => {
    const { pushMock } = mockNextRouter({ id: "Uvbk5qurpB2WI9V6WnNdH" })

    const closedListing: Listing = { ...listing, status: ListingsStatusEnum.closed }
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost/api/adapter/listings/Uvbk5qurpB2WI9V6WnNdH", (_req, res, ctx) => {
        return res(ctx.json(closedListing))
      }),
      rest.get("http://localhost:3100/listings/Uvbk5qurpB2WI9V6WnNdH", (_req, res, ctx) => {
        return res(ctx.json(closedListing))
      }),
      rest.get("http://localhost/api/adapter/applications", (_req, res, ctx) => {
        return res(ctx.json({ items: [application], meta: { totalItems: 1, totalPages: 1 } }))
      }),
      rest.get("http://localhost:3100/applications", (_req, res, ctx) => {
        return res(ctx.json({ items: [application], meta: { totalItems: 1, totalPages: 1 } }))
      }),
      rest.get("http://localhost/api/adapter/applicationFlaggedSets", (_req, res, ctx) => {
        return res(ctx.json({ items: [], meta: { totalItems: 0, totalPages: 0 } }))
      }),
      rest.get("http://localhost:3100/applicationFlaggedSets", (_req, res, ctx) => {
        return res(ctx.json({ items: [], meta: { totalItems: 0, totalPages: 0 } }))
      }),
      rest.get("http://localhost/api/adapter/applicationFlaggedSets/meta", (_req, res, ctx) => {
        return res(ctx.json({ totalCount: 1 }))
      }),
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(ctx.json({ id: "user1", userRoles: { isAdmin: true } }))
      }),
      rest.post("http://localhost:3100/auth/token", (_req, res, ctx) => {
        return res(ctx.json(""))
      })
    )
    const { findByText, getByText, findAllByText } = render(<ApplicationsList />)

    const header = await findAllByText("Applications")
    expect(header.length).toBeGreaterThan(0)

    fireEvent.click(getByText("Add Application"))
    const modalHeader = await findByText("Confirmation needed")
    expect(modalHeader).toBeInTheDocument()
    expect(pushMock).not.toHaveBeenCalledWith("/listings/Uvbk5qurpB2WI9V6WnNdH/applications/add")
  })
})
