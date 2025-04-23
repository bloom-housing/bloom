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
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import styles from "./FilterDrawer.module.scss"
import { useContext } from "react"

export interface FilterField {
  key: string
  label: string
  // defaultValue: boolean
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
}

export interface FilterDrawerProps {
  isOpen: boolean
  onClose: () => void
}

// remove doorway specific enum references
const filterAvailabilityCleaned = Object.keys(FilterAvailabilityEnum).filter(
  (elem) => elem != FilterAvailabilityEnum.waitlistOpen
)

const unitTypeCleaned = Object.keys(UnitTypeEnum).filter(
  (unitType) => unitType !== UnitTypeEnum.SRO && unitType != UnitTypeEnum.fiveBdrm
)
export const unitTypeMapping = {
  [UnitTypeEnum.studio]: 0,
  [UnitTypeEnum.SRO]: 0,
  [UnitTypeEnum.oneBdrm]: 1,
  [UnitTypeEnum.twoBdrm]: 2,
  [UnitTypeEnum.threeBdrm]: 3,
  [UnitTypeEnum.fourBdrm]: 4,
  [UnitTypeEnum.fiveBdrm]: 5,
}

const buildDefaultFilterFields = (
  filterType: ListingFilterKeys,
  stringBase: string,
  keyArr: string[]
): FilterField[] =>
  keyArr.map((key) => {
    return {
      key: `${filterType}.${key}`,
      label: t(`${stringBase}.${key}`),
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
          ></Field>
        </Grid.Cell>
      </Grid.Row>
    </Grid>
  </fieldset>
)

const FilterDrawer = (props: FilterDrawerProps) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, trigger, getValues, setValue } = useForm()
  const { listingsService } = useContext(AuthContext)
  const arrayFilters: ListingFilterKeys[] = [
    ListingFilterKeys.counties,
    ListingFilterKeys.homeTypes,
    ListingFilterKeys.listingFeatures,
    ListingFilterKeys.regions,
    ListingFilterKeys.reservedCommunityTypes,
  ]
  const booleanFilters: ListingFilterKeys[] = [
    ListingFilterKeys.isVerified,
    ListingFilterKeys.section8Acceptance,
  ]
  const indvidualFilters: ListingFilterKeys[] = [
    ListingFilterKeys.availability,
    ListingFilterKeys.bathrooms,
    ListingFilterKeys.bedrooms,
    ListingFilterKeys.jurisdiction,
  ]

  async function onFormSubmit() {
    const validation = await trigger()
    if (!validation) return
    const data = getValues()
    const filters: ListingFilterParams[] = []
    Object.entries(data).forEach(([filterType, userSelections]) => {
      if (indvidualFilters.includes(ListingFilterKeys[filterType])) {
        Object.entries(userSelections).forEach((field: [ListingFilterKeys, any]) => {
          if (field[1]) {
            const filter = {
              $comparison: EnumListingFilterParamsComparison["="],
            }
            if (filterType === ListingFilterKeys.bedrooms) {
              filter[filterType] = unitTypeMapping[field[0]]
            } else {
              filter[filterType] = field[0]
            }
            filters.push(filter)
          }
        })
      } else if (arrayFilters.includes(ListingFilterKeys[filterType])) {
        const selectedFields = []
        Object.entries(userSelections).forEach((field: [ListingFilterKeys, any]) => {
          if (field[1]) {
            selectedFields.push(field[0])
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
        filter[filterType] = userSelections
        filters.push(filter)
      } else if (filterType === ListingFilterKeys.monthlyRent) {
        if (userSelections["minRent"]) {
          const filter = {
            $comparison: EnumListingFilterParamsComparison[">="],
          }
          filter[ListingFilterKeys.monthlyRent] = userSelections["minRent"]
          filters.push(filter)
        }
        if (userSelections["maxRent"]) {
          const filter = {
            $comparison: EnumListingFilterParamsComparison["<="],
          }
          filter[ListingFilterKeys.monthlyRent] = userSelections["maxRent"]
          filters.push(filter)
        }
      }
    })
    console.log(filters)
    const query: ListingsQueryBody = {
      page: 1,
      view: ListingViews.base,
      filter: filters,
    }
    const filteredListings = await listingsService.filterableList({ body: query })
    console.log(filteredListings.items)

    // await fetchBaseListingData(
    //   {
    //     page: 1,
    //     additionalFilters: filters,
    //     orderBy: [ListingOrderByKeys.mostRecentlyPublished],
    //     orderDir: [OrderByEnum.desc],
    //     limit: process.env.maxOpenListings,
    //   },
    //   context.req
    // )

    // console.log(data)
  }

  return (
    <Form onSubmit={() => false}>
      <Drawer
        isOpen={props.isOpen}
        className={styles["filter-drawer"]}
        onClose={props.onClose}
        ariaLabelledBy="drawer-heading"
        ariaDescribedBy="drawer-content"
      >
        <Drawer.Header id="drawer-heading">{t("t.filter")}</Drawer.Header>
        <Drawer.Content id="drawer-content">
          <CheckboxGroup
            groupLabel={t("listings.confirmedListings")}
            fields={[
              {
                key: ListingFilterKeys.isVerified,
                label: t("listings.confirmedListingsOnly"),
              },
            ]}
            register={register}
            customRowNumber={1}
          />
          <CheckboxGroup
            groupLabel={t("t.availability")}
            fields={buildDefaultFilterFields(
              ListingFilterKeys.availability,
              "listings.availability",
              filterAvailabilityCleaned
            )}
            register={register}
          />
          <CheckboxGroup
            groupLabel={t("listings.homeType.lower")}
            fields={buildDefaultFilterFields(
              ListingFilterKeys.homeTypes,
              "listings.homeType",
              Object.keys(HomeTypeEnum)
            )}
            register={register}
          />
          <CheckboxGroup
            groupLabel={t("listings.unitTypes.bedroomSize")}
            fields={buildDefaultFilterFields(
              ListingFilterKeys.bedrooms,
              "listings.unitTypes.expanded",
              unitTypeCleaned
            )}
            register={register}
          />
          <RentSection register={register} getValues={getValues} setValue={setValue} />
          <CheckboxGroup
            groupLabel={t("t.region")}
            fields={Object.keys(RegionEnum).map((region) => {
              return {
                key: `${ListingFilterKeys.regions}.${region}`,
                label: region.replace("_", " "),
              }
            })}
            register={register}
          />
          <CheckboxGroup
            groupLabel={t("eligibility.accessibility.title")}
            fields={buildDefaultFilterFields(
              ListingFilterKeys.listingFeatures,
              "eligibility.accessibility",
              listingFeatures
            )}
            register={register}
          />
        </Drawer.Content>
        <Drawer.Footer>
          <Button variant="primary" onClick={() => onFormSubmit()} size="sm">
            {t("listings.showMatchingListings")}
          </Button>
          <Button variant="primary-outlined" size="sm" onClick={props.onClose}>
            {t("t.cancel")}
          </Button>
        </Drawer.Footer>
      </Drawer>
    </Form>
  )
}

export { FilterDrawer as default, FilterDrawer }
