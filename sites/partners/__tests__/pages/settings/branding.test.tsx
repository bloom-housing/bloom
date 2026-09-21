import React from "react"
import { setupServer } from "msw/lib/node"
import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { rest } from "msw"
import { addTranslation } from "@bloom-housing/ui-components"
import { AuthContext, MessageContext } from "@bloom-housing/shared-helpers"
import {
  FeatureFlagEnum,
  JurisdictionsService,
  LanguagesEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { user } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { mockNextRouter, render } from "../../testUtils"
import SettingsBranding from "../../../src/pages/settings/branding"

// The suite supplies the strings it asserts on, so editing the shipped copy cannot break it.
addTranslation({
  "branding.primary": "test:primary",
  "branding.secondary": "test:secondary",
  "branding.baseColor": "test:base",
  "branding.shade.dark": "test:dark",
  "branding.fontFamily": "test:fontFamily",
  "branding.fontUrl": "test:fontUrl",
  "branding.alertSaved": "test:alertSaved",
  "t.save": "test:save",
  "t.discard": "test:discard",
  "t.delete": "test:delete",
  "branding.remove": "test:remove",
  "branding.logo": "test:logo",
})

const server = setupServer()

let pushMock: jest.Mock
let toasts: string[] = []
let savedBody: Record<string, unknown> | null = null

// The first fetch goes straight to the API; once AuthProvider has configured axios the rest go
// through the adapter path, so both are answered.
const READ_PATHS = [
  "http://localhost:3100/jurisdictions/:jurisdictionId",
  "http://localhost/api/adapter/jurisdictions/:jurisdictionId",
]
const SAVE_PATHS = READ_PATHS.map((path) => `${path}/brand`)

const respondWithBrand = (brand: unknown) =>
  server.use(
    ...READ_PATHS.map((path) =>
      rest.get(path, (_req, res, ctx) => res(ctx.json({ id: "jurisdiction1", brand })))
    )
  )

const acceptSave = () =>
  server.use(
    ...SAVE_PATHS.map((path) =>
      rest.put(path, async (req, res, ctx) => {
        savedBody = await req.json()
        return res(ctx.json({ id: "jurisdiction1", brand: null }))
      })
    )
  )

beforeAll(() => server.listen())

beforeEach(() => {
  toasts = []
  savedBody = null
  pushMock = mockNextRouter().pushMock
  server.use(rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => res(ctx.json(user))))
  respondWithBrand(null)
})

afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const adminProfile = {
  ...user,
  userRoles: { isAdmin: true },
  jurisdictions: [
    {
      id: "jurisdiction1",
      name: "Bloomington",
      languages: [LanguagesEnum.en],
      featureFlags: [{ name: FeatureFlagEnum.enableDbDrivenBranding, active: true }],
    },
  ],
  listings: [],
}

const renderPage = (profileOverrides = {}, flagOn = true) =>
  render(
    <MessageContext.Provider
      value={{
        toastMessagesRef: { current: [] },
        addToast: (message: string) => {
          toasts.push(message)
        },
      }}
    >
      <AuthContext.Provider
        value={{
          profile: { ...adminProfile, ...profileOverrides },
          jurisdictionsService: new JurisdictionsService(),
          doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
            flagOn && featureFlag === FeatureFlagEnum.enableDbDrivenBranding,
        }}
      >
        <SettingsBranding />
      </AuthContext.Provider>
    </MessageContext.Provider>
  )

describe("settings/branding", () => {
  it("sends a non-admin to unauthorized", () => {
    renderPage({ userRoles: { isJurisdictionalAdmin: true } })

    expect(pushMock).toHaveBeenCalledWith("/unauthorized")
  })

  it("sends an admin to unauthorized when the flag is off", () => {
    renderPage({}, false)

    expect(pushMock).toHaveBeenCalledWith("/unauthorized")
  })

  it("renders the colour and font fields for an admin", async () => {
    renderPage()

    expect(await screen.findByText("test:primary")).toBeInTheDocument()
    expect(screen.getByText("test:secondary")).toBeInTheDocument()
    expect(screen.getByLabelText("test:fontFamily")).toBeInTheDocument()
    expect(pushMock).not.toHaveBeenCalledWith("/unauthorized")
  })

  it("leaves a derived shade out of the save, so it keeps deriving", async () => {
    // A read returns every shade whether it was stored or derived.
    respondWithBrand({
      primary: {
        base: "#773E98",
        dark: "#693786",
        darker: "#4C2861",
        light: "#EFE6F5",
        lighter: "#F8F4FB",
      },
    })
    acceptSave()
    renderPage()

    await waitFor(() => expect(screen.getAllByDisplayValue("#773E98").length).toBeGreaterThan(0))
    await userEvent.click(screen.getByText("test:save"))

    await waitFor(() => expect(savedBody).not.toBeNull())
    expect(savedBody.brand).toEqual({ primary: { base: "#773E98" } })
    expect(toasts).toContain("test:alertSaved")
  })

  it("keeps a shade the admin set explicitly", async () => {
    respondWithBrand({ primary: { base: "#773E98", dark: "#6E2598" } })
    acceptSave()
    renderPage()

    await waitFor(() => expect(screen.getAllByDisplayValue("#6E2598").length).toBe(1))
    await userEvent.click(screen.getByText("test:save"))

    await waitFor(() => expect(savedBody).not.toBeNull())
    expect(savedBody.brand).toEqual({ primary: { base: "#773E98", dark: "#6E2598" } })
  })

  it("shows a message the service raised itself rather than a generic toast", async () => {
    // The font pairing rule throws a BadRequestException, so message is a string not an array.
    server.use(
      ...SAVE_PATHS.map((path) =>
        rest.put(path, (_req, res, ctx) =>
          res(
            ctx.status(400),
            ctx.json({ message: "a brand font needs both a fontUrl and a family name" })
          )
        )
      )
    )
    respondWithBrand({ primary: { base: "#773E98" } })
    renderPage()

    await waitFor(() => expect(screen.getAllByDisplayValue("#773E98").length).toBeGreaterThan(0))
    await userEvent.click(screen.getByText("test:save"))

    expect(
      await screen.findByText("a brand font needs both a fontUrl and a family name")
    ).toBeInTheDocument()
    expect(toasts).toHaveLength(0)
  })

  it("saves with no colors set, since a logo needs none", async () => {
    acceptSave()
    renderPage()

    await screen.findByText("test:primary")
    await userEvent.click(screen.getByText("test:save"))

    await waitFor(() => expect(savedBody).not.toBeNull())
    expect(savedBody).toEqual({})
  })

  it("clears the brand and both assets from the remove action", async () => {
    respondWithBrand({ primary: { base: "#773E98" } })
    acceptSave()
    renderPage()

    await waitFor(() => expect(screen.getAllByDisplayValue("#773E98").length).toBeGreaterThan(0))
    await userEvent.click(screen.getByText("test:remove"))
    // The button in the dialog, not the one that opened it.
    const confirm = screen.getAllByText("test:remove").pop()
    await userEvent.click(confirm)

    await waitFor(() => expect(savedBody).not.toBeNull())
    expect(savedBody).toEqual({ brand: null, logoFileId: null, faviconFileId: null })
  })

  it("disconnects a logo when the admin deletes it", async () => {
    respondWithBrand({ primary: { base: "#773E98" }, logoUrl: "https://example.test/logo.png" })
    acceptSave()
    renderPage()

    await waitFor(() => expect(document.getElementById("brand-logo-upload-delete")).not.toBeNull())
    await userEvent.click(document.getElementById("brand-logo-upload-delete"))
    await userEvent.click(screen.getByText("test:save"))

    await waitFor(() => expect(savedBody).not.toBeNull())
    expect(savedBody.logoFileId).toBeNull()
  })

  it("puts a server message on the field it names", async () => {
    server.use(
      ...SAVE_PATHS.map((path) =>
        rest.put(path, (_req, res, ctx) =>
          res(ctx.status(400), ctx.json({ message: ["fontUrl must be a URL address"] }))
        )
      )
    )
    respondWithBrand({ primary: { base: "#773E98" } })
    renderPage()

    await waitFor(() => expect(screen.getAllByDisplayValue("#773E98").length).toBeGreaterThan(0))
    await userEvent.click(screen.getByText("test:save"))

    expect(await screen.findByText("fontUrl must be a URL address")).toBeInTheDocument()
  })
})
