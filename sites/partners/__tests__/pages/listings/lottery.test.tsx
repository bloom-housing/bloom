import React from "react"
import { rest } from "msw"
import { setupServer } from "msw/node"
import {
  FeatureFlagEnum,
  ListingMultiselectQuestion,
  ListingsStatusEnum,
  LotteryStatusEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { listing } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { fireEvent, screen } from "@testing-library/react"
import { mockNextRouter, render } from "../../testUtils"
import Lottery from "../../../src/pages/listings/[id]/lottery"

const server = setupServer()
const closedListing = {
  ...listing,
  status: ListingsStatusEnum.closed,
}

beforeAll(() => {
  process.env.lotteryDaysTillExpiry = "45"
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
      rest.get("http://localhost:3100/applicationFlaggedSets/meta", (_req, res, ctx) => {
        return res(ctx.json({ totalCount: 0 }))
      }),
      rest.get("http://localhost:3100/applicationFlaggedSets/meta", (_req, res, ctx) => {
        return res(ctx.json({ totalCount: 0 }))
      }),
      rest.get(
        "http://localhost:3100/lottery/lotteryActivityLog/Uvbk5qurpB2WI9V6WnNdH",
        (_req, res, ctx) => {
          return res(ctx.json([]))
        }
      )
    )

    render(<Lottery listing={undefined} />)

    const error = await screen.findByText("An error has occurred.")
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
      rest.get("http://localhost:3100/applicationFlaggedSets/meta", (_req, res, ctx) => {
        return res(ctx.json({ totalCount: 0 }))
      }),
      rest.get(
        "http://localhost:3100/lottery/lotteryActivityLog/Uvbk5qurpB2WI9V6WnNdH",
        (_req, res, ctx) => {
          return res(ctx.json([]))
        }
      )
    )

    render(<Lottery listing={closedListing} />)

    const header = await screen.findByText("Lottery")
    expect(header).toBeInTheDocument()

    expect(screen.getAllByText(closedListing.name).length).toBeGreaterThan(0)
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
      rest.get("http://localhost:3100/applicationFlaggedSets/meta", (_req, res, ctx) => {
        return res(ctx.json({ totalCount: 0 }))
      }),
      rest.get(
        "http://localhost:3100/lottery/lotteryActivityLog/Uvbk5qurpB2WI9V6WnNdH",
        (_req, res, ctx) => {
          return res(ctx.json([]))
        }
      )
    )

    render(<Lottery listing={closedListing} />)

    const header = await screen.findByText("Lottery")
    expect(header).toBeInTheDocument()

    expect(screen.getAllByText(closedListing.name).length).toBeGreaterThan(0)
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
      rest.get("http://localhost:3100/applicationFlaggedSets/meta", (_req, res, ctx) => {
        return res(ctx.json({ totalCount: 0 }))
      }),
      rest.get(
        "http://localhost:3100/lottery/lotteryActivityLog/Uvbk5qurpB2WI9V6WnNdH",
        (_req, res, ctx) => {
          return res(ctx.json([]))
        }
      )
    )

    render(<Lottery listing={closedListing} />)

    const header = await screen.findByText("Lottery")
    expect(header).toBeInTheDocument()

    expect(screen.getAllByText(closedListing.name).length).toBeGreaterThan(0)
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
      rest.get("http://localhost:3100/applicationFlaggedSets/meta", (_req, res, ctx) => {
        return res(ctx.json({ totalCount: 0 }))
      }),
      rest.get(
        "http://localhost:3100/lottery/lotteryActivityLog/Uvbk5qurpB2WI9V6WnNdH",
        (_req, res, ctx) => {
          return res(ctx.json([]))
        }
      )
    )

    render(<Lottery listing={closedListing} />)

    const header = screen.queryByText("Lottery")
    expect(header).not.toBeInTheDocument()
    expect(screen.queryAllByText(closedListing.name).length).toBe(0)
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
      rest.get("http://localhost:3100/applicationFlaggedSets/meta", (_req, res, ctx) => {
        return res(ctx.json({ totalCount: 0 }))
      }),
      rest.get(
        "http://localhost:3100/lottery/lotteryActivityLog/Uvbk5qurpB2WI9V6WnNdH",
        (_req, res, ctx) => {
          return res(ctx.json([]))
        }
      )
    )

    render(<Lottery listing={closedListing} />)

    const header = await screen.findByText("Lottery")
    expect(header).toBeInTheDocument()

    expect(screen.getByText("No lottery data")).toBeInTheDocument()
    expect(
      screen.getByText("It looks like you haven't run a lottery for this listing yet.")
    ).toBeInTheDocument()
    expect(screen.getByText("History")).toBeInTheDocument()
    expect(screen.getByText("Run lottery")).toBeInTheDocument()
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
      rest.get("http://localhost:3100/applicationFlaggedSets/meta", (_req, res, ctx) => {
        return res(ctx.json({ totalCount: 0 }))
      }),
      rest.get(
        "http://localhost:3100/lottery/lotteryActivityLog/Uvbk5qurpB2WI9V6WnNdH",
        (_req, res, ctx) => {
          return res(ctx.json([]))
        }
      )
    )

    render(
      <Lottery
        listing={{
          ...closedListing,
          lotteryLastRunAt: new Date(),
          lotteryStatus: LotteryStatusEnum.ran,
          listingMultiselectQuestions: [],
        }}
      />
    )

    const header = await screen.findByText("Lottery")
    expect(header).toBeInTheDocument()

    expect(screen.getByText("Export lottery data")).toBeInTheDocument()
    expect(
      screen.getByText("This file includes the lottery raw rank for all applications.")
    ).toBeInTheDocument()
    expect(screen.getByText("Re-run lottery")).toBeInTheDocument()
    expect(screen.getByText("Release lottery")).toBeInTheDocument()
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
      rest.get("http://localhost:3100/applicationFlaggedSets/meta", (_req, res, ctx) => {
        return res(ctx.json({ totalCount: 0 }))
      }),
      rest.get(
        "http://localhost:3100/lottery/lotteryActivityLog/Uvbk5qurpB2WI9V6WnNdH",
        (_req, res, ctx) => {
          return res(ctx.json([]))
        }
      )
    )

    render(
      <Lottery
        listing={{
          ...closedListing,
          lotteryLastRunAt: new Date(),
          lotteryStatus: LotteryStatusEnum.ran,
        }}
      />
    )

    const header = await screen.findByText("Lottery")
    expect(header).toBeInTheDocument()

    fireEvent.click(screen.getByText("Re-run lottery"))
    expect(await screen.findByText("Are you sure?")).toBeInTheDocument()
    expect(screen.getByText("I understand, re-run lottery")).toBeInTheDocument()
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
      rest.get("http://localhost:3100/applicationFlaggedSets/meta", (_req, res, ctx) => {
        return res(ctx.json({ totalCount: 0 }))
      }),
      rest.get(
        "http://localhost:3100/lottery/lotteryActivityLog/Uvbk5qurpB2WI9V6WnNdH",
        (_req, res, ctx) => {
          return res(ctx.json([]))
        }
      )
    )

    render(
      <Lottery
        listing={{
          ...closedListing,
          lotteryLastRunAt: new Date(),
          lotteryStatus: LotteryStatusEnum.ran,
        }}
      />
    )

    const header = await screen.findByText("Lottery")
    expect(header).toBeInTheDocument()

    fireEvent.click(screen.getByText("Release lottery"))
    expect(await screen.findByText("Are you sure?")).toBeInTheDocument()
    expect(
      screen.getByText(
        "Releasing the lottery will give Partner users access to the lottery data, including the ability to publish results to applicants."
      )
    ).toBeInTheDocument()
  })

  it("should show new paper apps modals if user clicks on release if application updates have been made since last lottery run", async () => {
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
      rest.get("http://localhost:3100/applicationFlaggedSets/meta", (_req, res, ctx) => {
        return res(ctx.json({ totalCount: 0 }))
      }),
      rest.get(
        "http://localhost:3100/lottery/lotteryActivityLog/Uvbk5qurpB2WI9V6WnNdH",
        (_req, res, ctx) => {
          return res(ctx.json([]))
        }
      )
    )

    const lotteryLastRan = new Date()
    lotteryLastRan.setDate(lotteryLastRan.getDate() - 1)
    render(
      <Lottery
        listing={{
          ...listing,
          lotteryLastRunAt: lotteryLastRan,
          lotteryStatus: LotteryStatusEnum.ran,
          lastApplicationUpdateAt: new Date(),
        }}
      />
    )

    const header = await screen.findByText("Lottery")
    expect(header).toBeInTheDocument()

    fireEvent.click(screen.getByText("Release lottery"))
    expect(await screen.findByText("Action required")).toBeInTheDocument()
    expect(
      screen.getByText("You have added or updated applications without re-running the lottery.")
    ).toBeInTheDocument()
    expect(
      screen.getByText("You must re-run the lottery before releasing the lottery data.")
    ).toBeInTheDocument()
  })

  it("should show retract modal if user clicks on retract", async () => {
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
      rest.get("http://localhost:3100/applicationFlaggedSets/meta", (_req, res, ctx) => {
        return res(ctx.json({ totalCount: 0 }))
      }),
      rest.get(
        "http://localhost:3100/lottery/lotteryActivityLog/Uvbk5qurpB2WI9V6WnNdH",
        (_req, res, ctx) => {
          return res(ctx.json([]))
        }
      )
    )

    render(
      <Lottery
        listing={{
          ...listing,
          lotteryLastRunAt: new Date(),
          lotteryStatus: LotteryStatusEnum.releasedToPartners,
        }}
      />
    )

    const header = await screen.findByText("Lottery")
    expect(header).toBeInTheDocument()

    fireEvent.click(screen.getByText("Retract lottery"))
    expect(await screen.findByText("Are you sure?")).toBeInTheDocument()
    expect(
      screen.getByText(
        "Retracting the lottery will revoke Partner users' access to the lottery data, including their ability to publish results to applicants."
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
      rest.get("http://localhost:3100/applicationFlaggedSets/meta", (_req, res, ctx) => {
        return res(ctx.json({ totalCount: 0 }))
      }),
      rest.get(
        "http://localhost:3100/lottery/lotteryActivityLog/Uvbk5qurpB2WI9V6WnNdH",
        (_req, res, ctx) => {
          return res(ctx.json([]))
        }
      )
    )

    render(<Lottery listing={closedListing} />)

    const header = await screen.findByText("Lottery")
    expect(header).toBeInTheDocument()

    fireEvent.click(screen.getByText("Run lottery"))
    expect(await screen.findByText("Confirmation needed")).toBeInTheDocument()
    expect(
      screen.getByText("Make sure to add all paper applications before running the lottery.")
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
      rest.get("http://localhost:3100/applicationFlaggedSets/meta", (_req, res, ctx) => {
        return res(ctx.json({ totalCount: 5, totalPendingCount: 5 }))
      }),
      rest.get(
        "http://localhost:3100/lottery/lotteryActivityLog/Uvbk5qurpB2WI9V6WnNdH",
        (_req, res, ctx) => {
          return res(ctx.json([]))
        }
      )
    )

    render(<Lottery listing={closedListing} />)

    const header = await screen.findByText("Lottery")
    expect(header).toBeInTheDocument()

    fireEvent.click(screen.getByText("Run lottery"))
    expect(await screen.findByText("Confirmation needed")).toBeInTheDocument()
    expect(screen.getByText("5 unresolved duplicate sets.")).toBeInTheDocument()
    expect(screen.getByText("Run lottery without resolving duplicates")).toBeInTheDocument()
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
      rest.get("http://localhost:3100/applicationFlaggedSets/meta", (_req, res, ctx) => {
        return res(ctx.json({ totalCount: 5, totalPendingCount: 5 }))
      }),
      rest.get(
        "http://localhost:3100/lottery/lotteryActivityLog/Uvbk5qurpB2WI9V6WnNdH",
        (_req, res, ctx) => {
          return res(ctx.json([]))
        }
      )
    )

    const updatedListing = {
      ...closedListing,
      lotteryLastRunAt: new Date("September 6, 2025 8:15:00"),
      listingMultiselectQuestions: [],
    }
    render(<Lottery listing={updatedListing} />)

    const header = await screen.findByText("Lottery")
    expect(header).toBeInTheDocument()

    expect(
      screen.getByText("This file includes the lottery raw rank for all applications.")
    ).toBeInTheDocument()

    fireEvent.click(screen.getByText("Export"))
    expect(await screen.findAllByText("Export lottery data")).toHaveLength(2)

    expect(
      screen.getByText(
        "This data was generated from the lottery that was run on 09/06/2025 at 8:15 am.",
        {
          exact: false,
        }
      )
    ).toBeInTheDocument()
    expect(screen.getAllByText("Export")).toHaveLength(2)
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
      rest.get("http://localhost:3100/applicationFlaggedSets/meta", (_req, res, ctx) => {
        return res(ctx.json({ totalCount: 5, totalPendingCount: 5 }))
      }),
      rest.get(
        "http://localhost:3100/lottery/lotteryActivityLog/Uvbk5qurpB2WI9V6WnNdH",
        (_req, res, ctx) => {
          return res(ctx.json([]))
        }
      )
    )

    const updatedListing = {
      ...closedListing,
      lotteryLastRunAt: new Date("September 6, 2025 8:15:00"),
      listingMultiselectQuestions: [{ multiselectQuestions: {} } as ListingMultiselectQuestion],
    }
    render(<Lottery listing={updatedListing} />)

    const header = await screen.findByText("Lottery")
    expect(header).toBeInTheDocument()

    expect(
      screen.getByText(
        "This file includes the lottery raw rank and preferences data for all applications."
      )
    ).toBeInTheDocument()

    fireEvent.click(screen.getByText("Export"))
    expect(await screen.findAllByText("Export lottery data")).toHaveLength(2)

    expect(
      screen.getByText(
        "This data was generated from the lottery that was run on 09/06/2025 at 8:15 am.",
        {
          exact: false,
        }
      )
    ).toBeInTheDocument()
    expect(screen.getAllByText("Export")).toHaveLength(2)
  })

  it("should show export with info modal if user is a partner", async () => {
    mockNextRouter({ id: "Uvbk5qurpB2WI9V6WnNdH" })
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(
          ctx.json({
            id: "user1",
            userRoles: { isAdmin: false, isPartner: true },
            listings: [{ id: "Uvbk5qurpB2WI9V6WnNdH" }],
          })
        )
      }),
      rest.post("http://localhost:3100/auth/token", (_req, res, ctx) => {
        return res(ctx.json(""))
      }),
      rest.get("http://localhost:3100/applicationFlaggedSets/meta", (_req, res, ctx) => {
        return res(ctx.json({ totalCount: 5, totalPendingCount: 5 }))
      }),
      rest.get(
        "http://localhost:3100/lottery/lotteryActivityLog/Uvbk5qurpB2WI9V6WnNdH",
        (_req, res, ctx) => {
          return res(ctx.json([]))
        }
      )
    )

    const updatedListing = {
      ...listing,
      lotteryLastRunAt: new Date("September 6, 2025 8:15:00"),
      lotteryStatus: LotteryStatusEnum.publishedToPublic,
    }
    render(<Lottery listing={updatedListing} />)

    const header = await screen.findByText("Lottery")
    expect(header).toBeInTheDocument()

    fireEvent.click(screen.getByText("Export"))
    expect(await screen.findAllByText("Export lottery data")).toHaveLength(2)

    expect(
      screen.getByText(
        "This data was generated from the lottery that was run on 09/06/2025 at 8:15 am.",
        {
          exact: false,
        }
      )
    ).toBeInTheDocument()

    expect(screen.getAllByText("Export")).toHaveLength(2)
  })

  it("should show export with terms modal if user is a partner when enableExportTerms is true", async () => {
    mockNextRouter({ id: "Uvbk5qurpB2WI9V6WnNdH" })
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(
          ctx.json({
            id: "user1",
            userRoles: { isAdmin: false, isPartner: true },
            listings: [{ id: "Uvbk5qurpB2WI9V6WnNdH" }],
            jurisdictions: [
              {
                id: "id",
                name: "Bloomington",
                featureFlags: [{ name: FeatureFlagEnum.enableExportTerms, active: true }],
              },
            ],
          })
        )
      }),
      rest.post("http://localhost:3100/auth/token", (_req, res, ctx) => {
        return res(ctx.json(""))
      }),
      rest.get("http://localhost:3100/applicationFlaggedSets/meta", (_req, res, ctx) => {
        return res(ctx.json({ totalCount: 5, totalPendingCount: 5 }))
      }),
      rest.get(
        "http://localhost:3100/lottery/lotteryActivityLog/Uvbk5qurpB2WI9V6WnNdH",
        (_req, res, ctx) => {
          return res(ctx.json([]))
        }
      )
    )

    const updatedListing = {
      ...listing,
      lotteryLastRunAt: new Date("September 6, 2025 8:15:00"),
      lotteryStatus: LotteryStatusEnum.publishedToPublic,
    }
    render(<Lottery listing={updatedListing} />)

    const header = await screen.findByText("Lottery")
    expect(header).toBeInTheDocument()

    fireEvent.click(screen.getByText("Export"))
    expect(await screen.findAllByText("Export lottery data")).toHaveLength(2)

    expect(
      screen.getByText(
        "This data was generated from the lottery that was run on 09/06/2025 at 8:15 am.",
        {
          exact: false,
        }
      )
    ).toBeInTheDocument()

    expect(
      screen.getByText("You must accept the Terms of Use before exporting this data.")
    ).toBeInTheDocument()

    expect(screen.getAllByText("Export")).toHaveLength(2)
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
      rest.get("http://localhost:3100/applicationFlaggedSets/meta", (_req, res, ctx) => {
        return res(ctx.json({ totalCount: 5, totalPendingCount: 5 }))
      }),
      rest.get(
        "http://localhost:3100/lottery/lotteryActivityLog/Uvbk5qurpB2WI9V6WnNdH",
        (_req, res, ctx) => {
          return res(ctx.json([]))
        }
      )
    )

    const updatedListing = {
      ...closedListing,
      lotteryStatus: LotteryStatusEnum.ran,
    }

    render(<Lottery listing={updatedListing} />)

    const header = await screen.findByText("Lottery")
    expect(header).toBeInTheDocument()

    expect(screen.getByText("No lottery data")).toBeInTheDocument()
    expect(screen.queryByText("Publish")).not.toBeInTheDocument()
    expect(screen.queryByText("Run lottery")).not.toBeInTheDocument()
    expect(screen.queryByText("Release lottery")).not.toBeInTheDocument()
  })

  it("should not show publish button if in released to partners state as a jurisdictional admin", async () => {
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
      rest.get("http://localhost:3100/applicationFlaggedSets/meta", (_req, res, ctx) => {
        return res(ctx.json({ totalCount: 5, totalPendingCount: 5 }))
      }),
      rest.get(
        "http://localhost:3100/lottery/lotteryActivityLog/Uvbk5qurpB2WI9V6WnNdH",
        (_req, res, ctx) => {
          return res(ctx.json([]))
        }
      )
    )

    const updatedListing = {
      ...closedListing,
      lotteryStatus: LotteryStatusEnum.releasedToPartners,
    }

    render(<Lottery listing={updatedListing} />)

    const header = await screen.findByText("Lottery")
    expect(header).toBeInTheDocument()
    expect(screen.getByText("Publish lottery data")).toBeInTheDocument()
    expect(screen.queryByText("Publish")).not.toBeInTheDocument()
  })

  it("should show export if in published to public state as a partner", async () => {
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
      rest.get("http://localhost:3100/applicationFlaggedSets/meta", (_req, res, ctx) => {
        return res(ctx.json({ totalCount: 5, totalPendingCount: 5 }))
      }),
      rest.get(
        "http://localhost:3100/lottery/lotteryActivityLog/Uvbk5qurpB2WI9V6WnNdH",
        (_req, res, ctx) => {
          return res(ctx.json([]))
        }
      )
    )

    const updatedListing = {
      ...closedListing,
      lotteryStatus: LotteryStatusEnum.publishedToPublic,
    }

    render(<Lottery listing={updatedListing} />)

    const header = await screen.findByText("Lottery")
    expect(header).toBeInTheDocument()

    expect(screen.getByText("Export lottery data")).toBeInTheDocument()
    expect(screen.getByText("Export")).toBeInTheDocument()
  })

  it("should show lottery expired state as a partner", async () => {
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
      rest.get("http://localhost:3100/applicationFlaggedSets/meta", (_req, res, ctx) => {
        return res(ctx.json({ totalCount: 5, totalPendingCount: 5 }))
      }),
      rest.get(
        "http://localhost:3100/lottery/lotteryActivityLog/Uvbk5qurpB2WI9V6WnNdH",
        (_req, res, ctx) => {
          return res(ctx.json([]))
        }
      )
    )

    const updatedListing = {
      ...closedListing,
      lotteryStatus: LotteryStatusEnum.expired,
    }

    render(<Lottery listing={updatedListing} />)

    const header = await screen.findByText("Lottery")
    expect(header).toBeInTheDocument()

    expect(screen.getByText("No lottery data")).toBeInTheDocument()
    expect(
      screen.getByText(
        "Lottery data has expired for this listing and is no longer available for export."
      )
    ).toBeInTheDocument()
    expect(screen.queryByText("Publish")).not.toBeInTheDocument()
    expect(screen.queryByText("Run lottery")).not.toBeInTheDocument()
    expect(screen.queryByText("Release lottery")).not.toBeInTheDocument()
  })

  it("should show history log", async () => {
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
      rest.get("http://localhost:3100/applicationFlaggedSets/meta", (_req, res, ctx) => {
        return res(ctx.json({ totalCount: 5, totalPendingCount: 5 }))
      }),
      rest.get(
        "http://localhost:3100/lottery/lotteryActivityLog/Uvbk5qurpB2WI9V6WnNdH",
        (_req, res, ctx) => {
          return res(
            ctx.json([
              { status: "closed", name: null, logDate: new Date("September 6, 2025 8:15:00") },
              { status: "ran", name: "Admin One", logDate: new Date("September 6, 2025 9:00:00") },
              {
                status: "rerun",
                name: "Admin Two",
                logDate: new Date("September 6, 2025 9:30:00"),
              },
              {
                status: "releasedToPartners",
                name: "Admin Three",
                logDate: new Date("September 7, 2025 13:00:00"),
              },
              {
                status: "retracted",
                name: "Admin Four",
                logDate: new Date("September 7, 2025 14:00:00"),
              },
              {
                status: "releasedToPartners",
                name: "Admin Five",
                logDate: new Date("September 7, 2025 15:00:00"),
              },
              {
                status: "publishedToPublic",
                name: "Partner One",
                logDate: new Date("September 8, 2025 9:00:00"),
              },
            ])
          )
        }
      )
    )

    const updatedListing = {
      ...closedListing,
      lotteryStatus: LotteryStatusEnum.ran,
    }

    render(<Lottery listing={updatedListing} />)

    const header = await screen.findByText("Lottery")
    expect(header).toBeInTheDocument()

    expect(screen.getByText("Listing closed")).toBeInTheDocument()
    expect(screen.getByText("by property")).toBeInTheDocument()
    expect(screen.getByText("September 6th, 2025 at 8:15 am")).toBeInTheDocument()
    expect(screen.getByText("Lottery was run")).toBeInTheDocument()
    expect(screen.getByText("by Admin One")).toBeInTheDocument()
    expect(screen.getByText("September 6th, 2025 at 9:00 am")).toBeInTheDocument()
    expect(screen.getByText("Lottery was re-run")).toBeInTheDocument()
    expect(screen.getByText("by Admin Two")).toBeInTheDocument()
    expect(screen.getByText("September 6th, 2025 at 9:30 am")).toBeInTheDocument()
    expect(screen.getAllByText("Lottery results released")).toHaveLength(2)
    expect(screen.getByText("by Admin Three")).toBeInTheDocument()
    expect(screen.getByText("September 7th, 2025 at 1:00 pm")).toBeInTheDocument()
    expect(screen.getByText("Lottery retracted")).toBeInTheDocument()
    expect(screen.getByText("by Admin Four")).toBeInTheDocument()
    expect(screen.getByText("September 7th, 2025 at 2:00 pm")).toBeInTheDocument()
    expect(screen.getByText("by Admin Five")).toBeInTheDocument()
    expect(screen.getByText("September 7th, 2025 at 3:00 pm")).toBeInTheDocument()
    expect(screen.getByText("Lottery results published to public")).toBeInTheDocument()
    expect(screen.getByText("by Partner One")).toBeInTheDocument()
    expect(screen.getByText("September 8th, 2025 at 9:00 am")).toBeInTheDocument()
  })
})
