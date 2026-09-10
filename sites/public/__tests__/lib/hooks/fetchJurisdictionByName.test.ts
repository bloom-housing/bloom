import axios from "axios"

const mockedGet = jest.spyOn(axios, "get")

const loadHooks = () => {
  let hooks: typeof import("../../../src/lib/hooks")
  jest.isolateModules(() => {
    hooks = require("../../../src/lib/hooks")
  })
  return hooks
}

describe("fetchJurisdictionByName", () => {
  afterAll(() => mockedGet.mockRestore())

  beforeEach(() => {
    jest.clearAllMocks()
    process.env.backendApiBase = "http://localhost:3100"
    process.env.jurisdictionName = "Bloomington"
    process.env.API_PASS_KEY = "test-passkey"
    process.env.cacheRevalidate = "30"
    mockedGet.mockResolvedValue({ data: { id: "jurisdiction-id", name: "Bloomington" } })
  })

  it("asks for the pinned jurisdiction", async () => {
    await loadHooks().fetchJurisdictionByName()

    expect(mockedGet).toHaveBeenCalledWith(
      "http://localhost:3100/jurisdictions/byName/Bloomington",
      { headers: { passkey: "test-passkey" } }
    )
  })

  it("serves the cached jurisdiction until the revalidate window passes", async () => {
    const hooks = loadHooks()
    await hooks.fetchJurisdictionByName()
    await hooks.fetchJurisdictionByName()

    expect(mockedGet).toHaveBeenCalledTimes(1)
  })

  it("fetches again once the revalidate window has passed", async () => {
    const hooks = loadHooks()
    await hooks.fetchJurisdictionByName()

    const past = Date.now() + hooks.jurisdictionCacheTtlMs() + 1
    const now = jest.spyOn(Date, "now").mockReturnValue(past)
    await hooks.fetchJurisdictionByName()
    now.mockRestore()

    expect(mockedGet).toHaveBeenCalledTimes(2)
  })

  it("retries after a failed fetch rather than caching the failure", async () => {
    mockedGet.mockRejectedValueOnce(new Error("api down"))
    const hooks = loadHooks()

    expect(await hooks.fetchJurisdictionByName()).toBeNull()
    expect(await hooks.fetchJurisdictionByName()).toEqual({
      id: "jurisdiction-id",
      name: "Bloomington",
    })
  })

  it("forwards the visitor's address when a request is given", async () => {
    await loadHooks().fetchJurisdictionByName({
      headers: { "x-forwarded-for": "203.0.113.9" },
      socket: {},
    })

    expect(mockedGet).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: { passkey: "test-passkey", "x-forwarded-for": "203.0.113.9" },
      })
    )
  })
})
