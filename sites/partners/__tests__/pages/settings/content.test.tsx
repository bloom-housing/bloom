import React from "react"
import { setupServer } from "msw/lib/node"
import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { rest } from "msw"
import { AuthContext } from "@bloom-housing/shared-helpers"
import {
  FeatureFlagEnum,
  JurisdictionContentService,
  LanguagesEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { user } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { mockNextRouter, render } from "../../testUtils"
import SettingsContent from "../../../src/pages/settings/content"

const server = setupServer()

let pushMock: jest.Mock

// The first fetch goes straight to the API; once AuthProvider has configured axios the rest go
// through the adapter path, so both are answered.
const CONTENT_PATHS = [
  "http://localhost:3100/jurisdictionContent/jurisdictions/:jurisdictionId/admin",
  "http://localhost/api/adapter/jurisdictionContent/jurisdictions/:jurisdictionId/admin",
]

const row = (language: LanguagesEnum, extra = {}) => ({
  id: `row-${language}`,
  createdAt: new Date("2026-01-01").toISOString(),
  updatedAt: new Date("2026-01-01").toISOString(),
  jurisdictionId: "jurisdiction1",
  language,
  staleFields: [],
  ...extra,
})

const respondWithRows = (rows: ReturnType<typeof row>[]) =>
  server.use(
    ...CONTENT_PATHS.map((path) => rest.get(path, (_req, res, ctx) => res(ctx.json(rows))))
  )

beforeAll(() => server.listen())

beforeEach(() => {
  pushMock = mockNextRouter().pushMock
  server.use(
    rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => res(ctx.json(user))),
    ...CONTENT_PATHS.map((path) => rest.get(path, (_req, res, ctx) => res(ctx.json([]))))
  )
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
      languages: [LanguagesEnum.en, LanguagesEnum.es],
      featureFlags: [{ name: FeatureFlagEnum.enableDbDrivenContent, active: true }],
    },
  ],
  listings: [],
}

const renderPage = (profileOverrides = {}, flagOn = true) =>
  render(
    <AuthContext.Provider
      value={{
        profile: { ...adminProfile, ...profileOverrides },
        jurisdictionContentService: new JurisdictionContentService(),
        doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
          flagOn && featureFlag === FeatureFlagEnum.enableDbDrivenContent,
      }}
    >
      <SettingsContent />
    </AuthContext.Provider>
  )

describe("<SettingsContent>", () => {
  describe("page access", () => {
    it("renders the settings page with a content tab", async () => {
      renderPage()

      expect(await screen.findByRole("heading", { level: 1, name: "Settings" })).toBeInTheDocument()
      expect(screen.getByRole("link", { name: "Content" })).toBeInTheDocument()
    })

    it("redirects when the db driven content flag is off for every jurisdiction", () => {
      renderPage({}, false)

      expect(pushMock).toHaveBeenCalledWith("/unauthorized")
    })

    it("redirects a jurisdictional admin, since editing is limited to admins", () => {
      renderPage({ userRoles: { isJurisdictionalAdmin: true } })

      expect(pushMock).toHaveBeenCalledWith("/unauthorized")
    })
  })

  describe("fields", () => {
    it("shows an English value as not set when the row has no value", async () => {
      respondWithRows([row(LanguagesEnum.en)])
      renderPage()

      expect(await screen.findAllByText("Not set")).toHaveLength(2)
      expect(screen.getAllByRole("button", { name: "Add a value" })).toHaveLength(2)
    })

    it("marks a field that falls back to English and offers to translate it", async () => {
      respondWithRows([
        row(LanguagesEnum.en, { disclaimers: { privacyHtml: "<p>Privacy</p>" } }),
        row(LanguagesEnum.es),
      ])
      renderPage()

      await screen.findByRole("heading", { level: 1, name: "Settings" })
      await userEvent.selectOptions(screen.getByLabelText("Language"), LanguagesEnum.es)

      expect(await screen.findAllByText("Using English")).toHaveLength(2)
      expect(screen.getAllByRole("button", { name: "Translate this" })).toHaveLength(2)
    })

    it("flags a field the API reports as stale", async () => {
      respondWithRows([
        row(LanguagesEnum.en, { disclaimers: { privacyHtml: "<p>Updated</p>" } }),
        row(LanguagesEnum.es, {
          disclaimers: { privacyHtml: "<p>Privacidad</p>" },
          staleFields: ["disclaimers.privacyHtml"],
        }),
      ])
      renderPage()

      await screen.findByRole("heading", { level: 1, name: "Settings" })
      await userEvent.selectOptions(screen.getByLabelText("Language"), LanguagesEnum.es)

      expect(await screen.findByText("English changed")).toBeInTheDocument()
    })

    it("switches documents", async () => {
      respondWithRows([row(LanguagesEnum.en)])
      renderPage()

      await screen.findByRole("heading", { level: 1, name: "Settings" })
      await userEvent.selectOptions(screen.getByLabelText("Content type"), "contact")

      expect(await screen.findByText("Phone")).toBeInTheDocument()
      expect(screen.getByText("Hours")).toBeInTheDocument()
    })
  })
})
