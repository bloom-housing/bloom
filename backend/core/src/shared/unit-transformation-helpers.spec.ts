import { MinMax } from "../units/types/min-max"
import { setMinMax } from "./unit-transformation-helpers"

describe("Unit Transformation Helpers", () => {
  it("setsMinMax when range is undefined", () => {
    let testRange: MinMax

    // eslint-disable-next-line prefer-const
    testRange = setMinMax(testRange, 5)

    expect(testRange.min).toBe(5)
    expect(testRange.max).toBe(5)
  })

  it("setsMinMax updates max when range is already set", () => {
    let testRange: MinMax = {
      min: 1,
      max: 5,
    }

    testRange = setMinMax(testRange, 7)

    expect(testRange.min).toBe(1)
    expect(testRange.max).toBe(7)
  })

  it("SetsMinMax updates min when range is already set", () => {
    let testRange: MinMax = {
      min: 3,
      max: 5,
    }

    testRange = setMinMax(testRange, 1)

    expect(testRange.min).toBe(1)
    expect(testRange.max).toBe(5)
  })

  it("SetsMinMax doesn't update if value already set as min", () => {
    let testRange: MinMax = {
      min: 1,
      max: 5,
    }

    testRange = setMinMax(testRange, 1)

    expect(testRange.min).toBe(1)
    expect(testRange.max).toBe(5)
  })

  it("SetsMinMax doesn't update if value already set as max", () => {
    let testRange: MinMax = {
      min: 1,
      max: 5,
    }

    testRange = setMinMax(testRange, 5)

    expect(testRange.min).toBe(1)
    expect(testRange.max).toBe(5)
  })

  it("SetsMinMax returns range if value is null", () => {
    let testRange: MinMax = {
      min: 1,
      max: 5,
    }

    testRange = setMinMax(testRange, null)

    expect(testRange.min).toBe(1)
    expect(testRange.max).toBe(5)
  })
})
