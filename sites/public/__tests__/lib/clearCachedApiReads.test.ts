import type axiosType from "axios"

// The caches are module state, so each case gets a fresh module registry and the spy has to come
// from the same one the module under test will import.
type Hooks = typeof import("../../src/lib/hooks")

let mockedGet: jest.SpyInstance
let hooks: Hooks

describe("clearCachedApiReads", () => {
  beforeEach(() => {
    jest.resetModules()
    const axios = require("axios") as typeof axiosType
    mockedGet = jest.spyOn(axios, "get")
    hooks = require("../../src/lib/hooks") as Hooks
    process.env.backendApiBase = "http://localhost:3100"
    process.env.jurisdictionName = "Bloomington"
    process.env.API_PASS_KEY = "test-passkey"
    process.env.cacheRevalidate = "3600"
    delete process.env.NEXT_PHASE
  })

  it("sends the next public override read back to the api", async () => {
    mockedGet.mockResolvedValue({ data: { en: { "a.key": "First" } } })
    await hooks.fetchPublicOverrides("en")
    await hooks.fetchPublicOverrides("en")
    expect(mockedGet).toHaveBeenCalledTimes(1)

    hooks.clearCachedApiReads()
    await hooks.fetchPublicOverrides("en")

    expect(mockedGet).toHaveBeenCalledTimes(2)
  })

  it("clears every language, not only the one last read", async () => {
    mockedGet.mockResolvedValue({ data: { en: { "a.key": "First" } } })
    await hooks.fetchPublicOverrides("en")
    await hooks.fetchPublicOverrides("es")
    expect(mockedGet).toHaveBeenCalledTimes(2)

    hooks.clearCachedApiReads()
    await hooks.fetchPublicOverrides("en")
    await hooks.fetchPublicOverrides("es")

    expect(mockedGet).toHaveBeenCalledTimes(4)
  })

  it("clears the jurisdiction content cache", async () => {
    mockedGet.mockResolvedValue({ data: { footer: {} } })
    await hooks.fetchJurisdictionContent("en")
    await hooks.fetchJurisdictionContent("en")
    expect(mockedGet).toHaveBeenCalledTimes(1)

    hooks.clearCachedApiReads()
    await hooks.fetchJurisdictionContent("en")

    expect(mockedGet).toHaveBeenCalledTimes(2)
  })

  // The jurisdiction is held in module scalars rather than a Map, and the brand and feature flags
  // sit behind it, so a brand edit depends on this one being cleared too.
  it("clears the jurisdiction cache", async () => {
    mockedGet.mockResolvedValue({ data: { id: "a-jurisdiction" } })
    await hooks.fetchJurisdictionByName()
    await hooks.fetchJurisdictionByName()
    expect(mockedGet).toHaveBeenCalledTimes(1)

    hooks.clearCachedApiReads()
    await hooks.fetchJurisdictionByName()

    expect(mockedGet).toHaveBeenCalledTimes(2)
  })

  it("is safe to call when nothing has been read yet", () => {
    expect(() => hooks.clearCachedApiReads()).not.toThrow()
  })

  // This number decides how long a revalidation that never arrived stays visible, and every other
  // spec sets it explicitly, so the fallback is worth pinning.
  it("serves a cached read for an hour when cacheRevalidate is unset", async () => {
    delete process.env.cacheRevalidate
    mockedGet.mockResolvedValue({ data: { en: { "a.key": "First" } } })
    const readAt = Date.now()
    const clock = jest.spyOn(Date, "now")

    await hooks.fetchPublicOverrides("en")

    clock.mockReturnValue(readAt + 59 * 60 * 1000)
    await hooks.fetchPublicOverrides("en")
    expect(mockedGet).toHaveBeenCalledTimes(1)

    clock.mockReturnValue(readAt + 61 * 60 * 1000)
    await hooks.fetchPublicOverrides("en")
    expect(mockedGet).toHaveBeenCalledTimes(2)

    clock.mockRestore()
  })
})
