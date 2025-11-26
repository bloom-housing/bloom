import React from "react"
import { AuthContext, MessageProvider } from "@bloom-housing/shared-helpers"
import { fireEvent, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { act } from "react-dom/test-utils"
import { rest } from "msw"
import { setupServer } from "msw/node"
import { listing } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import ListingsList from "../../../src/pages/index"
import { mockNextRouter, render } from "../../testUtils"
import {
  FeatureFlag,
  FeatureFlagEnum,
  Jurisdiction,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import "@testing-library/jest-dom"

//Mock the jszip package used for Export
const mockFile = jest.fn()
let mockFolder: jest.Mock
function mockJszip() {
  mockFolder = jest.fn(mockJszip)
  return {
    folder: mockFolder,
    file: mockFile,
    generateAsync: jest.fn().mockImplementation(() => {
      const blob = {}
      const response = { blob }
      return Promise.resolve(response)
    }),
  }
}
jest.mock("jszip", () => {
  return {
    __esModule: true,
    default: mockJszip,
  }
})

function mockJurisdictionsHaveFeatureFlagOn(
  featureFlag: string,
  enableIsVerified = false,
  enableListingUpdatedAt = true,
  enableUnitGroups = false,
  enableHomeType = true,
  enableSection8Question = true
) {
  switch (featureFlag) {
    case FeatureFlagEnum.enableHomeType:
      return enableHomeType
    case FeatureFlagEnum.enableSection8Question:
      return enableSection8Question
    case FeatureFlagEnum.enableUnitGroups:
      return enableUnitGroups
    case FeatureFlagEnum.enableIsVerified:
      return enableIsVerified
    case FeatureFlagEnum.enableListingUpdatedAt:
      return enableListingUpdatedAt
    default:
      return true
  }
}

const mockUser = {
  id: "123",
  email: "test@test.com",
  firstName: "Test",
  lastName: "User",
  dob: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  jurisdictions: [],
  mfaEnabled: false,
  passwordUpdatedAt: new Date(),
  passwordValidForDays: 180,
  agreedToTermsOfService: true,
  listings: [],
}

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

describe("listings", () => {
  it("should not render Export to CSV when user is not admin", async () => {
    window.URL.createObjectURL = jest.fn()
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost:3100/listings", (_req, res, ctx) => {
        return res(ctx.json({ items: [listing], meta: { totalItems: 1, totalPages: 1 } }))
      }),
      rest.post("http://localhost/api/adapter/listings/list", (_req, res, ctx) => {
        return res(ctx.json({ items: [listing], meta: { totalItems: 1, totalPages: 1 } }))
      }),
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(
          ctx.json({ id: "user1", roles: { id: "user1", isAdmin: false, isPartner: true } })
        )
      }),
      rest.post("http://localhost:3100/auth/token", (_req, res, ctx) => {
        return res(ctx.json(""))
      })
    )

    const queryClient = new QueryClient()

    const { findByText, queryByText } = render(
      <QueryClientProvider client={queryClient}>
        <ListingsList />
      </QueryClientProvider>
    )
    const header = await findByText("Partners Portal")
    expect(header).toBeInTheDocument()
    const exportButton = queryByText("Export to CSV")
    expect(exportButton).not.toBeInTheDocument()
  })

  it("should not show is verified column if feature flag is off", () => {
    window.URL.createObjectURL = jest.fn()
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost:3100/listings", (_req, res, ctx) => {
        return res(ctx.json({ items: [listing], meta: { totalItems: 1, totalPages: 1 } }))
      }),
      rest.post("http://localhost/api/adapter/listings/list", (_req, res, ctx) => {
        return res(ctx.json({ items: [listing], meta: { totalItems: 1, totalPages: 1 } }))
      }),
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(
          ctx.json({
            id: "user1",
            roles: { id: "user1", isAdmin: false, isPartner: true },
          })
        )
      }),
      rest.post("http://localhost:3100/auth/token", (_req, res, ctx) => {
        return res(ctx.json(""))
      })
    )

    const queryClient = new QueryClient()

    render(
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider
          value={{
            initialStateLoaded: true,
            profile: {
              ...mockUser,
              jurisdictions: [
                {
                  id: "id1",
                  featureFlags: [
                    {
                      name: FeatureFlagEnum.enableIsVerified,
                      active: false,
                    } as FeatureFlag,
                  ],
                } as Jurisdiction,
              ],
            },
            doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
              mockJurisdictionsHaveFeatureFlagOn(featureFlag),
          }}
        >
          <ListingsList />
        </AuthContext.Provider>
      </QueryClientProvider>
    )
    expect(screen.queryByText("Verified")).toBeNull()
  })

  it("should show is waitlist and available units columns if unit groups feature flag is off", async () => {
    window.URL.createObjectURL = jest.fn()
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost:3100/listings", (_req, res, ctx) => {
        return res(ctx.json({ items: [listing], meta: { totalItems: 1, totalPages: 1 } }))
      }),
      rest.post("http://localhost/api/adapter/listings/list", (_req, res, ctx) => {
        return res(ctx.json({ items: [listing], meta: { totalItems: 1, totalPages: 1 } }))
      }),
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(
          ctx.json({
            id: "user1",
            roles: { id: "user1", isAdmin: false, isPartner: true },
          })
        )
      }),
      rest.post("http://localhost:3100/auth/token", (_req, res, ctx) => {
        return res(ctx.json(""))
      })
    )

    const queryClient = new QueryClient()

    render(
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider
          value={{
            initialStateLoaded: true,
            profile: {
              ...mockUser,
              jurisdictions: [
                {
                  id: "id1",
                  featureFlags: [
                    {
                      name: FeatureFlagEnum.enableUnitGroups,
                      active: false,
                    } as FeatureFlag,
                  ],
                } as Jurisdiction,
              ],
            },
            doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
              mockJurisdictionsHaveFeatureFlagOn(featureFlag, false, true, false),
          }}
        >
          <ListingsList />
        </AuthContext.Provider>
      </QueryClientProvider>
    )
    expect(await screen.findByText("Available units")).toBeDefined()
    expect(screen.getByText("Open waitlist")).toBeDefined()
  })

  it("should not show available units, waitlist column if feature flag is off", () => {
    window.URL.createObjectURL = jest.fn()
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost:3100/listings", (_req, res, ctx) => {
        return res(ctx.json({ items: [listing], meta: { totalItems: 1, totalPages: 1 } }))
      }),
      rest.post("http://localhost/api/adapter/listings/list", (_req, res, ctx) => {
        return res(ctx.json({ items: [listing], meta: { totalItems: 1, totalPages: 1 } }))
      }),
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(
          ctx.json({
            id: "user1",
            roles: { id: "user1", isAdmin: false, isPartner: true },
          })
        )
      }),
      rest.post("http://localhost:3100/auth/token", (_req, res, ctx) => {
        return res(ctx.json(""))
      })
    )

    const queryClient = new QueryClient()

    render(
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider
          value={{
            initialStateLoaded: true,
            profile: {
              ...mockUser,
              jurisdictions: [
                {
                  id: "id1",
                  featureFlags: [
                    {
                      name: FeatureFlagEnum.enableUnitGroups,
                      active: true,
                    } as FeatureFlag,
                  ],
                } as Jurisdiction,
              ],
            },
            doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
              mockJurisdictionsHaveFeatureFlagOn(featureFlag, true, false, true),
          }}
        >
          <ListingsList />
        </AuthContext.Provider>
      </QueryClientProvider>
    )
    expect(screen.queryByText("Available units")).toBeNull()
    expect(screen.queryByText("Open waitlist")).toBeNull()
  })

  it("should show is verified column if feature flag is on", async () => {
    window.URL.createObjectURL = jest.fn()
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost:3100/listings", (_req, res, ctx) => {
        return res(ctx.json({ items: [listing], meta: { totalItems: 1, totalPages: 1 } }))
      }),
      rest.post("http://localhost/api/adapter/listings/list", (_req, res, ctx) => {
        return res(ctx.json({ items: [listing], meta: { totalItems: 1, totalPages: 1 } }))
      }),
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(
          ctx.json({
            id: "user1",
            roles: { id: "user1", isAdmin: false, isPartner: true },
          })
        )
      }),
      rest.post("http://localhost:3100/auth/token", (_req, res, ctx) => {
        return res(ctx.json(""))
      })
    )

    const queryClient = new QueryClient()

    render(
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider
          value={{
            initialStateLoaded: true,
            profile: {
              ...mockUser,
              jurisdictions: [
                {
                  id: "id1",
                  featureFlags: [
                    {
                      name: FeatureFlagEnum.enableIsVerified,
                      active: true,
                    } as FeatureFlag,
                  ],
                } as Jurisdiction,
              ],
            },
            doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
              mockJurisdictionsHaveFeatureFlagOn(featureFlag, true),
          }}
        >
          <ListingsList />
        </AuthContext.Provider>
      </QueryClientProvider>
    )
    expect(await screen.findByText("Verified")).toBeDefined()
  })

  it("should not show last updated column if feature flag is off", () => {
    window.URL.createObjectURL = jest.fn()
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost:3100/listings", (_req, res, ctx) => {
        return res(ctx.json({ items: [listing], meta: { totalItems: 1, totalPages: 1 } }))
      }),
      rest.post("http://localhost/api/adapter/listings/list", (_req, res, ctx) => {
        return res(ctx.json({ items: [listing], meta: { totalItems: 1, totalPages: 1 } }))
      }),
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(
          ctx.json({
            id: "user1",
            roles: { id: "user1", isAdmin: false, isPartner: true },
          })
        )
      }),
      rest.post("http://localhost:3100/auth/token", (_req, res, ctx) => {
        return res(ctx.json(""))
      })
    )
    const queryClient = new QueryClient()

    render(
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider
          value={{
            initialStateLoaded: true,
            profile: {
              ...mockUser,
              jurisdictions: [
                {
                  id: "id1",
                  featureFlags: [
                    {
                      name: FeatureFlagEnum.enableListingUpdatedAt,
                      active: false,
                    } as FeatureFlag,
                  ],
                } as Jurisdiction,
              ],
            },
            doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
              mockJurisdictionsHaveFeatureFlagOn(featureFlag, false, false),
          }}
        >
          <ListingsList />
        </AuthContext.Provider>
      </QueryClientProvider>
    )
    expect(screen.queryByText("Last updated")).toBeNull()
  })

  it("should show is last updated column if feature flag is on", async () => {
    window.URL.createObjectURL = jest.fn()
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost:3100/listings", (_req, res, ctx) => {
        return res(ctx.json({ items: [listing], meta: { totalItems: 1, totalPages: 1 } }))
      }),
      rest.post("http://localhost/api/adapter/listings/list", (_req, res, ctx) => {
        return res(ctx.json({ items: [listing], meta: { totalItems: 1, totalPages: 1 } }))
      }),
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(
          ctx.json({
            id: "user1",
            roles: { id: "user1", isAdmin: false, isPartner: true },
          })
        )
      }),
      rest.post("http://localhost:3100/auth/token", (_req, res, ctx) => {
        return res(ctx.json(""))
      })
    )
    const queryClient = new QueryClient()

    render(
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider
          value={{
            initialStateLoaded: true,
            profile: {
              ...mockUser,
              jurisdictions: [
                {
                  id: "id1",
                  featureFlags: [
                    {
                      name: FeatureFlagEnum.enableListingUpdatedAt,
                      active: true,
                    } as FeatureFlag,
                  ],
                } as Jurisdiction,
              ],
            },
            doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
              mockJurisdictionsHaveFeatureFlagOn(featureFlag),
          }}
        >
          <ListingsList />
        </AuthContext.Provider>
      </QueryClientProvider>
    )
    expect(await screen.findByText("Last updated")).toBeDefined()
  })
  // Skipping for now until the CSV endpoints are created
  it.skip("should render the error text when listings csv api call fails", async () => {
    window.URL.createObjectURL = jest.fn()
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost:3100/listings", (_req, res, ctx) => {
        return res(ctx.json({ items: [listing], meta: { totalItems: 1, totalPages: 1 } }))
      }),
      rest.post("http://localhost/api/adapter/listings/list", (_req, res, ctx) => {
        return res(ctx.json({ items: [listing], meta: { totalItems: 1, totalPages: 1 } }))
      }),
      rest.get("http://localhost/api/adapter/listings/csv", (_req, res, ctx) => {
        return res(ctx.status(500), ctx.json(""))
      }),
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(ctx.json({ id: "user1", roles: { id: "user1", isAdmin: true } }))
      }),
      rest.post("http://localhost:3100/auth/token", (_req, res, ctx) => {
        return res(ctx.json(""))
      })
    )

    const { findByText, getByText } = render(<ListingsList />)
    const header = await findByText("Partners Portal")
    expect(header).toBeInTheDocument()
    const exportButton = getByText("Export to CSV")
    expect(exportButton).toBeInTheDocument()
    act(() => {
      fireEvent.click(exportButton)
    })

    const error = await findByText(
      "There was an error. Please try again, or contact support for help.",
      {
        exact: false,
      }
    )
    expect(error).toBeInTheDocument()
  })

  // Skipping for now until the CSV endpoints are created
  it.skip("should render Export to CSV when user is admin and success message when clicked", async () => {
    window.URL.createObjectURL = jest.fn()
    //Prevent error from clicking anchor tag within test
    HTMLAnchorElement.prototype.click = jest.fn()
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost:3100/listings", (_req, res, ctx) => {
        return res(ctx.json({ items: [listing], meta: { totalItems: 1, totalPages: 1 } }))
      }),
      rest.get("http://localhost/api/adapter/listings/csv", (_req, res, ctx) => {
        return res(ctx.json({ listingCSV: "", unitCSV: "" }))
      }),
      rest.get("http://localhost:3100/listings/csv", (_req, res, ctx) => {
        return res(ctx.json({ listingCSV: "", unitCSV: "" }))
      }),
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(ctx.json({ id: "user1", roles: { id: "user1", isAdmin: true } }))
      }),
      rest.post("http://localhost:3100/auth/token", (_req, res, ctx) => {
        return res(ctx.json(""))
      })
    )

    const { findByText, getByText } = render(
      <MessageProvider>
        <ListingsList />
      </MessageProvider>
    )
    const header = await findByText("Partners Portal")
    expect(header).toBeInTheDocument()
    const exportButton = getByText("Export to CSV")
    expect(exportButton).toBeInTheDocument()
    act(() => {
      fireEvent.click(exportButton)
    })
    const success = await findByText("The file has been exported")
    expect(success).toBeInTheDocument()
  })

  it("should open add listing modal if user has access to multiple jurisdictions", async () => {
    window.URL.createObjectURL = jest.fn()
    document.cookie = "access-token-available=True"
    const { pushMock } = mockNextRouter()
    server.use(
      rest.get("http://localhost:3100/listings", (_req, res, ctx) => {
        return res(ctx.json({ items: [listing], meta: { totalItems: 1, totalPages: 1 } }))
      }),
      rest.post("http://localhost/api/adapter/listings/list", (_req, res, ctx) => {
        return res(ctx.json({ items: [listing], meta: { totalItems: 1, totalPages: 1 } }))
      }),
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(
          ctx.json({
            id: "user1",
            roles: { id: "user1", isAdmin: true, isPartner: false },
          })
        )
      }),
      rest.post("http://localhost:3100/auth/token", (_req, res, ctx) => {
        return res(ctx.json(""))
      })
    )
    const queryClient = new QueryClient()

    render(
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider
          value={{
            initialStateLoaded: true,
            profile: {
              ...mockUser,
              userRoles: { isAdmin: true, isPartner: false },
              jurisdictions: [
                {
                  id: "id1",
                  name: "JurisdictionA",
                  featureFlags: [],
                } as Jurisdiction,
                {
                  id: "id2",
                  name: "JurisdictionB",
                  featureFlags: [],
                } as Jurisdiction,
              ],
            },
            doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
              mockJurisdictionsHaveFeatureFlagOn(featureFlag, false, false),
          }}
        >
          <ListingsList />
        </AuthContext.Provider>
      </QueryClientProvider>
    )

    render(<ListingsList />)

    const addListingButton = await screen.findByRole("button", { name: "Add listing" })
    expect(addListingButton).toBeInTheDocument()
    await userEvent.click(addListingButton)

    expect(
      screen.getByRole("heading", { level: 1, name: "Select jurisdiction" })
    ).toBeInTheDocument()
    expect(
      screen.getByText("Once you create this listing, this selection cannot be changed.")
    ).toBeInTheDocument()

    expect(screen.getByRole("option", { name: "JurisdictionA" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "JurisdictionB" })).toBeInTheDocument()

    await userEvent.selectOptions(screen.getByLabelText("Jurisdiction"), "JurisdictionA")

    await userEvent.click(screen.getByRole("button", { name: "Get started" }))
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith({
        pathname: "/listings/add",
        query: { jurisdictionId: "id1" },
      })
    })
  })

  // it("should open add listing modal if user has access to one jurisdiction and enableNonRegulatedListings", async () => {
  //   window.URL.createObjectURL = jest.fn()
  //   document.cookie = "access-token-available=True"
  //   const { pushMock } = mockNextRouter()
  //   server.use(
  //     rest.get("http://localhost:3100/listings", (_req, res, ctx) => {
  //       return res(ctx.json({ items: [listing], meta: { totalItems: 1, totalPages: 1 } }))
  //     }),
  //     rest.post("http://localhost/api/adapter/listings/list", (_req, res, ctx) => {
  //       return res(ctx.json({ items: [listing], meta: { totalItems: 1, totalPages: 1 } }))
  //     }),
  //     rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
  //       return res(
  //         ctx.json({
  //           id: "user1",
  //           userRoles: { id: "user1", isAdmin: true, isPartner: false },
  //           jurisdictions: [
  //             {
  //               id: "id1",
  //               name: "JurisdictionA",
  //               featureFlags: [
  //                 {
  //                   id: "id_1",
  //                   name: FeatureFlagEnum.enableNonRegulatedListings,
  //                   active: true,
  //                 },
  //               ],
  //             } as Jurisdiction,
  //           ],
  //         })
  //       )
  //     }),
  //     rest.post("http://localhost:3100/auth/token", (_req, res, ctx) => {
  //       return res(ctx.json(""))
  //     })
  //   )
  //   const queryClient = new QueryClient()

  //   render(
  //     <QueryClientProvider client={queryClient}>
  //       <AuthContext.Provider
  //         value={{
  //           initialStateLoaded: true,
  //           profile: {
  //             ...mockUser,
  //             userRoles: { isAdmin: true, isPartner: false },
  //             jurisdictions: [
  //               {
  //                 id: "id1",
  //                 name: "JurisdictionA",
  //                 featureFlags: [],
  //               } as Jurisdiction,
  //             ],
  //           },
  //           doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
  //             mockJurisdictionsHaveFeatureFlagOn(featureFlag, false, false),
  //         }}
  //       >
  //         <ListingsList />
  //       </AuthContext.Provider>
  //     </QueryClientProvider>
  //   )

  //   render(<ListingsList />)

  //   const addListingButton = await screen.findByRole("button", { name: "Add listing" })
  //   expect(addListingButton).toBeInTheDocument()
  //   await userEvent.click(addListingButton)

  //   expect(
  //     screen.queryByRole("heading", { level: 1, name: "Select jurisdiction" })
  //   ).not.toBeInTheDocument()

  //   expect(screen.queryByRole("option", { name: "JurisdictionA" })).not.toBeInTheDocument()

  //   await waitFor(() => {
  //     expect(pushMock).toHaveBeenCalledWith({
  //       pathname: "/listings/add",
  //       query: { jurisdictionId: "id1" },
  //     })
  //   })
  // })
})
