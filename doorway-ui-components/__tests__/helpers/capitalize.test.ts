import { cleanup } from "@testing-library/react"
import { capitalize } from "../../src/helpers/capitalize"

afterEach(cleanup)

describe("capitalize helper", () => {
  it("should capitalize strings if uncapitalized", () => {
    expect(capitalize("abcd")).toBe("Abcd")
  })
  it("should return same string if already capitalized", () => {
    expect(capitalize("Abcd")).toBe("Abcd")
  })
  it("should return empty if given empty", () => {
    expect(capitalize("")).toBe("")
  })
})
