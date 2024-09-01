import { cleanup } from "@testing-library/react"
import { mergeDeep } from "../../src/utilities/mergeDeep"

afterEach(cleanup)

describe("mergeDeep", () => {
  it("should merge nested fields", () => {
    expect(
      mergeDeep(
        { nestedObject: { field1: "X", field2: "B", field3: "C" }, targetObject: true },
        { nestedObject: { field1: "A", field2: "B", field3: "C", field4: "D" }, sourceObject: true }
      )
    ).toStrictEqual({
      nestedObject: {
        field1: "A",
        field2: "B",
        field3: "C",
        field4: "D",
      },
      sourceObject: true,
      targetObject: true,
    })
  })
})
