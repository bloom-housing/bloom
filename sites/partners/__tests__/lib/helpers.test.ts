import { Application } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { createDate, mergeApplicationNames } from "../../src/lib/helpers"

describe("helpers", () => {
  describe("mergeApplicationNames", () => {
    it("should merge names for one application", () => {
      expect(
        mergeApplicationNames([
          { applicant: { firstName: "FirstA", lastName: "LastA" } } as Application,
        ])
      ).toEqual("FirstA LastA")
    })
    it("should merge names for multiple applications", () => {
      expect(
        mergeApplicationNames([
          { applicant: { firstName: "FirstA", lastName: "LastA" } } as Application,
          { applicant: { firstName: "FirstB", lastName: "LastB" } } as Application,
          { applicant: { firstName: "FirstC", lastName: "LastC" } } as Application,
        ])
      ).toEqual("FirstA LastA, FirstB LastB, FirstC LastC")
    })
    it("should merge names for no application", () => {
      expect(mergeApplicationNames([])).toEqual("")
    })
  })
  describe("createDate", () => {
    it("should create dates with variable numbers of characters", () => {
      expect(createDate({ year: "2025", month: "12", day: "10" })).toEqual(new Date(2025, 11, 10))
      expect(createDate({ year: "2025", month: "1", day: "5" })).toEqual(new Date(2025, 0, 5))
      expect(createDate({ year: "2025", month: "01", day: "05" })).toEqual(new Date(2025, 0, 5))
    })
    it("should fail with invalid input", () => {
      expect(createDate({ year: "202", month: "12", day: "10" })).toBeFalsy()
      expect(createDate({ year: "2025", month: "13", day: "10" })).toBeFalsy()
      expect(createDate({ year: "2025", month: "13", day: "35" })).toBeFalsy()
    })
  })
})
