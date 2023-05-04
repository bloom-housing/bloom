import axios from "axios"
import { JurisdictionResolver } from "../../src/etl"

const urlInfo = {
  base: "https://base-url",
  path: "/path",
}

const jurisdictions = [
  {
    id: "d98fd25b-df6c-4f6a-b93f-bbd347b9da69",
    name: "External Jurisdiction 1",
  },
  {
    id: "bee730c3-31df-4026-8412-322a79bef8e1",
    name: "External Jurisdiction 2",
  },
  {
    id: "f12d4270-0b03-4af0-ad42-555956ff5233",
    name: "External Jurisdiction 3",
  },
]

const jurisdictionIncludeList = ["External Jurisdiction 1", "External Jurisdiction 2"]

describe("JurisdictionResolver", () => {
  jest.mock("axios")

  const mockAxios = jest.fn().mockReturnValue({
    // needed for method signature, but we don't do anything with it
    /* eslint-disable @typescript-eslint/no-unused-vars */
    get: jest.fn().mockImplementation((endpoint) => {
      return Promise.resolve({
        data: jurisdictions,
        status: 200,
        statusText: "ok",
        headers: "",
        config: {},
      })
    }),
  })(
    // required for TS to be aware of mock methods/props
    axios as jest.Mocked<typeof axios>
  )

  beforeEach(() => {
    mockAxios.get.mockClear()
  })

  it("should generate the correct endpoint url", async () => {
    const resolver = new JurisdictionResolver(mockAxios, urlInfo, jurisdictionIncludeList)
    resolver.getLogger().printLogs = false

    await resolver.fetchJurisdictions()

    // only one jurisdiction
    expect(mockAxios.get).toHaveBeenCalledTimes(1)
    const endpoint = mockAxios.get.mock.lastCall[0]

    // should start with url
    expect(endpoint.startsWith(`${urlInfo.base}${urlInfo.path}`)).toBe(true)
  })

  it("should return only included jurisdictions", async () => {
    const resolver = new JurisdictionResolver(mockAxios, urlInfo, jurisdictionIncludeList)
    resolver.getLogger().printLogs = false

    const results = await resolver.fetchJurisdictions()

    // number of jurisdictions returned matches requests
    expect(results.length).toBe(jurisdictionIncludeList.length)

    // make sure all jurisdictions returned have names in the include list
    results.forEach((j) => {
      expect(jurisdictionIncludeList).toContain(j.name)
    })
  })

  it("should fail on fetch error", async () => {
    const resolver = new JurisdictionResolver(mockAxios, urlInfo, jurisdictionIncludeList)
    resolver.getLogger().printLogs = false

    mockAxios.get.mockImplementationOnce(() => {
      throw new Error("get")
    })

    await expect(resolver.fetchJurisdictions()).rejects.toThrow("get")
  })
})
