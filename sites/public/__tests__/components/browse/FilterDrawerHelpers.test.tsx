import { FilterAvailabilityEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { getAvailabilityValues } from "../../../src/components/browse/FilterDrawerHelpers"

describe("filter drawer helpers", () => {
  describe("getAvailabilityValues", () => {
    it("should return correct availability strings in order", () => {
      expect(getAvailabilityValues()).toEqual([
        FilterAvailabilityEnum.unitsAvailable,
        FilterAvailabilityEnum.openWaitlist,
        FilterAvailabilityEnum.closedWaitlist,
        FilterAvailabilityEnum.comingSoon,
      ])
    })
  })
  describe("buildDefaultFilterFields", () => {
    // const existingFilterData
    // it("should return correct fields when labelInfo passed as string", () => {})
    // it("should return correct fields when labelInfo passed as string array", () => {})
  })
})
