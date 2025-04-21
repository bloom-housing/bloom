import React from "react"
import { cleanup } from "@testing-library/react"
import { mockNextRouter, render, waitFor, within, screen } from "../../testUtils"
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
import userEvent from "@testing-library/user-event"

const server = setupServer()
window.scrollTo = jest.fn()

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

function getApplications(
  openCount = 0,
  closedCount = 0,
  lotteryCount = 0,
  filterType = ApplicationsIndexEnum.all
): PublicAppsViewResponse {
  return {
    displayApplications: [
      ...(openCount &&
      (filterType === ApplicationsIndexEnum.all || filterType === ApplicationsIndexEnum.open)
        ? Array(openCount).fill({
            ...application,
            listings: { ...listing, status: ListingsStatusEnum.active },
          })
        : []),
      ...(closedCount &&
      (filterType === ApplicationsIndexEnum.all || filterType === ApplicationsIndexEnum.closed)
        ? Array(closedCount).fill({
            ...application,
            listings: {
              ...listing,
              status: ListingsStatusEnum.pending,
              lotteryStatus: LotteryStatusEnum.publishedToPublic,
            },
          })
        : []),
      ...(lotteryCount &&
      (filterType === ApplicationsIndexEnum.all || filterType === ApplicationsIndexEnum.lottery)
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

function renderApplicationsView(filterType = ApplicationsIndexEnum.all) {
  return render(
    <AuthContext.Provider
      value={{
        profile: { ...user, jurisdictions: [], listings: [] },
        applicationsService: new ApplicationsService(),
      }}
    >
      <ApplicationsView filterType={filterType} />
    </AuthContext.Provider>
  )
}

describe("<ApplicationsView>", () => {
  it("should redirect to sign-in page for non logged user", async () => {
    server.use(
      rest.get("http://localhost:3100/applications/publicAppsView", (_req, res) => {
        return res()
      })
    )

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
    server.use(
      rest.get("http://localhost:3100/applications/publicAppsView", (_req, res, ctx) => {
        return res(ctx.status(500)) // Return status code 500 to mock an server fetching error
      })
    )
    renderApplicationsView()

    // Dashboard heading
    expect(screen.getByRole("heading", { level: 1, name: /my applications/i })).toBeInTheDocument()
    expect(
      screen.getByText("See lottery dates and listings for properties for which you've applied")
    ).toBeInTheDocument()

    // Application section (Missing fallback component)
    expect(
      await screen.findByRole("heading", { level: 2, name: /error fetching applications/i })
    ).toBeInTheDocument()
  })

  describe("should render page with proper missing applications message", () => {
    it("should render the page without any existing applications", async () => {
      server.use(
        rest.get("http://localhost:3100/applications/publicAppsView", (_req, res, ctx) => {
          return res(ctx.json(getApplications()))
        })
      )

      renderApplicationsView()

      // Dashboard heading
      expect(
        screen.getByRole("heading", { level: 1, name: /my applications/i })
      ).toBeInTheDocument()
      expect(
        screen.getByText("See lottery dates and listings for properties for which you've applied")
      ).toBeInTheDocument()

      // Application section (Missing fallback component)
      expect(
        await screen.findByText("It looks like you haven't applied to any listings yet.")
      ).toBeInTheDocument()
      const browseListingsButton = await screen.findByRole("link", { name: /Browse Listings/i })
      expect(browseListingsButton).toBeInTheDocument()
      expect(browseListingsButton).toHaveAttribute("href", "/listings")

      // Tab Panel
      const allApplicationsTab = screen.getByTestId("total-applications-tab")
      expect(
        within(allApplicationsTab).getByText("All my applications", { selector: "span" })
      ).toBeInTheDocument()
      expect(within(allApplicationsTab).getByText("0")).toBeInTheDocument()

      const closedApplicationsTab = screen.getByTestId("closed-applications-tab")
      expect(
        within(closedApplicationsTab).getByText("Applications closed", { selector: "span" })
      ).toBeInTheDocument()
      expect(within(closedApplicationsTab).getByText("0")).toBeInTheDocument()

      const openApplicationsTab = screen.getByTestId("open-applications-tab")
      expect(
        within(openApplicationsTab).getByText("Accepting applications", { selector: "span" })
      ).toBeInTheDocument()
      expect(within(openApplicationsTab).getByText("0")).toBeInTheDocument()

      const lotteryTab = screen.getByTestId("lottery-runs-tab")
      expect(within(lotteryTab).getByText("Lottery run", { selector: "span" })).toBeInTheDocument()
      expect(within(lotteryTab).getByText("0")).toBeInTheDocument()
    })

    it("should show missing lottery runs when on the matching tab", async () => {
      server.use(
        rest.get("http://localhost:3100/applications/publicAppsView", (_req, res, ctx) => {
          return res(ctx.json(getApplications(2, 2, 0, ApplicationsIndexEnum.lottery)))
        })
      )

      renderApplicationsView(ApplicationsIndexEnum.lottery)
      // Tab Panel
      const allApplicationsTab = screen.getByTestId("total-applications-tab")
      expect(await within(allApplicationsTab).findByText("4")).toBeInTheDocument()

      const closedApplicationsTab = screen.getByTestId("closed-applications-tab")
      expect(within(closedApplicationsTab).getByText("2")).toBeInTheDocument()

      const openApplicationsTab = screen.getByTestId("open-applications-tab")
      expect(within(openApplicationsTab).getByText("2")).toBeInTheDocument()

      const lotteryTab = screen.getByTestId("lottery-runs-tab")
      expect(within(lotteryTab).getByText("0")).toBeInTheDocument()

      expect(
        await screen.findByText(
          "None of the listings you've applied to have released lottery results."
        )
      ).toBeInTheDocument()
    })

    it("should show missing closed application when on the matching tab", async () => {
      server.use(
        rest.get("http://localhost:3100/applications/publicAppsView", (_req, res, ctx) => {
          return res(ctx.json(getApplications(2, 0, 2, ApplicationsIndexEnum.closed)))
        })
      )

      renderApplicationsView(ApplicationsIndexEnum.closed)
      // Tab Panel
      const allApplicationsTab = screen.getByTestId("total-applications-tab")
      expect(await within(allApplicationsTab).findByText("4")).toBeInTheDocument()

      const closedApplicationsTab = screen.getByTestId("closed-applications-tab")
      expect(within(closedApplicationsTab).getByText("0")).toBeInTheDocument()

      const openApplicationsTab = screen.getByTestId("open-applications-tab")
      expect(within(openApplicationsTab).getByText("2")).toBeInTheDocument()

      const lotteryTab = screen.getByTestId("lottery-runs-tab")
      expect(within(lotteryTab).getByText("2")).toBeInTheDocument()

      expect(
        await screen.findByText(
          "The listings you've applied to are either still accepting applications or already have lottery results posted."
        )
      ).toBeInTheDocument()
    })

    it("should show missing open application when on the matching tab", async () => {
      server.use(
        rest.get("http://localhost:3100/applications/publicAppsView", (_req, res, ctx) => {
          return res(ctx.json(getApplications(0, 2, 2, ApplicationsIndexEnum.open)))
        })
      )

      renderApplicationsView(ApplicationsIndexEnum.open)
      // Tab Panel
      const allApplicationsTab = screen.getByTestId("total-applications-tab")
      expect(await within(allApplicationsTab).findByText("4")).toBeInTheDocument()

      const closedApplicationsTab = screen.getByTestId("closed-applications-tab")
      expect(within(closedApplicationsTab).getByText("2")).toBeInTheDocument()

      const openApplicationsTab = screen.getByTestId("open-applications-tab")
      expect(within(openApplicationsTab).getByText("0")).toBeInTheDocument()

      const lotteryTab = screen.getByTestId("lottery-runs-tab")
      expect(within(lotteryTab).getByText("2")).toBeInTheDocument()

      expect(
        await screen.findByText(
          "None of the listings you've applied to are still accepting applications."
        )
      ).toBeInTheDocument()
    })
  })

  it("should show the page with only proper applications count", async () => {
    server.use(
      rest.get("http://localhost:3100/applications/publicAppsView", (_req, res, ctx) => {
        return res(ctx.json(getApplications(1, 2, 3)))
      })
    )
    renderApplicationsView(ApplicationsIndexEnum.open)

    expect(
      screen.queryByText("It looks like you haven't applied to any listings yet.")
    ).not.toBeInTheDocument()

    // TODO: in core we an "view application" for closed listings but not in Doorway. Is that intentional
    expect(await screen.findAllByRole("link", { name: /view application/i })).toHaveLength(3)
    expect(await screen.findAllByRole("link", { name: /see listing/i })).toHaveLength(6)

    const allApplicationsTab = screen.getByTestId("total-applications-tab")
    expect(within(allApplicationsTab).getByText("6")).toBeInTheDocument()

    const closedApplicationsTab = screen.getByTestId("closed-applications-tab")
    expect(within(closedApplicationsTab).getByText("2")).toBeInTheDocument()

    const openApplicationsTab = screen.getByTestId("open-applications-tab")
    expect(within(openApplicationsTab).getByText("1")).toBeInTheDocument()

    const lotteryTab = screen.getByTestId("lottery-runs-tab")
    expect(within(lotteryTab).getByText("3")).toBeInTheDocument()
  })

  describe("should navigate to filtered views on tab click", () => {
    beforeEach(() => {
      server.use(
        rest.get("http://localhost:3100/applications/publicAppsView", (_req, res, ctx) => {
          return res(ctx.json(getApplications(1, 1, 1)))
        })
      )
    })

    it("should navigate to all applications view", async () => {
      const { pushMock } = mockNextRouter()
      renderApplicationsView()

      expect(await screen.findAllByRole("link", { name: /view application/i })).toHaveLength(2)
      expect(await screen.findAllByRole("link", { name: /see listing/i })).toHaveLength(3)

      const allAplicationsTab = screen.getByTestId("total-applications-tab")
      await userEvent.click(allAplicationsTab)
      await waitFor(() => {
        expect(pushMock).toHaveBeenCalledWith("/account/applications")
      })
    })

    it("should navigate to open application only view", async () => {
      const { pushMock } = mockNextRouter()
      renderApplicationsView()

      expect(await screen.findAllByRole("link", { name: /view application/i })).toHaveLength(2)
      expect(await screen.findAllByRole("link", { name: /see listing/i })).toHaveLength(3)

      const openApplicationsTab = screen.getByTestId("open-applications-tab")
      await userEvent.click(openApplicationsTab)
      await waitFor(() => {
        expect(pushMock).toHaveBeenCalledWith("/account/applications/open")
      })
    })

    it("should navigate to closed application only view", async () => {
      const { pushMock } = mockNextRouter()
      renderApplicationsView()

      expect(await screen.findAllByRole("link", { name: /view application/i })).toHaveLength(2)
      expect(await screen.findAllByRole("link", { name: /see listing/i })).toHaveLength(3)

      const closedApplicationsTab = screen.getByTestId("closed-applications-tab")
      await userEvent.click(closedApplicationsTab)
      await waitFor(() => {
        expect(pushMock).toHaveBeenCalledWith("/account/applications/closed")
      })
    })

    it("should navigate to lottery runs only view", async () => {
      const { pushMock } = mockNextRouter()
      renderApplicationsView()

      expect(await screen.findAllByRole("link", { name: /view application/i })).toHaveLength(2)
      expect(await screen.findAllByRole("link", { name: /see listing/i })).toHaveLength(3)

      const lotteryTab = screen.getByTestId("lottery-runs-tab")
      await userEvent.click(lotteryTab)
      await waitFor(() => {
        expect(pushMock).toHaveBeenCalledWith("/account/applications/lottery")
      })
    })
  })
})
