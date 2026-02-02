import React from "react"
import { setupServer } from "msw/node"
import { rest } from "msw"
import { AuthContext } from "@bloom-housing/shared-helpers"
import {
  Property,
  Listing,
  ListingsService,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { mockNextRouter, render, screen, waitFor, within } from "../../testUtils"
import { PropertyEditModal } from "../../../src/components/settings/PropertyEditModal"
import { user } from "@bloom-housing/shared-helpers/__tests__/testHelpers"

const server = setupServer()

beforeAll(() => {
  server.listen()
  mockNextRouter()
})
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const mockProperty: Property = {
  id: "property1",
  name: "Test Property",
  description: "Test Description",
  url: "http://example.com",
  urlTitle: "Example",
  createdAt: new Date(),
  updatedAt: new Date(),
  jurisdictions: {
    id: "jurisdiction1",
    name: "Jurisdiction 1",
  },
}

const mockListingWithProperty: Listing = {
  id: "listing1",
  name: "Test Listing",
  property: mockProperty,
} as Listing

const mockListingWithoutProperty: Listing = {
  id: "listing2",
  name: "Other Listing",
  property: null,
} as Listing

const renderWithAuth = (ui: React.ReactElement) => {
  return render(
    <AuthContext.Provider
      value={{
        profile: {
          ...user,
          jurisdictions: [],
          listings: [],
        },
        listingsService: new ListingsService(),
      }}
    >
      {ui}
    </AuthContext.Provider>
  )
}

describe("Testing the PropertyEditModal component", () => {
  it("should show warning modal when listings are associated with the property", async () => {
    server.use(
      rest.get("http://localhost:3100/listings", (_req, res, ctx) => {
        return res(
          ctx.json({
            items: [mockListingWithProperty],
            meta: { totalItems: 1, totalPages: 1 },
          })
        )
      })
    )

    const onClose = jest.fn()
    const onEdit = jest.fn()

    renderWithAuth(<PropertyEditModal property={mockProperty} onClose={onClose} onEdit={onEdit} />)

    const dialog = await screen.findByRole("dialog")
    expect(dialog).toBeInTheDocument()

    expect(onEdit).not.toHaveBeenCalled()

    expect(
      within(dialog).getByRole("heading", { name: /changes required before editing/i })
    ).toBeInTheDocument()

    expect(
      within(dialog).getByText(
        /this property is already attached to a listing and needs to be removed before it can be edited/i
      )
    ).toBeInTheDocument()

    expect(await within(dialog).findByText("Test Listing")).toBeInTheDocument()
    expect(within(dialog).getByRole("link", { name: "Test Listing" })).toHaveAttribute(
      "href",
      "/listings/listing1"
    )
  })

  it("should show multiple listings in the table when multiple are associated", async () => {
    const anotherListingWithProperty: Listing = {
      id: "listing3",
      name: "Another Listing",
      property: mockProperty,
    } as Listing

    server.use(
      rest.get("http://localhost:3100/listings", (_req, res, ctx) => {
        return res(
          ctx.json({
            items: [
              mockListingWithProperty,
              anotherListingWithProperty,
              mockListingWithoutProperty,
            ],
            meta: { totalItems: 3, totalPages: 1 },
          })
        )
      })
    )

    const onClose = jest.fn()
    const onEdit = jest.fn()

    renderWithAuth(<PropertyEditModal property={mockProperty} onClose={onClose} onEdit={onEdit} />)

    const dialog = await screen.findByRole("dialog")
    expect(await within(dialog).findByText("Test Listing")).toBeInTheDocument()
    expect(await within(dialog).findByText("Another Listing")).toBeInTheDocument()
    expect(within(dialog).queryByText("Other Listing")).not.toBeInTheDocument()
  })

  it("should not render dialog when property is null", async () => {
    server.use(
      rest.get("http://localhost:3100/listings", (_req, res, ctx) => {
        return res(
          ctx.json({
            items: [mockListingWithProperty],
            meta: { totalItems: 1, totalPages: 1 },
          })
        )
      })
    )

    const onClose = jest.fn()
    const onEdit = jest.fn()

    renderWithAuth(<PropertyEditModal property={null} onClose={onClose} onEdit={onEdit} />)

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    })
  })
})
