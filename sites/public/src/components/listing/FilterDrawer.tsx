import { Field, Form, t } from "@bloom-housing/ui-components"
import { Button, Drawer, Grid } from "@bloom-housing/ui-seeds"
import { useForm, UseFormMethods } from "react-hook-form"
import { AuthContext, listingFeatures } from "@bloom-housing/shared-helpers"
import {
  EnumListingFilterParamsComparison,
  FilterAvailabilityEnum,
  RegionEnum,
  UnitTypeEnum,
  HomeTypeEnum,
  ListingFilterKeys,
  ListingsQueryBody,
  ListingViews,
  ListingFilterParams,
  Listing,
  ListingFeatures,
  ListingsStatusEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import styles from "./FilterDrawer.module.scss"
import { useContext, useState } from "react"

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

export interface FilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  totalListings: Listing[]
  setListings: React.Dispatch<React.SetStateAction<Listing[]>>
  setFiltered: React.Dispatch<React.SetStateAction<boolean>>
}

// remove doorway specific enum references
const filterAvailabilityCleaned = Object.keys(FilterAvailabilityEnum).filter(
  (elem) => elem != FilterAvailabilityEnum.waitlistOpen
)

//todo: should we include sro?
const unitTypeCleaned = Object.keys(UnitTypeEnum).filter(
  (unitType) => unitType !== UnitTypeEnum.SRO
)

export const unitTypeMapping = {
  [UnitTypeEnum.studio]: 0,
  [UnitTypeEnum.oneBdrm]: 1,
  [UnitTypeEnum.twoBdrm]: 2,
  [UnitTypeEnum.threeBdrm]: 3,
  [UnitTypeEnum.fourBdrm]: 4,
  [UnitTypeEnum.fiveBdrm]: 5,
}
ListingFilterKeys.section8Acceptance
export interface FilterData {
  availability: Record<FilterAvailabilityEnum, boolean>
  bedroomTypes: Record<UnitTypeEnum, boolean>
  homeType: Record<HomeTypeEnum, boolean>
  isVerified: boolean
  listingFeatures: Record<keyof ListingFeatures, boolean>
  monthlyRent: Record<"maxRent" | "minRent", number>
  regions: Record<RegionEnum, boolean>
  section8Acceptance: boolean
}

const buildDefaultFilterFields = (
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

const CheckboxGroup = (props: CheckboxGroupProps) => {
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

const RentSection = (props: RentSectionProps) => (
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
const FilterDrawer = (props: FilterDrawerProps) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, trigger, handleSubmit, getValues, setValue } = useForm()
  const [filterState, setFilterState] = useState<FilterData>()
  const { listingsService } = useContext(AuthContext)

  const onSubmit = async (data) => {
    const validation = await trigger()
    if (!validation) return
    console.log("in submit", data)
    setFilterState(data as FilterData)
    const filters: ListingFilterParams[] = [
      { $comparison: EnumListingFilterParamsComparison["="], status: ListingsStatusEnum.active },
    ]
    Object.entries(data).forEach(([filterType, userSelections]) => {
      console.log(filterType)
      if (indvidualFilters.includes(ListingFilterKeys[filterType])) {
        console.log(userSelections)
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
    console.log("be filters", filters)
    //active filtering by default
    if (filters.length > 1) {
      const query: ListingsQueryBody = {
        page: 1,
        view: ListingViews.base,
        filter: filters,
      }
      const filteredListings = await listingsService.filterableList({ body: query })
      props.setListings(filteredListings.items)
      props.setFiltered(true)
    } else {
      props.setListings(props.totalListings)
      props.setFiltered(false)
    }
    props.onClose()
  }
  const onError = () => {
    window.scrollTo(0, 0)
    console.log("I'm begging")
  }
  return (
    <Drawer
      isOpen={props.isOpen}
      className={styles["filter-drawer"]}
      onClose={props.onClose}
      ariaLabelledBy="drawer-heading"
      ariaDescribedBy="drawer-content"
    >
      <Drawer.Header id="drawer-heading">{t("t.filter")}</Drawer.Header>
      <Form onSubmit={handleSubmit(onSubmit, onError)}>
        <Drawer.Content id="drawer-content">
          <CheckboxGroup
            groupLabel={t("listings.confirmedListings")}
            fields={[
              {
                key: ListingFilterKeys.isVerified,
                label: t("listings.confirmedListingsOnly"),
                defaultChecked: filterState?.[ListingFilterKeys.isVerified],
              },
            ]}
            register={register}
            customRowNumber={1}
          />
          <CheckboxGroup
            groupLabel={t("t.availability")}
            fields={buildDefaultFilterFields(
              ListingFilterKeys.availabilities,
              "listings.availability",
              filterAvailabilityCleaned,
              filterState
            )}
            register={register}
          />
          <CheckboxGroup
            groupLabel={t("listings.homeType.lower")}
            fields={buildDefaultFilterFields(
              ListingFilterKeys.homeTypes,
              "listings.homeType",
              Object.keys(HomeTypeEnum),
              filterState
            )}
            register={register}
          />
          <CheckboxGroup
            groupLabel={t("listings.unitTypes.bedroomSize")}
            fields={buildDefaultFilterFields(
              ListingFilterKeys.bedroomTypes,
              "listings.unitTypes.expanded",
              unitTypeCleaned,
              filterState
            )}
            register={register}
          />
          <RentSection
            register={register}
            getValues={getValues}
            setValue={setValue}
            filterState={filterState}
          />
          <CheckboxGroup
            groupLabel={t("t.region")}
            fields={Object.keys(RegionEnum).map((region) => {
              return {
                key: `${ListingFilterKeys.regions}.${region}`,
                label: region.replace("_", " "),
                defaultChecked: filterState?.[ListingFilterKeys.regions]?.[region],
              }
            })}
            register={register}
          />
          <CheckboxGroup
            groupLabel={t("eligibility.accessibility.title")}
            fields={buildDefaultFilterFields(
              ListingFilterKeys.listingFeatures,
              "eligibility.accessibility",
              listingFeatures,
              filterState
            )}
            register={register}
          />
        </Drawer.Content>
        <Drawer.Footer>
          <Button type="submit" variant="primary" size="sm">
            {t("listings.showMatchingListings")}
          </Button>
          <Button variant="primary-outlined" size="sm" onClick={props.onClose}>
            {t("t.cancel")}
          </Button>
        </Drawer.Footer>
      </Form>
    </Drawer>
  )
}

export { FilterDrawer as default, FilterDrawer }
