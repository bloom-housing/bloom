import { cleanup } from "@testing-library/react"
import * as formKeys from "../src/formKeys"

afterEach(cleanup)

describe("formKeys helper", () => {
  it("should include all US states", () => {
    // 52 because DC and "" are included
    expect(formKeys.stateKeys.length).toBe(52)
  })
})
