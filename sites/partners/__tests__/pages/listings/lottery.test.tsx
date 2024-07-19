import React from "react"
import { fireEvent } from "@testing-library/react"
import { rest } from "msw"
import { setupServer } from "msw/node"
import { listing } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import Lottery from "../../../src/pages/listings/[id]/lottery"
import { mockNextRouter, render } from "../../testUtils"
import {
  ListingMultiselectQuestion,
  LotteryStatusEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"

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
      }),
      rest.get("http://localhost/api/adapter/applicationFlaggedSets/meta", (_req, res, ctx) => {
        return res(ctx.json({ totalCount: 0 }))
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
      }),
      rest.get("http://localhost/api/adapter/applicationFlaggedSets/meta", (_req, res, ctx) => {
        return res(ctx.json({ totalCount: 0 }))
      })
    )

    const { getAllByText, findByText } = render(<Lottery listing={listing} />)

    const header = await findByText("Lottery")
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
      }),
      rest.get("http://localhost/api/adapter/applicationFlaggedSets/meta", (_req, res, ctx) => {
        return res(ctx.json({ totalCount: 0 }))
      })
    )

    const { getAllByText, findByText } = render(<Lottery listing={listing} />)

    const header = await findByText("Lottery")
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
      }),
      rest.get("http://localhost/api/adapter/applicationFlaggedSets/meta", (_req, res, ctx) => {
        return res(ctx.json({ totalCount: 0 }))
      })
    )

    const { getAllByText, findByText } = render(<Lottery listing={listing} />)

    const header = await findByText("Lottery")
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
      }),
      rest.get("http://localhost/api/adapter/applicationFlaggedSets/meta", (_req, res, ctx) => {
        return res(ctx.json({ totalCount: 0 }))
      })
    )

    const { queryAllByText, queryByText } = render(<Lottery listing={listing} />)

    const header = queryByText("Lottery")
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
      }),
      rest.get("http://localhost/api/adapter/applicationFlaggedSets/meta", (_req, res, ctx) => {
        return res(ctx.json({ totalCount: 0 }))
      })
    )

    const { getByText, findByText } = render(<Lottery listing={listing} />)

    const header = await findByText("Lottery")
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
      }),
      rest.get("http://localhost/api/adapter/applicationFlaggedSets/meta", (_req, res, ctx) => {
        return res(ctx.json({ totalCount: 0 }))
      })
    )

    const { getByText, findByText } = render(
      <Lottery listing={{ ...listing, lotteryLastRunAt: new Date() }} />
    )

    const header = await findByText("Lottery")
    expect(header).toBeInTheDocument()

    expect(getByText("Export lottery data")).toBeInTheDocument()
    expect(getByText("File includes randomized general pool data.")).toBeInTheDocument()
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
      }),
      rest.get("http://localhost/api/adapter/applicationFlaggedSets/meta", (_req, res, ctx) => {
        return res(ctx.json({ totalCount: 0 }))
      })
    )

    const { getByText, findByText, getAllByText } = render(
      <Lottery listing={{ ...listing, lotteryLastRunAt: new Date() }} />
    )

    const header = await findByText("Lottery")
    expect(header).toBeInTheDocument()

    fireEvent.click(getByText("Re-run lottery"))
    expect(await findByText("Are you sure?")).toBeInTheDocument()
    expect(getAllByText("Re-run lottery")).toHaveLength(2)
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
      }),
      rest.get("http://localhost/api/adapter/applicationFlaggedSets/meta", (_req, res, ctx) => {
        return res(ctx.json({ totalCount: 0 }))
      })
    )

    const { getByText, findByText } = render(
      <Lottery listing={{ ...listing, lotteryLastRunAt: new Date() }} />
    )

    const header = await findByText("Lottery")
    expect(header).toBeInTheDocument()

    fireEvent.click(getByText("Release lottery"))
    expect(await findByText("Are you sure?")).toBeInTheDocument()
    expect(
      getByText(
        "Releasing the lottery will give Partner users access to the lottery data, including the ability to publish results to applicants."
      )
    ).toBeInTheDocument()
  })

  it("should show confirm modal if user clicks on run lottery with no unresolved duplicates", async () => {
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
      }),
      rest.get("http://localhost/api/adapter/applicationFlaggedSets/meta", (_req, res, ctx) => {
        return res(ctx.json({ totalCount: 0 }))
      })
    )

    const { getByText, findByText } = render(<Lottery listing={listing} />)

    const header = await findByText("Lottery")
    expect(header).toBeInTheDocument()

    fireEvent.click(getByText("Run lottery"))
    expect(await findByText("Confirmation needed")).toBeInTheDocument()
    expect(
      getByText("Make sure to add all paper applications before running the lottery.")
    ).toBeInTheDocument()
  })

  it("should show confirm with duplicates modal if user clicks on run lottery and listing does have unresolved duplicates", async () => {
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
      }),
      rest.get("http://localhost/api/adapter/applicationFlaggedSets/meta", (_req, res, ctx) => {
        return res(ctx.json({ totalCount: 5, totalPendingCount: 5 }))
      })
    )

    const { getByText, findByText, getAllByText } = render(<Lottery listing={listing} />)

    const header = await findByText("Lottery")
    expect(header).toBeInTheDocument()

    fireEvent.click(getByText("Run lottery"))
    expect(await findByText("Confirmation needed")).toBeInTheDocument()
    expect(getByText("5 unresolved duplicate sets.")).toBeInTheDocument()
    expect(getAllByText("Run lottery")).toHaveLength(2)
  })

  it("should show export modal if lottery has been run with no preference text", async () => {
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
      }),
      rest.get("http://localhost/api/adapter/applicationFlaggedSets/meta", (_req, res, ctx) => {
        return res(ctx.json({ totalCount: 5, totalPendingCount: 5 }))
      })
    )

    const updatedListing = { ...listing, lotteryLastRunAt: new Date("September 6, 2025 8:15:00") }
    const { getByText, findByText, findAllByText, getAllByText } = render(
      <Lottery listing={updatedListing} />
    )

    const header = await findByText("Lottery")
    expect(header).toBeInTheDocument()

    expect(getByText("File includes randomized general pool data.")).toBeInTheDocument()

    fireEvent.click(getByText("Export"))
    expect(await findAllByText("Export lottery data")).toHaveLength(2)

    expect(
      getByText("This file includes the lottery raw rank for all applications.", { exact: false })
    ).toBeInTheDocument()
    expect(
      getByText("This data was generated from the lottery that was run on 09/06/2025 at 8:15 am.", {
        exact: false,
      })
    ).toBeInTheDocument()
    expect(getAllByText("Export")).toHaveLength(2)
  })

  it("should show export modal if lottery has been run with preference text", async () => {
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
      }),
      rest.get("http://localhost/api/adapter/applicationFlaggedSets/meta", (_req, res, ctx) => {
        return res(ctx.json({ totalCount: 5, totalPendingCount: 5 }))
      })
    )

    const updatedListing = {
      ...listing,
      lotteryLastRunAt: new Date("September 6, 2025 8:15:00"),
      listingMultiselectQuestions: [{ multiselectQuestions: {} } as ListingMultiselectQuestion],
    }
    const { getByText, findByText, findAllByText, getAllByText } = render(
      <Lottery listing={updatedListing} />
    )

    const header = await findByText("Lottery")
    expect(header).toBeInTheDocument()

    expect(
      getByText("File includes randomized general pool and preference data.")
    ).toBeInTheDocument()

    fireEvent.click(getByText("Export"))
    expect(await findAllByText("Export lottery data")).toHaveLength(2)

    expect(
      getByText(
        "This file includes the lottery raw rank and preferences data for all applications.",
        { exact: false }
      )
    ).toBeInTheDocument()
    expect(
      getByText("This data was generated from the lottery that was run on 09/06/2025 at 8:15 am.", {
        exact: false,
      })
    ).toBeInTheDocument()
    expect(getAllByText("Export")).toHaveLength(2)
  })

  it("should show no lottery released state as a partner", async () => {
    mockNextRouter({ id: "Uvbk5qurpB2WI9V6WnNdH" })
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(
          ctx.json({
            id: "user1",
            userRoles: { isAdmin: false, isJurisdictionalAdmin: true },
          })
        )
      }),
      rest.post("http://localhost:3100/auth/token", (_req, res, ctx) => {
        return res(ctx.json(""))
      }),
      rest.get("http://localhost/api/adapter/applicationFlaggedSets/meta", (_req, res, ctx) => {
        return res(ctx.json({ totalCount: 5, totalPendingCount: 5 }))
      })
    )

    const updatedListing = {
      ...listing,
      lotteryStatus: LotteryStatusEnum.ran,
    }

    const { getByText, findByText, queryByText } = render(<Lottery listing={updatedListing} />)

    const header = await findByText("Lottery")
    expect(header).toBeInTheDocument()

    expect(getByText("No lottery data")).toBeInTheDocument()
    expect(queryByText("Publish")).not.toBeInTheDocument()
    expect(queryByText("Run lottery")).not.toBeInTheDocument()
    expect(queryByText("Release lottery")).not.toBeInTheDocument()
  })

  it("should show publish modal if in released to partners state as a parter", async () => {
    mockNextRouter({ id: "Uvbk5qurpB2WI9V6WnNdH" })
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(
          ctx.json({
            id: "user1",
            userRoles: { isAdmin: false, isJurisdictionalAdmin: true },
          })
        )
      }),
      rest.post("http://localhost:3100/auth/token", (_req, res, ctx) => {
        return res(ctx.json(""))
      }),
      rest.get("http://localhost/api/adapter/applicationFlaggedSets/meta", (_req, res, ctx) => {
        return res(ctx.json({ totalCount: 5, totalPendingCount: 5 }))
      })
    )

    const updatedListing = {
      ...listing,
      lotteryStatus: LotteryStatusEnum.releasedToPartners,
    }

    const { getByText, findByText } = render(<Lottery listing={updatedListing} />)

    const header = await findByText("Lottery")
    expect(header).toBeInTheDocument()

    expect(getByText("Publish lottery data")).toBeInTheDocument()
    fireEvent.click(getByText("Publish"))
    expect(await findByText("Confirmation needed")).toBeInTheDocument()
    expect(
      getByText("Publishing the lottery for this listing will email results to applicants.")
    ).toBeInTheDocument()
    expect(getByText("Publish lottery")).toBeInTheDocument()
  })

  it("should show export if in published to public state as a parter", async () => {
    mockNextRouter({ id: "Uvbk5qurpB2WI9V6WnNdH" })
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(
          ctx.json({
            id: "user1",
            userRoles: { isAdmin: false, isJurisdictionalAdmin: true },
          })
        )
      }),
      rest.post("http://localhost:3100/auth/token", (_req, res, ctx) => {
        return res(ctx.json(""))
      }),
      rest.get("http://localhost/api/adapter/applicationFlaggedSets/meta", (_req, res, ctx) => {
        return res(ctx.json({ totalCount: 5, totalPendingCount: 5 }))
      })
    )

    const updatedListing = {
      ...listing,
      lotteryStatus: LotteryStatusEnum.publishedToPublic,
    }

    const { getByText, findByText } = render(<Lottery listing={updatedListing} />)

    const header = await findByText("Lottery")
    expect(header).toBeInTheDocument()

    expect(getByText("Export lottery data")).toBeInTheDocument()
    expect(getByText("Export")).toBeInTheDocument()
  })
})
