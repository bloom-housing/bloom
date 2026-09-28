import type { NextApiRequest, NextApiResponse } from "next"

const clearCachedApiReads = jest.fn()
jest.mock("../../../src/lib/hooks", () => ({
  clearCachedApiReads: () => clearCachedApiReads(),
}))

import handler, { REVALIDATED_PATHS, localisedPaths } from "../../../src/pages/api/revalidate"

const PASSKEY = "test-passkey"

type ResponseStub = {
  res: NextApiResponse
  status: jest.Mock
  json: jest.Mock
  setHeader: jest.Mock
  revalidate: jest.Mock
}

const buildResponse = (): ResponseStub => {
  const json = jest.fn()
  const status = jest.fn(() => ({ json }))
  const setHeader = jest.fn()
  const revalidate = jest.fn().mockResolvedValue(undefined)
  return {
    res: { status, setHeader, revalidate } as unknown as NextApiResponse,
    status,
    json,
    setHeader,
    revalidate,
  }
}

const buildRequest = (overrides: Partial<NextApiRequest> = {}): NextApiRequest =>
  ({ method: "POST", headers: { passkey: PASSKEY }, ...overrides } as unknown as NextApiRequest)

describe("/api/revalidate", () => {
  let warn: jest.SpyInstance

  beforeEach(() => {
    clearCachedApiReads.mockClear()
    process.env.API_PASS_KEY = PASSKEY
    process.env.LANGUAGES = "en"
    warn = jest.spyOn(console, "error").mockImplementation(() => undefined)
  })

  afterEach(() => {
    warn.mockRestore()
  })

  it("refuses anything but POST", async () => {
    const stub = buildResponse()
    await handler(buildRequest({ method: "GET" }), stub.res)

    expect(stub.status).toHaveBeenCalledWith(405)
    expect(stub.setHeader).toHaveBeenCalledWith("Allow", "POST")
    expect(stub.revalidate).not.toHaveBeenCalled()
  })

  it("refuses a call without the passkey", async () => {
    const stub = buildResponse()
    await handler(buildRequest({ headers: {} }), stub.res)

    expect(stub.status).toHaveBeenCalledWith(401)
    expect(stub.revalidate).not.toHaveBeenCalled()
  })

  it("refuses a call whose passkey does not match", async () => {
    const stub = buildResponse()
    await handler(buildRequest({ headers: { passkey: "wrong" } }), stub.res)

    expect(stub.status).toHaveBeenCalledWith(401)
    expect(stub.revalidate).not.toHaveBeenCalled()
  })

  // ApiKeyGuard on the api treats a missing key as "allow"; this route must not, since an
  // unauthenticated caller could otherwise rebuild every page.
  it("refuses every call when no secret is configured", async () => {
    delete process.env.API_PASS_KEY
    const stub = buildResponse()
    await handler(buildRequest(), stub.res)

    expect(stub.status).toHaveBeenCalledWith(503)
    expect(stub.revalidate).not.toHaveBeenCalled()
  })

  it("revalidates every path and reports the count", async () => {
    const stub = buildResponse()
    await handler(buildRequest(), stub.res)

    expect(stub.status).toHaveBeenCalledWith(200)
    expect(stub.revalidate).toHaveBeenCalledTimes(REVALIDATED_PATHS.length)
    expect(stub.json).toHaveBeenCalledWith({
      revalidated: REVALIDATED_PATHS.length,
      failed: [],
    })
  })

  it("revalidates each configured language", async () => {
    process.env.LANGUAGES = "en,es"
    const stub = buildResponse()
    await handler(buildRequest(), stub.res)

    expect(stub.revalidate).toHaveBeenCalledTimes(REVALIDATED_PATHS.length * 2)
    expect(stub.revalidate).toHaveBeenCalledWith("/faq")
    expect(stub.revalidate).toHaveBeenCalledWith("/es/faq")
  })

  // res.revalidate re-runs getStaticProps in this process, so a rebuild that read the cached
  // responses would regenerate the page it already had.
  it("clears the caches before revalidating", async () => {
    const order: string[] = []
    clearCachedApiReads.mockImplementation(() => order.push("cleared"))
    const stub = buildResponse()
    stub.revalidate.mockImplementation(() => {
      order.push("revalidated")
      return Promise.resolve()
    })

    await handler(buildRequest(), stub.res)

    expect(order[0]).toBe("cleared")
    expect(order.filter((entry) => entry === "cleared")).toHaveLength(1)
  })

  it("keeps going when one path fails", async () => {
    const stub = buildResponse()
    stub.revalidate.mockImplementation((path: string) =>
      path === "/faq" ? Promise.reject(new Error("no such page")) : Promise.resolve()
    )

    await handler(buildRequest(), stub.res)

    expect(stub.revalidate).toHaveBeenCalledTimes(REVALIDATED_PATHS.length)
    expect(stub.status).toHaveBeenCalledWith(200)
    expect(stub.json).toHaveBeenCalledWith({
      revalidated: REVALIDATED_PATHS.length - 1,
      failed: ["/faq"],
    })
  })
})

describe("localisedPaths", () => {
  it("leaves the default locale unprefixed and prefixes the rest", () => {
    const paths = localisedPaths(["en", "es"])

    expect(paths).toContain("/")
    expect(paths).toContain("/es")
    expect(paths).toContain("/account/dashboard")
    expect(paths).toContain("/es/account/dashboard")
  })
})
