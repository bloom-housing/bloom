import React from "react"
import { setupServer } from "msw/lib/node"
import { screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { rest } from "msw"
import { addTranslation } from "@bloom-housing/ui-components"
import { AuthContext, MessageContext } from "@bloom-housing/shared-helpers"
import {
  ContentTransferService,
  FeatureFlagEnum,
  LanguagesEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { user } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { mockNextRouter, render } from "../../testUtils"
import * as helpers from "../../../src/lib/helpers"
import SettingsTransfer from "../../../src/pages/settings/transfer"

jest.mock("../../../src/lib/helpers", () => ({
  ...jest.requireActual("../../../src/lib/helpers"),
  fileUploader: jest.fn(),
}))

// The suite supplies the strings it asserts on, so editing the shipped copy cannot break it.
addTranslation({
  "transfer.export": "test:export",
  "transfer.exportScope": "test:exportScope",
  "transfer.globalStrings": "test:globalStrings",
  "transfer.importFile": "test:importFile",
  "transfer.import": "test:import",
  "transfer.imported": "test:imported",
  "transfer.invalidFile": "test:invalidFile",
  "transfer.change.changed": "test:replaced",
  "transfer.logo": "test:logo %{change}",
})

const server = setupServer()

let toasts: string[] = []
let pushMock: jest.Mock
let exportedBlobs: Blob[] = []
let downloads: string[] = []

// The first request goes straight to the API; once AuthProvider has configured axios the rest go
// through the adapter path, so both are answered.
const paths = (path: string) => [
  `http://localhost:3100/contentTransfer/${path}`,
  `http://localhost/api/adapter/contentTransfer/${path}`,
]

const exportFile = {
  format: "bloom-content-transfer",
  version: 1,
  exportedAt: "2026-09-30T00:00:00.000Z",
  jurisdictionName: "Bloomington",
  translations: [],
  content: [],
  brand: { brand: null, logoFileId: "brand-logo", faviconFileId: null },
  assets: [
    {
      fileId: "brand-logo",
      contentType: "image/png",
      data: btoa("png bytes"),
    },
  ],
}

const preview = {
  jurisdictionName: "Bloomington",
  translations: [{ site: "public", language: LanguagesEnum.es, added: 2, changed: 1, removed: 3 }],
  content: [{ language: LanguagesEnum.en, change: "changed" }],
  brand: { fields: [], logo: "changed", favicon: null },
}

beforeAll(() => server.listen())

beforeEach(() => {
  toasts = []
  exportedBlobs = []
  downloads = []
  pushMock = mockNextRouter().pushMock
  window.URL.createObjectURL = jest.fn((blob: Blob) => {
    exportedBlobs.push(blob)
    return "blob:export"
  })
  window.URL.revokeObjectURL = jest.fn()
  jest
    .spyOn(HTMLAnchorElement.prototype, "click")
    .mockImplementation(function (this: HTMLAnchorElement) {
      downloads.push(this.getAttribute("download"))
    })
  server.use(rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => res(ctx.json(user))))
})

afterEach(() => {
  server.resetHandlers()
  jest.restoreAllMocks()
})
afterAll(() => server.close())

const adminProfile = {
  ...user,
  userRoles: { isAdmin: true },
  jurisdictions: [
    {
      id: "jurisdiction1",
      name: "Bloomington",
      languages: [LanguagesEnum.en],
      featureFlags: [{ name: FeatureFlagEnum.enableDbDrivenContent, active: true }],
    },
  ],
  listings: [],
}

const renderPage = (profileOverrides = {}) =>
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
          contentTransferService: new ContentTransferService(),
          doJurisdictionsHaveFeatureFlagOn: (featureFlag) =>
            featureFlag === FeatureFlagEnum.enableDbDrivenContent,
        }}
      >
        <SettingsTransfer />
      </AuthContext.Provider>
    </MessageContext.Provider>
  )

const blobText = (blob: Blob) =>
  new Promise<string>((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.readAsText(blob)
  })

const chooseFile = async (contents: string) => {
  await userEvent.upload(
    document.getElementById("transfer-import-file") as HTMLInputElement,
    new File([contents], "export.json", { type: "application/json" })
  )
}

describe("settings/transfer", () => {
  it("sends a non-admin to unauthorized", () => {
    renderPage({ userRoles: { isJurisdictionalAdmin: true } })

    expect(pushMock).toHaveBeenCalledWith("/unauthorized")
  })

  it("downloads the selected jurisdiction's export as a file", async () => {
    server.use(
      ...paths("jurisdictions/:jurisdictionId/export").map((path) =>
        rest.get(path, (req, res, ctx) =>
          req.params.jurisdictionId === "jurisdiction1"
            ? res(ctx.json(exportFile))
            : res(ctx.status(404))
        )
      )
    )
    renderPage()

    await userEvent.click(await screen.findByRole("button", { name: "test:export" }))

    await waitFor(() => expect(downloads).toHaveLength(1))
    expect(downloads[0]).toMatch(/^bloomington-content-\d{4}-\d{2}-\d{2}\.json$/)
    expect(JSON.parse(await blobText(exportedBlobs[0]))).toEqual(exportFile)
  })

  it("exports the global strings when they are chosen", async () => {
    server.use(
      ...paths("global/export").map((path) =>
        rest.get(path, (_req, res, ctx) =>
          res(ctx.json({ ...exportFile, jurisdictionName: null, assets: [] }))
        )
      )
    )
    renderPage()

    await userEvent.selectOptions(await screen.findByLabelText("test:exportScope"), "global")
    await userEvent.click(screen.getByRole("button", { name: "test:export" }))

    await waitFor(() => expect(downloads).toHaveLength(1))
    expect(downloads[0]).toMatch(/^global-content-/)
  })

  it("previews an import without sending the files", async () => {
    const bodies: Record<string, unknown>[] = []
    server.use(
      ...paths("import/preview").map((path) =>
        rest.post(path, async (req, res, ctx) => {
          bodies.push(await req.json())
          return res(ctx.json(preview))
        })
      )
    )
    renderPage()

    await screen.findByLabelText("test:importFile")
    await chooseFile(JSON.stringify(exportFile))

    const table = await screen.findByTestId("transfer-string-changes")
    expect(within(table).getByText("2")).toBeInTheDocument()
    expect(within(table).getByText("3")).toBeInTheDocument()
    expect(screen.getByText("test:logo test:replaced")).toBeInTheDocument()
    expect(bodies[0]).not.toHaveProperty("assets")
    expect(bodies[0]).toEqual(expect.objectContaining({ jurisdictionName: "Bloomington" }))
  })

  it("uploads the files, then applies the import with their new keys", async () => {
    const uploader = helpers.fileUploader as jest.MockedFunction<typeof helpers.fileUploader>
    uploader.mockImplementation(({ setFileUploadData, setProgressValue }) => {
      setProgressValue(100)
      setFileUploadData({
        id: "new-logo",
        url: "https://example.test/new-logo",
        fileId: "new-logo",
      })
      return Promise.resolve()
    })
    const applied: Record<string, unknown>[] = []
    server.use(
      ...paths("import/preview").map((path) =>
        rest.post(path, (_req, res, ctx) => res(ctx.json(preview)))
      ),
      ...paths("import").map((path) =>
        rest.post(path, async (req, res, ctx) => {
          applied.push(await req.json())
          return res(ctx.json({ success: true }))
        })
      )
    )
    renderPage()

    await screen.findByLabelText("test:importFile")
    await chooseFile(JSON.stringify(exportFile))
    await userEvent.click(await screen.findByRole("button", { name: "test:import" }))

    await waitFor(() => expect(toasts).toContain("test:imported"))
    expect(uploader).toHaveBeenCalledWith(
      expect.objectContaining({ contentType: "image/png", contentDisposition: "inline" })
    )
    expect(applied[0]).toEqual(
      expect.objectContaining({
        jurisdictionName: "Bloomington",
        fileIds: { "brand-logo": "new-logo" },
      })
    )
    expect(applied[0]).not.toHaveProperty("assets")
  })

  it("shows why the API refused a file", async () => {
    server.use(
      ...paths("import/preview").map((path) =>
        rest.post(path, (_req, res, ctx) =>
          res(
            ctx.status(400),
            ctx.json({ message: "jurisdiction Lakeview does not exist in this environment" })
          )
        )
      )
    )
    renderPage()

    await screen.findByLabelText("test:importFile")
    await chooseFile(JSON.stringify({ ...exportFile, jurisdictionName: "Lakeview" }))

    await waitFor(() =>
      expect(toasts).toContain("jurisdiction Lakeview does not exist in this environment")
    )
  })

  it("refuses a file that is not JSON", async () => {
    renderPage()

    await screen.findByLabelText("test:importFile")
    await chooseFile("not json")

    await waitFor(() => expect(toasts).toContain("test:invalidFile"))
  })
})
