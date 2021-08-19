import { cleanup } from "@testing-library/react"
import { getTranslationWithArguments } from "../../src/helpers/translationHelpers"

afterEach(cleanup)

describe("getTranslationWithArguments", () => {
  it("should return a translated string with no arguments", () => {
    expect(getTranslationWithArguments("t.yes")).toBe("Yes")
  })
  it("should return a translated string with one argument", () => {
    expect(getTranslationWithArguments("listings.percentAMIUnit,percent:20")).toBe("20% AMI Unit")
  })
  it("should return a translated string with two (or more) arguments", () => {
    expect(
      getTranslationWithArguments(
        "listings.reservedUnitsForWhoAre,communityType:Community Type,reservedType:Reserved Type"
      )
    ).toBe("Reserved for Community Type who are Reserved Type")
  })
})
