import { cleanup } from "@testing-library/react"
import { lRoute } from "../src/localeRoute"

afterEach(cleanup)

describe("localeRoute helper", () => {
  it("return input if its a full URL", () => {
    expect(lRoute("https://www.google.com")).toBe("https://www.google.com")
    expect(lRoute("http://www.google.com")).toBe("http://www.google.com")
  })
})
