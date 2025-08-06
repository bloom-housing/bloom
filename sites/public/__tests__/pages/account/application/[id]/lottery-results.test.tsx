import React from "react"
import { setupServer } from "msw/lib/node"
import { mockNextRouter, render, screen } from "../../../../testUtils"
import LotteryResultsView from "../../../../../src/pages/account/application/[id]/lottery-results"
import { application, listing, user } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { rest } from "msw"
import { AuthContext } from "@bloom-housing/shared-helpers"
import {
  ApplicationsService,
  ListingsService,
  LotteryService,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"

const server = setupServer()

beforeAll(() => {
  mockNextRouter({ id: "application_1" })
  server.listen()
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})

const renderApplicationView = () => {
  return render(
    <AuthContext.Provider
      value={{
        profile: {
          ...user,
          listings: [],
          jurisdictions: [],
        },
        applicationsService: new ApplicationsService(),
        listingsService: new ListingsService(),
        lotteryService: new LotteryService(),
      }}
    >
      <LotteryResultsView />
    </AuthContext.Provider>
  )
}

describe("Listing Lottery Results View", () => {
  it("should render the lottery details", async () => {
    server.use(
      rest.get("http://localhost:3100/applications/application_1", (_req, res, ctx) => {
        return res(
          ctx.json({
            ...application,
            contactPreferences: ["email"],
            accessibility: {
              createdAt: new Date(),
              updatedAt: new Date(),
              id: "accessibility_id",
              mobility: true,
              vision: true,
              hearing: true,
            },
          })
        )
      }),
      rest.get("http://localhost/api/adapter/listings/Uvbk5qurpB2WI9V6WnNdH", (_req, res, ctx) => {
        return res(ctx.json({ ...listing, unitsAvailable: 1 }))
      }),
      rest.get(
        "http://localhost/api/adapter/lottery/publicLotteryResults/application_1",
        (_req, res, ctx) => {
          return res(
            ctx.json([
              {
                ordinal: 5,
              },
              {
                multiselectQuestionId: "pref_id_2",
                ordinal: 10,
              },
              {
                multiselectQuestionId: "pref_id_1",
                ordinal: 15,
              },
            ])
          )
        }
      ),
      rest.get(
        "http://localhost/api/adapter/lottery/lotteryTotals/Uvbk5qurpB2WI9V6WnNdH",
        (_req, res, ctx) => {
          return res(
            ctx.json([
              {
                total: 99999,
              },
              {
                multiselectQuestionId: "pref_id_2",
                total: 98765,
              },
              {
                multiselectQuestionId: "pref_id_1",
                total: 12345,
              },
            ])
          )
        }
      )
    )

    const { container } = renderApplicationView()

    // Listing heading
    expect(
      await screen.findByRole("heading", { level: 1, name: /archer studios/i })
    ).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /view the original listing/i })).toBeInTheDocument()

    expect(
      await screen.findByRole("heading", { level: 2, name: /here are your lottery results/i })
    ).toBeInTheDocument()
    expect(screen.getByText(/99999 applications were submitted for 1 unit/i)).toBeInTheDocument()
    expect(
      await screen.findByRole("heading", { level: 3, name: /your raw rank/i })
    ).toBeInTheDocument()
    expect(screen.getByText(/^5$/)).toBeInTheDocument()
    expect(screen.getByText(/99999 applications were submitted for 1 unit/i)).toBeInTheDocument()

    expect(screen.getByText(/Your lottery preference\(s\)/))
    expect(screen.getByText(/^Preference 1/i)).toBeInTheDocument()
    expect(screen.getAllByText(/^Out of 12345 applicants on this list$/i).length).toStrictEqual(1)

    expect(screen.getByText(/^Preference 2/i)).toBeInTheDocument()
    expect(screen.getAllByText(/^Out of 98765 applicants on this list$/i).length).toStrictEqual(1)

    // Normally we don't want to query DOM elements directly, but this is to verify the sort order:
    expect(
      Array.from(container.querySelectorAll(".rank-number")).map((el) => el.textContent)
    ).toEqual(["#15", "#10"])
  })

  it("should show error messaging when a network request fails", async () => {
    // Only provide one initial response, then "fail" with a 500
    server.use(
      rest.get("http://localhost:3100/applications/application_1", (_req, res, ctx) => {
        return res(
          ctx.json({
            ...application,
            contactPreferences: ["email"],
            accessibility: {
              createdAt: new Date(),
              updatedAt: new Date(),
              id: "accessibility_id",
              mobility: true,
              vision: true,
              hearing: true,
            },
          })
        )
      }),
      rest.get("http://localhost/api/adapter/listings/Uvbk5qurpB2WI9V6WnNdH", (_req, res, ctx) => {
        return res(ctx.status(500))
      })
    )

    renderApplicationView()

    // Listing heading is an error
    expect(await screen.findByRole("heading", { level: 1, name: /error/i })).toBeInTheDocument()
    expect(screen.getByText(/No application with that ID exists/i)).toBeInTheDocument()
  })
})
