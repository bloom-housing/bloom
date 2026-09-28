import type axiosType from "axios"

// The passkey authenticates every read these functions make. A failed request must not put it in
// the log, since the public site's stdout is collected for the whole deployment.
type Hooks = typeof import("../../src/lib/hooks")

const PASSKEY = "test-passkey"

let mockedGet: jest.SpyInstance
let mockedPost: jest.SpyInstance
let mockedLog: jest.SpyInstance
let hooks: Hooks

const axiosErrorCarryingThePasskey = () =>
  Object.assign(new Error("timeout of 5000ms exceeded"), {
    config: { headers: { passkey: PASSKEY } },
  })

describe("passkey logging", () => {
  beforeEach(() => {
    jest.resetModules()
    const axios = require("axios") as typeof axiosType
    mockedGet = jest.spyOn(axios, "get")
    mockedPost = jest.spyOn(axios, "post")
    mockedLog = jest.spyOn(console, "log").mockImplementation(() => undefined)
    hooks = require("../../src/lib/hooks") as Hooks
    process.env.backendApiBase = "http://localhost:3100"
    process.env.jurisdictionName = "Bloomington"
    process.env.API_PASS_KEY = PASSKEY
    mockedGet.mockRejectedValue(axiosErrorCarryingThePasskey())
    mockedPost.mockRejectedValue(axiosErrorCarryingThePasskey())
  })

  afterEach(() => {
    mockedLog.mockRestore()
  })

  it("keeps the passkey out of the log when a listing read fails", async () => {
    mockedGet.mockResolvedValue({ data: { id: "a-jurisdiction", featureFlags: [] } })

    await hooks.fetchBaseListingData({ limit: "1" })

    expect(mockedPost).toHaveBeenCalled()
    expect(mockedLog).toHaveBeenCalledWith(
      "fetchBaseListingData error: ",
      "timeout of 5000ms exceeded"
    )
    expect(JSON.stringify(mockedLog.mock.calls)).not.toContain(PASSKEY)
  })

  it("keeps the passkey out of the log when the multiselect read fails", async () => {
    await hooks.fetchMultiselectProgramData(undefined, "a-jurisdiction")

    expect(mockedLog).toHaveBeenCalled()
    expect(JSON.stringify(mockedLog.mock.calls)).not.toContain(PASSKEY)
  })

  it("keeps the passkey out of the log when the agency read fails", async () => {
    await hooks.fetchAgencies(undefined, "a-jurisdiction")

    expect(mockedLog).toHaveBeenCalled()
    expect(JSON.stringify(mockedLog.mock.calls)).not.toContain(PASSKEY)
  })
})
