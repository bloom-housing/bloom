import React from "react"
import { rest } from "msw"
import { setupServer } from "msw/node"
import { user } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import NewListing from "../../../src/pages/listings/add"
import { mockTipTapEditor, render } from "../../testUtils"

const server = setupServer()

const JURISDICTION_ID = "e50e64bc-4bc8-4cef-a4d1-1812add9981b"

window.scrollTo = jest.fn()

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockRouter = (query?: Record<string, string | undefined>) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const useRouter = jest.spyOn(require("next/router"), "useRouter")
  const replaceMock = jest.fn()
  const pushMock = jest.fn()
  useRouter.mockImplementation(() => ({
    pathname: "/",
    query: query ?? {},
    push: pushMock,
    back: jest.fn(),
    replace: replaceMock,
  }))
  return { replaceMock, pushMock }
}

beforeAll(() => {
  mockTipTapEditor()
  server.listen()
})

afterEach(() => {
  server.resetHandlers()
  window.sessionStorage.clear()
})

afterAll(() => {
  server.close()
})

const mockBaseHandlers = () => [
  rest.post("http://localhost:3100/auth/token", (_req, res, ctx) => {
    return res(ctx.json(""))
  }),
  rest.get("http://localhost/api/adapter/properties", (_req, res, ctx) => {
    return res(ctx.json({ items: [], totalItems: 0, totalPages: 0 }))
  }),
]

describe("add listing page", () => {
  it("should redirect to home when no jurisdictionId is provided", async () => {
    const { replaceMock } = mockRouter({})
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(ctx.json({ ...user, userRoles: { isAdmin: true } }))
      }),
      ...mockBaseHandlers()
    )

    render(<NewListing />)

    await new Promise((resolve) => setTimeout(resolve, 100))
    expect(replaceMock).toHaveBeenCalledWith("/")
  })

  it("should render the page for an admin user with a valid jurisdictionId", async () => {
    mockRouter({ jurisdictionId: JURISDICTION_ID })
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(ctx.json({ ...user, userRoles: { isAdmin: true } }))
      }),
      ...mockBaseHandlers()
    )

    const { findByRole, getAllByText } = render(<NewListing />)

    expect(await findByRole("heading", { name: "New listing" })).toBeInTheDocument()
    expect(getAllByText("Listings").length).toBeGreaterThan(0)
  })

  it("should render the page for a jurisdictional admin user", async () => {
    mockRouter({ jurisdictionId: JURISDICTION_ID })
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(
          ctx.json({
            ...user,
            userRoles: { isAdmin: false, isJurisdictionalAdmin: true },
          })
        )
      }),
      ...mockBaseHandlers()
    )

    const { findByRole } = render(<NewListing />)

    expect(await findByRole("heading", { name: "New listing" })).toBeInTheDocument()
  })

  it("should not render the page for a partner without listing access", () => {
    mockRouter({ jurisdictionId: JURISDICTION_ID })
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(
          ctx.json({
            ...user,
            userRoles: { isAdmin: false, isPartner: true },
            listings: [],
          })
        )
      }),
      ...mockBaseHandlers()
    )

    const { queryByRole } = render(<NewListing />)

    expect(queryByRole("heading", { name: "New listing" })).not.toBeInTheDocument()
  })

  it("should render the listing details and application process tabs", async () => {
    mockRouter({ jurisdictionId: JURISDICTION_ID })
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(ctx.json({ ...user, userRoles: { isAdmin: true } }))
      }),
      ...mockBaseHandlers()
    )

    const { findByRole } = render(<NewListing />)

    expect(await findByRole("heading", { name: "New listing" })).toBeInTheDocument()
    expect(await findByRole("tab", { name: "Listing details" })).toBeInTheDocument()
    expect(await findByRole("tab", { name: "Application process" })).toBeInTheDocument()
  })

  it("should render the breadcrumb navigation", async () => {
    mockRouter({ jurisdictionId: JURISDICTION_ID })
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(ctx.json({ ...user, userRoles: { isAdmin: true } }))
      }),
      ...mockBaseHandlers()
    )

    const { findByRole, getByRole, getAllByRole } = render(<NewListing />)

    expect(await findByRole("heading", { name: "New listing" })).toBeInTheDocument()
    expect(getAllByRole("link", { name: "Listings" }).length).toBeGreaterThan(0)
    expect(getByRole("link", { name: "New listing" })).toBeInTheDocument()
  })

  it("should render the page with nonRegulated query param", async () => {
    mockRouter({ jurisdictionId: JURISDICTION_ID, nonRegulated: "true" })
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(ctx.json({ ...user, userRoles: { isAdmin: true } }))
      }),
      ...mockBaseHandlers()
    )

    const { findByRole } = render(<NewListing />)

    expect(await findByRole("heading", { name: "New listing" })).toBeInTheDocument()
  })
})
