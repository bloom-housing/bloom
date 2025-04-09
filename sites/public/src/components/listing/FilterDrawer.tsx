import { Field, FieldGroup, Form, GridCell, t } from "@bloom-housing/ui-components"
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
import { useEffect } from "react"

export interface CheckboxGroupProps {
  label: string
  keyArr: string[]
  stringBase: string | string[]
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

const getBdrmTranslationArr = (strArr: string[]) => {
  const strBase = "listingFilters.bedroomsOptions."
  const translationArr = []
  strArr.forEach((str) => {
    if (str === "studio") {
      translationArr.push(t(`${strBase}studioPlus`))
    } else if (str === "oneBdrm") {
      translationArr.push(t(`${strBase}onePlus`))
    } else if (str === "twoBdrm") {
      translationArr.push(t(`${strBase}twoPlus`))
    } else if (str === "threeBdrm") {
      translationArr.push(t(`${strBase}threePlus`))
    } else if (str === "fourBdrm") {
      translationArr.push(t(`${strBase}fourPlus`))
    }
  })
  return translationArr
}

const CheckboxGroup = (props: CheckboxGroupProps) => {
  return (
    <fieldset className={styles["filter-section"]}>
      <Grid.Row className={styles["filter-section-label"]}>
        <legend>{props.label}</legend>
      </Grid.Row>
      <Grid.Row columns={props.customRowNumber ?? 3}>
        {props.keyArr.map((key, idx) => {
          const fieldLabel = Array.isArray(props.stringBase)
            ? props.stringBase[idx]
            : t(`${props.stringBase}.${key}`)
          return (
            <Grid.Cell>
              <Field
                id={key}
                name={key}
                label={fieldLabel}
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
            inputProps={{
              onBlur: () => {
                void trigger("minRent")
                void trigger("maxRent")
              },
              min: 0,
            }}
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
    <Drawer
      isOpen={props.isOpen}
      className={styles["filter-drawer"]}
      onClose={props.onClose}
      ariaLabelledBy="drawer-heading"
      ariaDescribedBy="drawer-content"
    >
      <Drawer.Header id="drawer-heading">{t("t.filter")}</Drawer.Header>
      <Drawer.Content id="drawer-content">
        <Form onSubmit={() => false}>
          <CheckboxGroup
            label={t("publicFilter.confirmedListings")}
            keyArr={["showConfirmedListings"]}
            stringBase={[t("publicFilter.confirmedListingsFieldLabel")]}
            register={register}
            customRowNumber={1}
          />
          <CheckboxGroup
            label={t("t.availability")}
            keyArr={Object.keys(FilterAvailabilityEnum).filter(
              (elem) => elem != FilterAvailabilityEnum.waitlistOpen
            )}
            stringBase={t("listings")}
            register={register}
          />
          <CheckboxGroup
            label={t("listings.homeType")}
            keyArr={Object.keys(HomeTypeEnum)}
            stringBase={"homeType"}
            register={register}
          />
          <CheckboxGroup
            label={t("publicFilter.bedroomSize")}
            keyArr={Object.keys(UnitTypeEnum).filter(
              (unitType) => unitType !== UnitTypeEnum.SRO && unitType != UnitTypeEnum.fiveBdrm
            )}
            stringBase={getBdrmTranslationArr(Object.keys(UnitTypeEnum))}
            register={register}
          />
          <RentSection register={register} />
          {/* fix string building for region */}
          <CheckboxGroup
            label={t("t.region")}
            keyArr={Object.keys(RegionEnum)}
            stringBase={"listingFilters.region"}
            register={register}
          />
          <CheckboxGroup
            label={t("eligibility.accessibility.title")}
            keyArr={listingFeatures}
            stringBase={"eligibility.accessibility"}
            register={register}
          />
        </Form>
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
  )
}

export { FilterDrawer as default, FilterDrawer }
