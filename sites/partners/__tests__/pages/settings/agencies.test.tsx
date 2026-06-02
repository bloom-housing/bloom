import dayjs from "dayjs"
import React from "react"
import { setupServer } from "msw/lib/node"
import { rest } from "msw"
import { screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { AuthContext, MessageContext, MessageProvider } from "@bloom-housing/shared-helpers"
import { Toast } from "@bloom-housing/ui-seeds"
import {
  Agency,
  AgencyService,
  FeatureFlagEnum,
  UserService,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { jurisdiction, user } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { ToastProps } from "@bloom-housing/ui-seeds/src/blocks/Toast"
import SettingsAgencies from "../../../src/pages/settings/agencies"
import { mockNextRouter, render } from "../../testUtils"

const server = setupServer()

const mockAgency: Agency = {
  id: "agency1",
  name: "Test Agency",
  createdAt: new Date(Date.now()),
  updatedAt: new Date(Date.now()),
  jurisdictions: {
    id: "jurisdiction1",
    name: "Jurisdiction 1",
  },
}

beforeAll(() => {
  server.listen()
  mockNextRouter()
})

afterEach(() => server.resetHandlers())

afterAll(() => server.close())

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

describe("<SettingsAgencies>", () => {
  it("should render empty state when no agencies exist", () => {
    server.use(
      rest.get("http://localhost:3100/agency", (_req, res, ctx) => {
        return res(ctx.json({ items: [], meta: { totalItems: 0, totalPages: 0 } }))
      }),
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(ctx.json(user))
      })
    )

    render(
      <AuthContext.Provider
        value={{
          profile: {
            ...user,
            jurisdictions: [],
            listings: [],
          },
          agencyService: new AgencyService(),
          doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
            featureFlag === FeatureFlagEnum.enableHousingAdvocate,
        }}
      >
        <SettingsAgencies />
      </AuthContext.Provider>
    )

    expect(screen.getByRole("heading", { level: 1, name: "Settings" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Agencies" })).toBeInTheDocument()

    expect(screen.getByRole("button", { name: "Add agency" })).toBeInTheDocument()

    const headers = screen.getAllByRole("columnheader")
    expect(headers).toHaveLength(3)
    expect(headers[0]).toHaveTextContent("Name")
    expect(headers[1]).toHaveTextContent("Update date")
    expect(headers[2]).toHaveTextContent("Actions")

    expect(screen.queryAllByRole("gridcell")).toHaveLength(0)
  })

  it("should not render tabs if only agencies is on", async () => {
    server.use(
      rest.get("http://localhost:3100/agency", (_req, res, ctx) => {
        return res(ctx.json({ items: [], meta: { totalItems: 0, totalPages: 0 } }))
      }),
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(ctx.json(user))
      })
    )

    render(
      <AuthContext.Provider
        value={{
          profile: {
            ...user,
            jurisdictions: [],
            listings: [],
          },
          agencyService: new AgencyService(),
          doJurisdictionsHaveFeatureFlagOn: (featureFlag) => {
            if (featureFlag === FeatureFlagEnum.enableHousingAdvocate) return true
            if (featureFlag === FeatureFlagEnum.disableListingPreferences) return true
            return false
          },
        }}
      >
        <SettingsAgencies />
      </AuthContext.Provider>
    )
    expect(await screen.findByRole("heading", { name: "Settings" })).toBeInTheDocument()
    expect(screen.queryByRole("tablist")).not.toBeInTheDocument()
  })

  it("should render the agencies table", async () => {
    window.URL.createObjectURL = jest.fn()
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost:3100/agency", (_req, res, ctx) => {
        return res(
          ctx.json({
            items: [mockAgency],
            meta: { totalItems: 1, totalPages: 1 },
          })
        )
      }),
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(ctx.json(user))
      })
    )
    render(
      <AuthContext.Provider
        value={{
          profile: {
            ...user,
            jurisdictions: [{ ...jurisdiction, id: "jurisdiction1", name: "Test Jurisdiction" }],
            listings: [],
          },
          agencyService: new AgencyService(),
          doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
            featureFlag === FeatureFlagEnum.enableHousingAdvocate,
        }}
      >
        <SettingsAgencies />
      </AuthContext.Provider>
    )

    const headers = screen.getAllByRole("columnheader")
    expect(headers).toHaveLength(3)
    expect(headers[0]).toHaveTextContent("Name")
    expect(headers[1]).toHaveTextContent("Update date")
    expect(headers[2]).toHaveTextContent("Actions")

    const cells = await screen.findAllByRole("gridcell")

    expect(cells).toHaveLength(3)
    expect(cells[0]).toHaveTextContent(mockAgency.name)
    expect(cells[1]).toHaveTextContent(dayjs(mockAgency.updatedAt).format("MM/DD/YYYY"))
    const firstRowActions = await within(cells[2]).findAllByRole("button")
    expect(firstRowActions).toHaveLength(2)
    expect(firstRowActions[0]).toHaveAttribute(
      "data-testid",
      `agency-edit-icon: ${mockAgency.name}`
    )
    expect(firstRowActions[1]).toHaveAttribute(
      "data-testid",
      `agency-delete-icon: ${mockAgency.name}`
    )
  })

  it("should render jurisdiction column when user has multiple jurisdictions", async () => {
    server.use(
      rest.get("http://localhost:3100/agency", (_req, res, ctx) => {
        return res(
          ctx.json({
            items: [
              {
                ...mockAgency,
                jurisdictions: { id: "jurisdiction1", name: "Jurisdiction 1" },
              },
            ],
            meta: { totalItems: 1, totalPages: 1 },
          })
        )
      }),
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(ctx.json(user))
      })
    )
    render(
      <AuthContext.Provider
        value={{
          profile: {
            ...user,
            jurisdictions: [
              { ...jurisdiction, id: "jurisdiction1", name: "Jurisdiction 1" },
              { ...jurisdiction, id: "jurisdiction2", name: "Jurisdiction 2" },
            ],
            listings: [],
          },
          agencyService: new AgencyService(),
          doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
            featureFlag === FeatureFlagEnum.enableHousingAdvocate,
        }}
      >
        <SettingsAgencies />
      </AuthContext.Provider>
    )

    const headers = screen.getAllByRole("columnheader")
    expect(headers).toHaveLength(4)
    expect(headers[0]).toHaveTextContent("Name")
    expect(headers[1]).toHaveTextContent("Jurisdiction")
    expect(headers[2]).toHaveTextContent("Update date")
    expect(headers[3]).toHaveTextContent("Actions")

    const cells = await screen.findAllByRole("gridcell")
    expect(cells[1]).toHaveTextContent(mockAgency.jurisdictions.name)
  })

  it("should open drawer when Add button is clicked", async () => {
    server.use(
      rest.get("http://localhost:3100/agency", (_req, res, ctx) => {
        return res(
          ctx.json({
            items: [mockAgency],
            meta: { totalItems: 1, totalPages: 1 },
          })
        )
      }),
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(ctx.json(user))
      })
    )
    const enableHousingAdvocateFlag = {
      name: FeatureFlagEnum.enableHousingAdvocate,
      active: true,
      id: "ff-enable-housing-advocate",
      createdAt: new Date(),
      updatedAt: new Date(),
      description: "",
      jurisdictions: [],
    }

    render(
      <AuthContext.Provider
        value={{
          profile: {
            ...user,
            jurisdictions: [
              {
                ...jurisdiction,
                id: "jurisdiction1",
                name: "Jurisdiction 1",
                featureFlags: [...jurisdiction.featureFlags, enableHousingAdvocateFlag],
              },
              {
                ...jurisdiction,
                id: "jurisdiction2",
                name: "Jurisdiction 2",
                featureFlags: [...jurisdiction.featureFlags, enableHousingAdvocateFlag],
              },
            ],
            listings: [],
          },
          agencyService: new AgencyService(),
          doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
            featureFlag === FeatureFlagEnum.enableHousingAdvocate,
        }}
      >
        <SettingsAgencies />
      </AuthContext.Provider>
    )

    const addButton = screen.getByRole("button", { name: /add/i })
    await userEvent.click(addButton)

    const addDialog = await screen.findByRole("dialog")
    expect(addDialog).toBeInTheDocument()
    expect(
      within(addDialog).getByRole("heading", { level: 1, name: /add agency/i })
    ).toBeInTheDocument()

    expect(within(addDialog).getByRole("textbox", { name: /agency name/i })).toBeInTheDocument()
    expect(within(addDialog).getByRole("button", { name: "Save" })).toBeInTheDocument()
    expect(screen.getAllByText("Jurisdiction 1").length).toBeGreaterThan(0)
    expect(screen.getAllByText("Jurisdiction 2").length).toBeGreaterThan(0)
  })

  it("should open drawer with agency data when edit icon is clicked", async () => {
    server.use(
      rest.get("http://localhost:3100/agency", (_req, res, ctx) => {
        return res(
          ctx.json({
            items: [mockAgency],
            meta: { totalItems: 1, totalPages: 1 },
          })
        )
      }),
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(ctx.json(user))
      })
    )
    render(
      <AuthContext.Provider
        value={{
          profile: {
            ...user,
            jurisdictions: [
              { ...jurisdiction, id: "jurisdiction1", name: "Jurisdiction 1" },
              { ...jurisdiction, id: "jurisdiction2", name: "Jurisdiction 2" },
            ],
            listings: [],
          },
          agencyService: new AgencyService(),
          doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
            featureFlag === FeatureFlagEnum.enableHousingAdvocate,
        }}
      >
        <SettingsAgencies />
      </AuthContext.Provider>
    )

    await screen.findByText(mockAgency.name)
    const editButton = await screen.findByTestId(`agency-edit-icon: ${mockAgency.name}`)
    await userEvent.click(editButton)

    const editDialog = await screen.findByRole("dialog")
    expect(editDialog).toBeInTheDocument()
    expect(
      within(editDialog).getByRole("heading", { level: 1, name: /edit agency/i })
    ).toBeInTheDocument()

    const nameInput = within(editDialog).getByRole("textbox", { name: /agency name/i })
    expect(nameInput).toHaveValue(mockAgency.name)
  })

  it("should create an agency successfully", async () => {
    const newAgency: Agency = {
      ...mockAgency,
      id: "new-agency",
      name: "New Agency",
    }

    server.use(
      rest.get("http://localhost:3100/agency", (_req, res, ctx) => {
        return res(
          ctx.json({
            items: [mockAgency],
            meta: { totalItems: 1, totalPages: 1 },
          })
        )
      }),
      rest.get("http://localhost/api/adapter/agency", (_req, res, ctx) => {
        return res(
          ctx.json({
            items: [newAgency],
            meta: { totalItems: 1, totalPages: 1 },
          })
        )
      }),
      rest.post("http://localhost/api/adapter/agency", (_req, res, ctx) => {
        return res(ctx.json(newAgency))
      }),
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(ctx.json(user))
      })
    )

    render(
      <ToastProvider>
        <AuthContext.Provider
          value={{
            profile: {
              ...user,
              jurisdictions: [{ ...jurisdiction, id: "jurisdiction1", name: "Test Jurisdiction" }],
              listings: [],
            },
            agencyService: new AgencyService(),
            doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
              featureFlag === FeatureFlagEnum.enableHousingAdvocate,
          }}
        >
          <SettingsAgencies />
        </AuthContext.Provider>
      </ToastProvider>
    )

    const addButton = screen.getByRole("button", { name: /add/i })
    await userEvent.click(addButton)

    const addDrawer = await screen.findByRole("dialog")
    expect(addDrawer).toBeInTheDocument()

    const nameInput = within(addDrawer).getByRole("textbox", { name: /agency name/i })
    await userEvent.type(nameInput, "New Agency")

    const saveButton = screen.getByRole("button", { name: /save/i })
    await userEvent.click(saveButton)

    expect(
      screen.queryByText(/looks like something went wrong. please try again./i)
    ).not.toBeInTheDocument()

    const cells = await screen.findAllByRole("gridcell")
    expect(cells[0]).toHaveTextContent(newAgency.name)
  })

  it("should update an agency successfully", async () => {
    window.URL.createObjectURL = jest.fn()
    const updatedAgency: Agency = {
      ...mockAgency,
      name: "Updated Agency",
    }

    server.use(
      rest.get("http://localhost:3100/agency", (_req, res, ctx) => {
        return res(
          ctx.json({
            items: [mockAgency],
            meta: { totalItems: 1, totalPages: 1 },
          })
        )
      }),
      rest.get("http://localhost/api/adapter/agency", (_req, res, ctx) => {
        return res(
          ctx.json({
            items: [updatedAgency],
            meta: { totalItems: 1, totalPages: 1 },
          })
        )
      }),
      rest.put("http://localhost/api/adapter/agency", (_req, res, ctx) => {
        return res(ctx.json(updatedAgency))
      }),
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(ctx.json(user))
      }),
      rest.get("http://localhost:3100/user/list", (_req, res, ctx) => {
        return res(ctx.json({ items: [], meta: { totalItems: 0, totalPages: 0 } }))
      })
    )

    render(
      <ToastProvider>
        <AuthContext.Provider
          value={{
            profile: {
              ...user,
              jurisdictions: [{ ...jurisdiction, id: "jurisdiction1", name: "Test Jurisdiction" }],
              listings: [],
            },
            agencyService: new AgencyService(),
            userService: new UserService(),
            doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
              featureFlag === FeatureFlagEnum.enableHousingAdvocate,
          }}
        >
          <SettingsAgencies />
        </AuthContext.Provider>
      </ToastProvider>
    )

    expect(await screen.findByText(mockAgency.name)).toBeInTheDocument()
    const editButton = await screen.findByTestId(`agency-edit-icon: ${mockAgency.name}`)
    await userEvent.click(editButton)

    const editDrawer = await screen.findByRole("dialog")
    expect(editDrawer).toBeInTheDocument()
    expect(
      within(editDrawer).getByRole("heading", { level: 1, name: /edit agency/i })
    ).toBeInTheDocument()

    const nameInput = within(editDrawer).getByRole("textbox", { name: /agency name/i })
    await userEvent.type(nameInput, updatedAgency.name)

    const saveButton = screen.getByRole("button", { name: /save/i })
    await userEvent.click(saveButton)

    expect(
      screen.queryByText(/looks like something went wrong. please try again./i)
    ).not.toBeInTheDocument()

    expect(await screen.queryByText(mockAgency.name)).not.toBeInTheDocument()
    expect(await screen.findByText(updatedAgency.name)).toBeInTheDocument()
  })

  it("should redirect to unauthorized if user is partner", async () => {
    window.URL.createObjectURL = jest.fn()
    const { pushMock } = mockNextRouter()

    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(ctx.json(user))
      }),
      rest.get("http://localhost:3100/agency", (_req, res, ctx) => {
        return res(ctx.json([]))
      })
    )

    render(
      <AuthContext.Provider
        value={{
          profile: {
            ...user,
            userRoles: {
              ...user.userRoles,
              isPartner: true,
              isAdmin: false,
              isSupportAdmin: false,
              isSuperAdmin: false,
            },
            jurisdictions: [{ ...jurisdiction, id: "jurisdiction1", name: "Test Jurisdiction" }],
            listings: [],
          },
          agencyService: new AgencyService(),
          doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
            featureFlag === FeatureFlagEnum.enableHousingAdvocate,
        }}
      >
        <SettingsAgencies />
      </AuthContext.Provider>
    )

    await screen.findByText("Settings")
    expect(pushMock).toHaveBeenCalledWith("/unauthorized")
  })

  it("should redirect to unauthorized if housing advocate feature flag is off", async () => {
    window.URL.createObjectURL = jest.fn()
    const { pushMock } = mockNextRouter()

    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(ctx.json(user))
      }),
      rest.get("http://localhost:3100/agency", (_req, res, ctx) => {
        return res(ctx.json([]))
      })
    )

    render(
      <AuthContext.Provider
        value={{
          profile: {
            ...user,
            jurisdictions: [{ ...jurisdiction, id: "jurisdiction1", name: "Test Jurisdiction" }],
            listings: [],
          },
          agencyService: new AgencyService(),
          doJurisdictionsHaveFeatureFlagOn: () => false,
        }}
      >
        <SettingsAgencies />
      </AuthContext.Provider>
    )

    await screen.findAllByRole("heading", { level: 1, name: "Settings" })
    expect(pushMock).toHaveBeenCalledWith("/unauthorized")
  })

  it("should display 'None' when updatedAt is missing", async () => {
    window.URL.createObjectURL = jest.fn()
    const agencyWithoutDate = {
      ...mockAgency,
      updatedAt: null,
    } as Agency

    server.use(
      rest.get("http://localhost:3100/agency", (_req, res, ctx) => {
        return res(
          ctx.json({
            items: [agencyWithoutDate],
            meta: { totalItems: 1, totalPages: 1 },
          })
        )
      }),
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(ctx.json(user))
      })
    )
    render(
      <AuthContext.Provider
        value={{
          profile: {
            ...user,
            jurisdictions: [{ ...jurisdiction, id: "jurisdiction1", name: "Test Jurisdiction" }],
            listings: [],
          },
          agencyService: new AgencyService(),
          doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
            featureFlag === FeatureFlagEnum.enableHousingAdvocate,
        }}
      >
        <SettingsAgencies />
      </AuthContext.Provider>
    )

    const cells = await screen.findAllByRole("gridcell")
    const updatedCell = cells[1]
    expect(updatedCell).toHaveTextContent("None")
  })
})
