import React from "react"
import { cleanup, fireEvent } from "@testing-library/react"
import { mockNextRouter, render, waitFor, within } from "../../testUtils"
import { AuthContext } from "@bloom-housing/shared-helpers"
import ApplicationsView, {
  ApplicationsIndexEnum,
} from "../../../src/components/account/ApplicationsView"
import { GenericRouter, NavigationContext } from "@bloom-housing/ui-components"
import { application, listing, user } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import {
  ApplicationsService,
  ListingsStatusEnum,
  LotteryStatusEnum,
  PublicAppsViewResponse,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { setupServer } from "msw/lib/node"
import { rest } from "msw"

const server = setupServer()

const mockRouter: GenericRouter = {
  pathname: "",
  asPath: "",
  back: jest.fn(),
  push(url: string) {
    this.pathname = url
    this.asPath = url
  },
}

beforeAll(() => {
  server.listen()
  window.scrollTo = jest.fn()
  mockNextRouter()
  process.env.showPublicLottery = "TRUE"
})

beforeEach(() => {
  mockRouter.push("")
})

afterEach(() => {
  server.resetHandlers()
  cleanup()
})

afterAll(() => {
  server.close()
})

function getApplications(openCount = 0, closedCount = 0, lotteryCount = 0): PublicAppsViewResponse {
  return {
    displayApplications: [
      ...(openCount
        ? Array(openCount).fill({
            ...application,
            listings: { ...listing, status: ListingsStatusEnum.active },
          })
        : []),
      ...(closedCount
        ? Array(closedCount).fill({
            ...application,
            listings: {
              ...listing,
              status: ListingsStatusEnum.pending,
              lotteryStatus: LotteryStatusEnum.publishedToPublic,
            },
          })
        : []),
      ...(lotteryCount
        ? Array(lotteryCount).fill({
            ...application,
            listings: { ...listing, status: ListingsStatusEnum.closed },
          })
        : []),
    ],
    applicationsCount: {
      total: openCount + closedCount + lotteryCount,
      lottery: lotteryCount,
      closed: closedCount,
      open: openCount,
    },
  }
}

describe("<ApplicationsView>", () => {
  it("should redirect to sign-in page for non logged user", async () => {
    render(
      <NavigationContext.Provider
        value={{
          router: mockRouter,
          LinkComponent: (props) => <a href={props.href}>{props.children}</a>,
        }}
      >
        <AuthContext.Provider
          value={{
            profile: undefined,
            initialStateLoaded: true,
          }}
        >
          <ApplicationsView filterType={ApplicationsIndexEnum.all} />
        </AuthContext.Provider>
      </NavigationContext.Provider>
    )

    await waitFor(() => expect(mockRouter.pathname).toEqual("/sign-in"))
  })

  it("should render the page with application fetching error", async () => {
    //eslint-disable-next-line @typescript-eslint/no-empty-function
    jest.spyOn(console, "error").mockImplementation(() => {})
    server.use(
      rest.get("http://localhost/api/adapter/applications/publicAppsView", (_req, res, ctx) => {
        return res(ctx.status(410))
      })
    )

    const { getByText, findByText } = render(
      <AuthContext.Provider
        value={{
          profile: { ...user, jurisdictions: [], listings: [] },
          applicationsService: new ApplicationsService(),
        }}
      >
        <ApplicationsView filterType={ApplicationsIndexEnum.all} />
      </AuthContext.Provider>
    )

    // Dashboard heading
    expect(getByText("My Applications", { selector: "h1" })).toBeInTheDocument()
    expect(
      getByText("See lottery dates and listings for properties for which you've applied")
    ).toBeInTheDocument()

    // Application section (Missing fallback component)
    expect(await findByText("Error fetching applications", { selector: "h2" })).toBeInTheDocument()
  })

  it("should render the page with no existing applications", async () => {
    server.use(
      rest.get("http://localhost/api/adapter/applications/publicAppsView", (_req, res, ctx) => {
        return res(ctx.json(getApplications()))
      })
    )
    const { getByTestId, getByText, findByText } = render(
      <AuthContext.Provider
        value={{
          profile: { ...user, jurisdictions: [], listings: [] },
          applicationsService: new ApplicationsService(),
        }}
      >
        <ApplicationsView filterType={ApplicationsIndexEnum.all} />
      </AuthContext.Provider>
    )

    // Dashboard heading
    expect(getByText("My Applications", { selector: "h1" })).toBeInTheDocument()
    expect(
      getByText("See lottery dates and listings for properties for which you've applied")
    ).toBeInTheDocument()

    // Application section (Missing fallback component)
    expect(
      await findByText("It looks like you haven't applied to any listings yet.")
    ).toBeInTheDocument()
    expect(await findByText("Browse Listings", { selector: "a" })).toBeInTheDocument()
    expect(await findByText("Browse Listings", { selector: "a" })).toHaveAttribute(
      "href",
      "/listings"
    )

    // Tab Panel
    const allApplicationsTab = getByTestId("total-applications-tab")
    expect(
      within(allApplicationsTab).getByText("All my applications", { selector: "span" })
    ).toBeInTheDocument()
    expect(within(allApplicationsTab).getByText("0")).toBeInTheDocument()

    const closedApplicationsTab = getByTestId("closed-applications-tab")
    expect(
      within(closedApplicationsTab).getByText("Applications closed", { selector: "span" })
    ).toBeInTheDocument()
    expect(within(closedApplicationsTab).getByText("0")).toBeInTheDocument()

    const openApplicationsTab = getByTestId("open-applications-tab")
    expect(
      within(openApplicationsTab).getByText("Accepting applications", { selector: "span" })
    ).toBeInTheDocument()
    expect(within(openApplicationsTab).getByText("0")).toBeInTheDocument()

    const lotteryTab = getByTestId("lottery-runs-tab")
    expect(within(lotteryTab).getByText("Lottery run", { selector: "span" })).toBeInTheDocument()
    expect(within(lotteryTab).getByText("0")).toBeInTheDocument()
  })

  it("should show the page with only proper applications count", async () => {
    server.use(
      rest.get("http://localhost/api/adapter/applications/publicAppsView", (_req, res, ctx) => {
        console.log(_req)
        return res(ctx.json(getApplications(1, 2, 3)))
      })
    )

    const { getByTestId, findAllByText, queryByText } = render(
      <AuthContext.Provider
        value={{
          profile: { ...user, jurisdictions: [], listings: [] },
          applicationsService: new ApplicationsService(),
        }}
      >
        <ApplicationsView filterType={ApplicationsIndexEnum.open} />
      </AuthContext.Provider>
    )

    expect(
      queryByText("It looks like you haven't applied to any listings yet.")
    ).not.toBeInTheDocument()

    expect(await findAllByText("View application", { selector: "a" })).toHaveLength(6)
    expect(await findAllByText("See Listing", { selector: "a" })).toHaveLength(6)

    const allApplicationsTab = getByTestId("total-applications-tab")
    expect(within(allApplicationsTab).getByText("6")).toBeInTheDocument()

    const closedApplicationsTab = getByTestId("closed-applications-tab")
    expect(within(closedApplicationsTab).getByText("2")).toBeInTheDocument()

    const openApplicationsTab = getByTestId("open-applications-tab")
    expect(within(openApplicationsTab).getByText("1")).toBeInTheDocument()

    const lotteryTab = getByTestId("lottery-runs-tab")
    expect(within(lotteryTab).getByText("3")).toBeInTheDocument()
  })

  describe("should navigate to filtered views on tab click", () => {
    beforeEach(() => {
      server.use(
        rest.get("http://localhost/api/adapter/applications/publicAppsView", (_req, res, ctx) => {
          console.log(_req)
          return res(ctx.json(getApplications(1, 1, 1)))
        })
      )
    })

    it("should navigate to all applications view", async () => {
      const { pushMock } = mockNextRouter()
      const { getByTestId, findAllByText } = render(
        <AuthContext.Provider
          value={{
            profile: { ...user, jurisdictions: [], listings: [] },
            applicationsService: new ApplicationsService(),
          }}
        >
          <ApplicationsView filterType={ApplicationsIndexEnum.open} />
        </AuthContext.Provider>
      )

      expect(await findAllByText("View application", { selector: "a" })).toHaveLength(3)
      expect(await findAllByText("See Listing", { selector: "a" })).toHaveLength(3)

      const allAplicationsTab = getByTestId("total-applications-tab")
      fireEvent.click(allAplicationsTab)
      await waitFor(() => {
        expect(pushMock).toHaveBeenCalledWith("/account/applications")
      })
    })

    it("should navigate to open application only view", async () => {
      const { pushMock } = mockNextRouter()
      const { getByTestId, findAllByText } = render(
        <AuthContext.Provider
          value={{
            profile: { ...user, jurisdictions: [], listings: [] },
            applicationsService: new ApplicationsService(),
          }}
        >
          <ApplicationsView filterType={ApplicationsIndexEnum.open} />
        </AuthContext.Provider>
      )

      expect(await findAllByText("View application", { selector: "a" })).toHaveLength(3)
      expect(await findAllByText("See Listing", { selector: "a" })).toHaveLength(3)

      const openApplicationsTab = getByTestId("open-applications-tab")
      fireEvent.click(openApplicationsTab)
      await waitFor(() => {
        expect(pushMock).toHaveBeenCalledWith("/account/applications/open")
      })
    })

    it("should navigate to closed application only view", async () => {
      const { pushMock } = mockNextRouter()
      const { getByTestId, findAllByText } = render(
        <AuthContext.Provider
          value={{
            profile: { ...user, jurisdictions: [], listings: [] },
            applicationsService: new ApplicationsService(),
          }}
        >
          <ApplicationsView filterType={ApplicationsIndexEnum.open} />
        </AuthContext.Provider>
      )

      expect(await findAllByText("View application", { selector: "a" })).toHaveLength(3)
      expect(await findAllByText("See Listing", { selector: "a" })).toHaveLength(3)

      const closedApplicationsTab = getByTestId("closed-applications-tab")
      fireEvent.click(closedApplicationsTab)
      await waitFor(() => {
        expect(pushMock).toHaveBeenCalledWith("/account/applications/closed")
      })
    })

    it("should navigate to lottery runs only view", async () => {
      const { pushMock } = mockNextRouter()
      const { getByTestId, findAllByText } = render(
        <AuthContext.Provider
          value={{
            profile: { ...user, jurisdictions: [], listings: [] },
            applicationsService: new ApplicationsService(),
          }}
        >
          <ApplicationsView filterType={ApplicationsIndexEnum.open} />
        </AuthContext.Provider>
      )

      expect(await findAllByText("View application", { selector: "a" })).toHaveLength(3)
      expect(await findAllByText("See Listing", { selector: "a" })).toHaveLength(3)

      const lotteryTab = getByTestId("lottery-runs-tab")
      fireEvent.click(lotteryTab)
      await waitFor(() => {
        expect(pushMock).toHaveBeenCalledWith("/account/applications/lottery")
      })
    })
  })
})
