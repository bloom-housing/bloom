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
  "t.cancel": "test:cancel",
  "transfer.export": "test:export",
  "transfer.exportScope": "test:exportScope",
  "transfer.globalStrings": "test:globalStrings",
  "transfer.importFile": "test:importFile",
  "transfer.import": "test:import",
  "transfer.imported": "test:imported",
  "transfer.invalidFile": "test:invalidFile",
  "transfer.change.added": "test:added",
  "transfer.change.changed": "test:replaced",
  "transfer.change.removed": "test:removed",
  "transfer.logo": "test:logo %{change}",
  "transfer.favicon": "test:favicon %{change}",
  "transfer.brandFields": "test:fields %{fields}",
  "transfer.replacesJurisdiction": "test:replaces %{jurisdiction}",
  "transfer.replacesGlobal": "test:replacesGlobal",
  "transfer.content": "test:content",
  "transfer.brand": "test:brand",
  "transfer.noStringChanges": "test:noStringChanges",
  "transfer.noContentChanges": "test:noContentChanges",
  "transfer.noBrandChanges": "test:noBrandChanges",
  "transfer.imageCount": "test:images %{smart_count}",
  "transfer.imageType": "test:imageType %{fileId}",
  "transfer.missingImage": "test:missingImage %{fileId}",
  "transfer.uploadFailed": "test:uploadFailed %{fileId}",
  "translations.sitePublic": "test:sitePublic",
  "languages.es": "test:spanish",
  "languages.en": "test:english",
})

const server = setupServer()

let toasts: string[] = []
let pushMock: jest.Mock
let exportedBlobs: Blob[] = []
let downloads: string[] = []
let uploadedFiles: File[] = []

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
    { fileId: "brand-logo", contentType: "image/png", data: btoa("png bytes") },
    // Listed but referenced by nothing, so it must never be uploaded.
    { fileId: "stray", contentType: "text/html", data: btoa("<script></script>") },
  ],
}

const preview = {
  jurisdictionName: "Bloomington",
  translations: [{ site: "public", language: LanguagesEnum.es, added: 2, changed: 1, removed: 3 }],
  content: [{ language: LanguagesEnum.en, change: "changed" }],
  brand: { fields: ["primary"], logo: "changed", favicon: "removed" },
}

const uploader = helpers.fileUploader as jest.MockedFunction<typeof helpers.fileUploader>

const uploadSucceeds = () =>
  uploader.mockImplementation(({ file, setFileUploadData, setProgressValue }) => {
    uploadedFiles.push(file)
    setProgressValue(100)
    setFileUploadData({ id: "new-logo", url: "https://example.test/new-logo", fileId: "new-logo" })
    return Promise.resolve()
  })

const respondToPreview = (body: unknown = preview) =>
  server.use(
    ...paths("import/preview").map((path) =>
      rest.post(path, (_req, res, ctx) => res(ctx.json(body)))
    )
  )

const captureApplies = (applied: Record<string, unknown>[], status = 200) =>
  server.use(
    ...paths("import").map((path) =>
      rest.post(path, async (req, res, ctx) => {
        applied.push(await req.json())
        return status === 200
          ? res(ctx.json({ success: true }))
          : res(ctx.status(status), ctx.json({ message: "the brand is not valid" }))
      })
    )
  )

beforeAll(() => server.listen())

beforeEach(() => {
  toasts = []
  exportedBlobs = []
  downloads = []
  uploadedFiles = []
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
  uploader.mockReset()
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
    {
      id: "jurisdiction2",
      name: "Lakeview",
      languages: [LanguagesEnum.en],
      featureFlags: [],
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

const chooseFile = async (contents: unknown) => {
  await screen.findByLabelText("test:importFile")
  await userEvent.upload(
    document.getElementById("transfer-import-file") as HTMLInputElement,
    new File([typeof contents === "string" ? contents : JSON.stringify(contents)], "export.json", {
      type: "application/json",
    })
  )
}

const cellsOf = (row: HTMLElement) =>
  within(row)
    .getAllByRole("cell")
    .map((cell) => cell.textContent)

describe("settings/transfer", () => {
  it("sends a non-admin to unauthorized", () => {
    renderPage({ userRoles: { isJurisdictionalAdmin: true } })

    expect(pushMock).toHaveBeenCalledWith("/unauthorized")
  })

  describe("export", () => {
    it("offers only the jurisdictions with content or branding from the database", async () => {
      renderPage()

      const options = within(await screen.findByLabelText("test:exportScope"))
        .getAllByRole("option")
        .map((option) => option.textContent)
      expect(options).toEqual(["Bloomington", "test:globalStrings"])
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

    it("keeps letters outside ASCII in the file name", async () => {
      server.use(
        ...paths("jurisdictions/:jurisdictionId/export").map((path) =>
          rest.get(path, (_req, res, ctx) =>
            res(ctx.json({ ...exportFile, jurisdictionName: "San José!" }))
          )
        )
      )
      renderPage()

      await userEvent.click(await screen.findByRole("button", { name: "test:export" }))

      await waitFor(() => expect(downloads).toHaveLength(1))
      expect(downloads[0]).toMatch(/^san-josé-content-/)
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

    it("shows why an export failed, and downloads nothing", async () => {
      server.use(
        ...paths("jurisdictions/:jurisdictionId/export").map((path) =>
          rest.get(path, (_req, res, ctx) =>
            res(ctx.status(502), ctx.json({ message: "file brand-logo could not be read" }))
          )
        )
      )
      renderPage()

      await userEvent.click(await screen.findByRole("button", { name: "test:export" }))

      await waitFor(() => expect(toasts).toContain("file brand-logo could not be read"))
      expect(downloads).toEqual([])
    })
  })

  describe("preview", () => {
    it("shows each change without sending the files", async () => {
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

      await chooseFile(exportFile)

      const table = await screen.findByTestId("transfer-string-changes")
      expect(cellsOf(within(table).getAllByRole("row")[1])).toEqual([
        "test:sitePublic",
        "test:spanish",
        "2",
        "1",
        "3",
      ])
      expect(screen.getByText("test:replaces Bloomington")).toBeInTheDocument()
      expect(screen.getByText("test:english: test:replaced")).toBeInTheDocument()
      expect(screen.getByText("test:fields primary")).toBeInTheDocument()
      expect(screen.getByText("test:logo test:replaced")).toBeInTheDocument()
      expect(screen.getByText("test:favicon test:removed")).toBeInTheDocument()
      expect(screen.getByText("test:images 1")).toBeInTheDocument()
      expect(bodies[0]).not.toHaveProperty("assets")
      expect(bodies[0]).toEqual(expect.objectContaining({ jurisdictionName: "Bloomington" }))
    })

    it("says when nothing changes", async () => {
      respondToPreview({
        ...preview,
        translations: [],
        content: [],
        brand: { fields: [], logo: null, favicon: null },
      })
      renderPage()

      await chooseFile({ ...exportFile, brand: { ...exportFile.brand, logoFileId: null } })

      expect(await screen.findByText("test:noStringChanges")).toBeInTheDocument()
      expect(screen.getByText("test:noContentChanges")).toBeInTheDocument()
      expect(screen.getByText("test:noBrandChanges")).toBeInTheDocument()
      expect(screen.queryByText(/test:images/)).not.toBeInTheDocument()
    })

    it("shows only strings for a global file", async () => {
      respondToPreview({ jurisdictionName: null, translations: [], content: [] })
      renderPage()

      await chooseFile({ ...exportFile, jurisdictionName: null, brand: undefined, assets: [] })

      expect(await screen.findByText("test:replacesGlobal")).toBeInTheDocument()
      expect(screen.queryByText("test:content")).not.toBeInTheDocument()
      expect(screen.queryByText("test:brand")).not.toBeInTheDocument()
    })

    it("shows the file dropped last, whichever preview returns first", async () => {
      server.use(
        ...paths("import/preview").map((path) =>
          rest.post(path, async (req, res, ctx) => {
            const body = await req.json()
            return body.jurisdictionName === "Slow"
              ? res(ctx.delay(300), ctx.json({ ...preview, jurisdictionName: "Slow" }))
              : res(ctx.json({ ...preview, jurisdictionName: "Fast" }))
          })
        )
      )
      renderPage()

      await chooseFile({ ...exportFile, jurisdictionName: "Slow" })
      await chooseFile({ ...exportFile, jurisdictionName: "Fast" })

      expect(await screen.findByText("test:replaces Fast")).toBeInTheDocument()
      await new Promise((resolve) => setTimeout(resolve, 400))
      expect(screen.queryByText("test:replaces Slow")).not.toBeInTheDocument()
    })

    it.each([
      [
        "an image the file refers to but does not include",
        { ...exportFile, assets: [] },
        "test:missingImage brand-logo",
      ],
      [
        "an image of a type the editors do not accept",
        {
          ...exportFile,
          assets: [{ fileId: "brand-logo", contentType: "text/html", data: btoa("<p></p>") }],
        },
        "test:imageType brand-logo",
      ],
      [
        "a favicon that is not a PNG",
        {
          ...exportFile,
          brand: { brand: null, logoFileId: null, faviconFileId: "brand-favicon" },
          assets: [{ fileId: "brand-favicon", contentType: "image/svg+xml", data: btoa("<svg/>") }],
        },
        "test:imageType brand-favicon",
      ],
    ])("refuses %s before asking for a preview", async (_label, file, message) => {
      const previews: unknown[] = []
      server.use(
        ...paths("import/preview").map((path) =>
          rest.post(path, (req, res, ctx) => {
            previews.push(req.body)
            return res(ctx.json(preview))
          })
        )
      )
      renderPage()

      await chooseFile(file)

      await waitFor(() => expect(toasts).toContain(message))
      expect(previews).toEqual([])
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

      await chooseFile({ ...exportFile, jurisdictionName: "Lakeview" })

      await waitFor(() =>
        expect(toasts).toContain("jurisdiction Lakeview does not exist in this environment")
      )
    })

    it("refuses a file that is not JSON", async () => {
      renderPage()

      await chooseFile("not json")

      await waitFor(() => expect(toasts).toContain("test:invalidFile"))
    })

    it("closes on cancel without uploading or importing", async () => {
      const applied: Record<string, unknown>[] = []
      respondToPreview()
      captureApplies(applied)
      renderPage()

      await chooseFile(exportFile)
      await userEvent.click(await screen.findByRole("button", { name: "test:cancel" }))

      await waitFor(() =>
        expect(screen.queryByTestId("transfer-string-changes")).not.toBeInTheDocument()
      )
      expect(uploader).not.toHaveBeenCalled()
      expect(applied).toEqual([])
    })
  })

  describe("import", () => {
    it("uploads only the referenced images, then applies with their new keys", async () => {
      uploadSucceeds()
      const applied: Record<string, unknown>[] = []
      respondToPreview()
      captureApplies(applied)
      renderPage()

      await chooseFile(exportFile)
      await userEvent.click(await screen.findByRole("button", { name: "test:import" }))

      await waitFor(() => expect(toasts).toContain("test:imported"))
      expect(uploader).toHaveBeenCalledTimes(1)
      expect(uploader).toHaveBeenCalledWith(
        expect.objectContaining({ contentType: "image/png", contentDisposition: "inline" })
      )
      expect(await blobText(uploadedFiles[0])).toEqual("png bytes")
      expect(applied[0]).toEqual(
        expect.objectContaining({
          jurisdictionName: "Bloomington",
          fileIds: { "brand-logo": "new-logo" },
        })
      )
      expect(applied[0]).not.toHaveProperty("assets")
    })

    it("names the image that failed to upload, and imports nothing", async () => {
      uploader.mockImplementation(({ setProgressValue }) => {
        setProgressValue(1)
        setProgressValue(0)
        return Promise.resolve()
      })
      const applied: Record<string, unknown>[] = []
      respondToPreview()
      captureApplies(applied)
      renderPage()

      await chooseFile(exportFile)
      await userEvent.click(await screen.findByRole("button", { name: "test:import" }))

      await waitFor(() => expect(toasts).toContain("test:uploadFailed brand-logo"))
      expect(applied).toEqual([])
      expect(screen.getByTestId("transfer-string-changes")).toBeInTheDocument()
    })

    it("keeps the dialog open after a refused import, and does not upload again on retry", async () => {
      uploadSucceeds()
      const applied: Record<string, unknown>[] = []
      respondToPreview()
      captureApplies(applied, 400)
      renderPage()

      await chooseFile(exportFile)
      await userEvent.click(await screen.findByRole("button", { name: "test:import" }))
      await waitFor(() => expect(toasts).toContain("the brand is not valid"))
      expect(screen.getByTestId("transfer-string-changes")).toBeInTheDocument()

      captureApplies(applied)
      await userEvent.click(screen.getByRole("button", { name: "test:import" }))

      await waitFor(() => expect(toasts).toContain("test:imported"))
      expect(uploader).toHaveBeenCalledTimes(1)
      expect(applied[1]).toEqual(expect.objectContaining({ fileIds: { "brand-logo": "new-logo" } }))
    })

    it("cannot be closed while it runs", async () => {
      // The upload never finishes, so the import stays in progress.
      uploader.mockImplementation(() => Promise.resolve())
      respondToPreview()
      renderPage()

      await chooseFile(exportFile)
      await userEvent.click(await screen.findByRole("button", { name: "test:import" }))
      await waitFor(() => expect(uploader).toHaveBeenCalled())
      await userEvent.keyboard("{Escape}")

      expect(screen.getByTestId("transfer-string-changes")).toBeInTheDocument()
    })
  })
})
