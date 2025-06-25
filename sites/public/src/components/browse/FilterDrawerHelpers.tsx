import {
  EnumListingFilterParamsComparison,
  FilterAvailabilityEnum,
  HomeTypeEnum,
  ListingFeatures,
  ListingFilterKeys,
  ListingFilterParams,
  RegionEnum,
  UnitTypeEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { UseFormMethods } from "react-hook-form"
import { Grid } from "@bloom-housing/ui-seeds"
import { Field, t } from "@bloom-housing/ui-components"
import { encode, ParsedUrlQuery } from "querystring"
import { isTrue } from "../../lib/helpers"
import styles from "./FilterDrawer.module.scss"

type BooleanOrBooleanString = boolean | "true" | "false"

// TODO: Fetch reserved community types from th backend when an endpoint is created
export enum ReservedCommunityTypes {
  "withDisabilities" = "withDisabilities",
  "senior55" = "senior55",
  "senior62" = "senior62",
  "homeless" = "homeless",
  "veterans" = "veterans",
}

export interface FilterData {
  availability?: Record<FilterAvailabilityEnum, BooleanOrBooleanString>
  bedroomTypes?: Record<UnitTypeEnum, BooleanOrBooleanString>
  homeType?: Record<HomeTypeEnum, BooleanOrBooleanString>
  isVerified?: BooleanOrBooleanString
  listingFeatures?: Record<keyof ListingFeatures, BooleanOrBooleanString>
  monthlyRent?: Record<"maxRent" | "minRent", string>
  regions?: Record<RegionEnum, BooleanOrBooleanString>
  section8Acceptance?: BooleanOrBooleanString
  reservedCommunityTypes?: Record<ReservedCommunityTypes, BooleanOrBooleanString>
}

export interface FilterField {
  key: string
  label: string
  defaultChecked: boolean
}

export interface CheckboxGroupProps {
  groupLabel: string
  fields: FilterField[]
  register: UseFormMethods["register"]
  customColumnNumber?: number
}

export interface RentSectionProps {
  register: UseFormMethods["register"]
  getValues: UseFormMethods["getValues"]
  setValue: UseFormMethods["setValue"]
  filterState: FilterData
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

// https://github.com/bloom-housing/bloom/issues/4795
const individualFilters: ListingFilterKeys[] = [
  ListingFilterKeys.bathrooms,
  ListingFilterKeys.jurisdiction,
]

// customizations to base enums
const availabilityOrdering = {
  [FilterAvailabilityEnum.unitsAvailable]: { ordinal: 0 },
  [FilterAvailabilityEnum.openWaitlist]: { ordinal: 1 },
  [FilterAvailabilityEnum.closedWaitlist]: { ordinal: 2 },
  [FilterAvailabilityEnum.comingSoon]: { ordinal: 3 },
}

/**
 *
 * @returns an array of availability keys in the displayed order
 */
export const getAvailabilityValues = () => {
  // TODO: https://github.com/metrotranscom/doorway/issues/1278
  const availabilityFiltered = Object.keys(FilterAvailabilityEnum).filter(
    (elem) => elem != FilterAvailabilityEnum.waitlistOpen
  )
  const availabilityOrdered = availabilityFiltered.sort((a, b) => {
    return availabilityOrdering[a].ordinal - availabilityOrdering[b].ordinal
  })
  return availabilityOrdered
}

export const unitTypeMapping = {
  [UnitTypeEnum.studio]: { value: 0, ordinal: 0, labelKey: "listings.unitTypes.studio" },
  [UnitTypeEnum.SRO]: { value: 0, ordinal: 1, labelKey: "listings.unitTypes.SRO" },
  [UnitTypeEnum.oneBdrm]: { value: 1, ordinal: 2, labelKey: "listings.unitTypes.expanded.oneBdrm" },
  [UnitTypeEnum.twoBdrm]: { value: 2, ordinal: 3, labelKey: "listings.unitTypes.expanded.twoBdrm" },
  [UnitTypeEnum.threeBdrm]: {
    value: 3,
    ordinal: 4,
    labelKey: "listings.unitTypes.expanded.threeBdrm",
  },
  [UnitTypeEnum.fourBdrm]: {
    value: 4,
    ordinal: 5,
    labelKey: "listings.unitTypes.expanded.fourBdrm",
  },
  [UnitTypeEnum.fiveBdrm]: {
    value: 5,
    ordinal: 6,
    labelKey: "listings.unitTypes.expanded.fiveBdrm",
  },
}

export const unitTypesSorted = Object.keys(UnitTypeEnum).sort(
  (a, b) => unitTypeMapping[a].ordinal - unitTypeMapping[b].ordinal
)

/**
 * Generates field data to mantain consistency across all filter fields 
 * 
 * @param filterType key to connect individual options to filtering type
 * @param labelInfo string if all translations have consistent translation key base in json
   array for strings to be passed in manually for special cases
 * @param keyArr array of individual filter selection keys
 * @param existingData filter data to inform defaultChecked field
 * @returns array of formatted field data which will be passed to each individual filter field
 */
export const buildDefaultFilterFields = (
  filterType: ListingFilterKeys,
  labelInfo: string | string[],
  keyArr: string[],
  existingData: FilterData
): FilterField[] =>
  keyArr.map((key, idx) => {
    return {
      key: `${filterType}.${key}`,
      label: Array.isArray(labelInfo) ? labelInfo[idx] : t(`${labelInfo}.${key}`),
      defaultChecked: isTrue(existingData?.[filterType]?.[key]),
    }
  })

export const CheckboxGroup = (props: CheckboxGroupProps) => {
  return (
    <fieldset className={styles["filter-section"]}>
      <legend className={styles["filter-section-label"]}>{props.groupLabel}</legend>
      <Grid spacing="sm">
        <Grid.Row columns={props.customColumnNumber ?? 3}>
          {props.fields.map((field) => {
            return (
              <Grid.Cell key={`${field.key}-cell`}>
                <Field
                  id={field.key}
                  name={field.key}
                  label={field.label}
                  labelClassName={styles["filter-checkbox-label"]}
                  type="checkbox"
                  register={props.register}
                  inputProps={{ defaultChecked: field.defaultChecked }}
                />
              </Grid.Cell>
            )
          })}
        </Grid.Row>
      </Grid>
    </fieldset>
  )
}

export const RentSection = (props: RentSectionProps) => (
  <fieldset className={styles["filter-section"]}>
    <legend className={styles["filter-section-label"]}>{t("t.rent")}</legend>
    <Grid spacing="sm">
      <Grid.Row>
        <Grid.Cell>
          <Field
            id={`${ListingFilterKeys.monthlyRent}.minRent`}
            name={`${ListingFilterKeys.monthlyRent}.minRent`}
            label={t("listings.minRent")}
            type="currency"
            prepend="$"
            register={props.register}
            getValues={props.getValues}
            setValue={props.setValue}
            defaultValue={props.filterState?.[ListingFilterKeys.monthlyRent]?.minRent}
          />
        </Grid.Cell>
        <Grid.Cell>
          <Field
            id={`${ListingFilterKeys.monthlyRent}.maxRent`}
            name={`${ListingFilterKeys.monthlyRent}.maxRent`}
            label={t("listings.maxRent")}
            type="currency"
            prepend="$"
            register={props.register}
            getValues={props.getValues}
            setValue={props.setValue}
            defaultValue={props.filterState?.[ListingFilterKeys.monthlyRent]?.maxRent}
          />
        </Grid.Cell>
      </Grid.Row>
      <Grid.Row>
        <Grid.Cell>
          <Field
            id={ListingFilterKeys.section8Acceptance}
            name={ListingFilterKeys.section8Acceptance}
            label={t("listings.section8Acceptance")}
            labelClassName={styles["filter-checkbox-label"]}
            type="checkbox"
            register={props.register}
            inputProps={{
              defaultChecked: isTrue(props.filterState?.[ListingFilterKeys.section8Acceptance]),
            }}
          />
        </Grid.Cell>
      </Grid.Row>
    </Grid>
  </fieldset>
)

/**
 * Transforms filter data to backend filter formatting
 * Note: built to support filtering by url decoding and filtering by state directly from form data
 *
 * @param data object containing form selections or url params decoded
 * @returns array of formatted backend filters
 */
export const encodeFilterDataToBackendFilters = (data: FilterData = {}): ListingFilterParams[] => {
  const filters: ListingFilterParams[] = []
  Object.entries(data).forEach(([filterType, userSelections]) => {
    // individual filters not yet implemented
    if (individualFilters.includes(ListingFilterKeys[filterType])) {
      Object.entries(userSelections).forEach((field) => {
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
      Object.entries(userSelections).forEach((field) => {
        if (field[1]) {
          if (filterType === ListingFilterKeys.bedroomTypes) {
            selectedFields.push(unitTypeMapping[field[0]]?.value)
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
    } else if (
      booleanFilters.includes(ListingFilterKeys[filterType]) &&
      // filter data direct from form is boolean, decoded from url is string
      (userSelections === true || userSelections === "true")
    ) {
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

        filter[ListingFilterKeys.monthlyRent] = userSelections["maxRent"]?.replace(",", "")
        filters.push(filter)
      }
    }
  })
  return filters
}

/**
 * Checks if url query contains filtering information
 *
 * @param contextQuery ParsedUrlQuery from context.query in getServerSideProps call
 * @returns boolean if any filter params are passed
 */
export const isFiltered = (contextQuery: ParsedUrlQuery) => {
  return Object.keys(contextQuery).some((param) => Object.keys(ListingFilterKeys).includes(param))
}

/**
 * Removes pagination information from url to isolate filter query
 *
 * @param contextQuery ParsedUrlQuery from context.query in getServerSideProps call
 * @returns string of url params related to filtering
 */
export const getFilterQueryFromURL = (url: ParsedUrlQuery) => {
  delete url["page"]
  return encode(url)
}

/**
 * Transforms data from filter submission into url query
 *
 * @param data form data capturing user selections
 * @returns string of user's selections in url param format
 */
export const encodeFilterDataToQuery = (data: FilterData): string => {
  const queryArr = []
  const cleanedFilterData = removeUnselectedFilterData(data)
  Object.entries(cleanedFilterData).forEach(([filterType, userSelections]) => {
    if (arrayFilters.includes(ListingFilterKeys[filterType])) {
      const arrParam = `${ListingFilterKeys[filterType]}=${Object.keys(userSelections).join(",")}`
      queryArr.push(arrParam)
    } else if (booleanFilters.includes(ListingFilterKeys[filterType])) {
      const booleanParam = `${ListingFilterKeys[filterType]}=true`
      queryArr.push(booleanParam)
    } else if (
      (filterType === ListingFilterKeys.monthlyRent && userSelections["minRent"]) ||
      userSelections["maxRent"]
    ) {
      const rentParam = `${ListingFilterKeys[filterType]}=${Object.values(userSelections).join(
        "-"
      )}`
      queryArr.push(rentParam)
    }
  })
  return queryArr.join("&")
}

/**
 * Transforms url query into filter data to repopulate filter form with current selections
 *
 * @param data form data capturing user selections
 * @returns FilterData of selections reflected in url params
 */
export const decodeQueryToFilterData = (parsedQuery: ParsedUrlQuery): FilterData => {
  const filterData = {}
  Object.entries(parsedQuery).forEach(([filterType, userSelections]) => {
    if (arrayFilters.includes(ListingFilterKeys[filterType])) {
      typeof userSelections === "string" &&
        userSelections.split(",").forEach((userSelection) => {
          if (filterData[filterType]) {
            filterData[filterType][userSelection] = true
          } else {
            filterData[filterType] = { [userSelection]: true }
          }
        })
    } else if (booleanFilters.includes(ListingFilterKeys[filterType]) && isTrue(userSelections)) {
      filterData[filterType] = true
    } else if (filterType === ListingFilterKeys.monthlyRent && typeof userSelections === "string") {
      //custom separator to avoid conflicts with higher values with commas
      const rentArr = userSelections.split("-")
      filterData[filterType] = { minRent: rentArr[0], maxRent: rentArr[1] }
    }
  })
  return filterData
}

/**
 * Isolates selected fields from full filter data
 *
 * @param data form data capturing all fields
 * @returns FilterData including only the user's selections
 */
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
