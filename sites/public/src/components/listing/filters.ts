import qs from "qs"
import {
  EnumListingFilterParamsComparison,
  FilterAvailabilityEnum,
  HomeTypeEnum,
  ListingFeatures,
  ListingFilterKeys,
  ListingFilterParams,
  ListingsStatusEnum,
  RegionEnum,
  UnitTypeEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"

export interface FilterData {
  availability?: Record<FilterAvailabilityEnum, boolean>
  bedroomTypes?: Record<UnitTypeEnum, boolean>
  homeType?: Record<HomeTypeEnum, boolean>
  isVerified?: boolean
  listingFeatures?: Record<keyof ListingFeatures, boolean>
  monthlyRent?: Record<"maxRent" | "minRent", string>
  regions?: Record<RegionEnum, boolean>
  section8Acceptance?: boolean
}

const arrayFilters: ListingFilterKeys[] = [
  ListingFilterKeys.bedroomTypes,
  ListingFilterKeys.counties,
  ListingFilterKeys.homeTypes,
  ListingFilterKeys.listingFeatures,
  ListingFilterKeys.regions,
  ListingFilterKeys.reservedCommunityTypes,
  ListingFilterKeys.availabilities,
]
const booleanFilters: ListingFilterKeys[] = [
  ListingFilterKeys.isVerified,
  ListingFilterKeys.section8Acceptance,
]
const indvidualFilters: ListingFilterKeys[] = [
  ListingFilterKeys.bathrooms,
  ListingFilterKeys.jurisdiction,
]
export const unitTypeMapping = {
  [UnitTypeEnum.studio]: 0,
  [UnitTypeEnum.oneBdrm]: 1,
  [UnitTypeEnum.twoBdrm]: 2,
  [UnitTypeEnum.threeBdrm]: 3,
  [UnitTypeEnum.fourBdrm]: 4,
  [UnitTypeEnum.fiveBdrm]: 5,
}

export const encodeFilterDataToBackendFilters = (
  data: FilterData,
  status: ListingsStatusEnum = ListingsStatusEnum.active
): ListingFilterParams[] => {
  const filters: ListingFilterParams[] = [
    { $comparison: EnumListingFilterParamsComparison["="], status: status },
  ]
  Object.entries(data).forEach(([filterType, userSelections]) => {
    if (indvidualFilters.includes(ListingFilterKeys[filterType])) {
      Object.entries(userSelections).forEach((field: [ListingFilterKeys, any]) => {
        if (field[1]) {
          const filter = {
            $comparison: EnumListingFilterParamsComparison["="],
          }
          filter[filterType] = field[0]
          filters.push(filter)
        }
      })
    } else if (arrayFilters.includes(ListingFilterKeys[filterType])) {
      const selectedFields = []
      Object.entries(userSelections).forEach((field: [ListingFilterKeys, any]) => {
        if (field[1]) {
          if (filterType === ListingFilterKeys.bedroomTypes) {
            selectedFields.push(unitTypeMapping[field[0]])
          } else {
            selectedFields.push(field[0])
          }
        }
      })
      if (selectedFields.length > 0) {
        const filter = {
          $comparison: EnumListingFilterParamsComparison["IN"],
        }
        filter[filterType] = selectedFields
        filters.push(filter)
      }
    } else if (booleanFilters.includes(ListingFilterKeys[filterType]) && userSelections) {
      const filter = {
        $comparison: EnumListingFilterParamsComparison["="],
      }
      filter[filterType] = true
      filters.push(filter)
    } else if (filterType === ListingFilterKeys.monthlyRent) {
      if (userSelections["minRent"]) {
        const filter = {
          $comparison: EnumListingFilterParamsComparison[">="],
        }
        filter[ListingFilterKeys.monthlyRent] = userSelections["minRent"]?.replace(",", "")
        filters.push(filter)
      }
      if (userSelections["maxRent"]) {
        const filter = {
          $comparison: EnumListingFilterParamsComparison["<="],
        }
        console.log("here", userSelections["maxRent"]?.replace(",", ""))

        filter[ListingFilterKeys.monthlyRent] = userSelections["maxRent"]?.replace(",", "")
        filters.push(filter)
      }
    }
  })
  return filters
}

export const encodeFilterDataToString = (data: FilterData): string => {
  return qs.stringify(data)
}

export const decodeFromStringtoFilterData = (queryString: string): FilterData => {
  return qs.parse(queryString)
}

export const removeUnselectedFilterData = (data: FilterData): FilterData => {
  const cleanedFilterData: FilterData = {}
  Object.entries(data).forEach(([filterType, userSelections]) => {
    if (arrayFilters.includes(ListingFilterKeys[filterType])) {
      Object.entries(userSelections).forEach((field) => {
        if (field[1]) {
          if (cleanedFilterData[filterType]) {
            cleanedFilterData[filterType][field[0]] = field[1]
          } else {
            cleanedFilterData[filterType] = { [field[0]]: field[1] }
          }
        }
      })
    } else if (booleanFilters.includes(ListingFilterKeys[filterType]) && userSelections) {
      cleanedFilterData[filterType] = userSelections
    } else if (
      (filterType === ListingFilterKeys.monthlyRent && userSelections["minRent"]) ||
      userSelections["maxRent"]
    ) {
      cleanedFilterData[filterType] = userSelections
    }
  })
  return cleanedFilterData
}
