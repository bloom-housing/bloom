import { Field, Form, t } from "@bloom-housing/ui-components"
import { Button, Drawer, Grid } from "@bloom-housing/ui-seeds"
import { useForm, UseFormMethods, useWatch } from "react-hook-form"
import { listingFeatures } from "@bloom-housing/shared-helpers"
import {
  FilterAvailabilityEnum,
  RegionEnum,
  UnitTypeEnum,
  HomeTypeEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import styles from "./FilterDrawer.module.scss"
import { useEffect } from "react"

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

const buildDefaultFilterFields = (stringBase: string, keyArr: string[]): FilterField[] =>
  keyArr.map((key) => {
    return {
      key: key,
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
              <Grid.Cell key={`${field.label}-cell`}>
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

const FilterDrawer = (props: FilterDrawerProps) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { control, register, trigger, getValues, setValue, watch: formWatch, errors } = useForm()
  // const minRent: number = useWatch({
  //   control,
  //   name: "minRent",
  // })
  // const maxRent: number = useWatch({
  //   control,
  //   name: "maxRent",
  // })

  const minRent = formWatch("minRent")
  const maxRent = formWatch("maxRent")
  async function onFormSubmit() {
    const validation = await trigger()
    console.log(validation)
    if (!validation) return

    const data = getValues()
    console.log(data)
  }
  useEffect(() => {
    console.log(errors)
  }, [errors])

  const RentSection = (props: RentSectionProps) => (
    <fieldset className={styles["filter-section"]}>
      <legend className={styles["filter-section-label"]}>{t("t.rent")}</legend>
      <Grid spacing="sm">
        <Grid.Row>
          <Grid.Cell>
            <Field
              id="minRent"
              name="minRent"
              label={t("listings.minRent")}
              type="currency"
              prepend="$"
              register={props.register}
              getValues={getValues}
              setValue={setValue}
              error={errors?.minRent !== undefined}
              defaultValue={8}
              errorMessage={
                errors?.minRent?.type === "min"
                  ? t("errors.negativeMinRent")
                  : t("errors.minGreaterThanMaxRentError")
              }
              validation={{ max: maxRent || minRent }}
              inputProps={{
                onBlur: () => {
                  void trigger("minRent")
                  void trigger("maxRent")
                },
                min: 0,
              }}
            ></Field>
          </Grid.Cell>
          <Grid.Cell>
            <Field
              id="maxRent"
              name="maxRent"
              label={t("listings.maxRent")}
              type="currency"
              prepend="$"
              register={props.register}
              getValues={getValues}
              setValue={setValue}
              error={errors?.maxRent !== undefined}
              errorMessage={t("errors.maxLessThanMinRentError")}
              validation={{ min: minRent }}
              inputProps={{
                onChange: () => {
                  void trigger("minRent")
                  void trigger("maxRent")
                },
                min: 0,
              }}
            ></Field>
          </Grid.Cell>
        </Grid.Row>
        <Grid.Row key="0">
          <Grid.Cell>
            <Field
              name="section8Acceptance"
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
            fields={buildDefaultFilterFields("listings.availability", filterAvailabilityCleaned)}
            register={register}
          />
          <CheckboxGroup
            groupLabel={t("listings.homeType")}
            fields={buildDefaultFilterFields("listings.homeType", Object.keys(HomeTypeEnum))}
            register={register}
          />
          <CheckboxGroup
            groupLabel={t("listings.unitTypes.bedroomSize")}
            fields={buildDefaultFilterFields("listings.unitTypes.expanded", unitTypeCleaned)}
            register={register}
          />
          <RentSection register={register} />
          <CheckboxGroup
            groupLabel={t("t.region")}
            fields={Object.keys(RegionEnum).map((region) => {
              return { key: region, label: region.replace("_", " ") }
            })}
            register={register}
          />
          <CheckboxGroup
            groupLabel={t("eligibility.accessibility.title")}
            fields={buildDefaultFilterFields("eligibility.accessibility", listingFeatures)}
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
