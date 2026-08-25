import type axiosType from "axios"

// The jurisdiction is cached in a module variable, so each case gets a fresh module registry, and
// the spy has to be taken from the same one the module under test will import.
type Hooks = typeof import("../../src/lib/hooks")

let mockedGet: jest.SpyInstance
let mockedLog: jest.SpyInstance
let fetchJurisdictionByName: Hooks["fetchJurisdictionByName"]
let API_TIMEOUT_MS: number

describe("fetchJurisdictionByName", () => {
  beforeEach(() => {
    jest.resetModules()
    const axios = require("axios") as typeof axiosType
    mockedGet = jest.spyOn(axios, "get")
    mockedLog = jest.spyOn(console, "log").mockImplementation(() => undefined)
    const hooks = require("../../src/lib/hooks") as Hooks
    fetchJurisdictionByName = hooks.fetchJurisdictionByName
    API_TIMEOUT_MS = hooks.API_TIMEOUT_MS
    process.env.backendApiBase = "http://localhost:3100"
    process.env.jurisdictionName = "Bloomington"
    process.env.API_PASS_KEY = "test-passkey"
    mockedGet.mockResolvedValue({ data: { id: "jurisdiction-id" } })
  })

  afterEach(() => {
    mockedLog.mockRestore()
  })

  it("gives up on the request rather than waiting on an unresponsive api", async () => {
    await fetchJurisdictionByName()

    expect(mockedGet).toHaveBeenCalledWith(
      "http://localhost:3100/jurisdictions/byName/Bloomington",
      {
        headers: { passkey: process.env.API_PASS_KEY },
        timeout: API_TIMEOUT_MS,
      }
    )
  })

  it("attributes the request to the visitor when it has one", async () => {
    await fetchJurisdictionByName({
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

  it("keeps the passkey out of the log when the request fails", async () => {
    mockedGet.mockRejectedValue(
      Object.assign(new Error("timeout of 5000ms exceeded"), {
        config: { headers: { passkey: process.env.API_PASS_KEY } },
      })
    )

    await fetchJurisdictionByName()

    expect(mockedLog).toHaveBeenCalledWith(
      "error fetching jurisdiction = ",
      "timeout of 5000ms exceeded"
    )
    expect(JSON.stringify(mockedLog.mock.calls)).not.toContain("test-passkey")
  })

  it("returns null when the request fails, so the page keeps its bundled content", async () => {
    mockedGet.mockRejectedValue(new Error("no api"))

    expect(await fetchJurisdictionByName()).toBeNull()
  })

  it("asks once and reuses the answer", async () => {
    await fetchJurisdictionByName()
    await fetchJurisdictionByName()

    expect(mockedGet).toHaveBeenCalledTimes(1)
  })
})
