import React from "react"
import { AuthContext, MessageProvider } from "@bloom-housing/shared-helpers"
import { fireEvent, screen } from "@testing-library/react"
import { rest } from "msw"
import { setupServer } from "msw/node"
import { listing } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import ListingsList, { getFlagInAllJurisdictions } from "../../../src/pages/index"
import { mockNextRouter, render } from "../../testUtils"
import {
  FeatureFlag,
  FeatureFlagEnum,
  Jurisdiction,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"

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
      rest.get("http://localhost/api/adapter/listings", (_req, res, ctx) => {
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

    const { findByText, queryByText } = render(<ListingsList />)
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
      rest.get("http://localhost/api/adapter/listings", (_req, res, ctx) => {
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

    render(
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
        }}
      >
        <ListingsList />
      </AuthContext.Provider>
    )
    expect(screen.queryByText("Verified")).toBeNull()
  })

  it("should show is waitlist and available units columns if unit groups feature flag is off", () => {
    window.URL.createObjectURL = jest.fn()
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost:3100/listings", (_req, res, ctx) => {
        return res(ctx.json({ items: [listing], meta: { totalItems: 1, totalPages: 1 } }))
      }),
      rest.get("http://localhost/api/adapter/listings", (_req, res, ctx) => {
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

    render(
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
        }}
      >
        <ListingsList />
      </AuthContext.Provider>
    )
    expect(screen.getByText("Available units")).toBeDefined()
    expect(screen.getByText("Open waitlist")).toBeDefined()
  })

  it("should not show is last updated column if feature flag is off", () => {
    window.URL.createObjectURL = jest.fn()
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost:3100/listings", (_req, res, ctx) => {
        return res(ctx.json({ items: [listing], meta: { totalItems: 1, totalPages: 1 } }))
      }),
      rest.get("http://localhost/api/adapter/listings", (_req, res, ctx) => {
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

    render(
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
        }}
      >
        <ListingsList />
      </AuthContext.Provider>
    )
    expect(screen.queryByText("Available units")).toBeNull()
    expect(screen.queryByText("Open waitlist")).toBeNull()
  })

  it("should show is verified column if feature flag is on", () => {
    window.URL.createObjectURL = jest.fn()
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost:3100/listings", (_req, res, ctx) => {
        return res(ctx.json({ items: [listing], meta: { totalItems: 1, totalPages: 1 } }))
      }),
      rest.get("http://localhost/api/adapter/listings", (_req, res, ctx) => {
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

    render(
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
        }}
      >
        <ListingsList />
      </AuthContext.Provider>
    )
    expect(screen.getByText("Verified")).toBeDefined()
  })

  it("should not show is last updated column if feature flag is off", () => {
    window.URL.createObjectURL = jest.fn()
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost:3100/listings", (_req, res, ctx) => {
        return res(ctx.json({ items: [listing], meta: { totalItems: 1, totalPages: 1 } }))
      }),
      rest.get("http://localhost/api/adapter/listings", (_req, res, ctx) => {
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

    render(
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
        }}
      >
        <ListingsList />
      </AuthContext.Provider>
    )
    expect(screen.queryByText("Last updated")).toBeNull()
  })

  it("should show is last updated column if feature flag is on", () => {
    window.URL.createObjectURL = jest.fn()
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost:3100/listings", (_req, res, ctx) => {
        return res(ctx.json({ items: [listing], meta: { totalItems: 1, totalPages: 1 } }))
      }),
      rest.get("http://localhost/api/adapter/listings", (_req, res, ctx) => {
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

    render(
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
        }}
      >
        <ListingsList />
      </AuthContext.Provider>
    )
    expect(screen.getByText("Last updated")).toBeDefined()
  })
  // Skipping for now until the CSV endpoints are created
  it.skip("should render the error text when listings csv api call fails", async () => {
    window.URL.createObjectURL = jest.fn()
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost:3100/listings", (_req, res, ctx) => {
        return res(ctx.json({ items: [listing], meta: { totalItems: 1, totalPages: 1 } }))
      }),
      rest.get("http://localhost/api/adapter/listings", (_req, res, ctx) => {
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
    fireEvent.click(exportButton)
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
    fireEvent.click(exportButton)
    const success = await findByText("The file has been exported")
    expect(success).toBeInTheDocument()
  })
  describe("getFlagInAllJurisdictions", () => {
    it("should return true if feature flag exists for one jurisdiction", () => {
      expect(
        getFlagInAllJurisdictions(
          [
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
          FeatureFlagEnum.enableUnitGroups,
          true
        )
      ).toBe(true)
    })
    it("should return false if feature flag does not exist for one jurisdiction", () => {
      expect(
        getFlagInAllJurisdictions(
          [
            {
              id: "id1",
              featureFlags: [],
            } as Jurisdiction,
          ],
          FeatureFlagEnum.enableUnitGroups,
          true
        )
      ).toBe(false)
      expect(
        getFlagInAllJurisdictions(
          [
            {
              id: "id1",
              featureFlags: [
                {
                  name: FeatureFlagEnum.enableAdaOtherOption,
                  active: true,
                } as FeatureFlag,
              ],
            } as Jurisdiction,
          ],
          FeatureFlagEnum.enableUnitGroups,
          true
        )
      ).toBe(false)
    })
    it("should return true if feature flag exists for all jurisdictions", () => {
      expect(
        getFlagInAllJurisdictions(
          [
            {
              id: "id1",
              featureFlags: [
                {
                  name: FeatureFlagEnum.enableUnitGroups,
                  active: true,
                } as FeatureFlag,
              ],
            } as Jurisdiction,
            {
              id: "id2",
              featureFlags: [
                {
                  name: FeatureFlagEnum.enableUnitGroups,
                  active: true,
                } as FeatureFlag,
                {
                  name: FeatureFlagEnum.enableAccessibilityFeatures,
                  active: false,
                } as FeatureFlag,
              ],
            } as Jurisdiction,
          ],
          FeatureFlagEnum.enableUnitGroups,
          true
        )
      ).toBe(true)
    })
    it("should return false if feature flag is not true for all jurisdictions", () => {
      expect(
        getFlagInAllJurisdictions(
          [
            {
              id: "id1",
              featureFlags: [
                {
                  name: FeatureFlagEnum.enableUnitGroups,
                  active: true,
                } as FeatureFlag,
              ],
            } as Jurisdiction,
            {
              id: "id2",
              featureFlags: [
                {
                  name: FeatureFlagEnum.enableUnitGroups,
                  active: false,
                } as FeatureFlag,
              ],
            } as Jurisdiction,
          ],
          FeatureFlagEnum.enableUnitGroups,
          true
        )
      ).toBe(false)
      expect(
        getFlagInAllJurisdictions(
          [
            {
              id: "id1",
              featureFlags: [
                {
                  name: FeatureFlagEnum.enableUnitGroups,
                  active: false,
                } as FeatureFlag,
              ],
            } as Jurisdiction,
            {
              id: "id2",
              featureFlags: [
                {
                  name: FeatureFlagEnum.enableUnitGroups,
                  active: false,
                } as FeatureFlag,
              ],
            } as Jurisdiction,
            {
              id: "id2",
              featureFlags: [
                {
                  name: FeatureFlagEnum.enableAdditionalResources,
                  active: true,
                } as FeatureFlag,
              ],
            } as Jurisdiction,
          ],
          FeatureFlagEnum.enableUnitGroups,
          true
        )
      ).toBe(false)
      expect(
        getFlagInAllJurisdictions(
          [
            {
              id: "id1",
              featureFlags: [
                {
                  name: FeatureFlagEnum.enableAccessibilityFeatures,
                  active: false,
                } as FeatureFlag,
              ],
            } as Jurisdiction,
            {
              id: "id2",
              featureFlags: [
                {
                  name: FeatureFlagEnum.enableAdaOtherOption,
                  active: false,
                } as FeatureFlag,
              ],
            } as Jurisdiction,
          ],
          FeatureFlagEnum.enableUnitGroups,
          true
        )
      ).toBe(false)
    })
  })
})
