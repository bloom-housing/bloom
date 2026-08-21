import React from "react"
import { setupServer } from "msw/lib/node"
import { screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
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

const override = (key: string, value: string, extra = {}) => ({
  key,
  value,
  updatedAt: new Date("2026-01-01").toISOString(),
  origin: "human",
  stale: false,
  ...extra,
})

// Rows are sorted by key, so an override on the first key of the bundled base lands on page one.
const FIRST_BASE_KEY = "account.accountSettings"
const FIRST_BASE_VALUE = "Account settings"
// Sorts ahead of every bundled key, and has no base, so reverting it would remove its section.
const FORK_ONLY_KEY = "aaa.forkOnly"

// The first fetch goes straight to the API; once AuthProvider has configured axios the rest go
// through the adapter path, so both are answered.
const RAW_PATHS = [
  "http://localhost:3100/translations/jurisdictions/:jurisdictionId/raw/:site/:language",
  "http://localhost/api/adapter/translations/jurisdictions/:jurisdictionId/raw/:site/:language",
]

const respondWithOverrides = (overrides: ReturnType<typeof override>[]) =>
  server.use(
    ...RAW_PATHS.map((path) => rest.get(path, (_req, res, ctx) => res(ctx.json(overrides))))
  )

beforeAll(() => {
  server.listen()
})

beforeEach(() => {
  pushMock = mockNextRouter().pushMock
  server.use(
    rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => res(ctx.json(user))),
    ...RAW_PATHS.map((path) => rest.get(path, (_req, res, ctx) => res(ctx.json([]))))
  )
})

afterEach(() => server.resetHandlers())

afterAll(() => server.close())

const jurisdiction = (
  id: string,
  name: string,
  languages = [LanguagesEnum.en],
  dbDriven = true
) => ({
  id,
  name,
  languages,
  featureFlags: [{ name: FeatureFlagEnum.enableDbDrivenContent, active: dbDriven }],
})

const adminProfile = {
  ...user,
  userRoles: { isAdmin: true },
  jurisdictions: [jurisdiction("jurisdiction1", "Bloomington")],
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
  describe("page access", () => {
    it("renders the settings page with a translations tab", async () => {
      renderPage()

      expect(await screen.findByRole("heading", { level: 1, name: "Settings" })).toBeInTheDocument()
      // The settings tabs render as navigation links rather than ARIA tabs.
      expect(screen.getByRole("link", { name: "Translations" })).toBeInTheDocument()
    })

    it("shows the content tab alongside it, since both ride the same flag", async () => {
      renderPage()

      await screen.findByRole("heading", { level: 1, name: "Settings" })
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

  describe("scope selectors", () => {
    it("offers the jurisdiction's languages", async () => {
      renderPage({
        jurisdictions: [
          jurisdiction("jurisdiction1", "Bloomington", [LanguagesEnum.en, LanguagesEnum.es]),
        ],
      })

      const languageSelect = await screen.findByLabelText("Language")
      expect(languageSelect).toBeInTheDocument()
      expect(screen.getByRole("option", { name: "English" })).toBeInTheDocument()
      expect(screen.getByRole("option", { name: "Español" })).toBeInTheDocument()
    })

    it("names the jurisdiction being edited even when the admin has only one", async () => {
      renderPage()

      // Which jurisdiction is being edited cannot be inferred from anything else on the page.
      const jurisdictionSelect = await screen.findByLabelText("Jurisdiction")
      expect(jurisdictionSelect).toBeInTheDocument()
      expect(jurisdictionSelect).toBeDisabled()
      expect(screen.getByRole("option", { name: "Bloomington" })).toBeInTheDocument()
    })

    it("leaves out a jurisdiction that does not read its content from the database", async () => {
      renderPage({
        jurisdictions: [
          jurisdiction("jurisdiction1", "Bloomington"),
          jurisdiction("jurisdiction2", "Shelbyville", [LanguagesEnum.en], false),
        ],
      })

      await screen.findByLabelText("Jurisdiction")
      expect(screen.getByRole("option", { name: "Bloomington" })).toBeInTheDocument()
      expect(screen.queryByRole("option", { name: "Shelbyville" })).toBeNull()
    })

    it("lets the admin switch jurisdiction when they span several", async () => {
      renderPage({
        jurisdictions: [
          jurisdiction("jurisdiction1", "Bloomington"),
          jurisdiction("jurisdiction2", "Shelbyville"),
        ],
      })

      const jurisdictionSelect = await screen.findByLabelText("Jurisdiction")
      expect(jurisdictionSelect).toBeEnabled()
      expect(screen.getByRole("option", { name: "Shelbyville" })).toBeInTheDocument()
    })
  })

  describe("rows", () => {
    it("builds a row per key from the bundled base", async () => {
      renderPage()

      // The grid replaces its nodes as data arrives, so each assertion re-queries.
      await waitFor(() => expect(screen.getAllByText(FIRST_BASE_KEY).length).toBeGreaterThan(0))
      expect(screen.getAllByText(FIRST_BASE_VALUE).length).toBeGreaterThan(0)
      expect(screen.getAllByText("Using base").length).toBeGreaterThan(0)
    })

    it("shows the stored override in place of the base value", async () => {
      respondWithOverrides([override(FIRST_BASE_KEY, "Your settings")])
      renderPage()

      expect(await screen.findByText("Your settings")).toBeInTheDocument()
      // The base stays visible alongside it, so the admin can compare.
      expect(screen.getByText(FIRST_BASE_VALUE)).toBeInTheDocument()
      expect(screen.getByText("Overridden")).toBeInTheDocument()
    })

    it("marks an override whose English source has since changed", async () => {
      respondWithOverrides([override(FIRST_BASE_KEY, "Your settings", { stale: true })])
      renderPage()

      expect(await screen.findByText("English changed")).toBeInTheDocument()
    })
  })

  describe("revert", () => {
    it("offers Revert only for keys that have an override", async () => {
      respondWithOverrides([override(FIRST_BASE_KEY, "Your settings")])
      renderPage()

      await screen.findByText("Your settings")
      await screen.findByRole("button", { name: "Revert" })
      expect(screen.getAllByRole("button", { name: "Revert" })).toHaveLength(1)
    })

    it("reverts a key that has a base without asking first", async () => {
      let deleted: Record<string, string> = null
      respondWithOverrides([override(FIRST_BASE_KEY, "Your settings")])
      server.use(
        rest.delete(
          "http://localhost/api/adapter/translations/jurisdictions/:jurisdictionId/raw/:site/:language/:key",
          (req, res, ctx) => {
            deleted = req.params as Record<string, string>
            return res(ctx.json({ success: true }))
          }
        )
      )
      renderPage()

      await userEvent.click(await screen.findByRole("button", { name: "Revert" }))

      // The delete names the scope on screen, not whichever scope was loaded first.
      await waitFor(() =>
        expect(deleted).toEqual({
          jurisdictionId: "jurisdiction1",
          site: "public",
          language: "en",
          key: FIRST_BASE_KEY,
        })
      )
    })

    it("asks before reverting a key with no base, since that removes its section", async () => {
      respondWithOverrides([override(FORK_ONLY_KEY, "Fork only content")])
      renderPage()

      await userEvent.click(await screen.findByRole("button", { name: "Revert" }))

      const dialog = await screen.findByRole("dialog")
      expect(within(dialog).getByText(FORK_ONLY_KEY)).toBeInTheDocument()
    })

    it("keeps the override when the confirmation is dismissed", async () => {
      let deleteCalled = false
      respondWithOverrides([override(FORK_ONLY_KEY, "Fork only content")])
      server.use(
        rest.delete(
          "http://localhost/api/adapter/translations/jurisdictions/:jurisdictionId/raw/:site/:language/:key",
          (_req, res, ctx) => {
            deleteCalled = true
            return res(ctx.json({ success: true }))
          }
        )
      )
      renderPage()

      await userEvent.click(await screen.findByRole("button", { name: "Revert" }))

      const dialog = await screen.findByRole("dialog")
      await userEvent.click(within(dialog).getByRole("button", { name: "Cancel" }))

      expect(deleteCalled).toBe(false)
      expect(screen.getByText("Fork only content")).toBeInTheDocument()
    })
  })

  describe("filter", () => {
    it("asks for at least three characters before filtering", async () => {
      renderPage()

      await screen.findByText(FIRST_BASE_KEY)
      await userEvent.type(screen.getByTestId("translations-filter"), "ac")

      expect(await screen.findByText("Enter at least 3 characters to search")).toBeInTheDocument()
    })
  })

  describe("paging", () => {
    // AgTable's debounced filter effect resets to page one. It must run at mount only, not on
    // every render, or paging snaps back half a second after each click.
    it("stays on the page after AgTable's filter debounce settles", async () => {
      renderPage()

      const jumpTo = () => screen.getByLabelText("Jump to")

      await screen.findByText(FIRST_BASE_KEY)
      await waitFor(() => expect(jumpTo()).toHaveValue("1"))
      // AgTable schedules one page reset at mount; wait it out so the click is what is measured.
      await new Promise((resolve) => setTimeout(resolve, 900))

      await userEvent.click(screen.getByRole("button", { name: "Next" }))
      await waitFor(() => expect(jumpTo()).toHaveValue("2"))

      await new Promise((resolve) => setTimeout(resolve, 900))
      expect(jumpTo()).toHaveValue("2")
    }, 20000)

    it("keeps a filter typed straight after load", async () => {
      renderPage()

      await screen.findByText(FIRST_BASE_KEY)
      await userEvent.type(screen.getByTestId("translations-filter"), "lottery")

      await waitFor(() => expect(screen.queryByText(FIRST_BASE_KEY)).toBeNull())

      await new Promise((resolve) => setTimeout(resolve, 900))
      expect(screen.getByTestId("translations-filter")).toHaveValue("lottery")
      expect(screen.queryByText(FIRST_BASE_KEY)).toBeNull()
    }, 20000)
  })

  describe("save actions", () => {
    it("saves nothing while there is nothing edited", async () => {
      renderPage()

      await screen.findByText(FIRST_BASE_KEY)
      expect(screen.getByRole("button", { name: "Save" })).toBeDisabled()
      expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled()
    })
  })

  describe("error states", () => {
    it("reports a failure to load the overrides", async () => {
      server.use(
        rest.get(
          "http://localhost:3100/translations/jurisdictions/:jurisdictionId/raw/:site/:language",
          (_req, res, ctx) => res(ctx.status(500))
        )
      )
      renderPage()

      expect(
        await screen.findByText("The current translations could not be loaded", { exact: false })
      ).toBeInTheDocument()
    })
  })
})
