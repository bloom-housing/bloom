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
    it.todo("should return correct fields when labelInfo passed as string")
    it.todo("should return correct fields when labelInfo passed as string array")
    it.todo("should return correct fields when existindData is empty")
    it.todo("should return correct fields when existindData is partially filled")
    it.todo("should return correct fields when existindData is the full form object")
  })

  describe("encodeFilterToBackendFiltering", () => {
    it.todo("should return correct BE filters for single IN comparisons")
    it.todo("should return correct BE filters for multiple IN comparisons")
    it.todo("should return correct BE filters for single = comparison")
    it.todo("should return correct BE filters for multiple = comparisons")
    it.todo("should return correct BE filters for >= comparison")
    it.todo("should return correct BE filters for <= comparison")
    it.todo("should return correct BE filters for full rent information")
    it.todo("should returm correct BE filters for all comparison types combined")
  })

  describe("isFiltered", () => {
    it.todo("should return true if filter params present in context.query")
    it.todo("should return false if filter params not present in context.query")
  })

  describe("getFilterQueryFromURL", () => {
    it.todo("should return filter query without page when page is present in url")
    it.todo("should return filter query without page when page is not present in url")
  })

  describe("encodeFilterDataToQuery", () => {
    it.todo("should return empty string when filter data is empty")
    it.todo("should return correct filter query when filter data is partially full")
    it.todo(
      "should return correct filter query when filter data is complete and some selections are true"
    )
    it.todo(
      "should return correct filter query when filter data is complete and all selections are true"
    )
  })

  describe("decodeQueryToFilterData", () => {
    it.todo("should return empty string when filter data is empty")
    it.todo("should return correct filter query when filter data is partially full")
    it.todo(
      "should return correct filter query when filter data is complete and some selections are true"
    )
    it.todo(
      "should return correct filter query when filter data is complete and all selections are true"
    )
  })

  describe("decodeQueryToFilterData", () => {
    it.todo("should return empty string when filter data is empty")
    it.todo("should return correct filter query when filter data is partially full")
    it.todo(
      "should return correct filter query when filter data is complete and some selections are true"
    )
    it.todo(
      "should return correct filter query when filter data is complete and all selections are true"
    )
  })

  describe("removeUnselectedFilterData", () => {
    it.todo("should return empty object when filter data has no selections")
    it.todo("should return only true selections when filter data is partially selected")
    it.todo("should return only all selections when the filter data is all selected")
  })

  // components
  describe("CheckboxGroup", () => {
    it.todo("should show the correct number of columns when a customColumnNumber is added")
    it.todo("should show the correct number of columns when no customColumnNumber is added")
    it.todo("should show all fields passed into component correctly when no filter state passed")
    it.todo(
      "should show all fields passed into component correctly when a filter state with previous selections is passed"
    )
  })

  describe("RentSection", () => {
    it.todo("should display all fields correctly when an empty filterState is passed")
    it.todo(
      "should display all fields correctlt when a filterState with previous selections is passed"
    )
  })
})
