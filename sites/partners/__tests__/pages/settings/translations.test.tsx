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
import { flattenTranslations } from "@bloom-housing/shared-helpers/src/utilities/flattenTranslations"
import sharedGeneral from "@bloom-housing/shared-helpers/src/locales/general.json"
import { user } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { mockNextRouter, render } from "../../testUtils"
import { overrideTranslations } from "../../../src/lib/translations"
import { publicOverrideTranslations } from "../../../src/lib/publicTranslations"
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

// Each site layers its own bundled content over the shared file. A fork rewrites that content, so
// these are derived rather than written down; hardcoding them would break on a copy edit.
const sharedBase = flattenTranslations(sharedGeneral)
const partnersLayer = flattenTranslations(overrideTranslations.en)
const publicLayer = flattenTranslations(publicOverrideTranslations.en)
const publicSpanishLayer = flattenTranslations(publicOverrideTranslations.es)

const addedBy = (layer: Record<string, string>) =>
  Object.keys(layer)
    .filter((key) => !(key in sharedBase))
    .sort()

// Sorts ahead of every shared key, so it lands on page one without filtering.
const FIRST_PARTNERS_BASE_KEY = addedBy(partnersLayer)[0]
const FIRST_PARTNERS_BASE_VALUE = partnersLayer[FIRST_PARTNERS_BASE_KEY]
const PUBLIC_ONLY_KEY = addedBy(publicLayer)[0]
// A key the public site rewrites rather than adds, so its base differs from the shared value.
const PUBLIC_OVERRIDDEN_KEY = Object.keys(publicLayer).find(
  (key) => key in sharedBase && publicLayer[key] && publicLayer[key] !== sharedBase[key]
)
// A key whose Spanish public value differs from its English one, so the language layer is visible.
const PUBLIC_SPANISH_KEY = Object.keys(publicSpanishLayer).find(
  (key) => publicSpanishLayer[key] && publicSpanishLayer[key] !== publicLayer[key]
)

// The first fetch goes straight to the API; once AuthProvider has configured axios the rest go
// through the adapter path, so both are answered.
const RAW_PATHS = [
  "http://localhost:3100/translations/jurisdictions/:jurisdictionId/raw/:site/:language",
  "http://localhost/api/adapter/translations/jurisdictions/:jurisdictionId/raw/:site/:language",
]

const GLOBAL_RAW_PATHS = [
  "http://localhost:3100/translations/partners/raw/:language",
  "http://localhost/api/adapter/translations/partners/raw/:language",
]

const respondWithOverrides = (overrides: ReturnType<typeof override>[]) =>
  server.use(
    ...RAW_PATHS.map((path) => rest.get(path, (_req, res, ctx) => res(ctx.json(overrides))))
  )

const respondWithGlobalOverrides = (overrides: ReturnType<typeof override>[]) =>
  server.use(
    ...GLOBAL_RAW_PATHS.map((path) => rest.get(path, (_req, res, ctx) => res(ctx.json(overrides))))
  )

beforeAll(() => {
  server.listen()
})

beforeEach(() => {
  pushMock = mockNextRouter().pushMock
  server.use(
    rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => res(ctx.json(user))),
    ...[...RAW_PATHS, ...GLOBAL_RAW_PATHS].map((path) =>
      rest.get(path, (_req, res, ctx) => res(ctx.json([])))
    )
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

const selectSite = async (site: "public" | "partners") =>
  userEvent.selectOptions(await screen.findByLabelText("Site"), site)

const selectLanguage = async (label: string) =>
  userEvent.selectOptions(await screen.findByLabelText("Language"), label)

// Types into the first editable cell and commits, which is what puts the page in the edited state.
const editFirstValue = async (value: string) => {
  await waitFor(() => expect(document.querySelector(".editable-cell")).toBeInTheDocument())
  await userEvent.click(document.querySelector<HTMLElement>(".editable-cell"))

  const input = document.querySelector<HTMLInputElement>(".editable-cell input")
  await userEvent.clear(input)
  await userEvent.type(input, `${value}{Enter}`)

  await waitFor(() => expect(screen.getByRole("button", { name: /Save/ })).toBeEnabled())
}

// Rows are filtered in the browser, behind a debounce, so this waits the current page out. The
// anchor is a key on page one before filtering, which differs per scope.
const filterFor = async (text: string, anchor = FIRST_BASE_KEY) => {
  await screen.findByText(anchor)
  await userEvent.type(screen.getByTestId("translations-filter"), text)
  await waitFor(() => expect(screen.queryByText(anchor)).toBeNull())
}

// The base column and the current-value column both show the base when nothing overrides it.
const expectBaseShown = async (value: string) =>
  waitFor(() => expect(screen.getAllByText(value).length).toBeGreaterThan(0))

describe("<SettingsTranslations>", () => {
  describe("page access", () => {
    it("renders the settings page with a translations tab", async () => {
      renderPage()

      expect(await screen.findByRole("heading", { level: 1, name: "Settings" })).toBeInTheDocument()
      // The settings tabs render as navigation links rather than ARIA tabs.
      expect(screen.getByRole("link", { name: "Translations" })).toBeInTheDocument()
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

  describe("site scope", () => {
    const selectPartnersScope = async () => selectSite("partners")

    it("offers the public site and the global Partners scope", async () => {
      renderPage()

      await screen.findByLabelText("Site")
      expect(screen.getByRole("option", { name: "Public site" })).toBeInTheDocument()
      expect(
        screen.getByRole("option", { name: "Partners portal (all jurisdictions)" })
      ).toBeInTheDocument()
    })

    it("drops the jurisdiction selector in the global scope, since the rows apply to all", async () => {
      renderPage({
        jurisdictions: [
          jurisdiction("jurisdiction1", "Bloomington"),
          jurisdiction("jurisdiction2", "Shelbyville"),
        ],
      })

      expect(await screen.findByLabelText("Jurisdiction")).toBeInTheDocument()
      await selectPartnersScope()

      expect(screen.queryByLabelText("Jurisdiction")).toBeNull()
    })

    it("reads the global endpoint rather than a jurisdiction's", async () => {
      const requested: string[] = []
      server.use(
        ...[...RAW_PATHS, ...GLOBAL_RAW_PATHS].map((path) =>
          rest.get(path, (req, res, ctx) => {
            requested.push(req.url.pathname)
            return res(ctx.json([]))
          })
        )
      )
      renderPage()

      await screen.findByText(FIRST_BASE_KEY)
      await selectPartnersScope()

      await waitFor(() => expect(requested).toContain("/api/adapter/translations/partners/raw/en"))
    })

    it("compares against the Partners base rather than the shared one", async () => {
      renderPage()

      // The shared base starts here; the Partners base adds keys that sort ahead of it.
      await screen.findByText(FIRST_BASE_KEY)
      expect(screen.queryByText(FIRST_PARTNERS_BASE_KEY)).toBeNull()

      await selectPartnersScope()

      await waitFor(() =>
        expect(screen.getAllByText(FIRST_PARTNERS_BASE_KEY).length).toBeGreaterThan(0)
      )
      expect(screen.getAllByText(FIRST_PARTNERS_BASE_VALUE).length).toBeGreaterThan(0)
    })

    it("reverts a global key through the Partners endpoint", async () => {
      let deleted: Record<string, string> = null
      respondWithGlobalOverrides([override(FIRST_PARTNERS_BASE_KEY, "Bathrooms")])
      server.use(
        rest.delete(
          "http://localhost/api/adapter/translations/partners/raw/:language/:key",
          (req, res, ctx) => {
            deleted = req.params as Record<string, string>
            return res(ctx.json({ success: true }))
          }
        )
      )
      renderPage()

      await selectPartnersScope()
      await userEvent.click(await screen.findByRole("button", { name: "Revert" }))

      await waitFor(() => expect(deleted).toEqual({ language: "en", key: FIRST_PARTNERS_BASE_KEY }))
    })

    it("offers the locales the Partners site is configured for", async () => {
      mockNextRouter(undefined, { locales: ["en", "es"] })
      // The jurisdiction offers English only, so Spanish can only come from the site's locales.
      renderPage()

      await screen.findByLabelText("Language")
      expect(screen.queryByRole("option", { name: "Español" })).toBeNull()

      await selectPartnersScope()

      expect(await screen.findByRole("option", { name: "Español" })).toBeInTheDocument()
    })

    it("restores the jurisdiction scope on the way back", async () => {
      const requested: string[] = []
      server.use(
        ...[...RAW_PATHS, ...GLOBAL_RAW_PATHS].map((path) =>
          rest.get(path, (req, res, ctx) => {
            requested.push(req.url.pathname)
            return res(ctx.json([]))
          })
        )
      )
      renderPage()

      await selectPartnersScope()
      await waitFor(() => expect(screen.queryByLabelText("Jurisdiction")).toBeNull())

      await selectSite("public")

      expect(await screen.findByLabelText("Jurisdiction")).toBeInTheDocument()
      await waitFor(() =>
        expect(requested).toContain(
          "/api/adapter/translations/jurisdictions/jurisdiction1/raw/public/en"
        )
      )
    })

    it("saves through the Partners endpoint in the global scope", async () => {
      let written: { path: string; body: unknown } = null
      server.use(
        rest.put(
          "http://localhost/api/adapter/translations/partners/raw/:language",
          async (req, res, ctx) => {
            written = { path: req.url.pathname, body: await req.json() }
            return res(ctx.json({ success: true }))
          }
        )
      )
      renderPage()

      await selectPartnersScope()
      await editFirstValue("Partners edit")
      await userEvent.click(screen.getByRole("button", { name: /Save/ }))

      await waitFor(() => expect(written).not.toBeNull())
      expect(written.path).toEqual("/api/adapter/translations/partners/raw/en")
      expect(written.body).toEqual({
        edits: [{ key: FIRST_PARTNERS_BASE_KEY, value: "Partners edit" }],
      })
    }, 20000)

    it("saves through the jurisdiction endpoint in the public scope", async () => {
      let written: string = null
      server.use(
        rest.put(
          "http://localhost/api/adapter/translations/jurisdictions/:jurisdictionId/raw/:site/:language",
          (req, res, ctx) => {
            written = req.url.pathname
            return res(ctx.json({ success: true }))
          }
        )
      )
      renderPage()

      await editFirstValue("Public edit")
      await userEvent.click(screen.getByRole("button", { name: /Save/ }))

      // The scope comes from the selector, so the site segment must not be hardcoded elsewhere.
      await waitFor(() =>
        expect(written).toEqual(
          "/api/adapter/translations/jurisdictions/jurisdiction1/raw/public/en"
        )
      )
    }, 20000)

    it("locks every scope selector while an edit is unsaved", async () => {
      mockNextRouter(undefined, { locales: ["en", "es"] })
      renderPage({
        jurisdictions: [
          jurisdiction("jurisdiction1", "Bloomington"),
          jurisdiction("jurisdiction2", "Shelbyville"),
        ],
      })

      expect(await screen.findByLabelText("Site")).toBeEnabled()
      expect(screen.getByLabelText("Jurisdiction")).toBeEnabled()

      await editFirstValue("Unsaved")

      // An edit is held against one scope, so it must not be carried into another.
      expect(screen.getByLabelText("Site")).toBeDisabled()
      expect(screen.getByLabelText("Jurisdiction")).toBeDisabled()
      expect(screen.getByLabelText("Language")).toBeDisabled()
    }, 20000)
  })

  describe("global scope failures", () => {
    const editAndSave = async () => {
      await selectSite("partners")
      await editFirstValue("Attempted")
      await userEvent.click(screen.getByRole("button", { name: /Save/ }))
    }

    it("reports a failure to load the global overrides", async () => {
      server.use(
        ...GLOBAL_RAW_PATHS.map((path) => rest.get(path, (_req, res, ctx) => res(ctx.status(500))))
      )
      renderPage()

      await selectSite("partners")

      expect(
        await screen.findByText("The current translations could not be loaded", { exact: false })
      ).toBeInTheDocument()
    })

    it("opens the conflict dialog when someone else changed a global key first", async () => {
      server.use(
        rest.put(
          "http://localhost/api/adapter/translations/partners/raw/:language",
          (_r, res, ctx) =>
            res(
              ctx.status(409),
              ctx.json({ message: "translationConflict", conflicts: [FIRST_PARTNERS_BASE_KEY] })
            )
        )
      )
      renderPage()
      await editAndSave()

      const dialog = await screen.findByRole("dialog")
      expect(within(dialog).getByText(FIRST_PARTNERS_BASE_KEY)).toBeInTheDocument()
    }, 20000)

    it("names the keys the API refused in the global scope", async () => {
      server.use(
        rest.put(
          "http://localhost/api/adapter/translations/partners/raw/:language",
          (_r, res, ctx) =>
            res(ctx.status(400), ctx.json({ message: ["edits.0.value must be shorter"] }))
        )
      )
      renderPage()
      await editAndSave()

      expect(await screen.findByText(FIRST_PARTNERS_BASE_KEY, { exact: false })).toBeInTheDocument()
    }, 20000)
  })

  // The public site layers page_content/locale_overrides over the shared file, so the editor has to
  // compare against that rather than the shared file alone.
  describe("public scope base", () => {
    it("includes the keys the public site adds on top of the shared file", async () => {
      renderPage()

      await filterFor(PUBLIC_ONLY_KEY)

      expect(await screen.findByText(PUBLIC_ONLY_KEY)).toBeInTheDocument()
    }, 20000)

    it("shows the value the public site renders where it overrides a shared key", async () => {
      renderPage()

      await filterFor(PUBLIC_OVERRIDDEN_KEY)

      await expectBaseShown(publicLayer[PUBLIC_OVERRIDDEN_KEY])
      expect(screen.queryByText(sharedBase[PUBLIC_OVERRIDDEN_KEY])).toBeNull()
    }, 20000)

    it("layers the public site's own translation of a key over its English one", async () => {
      renderPage({
        jurisdictions: [
          jurisdiction("jurisdiction1", "Bloomington", [LanguagesEnum.en, LanguagesEnum.es]),
        ],
      })

      await selectLanguage("Español")
      await filterFor(PUBLIC_SPANISH_KEY)

      await expectBaseShown(publicSpanishLayer[PUBLIC_SPANISH_KEY])
      expect(screen.queryByText(publicLayer[PUBLIC_SPANISH_KEY])).toBeNull()
    }, 20000)

    it("keeps the public site's added keys out of the Partners base", async () => {
      renderPage()

      await selectSite("partners")
      await filterFor(PUBLIC_ONLY_KEY, FIRST_PARTNERS_BASE_KEY)

      // Merging both bundles would leave every existing assertion passing, so state the converse.
      expect(screen.queryByText(PUBLIC_ONLY_KEY)).toBeNull()
    }, 20000)

    it("falls back to English for a Partners key, which has no other translation", async () => {
      mockNextRouter(undefined, { locales: ["en", "es"] })
      renderPage()

      await selectSite("partners")
      await selectLanguage("Español")

      // overrideTranslations supplies English only, which is what the portal renders in every
      // language, so the base has to read the same way.
      await expectBaseShown(FIRST_PARTNERS_BASE_VALUE)
    }, 20000)
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

    // The API cannot flag this one: there is no row in the edited language to carry the flag, so
    // without the derived check the key reads as "Using base" while the English has moved on.
    it("marks a key overridden in English but not in the language being edited", async () => {
      server.use(
        ...RAW_PATHS.map((path) =>
          rest.get(path, (req, res, ctx) =>
            res(
              ctx.json(
                req.params.language === "en" ? [override(FIRST_BASE_KEY, "Your settings")] : []
              )
            )
          )
        )
      )
      renderPage({
        jurisdictions: [
          jurisdiction("jurisdiction1", "Bloomington", [LanguagesEnum.en, LanguagesEnum.es]),
        ],
      })

      await selectLanguage("Español")

      expect(await screen.findByText("English changed")).toBeInTheDocument()
    })

    it("leaves a key alone when neither language overrides it", async () => {
      renderPage({
        jurisdictions: [
          jurisdiction("jurisdiction1", "Bloomington", [LanguagesEnum.en, LanguagesEnum.es]),
        ],
      })

      await selectLanguage("Español")

      await waitFor(() => expect(screen.getAllByText("Using base").length).toBeGreaterThan(0))
      expect(screen.queryByText("English changed")).toBeNull()
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
