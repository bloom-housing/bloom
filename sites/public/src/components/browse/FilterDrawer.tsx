import { Form, t } from "@bloom-housing/ui-components"
import { Button, Drawer } from "@bloom-housing/ui-seeds"
import { useForm } from "react-hook-form"
import { listingFeatures } from "@bloom-housing/shared-helpers"
import {
  RegionEnum,
  HomeTypeEnum,
  ListingFilterKeys,
  MultiselectQuestion,
  FeatureFlagEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import styles from "./FilterDrawer.module.scss"
import {
  buildDefaultFilterFields,
  CheckboxGroup,
  FilterData,
  getAvailabilityValues,
  RentSection,
  SearchSection,
  unitTypeMapping,
  unitTypesSorted,
} from "./FilterDrawerHelpers"
import { isTrue } from "../../lib/helpers"

export interface FilterDrawerProps {
  filterState: FilterData
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: FilterData) => void
  multiselectData: MultiselectQuestion[]
  activeFeatureFlags?: FeatureFlagEnum[]
}

const FilterDrawer = (props: FilterDrawerProps) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({ mode: "onBlur" })

  const enableUnitGroups = props.activeFeatureFlags?.some(
    (entry) => entry === FeatureFlagEnum.enableUnitGroups
  )

  const availabilityLabels = getAvailabilityValues(enableUnitGroups).map((key) =>
    t(`listings.availability.${key}`)
  )

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
                defaultChecked: isTrue(props.filterState?.[ListingFilterKeys.isVerified]),
              },
            ]}
            register={register}
            customColumnNumber={1}
          />
          <CheckboxGroup
            groupLabel={t("t.availability")}
            fields={buildDefaultFilterFields(
              ListingFilterKeys.availabilities,
              availabilityLabels,
              getAvailabilityValues(false),
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
              unitTypesSorted.map((unitType) => t(unitTypeMapping[unitType].labelKey)),
              unitTypesSorted,
              props.filterState
            )}
            register={register}
          />
          <RentSection
            register={register}
            getValues={getValues}
            setValue={setValue}
            filterState={props.filterState}
            setError={setError}
            clearErrors={clearErrors}
            errors={errors}
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
          <SearchSection register={register} nameState={props.filterState?.name} />
          {props.multiselectData?.length > 0 && (
            <CheckboxGroup
              groupLabel={t("t.community")}
              fields={buildDefaultFilterFields(
                ListingFilterKeys.multiselectQuestions,
                props.multiselectData?.map((multi) => multi.text),
                props.multiselectData?.map((multi) => multi.id),
                props.filterState
              )}
              register={register}
            />
          )}
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
