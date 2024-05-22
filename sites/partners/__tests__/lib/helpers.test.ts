import { Application } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { mergeApplicationNames } from "../../src/lib/helpers"

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
})
