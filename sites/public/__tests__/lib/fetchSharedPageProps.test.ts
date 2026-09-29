import type axiosType from "axios"

/*
  A rebuild that cannot read the jurisdiction must not replace a good page with one rendered from
  the bundled content, since Next would then serve that for the rest of the revalidate window.
*/
type Hooks = typeof import("../../src/lib/hooks")

let mockedGet: jest.SpyInstance
let mockedLog: jest.SpyInstance
let hooks: Hooks

describe("fetchSharedPageProps", () => {
  beforeEach(() => {
    jest.resetModules()
    const axios = require("axios") as typeof axiosType
    mockedGet = jest.spyOn(axios, "get")
    mockedLog = jest.spyOn(console, "log").mockImplementation(() => undefined)
    hooks = require("../../src/lib/hooks") as Hooks
    process.env.backendApiBase = "http://localhost:3100"
    process.env.jurisdictionName = "Bloomington"
    process.env.API_PASS_KEY = "test-passkey"
    process.env.cacheRevalidate = "3600"
    delete process.env.NEXT_PHASE
  })

  afterEach(() => {
    mockedLog.mockRestore()
  })

  it("throws when a generated page cannot read the jurisdiction", async () => {
    mockedGet.mockRejectedValue(new Error("Request failed with status code 429"))

    await expect(hooks.fetchSharedPageProps("en")).rejects.toThrow(
      "could not read the jurisdiction"
    )
  })

  // A page rendered per request has no previously generated version to keep.
  it("renders degraded rather than throwing for a visitor request", async () => {
    mockedGet.mockRejectedValue(new Error("Request failed with status code 429"))
    const req = { headers: {}, socket: { remoteAddress: "203.0.113.9" } }

    const shared = await hooks.fetchSharedPageProps("en", req)

    expect(shared.jurisdiction).toBeNull()
  })

  // A build has no previous version either, and should not fail on a transient api error.
  it("does not throw during a production build", async () => {
    process.env.NEXT_PHASE = "phase-production-build"
    mockedGet.mockRejectedValue(new Error("Request failed with status code 429"))

    const shared = await hooks.fetchSharedPageProps("en")

    expect(shared.jurisdiction).toBeNull()
  })

  it("returns the shared props when the jurisdiction reads fine", async () => {
    mockedGet.mockResolvedValue({ data: { id: "a-jurisdiction", featureFlags: [] } })

    const shared = await hooks.fetchSharedPageProps("en")

    expect(shared.jurisdiction).toEqual({ id: "a-jurisdiction", featureFlags: [] })
  })
})
