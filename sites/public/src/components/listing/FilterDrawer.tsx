import { Field, Form, t } from "@bloom-housing/ui-components"
import { Button, Drawer, Grid } from "@bloom-housing/ui-seeds"
import { useForm, UseFormMethods } from "react-hook-form"
import { listingFeatures } from "@bloom-housing/shared-helpers"
import {
  FilterAvailabilityEnum,
  RegionEnum,
  UnitTypeEnum,
  HomeTypeEnum,
  ListingFilterKeys,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import styles from "./FilterDrawer.module.scss"

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
                ></Field>
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

  async function onFormSubmit() {
    const validation = await trigger()
    if (!validation) return

    const data = getValues()
    console.log(data)
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
                key: "showConfirmedListings",
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
