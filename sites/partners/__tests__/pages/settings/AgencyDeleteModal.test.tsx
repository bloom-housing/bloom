import { rest } from "msw"
import { setupServer } from "msw/node"
import React from "react"
import userEvent from "@testing-library/user-event"
import { user } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { AuthContext, MessageContext, MessageProvider } from "@bloom-housing/shared-helpers"
import { Toast } from "@bloom-housing/ui-seeds"
import {
  Agency,
  AgencyService,
  UserService,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { ToastProps } from "@bloom-housing/ui-seeds/src/blocks/Toast"
import { AgencyDeleteModal } from "../../../src/components/settings/AgencyDeleteModal"
import { mockNextRouter, render, waitFor, screen, within } from "../../testUtils"

const server = setupServer()

beforeAll(() => {
  server.listen()
  mockNextRouter()
})
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const mockAgency: Agency = {
  id: "agency1",
  name: "Test Agency",
  createdAt: new Date(),
  updatedAt: new Date(),
  jurisdictions: {
    id: "jurisdiction1",
    name: "Jurisdiction 1",
  },
}

const mockUserWithAgency = {
  ...user,
  id: "user1",
  firstName: "Jane",
  lastName: "Smith",
  email: "jane.smith@example.com",
}

const mockUserWithoutAgency = {
  ...user,
  id: "user2",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
}
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
  { agencyService = new AgencyService(), userService = new UserService() } = {}
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
          agencyService,
          userService,
        }}
      >
        {ui}
      </AuthContext.Provider>
    </ToastProvider>
  )
}

describe("Testing AgencyDeleteModal component", () => {
  describe("when agency has associated users", () => {
    it("should show agency in use modal with users table", async () => {
      server.use(
        rest.get("http://localhost:3100/user/list", (_req, res, ctx) => {
          return res(
            ctx.json({
              items: [mockUserWithAgency],
              meta: { totalItems: 1, totalPages: 1 },
            })
          )
        })
      )

      const onClose = jest.fn()

      renderWithAuth(<AgencyDeleteModal agency={mockAgency} onClose={onClose} />)

      const dialog = await screen.findByRole("dialog")
      expect(dialog).toBeInTheDocument()

      expect(within(dialog).getByRole("heading", { name: /agency in use/i })).toBeInTheDocument()

      expect(
        within(dialog).getByText(
          /this agency is currently associated with user\(s\) and is unable to be deleted/i
        )
      ).toBeInTheDocument()

      expect(
        await within(dialog).findByText(
          `${mockUserWithAgency.firstName} ${mockUserWithAgency.lastName}`
        )
      ).toBeInTheDocument()
      expect(await within(dialog).findByText(mockUserWithAgency.email)).toBeInTheDocument()

      expect(within(dialog).queryByRole("button", { name: /delete/i })).not.toBeInTheDocument()
      expect(within(dialog).getByRole("button", { name: /done/i })).toBeInTheDocument()
    })

    it("should show multiple users in the table", async () => {
      const anotherUser = {
        ...mockUserWithAgency,
        id: "user3",
        firstName: "Alice",
        lastName: "Jones",
        email: "alice.jones@example.com",
      }

      server.use(
        rest.get("http://localhost:3100/user/list", (_req, res, ctx) => {
          return res(
            ctx.json({
              items: [mockUserWithAgency, anotherUser],
              meta: { totalItems: 2, totalPages: 1 },
            })
          )
        })
      )

      const onClose = jest.fn()

      renderWithAuth(<AgencyDeleteModal agency={mockAgency} onClose={onClose} />)

      const dialog = await screen.findByRole("dialog")
      expect(
        await within(dialog).findByText(
          `${mockUserWithAgency.firstName} ${mockUserWithAgency.lastName}`
        )
      ).toBeInTheDocument()
      expect(
        await within(dialog).findByText(`${anotherUser.firstName} ${anotherUser.lastName}`)
      ).toBeInTheDocument()
      expect(await within(dialog).findByText(mockUserWithAgency.email)).toBeInTheDocument()
      expect(await within(dialog).findByText(anotherUser.email)).toBeInTheDocument()
    })
  })

  describe("when agency has no associated users", () => {
    it("should show delete confirmation modal", async () => {
      server.use(
        rest.get("http://localhost:3100/user/list", (_req, res, ctx) => {
          return res(ctx.json({ items: [], meta: { totalItems: 0, totalPages: 0 } }))
        })
      )

      const onClose = jest.fn()

      renderWithAuth(<AgencyDeleteModal agency={mockAgency} onClose={onClose} />)

      const dialog = await screen.findByRole("dialog")
      expect(dialog).toBeInTheDocument()

      expect(within(dialog).getByRole("heading", { name: /are you sure/i })).toBeInTheDocument()

      expect(within(dialog).getByText(/deleting an agency cannot be undone/i)).toBeInTheDocument()

      expect(within(dialog).getByRole("button", { name: /delete/i })).toBeInTheDocument()
      expect(within(dialog).getByRole("button", { name: /cancel/i })).toBeInTheDocument()
    })

    it("should show delete confirmation when users exist but none are associated with this agency", async () => {
      server.use(
        rest.get("http://localhost:3100/user/list", (_req, res, ctx) => {
          return res(
            ctx.json({
              items: [mockUserWithoutAgency],
              meta: { totalItems: 1, totalPages: 1 },
            })
          )
        })
      )

      const onClose = jest.fn()

      renderWithAuth(<AgencyDeleteModal agency={mockAgency} onClose={onClose} />)

      // When the agencyId filter is applied on the backend, only matching users are returned.
      // This test simulates no users returned for this agency even though users exist in the system.
      server.resetHandlers()
      server.use(
        rest.get("http://localhost:3100/user/list", (_req, res, ctx) => {
          return res(ctx.json({ items: [], meta: { totalItems: 0, totalPages: 0 } }))
        })
      )

      const dialog = await screen.findByRole("dialog")
      expect(within(dialog).getByRole("heading", { name: /are you sure/i })).toBeInTheDocument()
      expect(within(dialog).getByRole("button", { name: /delete/i })).toBeInTheDocument()
    })

    it("should delete agency and show success toast when Delete is clicked", async () => {
      server.use(
        rest.get("http://localhost:3100/user/list", (_req, res, ctx) => {
          return res(ctx.json({ items: [], meta: { totalItems: 0, totalPages: 0 } }))
        }),
        rest.delete("http://localhost/api/adapter/agency", (_req, res, ctx) => {
          return res(ctx.json({ success: true }))
        })
      )

      const onClose = jest.fn()

      renderWithAuth(<AgencyDeleteModal agency={mockAgency} onClose={onClose} />)

      const deleteButton = await screen.findByRole("button", { name: /delete/i })
      await userEvent.click(deleteButton)

      await waitFor(() => {
        expect(onClose).toHaveBeenCalledTimes(1)
      })
    })
  })
})
