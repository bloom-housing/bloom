import React from "react"
import { setupServer } from "msw/lib/node"
import { screen } from "@testing-library/react"
import { rest } from "msw"
import { AuthContext } from "@bloom-housing/shared-helpers"
import {
  FeatureFlagEnum,
  LanguagesEnum,
  TranslationsService,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { user } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { mockNextRouter, render } from "../../testUtils"
import SettingsTranslations from "../../../src/pages/settings/translations"

const server = setupServer()

let pushMock: jest.Mock

beforeAll(() => {
  server.listen()
})

beforeEach(() => {
  pushMock = mockNextRouter().pushMock
  server.use(
    rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => res(ctx.json(user))),
    rest.get(
      "http://localhost:3100/translations/jurisdictions/:jurisdictionId/raw/:site/:language",
      (_req, res, ctx) => res(ctx.json([]))
    )
  )
})

afterEach(() => server.resetHandlers())

afterAll(() => server.close())

const adminProfile = {
  ...user,
  userRoles: { isAdmin: true },
  jurisdictions: [{ id: "jurisdiction1", name: "Bloomington", languages: [LanguagesEnum.en] }],
  listings: [],
}

const renderPage = (profileOverrides = {}, flagOn = true) =>
  render(
    <AuthContext.Provider
      value={{
        profile: { ...adminProfile, ...profileOverrides },
        translationsService: new TranslationsService(),
        doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
          flagOn && featureFlag === FeatureFlagEnum.enableDbDrivenContent,
      }}
    >
      <SettingsTranslations />
    </AuthContext.Provider>
  )

describe("<SettingsTranslations>", () => {
  it("renders the settings page with a translations tab", async () => {
    renderPage()

    expect(await screen.findByRole("heading", { level: 1, name: "Settings" })).toBeInTheDocument()
    // The settings tabs render as navigation links rather than ARIA tabs.
    expect(screen.getByRole("link", { name: "Translations" })).toBeInTheDocument()
  })

  it("offers the jurisdiction's languages", async () => {
    renderPage({
      jurisdictions: [
        {
          id: "jurisdiction1",
          name: "Bloomington",
          languages: [LanguagesEnum.en, LanguagesEnum.es],
        },
      ],
    })

    const languageSelect = await screen.findByLabelText("Language")
    expect(languageSelect).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "English" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "Español" })).toBeInTheDocument()
  })

  it("hides the jurisdiction selector when the admin has only one", async () => {
    renderPage()

    await screen.findByRole("heading", { level: 1, name: "Settings" })
    expect(screen.queryByLabelText("Jurisdiction")).not.toBeInTheDocument()
  })

  it("shows the jurisdiction selector when the admin spans several", async () => {
    renderPage({
      jurisdictions: [
        { id: "jurisdiction1", name: "Bloomington", languages: [LanguagesEnum.en] },
        { id: "jurisdiction2", name: "Shelbyville", languages: [LanguagesEnum.en] },
      ],
    })

    expect(await screen.findByLabelText("Jurisdiction")).toBeInTheDocument()
  })

  it("redirects when the db driven content flag is off for every jurisdiction", () => {
    renderPage({}, false)

    expect(pushMock).toHaveBeenCalledWith("/unauthorized")
  })

  it("redirects a jurisdictional admin, since editing is limited to admins", () => {
    renderPage({ userRoles: { isJurisdictionalAdmin: true } })

    expect(pushMock).toHaveBeenCalledWith("/unauthorized")
  })

  it("redirects a support admin", () => {
    renderPage({ userRoles: { isSupportAdmin: true } })

    expect(pushMock).toHaveBeenCalledWith("/unauthorized")
  })

  it("does not redirect an admin when the flag is on", async () => {
    renderPage()

    await screen.findByRole("heading", { level: 1, name: "Settings" })
    expect(pushMock).not.toHaveBeenCalled()
  })
})
