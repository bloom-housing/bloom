import axios from "axios"
import { fetchPublicOverrides } from "../../src/lib/hooks"

const mockedGet = jest.spyOn(axios, "get")

describe("fetchPublicOverrides", () => {
  afterAll(() => mockedGet.mockRestore())

  beforeEach(() => {
    jest.clearAllMocks()
    process.env.backendApiBase = "http://localhost:3100"
    process.env.jurisdictionName = "Bloomington"
    mockedGet.mockResolvedValue({ data: { en: { "a.key": "Override" } } })
  })

  it("asks for the pinned jurisdiction's public overrides in the given language", async () => {
    await fetchPublicOverrides("es")

    expect(mockedGet).toHaveBeenCalledWith(
      "http://localhost:3100/translations/byName/Bloomington",
      expect.objectContaining({ params: { site: "public", language: "es" } })
    )
  })

  it("defaults to English when no language is given", async () => {
    await fetchPublicOverrides()

    expect(mockedGet).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ params: { site: "public", language: "en" } })
    )
  })

  it("returns the layers the API supplies", async () => {
    expect(await fetchPublicOverrides("en")).toEqual({ en: { "a.key": "Override" } })
  })

  // The site has to build on its bundled strings rather than fail the page.
  it("returns nothing when the request fails", async () => {
    jest.spyOn(console, "log").mockImplementation()
    mockedGet.mockRejectedValue(new Error("api down"))

    expect(await fetchPublicOverrides("en")).toBeUndefined()
  })

  // A cached result would survive an ISR regeneration and hide an edit made since the last one.
  it("asks again on every call", async () => {
    await fetchPublicOverrides("en")
    await fetchPublicOverrides("en")

    expect(mockedGet).toHaveBeenCalledTimes(2)
  })
})
