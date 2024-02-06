import { cleanup } from "@testing-library/react"
import { cleanMultiselectString } from "../../src/views/multiselectQuestions"

afterEach(cleanup)

describe("multiselectQuestions", () => {
  describe("cleanMultiselectString", () => {
    it("should remove expected characters", () => {
      expect(
        cleanMultiselectString("I'm a string, and I have a comma, period, and apostrophe.")
      ).toBe("Im a string and I have a comma period and apostrophe")
    })
  })
})
