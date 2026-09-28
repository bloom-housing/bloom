import { maskAxiosResponse, maskData, maskHeaders } from "../../src/utilities/maskData"

describe("maskData", () => {
  it("masks a password and the local part of an email", () => {
    expect(maskData({ password: "hunter2", email: "someone@example.org" })).toEqual({
      password: "*******",
      email: "****@example.org",
    })
  })

  it("leaves other fields alone", () => {
    expect(maskData({ firstName: "Ada" })).toEqual({ firstName: "Ada" })
  })
})

describe("maskHeaders", () => {
  it("masks the api passkey", () => {
    expect(maskHeaders({ passkey: "a-real-secret", language: "en" })).toEqual({
      passkey: "*******",
      language: "en",
    })
  })

  it("returns headers without a passkey unchanged", () => {
    const headers = { language: "en" }
    expect(maskHeaders(headers)).toBe(headers)
  })
})

describe("maskAxiosResponse", () => {
  // The passkey authenticates every site-to-api request, so an error object reaching a log must
  // not take it along.
  it("masks the passkey even when the request had no body", () => {
    const masked = maskAxiosResponse({
      status: 500,
      config: { headers: { passkey: "a-real-secret", language: "en" } },
    })

    expect(masked.config.headers.passkey).toEqual("*******")
    expect(JSON.stringify(masked)).not.toContain("a-real-secret")
  })

  it("masks the passkey and the body together", () => {
    const masked = maskAxiosResponse({
      config: {
        headers: { passkey: "a-real-secret" },
        data: JSON.stringify({ email: "someone@example.org", password: "hunter2" }),
      },
    })

    expect(masked.config.headers.passkey).toEqual("*******")
    expect(masked.config.data).toEqual({ email: "****@example.org", password: "*******" })
  })

  it("returns a response with no config unchanged", () => {
    const response = { status: 500 }
    expect(maskAxiosResponse(response)).toBe(response)
  })
})
