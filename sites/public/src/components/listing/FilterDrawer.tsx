import { Form, t } from "@bloom-housing/ui-components"
import { Button, Drawer } from "@bloom-housing/ui-seeds"
import { useForm } from "react-hook-form"
import { listingFeatures } from "@bloom-housing/shared-helpers"
import {
  FilterAvailabilityEnum,
  RegionEnum,
  UnitTypeEnum,
  HomeTypeEnum,
  ListingFilterKeys,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import styles from "./FilterDrawer.module.scss"
import {
  buildDefaultFilterFields,
  CheckboxGroup,
  FilterData,
  RentSection,
} from "./FilterDrawerHelper"

export interface FilterDrawerProps {
  filterState: FilterData
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: FilterData) => void
}

// remove doorway specific enum references
const filterAvailabilityCleaned = Object.keys(FilterAvailabilityEnum).filter(
  (elem) => elem != FilterAvailabilityEnum.waitlistOpen
)

//todo: should we include sro?
const unitTypeCleaned = Object.keys(UnitTypeEnum).filter(
  (unitType) => unitType !== UnitTypeEnum.SRO
)

const FilterDrawer = (props: FilterDrawerProps) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, getValues, setValue } = useForm()

  return (
    <Drawer
      isOpen={props.isOpen}
      className={styles["filter-drawer"]}
      onClose={props.onClose}
      ariaLabelledBy="drawer-heading"
      ariaDescribedBy="drawer-content"
    >
      <Drawer.Header id="drawer-heading">{t("t.filter")}</Drawer.Header>
      <Drawer.Content id="drawer-content">
        <Form onSubmit={handleSubmit(props.onSubmit)} id="filter">
          <CheckboxGroup
            groupLabel={t("listings.confirmedListings")}
            fields={[
              {
                key: ListingFilterKeys.isVerified,
                label: t("listings.confirmedListingsOnly"),
                defaultChecked: props.filterState?.[ListingFilterKeys.isVerified],
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
              props.filterState
            )}
            register={register}
          />
          <CheckboxGroup
            groupLabel={t("listings.homeType.lower")}
            fields={buildDefaultFilterFields(
              ListingFilterKeys.homeTypes,
              "listings.homeType",
              Object.keys(HomeTypeEnum),
              props.filterState
            )}
            register={register}
          />
          <CheckboxGroup
            groupLabel={t("listings.unitTypes.bedroomSize")}
            fields={buildDefaultFilterFields(
              ListingFilterKeys.bedroomTypes,
              "listings.unitTypes.expanded",
              unitTypeCleaned,
              props.filterState
            )}
            register={register}
          />
          <RentSection
            register={register}
            getValues={getValues}
            setValue={setValue}
            filterState={props.filterState}
          />
          <CheckboxGroup
            groupLabel={t("t.region")}
            fields={Object.keys(RegionEnum).map((region) => {
              return {
                key: `${ListingFilterKeys.regions}.${region}`,
                label: region.replace("_", " "),
                defaultChecked: props.filterState?.[ListingFilterKeys.regions]?.[region],
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
              props.filterState
            )}
            register={register}
          />
        </Form>
      </Drawer.Content>
      <Drawer.Footer>
        <Button type="submit" variant="primary" size="sm" nativeButtonProps={{ form: "filter" }}>
          {t("listings.showMatchingListings")}
        </Button>
        <Button variant="primary-outlined" size="sm" onClick={props.onClose}>
          {t("t.cancel")}
        </Button>
      </Drawer.Footer>
    </Drawer>
  )
}

export { FilterDrawer as default, FilterDrawer }
