import { setupServer } from "msw/lib/node"
import { mockNextRouter, render, screen, within } from "../../testUtils"
import { rest } from "msw"
import { User } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { AuthProvider, ConfigProvider, MessageProvider } from "@bloom-housing/shared-helpers"
import Advocates from "../../../src/pages/users/advocates"
import userEvent from "@testing-library/user-event"

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

const mockAdvocateUser = (
  idx: number,
  agencyName: string,
  createdAt: Date,
  isApproved?: boolean,
  firstName = "First",
  middleName = "Middle",
  lastName = "Last"
): Partial<User> => ({
  id: `advocate_user_idx_${idx}`,
  email: `advocate_${idx}@email.com`,
  createdAt,
  agency: {
    id: `agency_id_${idx}`,
    name: `Agency ${agencyName}`,
  },
  isApproved,
  firstName,
  middleName,
  lastName,
})

const renderAdvocateUsersPage = () =>
  render(
    <ConfigProvider apiUrl={"http://localhost:3100"}>
      <AuthProvider>
        <MessageProvider>
          <Advocates />
        </MessageProvider>
      </AuthProvider>
    </ConfigProvider>
  )

describe("advocate users", () => {
  it("should show the advocate users table when users exist", async () => {
    server.use(
      rest.get("http://localhost:3100/user/list", (req, res, ctx) => {
        return res(
          ctx.json({
            items: [
              mockAdvocateUser(1, "First Agency", new Date(2025, 6, 12), false),
              mockAdvocateUser(2, "Second Agency", new Date(2025, 6, 12), true),
            ],
            meta: { totalItems: 2, totalPages: 1 },
          })
        )
      })
    )

    renderAdvocateUsersPage()

    const header = await screen.findByText("Partners Portal")
    expect(header).toBeInTheDocument()

    const tableHeaders = await screen.findAllByRole("columnheader")
    expect(tableHeaders).toHaveLength(5)

    const [agency, email, createdAt, isApproved, action] = tableHeaders
    expect(agency).toHaveTextContent(/agency/i)
    expect(email).toHaveTextContent(/email/i)
    expect(createdAt).toHaveTextContent(/date created/i)
    expect(isApproved).toHaveTextContent(/status/i)
    expect(action).toHaveTextContent(/action/i)

    const rowgroups = screen.getAllByRole("rowgroup")
    expect(rowgroups).toHaveLength(2)
    const rows = within(rowgroups[1]).getAllByRole("row")
    expect(rows).toHaveLength(2)

    const [agency1, email1, createdAt1, isApproved1] = within(rows[0]).getAllByRole("gridcell")
    expect(agency1).toHaveTextContent(/first agency/i)
    expect(email1).toHaveTextContent(/advocate_1@email.com/i)
    expect(createdAt1).toHaveTextContent("07/12/2025")
    expect(isApproved1).toHaveTextContent(/requested/i)

    const [agency2, email2, createdAt2, isApproved2] = within(rows[1]).getAllByRole("gridcell")
    expect(agency2).toHaveTextContent(/second agency/i)
    expect(email2).toHaveTextContent(/advocate_2@email.com/i)
    expect(createdAt2).toHaveTextContent("07/12/2025")
    expect(isApproved2).toHaveTextContent(/approved/i)
  })

  it("should show dialog on accept action button", async () => {
    server.use(
      rest.get("http://localhost:3100/user/list", (req, res, ctx) => {
        return res(
          ctx.json({
            items: [
              mockAdvocateUser(
                1,
                "First Agency",
                new Date(2025, 6, 12),
                false,
                "James",
                null,
                "Sunderland"
              ),
            ],
            meta: { totalItems: 1, totalPages: 1 },
          })
        )
      }),
      rest.post("http://localhost/api/adapter/user/advocate/approve", (req, res, ctx) => {
        return res(ctx.json({ success: true }))
      })
    )

    renderAdvocateUsersPage()

    const header = await screen.findByText("Partners Portal")
    expect(header).toBeInTheDocument()

    const tableHeaders = await screen.findAllByRole("columnheader")
    expect(tableHeaders).toHaveLength(5)

    const acceptButton = await screen.findByTestId("advocate-accept")
    expect(acceptButton).toBeInTheDocument()

    await userEvent.click(acceptButton)

    const dialog = await screen.findByRole("dialog", { name: /approve advocate account/i })
    expect(dialog).toBeInTheDocument()
    expect(
      within(dialog).getByText(
        "Are you sure you want to approve an advocate account for James Sunderland? This will allow them to apply for affordable housing on behalf of their clients."
      )
    ).toBeInTheDocument()
    expect(within(dialog).getByRole("button", { name: /cancel/i })).toBeInTheDocument()
    const approveButton = within(dialog).getByRole("button", { name: /approve/i })
    expect(approveButton).toBeInTheDocument()

    await userEvent.click(approveButton)
  })

  it("should show dialog on reject action button", async () => {
    server.use(
      rest.get("http://localhost:3100/user/list", (req, res, ctx) => {
        return res(
          ctx.json({
            items: [
              mockAdvocateUser(
                1,
                "First Agency",
                new Date(2025, 6, 12),
                false,
                "James",
                null,
                "Sunderland"
              ),
            ],
            meta: { totalItems: 1, totalPages: 1 },
          })
        )
      }),
      rest.post("http://localhost/api/adapter/user/advocate/approve", (req, res, ctx) => {
        return res(ctx.json({ success: true }))
      })
    )

    renderAdvocateUsersPage()

    const header = await screen.findByText("Partners Portal")
    expect(header).toBeInTheDocument()

    const tableHeaders = await screen.findAllByRole("columnheader")
    expect(tableHeaders).toHaveLength(5)

    const rejectButton = await screen.findByTestId("advocate-reject")
    expect(rejectButton).toBeInTheDocument()

    await userEvent.click(rejectButton)

    const dialog = await screen.findByRole("dialog", { name: /decline advocate account/i })
    expect(dialog).toBeInTheDocument()
    expect(
      within(dialog).getByText(
        "Are you sure you want to decline an advocate account for James Sunderland? This will remove their request from the data table."
      )
    ).toBeInTheDocument()
    expect(within(dialog).getByRole("button", { name: /cancel/i })).toBeInTheDocument()
    const declineButton = within(dialog).getByRole("button", { name: /decline/i })
    expect(declineButton).toBeInTheDocument()

    await userEvent.click(declineButton)
  })
})
