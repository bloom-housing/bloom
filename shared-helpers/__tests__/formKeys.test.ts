import { cleanup } from "@testing-library/react"
import { fieldGroupObjectToArray, prependRoot } from "../src/utilities/formKeys"

afterEach(cleanup)

describe("formKeys helpers", () => {
  it("prependRoot should prepend a string", () => {
    const testArray = ["a", "b", "c"]
    expect(prependRoot("rootKey", testArray)).toStrictEqual(["rootKey-a", "rootKey-b", "rootKey-c"])
  })

  it("fieldGroupObjectToArray with only matching keys", () => {
    const testObj = {
      ["root-A"]: "A",
      ["root-B"]: "B",
      ["root-C"]: "C",
    }
    const expectedArray = ["A", "B", "C"]
    expect(fieldGroupObjectToArray(testObj, "root")).toStrictEqual(expectedArray)
  })

  it("fieldGroupObjectToArray with only some matching keys", () => {
    const testObj = {
      testObj: {},
      ["root-A"]: "A",
      ["other-B"]: "B",
      ["root-C"]: "C",
      ["other"]: "D",
    }
    const expectedArray = ["A", "C"]
    expect(fieldGroupObjectToArray(testObj, "root")).toStrictEqual(expectedArray)
  })

  it("fieldGroupObjectToArray with subkeys", () => {
    const testObj = {
      ["root-A"]: "A",
      ["root-B"]: "B",
      ["root-C"]: "C",
      ["root-D"]: "subKey",
    }
    const expectedArray = ["A", "B", "C", "D: subKey"]
    expect(fieldGroupObjectToArray(testObj, "root")).toStrictEqual(expectedArray)
  })

  it("fieldGroupObjectToArray with subArrays", () => {
    const testObj = {
      ["root-A"]: "A",
      ["root-B"]: "B",
      ["root-C"]: "C",
      ["root-D"]: ["1", "2"],
    }
    const expectedArray = ["A", "B", "C", "D: 1,2"]
    expect(fieldGroupObjectToArray(testObj, "root")).toStrictEqual(expectedArray)
  })

  it("fieldGroupObjectToArray with empty additional inputs", () => {
    const testObj = {
      ["root-A"]: "A",
      ["root-B"]: "B",
      ["root-C"]: "C",
      ["root-D"]: "",
    }
    const expectedArray = ["A", "B", "C", "D"]
    expect(fieldGroupObjectToArray(testObj, "root")).toStrictEqual(expectedArray)
  })
})
