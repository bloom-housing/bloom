import React from "react"
import { rest } from "msw"
import { setupServer } from "msw/node"
import { AuthProvider, ConfigProvider } from "@bloom-housing/shared-helpers"
import {
  FeatureFlagEnum,
  Listing,
  ListingsStatusEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { application, listing, user } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { fireEvent, screen } from "@testing-library/react"
import { mockNextRouter, render } from "../../../testUtils"
import ApplicationsList from "../../../../src/pages/listings/[id]/applications/index"

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
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(
          ctx.json({
            ...user,
            listings: [{ id: listing.id }],
            jurisdictions: [
              {
                id: "id",
                name: "Bloomington",
                featureFlags: [],
              },
            ],
          })
        )
      }),
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
    render(
      <ConfigProvider apiUrl={"http://localhost:3100"}>
        <AuthProvider>
          <ApplicationsList />
        </AuthProvider>
      </ConfigProvider>
    )

    const error = await screen.findByText("An error has occurred.")
    expect(error).toBeInTheDocument()
  })

  it("should render applications table when data is returned", async () => {
    mockNextRouter({ id: "Uvbk5qurpB2WI9V6WnNdH" })
    document.cookie = "access-token-available=True"

    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(
          ctx.json({
            ...user,
            listings: [{ id: listing.id }],
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
    render(
      <ConfigProvider apiUrl={"http://localhost:3100"}>
        <AuthProvider>
          <ApplicationsList />
        </AuthProvider>
      </ConfigProvider>
    )

    const header = await screen.findByText("Partners Portal")
    expect(header).toBeInTheDocument()

    expect(screen.getAllByText("Archer Studios").length).toBeGreaterThan(0)
    expect(screen.getByText("Add application")).toBeInTheDocument()
    expect(screen.getByText("Export")).toBeInTheDocument()
    expect(screen.getAllByText("All applications").length).toBeGreaterThan(0)

    expect(screen.getByText("Application type")).toBeInTheDocument()
    expect(screen.getByText("Electronic")).toBeInTheDocument()
    expect(screen.getByText("First name")).toBeInTheDocument()
    expect(screen.getByText("Applicant First")).toBeInTheDocument()
    expect(screen.getByText("Last name")).toBeInTheDocument()
    expect(screen.getByText("Applicant Last")).toBeInTheDocument()
    expect(screen.getByText("Household size")).toBeInTheDocument()
    expect(screen.getByText("2")).toBeInTheDocument()
    expect(screen.getByText("Declared annual income")).toBeInTheDocument()
    expect(screen.getByText("$40,000")).toBeInTheDocument()
    expect(screen.getByText("Subsidy or voucher")).toBeInTheDocument()
    expect(screen.getByText("Primary DOB")).toBeInTheDocument()
    expect(screen.getByText("10/10/1990")).toBeInTheDocument()
    expect(screen.getByText("Phone")).toBeInTheDocument()
    expect(screen.getByText("(123) 123-1231")).toBeInTheDocument()
    expect(screen.getByText("Phone type")).toBeInTheDocument()
    expect(screen.getByText("Home")).toBeInTheDocument()
    expect(screen.getByText("Additional phone")).toBeInTheDocument()
    expect(screen.getByText("(456) 456-4564")).toBeInTheDocument()
    expect(screen.getByText("Addtl. phone type")).toBeInTheDocument()
    expect(screen.getByText("Cell")).toBeInTheDocument()
    expect(screen.getByText("Work in region")).toBeInTheDocument()
    expect(screen.getByText("Residence street address")).toBeInTheDocument()
    expect(screen.getByText("3200 Old Faithful Inn Rd")).toBeInTheDocument()
    expect(screen.getByText("Residence city")).toBeInTheDocument()
    expect(screen.getByText("Yellowstone National Park")).toBeInTheDocument()
    expect(screen.getByText("Residence state")).toBeInTheDocument()
    expect(screen.getByText("WY")).toBeInTheDocument()
    expect(screen.getByText("Residence zip")).toBeInTheDocument()
    expect(screen.getByText("82190")).toBeInTheDocument()
    expect(screen.getByText("Mailing street address")).toBeInTheDocument()
    expect(screen.getByText("1000 US-36")).toBeInTheDocument()
    expect(screen.getByText("Mailing city")).toBeInTheDocument()
    expect(screen.getByText("Estes Park")).toBeInTheDocument()
    expect(screen.getByText("Mailing state")).toBeInTheDocument()
    expect(screen.getByText("CO")).toBeInTheDocument()
    expect(screen.getByText("Mailing zip")).toBeInTheDocument()
    expect(screen.getByText("80517")).toBeInTheDocument()
    expect(screen.getByText("Work street address")).toBeInTheDocument()
    expect(screen.getByText("9035 Village Dr")).toBeInTheDocument()
    expect(screen.getByText("Work city")).toBeInTheDocument()
    expect(screen.getByText("Yosemite Valley")).toBeInTheDocument()
    expect(screen.getByText("Work state")).toBeInTheDocument()
    expect(screen.getByText("CA")).toBeInTheDocument()
    expect(screen.getByText("Work zip")).toBeInTheDocument()
    expect(screen.getByText("95389")).toBeInTheDocument()
    expect(screen.getByText("Alt contact first name")).toBeInTheDocument()
    expect(screen.getByText("Alternate First")).toBeInTheDocument()
    expect(screen.getByText("Alt contact last name")).toBeInTheDocument()
    expect(screen.getByText("Alternate Last")).toBeInTheDocument()
    expect(screen.getByText("Alt contact agency")).toBeInTheDocument()
    expect(screen.getByText("Alternate Agency")).toBeInTheDocument()
    expect(screen.getByText("Alt contact email")).toBeInTheDocument()
    expect(screen.getByText("alternate@email.com")).toBeInTheDocument()
    expect(screen.getByText("Alt contact phone")).toBeInTheDocument()
    expect(screen.getByText("(789) 012-3456")).toBeInTheDocument()
    expect(screen.getByText("Alt contact street address")).toBeInTheDocument()
    expect(screen.getByText("25 Visitor Center Rd")).toBeInTheDocument()
    expect(screen.getByText("Alt contact city")).toBeInTheDocument()
    expect(screen.getByText("Bay Harbor")).toBeInTheDocument()
    expect(screen.getByText("Alt contact state")).toBeInTheDocument()
    expect(screen.getByText("ME")).toBeInTheDocument()
    expect(screen.getByText("Alt contact zip")).toBeInTheDocument()
    expect(screen.getByText("04609")).toBeInTheDocument()
    expect(screen.getByText("First name HH:1")).toBeInTheDocument()
    expect(screen.getByText("Household First")).toBeInTheDocument()
    expect(screen.getByText("Last name HH:1")).toBeInTheDocument()
    expect(screen.getByText("Household Last")).toBeInTheDocument()
    expect(screen.getByText("Household DOB HH:1")).toBeInTheDocument()
    expect(screen.getByText("11/25/1966")).toBeInTheDocument()
    expect(screen.getByText("Relationship HH:1")).toBeInTheDocument()
    expect(screen.getByText("Friend")).toBeInTheDocument()
    expect(screen.getByText("Same address as primary HH:1")).toBeInTheDocument()
    expect(screen.getByText("Work in region HH:1")).toBeInTheDocument()
    expect(screen.getAllByText("Yes")).toHaveLength(3)
    expect(screen.getByText("incomeVoucher")).toBeInTheDocument()
    expect(screen.getByText("Flagged as duplicate")).toBeInTheDocument()
    expect(screen.getByText("Marked as duplicate")).toBeInTheDocument()
    expect(screen.getByText("No")).toBeInTheDocument()
  })

  it("should directly open application add page when add application is clicked while listing is open", async () => {
    const { pushMock } = mockNextRouter({ id: "Uvbk5qurpB2WI9V6WnNdH" })
    document.cookie = "access-token-available=True"

    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(
          ctx.json({
            ...user,
            listings: [{ id: listing.id }],
            jurisdictions: [
              {
                id: "id",
                name: "Bloomington",
                featureFlags: [],
              },
            ],
          })
        )
      }),
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
    render(
      <ConfigProvider apiUrl={"http://localhost:3100"}>
        <AuthProvider>
          <ApplicationsList />
        </AuthProvider>
      </ConfigProvider>
    )

    const header = await screen.findByText("Partners Portal")
    expect(header).toBeInTheDocument()

    fireEvent.click(screen.getByText("Add application"))
    expect(pushMock).toHaveBeenCalledWith("/listings/Uvbk5qurpB2WI9V6WnNdH/applications/add")
  })

  it("should open confirmation modal when application add is clicked while listing is closed", async () => {
    const { pushMock } = mockNextRouter({ id: "Uvbk5qurpB2WI9V6WnNdH" })
    document.cookie = "access-token-available=True"

    const closedListing: Listing = { ...listing, status: ListingsStatusEnum.closed }
    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(
          ctx.json({
            ...user,
            listings: [{ id: listing.id }],
            jurisdictions: [
              {
                id: "id",
                name: "Bloomington",
                featureFlags: [],
              },
            ],
          })
        )
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
      rest.get("http://localhost:3100/applicationFlaggedSets", (_req, res, ctx) => {
        return res(ctx.json({ items: [], meta: { totalItems: 0, totalPages: 0 } }))
      }),
      rest.get("http://localhost/api/adapter/applicationFlaggedSets/meta", (_req, res, ctx) => {
        return res(ctx.json({ totalCount: 1 }))
      })
    )
    render(
      <ConfigProvider apiUrl={"http://localhost:3100"}>
        <AuthProvider>
          <ApplicationsList />
        </AuthProvider>
      </ConfigProvider>
    )

    const header = await screen.findByText("Partners Portal")
    expect(header).toBeInTheDocument()

    fireEvent.click(screen.getByText("Add application"))
    const modalHeader = await screen.findByText("Confirmation needed")
    expect(modalHeader).toBeInTheDocument()
    expect(pushMock).not.toHaveBeenCalledWith("/listings/Uvbk5qurpB2WI9V6WnNdH/applications/add")
  })

  it("should show export with terms modal when enableExportTerms is true", async () => {
    mockNextRouter({ id: "Uvbk5qurpB2WI9V6WnNdH" })
    document.cookie = "access-token-available=True"

    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(
          ctx.json({
            ...user,
            listings: [{ id: listing.id }],
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
      rest.get("http://localhost:3100/listings/Uvbk5qurpB2WI9V6WnNdH", (_req, res, ctx) => {
        return res(ctx.json(listing))
      }),
      rest.get("http://localhost:3100/applications", (_req, res, ctx) => {
        return res(ctx.json({ items: [application], meta: { totalItems: 1, totalPages: 1 } }))
      }),
      rest.get("http://localhost/api/adapter/applications", (_req, res, ctx) => {
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
    render(
      <ConfigProvider apiUrl={"http://localhost:3100"}>
        <AuthProvider>
          <ApplicationsList />
        </AuthProvider>
      </ConfigProvider>
    )

    const header = await screen.findByText("Partners Portal")
    expect(header).toBeInTheDocument()

    const exportButton = screen.getByRole("button", { name: "Export" })
    expect(exportButton).toBeInTheDocument()
    fireEvent.click(exportButton)

    expect(
      screen.getByText("You must accept the Terms of Use before exporting this data.")
    ).toBeInTheDocument()

    expect(screen.getAllByText("Export")).toHaveLength(2)
  })
})
