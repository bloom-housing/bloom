import React from "react"
import { setupServer } from "msw/lib/node"
import { fireEvent, mockNextRouter, render, screen, waitFor, within } from "../../testUtils"
import Admin from "../../../src/pages/admin"
import { rest } from "msw"

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

const featureFlags = [
  {
    id: "featureFlag1Id",
    name: "featureFlag1",
    description: "featureFlag1 description",
    jurisdictions: [
      { id: "juris1", name: "jurisdiction 1" },
      { id: "juris2", name: "jurisdiction 2" },
    ],
  },
  {
    id: "featureFlag2Id",
    name: "featureFlag2",
    description: "featureFlag2 description",
    jurisdictions: [{ id: "juris1", name: "jurisdiction 1" }],
  },
  {
    id: "featureFlag3Id",
    name: "featureFlag3",
    description: "featureFlag3 description",
    jurisdictions: [
      { id: "juris1", name: "jurisdiction 1" },
      { id: "juris2", name: "jurisdiction 2" },
      { id: "juris3", name: "jurisdiction 3" },
    ],
  },
]

const jurisdictions = [
  {
    id: "juris1",
    name: "jurisdiction 1",
    featureFlags: [
      { id: "featureFlag1Id", name: "featureFlag1" },
      { id: "featureFlag2Id", name: "featureFlag2" },
      { id: "featureFlag3Id", name: "featureFlag3" },
    ],
  },
  {
    id: "juris2",
    name: "jurisdiction 2",
    featureFlags: [
      { id: "featureFlag1Id", name: "featureFlag1" },
      { id: "featureFlag3Id", name: "featureFlag3" },
    ],
  },
  {
    id: "juris3",
    name: "jurisdiction 3",
    featureFlags: [{ id: "featureFlag3Id", name: "featureFlag3" }],
  },
]

describe("admin", () => {
  it("should show unauthorized if user is not a superAdmin", () => {
    window.URL.createObjectURL = jest.fn()
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(
          ctx.json({ id: "user1", roles: { id: "user1", isAdmin: true, isPartner: false } })
        )
      }),
      rest.post("http://localhost:3100/auth/token", (_req, res, ctx) => {
        return res(ctx.json(""))
      }),
      rest.get("http://localhost:3100/featureFlags", (_req, res, ctx) => {
        return res(ctx.json([]))
      })
    )
    render(<Admin />)
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /uh oh, you are not allowed to access this page./i,
      })
    ).toBeInTheDocument()
  })

  it("should display the feature flag page when superadmin for by jurisdiction", async () => {
    window.URL.createObjectURL = jest.fn()
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(
          ctx.json({
            id: "user1",
            userRoles: { id: "user1", isAdmin: true, isPartner: false, isSuperAdmin: true },
          })
        )
      }),
      rest.post("http://localhost:3100/auth/token", (_req, res, ctx) => {
        return res(ctx.json(""))
      }),
      rest.get("http://localhost:3100/featureFlags", (_req, res, ctx) => {
        return res(ctx.json(featureFlags))
      }),
      rest.get("http://localhost/api/adapter/jurisdictions", (_req, res, ctx) => {
        return res(ctx.json(jurisdictions))
      })
    )
    render(<Admin />)
    await screen.findByRole("cell", { name: "jurisdiction 1" })
    expect(screen.getByRole("heading", { level: 1, name: "Administration" })).toBeInTheDocument()
    expect(screen.getByRole("tab", { name: "By jurisdiction" })).toBeInTheDocument()
    expect(screen.getByRole("tabpanel", { name: "By jurisdiction" })).toBeInTheDocument()
    expect(screen.getByRole("tab", { name: "By feature flag" })).toBeInTheDocument()
    expect(screen.getByRole("tabpanel", { name: "By feature flag" })).toBeInTheDocument()

    expect(screen.getByRole("button", { name: "Add all new feature flags" })).toBeInTheDocument()

    // Table
    const table = screen.getByRole("table")
    const headAndBody = within(table).getAllByRole("rowgroup")
    expect(headAndBody).toHaveLength(2)
    const [head, body] = headAndBody

    const columnHeaders = within(head).getAllByRole("columnheader")
    expect(columnHeaders).toHaveLength(2)
    expect(columnHeaders[0]).toHaveTextContent("Jurisdiction")
    expect(columnHeaders[1]).toHaveTextContent("Actions")

    const rows = within(body).getAllByRole("row")
    expect(rows).toHaveLength(3)
    // Validate first row
    const [jurisdiction, actions] = within(rows[0]).getAllByRole("cell")
    expect(jurisdiction).toHaveTextContent("jurisdiction 1")
    expect(within(actions).getByRole("button", { name: "Edit" })).toBeInTheDocument()
    // Validate second row
    const [jurisdiction2, actions2] = within(rows[1]).getAllByRole("cell")
    expect(jurisdiction2).toHaveTextContent("jurisdiction 2")
    expect(within(actions2).getByRole("button", { name: "Edit" })).toBeInTheDocument()
    // Validate third row
    const [jurisdiction3, actions3] = within(rows[2]).getAllByRole("cell")
    expect(jurisdiction3).toHaveTextContent("jurisdiction 3")
    expect(within(actions3).getByRole("button", { name: "Edit" })).toBeInTheDocument()
  })

  it("should display the feature flag page when superadmin for by feature flag", async () => {
    window.URL.createObjectURL = jest.fn()
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(
          ctx.json({
            id: "user1",
            userRoles: { id: "user1", isAdmin: true, isPartner: false, isSuperAdmin: true },
          })
        )
      }),
      rest.post("http://localhost:3100/auth/token", (_req, res, ctx) => {
        return res(ctx.json(""))
      }),
      rest.get("http://localhost:3100/featureFlags", (_req, res, ctx) => {
        return res(ctx.json(featureFlags))
      }),
      rest.get("http://localhost/api/adapter/jurisdictions", (_req, res, ctx) => {
        return res(ctx.json(jurisdictions))
      })
    )
    render(<Admin />)

    await screen.findByRole("cell", { name: "jurisdiction 1" })

    // Switch to the "by feature flag" tab
    fireEvent.click(screen.getByRole("tab", { name: "By feature flag" }))

    await screen.findByRole("cell", { name: "featureFlag1" })

    // Table
    const table = screen.getByRole("table")
    const headAndBody = within(table).getAllByRole("rowgroup")
    expect(headAndBody).toHaveLength(2)
    const [head, body] = headAndBody

    const columnHeaders = within(head).getAllByRole("columnheader")
    expect(columnHeaders).toHaveLength(3)
    expect(columnHeaders[0]).toHaveTextContent("Feature Flag")
    expect(columnHeaders[1]).toHaveTextContent("Description")
    expect(columnHeaders[2]).toHaveTextContent("Actions")

    const rows = within(body).getAllByRole("row")
    expect(rows).toHaveLength(3)
    // Validate first row
    const [featureFlag, description, actions] = within(rows[0]).getAllByRole("cell")
    expect(featureFlag).toHaveTextContent("featureFlag1")
    expect(description).toHaveTextContent("featureFlag1 description")
    expect(within(actions).getByRole("button", { name: "Edit" })).toBeInTheDocument()
    // Validate second row
    const [featureFlag2, description2, actions2] = within(rows[1]).getAllByRole("cell")
    expect(featureFlag2).toHaveTextContent("featureFlag2")
    expect(description2).toHaveTextContent("featureFlag2 description")
    expect(within(actions2).getByRole("button", { name: "Edit" })).toBeInTheDocument()
    // Validate third row
    const [featureFlag3, description3, actions3] = within(rows[2]).getAllByRole("cell")
    expect(featureFlag3).toHaveTextContent("featureFlag3")
    expect(description3).toHaveTextContent("featureFlag3 description")
    expect(within(actions3).getByRole("button", { name: "Edit" })).toBeInTheDocument()
  })

  it("should open and associate feature flag for jurisdiction", async () => {
    window.URL.createObjectURL = jest.fn()
    document.cookie = "access-token-available=True"
    // Watch the associate call to make sure it's called
    const requestSpy = jest.fn()
    server.events.on("request:start", (request) => {
      if (request.method === "PUT" && request.url.href.includes("associateJurisdictions")) {
        requestSpy(request.body)
      }
    })
    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(
          ctx.json({
            id: "user1",
            userRoles: { id: "user1", isAdmin: true, isPartner: false, isSuperAdmin: true },
          })
        )
      }),
      rest.post("http://localhost:3100/auth/token", (_req, res, ctx) => {
        return res(ctx.json(""))
      }),
      rest.get("http://localhost:3100/featureFlags", (_req, res, ctx) => {
        return res(ctx.json(featureFlags))
      }),
      rest.get("http://localhost/api/adapter/featureFlags", (_req, res, ctx) => {
        return res(ctx.json(featureFlags))
      }),
      rest.get("http://localhost/api/adapter/jurisdictions", (_req, res, ctx) => {
        return res(ctx.json(jurisdictions))
      }),
      rest.put(
        "http://localhost/api/adapter/featureFlags/associateJurisdictions",
        (_req, res, ctx) => {
          return res(ctx.json("success"))
        }
      )
    )
    render(<Admin />)
    await screen.findByRole("cell", { name: "jurisdiction 1" })

    fireEvent.click(screen.getAllByRole("button", { name: "Edit" })[1])

    expect(screen.getByRole("heading", { level: 1, name: "jurisdiction 2" })).toBeInTheDocument()
    // only the appropriate feature flags should be selected
    expect(screen.getByRole("checkbox", { name: "featureFlag1 description" })).toBeChecked()
    expect(screen.getByRole("checkbox", { name: "featureFlag2 description" })).not.toBeChecked()
    expect(screen.getByRole("checkbox", { name: "featureFlag3 description" })).toBeChecked()

    // uncheck a feature flag
    fireEvent.click(screen.getByRole("checkbox", { name: "featureFlag1 description" }))
    expect(screen.getByRole("checkbox", { name: "featureFlag1 description" })).not.toBeChecked()
    // verify the call to remove jurisdiction from feature flag
    await waitFor(() => {
      expect(requestSpy).toHaveBeenCalledWith({
        id: "featureFlag1Id",
        associate: [],
        remove: ["juris2"],
      })
    })

    // check a feature flag
    fireEvent.click(screen.getByRole("checkbox", { name: "featureFlag2 description" }))
    expect(screen.getByRole("checkbox", { name: "featureFlag2 description" })).toBeChecked()
    // verify the call to remove jurisdiction from feature flag
    await waitFor(() => {
      expect(requestSpy).toHaveBeenCalledWith({
        id: "featureFlag2Id",
        associate: ["juris2"],
        remove: [],
      })
    })
  })

  it("should open and associate feature flag for feature flag", async () => {
    window.URL.createObjectURL = jest.fn()
    document.cookie = "access-token-available=True"
    // Watch the associate call to make sure it's called
    const requestSpy = jest.fn()
    server.events.on("request:start", (request) => {
      if (request.method === "PUT" && request.url.href.includes("associateJurisdictions")) {
        requestSpy(request.body)
      }
    })
    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(
          ctx.json({
            id: "user1",
            userRoles: { id: "user1", isAdmin: true, isPartner: false, isSuperAdmin: true },
          })
        )
      }),
      rest.post("http://localhost:3100/auth/token", (_req, res, ctx) => {
        return res(ctx.json(""))
      }),
      rest.get("http://localhost:3100/featureFlags", (_req, res, ctx) => {
        return res(ctx.json(featureFlags))
      }),
      rest.get("http://localhost/api/adapter/featureFlags", (_req, res, ctx) => {
        return res(ctx.json(featureFlags))
      }),
      rest.get("http://localhost/api/adapter/jurisdictions", (_req, res, ctx) => {
        return res(ctx.json(jurisdictions))
      }),
      rest.put(
        "http://localhost/api/adapter/featureFlags/associateJurisdictions",
        (_req, res, ctx) => {
          return res(ctx.json("success"))
        }
      )
    )
    render(<Admin />)
    await screen.findByRole("cell", { name: "jurisdiction 1" })

    // Switch to the "by feature flag" tab
    fireEvent.click(screen.getByRole("tab", { name: "By feature flag" }))

    fireEvent.click(screen.getAllByRole("button", { name: "Edit" })[0])

    expect(screen.getByRole("heading", { level: 1, name: "featureFlag1" })).toBeInTheDocument()
    // only the appropriate feature flags should be selected
    expect(screen.getByRole("checkbox", { name: "jurisdiction 1" })).toBeChecked()
    expect(screen.getByRole("checkbox", { name: "jurisdiction 2" })).toBeChecked()
    expect(screen.getByRole("checkbox", { name: "jurisdiction 3" })).not.toBeChecked()

    // uncheck a feature flag
    fireEvent.click(screen.getByRole("checkbox", { name: "jurisdiction 1" }))
    expect(screen.getByRole("checkbox", { name: "jurisdiction 1" })).not.toBeChecked()
    // verify the call to remove jurisdiction from feature flag
    await waitFor(() => {
      expect(requestSpy).toHaveBeenCalledWith({
        id: "featureFlag1Id",
        associate: [],
        remove: ["juris1"],
      })
    })

    // check a feature flag
    fireEvent.click(screen.getByRole("checkbox", { name: "jurisdiction 3" }))
    expect(screen.getByRole("checkbox", { name: "jurisdiction 3" })).toBeChecked()
    // verify the call to remove jurisdiction from feature flag
    await waitFor(() => {
      expect(requestSpy).toHaveBeenCalledWith({
        id: "featureFlag1Id",
        associate: ["juris3"],
        remove: [],
      })
    })
  })
})
