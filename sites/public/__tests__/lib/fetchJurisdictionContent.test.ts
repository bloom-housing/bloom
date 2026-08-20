import axios from "axios"
import { fetchJurisdictionContent, OVERRIDES_TIMEOUT_MS } from "../../src/lib/hooks"

const mockedGet = jest.spyOn(axios, "get")

describe("fetchJurisdictionContent", () => {
  afterAll(() => mockedGet.mockRestore())

  beforeEach(() => {
    jest.clearAllMocks()
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
        timeout: OVERRIDES_TIMEOUT_MS,
      }
    )
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
