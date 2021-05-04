import { cleanup } from "@testing-library/react"
import { mergeDeep } from "../../src/helpers/mergeDeep"

afterEach(cleanup)

describe("merge deep helper", () => {
  it("should merge properly", () => {
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
