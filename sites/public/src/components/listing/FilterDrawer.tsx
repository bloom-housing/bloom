import { Field, Form, t } from "@bloom-housing/ui-components"
import { Button, Drawer, Grid } from "@bloom-housing/ui-seeds"
import { useForm, UseFormMethods } from "react-hook-form"
import { listingFeatures } from "@bloom-housing/shared-helpers"
import {
  FilterAvailabilityEnum,
  RegionEnum,
  UnitTypeEnum,
  HomeTypeEnum,
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

const getBdrmTranslation = (key) => {
  const strBase = "listingFilters.bedroomsOptions"
  switch (key) {
    case "studio":
      return t(`${strBase}.studioPlus`)
    case "oneBdrm":
      return t(`${strBase}.onePlus`)
    case "twoBdrm":
      return t(`${strBase}.twoPlus`)
    case "threeBdrm":
      return t(`${strBase}.threePlus`)
    case "fourBdrm":
      return t(`${strBase}.fourPlus`)
  }
}

const CheckboxGroup = (props: CheckboxGroupProps) => {
  return (
    <fieldset className={styles["filter-section"]}>
      <Grid.Row className={styles["filter-section-label"]}>
        <legend>{props.groupLabel}</legend>
      </Grid.Row>
      <Grid.Row columns={props.customRowNumber ?? 3}>
        {props.fields.map((field) => {
          return (
            <Grid.Cell>
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
    </fieldset>
  )
}

const FilterDrawer = (props: FilterDrawerProps) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, trigger, getValues, setValue, watch: formWatch, errors } = useForm()
  const minRent = formWatch("minRent")
  const maxRent = formWatch("maxRent")

  async function onFormSubmit() {
    const validation = await trigger()
    console.log(validation)
    if (!validation) return

    const data = getValues()
    console.log(data)
  }

  const RentSection = (props: RentSectionProps) => (
    <fieldset className={styles["filter-section"]}>
      <Grid.Row className={styles["filter-section-label"]}>
        <legend>{t("t.rent")}</legend>
      </Grid.Row>
      <Grid.Row className={styles["rent-input-section"]}>
        <Grid.Cell>
          <Field
            id="minRent"
            name="minRent"
            label={t("publicFilter.minRent")}
            type="currency"
            prepend="$"
            getValues={getValues}
            setValue={setValue}
            error={errors?.minRent !== undefined}
            errorMessage={
              errors?.minRent?.type === "min"
                ? t("errors.negativeMinRent")
                : t("errors.minGreaterThanMaxRentError")
            }
            validation={{ max: maxRent || minRent }}
            register={props.register}
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
            label={t("publicFilter.maxRent")}
            type="currency"
            prepend="$"
            getValues={getValues}
            setValue={setValue}
            error={errors?.maxRent !== undefined}
            errorMessage={t("errors.maxLessThanMinRentError")}
            validation={{ min: minRent }}
            register={props.register}
            onChange={() => {
              void trigger("minRent")
              void trigger("maxRent")
            }}
            inputProps={{ min: 0 }}
          ></Field>
        </Grid.Cell>
      </Grid.Row>
      <Grid.Row>
        <Grid.Cell>
          <Field
            name="section8Acceptance"
            label={t("listingFilters.section8")}
            labelClassName={styles["filter-checkbox-label"]}
            type="checkbox"
            register={props.register}
          ></Field>
        </Grid.Cell>
      </Grid.Row>
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
            groupLabel={t("publicFilter.confirmedListings")}
            fields={[
              {
                key: "showConfirmedListings",
                label: t("publicFilter.confirmedListingsFieldLabel"),
              },
            ]}
            register={register}
            customRowNumber={1}
          />
          <CheckboxGroup
            groupLabel={t("t.availability")}
            fields={buildDefaultFilterFields("listings", filterAvailabilityCleaned)}
            register={register}
          />
          <CheckboxGroup
            groupLabel={t("listings.homeType")}
            fields={buildDefaultFilterFields("homeType", Object.keys(HomeTypeEnum))}
            register={register}
          />
          <CheckboxGroup
            groupLabel={t("publicFilter.bedroomSize")}
            fields={unitTypeCleaned.map((unitType) => {
              return {
                key: unitType,
                label: getBdrmTranslation(unitType),
              }
            })}
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
