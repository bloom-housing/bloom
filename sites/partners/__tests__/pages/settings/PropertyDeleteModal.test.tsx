import React from "react"
import userEvent from "@testing-library/user-event"
import { setupServer } from "msw/node"
import { rest } from "msw"
import { AuthContext, MessageContext, MessageProvider } from "@bloom-housing/shared-helpers"
import { Toast } from "@bloom-housing/ui-seeds"
import {
  Property,
  Listing,
  ListingsService,
  PropertiesService,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { ToastProps } from "@bloom-housing/ui-seeds/src/blocks/Toast"
import { mockNextRouter, render, waitFor, screen, within } from "../../testUtils"
import { PropertyDeleteModal } from "../../../src/components/settings/PropertyDeleteModal"
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

const ToastProvider = (props: React.PropsWithChildren<ToastProps>) => {
  const { toastMessagesRef } = React.useContext(MessageContext)
  return (
    <MessageProvider>
      {toastMessagesRef.current?.map((toastMessage) => (
        <Toast {...toastMessage.props} testId="toast-alert" key={toastMessage.timestamp}>
          {toastMessage.message}
        </Toast>
      ))}
      {props.children}
    </MessageProvider>
  )
}

const renderWithAuth = (
  ui: React.ReactElement,
  { propertiesService = new PropertiesService() } = {}
) => {
  return render(
    <ToastProvider>
      <AuthContext.Provider
        value={{
          profile: {
            ...user,
            jurisdictions: [],
            listings: [],
          },
          listingsService: new ListingsService(),
          propertiesService,
        }}
      >
        {ui}
      </AuthContext.Provider>
    </ToastProvider>
  )
}

describe("Testing PropertyDeleteModal component", () => {
  describe("when property has associated listings", () => {
    it("should show warning modal with listings table", async () => {
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

      renderWithAuth(<PropertyDeleteModal property={mockProperty} onClose={onClose} />)

      const dialog = await screen.findByRole("dialog")
      expect(dialog).toBeInTheDocument()

      expect(
        within(dialog).getByRole("heading", { name: /changes required before deleting/i })
      ).toBeInTheDocument()

      expect(
        within(dialog).getByText(
          /this property is currently added to listings and needs to be removed before being deleted/i
        )
      ).toBeInTheDocument()

      expect(await within(dialog).findByText("Test Listing")).toBeInTheDocument()
      expect(within(dialog).getByRole("link", { name: "Test Listing" })).toHaveAttribute(
        "href",
        "/listings/listing1"
      )

      expect(within(dialog).queryByRole("button", { name: /delete/i })).not.toBeInTheDocument()
      expect(within(dialog).getByRole("button", { name: /done/i })).toBeInTheDocument()
    })

    it("should show multiple listings in the table", async () => {
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

      renderWithAuth(<PropertyDeleteModal property={mockProperty} onClose={onClose} />)

      const dialog = await screen.findByRole("dialog")
      expect(await within(dialog).findByText("Test Listing")).toBeInTheDocument()
      expect(await within(dialog).findByText("Another Listing")).toBeInTheDocument()
      expect(within(dialog).queryByText("Other Listing")).not.toBeInTheDocument()
    })
  })

  describe("when property has no associated listings", () => {
    it("should show delete confirmation modal", async () => {
      server.use(
        rest.get("http://localhost:3100/listings", (_req, res, ctx) => {
          return res(ctx.json({ items: [], meta: { totalItems: 0, totalPages: 0 } }))
        })
      )

      const onClose = jest.fn()

      renderWithAuth(<PropertyDeleteModal property={mockProperty} onClose={onClose} />)

      const dialog = await screen.findByRole("dialog")
      expect(dialog).toBeInTheDocument()

      expect(within(dialog).getByRole("heading", { name: /are you sure/i })).toBeInTheDocument()

      expect(within(dialog).getByText(/deleting a property cannot be undone/i)).toBeInTheDocument()

      expect(within(dialog).getByRole("button", { name: /delete/i })).toBeInTheDocument()
      expect(within(dialog).getByRole("button", { name: /cancel/i })).toBeInTheDocument()
    })

    it("should show delete confirmation when listings exist but none are associated", async () => {
      server.use(
        rest.get("http://localhost:3100/listings", (_req, res, ctx) => {
          return res(
            ctx.json({
              items: [mockListingWithoutProperty],
              meta: { totalItems: 1, totalPages: 1 },
            })
          )
        })
      )

      const onClose = jest.fn()

      renderWithAuth(<PropertyDeleteModal property={mockProperty} onClose={onClose} />)

      const dialog = await screen.findByRole("dialog")
      expect(within(dialog).getByRole("heading", { name: /are you sure/i })).toBeInTheDocument()
      expect(within(dialog).getByRole("button", { name: /delete/i })).toBeInTheDocument()
    })

    it("should delete property and show success toast when Delete is clicked", async () => {
      server.use(
        rest.get("http://localhost:3100/listings", (_req, res, ctx) => {
          return res(ctx.json({ items: [], meta: { totalItems: 0, totalPages: 0 } }))
        }),
        rest.delete("http://localhost/api/adapter/properties", (_req, res, ctx) => {
          return res(ctx.json({ success: true }))
        })
      )

      const onClose = jest.fn()

      renderWithAuth(<PropertyDeleteModal property={mockProperty} onClose={onClose} />)

      const deleteButton = await screen.findByRole("button", { name: /delete/i })
      await userEvent.click(deleteButton)

      await waitFor(() => {
        expect(onClose).toHaveBeenCalledTimes(1)
      })
    })
  })
})
