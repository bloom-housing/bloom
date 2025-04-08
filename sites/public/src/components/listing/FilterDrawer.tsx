import { Field, FieldGroup, Form, GridCell, t } from "@bloom-housing/ui-components"
import { Button, Drawer, Grid } from "@bloom-housing/ui-seeds"
import { useForm, UseFormMethods } from "react-hook-form"
import { listingFeatures } from "@bloom-housing/shared-helpers"
import {
  RegionEnum,
  UnitTypeEnum,
  HomeTypeEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import styles from "./FilterDrawer.module.scss"

export interface CheckboxGroupProps {
  label: string
  keyArr: string[]
  stringBase: string | string[]
  register: UseFormMethods["register"]
  customRowNumber?: number
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
                getValues={props.getValues}
                setValue={props.setValue}
                register={props.register}
              ></Field>
            </Grid.Cell>
          )
        })}
      </Grid.Row>
    </fieldset>
  )
}
export interface RentSectionProps {
  register: UseFormMethods["register"]
}
const RentSection = (props: RentSectionProps) => (
  <fieldset className={styles["filter-section"]}>
    <Grid.Row className={styles["filter-section-label"]}>
      <legend>{t("t.rent")}</legend>
    </Grid.Row>
    <Grid.Row className={styles["rent-input-section"]}>
      <Grid.Cell>
        <Field
          name="minRent"
          label={t("publicFilter.minRent")}
          type="currency"
          prepend="$"
          register={props.register}
        ></Field>
      </Grid.Cell>
      <Grid.Cell>
        <Field
          name="maxRent"
          label={t("publicFilter.maxRent")}
          type="currency"
          prepend="$"
          register={props.register}
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

export interface FilterDrawerProps {
  isOpen: boolean
  onClose: () => void
}

const FilterDrawer = (props: FilterDrawerProps) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, getValues, setValue } = useForm()

  return (
    <Form>
      <Drawer
        isOpen={props.isOpen}
        className={styles["filter-drawer"]}
        onClose={props.onClose}
        ariaLabelledBy="drawer-heading"
        ariaDescribedBy="drawer-content"
      >
        <Drawer.Header id="drawer-heading">{t("t.filter")}</Drawer.Header>
        <Drawer.Content id="drawer-content">
          {/* <Form> */}
          <CheckboxGroup
            label={t("publicFilter.confirmedListings")}
            keyArr={["showConfirmedListings"]}
            stringBase={[t("publicFilter.confirmedListingsFieldLabel")]}
            getValues={getValues}
            setValue={setValue}
            register={register}
            customRowNumber={1}
          />
          <CheckboxGroup
            label={t("listings.homeType")}
            keyArr={Object.keys(HomeTypeEnum)}
            stringBase={"homeType"}
            getValues={getValues}
            setValue={setValue}
            register={register}
          />
          <CheckboxGroup
            label={t("t.bedrooms")}
            keyArr={Object.keys(UnitTypeEnum)}
            stringBase={"application.household.preferredUnit.options"}
            getValues={getValues}
            setValue={setValue}
            register={register}
          />
          <RentSection register={register} />
          <CheckboxGroup
            label={t("listings.reservedCommunityType")}
            keyArr={Object.keys(formatCommunityType)}
            stringBase={"listings.reservedCommunityTypeDescriptions"}
            getValues={getValues}
            setValue={setValue}
            register={register}
          />
          {/* fix string building for region */}
          <CheckboxGroup
            label={t("t.region")}
            keyArr={Object.keys(RegionEnum)}
            stringBase={"listingFilters.region"}
            getValues={getValues}
            setValue={setValue}
            register={register}
          />
          <CheckboxGroup
            label={t("eligibility.accessibility.title")}
            keyArr={listingFeatures}
            stringBase={"eligibility.accessibility"}
            getValues={getValues}
            setValue={setValue}
            register={register}
          />
        </Drawer.Content>
        <Drawer.Footer>
          <Button variant="primary" size="sm">
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
