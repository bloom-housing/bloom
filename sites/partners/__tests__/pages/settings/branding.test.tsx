import React from "react"
import { setupServer } from "msw/lib/node"
import { screen, waitFor, within } from "@testing-library/react"
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
import * as helpers from "../../../src/lib/helpers"
import SettingsBranding from "../../../src/pages/settings/branding"

jest.mock("../../../src/lib/helpers", () => ({
  ...jest.requireActual("../../../src/lib/helpers"),
  fileUploader: jest.fn(),
}))

// The suite supplies the strings it asserts on, so editing the shipped copy cannot break it.
addTranslation({
  "branding.primary": "test:primary",
  "branding.secondary": "test:secondary",
  "branding.baseColor": "test:base",
  "branding.contrastWarning": "test:contrast %{field} %{ratio}",
  "branding.contrastWarningBodyText": "test:contrastBody %{field} %{ratio}",
  "branding.contrastAction": "test:use %{suggestion}",
  "branding.lightnessWarning": "test:tooDark",
  "t.dismiss": "test:dismiss",
  "branding.shade.dark": "test:dark",
  "branding.shade.darker": "test:darker",
  "branding.shade.light": "test:light",
  "branding.shade.lighter": "test:lighter",
  "branding.fontFamily": "test:fontFamily",
  "branding.fontUrl": "test:fontUrl",
  "branding.alertSaved": "test:alertSaved",
  "t.save": "test:save",
  "t.discard": "test:discard",
  "t.delete": "test:delete",
  "branding.remove": "test:remove",
  "branding.logo": "test:logo",
  "branding.alertLoadFailed": "test:loadFailed",
})

const RAMP_WARNING_IDS = ["primaryDark", "primaryDarker", "primaryLight", "primaryLighter"].map(
  (field) => `${field}-contrast`
)

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

  it("shows an alert when the jurisdiction cannot be read", async () => {
    server.use(
      ...READ_PATHS.map((path) => rest.get(path, (_req, res, ctx) => res(ctx.status(500))))
    )
    renderPage()

    expect(await screen.findByText("test:loadFailed")).toBeInTheDocument()
  })

  it("renders no form for an admin with no flag-enabled jurisdiction", async () => {
    // authorized comes from the flag across all jurisdictions, so the page opens with an empty list.
    renderPage({ jurisdictions: [] })

    await waitFor(() => expect(pushMock).not.toHaveBeenCalledWith("/unauthorized"))
    expect(screen.queryByText("test:save")).not.toBeInTheDocument()
  })

  it("updates the preview as the admin types, without a save", async () => {
    respondWithBrand(null)
    renderPage()

    const base = (await screen.findAllByLabelText("test:base"))[0]
    await userEvent.type(base, "#773E98")

    await waitFor(() =>
      expect(screen.getByTestId("brand-preview")).toHaveStyle({
        "--seeds-color-primary": "#773E98",
      })
    )
    // The derived shades track the base without the admin entering them.
    expect(screen.getByTestId("brand-preview")).toHaveStyle({
      "--seeds-color-primary-dark": "#693786",
    })
    expect(savedBody).toBeNull()
  })

  it("warns when a color fails AA and clears the warning once it is fixed", async () => {
    // #EEDD00 is 1.4:1 against white; #773E98 passes.
    respondWithBrand({ primary: { base: "#EEDD00" } })
    renderPage()

    expect(await screen.findByTestId("primaryBase-contrast")).toBeInTheDocument()

    const base = screen.getAllByLabelText("test:base")[0]
    await userEvent.clear(base)
    await userEvent.type(base, "#773E98")

    await waitFor(() =>
      expect(screen.queryByTestId("primaryBase-contrast")).not.toBeInTheDocument()
    )
  })

  it("applies the suggested color into the base field", async () => {
    respondWithBrand({ primary: { base: "#EEDD00" } })
    renderPage()

    await waitFor(() => expect(document.getElementById("primaryBase-apply")).not.toBeNull())
    await userEvent.click(document.getElementById("primaryBase-apply"))

    const base = screen.getAllByLabelText("test:base")[0] as HTMLInputElement
    await waitFor(() => expect(base.value).toEqual("#807600"))
    await waitFor(() =>
      expect(screen.queryByTestId("primaryBase-contrast")).not.toBeInTheDocument()
    )
  })

  it("dismisses a warning without saving the form", async () => {
    // A seeds Alert closes itself, but its close button has no type, so inside a form it submits.
    respondWithBrand({ primary: { base: "#EEDD00" } })
    acceptSave()
    renderPage()

    await waitFor(() => expect(document.getElementById("primaryBase-dismiss")).not.toBeNull())
    await userEvent.click(document.getElementById("primaryBase-dismiss"))

    await waitFor(() =>
      expect(screen.queryByTestId("primaryBase-contrast")).not.toBeInTheDocument()
    )
    expect(savedBody).toBeNull()
  })

  it("warns again when the admin picks a different failing color", async () => {
    respondWithBrand({ primary: { base: "#EEDD00" } })
    renderPage()

    await waitFor(() => expect(document.getElementById("primaryBase-dismiss")).not.toBeNull())
    await userEvent.click(document.getElementById("primaryBase-dismiss"))
    await waitFor(() =>
      expect(screen.queryByTestId("primaryBase-contrast")).not.toBeInTheDocument()
    )

    const base = screen.getAllByLabelText("test:base")[0]
    await userEvent.clear(base)
    await userEvent.type(base, "#77AA33")

    expect(await screen.findByTestId("primaryBase-contrast")).toBeInTheDocument()
  })

  it("holds the warning back until typing settles", async () => {
    // HEX_COLOR accepts three digits, so typing #0070D0 passes through #07D, which fails AA.
    // Warning on that would announce a colour the admin never chose.
    respondWithBrand(null)
    renderPage()

    const base = (await screen.findAllByLabelText("test:base"))[0]
    await userEvent.type(base, "#EEDD00")

    expect(screen.queryByTestId("primaryBase-contrast")).not.toBeInTheDocument()
    expect(await screen.findByTestId("primaryBase-contrast")).toBeInTheDocument()
  })

  it("shows a ratio that fell short as short, not as the threshold", async () => {
    // #777777 is 4.4781:1. Rounded rather than floored it would read "below the 4.5 minimum" at 4.5.
    respondWithBrand({ primary: { base: "#777777" } })
    renderPage()

    expect(await screen.findByTestId("primaryBase-contrast")).toHaveTextContent(
      "test:contrast test:base 4.4"
    )
  })

  it("announces the warning politely rather than interrupting", async () => {
    respondWithBrand({ primary: { base: "#EEDD00" } })
    renderPage()

    expect(await screen.findByTestId("primaryBase-contrast")).toHaveAttribute("role", "status")
  })

  it("warns when a base is too dark for its shades to differ", async () => {
    respondWithBrand({ primary: { base: "#111111" } })
    renderPage()

    expect(await screen.findByTestId("primaryBase-lightness")).toBeInTheDocument()
    expect(screen.queryByTestId("primaryBase-contrast")).not.toBeInTheDocument()
  })

  it("checks the secondary base too", async () => {
    respondWithBrand({ primary: { base: "#773E98" }, secondary: { base: "#EEDD00" } })
    renderPage()

    expect(await screen.findByTestId("secondaryBase-contrast")).toBeInTheDocument()
    expect(screen.queryByTestId("primaryBase-contrast")).not.toBeInTheDocument()
  })

  it("warns when an explicit dark shade is unreadable under white text", async () => {
    // ui-seeds puts white on primary-dark for the button hover state.
    respondWithBrand({ primary: { base: "#773E98", dark: "#FFEE00" } })
    renderPage()

    expect(await screen.findByTestId("primaryDark-contrast")).toBeInTheDocument()
    expect(screen.queryByTestId("primaryBase-contrast")).not.toBeInTheDocument()
  })

  it("warns when an explicit lighter shade is unreadable under body text", async () => {
    // primary-lighter backs whole page sections on the public site, under dark body text.
    respondWithBrand({ primary: { base: "#773E98", lighter: "#333333" } })
    renderPage()

    expect(await screen.findByTestId("primaryLighter-contrast")).toBeInTheDocument()
  })

  it("reads a light shade against body text, not against white", async () => {
    // A correct light shade fails against white, so checking it that way would warn on every ramp.
    respondWithBrand({ primary: { base: "#773E98", light: "#EFE6F5" } })
    renderPage()

    await screen.findAllByLabelText("test:base")
    expect(screen.queryByTestId("primaryLight-contrast")).not.toBeInTheDocument()
  })

  it("offers the derived value for a failing shade, so the ramp keeps its order", async () => {
    respondWithBrand({ primary: { base: "#773E98", lighter: "#333333" } })
    renderPage()

    await waitFor(() => expect(document.getElementById("primaryLighter-apply")).not.toBeNull())
    await userEvent.click(document.getElementById("primaryLighter-apply"))

    const lighter = screen.getAllByLabelText("test:lighter")[0] as HTMLInputElement
    await waitFor(() => expect(lighter.value).toEqual("#F8F4FB"))
    await waitFor(() =>
      expect(screen.queryByTestId("primaryLighter-contrast")).not.toBeInTheDocument()
    )
  })

  it("raises no shade warning for a ramp whose shades all derive", async () => {
    respondWithBrand({ primary: { base: "#773E98" } })
    renderPage()

    await screen.findAllByLabelText("test:base")
    RAMP_WARNING_IDS.forEach((id) => expect(screen.queryByTestId(id)).not.toBeInTheDocument())
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

  it("sends the bare storage key from an upload, not the public url", async () => {
    // The whole point of fileUploader reporting fileId: brandAssetUrl refuses a full url.
    const uploader = helpers.fileUploader as jest.MockedFunction<typeof helpers.fileUploader>
    uploader.mockImplementation(({ setFileUploadData }) => {
      setFileUploadData({
        id: "https://bloom-public.s3.us-west-2.amazonaws.com/9f1c2e3a",
        url: "https://bloom-public.s3.us-west-2.amazonaws.com/9f1c2e3a",
        fileId: "9f1c2e3a",
      })
      return Promise.resolve()
    })
    respondWithBrand({ primary: { base: "#773E98" } })
    acceptSave()
    renderPage()

    await waitFor(() => expect(document.getElementById("brand-logo-upload")).not.toBeNull())
    await userEvent.upload(
      document.getElementById("brand-logo-upload") as HTMLInputElement,
      new File(["x"], "logo.png", { type: "image/png" })
    )
    await waitFor(() => expect(uploader).toHaveBeenCalled())
    await userEvent.click(screen.getByText("test:save"))

    await waitFor(() => expect(savedBody).not.toBeNull())
    expect(savedBody.logoFileId).toEqual("9f1c2e3a")
  })

  it("refuses to save while an upload is still in flight", async () => {
    // fileUploader resolves after the presign, before the file lands, so progress is mid-flight.
    const uploader = helpers.fileUploader as jest.MockedFunction<typeof helpers.fileUploader>
    uploader.mockImplementation(({ setProgressValue }) => {
      setProgressValue(3)
      return Promise.resolve()
    })
    respondWithBrand({ primary: { base: "#773E98" } })
    acceptSave()
    renderPage()

    await waitFor(() => expect(document.getElementById("brand-logo-upload")).not.toBeNull())
    await userEvent.upload(
      document.getElementById("brand-logo-upload") as HTMLInputElement,
      new File(["x"], "logo.png", { type: "image/png" })
    )

    await waitFor(() => expect(screen.getByText("test:save").closest("button")).toBeDisabled())
    expect(savedBody).toBeNull()
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
