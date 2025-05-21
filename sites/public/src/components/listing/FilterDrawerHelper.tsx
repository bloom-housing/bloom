import qs from "qs"
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
import styles from "./FilterDrawer.module.scss"
import { UseFormMethods } from "react-hook-form"
import { Grid } from "@bloom-housing/ui-seeds"
import { Field, t } from "@bloom-housing/ui-components"

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

export interface FilterField {
  key: string
  label: string
  defaultChecked: boolean
}

export interface CheckboxGroupProps {
  groupLabel: string
  fields: FilterField[]
  register: UseFormMethods["register"]
  customRowNumber?: number
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

// two filters below have yet to be implemented, captured in part 4
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

export const buildDefaultFilterFields = (
  filterType: ListingFilterKeys,
  stringBase: string,
  keyArr: string[],
  existingData: FilterData
): FilterField[] =>
  keyArr.map((key) => {
    return {
      key: `${filterType}.${key}`,
      label: t(`${stringBase}.${key}`),
      defaultChecked: existingData?.[filterType]?.[key] ?? false,
    }
  })

export const CheckboxGroup = (props: CheckboxGroupProps) => {
  return (
    <fieldset className={styles["filter-section"]}>
      <legend className={styles["filter-section-label"]}>{props.groupLabel}</legend>
      <Grid spacing="sm">
        <Grid.Row columns={props.customRowNumber ?? 3}>
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
          ></Field>
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
          ></Field>
        </Grid.Cell>
      </Grid.Row>
      <Grid.Row key="0">
        <Grid.Cell>
          <Field
            id={ListingFilterKeys.section8Acceptance}
            name={ListingFilterKeys.section8Acceptance}
            label={t("listings.section8Acceptance")}
            labelClassName={styles["filter-checkbox-label"]}
            type="checkbox"
            register={props.register}
            inputProps={{
              defaultChecked: props.filterState?.[ListingFilterKeys.section8Acceptance] ?? false,
            }}
          ></Field>
        </Grid.Cell>
      </Grid.Row>
    </Grid>
  </fieldset>
)

export const encodeFilterDataToBackendFilters = (data: FilterData): ListingFilterParams[] => {
  const filters: ListingFilterParams[] = []
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

        filter[ListingFilterKeys.monthlyRent] = userSelections["maxRent"]?.replace(",", "")
        filters.push(filter)
      }
    }
  })
  return filters
}

export const getFilterQueryFromURL = (url: string): string => {
  let filterQuery = ""
  // clean up next's context.req.url encoding that is unhelpful for our pattern
  const cleanedUrl = url.replace("%3A", ":")
  if (cleanedUrl.includes("filters:")) {
    filterQuery = cleanedUrl.slice(cleanedUrl.indexOf("filters:") + "filters:".length)
  }
  return filterQuery
}

export const encodeFilterDataToQuery = (data: FilterData): string => {
  const cleanedFilterData = removeUnselectedFilterData(data)
  return qs.stringify(cleanedFilterData)
}

export const decodeQueryToFilterData = (queryString: string): FilterData => {
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
