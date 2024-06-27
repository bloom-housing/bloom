import React from "react"
import { fireEvent } from "@testing-library/react"
import { rest } from "msw"
import { setupServer } from "msw/node"
import { listing } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import Lottery from "../../../src/pages/listings/[id]/lottery"
import { mockNextRouter, render } from "../../testUtils"

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

describe("lottery", () => {
  it("should render error text when listing is undefined", async () => {
    mockNextRouter({ id: "Uvbk5qurpB2WI9V6WnNdH" })
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(ctx.json({ id: "user1", userRoles: { isAdmin: true } }))
      }),
      rest.post("http://localhost:3100/auth/token", (_req, res, ctx) => {
        return res(ctx.json(""))
      })
    )

    const { findByText } = render(<Lottery listing={undefined} />)

    const error = await findByText("An error has occurred.")
    expect(error).toBeInTheDocument()
  })

  it("should render page if user is an admin", async () => {
    mockNextRouter({ id: "Uvbk5qurpB2WI9V6WnNdH" })
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(ctx.json({ id: "user1", userRoles: { isAdmin: true } }))
      }),
      rest.post("http://localhost:3100/auth/token", (_req, res, ctx) => {
        return res(ctx.json(""))
      })
    )

    const { getAllByText, findByText } = render(<Lottery listing={listing} />)

    const header = await findByText("Partners Portal")
    expect(header).toBeInTheDocument()

    expect(getAllByText(listing.name).length).toBeGreaterThan(0)
  })

  it("should render page if user is a jurisdictional admin", async () => {
    mockNextRouter({ id: "Uvbk5qurpB2WI9V6WnNdH" })
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(ctx.json({ id: "user1", userRoles: { isJurisdictionalAdmin: true } }))
      }),
      rest.post("http://localhost:3100/auth/token", (_req, res, ctx) => {
        return res(ctx.json(""))
      })
    )

    const { getAllByText, findByText } = render(<Lottery listing={listing} />)

    const header = await findByText("Partners Portal")
    expect(header).toBeInTheDocument()

    expect(getAllByText(listing.name).length).toBeGreaterThan(0)
  })

  it("should render page if user is a partner with access to this listing", async () => {
    mockNextRouter({ id: "Uvbk5qurpB2WI9V6WnNdH" })
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(
          ctx.json({
            id: "user1",
            userRoles: { isPartner: true },
            listings: [{ id: "Uvbk5qurpB2WI9V6WnNdH" }],
          })
        )
      }),
      rest.post("http://localhost:3100/auth/token", (_req, res, ctx) => {
        return res(ctx.json(""))
      })
    )

    const { getAllByText, findByText } = render(<Lottery listing={listing} />)

    const header = await findByText("Partners Portal")
    expect(header).toBeInTheDocument()

    expect(getAllByText(listing.name).length).toBeGreaterThan(0)
  })

  it("should not render page if user is a partner without access to this listing", () => {
    mockNextRouter({ id: "Uvbk5qurpB2WI9V6WnNdH" })
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(
          ctx.json({
            id: "user1",
            userRoles: { isPartner: true },
            listings: [{ id: "not-this-listings-id" }],
          })
        )
      }),
      rest.post("http://localhost:3100/auth/token", (_req, res, ctx) => {
        return res(ctx.json(""))
      })
    )

    const { queryAllByText, queryByText } = render(<Lottery listing={listing} />)

    const header = queryByText("Partners Portal")
    expect(header).not.toBeInTheDocument()
    expect(queryAllByText(listing.name).length).toBe(0)
  })

  it("should show no lottery run state if user is an admin and lottery has not been run", async () => {
    mockNextRouter({ id: "Uvbk5qurpB2WI9V6WnNdH" })
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(
          ctx.json({
            id: "user1",
            userRoles: { isAdmin: true },
          })
        )
      }),
      rest.post("http://localhost:3100/auth/token", (_req, res, ctx) => {
        return res(ctx.json(""))
      })
    )

    const { getByText, findByText } = render(<Lottery listing={listing} />)

    const header = await findByText("Partners Portal")
    expect(header).toBeInTheDocument()

    expect(getByText("No lottery data")).toBeInTheDocument()
    expect(
      getByText("It looks like you haven't run a lottery for this listing yet.")
    ).toBeInTheDocument()
    expect(getByText("History")).toBeInTheDocument()
    expect(getByText("Run lottery")).toBeInTheDocument()
  })

  it("should show export state if user is an admin and lottery has been run", async () => {
    mockNextRouter({ id: "Uvbk5qurpB2WI9V6WnNdH" })
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(
          ctx.json({
            id: "user1",
            userRoles: { isAdmin: true },
          })
        )
      }),
      rest.post("http://localhost:3100/auth/token", (_req, res, ctx) => {
        return res(ctx.json(""))
      })
    )

    const { getByText, findByText } = render(
      <Lottery listing={{ ...listing, lotteryLastRunAt: new Date() }} />
    )

    const header = await findByText("Partners Portal")
    expect(header).toBeInTheDocument()

    expect(getByText("Export lottery data")).toBeInTheDocument()
    expect(
      getByText("File includes randomized general pool and preference data.")
    ).toBeInTheDocument()
    expect(getByText("Re-run lottery")).toBeInTheDocument()
    expect(getByText("Release lottery")).toBeInTheDocument()
  })

  it("should show re-run modal if user clicks on re-run", async () => {
    mockNextRouter({ id: "Uvbk5qurpB2WI9V6WnNdH" })
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(
          ctx.json({
            id: "user1",
            userRoles: { isAdmin: true },
          })
        )
      }),
      rest.post("http://localhost:3100/auth/token", (_req, res, ctx) => {
        return res(ctx.json(""))
      })
    )

    const { getByText, findByText } = render(
      <Lottery listing={{ ...listing, lotteryLastRunAt: new Date() }} />
    )

    const header = await findByText("Partners Portal")
    expect(header).toBeInTheDocument()

    fireEvent.click(getByText("Re-run lottery"))
    expect(await findByText("Are you sure?")).toBeInTheDocument()
    expect(await findByText("I understand, re-run the lottery")).toBeInTheDocument()
  })

  it("should show release modal if user clicks on release", async () => {
    mockNextRouter({ id: "Uvbk5qurpB2WI9V6WnNdH" })
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(
          ctx.json({
            id: "user1",
            userRoles: { isAdmin: true },
          })
        )
      }),
      rest.post("http://localhost:3100/auth/token", (_req, res, ctx) => {
        return res(ctx.json(""))
      })
    )

    const { getByText, findByText } = render(
      <Lottery listing={{ ...listing, lotteryLastRunAt: new Date() }} />
    )

    const header = await findByText("Partners Portal")
    expect(header).toBeInTheDocument()

    fireEvent.click(getByText("Release lottery"))
    expect(await findByText("Confirmation needed")).toBeInTheDocument()
    expect(
      await findByText(
        "Releasing the lottery will give Partner users access to the lottery data, including the ability to publicize anonymous results to applicants."
      )
    ).toBeInTheDocument()
  })
})
