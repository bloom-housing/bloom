import React from "react"
import { setupServer } from "msw/lib/node"
import { fireEvent, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { rest } from "msw"
import { AuthContext, MessageContext } from "@bloom-housing/shared-helpers"
import {
  FeatureFlagEnum,
  JurisdictionContentService,
  LanguagesEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { user } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { mockNextRouter, mockTipTapEditor, render } from "../../testUtils"
import SettingsContent from "../../../src/pages/settings/content"

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
      await userEvent.selectOptions(screen.getByLabelText("Content type"), "faq")

      expect(await screen.findByText("Applying")).toBeInTheDocument()
      expect(screen.getByText("How do I apply?")).toBeInTheDocument()
      expect(screen.getByRole("button", { name: "Add category" })).toBeInTheDocument()
      expect(screen.getByRole("button", { name: "Add question" })).toBeInTheDocument()
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
      await userEvent.selectOptions(screen.getByLabelText("Content type"), "footer")
      expect(await screen.findByRole("button", { name: "Delete" })).toBeInTheDocument()

      await userEvent.selectOptions(screen.getByLabelText("Language"), LanguagesEnum.es)

      expect(
        await screen.findByRole("button", { name: "Remove for this language" })
      ).toBeInTheDocument()
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
      await userEvent.selectOptions(screen.getByLabelText("Content type"), "footer")
      await userEvent.selectOptions(screen.getByLabelText("Language"), LanguagesEnum.es)

      expect(await screen.findByText("Removed for this language")).toBeInTheDocument()
      expect(screen.getByRole("button", { name: "Restore" })).toBeInTheDocument()
    })

    it("opens a drawer to edit an item", async () => {
      respondWithRows([
        row(LanguagesEnum.en, {
          footer: { links: [{ id: "about", text: "About", href: "/about" }] },
        }),
      ])
      renderPage()

      await screen.findByRole("heading", { level: 1, name: "Settings" })
      await userEvent.selectOptions(screen.getByLabelText("Content type"), "footer")
      await userEvent.click(await screen.findByRole("button", { name: "Edit" }))

      expect(await screen.findByText("Footer link")).toBeInTheDocument()
      expect(screen.getByLabelText("Link text")).toHaveValue("About")
    })

    it("says that footer text sections are replaced as a set for a language", async () => {
      respondWithRows([
        row(LanguagesEnum.en, { footer: { textSectionsHtml: ["<p>A section</p>"] } }),
        row(LanguagesEnum.es),
      ])
      renderPage()

      await screen.findByRole("heading", { level: 1, name: "Settings" })
      await userEvent.selectOptions(screen.getByLabelText("Content type"), "footer")
      await userEvent.selectOptions(screen.getByLabelText("Language"), LanguagesEnum.es)

      expect(
        await screen.findByText(
          "Text sections are replaced as a set for this language, so translating one means translating all of them."
        )
      ).toBeInTheDocument()
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
      await userEvent.selectOptions(screen.getByLabelText("Content type"), "contact")
      await userEvent.type(await screen.findByLabelText("Phone"), "9")
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
      await waitFor(() => expect(toasts).toContain("Content saved"))
    })

    it("discards pending edits without a reload", async () => {
      respondWithRows([englishRow()])
      renderPage()

      await screen.findByRole("heading", { level: 1, name: "Settings" })
      await userEvent.selectOptions(screen.getByLabelText("Content type"), "contact")
      await userEvent.type(await screen.findByLabelText("Phone"), "9")
      expect(screen.getByLabelText("Phone")).toHaveValue("555-01009")

      await userEvent.click(screen.getByRole("button", { name: "Discard changes" }))

      expect(await screen.findByLabelText("Phone")).toHaveValue("555-0100")
      expect(screen.getByRole("button", { name: "Discard changes" })).toBeDisabled()
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
      await userEvent.selectOptions(screen.getByLabelText("Content type"), "contact")
      await userEvent.type(await screen.findByLabelText("Phone"), "9")
      await userEvent.click(screen.getByRole("button", { name: "Save" }))

      expect(
        await screen.findByText("This content changed while you were editing")
      ).toBeInTheDocument()
      expect(screen.getByRole("button", { name: "Save mine" })).toBeInTheDocument()
      expect(screen.getByRole("button", { name: "Discard mine" })).toBeInTheDocument()
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
      await userEvent.selectOptions(screen.getByLabelText("Content type"), "contact")
      await userEvent.selectOptions(screen.getByLabelText("Language"), LanguagesEnum.es)
      await userEvent.clear(await screen.findByLabelText("Phone"))
      await userEvent.click(screen.getByRole("button", { name: "Save" }))

      expect(await screen.findByText("This will hide content")).toBeInTheDocument()
      expect(bodies).toHaveLength(0)

      const dialog = screen.getByRole("dialog")
      await userEvent.click(within(dialog).getByRole("button", { name: "Save" }))

      await waitFor(() => expect(bodies).toHaveLength(1))
    })
  })
})
