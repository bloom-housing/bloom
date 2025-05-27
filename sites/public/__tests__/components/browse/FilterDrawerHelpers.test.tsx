import { getAvailabilityValues } from "../../../src/components/browse/FilterDrawerHelpers"
import { FilterAvailabilityEnum } from "../../../../../api/dist/src/enums/listings/filter-availability-enum"

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
    // it("should return correct fields when labelInfo passed as string", () => {})
    // it("should return correct fields when labelInfo passed as string array", () => {})
  })
})
