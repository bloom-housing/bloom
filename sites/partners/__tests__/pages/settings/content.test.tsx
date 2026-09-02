import React from "react"
import { setupServer } from "msw/lib/node"
import { fireEvent, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { rest } from "msw"
import { addTranslation } from "@bloom-housing/ui-components"
import { AuthContext, MessageContext } from "@bloom-housing/shared-helpers"
import {
  FeatureFlagEnum,
  JurisdictionContentService,
  LanguagesEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { user } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { mockNextRouter, mockTipTapEditor, render } from "../../testUtils"
import SettingsContent from "../../../src/pages/settings/content"

// The suite supplies the strings it asserts on, so editing the shipped copy cannot break it.
const CONTENT_STRINGS = {
  "content.setValue": "test:setValue",
  "content.addCategory": "test:addCategory",
  "content.addLink": "test:addLink",
  "content.addQuestion": "test:addQuestion",
  "content.addTextSection": "test:addTextSection",
  "content.discardChanges": "test:discardChanges",
  "content.conflictDiscard": "test:conflictDiscard",
  "content.conflictOverwrite": "test:conflictOverwrite",
  "content.conflictTitle": "test:conflictTitle",
  "content.hideWarningTitle": "test:hideWarningTitle",
  "content.removeForLanguage": "test:removeForLanguage",
  "content.removedForLanguage": "test:removedForLanguage",
  "content.restore": "test:restore",
  "content.override": "test:override",
  "content.revertToEnglish": "test:revertToEnglish",
  "content.document": "test:document",
  "content.linkHref": "test:linkHref",
  "content.linkText": "test:linkText",
  "content.contactPhone": "test:contactPhone",
  "content.contactHours": "test:contactHours",
  "content.alertSaved": "test:alertSaved",
  "content.stale": "test:stale",
  "content.footerLink": "test:footerLink",
  "content.notSet": "test:notSet",
  "content.textSection": "test:textSection",
  "content.usingEnglish": "test:usingEnglish",
  "content.faqCategoryTitle": "test:faqCategoryTitle",
  "content.faqQuestion": "test:faqQuestion",
  "content.alertLoadFailed": "test:alertLoadFailed",
  "content.positionalListNote": "test:positionalListNote",
}

addTranslation(CONTENT_STRINGS)

const server = setupServer()

let pushMock: jest.Mock

// The first fetch goes straight to the API; once AuthProvider has configured axios the rest go
// through the adapter path, so both are answered.
const CONTENT_PATHS = [
  "http://localhost:3100/jurisdictionContent/jurisdictions/:jurisdictionId/admin",
  "http://localhost/api/adapter/jurisdictionContent/jurisdictions/:jurisdictionId/admin",
]

const SAVE_PATHS = CONTENT_PATHS.map((path) => `${path}/:language`)

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
  toasts = []
  mockTipTapEditor()
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

let toasts: string[] = []

const sectionRow = (text: string) => screen.getByText(text).closest(".section-row")

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
          jurisdictionContentService: new JurisdictionContentService(),
          doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
            flagOn && featureFlag === FeatureFlagEnum.enableDbDrivenContent,
        }}
      >
        <SettingsContent />
      </AuthContext.Provider>
    </MessageContext.Provider>
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

    it("shows the translations tab alongside it, since both ride the same flag", async () => {
      renderPage()

      await screen.findByRole("heading", { level: 1, name: "Settings" })
      expect(screen.getByRole("link", { name: "Translations" })).toBeInTheDocument()
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

      expect(await screen.findAllByText("test:notSet")).toHaveLength(2)
      expect(screen.getAllByRole("button", { name: "test:setValue" })).toHaveLength(2)
    })

    it("marks a field that falls back to English and offers to translate it", async () => {
      respondWithRows([
        row(LanguagesEnum.en, { disclaimers: { privacyHtml: "<p>Privacy</p>" } }),
        row(LanguagesEnum.es),
      ])
      renderPage()

      await screen.findByRole("heading", { level: 1, name: "Settings" })
      await userEvent.selectOptions(screen.getByLabelText("Language"), LanguagesEnum.es)

      expect(await screen.findAllByText("test:usingEnglish")).toHaveLength(2)
      expect(screen.getAllByRole("button", { name: "test:override" })).toHaveLength(2)
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

      expect(await screen.findByText("test:stale")).toBeInTheDocument()
    })

    it("lists FAQ categories and the questions inside them", async () => {
      respondWithRows([
        row(LanguagesEnum.en, {
          faq: {
            categories: [
              {
                id: "applying",
                title: "Applying",
                items: [{ id: "how", question: "How do I apply?", answerHtml: "<p>Online.</p>" }],
              },
            ],
          },
        }),
      ])
      renderPage()

      await screen.findByRole("heading", { level: 1, name: "Settings" })
      await userEvent.selectOptions(screen.getByLabelText("test:document"), "faq")

      expect(await screen.findByText("Applying")).toBeInTheDocument()
      expect(screen.getByText("How do I apply?")).toBeInTheDocument()
      expect(screen.getByRole("button", { name: "test:addCategory" })).toBeInTheDocument()
      expect(screen.getByRole("button", { name: "test:addQuestion" })).toBeInTheDocument()
    })

    it("offers to remove an English item for one language rather than delete it", async () => {
      respondWithRows([
        row(LanguagesEnum.en, {
          footer: { links: [{ id: "about", text: "About", href: "/about" }] },
        }),
        row(LanguagesEnum.es),
      ])
      renderPage()

      await screen.findByRole("heading", { level: 1, name: "Settings" })
      await userEvent.selectOptions(screen.getByLabelText("test:document"), "footer")
      expect(await screen.findByRole("button", { name: "Delete" })).toBeInTheDocument()

      await userEvent.selectOptions(screen.getByLabelText("Language"), LanguagesEnum.es)

      expect(
        await screen.findByRole("button", { name: "test:removeForLanguage" })
      ).toBeInTheDocument()
    })

    it("takes a saved item off the English page when it is deleted", async () => {
      respondWithRows([
        row(LanguagesEnum.en, {
          footer: { links: [{ id: "about", text: "About", href: "/about" }] },
        }),
      ])
      renderPage()

      await screen.findByRole("heading", { level: 1, name: "Settings" })
      await userEvent.selectOptions(screen.getByLabelText("test:document"), "footer")
      expect(await screen.findByText("About")).toBeInTheDocument()

      await userEvent.click(screen.getByRole("button", { name: "Delete" }))

      await waitFor(() => expect(screen.queryByText("About")).not.toBeInTheDocument())
    })

    it("marks a tombstoned item as removed and offers to restore it", async () => {
      respondWithRows([
        row(LanguagesEnum.en, {
          footer: { links: [{ id: "about", text: "About", href: "/about" }] },
        }),
        row(LanguagesEnum.es, { footer: { links: [{ id: "about", _deleted: true }] } }),
      ])
      renderPage()

      await screen.findByRole("heading", { level: 1, name: "Settings" })
      await userEvent.selectOptions(screen.getByLabelText("test:document"), "footer")
      await userEvent.selectOptions(screen.getByLabelText("Language"), LanguagesEnum.es)

      expect(await screen.findByText("test:removedForLanguage")).toBeInTheDocument()
      expect(screen.getByRole("button", { name: "test:restore" })).toBeInTheDocument()
    })

    it("opens a drawer to edit an item", async () => {
      respondWithRows([
        row(LanguagesEnum.en, {
          footer: { links: [{ id: "about", text: "About", href: "/about" }] },
        }),
      ])
      renderPage()

      await screen.findByRole("heading", { level: 1, name: "Settings" })
      await userEvent.selectOptions(screen.getByLabelText("test:document"), "footer")
      await userEvent.click(await screen.findByRole("button", { name: "Edit" }))

      expect(await screen.findByText("test:footerLink")).toBeInTheDocument()
      expect(screen.getByLabelText("test:linkText")).toHaveValue("About")
    })

    it("marks footer text sections when the English ones changed", async () => {
      respondWithRows([
        row(LanguagesEnum.en, { footer: { textSectionsHtml: ["<p>A section</p>"] } }),
        row(LanguagesEnum.es, {
          footer: { textSectionsHtml: ["<p>Una seccion</p>"] },
          staleFields: ["footer.textSectionsHtml"],
        }),
      ])
      renderPage()

      await screen.findByRole("heading", { level: 1, name: "Settings" })
      await userEvent.selectOptions(screen.getByLabelText("test:document"), "footer")
      await userEvent.selectOptions(screen.getByLabelText("Language"), LanguagesEnum.es)

      expect(await screen.findByText("test:stale")).toBeInTheDocument()
    })

    it("does not mark a category when only a question inside it changed", async () => {
      respondWithRows([
        row(LanguagesEnum.en, {
          faq: {
            categories: [
              {
                id: "applying",
                title: "Applying",
                items: [{ id: "how", question: "How do I apply?", answerHtml: "<p>Online.</p>" }],
              },
            ],
          },
        }),
        row(LanguagesEnum.es, {
          faq: {
            categories: [
              {
                id: "applying",
                title: "Solicitar",
                items: [{ id: "how", question: "Como solicito?" }],
              },
            ],
          },
          staleFields: ["faq.categories[applying].items[how].question"],
        }),
      ])
      renderPage()

      await screen.findByRole("heading", { level: 1, name: "Settings" })
      await userEvent.selectOptions(screen.getByLabelText("test:document"), "faq")
      await userEvent.selectOptions(screen.getByLabelText("Language"), LanguagesEnum.es)

      await screen.findByText("Solicitar")
      expect(screen.getAllByText("test:stale")).toHaveLength(1)
    })

    it("opens the editor on a text section as soon as it is added", async () => {
      respondWithRows([row(LanguagesEnum.en, { footer: { textSectionsHtml: ["<p>First</p>"] } })])
      renderPage()

      await screen.findByRole("heading", { level: 1, name: "Settings" })
      await userEvent.selectOptions(screen.getByLabelText("test:document"), "footer")
      await screen.findByText("First")

      await userEvent.click(screen.getByRole("button", { name: "test:addTextSection" }))

      expect(await screen.findByText("test:textSection")).toBeInTheDocument()
      expect(document.querySelectorAll(".section-row")).toHaveLength(2)
    })

    it("shows an English footer section the language row does not reach", async () => {
      respondWithRows([
        row(LanguagesEnum.en, {
          footer: { textSectionsHtml: ["<p>Translated one</p>", "<p>Added in English</p>"] },
        }),
        row(LanguagesEnum.es, { footer: { textSectionsHtml: ["<p>Traducida</p>"] } }),
      ])
      renderPage()

      await screen.findByRole("heading", { level: 1, name: "Settings" })
      await userEvent.selectOptions(screen.getByLabelText("test:document"), "footer")
      await userEvent.selectOptions(screen.getByLabelText("Language"), LanguagesEnum.es)

      await screen.findByText("Traducida")
      const englishSection = sectionRow("Added in English")

      expect(within(englishSection).getByText("test:usingEnglish")).toBeInTheDocument()
      expect(
        within(sectionRow("Traducida")).queryByText("test:usingEnglish")
      ).not.toBeInTheDocument()
    })

    it("adds a language section after the English ones rather than onto one", async () => {
      respondWithRows([
        row(LanguagesEnum.en, {
          footer: { textSectionsHtml: ["<p>Translated one</p>", "<p>Added in English</p>"] },
        }),
        row(LanguagesEnum.es, { footer: { textSectionsHtml: ["<p>Traducida</p>"] } }),
      ])
      renderPage()

      await screen.findByRole("heading", { level: 1, name: "Settings" })
      await userEvent.selectOptions(screen.getByLabelText("test:document"), "footer")
      await userEvent.selectOptions(screen.getByLabelText("Language"), LanguagesEnum.es)
      await screen.findByText("Added in English")

      expect(document.querySelectorAll(".section-row")).toHaveLength(2)

      await userEvent.click(screen.getByRole("button", { name: "test:addTextSection" }))

      await waitFor(() => expect(document.querySelectorAll(".section-row")).toHaveLength(3))
      expect(screen.getByText("Added in English")).toBeInTheDocument()
      expect(within(sectionRow("Added in English")).queryByText("test:usingEnglish")).toBeNull()
    })

    it("says that footer text sections are replaced as a set for a language", async () => {
      respondWithRows([
        row(LanguagesEnum.en, { footer: { textSectionsHtml: ["<p>A section</p>"] } }),
        row(LanguagesEnum.es),
      ])
      renderPage()

      await screen.findByRole("heading", { level: 1, name: "Settings" })
      await userEvent.selectOptions(screen.getByLabelText("test:document"), "footer")
      await userEvent.selectOptions(screen.getByLabelText("Language"), LanguagesEnum.es)

      expect(await screen.findByText("test:positionalListNote")).toBeInTheDocument()
    })

    it("switches documents", async () => {
      respondWithRows([row(LanguagesEnum.en)])
      renderPage()

      await screen.findByRole("heading", { level: 1, name: "Settings" })
      await userEvent.selectOptions(screen.getByLabelText("test:document"), "contact")

      expect(await screen.findByText("test:contactPhone")).toBeInTheDocument()
      expect(screen.getByText("test:contactHours")).toBeInTheDocument()
    })
  })

  describe("rich text", () => {
    it("counts the loaded content before anything is typed", async () => {
      respondWithRows([
        row(LanguagesEnum.en, { disclaimers: { privacyHtml: "<p>Twelve chars</p>" } }),
      ])
      renderPage()

      await screen.findByRole("heading", { level: 1, name: "Settings" })

      // Building the editor empty and setting content afterwards left this at the full limit until
      // the first keystroke.
      expect(await screen.findByText("You have 988 characters remaining")).toBeInTheDocument()
    })

    it("opens a new paragraph on Enter", async () => {
      respondWithRows([row(LanguagesEnum.en, { disclaimers: { privacyHtml: "<p>one</p>" } })])
      renderPage()

      await screen.findByRole("heading", { level: 1, name: "Settings" })
      const host = await screen.findByTestId("disclaimers.privacyHtml")
      const editable = host.querySelector('[contenteditable="true"]')
      ;(editable as HTMLElement).focus()
      fireEvent.keyDown(editable, { key: "Enter", code: "Enter", keyCode: 13 })

      // Re-seeding the editor from the stored value would take this paragraph away again, which is
      // what made Enter look like it did nothing.
      expect(editable.querySelectorAll("p")).toHaveLength(2)
    })
  })

  describe("saving", () => {
    const englishRow = () =>
      row(LanguagesEnum.en, {
        contact: { phone: "555-0100" },
        disclaimers: { privacyHtml: "<p>Privacy</p>" },
      })

    it("sends every document for the language, not only the one on screen", async () => {
      const bodies: Record<string, unknown>[] = []
      respondWithRows([englishRow()])
      server.use(
        ...SAVE_PATHS.map((path) =>
          rest.put(path, async (req, res, ctx) => {
            bodies.push(await req.json())
            return res(ctx.json({}))
          })
        )
      )
      renderPage()

      await screen.findByRole("heading", { level: 1, name: "Settings" })
      await userEvent.selectOptions(screen.getByLabelText("test:document"), "contact")
      await userEvent.type(await screen.findByLabelText("test:contactPhone"), "9")
      await userEvent.click(screen.getByRole("button", { name: "Save" }))

      await waitFor(() => expect(bodies).toHaveLength(1))
      // A save replaces the row, so the untouched documents have to travel with it.
      expect(bodies[0]).toEqual(
        expect.objectContaining({
          contact: { phone: "555-01009" },
          disclaimers: { privacyHtml: "<p>Privacy</p>" },
          lastUpdatedAt: new Date("2026-01-01").toISOString(),
        })
      )
      await waitFor(() => expect(toasts).toContain("test:alertSaved"))
    })

    // Deleting a section and emptying one both drop it from the public site, since a positional
    // list replaces the English one outright.
    it("confirms before saving a translation that deleted a footer section", async () => {
      respondWithRows([
        row(LanguagesEnum.en, {
          footer: { textSectionsHtml: ["<p>One</p>", "<p>Two</p>"] },
        }),
        row(LanguagesEnum.es, {
          footer: { textSectionsHtml: ["<p>Uno</p>", "<p>Dos</p>"] },
        }),
      ])
      renderPage()

      await screen.findByRole("heading", { level: 1, name: "Settings" })
      await userEvent.selectOptions(screen.getByLabelText("Language"), LanguagesEnum.es)
      await userEvent.selectOptions(screen.getByLabelText("test:document"), "footer")

      const deletes = await screen.findAllByRole("button", { name: "Delete" })
      await userEvent.click(deletes[deletes.length - 1])
      await userEvent.click(screen.getByRole("button", { name: "Save" }))

      expect(await screen.findByText("test:hideWarningTitle")).toBeInTheDocument()
    })

    it("discards pending edits without a reload", async () => {
      respondWithRows([englishRow()])
      renderPage()

      await screen.findByRole("heading", { level: 1, name: "Settings" })
      await userEvent.selectOptions(screen.getByLabelText("test:document"), "contact")
      await userEvent.type(await screen.findByLabelText("test:contactPhone"), "9")
      expect(screen.getByLabelText("test:contactPhone")).toHaveValue("555-01009")

      await userEvent.click(screen.getByRole("button", { name: "test:discardChanges" }))

      expect(await screen.findByLabelText("test:contactPhone")).toHaveValue("555-0100")
      expect(screen.getByRole("button", { name: "test:discardChanges" })).toBeDisabled()
    })

    it("offers to overwrite or discard when the row changed underneath", async () => {
      respondWithRows([englishRow()])
      server.use(
        ...SAVE_PATHS.map((path) =>
          rest.put(path, (_req, res, ctx) =>
            res(ctx.status(409), ctx.json({ message: "jurisdictionContentConflict" }))
          )
        )
      )
      renderPage()

      await screen.findByRole("heading", { level: 1, name: "Settings" })
      await userEvent.selectOptions(screen.getByLabelText("test:document"), "contact")
      await userEvent.type(await screen.findByLabelText("test:contactPhone"), "9")
      await userEvent.click(screen.getByRole("button", { name: "Save" }))

      expect(await screen.findByText("test:conflictTitle")).toBeInTheDocument()
      expect(screen.getByRole("button", { name: "test:conflictOverwrite" })).toBeInTheDocument()
      expect(screen.getByRole("button", { name: "test:conflictDiscard" })).toBeInTheDocument()
    })

    it("saves the admin's edits when they overwrite, not the row that arrived meanwhile", async () => {
      const bodies: Record<string, unknown>[] = []
      let reads = 0
      let conflicted = false
      server.use(
        ...CONTENT_PATHS.map((path) =>
          rest.get(path, (_req, res, ctx) => {
            reads += 1
            return res(
              ctx.json([
                conflicted
                  ? row(LanguagesEnum.en, {
                      contact: { phone: "555-0200" },
                      disclaimers: { privacyHtml: "<p>Privacy</p>" },
                      updatedAt: new Date("2026-02-02").toISOString(),
                    })
                  : englishRow(),
              ])
            )
          })
        ),
        ...SAVE_PATHS.map((path) =>
          rest.put(path, async (req, res, ctx) => {
            if (!conflicted) {
              conflicted = true
              return res(ctx.status(409), ctx.json({ message: "jurisdictionContentConflict" }))
            }
            bodies.push(await req.json())
            return res(ctx.json({}))
          })
        )
      )
      renderPage()

      await screen.findByRole("heading", { level: 1, name: "Settings" })
      await userEvent.selectOptions(screen.getByLabelText("test:document"), "contact")
      await userEvent.type(await screen.findByLabelText("test:contactPhone"), "9")
      await userEvent.click(screen.getByRole("button", { name: "Save" }))

      await screen.findByText("test:conflictTitle")
      const readsBeforeOverwrite = reads
      await waitFor(() => expect(reads).toBeGreaterThan(readsBeforeOverwrite - 1))
      expect(screen.getByLabelText("test:contactPhone")).toHaveValue("555-01009")

      await userEvent.click(screen.getByRole("button", { name: "test:conflictOverwrite" }))

      await waitFor(() => expect(bodies).toHaveLength(1))
      expect(bodies[0]).toEqual(
        expect.objectContaining({
          contact: { phone: "555-01009" },
          lastUpdatedAt: new Date("2026-02-02").toISOString(),
        })
      )
      await waitFor(() => expect(toasts).toContain("test:alertSaved"))
    })

    it("leaves an item with nothing in it out of the save", async () => {
      const bodies: Record<string, unknown>[] = []
      respondWithRows([
        row(LanguagesEnum.en, {
          footer: { links: [{ id: "about", text: "About", href: "/about" }] },
        }),
      ])
      server.use(
        ...SAVE_PATHS.map((path) =>
          rest.put(path, async (req, res, ctx) => {
            bodies.push(await req.json())
            return res(ctx.json({}))
          })
        )
      )
      renderPage()

      await screen.findByRole("heading", { level: 1, name: "Settings" })
      await userEvent.selectOptions(screen.getByLabelText("test:document"), "footer")
      await userEvent.click(await screen.findByRole("button", { name: "test:addLink" }))
      await userEvent.click(await screen.findByRole("button", { name: "Close" }))
      await userEvent.click(screen.getByRole("button", { name: "Save" }))

      await waitFor(() => expect(bodies).toHaveLength(1))
      expect(bodies[0].footer).toEqual({
        links: [{ id: "about", text: "About", href: "/about" }],
      })
    })

    it("reports a save that fails for a reason other than a conflict", async () => {
      respondWithRows([englishRow()])
      server.use(
        ...SAVE_PATHS.map((path) =>
          rest.put(path, (_req, res, ctx) => res(ctx.status(400), ctx.json({ message: "bad" })))
        )
      )
      renderPage()

      await screen.findByRole("heading", { level: 1, name: "Settings" })
      await userEvent.selectOptions(screen.getByLabelText("test:document"), "contact")
      await userEvent.type(await screen.findByLabelText("test:contactPhone"), "9")
      await userEvent.click(screen.getByRole("button", { name: "Save" }))

      await waitFor(() =>
        expect(toasts.some((toast) => toast.startsWith("Looks like something went wrong"))).toBe(
          true
        )
      )
      expect(screen.queryByText("test:conflictTitle")).toBeNull()
    })

    it("says the content could not be loaded rather than showing it as unset", async () => {
      server.use(
        ...CONTENT_PATHS.map((path) => rest.get(path, (_req, res, ctx) => res(ctx.status(500))))
      )
      renderPage()

      await screen.findByRole("heading", { level: 1, name: "Settings" })
      expect(await screen.findByText("test:alertLoadFailed")).toBeInTheDocument()
      expect(screen.queryByText("test:notSet")).toBeNull()
      expect(screen.getByRole("button", { name: "Save" })).toBeDisabled()
    })

    it("carries a drawer edit through to the save", async () => {
      const bodies: Record<string, unknown>[] = []
      respondWithRows([
        row(LanguagesEnum.en, {
          footer: { links: [{ id: "about", text: "About", href: "/about" }] },
        }),
      ])
      server.use(
        ...SAVE_PATHS.map((path) =>
          rest.put(path, async (req, res, ctx) => {
            bodies.push(await req.json())
            return res(ctx.json({}))
          })
        )
      )
      renderPage()

      await screen.findByRole("heading", { level: 1, name: "Settings" })
      await userEvent.selectOptions(screen.getByLabelText("test:document"), "footer")
      await userEvent.click(await screen.findByRole("button", { name: "Edit" }))

      await userEvent.clear(await screen.findByLabelText("test:linkText"))
      await userEvent.type(screen.getByLabelText("test:linkText"), "About us")
      await userEvent.clear(screen.getByLabelText("test:linkHref"))
      await userEvent.type(screen.getByLabelText("test:linkHref"), "/about-us")
      await userEvent.click(screen.getByRole("button", { name: "Done" }))
      await userEvent.click(screen.getByRole("button", { name: "Save" }))

      await waitFor(() => expect(bodies).toHaveLength(1))
      expect(bodies[0].footer).toEqual({
        links: [{ id: "about", text: "About us", href: "/about-us" }],
      })
    })

    it("adds a category through the drawer it opens", async () => {
      const bodies: Record<string, unknown>[] = []
      respondWithRows([row(LanguagesEnum.en)])
      server.use(
        ...SAVE_PATHS.map((path) =>
          rest.put(path, async (req, res, ctx) => {
            bodies.push(await req.json())
            return res(ctx.json({}))
          })
        )
      )
      renderPage()

      await screen.findByRole("heading", { level: 1, name: "Settings" })
      await userEvent.selectOptions(screen.getByLabelText("test:document"), "faq")
      await userEvent.click(await screen.findByRole("button", { name: "test:addCategory" }))

      await userEvent.click(await screen.findByRole("button", { name: "test:setValue" }))
      await userEvent.type(await screen.findByLabelText("test:faqCategoryTitle"), "Applying")
      await userEvent.click(screen.getByRole("button", { name: "Done" }))

      expect(await screen.findByText("Applying")).toBeInTheDocument()
      await userEvent.click(screen.getByRole("button", { name: "Save" }))

      await waitFor(() => expect(bodies).toHaveLength(1))
      const categories = (bodies[0].faq as { categories: { id: string; title: string }[] })
        .categories
      expect(categories).toHaveLength(1)
      expect(categories[0].title).toBe("Applying")
      expect(categories[0].id).toEqual(expect.any(String))
    })

    it("adds a question to the category it was opened from", async () => {
      const bodies: Record<string, unknown>[] = []
      respondWithRows([
        row(LanguagesEnum.en, {
          faq: { categories: [{ id: "applying", title: "Applying", items: [] }] },
        }),
      ])
      server.use(
        ...SAVE_PATHS.map((path) =>
          rest.put(path, async (req, res, ctx) => {
            bodies.push(await req.json())
            return res(ctx.json({}))
          })
        )
      )
      renderPage()

      await screen.findByRole("heading", { level: 1, name: "Settings" })
      await userEvent.selectOptions(screen.getByLabelText("test:document"), "faq")
      await userEvent.click(await screen.findByRole("button", { name: "test:addQuestion" }))

      const starters = await screen.findAllByRole("button", { name: "test:setValue" })
      await userEvent.click(starters[0])
      await userEvent.type(
        await screen.findByLabelText("test:faqQuestion", { selector: "input" }),
        "How do I apply?"
      )
      await userEvent.click(screen.getByRole("button", { name: "Done" }))
      await userEvent.click(screen.getByRole("button", { name: "Save" }))

      await waitFor(() => expect(bodies).toHaveLength(1))
      const categories = (bodies[0].faq as { categories: { items: { question: string }[] }[] })
        .categories
      expect(categories[0].items).toHaveLength(1)
      expect(categories[0].items[0].question).toBe("How do I apply?")
    })

    it("starts a translation from the English value and gives it back", async () => {
      respondWithRows([
        row(LanguagesEnum.en, {
          contact: {
            phone: "555-0100",
            email: "apply@example.gov",
            hours: "Nine to five",
            addressHtml: "<p>1 Main St</p>",
          },
        }),
        row(LanguagesEnum.es, {
          contact: {
            email: "solicitar@example.gov",
            hours: "Nueve a cinco",
            addressHtml: "<p>1 Calle Mayor</p>",
          },
        }),
      ])
      renderPage()

      await screen.findByRole("heading", { level: 1, name: "Settings" })
      await userEvent.selectOptions(screen.getByLabelText("test:document"), "contact")
      await userEvent.selectOptions(screen.getByLabelText("Language"), LanguagesEnum.es)

      await userEvent.click(await screen.findByRole("button", { name: "test:override" }))

      expect(await screen.findByLabelText("test:contactPhone")).toHaveValue("555-0100")

      const phoneEditor = screen.getByLabelText("test:contactPhone").closest(".field-editor")
      await userEvent.click(
        within(phoneEditor).getByRole("button", { name: "test:revertToEnglish" })
      )

      expect(await screen.findByRole("button", { name: "test:override" })).toBeInTheDocument()
      expect(screen.queryByLabelText("test:contactPhone")).toBeNull()
    })

    it("reloads the stored row when the admin discards after a conflict", async () => {
      server.use(
        ...SAVE_PATHS.map((path) =>
          rest.put(path, (_req, res, ctx) =>
            res(ctx.status(409), ctx.json({ message: "jurisdictionContentConflict" }))
          )
        )
      )
      respondWithRows([englishRow()])
      renderPage()

      await screen.findByRole("heading", { level: 1, name: "Settings" })
      await userEvent.selectOptions(screen.getByLabelText("test:document"), "contact")
      await userEvent.type(await screen.findByLabelText("test:contactPhone"), "9")
      await userEvent.click(screen.getByRole("button", { name: "Save" }))

      await screen.findByText("test:conflictTitle")
      await userEvent.click(screen.getByRole("button", { name: "test:conflictDiscard" }))

      await waitFor(() => expect(screen.queryByText("test:conflictTitle")).toBeNull())
      expect(await screen.findByLabelText("test:contactPhone")).toHaveValue("555-0100")
      expect(screen.getByRole("button", { name: "test:discardChanges" })).toBeDisabled()
    })

    it("confirms before a save empties a field inside a list", async () => {
      const bodies: Record<string, unknown>[] = []
      respondWithRows([
        row(LanguagesEnum.en, {
          footer: { links: [{ id: "about", text: "About", href: "/about" }] },
        }),
        row(LanguagesEnum.es, {
          footer: { links: [{ id: "about", text: "Acerca de", href: "/acerca" }] },
        }),
      ])
      server.use(
        ...SAVE_PATHS.map((path) =>
          rest.put(path, async (req, res, ctx) => {
            bodies.push(await req.json())
            return res(ctx.json({}))
          })
        )
      )
      renderPage()

      await screen.findByRole("heading", { level: 1, name: "Settings" })
      await userEvent.selectOptions(screen.getByLabelText("test:document"), "footer")
      await userEvent.selectOptions(screen.getByLabelText("Language"), LanguagesEnum.es)
      await userEvent.click(await screen.findByRole("button", { name: "Edit" }))
      await userEvent.clear(await screen.findByLabelText("test:linkText"))
      await userEvent.click(screen.getByRole("button", { name: "Done" }))
      await userEvent.click(screen.getByRole("button", { name: "Save" }))

      expect(await screen.findByText("test:hideWarningTitle")).toBeInTheDocument()
      expect(bodies).toHaveLength(0)
    })

    it("confirms before a save takes content off the site", async () => {
      const bodies: Record<string, unknown>[] = []
      respondWithRows([englishRow(), row(LanguagesEnum.es, { contact: { phone: "555-0199" } })])
      server.use(
        ...SAVE_PATHS.map((path) =>
          rest.put(path, async (req, res, ctx) => {
            bodies.push(await req.json())
            return res(ctx.json({}))
          })
        )
      )
      renderPage()

      await screen.findByRole("heading", { level: 1, name: "Settings" })
      await userEvent.selectOptions(screen.getByLabelText("test:document"), "contact")
      await userEvent.selectOptions(screen.getByLabelText("Language"), LanguagesEnum.es)
      await userEvent.clear(await screen.findByLabelText("test:contactPhone"))
      await userEvent.click(screen.getByRole("button", { name: "Save" }))

      expect(await screen.findByText("test:hideWarningTitle")).toBeInTheDocument()
      expect(bodies).toHaveLength(0)

      const dialog = screen.getByRole("dialog")
      await userEvent.click(within(dialog).getByRole("button", { name: "Save" }))

      await waitFor(() => expect(bodies).toHaveLength(1))
    })
  })
})
