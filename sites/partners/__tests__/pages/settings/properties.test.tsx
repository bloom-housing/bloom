import React from "react"
import { setupServer } from "msw/lib/node"
import { screen, within } from "@testing-library/react"
import { rest } from "msw"
import { AuthContext, MessageContext, MessageProvider } from "@bloom-housing/shared-helpers"
import { Toast } from "@bloom-housing/ui-seeds"
import {
  FeatureFlagEnum,
  PropertiesService,
  Property,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { mockNextRouter, render } from "../../testUtils"
import SettingsProperties from "../../../src/pages/settings/properties"
import { jurisdiction, user } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import dayjs from "dayjs"
import userEvent from "@testing-library/user-event"
import { ToastProps } from "@bloom-housing/ui-seeds/src/blocks/Toast"

const server = setupServer()

const mockProperty: Property = {
  id: "property1",
  name: "Test Property",
  description: "Test Description",
  url: "http://example.com",
  urlTitle: "Example",
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

describe("<SettingsProperties>", () => {
  it("should render `none` when no properties exist", () => {
    server.use(
      rest.get("http://localhost:3100/properties", (_req, res, ctx) => {
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
          propertiesService: new PropertiesService(),
          doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
            featureFlag === FeatureFlagEnum.enableProperties,
        }}
      >
        <SettingsProperties />
      </AuthContext.Provider>
    )

    expect(screen.getByRole("heading", { level: 1, name: "Settings" })).toBeInTheDocument()
    expect(screen.getByRole("tab", { name: "Properties" })).toBeInTheDocument()
    expect(screen.getByRole("tab", { name: "Preferences" })).toBeInTheDocument()

    expect(screen.getByRole("button", { name: "Add property" })).toBeInTheDocument()

    const headers = screen.getAllByRole("columnheader")
    expect(headers).toHaveLength(5)
    expect(headers[0]).toHaveTextContent("Name")
    expect(headers[1]).toHaveTextContent("Description")
    expect(headers[2]).toHaveTextContent("URL")
    expect(headers[3]).toHaveTextContent("Update date")
    expect(headers[4]).toHaveTextContent("Actions")

    expect(screen.queryAllByRole("gridcell")).toHaveLength(0)
  })

  it("should not render tabs if only properties is on", async () => {
    server.use(
      rest.get("http://localhost:3100/properties", (_req, res, ctx) => {
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
          propertiesService: new PropertiesService(),
          doJurisdictionsHaveFeatureFlagOn: (featureFlag) => {
            if (featureFlag === FeatureFlagEnum.enableProperties) return true
            if (featureFlag === FeatureFlagEnum.disableListingPreferences) return true
            return false
          },
        }}
      >
        <SettingsProperties />
      </AuthContext.Provider>
    )
    expect(await screen.findByRole("heading", { name: "Settings" })).toBeInTheDocument()
    expect(screen.queryByRole("tablist")).not.toBeInTheDocument()
    expect(screen.queryByRole("tab", { name: "Preferences" })).not.toBeInTheDocument()
  })

  it("should render the properties table", async () => {
    window.URL.createObjectURL = jest.fn()
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost:3100/properties", (_req, res, ctx) => {
        return res(
          ctx.json({
            items: [mockProperty],
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
          propertiesService: new PropertiesService(),
          doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
            featureFlag === FeatureFlagEnum.enableProperties,
        }}
      >
        <SettingsProperties />
      </AuthContext.Provider>
    )

    const headers = screen.getAllByRole("columnheader")
    expect(headers).toHaveLength(5)
    expect(headers[0]).toHaveTextContent("Name")
    expect(headers[1]).toHaveTextContent("Description")
    expect(headers[2]).toHaveTextContent("URL")
    expect(headers[3]).toHaveTextContent("Update date")
    expect(headers[4]).toHaveTextContent("Actions")

    const cells = await screen.findAllByRole("gridcell")

    expect(cells).toHaveLength(5)
    expect(cells[0]).toHaveTextContent(mockProperty.name)
    expect(cells[1]).toHaveTextContent(mockProperty.description)
    const firstRowUrl = await within(cells[2]).findByRole("link", { name: mockProperty.url })
    expect(firstRowUrl).toBeInTheDocument()
    expect(firstRowUrl).toHaveAttribute("href", mockProperty.url)
    expect(cells[3]).toHaveTextContent(dayjs(mockProperty.updatedAt).format("MM/DD/YYYY"))
    const firstRowActions = await within(cells[4]).findAllByRole("button")
    expect(firstRowActions).toHaveLength(3)
    expect(firstRowActions[0]).toHaveAttribute(
      "data-testid",
      `property-edit-icon: ${mockProperty.name}`
    )
    expect(firstRowActions[1]).toHaveAttribute(
      "data-testid",
      `property-copy-icon: ${mockProperty.name}`
    )
    expect(firstRowActions[2]).toHaveAttribute(
      "data-testid",
      `property-delete-icon: ${mockProperty.name}`
    )
  })

  it("should render jurisdiction column when user has multiple jurisdictions", async () => {
    server.use(
      rest.get("http://localhost:3100/properties", (_req, res, ctx) => {
        return res(
          ctx.json({
            items: [
              {
                ...mockProperty,
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
          propertiesService: new PropertiesService(),
          doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
            featureFlag === FeatureFlagEnum.enableProperties,
        }}
      >
        <SettingsProperties />
      </AuthContext.Provider>
    )

    const headers = screen.getAllByRole("columnheader")
    expect(headers).toHaveLength(6)
    expect(headers[0]).toHaveTextContent("Name")
    expect(headers[1]).toHaveTextContent("Description")
    expect(headers[2]).toHaveTextContent("URL")
    expect(headers[3]).toHaveTextContent("Jurisdiction")
    expect(headers[4]).toHaveTextContent("Update date")
    expect(headers[5]).toHaveTextContent("Actions")

    const cells = await screen.findAllByRole("gridcell")
    expect(cells[3]).toHaveTextContent(mockProperty.jurisdictions.name)
  })

  it("should open drawer when Add button is clicked", async () => {
    server.use(
      rest.get("http://localhost:3100/properties", (_req, res, ctx) => {
        return res(
          ctx.json({
            items: [mockProperty],
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
              { id: "jurisdiction1", name: "Jurisdiction 1" } as Jurisdiction,
              { id: "jurisdiction2", name: "Jurisdiction 2" } as Jurisdiction,
            ],
            listings: [],
          },
          propertiesService: new PropertiesService(),
          doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
            featureFlag === FeatureFlagEnum.enableProperties,
        }}
      >
        <SettingsProperties />
      </AuthContext.Provider>
    )

    const addButton = screen.getByRole("button", { name: /add/i })
    await userEvent.click(addButton)

    const addDialog = await screen.findByRole("dialog")
    expect(addDialog).toBeInTheDocument()
    expect(
      within(addDialog).getByRole("heading", { level: 1, name: /add property/i })
    ).toBeInTheDocument()

    expect(within(addDialog).getByRole("textbox", { name: /property name/i })).toBeInTheDocument()
    expect(
      within(addDialog).getByRole("textbox", { name: /property description/i })
    ).toBeInTheDocument()
    expect(within(addDialog).getByRole("textbox", { name: /website url/i })).toBeInTheDocument()
    expect(within(addDialog).getByRole("textbox", { name: /link title/i })).toBeInTheDocument()
    expect(within(addDialog).getByRole("combobox", { name: /jurisdiction/i })).toBeInTheDocument()
    expect(within(addDialog).getByRole("option", { name: "Select one" })).toBeInTheDocument()
    expect(within(addDialog).getByRole("option", { name: "Jurisdiction 1" })).toBeInTheDocument()
    expect(within(addDialog).getByRole("option", { name: "Jurisdiction 2" })).toBeInTheDocument()
    expect(within(addDialog).getByRole("button", { name: "Save" })).toBeInTheDocument()
  })

  it("should open drawer with property data when edit icon is clicked", async () => {
    server.use(
      rest.get("http://localhost:3100/properties", (_req, res, ctx) => {
        return res(
          ctx.json({
            items: [mockProperty],
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
          propertiesService: new PropertiesService(),
          doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
            featureFlag === FeatureFlagEnum.enableProperties,
        }}
      >
        <SettingsProperties />
      </AuthContext.Provider>
    )

    await screen.findByText(mockProperty.name)
    const editButton = await screen.findByTestId(`property-edit-icon: ${mockProperty.name}`)
    await userEvent.click(editButton)

    const editDialog = await screen.findByRole("dialog")
    expect(editDialog)
    const labelInput = within(editDialog).getByRole("textbox", { name: /property name/i })
    expect(labelInput).toHaveValue(mockProperty.name)
    const descriptionInput = within(editDialog).getByRole("textbox", {
      name: /property description/i,
    })
    expect(descriptionInput).toHaveValue(mockProperty.description)
    const urlInput = within(editDialog).getByRole("textbox", { name: /website url/i })
    expect(urlInput).toHaveValue(mockProperty.url)
    const titleInput = within(editDialog).getByRole("textbox", { name: /link title/i })
    expect(titleInput).toHaveValue(mockProperty.urlTitle)
  })

  it("should create a property successfully", async () => {
    const newProperty: Property = {
      ...mockProperty,
      id: "new-property",
      name: "New Property",
    }

    server.use(
      rest.get("http://localhost:3100/properties", (_req, res, ctx) => {
        return res(
          ctx.json({
            items: [mockProperty],
            meta: { totalItems: 1, totalPages: 1 },
          })
        )
      }),
      rest.get("http://localhost/api/adapter/properties", (_req, res, ctx) => {
        return res(
          ctx.json({
            items: [newProperty],
            meta: { totalItems: 1, totalPages: 1 },
          })
        )
      }),
      rest.post("http://localhost/api/adapter/properties", (_req, res, ctx) => {
        return res(ctx.json(newProperty))
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
            propertiesService: new PropertiesService(),
            doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
              featureFlag === FeatureFlagEnum.enableProperties,
          }}
        >
          <SettingsProperties />
        </AuthContext.Provider>
      </ToastProvider>
    )

    const addButton = screen.getByRole("button", { name: /add/i })
    await userEvent.click(addButton)

    const addDrawer = await screen.findByRole("dialog")
    expect(addDrawer).toBeInTheDocument()

    expect(
      within(addDrawer).getByRole("heading", { level: 1, name: /add property/i })
    ).toBeInTheDocument()

    const labelInput = within(addDrawer).getByRole("textbox", { name: /property name/i })
    expect(labelInput).toBeInTheDocument()
    await userEvent.type(labelInput, "New Property")

    const saveButton = screen.getByRole("button", { name: /save/i })
    await userEvent.click(saveButton)

    expect(
      screen.queryByText(/looks like something went wrong. please try again./i)
    ).not.toBeInTheDocument()

    const cells = await screen.findAllByRole("gridcell")

    expect(cells).toHaveLength(5)
    expect(cells[0]).toHaveTextContent(newProperty.name)
    expect(cells[1]).toHaveTextContent(newProperty.description)
    const firstRowUrl = await within(cells[2]).findByRole("link", { name: newProperty.url })
    expect(firstRowUrl).toBeInTheDocument()
    expect(firstRowUrl).toHaveAttribute("href", newProperty.url)
    expect(cells[3]).toHaveTextContent(dayjs(newProperty.updatedAt).format("MM/DD/YYYY"))
    const firstRowActions = await within(cells[4]).findAllByRole("button")
    expect(firstRowActions).toHaveLength(3)
    expect(firstRowActions[0]).toHaveAttribute(
      "data-testid",
      `property-edit-icon: ${newProperty.name}`
    )
    expect(firstRowActions[1]).toHaveAttribute(
      "data-testid",
      `property-copy-icon: ${newProperty.name}`
    )
    expect(firstRowActions[2]).toHaveAttribute(
      "data-testid",
      `property-delete-icon: ${newProperty.name}`
    )
  })

  it("should update a property successfully", async () => {
    window.URL.createObjectURL = jest.fn()
    const updatedProperty: Property = {
      ...mockProperty,
      name: "Updated Property",
      description: "Updated Description",
    }

    server.use(
      rest.get("http://localhost:3100/properties", (_req, res, ctx) => {
        return res(
          ctx.json({
            items: [mockProperty],
            meta: { totalItems: 1, totalPages: 1 },
          })
        )
      }),
      rest.get("http://localhost/api/adapter/properties", (_req, res, ctx) => {
        return res(
          ctx.json({
            items: [updatedProperty],
            meta: { totalItems: 1, totalPages: 1 },
          })
        )
      }),
      rest.put("http://localhost/api/adapter/properties", (_req, res, ctx) => {
        return res(ctx.json(updatedProperty))
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
            propertiesService: new PropertiesService(),
            doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
              featureFlag === FeatureFlagEnum.enableProperties,
          }}
        >
          <SettingsProperties />
        </AuthContext.Provider>
      </ToastProvider>
    )

    expect(await screen.findByText(mockProperty.name)).toBeInTheDocument()
    const editButton = await screen.findByTestId(`property-edit-icon: ${mockProperty.name}`)
    expect(editButton).toBeInTheDocument()
    await userEvent.click(editButton)

    const editDrawer = await screen.findByRole("dialog")
    expect(editDrawer).toBeInTheDocument()

    expect(
      within(editDrawer).getByRole("heading", { level: 1, name: /edit property/i })
    ).toBeInTheDocument()

    const labelInput = within(editDrawer).getByRole("textbox", { name: /property name/i })
    await userEvent.type(labelInput, updatedProperty.name)

    const saveButton = screen.getByRole("button", { name: /save/i })
    await userEvent.click(saveButton)

    expect(
      screen.queryByText(/looks like something went wrong. please try again./i)
    ).not.toBeInTheDocument()

    expect(await screen.queryByText(mockProperty.name)).not.toBeInTheDocument()
    expect(await screen.findByText(updatedProperty.name)).toBeInTheDocument()
  })

  it("should redirect to unauthorized if user is partner", async () => {
    window.URL.createObjectURL = jest.fn()
    const { pushMock } = mockNextRouter()

    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(
          ctx.json({
            ...user,
            userRoles: {
              isPartner: false,
              isAdmin: false,
              isSupportAdmin: false,
            },
          })
        )
      }),
      rest.get("http://localhost:3100/properties", (_req, res, ctx) => {
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
          propertiesService: new PropertiesService(),
          doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
            featureFlag === FeatureFlagEnum.enableProperties,
        }}
      >
        <SettingsProperties />
      </AuthContext.Provider>
    )

    await screen.findByText("Settings")
    expect(pushMock).toHaveBeenCalledWith("/unauthorized")
  })

  it("should redirect to unauthorized if properties feature flag is off", async () => {
    window.URL.createObjectURL = jest.fn()
    const { pushMock } = mockNextRouter()

    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(ctx.json(user))
      }),
      rest.get("http://localhost:3100/properties", (_req, res, ctx) => {
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
          propertiesService: new PropertiesService(),
          doJurisdictionsHaveFeatureFlagOn: () => false,
        }}
      >
        <SettingsProperties />
      </AuthContext.Provider>
    )

    await screen.findAllByRole("heading", { level: 1, name: "Settings" })
    expect(pushMock).toHaveBeenCalledWith("/unauthorized")
  })

  it("should render URL as a link in the table", async () => {
    window.URL.createObjectURL = jest.fn()
    server.use(
      rest.get("http://localhost:3100/properties", (_req, res, ctx) => {
        return res(
          ctx.json({
            items: [mockProperty],
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
          propertiesService: new PropertiesService(),
          doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
            featureFlag === FeatureFlagEnum.enableProperties,
        }}
      >
        <SettingsProperties />
      </AuthContext.Provider>
    )

    const cells = await screen.findAllByRole("gridcell")
    const link = await within(cells[2]).findByRole("link", { name: mockProperty.url })
    expect(link).toHaveAttribute("href", mockProperty.url)
    expect(link).toHaveAttribute("target", "_blank")
    expect(link).toHaveTextContent(mockProperty.url)
  })

  it("should display 'None' when updatedAt is missing", async () => {
    window.URL.createObjectURL = jest.fn()
    const propertyWithoutDate = {
      ...mockProperty,
      updatedAt: null,
    } as Property

    server.use(
      rest.get("http://localhost:3100/properties", (_req, res, ctx) => {
        return res(
          ctx.json({
            items: [propertyWithoutDate],
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
          propertiesService: new PropertiesService(),
          doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
            featureFlag === FeatureFlagEnum.enableProperties,
        }}
      >
        <SettingsProperties />
      </AuthContext.Provider>
    )

    const cells = await screen.findAllByRole("gridcell")
    const updatedCell = cells[3]
    expect(updatedCell).toHaveTextContent("None")
  })
})
