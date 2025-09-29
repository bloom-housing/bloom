import { AuthProvider, ConfigProvider, MessageProvider } from "@bloom-housing/shared-helpers"
import { fireEvent, screen } from "@testing-library/react"
import { rest } from "msw"
import { setupServer } from "msw/node"
import React from "react"
import Users from "../../../src/pages/users"
import { user } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
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

describe("users", () => {
  it("should render the error text when api call fails", async () => {
    server.use(
      rest.post("http://localhost:3100/listings/list", (_req, res, ctx) => {
        return res(ctx.json([]))
      }),
      rest.get("http://localhost:3100/user/list", (_req, res, ctx) => {
        return res(ctx.status(500), ctx.json(""))
      })
    )
    const { findByText } = render(
      <ConfigProvider apiUrl={"http://localhost:3100"}>
        <AuthProvider>
          <Users />
        </AuthProvider>
      </ConfigProvider>
    )

    const error = await findByText("An error has occurred.")
    expect(error).toBeInTheDocument()
  })

  it("should render user table when data is returned", async () => {
    window.URL.createObjectURL = jest.fn()
    // set a logged in token
    document.cookie = "access-token-available=True"
    server.use(
      rest.post("http://localhost:3100/listings/list", (_req, res, ctx) => {
        return res(ctx.json([]))
      }),
      rest.get("http://localhost/api/adapter/listings", (_req, res, ctx) => {
        return res(ctx.json([]))
      }),
      rest.get("http://localhost:3100/user/list", (_req, res, ctx) => {
        return res(ctx.json({ items: [user], meta: { totalItems: 1, totalPages: 1 } }))
      }),
      rest.get("http://localhost/api/adapter/user/list", (_req, res, ctx) => {
        return res(ctx.json({ items: [user], meta: { totalItems: 1, totalPages: 1 } }))
      }),
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(ctx.json(user))
      })
    )
    const { findByText, getByText, queryAllByText } = render(<Users />)

    const header = await findByText("Users")
    expect(header).toBeInTheDocument()
    expect(getByText("Filter")).toBeInTheDocument()
    const addUserButton = await screen.findByRole("button", { name: "Add user" })
    expect(addUserButton).toBeInTheDocument()
    expect(queryAllByText("Export to CSV")).toHaveLength(1)

    const name = await findByText("First Last")
    expect(name).toBeInTheDocument()
    expect(getByText("first.last@bloom.com")).toBeInTheDocument()
    expect(getByText("Administrator")).toBeInTheDocument()
    expect(getByText("09/04/2022")).toBeInTheDocument()
    expect(getByText("Confirmed")).toBeInTheDocument()
  })

  // Skipping for now until the CSV endpoints are created
  it.skip("should render Export when user is admin and success when clicked", async () => {
    window.URL.createObjectURL = jest.fn()
    // set a logged in token
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost:3100/listings", (_req, res, ctx) => {
        return res(ctx.json([]))
      }),
      rest.get("http://localhost:3100/user/list", (_req, res, ctx) => {
        return res(ctx.json({ items: [user], meta: { totalItems: 1, totalPages: 1 } }))
      }),
      // set logged in user as admin
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(ctx.json({ id: "user1", roles: { id: "user1", isAdmin: true } }))
      }),
      rest.get("http://localhost/api/adapter/user/csv", (_req, res, ctx) => {
        return res(ctx.json(""))
      }),
      rest.post("http://localhost:3100/auth/token", (_req, res, ctx) => {
        return res(ctx.json(""))
      })
    )
    const { findByText } = render(
      <ConfigProvider apiUrl={"http://localhost:3100"}>
        <AuthProvider>
          <MessageProvider>
            <Users />
          </MessageProvider>
        </AuthProvider>
      </ConfigProvider>
    )

    const header = await findByText("Users")
    expect(header).toBeInTheDocument()
    const addUserButton = await screen.findByRole("button", { name: "Add user" })
    expect(addUserButton).toBeInTheDocument()
    const exportButton = await findByText("Export to CSV")
    expect(exportButton).toBeInTheDocument()
    fireEvent.click(exportButton)
    const successMessage = await findByText("The file has been exported")
    expect(successMessage).toBeInTheDocument()
  })

  // Skipping for now until the CSV endpoints are created
  it.skip("should render error message csv fails", async () => {
    jest.spyOn(console, "log").mockImplementation(jest.fn())
    // set a logged in token
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost:3100/listings", (_req, res, ctx) => {
        return res(ctx.json([]))
      }),
      rest.get("http://localhost:3100/user/list", (_req, res, ctx) => {
        return res(ctx.json({ items: [user], meta: { totalItems: 1, totalPages: 1 } }))
      }),
      // set logged in user as admin
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(ctx.json({ id: "user1", roles: { id: "user1", isAdmin: true } }))
      }),
      rest.get("http://localhost/api/adapter/user/csv", (_req, res, ctx) => {
        return res(ctx.status(500), ctx.json(""))
      }),
      rest.post("http://localhost:3100/auth/token", (_req, res, ctx) => {
        return res(ctx.json(""))
      })
    )
    const { findByText } = render(
      <ConfigProvider apiUrl={"http://localhost:3100"}>
        <AuthProvider>
          <Users />
        </AuthProvider>
      </ConfigProvider>
    )

    const header = await findByText("Users")
    expect(header).toBeInTheDocument()
    const exportButton = await findByText("Export to CSV")
    expect(exportButton).toBeInTheDocument()
    fireEvent.click(exportButton)
    const errorMessage = await findByText(
      "There was an error. Please try again, or contact support for help.",
      {
        exact: false,
      }
    )
    expect(errorMessage).toBeInTheDocument()
    expect(console.log).toHaveBeenCalled()
  })
})
