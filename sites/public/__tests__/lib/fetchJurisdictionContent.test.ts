import type axiosType from "axios"

// The fetch caches per language, so each case gets a fresh module registry, and the spy has to be
// taken from the same one the module under test will import.
type Hooks = typeof import("../../src/lib/hooks")

let mockedGet: jest.SpyInstance
let fetchJurisdictionContent: Hooks["fetchJurisdictionContent"]
let API_TIMEOUT_MS: number

describe("fetchJurisdictionContent", () => {
  beforeEach(() => {
    jest.resetModules()
    const axios = require("axios") as typeof axiosType
    mockedGet = jest.spyOn(axios, "get")
    const hooks = require("../../src/lib/hooks") as Hooks
    fetchJurisdictionContent = hooks.fetchJurisdictionContent
    API_TIMEOUT_MS = hooks.API_TIMEOUT_MS
    process.env.backendApiBase = "http://localhost:3100"
    process.env.jurisdictionName = "Bloomington"
    process.env.API_PASS_KEY = "test-passkey"
    delete process.env.NEXT_PHASE
    mockedGet.mockResolvedValue({ data: { faq: { categories: [] } } })
  })

  it("asks for the pinned jurisdiction's content in the given language", async () => {
    await fetchJurisdictionContent("es")

    expect(mockedGet).toHaveBeenCalledWith(
      "http://localhost:3100/jurisdictionContent/byName/Bloomington",
      {
        params: { language: "es" },
        headers: { passkey: process.env.API_PASS_KEY },
        timeout: API_TIMEOUT_MS,
      }
    )
  })

  it("passes on every document, and leaves out the ones with no row", async () => {
    mockedGet.mockResolvedValue({
      data: {
        footer: { textSectionsHtml: [] },
        faq: { categories: [] },
        resources: { resourceSections: [] },
        disclaimers: { privacyHtml: "<p>Ours</p>" },
        contact: null,
      },
    })

    const content = await fetchJurisdictionContent()

    expect(content).toEqual({
      footer: { textSectionsHtml: [] },
      faq: { categories: [] },
      resources: { resourceSections: [] },
      disclaimers: { privacyHtml: "<p>Ours</p>" },
    })
  })

  it("defaults to English when no language is given", async () => {
    await fetchJurisdictionContent()

    expect(mockedGet).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ params: { language: "en" } })
    )
  })

  it("attributes the request to the visitor when it has one", async () => {
    await fetchJurisdictionContent("en", {
      headers: { "x-forwarded-for": "203.0.113.1" },
      socket: { remoteAddress: "198.51.100.9" },
    })

    expect(mockedGet).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({ "x-forwarded-for": "203.0.113.1" }),
      })
    )
  })

  it("returns null when the jurisdiction has no content row", async () => {
    // A 204 arrives with an empty body.
    mockedGet.mockResolvedValue({ data: "" })

    expect(await fetchJurisdictionContent("en")).toBeNull()
  })

  it("returns null when the request fails, so the page keeps its bundled content", async () => {
    mockedGet.mockRejectedValue(new Error("no api"))

    expect(await fetchJurisdictionContent("en")).toBeNull()
  })

  it("asks once per language during a build", async () => {
    process.env.NEXT_PHASE = "phase-production-build"

    await fetchJurisdictionContent("vi")
    await fetchJurisdictionContent("vi")

    expect(mockedGet).toHaveBeenCalledTimes(1)
  })
})

describe("fetchSharedPageProps", () => {
  const flagOn = {
    featureFlags: [{ name: "enableDbDrivenContent", active: true }],
  }
  const flagOff = {
    featureFlags: [{ name: "enableDbDrivenContent", active: false }],
  }

  let fetchSharedPageProps: Hooks["fetchSharedPageProps"]
  let hooks: Hooks

  beforeEach(() => {
    jest.resetModules()
    const axios = require("axios") as typeof axiosType
    mockedGet = jest.spyOn(axios, "get")
    hooks = require("../../src/lib/hooks") as Hooks
    fetchSharedPageProps = hooks.fetchSharedPageProps
    process.env.backendApiBase = "http://localhost:3100"
    process.env.jurisdictionName = "Bloomington"
    process.env.API_PASS_KEY = "test-passkey"
    process.env.cacheRevalidate = "30"
  })

  it("reads the stored content when the jurisdiction has the flag on", async () => {
    mockedGet.mockImplementation((url: string) =>
      Promise.resolve({
        data: url.includes("/jurisdictions/byName/") ? flagOn : { faq: { categories: [] } },
      })
    )

    const props = await fetchSharedPageProps("en")

    expect(props.jurisdictionContent).toEqual({ faq: { categories: [] } })
  })

  // Deleting the rows is otherwise the only way to take a jurisdiction back off stored content.
  it("leaves the content unread when the flag is off", async () => {
    mockedGet.mockImplementation((url: string) =>
      Promise.resolve({ data: url.includes("/jurisdictions/byName/") ? flagOff : {} })
    )

    const props = await fetchSharedPageProps("en")

    expect(props.jurisdictionContent).toBeNull()
    expect(
      mockedGet.mock.calls.some(([url]) => String(url).includes("/jurisdictionContent/"))
    ).toBe(false)
  })
})
