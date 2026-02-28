import React from "react"
import { cleanup } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { mockNextRouter, render, waitFor, within, screen } from "../../testUtils"
import { AuthContext, MessageContext } from "@bloom-housing/shared-helpers"
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
  ApplicationStatusEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { setupServer } from "msw/lib/node"
import { rest } from "msw"

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
  const items = [
    ...(openCount &&
    (filterType === ApplicationsIndexEnum.all || filterType === ApplicationsIndexEnum.open)
      ? Array.from({ length: openCount }).map(() => ({
          ...application,
          listings: { ...listing, status: ListingsStatusEnum.active },
        }))
      : []),
    ...(closedCount &&
    (filterType === ApplicationsIndexEnum.all || filterType === ApplicationsIndexEnum.closed)
      ? Array.from({ length: closedCount }).map(() => ({
          ...application,
          listings: {
            ...listing,
            status: ListingsStatusEnum.pending,
            lotteryStatus: LotteryStatusEnum.publishedToPublic,
          },
        }))
      : []),
    ...(lotteryCount &&
    (filterType === ApplicationsIndexEnum.all || filterType === ApplicationsIndexEnum.lottery)
      ? Array.from({ length: lotteryCount }).map(() => ({
          ...application,
          listings: { ...listing, status: ListingsStatusEnum.closed },
        }))
      : []),
  ]
  const itemCount = items.length
  const itemsPerPage = 10
  const totalPages = itemCount ? Math.ceil(itemCount / itemsPerPage) : 0
  return {
    items,
    applicationsCount: {
      total: openCount + closedCount + lotteryCount,
      lottery: lotteryCount,
      closed: closedCount,
      open: openCount,
    },
    meta: {
      currentPage: 1,
      itemCount,
      itemsPerPage,
      totalItems: itemCount,
      totalPages,
    },
  }
}

function renderApplicationsView(
  filterType = ApplicationsIndexEnum.all,
  enableApplicationStatus = false,
  profileOverrides = {},
  messageContextOverrides = {}
) {
  return render(
    <MessageContext.Provider
      value={{
        addToast: jest.fn(),
        toastMessagesRef: { current: [] },
        ...messageContextOverrides,
      }}
    >
      <AuthContext.Provider
        value={{
          profile: { ...user, jurisdictions: [], listings: [], ...profileOverrides },
          applicationsService: new ApplicationsService(),
        }}
      >
        <ApplicationsView
          filterType={filterType}
          enableApplicationStatus={enableApplicationStatus}
        />
      </AuthContext.Provider>
    </MessageContext.Provider>
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
    const addToast = jest.fn()

    server.use(
      rest.get("http://localhost:3100/applications/publicAppsView", (_req, res, ctx) => {
        return res(ctx.status(500)) // Return status code 500 to mock an server fetching error
      })
    )
    renderApplicationsView(ApplicationsIndexEnum.all, false, {}, { addToast })

    // Dashboard heading
    expect(screen.getByRole("heading", { level: 1, name: /my applications/i })).toBeInTheDocument()
    expect(
      screen.getByText("See listings for properties for which you’ve applied.")
    ).toBeInTheDocument()

    expect(
      await screen.findByRole("heading", { level: 2, name: /error fetching applications/i })
    ).toBeInTheDocument()
    await waitFor(() => {
      expect(addToast).toHaveBeenCalledWith(expect.stringMatching(/error fetching applications/i), {
        variant: "alert",
      })
    })
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
        screen.getByText("See listings for properties for which you’ve applied.")
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
        within(closedApplicationsTab).getByText("Closed applications", { selector: "span" })
      ).toBeInTheDocument()
      expect(within(closedApplicationsTab).getByText("0")).toBeInTheDocument()

      const openApplicationsTab = screen.getByTestId("open-applications-tab")
      expect(
        within(openApplicationsTab).getByText("Open applications", { selector: "span" })
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

    expect(await screen.findAllByRole("link", { name: /view application/i })).toHaveLength(6)
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

  it("should show pagination controls and navigate between pages", async () => {
    const { pushMock } = mockNextRouter({ page: "1" })
    server.use(
      rest.get("http://localhost:3100/applications/publicAppsView", (_req, res, ctx) => {
        return res(ctx.json(getApplications(12, 0, 0)))
      })
    )

    renderApplicationsView(ApplicationsIndexEnum.all)

    expect(await screen.findByText(/Page 1 of 2/i)).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: /previous/i })).not.toBeInTheDocument()

    const nextButton = screen.getByRole("button", { name: /next/i })
    await userEvent.click(nextButton)
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith({
        pathname: "/",
        query: "page=2",
      })
    })
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

      expect(await screen.findAllByRole("link", { name: /view application/i })).toHaveLength(3)
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

      expect(await screen.findAllByRole("link", { name: /view application/i })).toHaveLength(3)
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

      expect(await screen.findAllByRole("link", { name: /view application/i })).toHaveLength(3)
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

      expect(await screen.findAllByRole("link", { name: /view application/i })).toHaveLength(3)
      expect(await screen.findAllByRole("link", { name: /see listing/i })).toHaveLength(3)

      const lotteryTab = screen.getByTestId("lottery-runs-tab")
      await userEvent.click(lotteryTab)
      await waitFor(() => {
        expect(pushMock).toHaveBeenCalledWith("/account/applications/lottery")
      })
    })
  })

  describe("Application Status", () => {
    const statusTestCases = [
      { status: ApplicationStatusEnum.submitted, text: "Submitted" },
      { status: ApplicationStatusEnum.declined, text: "Declined" },
      { status: ApplicationStatusEnum.receivedUnit, text: "Received a unit" },
      { status: ApplicationStatusEnum.waitlist, text: "Wait list" },
      { status: ApplicationStatusEnum.waitlistDeclined, text: "Wait list - Declined" },
    ]

    // +1 for duplicate state
    const filterTestCases = [
      { filter: ApplicationsIndexEnum.all, countArgs: [statusTestCases.length, 1, 0] },
      { filter: ApplicationsIndexEnum.open, countArgs: [statusTestCases.length + 1, 0, 0] },
      { filter: ApplicationsIndexEnum.closed, countArgs: [0, statusTestCases.length + 1, 0] },
      { filter: ApplicationsIndexEnum.lottery, countArgs: [0, 0, statusTestCases.length + 1] },
    ]

    filterTestCases.forEach(({ filter, countArgs }) => {
      it(`should display all statuses correctly in ${ApplicationsIndexEnum[filter]} view`, async () => {
        // Create an application for each status we want to test
        const mockApps = getApplications(countArgs[0], countArgs[1], countArgs[2], filter)
        // We will modify the first N applications to have our test statuses
        mockApps.items.forEach((app, index) => {
          if (index === statusTestCases.length) {
            app.markedAsDuplicate = true
          } else {
            app.status = statusTestCases[index].status
          }
        })

        server.use(
          rest.get("http://localhost:3100/applications/publicAppsView", (_req, res, ctx) => {
            return res(ctx.json(mockApps))
          })
        )

        renderApplicationsView(filter, true)

        // Check if all status texts are present
        for (const { text } of statusTestCases) {
          expect(await screen.findByText(text)).toBeInTheDocument()
        }
        expect(await screen.findByText("Duplicate")).toBeInTheDocument()
      })
    })

    it("should not display application status when feature flag is disabled", async () => {
      const mockApps = getApplications(1, 0, 0)
      mockApps.items[0].status = ApplicationStatusEnum.submitted

      server.use(
        rest.get("http://localhost:3100/applications/publicAppsView", (_req, res, ctx) => {
          return res(ctx.json(mockApps))
        })
      )

      renderApplicationsView(ApplicationsIndexEnum.all, false)

      // Should show "Accepting applications" (Open applications) instead of "Submitted"
      expect(await screen.findByText("Open applications")).toBeInTheDocument()
      expect(screen.queryByText("Submitted")).not.toBeInTheDocument()
    })

    it("should not display duplicate status when feature flag is disabled", async () => {
      const mockApps = getApplications(1, 0, 0)
      mockApps.items[0].markedAsDuplicate = true

      server.use(
        rest.get("http://localhost:3100/applications/publicAppsView", (_req, res, ctx) => {
          return res(ctx.json(mockApps))
        })
      )

      renderApplicationsView(ApplicationsIndexEnum.all, false)

      // Should show "Accepting applications" (Open applications) instead of "Duplicate"
      expect(await screen.findByText("Open applications")).toBeInTheDocument()
      expect(screen.queryByText("Duplicate")).not.toBeInTheDocument()
    })
  })

  describe("Waitlist numbers", () => {
    it("should display accessible waitlist number when all numbers are present", async () => {
      const mockApps = getApplications(1, 0, 0)
      mockApps.items[0].status = ApplicationStatusEnum.waitlist
      mockApps.items[0].accessibleUnitWaitlistNumber = 10101
      mockApps.items[0].conventionalUnitWaitlistNumber = 20202
      mockApps.items[0].confirmationCode = "CONF-33333"

      server.use(
        rest.get("http://localhost:3100/applications/publicAppsView", (_req, res, ctx) => {
          return res(ctx.json(mockApps))
        })
      )

      renderApplicationsView(ApplicationsIndexEnum.all, true)

      expect(await screen.findByText("Your accessible wait list number is:")).toBeInTheDocument()
      expect(screen.getByText("10101")).toBeInTheDocument()
      expect(screen.queryByText("Your conventional wait list number is:")).not.toBeInTheDocument()
      expect(screen.queryByText("Your confirmation number is:")).not.toBeInTheDocument()
    })

    it("should display conventional waitlist number when accessible is missing", async () => {
      const mockApps = getApplications(1, 0, 0)
      mockApps.items[0].status = ApplicationStatusEnum.waitlistDeclined
      mockApps.items[0].accessibleUnitWaitlistNumber = null
      mockApps.items[0].conventionalUnitWaitlistNumber = 90909
      mockApps.items[0].confirmationCode = "CONF-44444"

      server.use(
        rest.get("http://localhost:3100/applications/publicAppsView", (_req, res, ctx) => {
          return res(ctx.json(mockApps))
        })
      )

      renderApplicationsView(ApplicationsIndexEnum.all, true)

      expect(await screen.findByText("Your conventional wait list number is:")).toBeInTheDocument()
      expect(screen.getByText("90909")).toBeInTheDocument()
      expect(screen.queryByText("Your accessible wait list number is:")).not.toBeInTheDocument()
      expect(screen.queryByText("Your confirmation number is:")).not.toBeInTheDocument()
    })
  })

  describe("Advocate applicant search", () => {
    it("should not show applicant search for non-advocate users", async () => {
      server.use(
        rest.get("http://localhost:3100/applications/publicAppsView", (_req, res, ctx) => {
          return res(ctx.json(getApplications(1, 0, 0)))
        })
      )

      renderApplicationsView(ApplicationsIndexEnum.all, false, { isAdvocate: false })

      expect(await screen.findAllByRole("link", { name: /view application/i })).toHaveLength(1)
      expect(screen.queryByPlaceholderText("Search by first and last name")).not.toBeInTheDocument()
    })

    it("should hide search bar for advocate only when unfiltered fetch returns zero total applications", async () => {
      server.use(
        rest.get("http://localhost:3100/applications/publicAppsView", (_req, res, ctx) => {
          return res(ctx.json(getApplications(0, 0, 0)))
        })
      )

      renderApplicationsView(ApplicationsIndexEnum.all, false, { isAdvocate: true })

      expect(
        await screen.findByText("It looks like you haven't applied to any listings yet.")
      ).toBeInTheDocument()
      expect(screen.queryByPlaceholderText("Search by first and last name")).not.toBeInTheDocument()
    })

    it("should keep search bar visible for advocate when unfiltered fetch has applications", async () => {
      server.use(
        rest.get("http://localhost:3100/applications/publicAppsView", (_req, res, ctx) => {
          return res(ctx.json(getApplications(1, 0, 0)))
        })
      )

      renderApplicationsView(ApplicationsIndexEnum.all, false, { isAdvocate: true })

      expect(await screen.findAllByRole("link", { name: /view application/i })).toHaveLength(1)
      expect(screen.getByPlaceholderText("Search by first and last name")).toBeInTheDocument()
    })

    it("should not show search on initial load, then show it after first fetch for advocates with applications", async () => {
      server.use(
        rest.get("http://localhost:3100/applications/publicAppsView", (_req, res, ctx) => {
          return res(ctx.delay(150), ctx.json(getApplications(1, 0, 0)))
        })
      )

      renderApplicationsView(ApplicationsIndexEnum.all, false, { isAdvocate: true })

      expect(screen.queryByPlaceholderText("Search by first and last name")).not.toBeInTheDocument()

      expect(await screen.findAllByRole("link", { name: /view application/i })).toHaveLength(1)
      expect(screen.getByPlaceholderText("Search by first and last name")).toBeInTheDocument()
    })

    it("should send applicantNameSearch only when debounced input has at least 3 characters", async () => {
      const applicantNameSearchParams: string[] = []

      server.use(
        rest.get("http://localhost:3100/applications/publicAppsView", (req, res, ctx) => {
          applicantNameSearchParams.push(req.url.searchParams.get("applicantNameSearch") || "")
          return res(ctx.json(getApplications(1, 0, 0)))
        }),
        rest.get("http://localhost/api/adapter/applications/publicAppsView", (req, res, ctx) => {
          applicantNameSearchParams.push(req.url.searchParams.get("applicantNameSearch") || "")
          return res(ctx.json(getApplications(1, 0, 0)))
        })
      )

      renderApplicationsView(ApplicationsIndexEnum.all, false, { isAdvocate: true })

      const searchInput = await screen.findByPlaceholderText("Search by first and last name")
      expect(applicantNameSearchParams).toEqual([""])

      await userEvent.type(searchInput, "ab")
      await new Promise((resolve) => setTimeout(resolve, 650))
      expect(applicantNameSearchParams).toEqual([""])

      await userEvent.clear(searchInput)
      await userEvent.type(searchInput, "abc")
      await waitFor(() => expect(applicantNameSearchParams).toEqual(["", "abc"]), {
        timeout: 2000,
      })
    })
  })
})
