import { Button, Card, Drawer, FieldValue, Grid } from "@bloom-housing/ui-seeds"
import SectionWithGrid from "../../shared/SectionWithGrid"
import { Field, FieldGroup, numberOptions, Select, t } from "@bloom-housing/ui-components"
import { useEffect, useState } from "react"
import { useForm, useFormContext, useWatch } from "react-hook-form"
import { DrawerHeader } from "@bloom-housing/ui-seeds/src/overlays/Drawer"
import { useAmiChartList, useUnitPriorityList, useUnitTypeList } from "../../../lib/hooks"
import {
  AmiChart,
  UnitAccessibilityPriorityType,
  UnitType,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { arrayToFormOptions, fieldHasError } from "../../../lib/helpers"
import { TempUnit } from "../../../lib/listings/formTypes"
import UnitGroupAmiForm from "./UnitGroupAmiForm"

type UnitGroupFormProps = {
  onSubmit: (unit: TempUnit) => void
  onClose: () => void
}

const UnitGroupForm = ({ onClose }: UnitGroupFormProps) => {
  const [addAmiDrawerOpen, setAmiDrawerOpen] = useState(false)
  const [amiChartsOptions, setAmiChartsOptions] = useState([])
  const [unitPrioritiesOptions, setUnitPrioritiesOptions] = useState([])
  const [unitTypesOptions, setUnitTypesOptions] = useState([])

  const formMethods = useFormContext()
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { watch } = formMethods
  const jurisdiction: string = watch("jurisdictions.id")
  /**
   * fetch form options
   */
  const { data: amiCharts = [] } = useAmiChartList(jurisdiction)
  const { data: unitPriorities = [] } = useUnitPriorityList()
  const { data: unitTypes = [] } = useUnitTypeList()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, errors, trigger, setValue, control } = useForm()

  // Controls for validating occupancy
  const minOccupancy: number = useWatch({ control, name: "minOccupancy" })
  const maxOccupancy: number = useWatch({ control, name: "maxOccupancy" })

  // Controls for validating square footage
  const minSquareFootage: number = useWatch({ control, name: "minSquareFootage" })
  const maxSquareFootage: number = useWatch({ control, name: "maxSquareFootage" })

  // Controls for validating floor
  const minFloor: number = useWatch({ control, name: "minFloor" })
  const maxFloor: number = useWatch({ control, name: "maxFloor" })

  // Controls for validating number of bathrooms
  const minBathrooms: number = useWatch({ control, name: "minBathrooms" })
  const maxBathrooms: number = useWatch({ control, name: "maxBathrooms" })

  const numberOccupancyOptions = 8
  const numberFloorsOptions = 11

  const bathroomOptions = [
    { label: "", value: "" },
    { label: ".5", value: "0.5" },
    { label: "1", value: "1" },
    { label: "1.5", value: "1.5" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "4", value: "4" },
    { label: "5", value: "5" },
  ]

  const waitlistStatusOptions = [
    {
      id: "true",
      label: t("listings.listingStatus.active"),
      value: "true",
      defaultChecked: true,
    },
    {
      id: "false",
      label: t("listings.listingStatus.closed"),
      value: "false",
    },
  ]

  // sets the options for the ami charts
  useEffect(() => {
    if (amiCharts.length === 0 || amiChartsOptions.length) return
    setAmiChartsOptions(arrayToFormOptions<AmiChart>(amiCharts, "name", "id"))
  }, [amiCharts, amiChartsOptions])

  // sets the options for the unit priorities
  useEffect(() => {
    if (unitPriorities.length === 0 || unitPrioritiesOptions.length) return
    setUnitPrioritiesOptions(
      arrayToFormOptions<UnitAccessibilityPriorityType>(unitPriorities, "name", "id")
    )
  }, [unitPrioritiesOptions, unitPriorities, setValue])

  // sets the options for the unit types
  useEffect(() => {
    if (unitTypes.length === 0 || unitTypesOptions.length) return
    setUnitTypesOptions(
      arrayToFormOptions<UnitType>(unitTypes, "name", "id", "listings.unit.typeOptions")
    )
  }, [unitTypesOptions, unitTypes])
  return (
    <>
      <Drawer.Content>
        <Card>
          <Card.Section>
            <SectionWithGrid heading={t("listings.unit.details")}>
              <fieldset>
                <Grid.Row columns={1}>
                  <legend className="mb-5">{t("listings.unit.type")}</legend>
                </Grid.Row>
                <Grid.Row columns={2}>
                  <FieldGroup
                    type="checkbox"
                    name="unitTypes"
                    fields={unitTypesOptions}
                    register={register}
                    fieldGroupClassName="grid grid-cols-2"
                  />
                </Grid.Row>
              </fieldset>
            </SectionWithGrid>
            <SectionWithGrid heading={t("listings.unit.details")}>
              <Grid.Row columns={3}>
                <FieldValue label={t("listings.unit.affordableGroupQuantity")}>
                  <Field
                    label={t("listings.unit.affordableGroupQuantity")}
                    name="groupQuantity"
                    placeholder={t("listings.unit.affordableGroupQuantity")}
                    readerOnly
                    register={register}
                  />
                </FieldValue>
              </Grid.Row>
              <Grid.Row columns={3}>
                <FieldValue label={t("listings.unit.minOccupancy")}>
                  <Select
                    id="minOccupancy"
                    name="minOccupancy"
                    label={t("listings.unit.minOccupancy")}
                    placeholder={t("listings.unit.minOccupancy")}
                    labelClassName="sr-only"
                    register={register}
                    controlClassName="control"
                    options={numberOptions(numberOccupancyOptions, 1)}
                    errorMessage={t("errors.minGreaterThanMaxOccupancyError")}
                    error={fieldHasError(errors?.minOccupancy)}
                    validation={{ max: maxOccupancy || numberOccupancyOptions }}
                    inputProps={{
                      onChange: () => {
                        void trigger("minOccupancy")
                        void trigger("maxOccupancy")
                      },
                    }}
                  />
                </FieldValue>
                <FieldValue label={t("listings.unit.maxOccupancy")}>
                  <Select
                    id="maxOccupancy"
                    name="maxOccupancy"
                    label={t("listings.unit.maxOccupancy")}
                    placeholder={t("listings.unit.maxOccupancy")}
                    labelClassName="sr-only"
                    register={register}
                    controlClassName="control"
                    options={numberOptions(numberOccupancyOptions, 1)}
                    errorMessage={t("errors.minGreaterThanMaxFootageError")}
                    error={fieldHasError(errors?.maxOccupancy)}
                    validation={{ min: minOccupancy }}
                    inputProps={{
                      onChange: () => {
                        void trigger("minOccupancy")
                        void trigger("maxOccupancy")
                      },
                    }}
                  />
                </FieldValue>
              </Grid.Row>
              <Grid.Row columns={3}>
                <FieldValue label={t("listings.unit.minSquareFootage")}>
                  <Field
                    label={t("listings.unit.minSquareFootage")}
                    name="minSquareFootage"
                    placeholder={t("listings.unit.minSquareFootage")}
                    register={register}
                    readerOnly
                    type="number"
                    errorMessage={t("errors.minGreaterThanMaxFootageError")}
                    error={fieldHasError(errors?.minSquareFootage)}
                    validation={{ max: maxSquareFootage }}
                    onChange={() => {
                      void trigger("minSquareFootage")
                      void trigger("maxSquareFootage")
                    }}
                  />
                </FieldValue>
                <FieldValue label={t("listings.unit.maxSquareFootage")}>
                  <Field
                    label={t("listings.unit.maxSquareFootage")}
                    name="maxSquareFootage"
                    placeholder={t("listings.unit.maxSquareFootage")}
                    register={register}
                    readerOnly
                    type="number"
                    errorMessage={t("errors.maxLessThanMinFootageError")}
                    error={fieldHasError(errors?.maxSquareFootage)}
                    validation={{ min: minSquareFootage }}
                    onChange={() => {
                      void trigger("minSquareFootage")
                      void trigger("maxSquareFootage")
                    }}
                  />
                </FieldValue>
              </Grid.Row>
              <Grid.Row columns={3}>
                <FieldValue label={t("listings.unit.minFloor")}>
                  <Select
                    labelClassName="sr-only"
                    controlClassName="control"
                    label={t("listings.unit.minFloor")}
                    name="minFloor"
                    id="minFloor"
                    options={numberOptions(numberFloorsOptions)}
                    register={register}
                    errorMessage={t("errors.maxLessThanMinFloorError")}
                    error={fieldHasError(errors?.minFloor)}
                    validation={{ max: maxFloor || numberFloorsOptions }}
                    inputProps={{
                      onChange: () => {
                        void trigger("minFloor")
                        void trigger("maxFloor")
                      },
                    }}
                  />
                </FieldValue>
                <FieldValue label={t("listings.unit.maxFloor")}>
                  <Select
                    labelClassName="sr-only"
                    controlClassName="control"
                    label={t("listings.unit.maxFloor")}
                    name="maxFloor"
                    id="maxFloor"
                    options={numberOptions(numberFloorsOptions)}
                    register={register}
                    errorMessage={t("errors.minGreaterThanMaxFloorError")}
                    error={fieldHasError(errors?.maxFloor)}
                    validation={{ min: minFloor }}
                    inputProps={{
                      onChange: () => {
                        void trigger("minFloor")
                        void trigger("maxFloor")
                      },
                    }}
                  />
                </FieldValue>
              </Grid.Row>
              <Grid.Row columns={3}>
                <FieldValue label={t("listings.unit.minBathrooms")}>
                  <Select
                    labelClassName="sr-only"
                    controlClassName="control"
                    label={t("listings.unit.minBathrooms")}
                    name="minBathrooms"
                    id="minBathrooms"
                    options={bathroomOptions}
                    register={register}
                    errorMessage={t("errors.minGreaterThanMaxBathroomsError")}
                    error={fieldHasError(errors.minBathrooms)}
                    validation={{ max: maxBathrooms }}
                    inputProps={{
                      onChange: () => {
                        void trigger("minBathrooms")
                        void trigger("maxBathrooms")
                      },
                    }}
                  />
                </FieldValue>
                <FieldValue label={t("listings.unit.maxBathrooms")}>
                  <Select
                    labelClassName="sr-only"
                    controlClassName="control"
                    label={t("listings.unit.maxBathrooms")}
                    name="maxBathrooms"
                    id="maxBathrooms"
                    options={bathroomOptions}
                    register={register}
                    errorMessage={t("errors.maxLessThanMinBathroomsError")}
                    error={fieldHasError(errors.maxBathrooms)}
                    validation={{ min: minBathrooms }}
                    inputProps={{
                      onChange: () => {
                        void trigger("minBathrooms")
                        void trigger("maxBathrooms")
                      },
                    }}
                  />
                </FieldValue>
              </Grid.Row>
            </SectionWithGrid>
            <hr className="spacer-section-above spacer-section" />
            <SectionWithGrid heading={t("t.availability")}>
              <Grid.Row columns={3}>
                <FieldValue label={t("listings.unit.groupVacancies")}>
                  <Field
                    label={t("listings.unit.groupVacancies")}
                    placeholder={t("listings.unit.groupVacancies")}
                    id="unitGroupVacancies"
                    name="unitGroupVacancies"
                    readerOnly
                  />
                </FieldValue>
                <FieldValue label={t("listings.unit.waitlistStatus")}>
                  <FieldGroup
                    name="waitlistStatus"
                    type="radio"
                    fields={waitlistStatusOptions}
                    register={register}
                  />
                </FieldValue>
              </Grid.Row>
            </SectionWithGrid>
            <hr className="spacer-section-above spacer-section" />
            <SectionWithGrid heading={t("listings.sections.eligibilityTitle")}>
              <Grid.Cell className="grid-inset-section">
                <Button
                  onClick={() => setAmiDrawerOpen(true)}
                  id="addAmiLevelButton"
                  type="button"
                  variant="primary-outlined"
                >
                  {t("listings.unit.amiAdd")}
                </Button>
              </Grid.Cell>
            </SectionWithGrid>
          </Card.Section>
        </Card>
      </Drawer.Content>
      <Drawer.Footer>
        <Button type="button" variant="primary" size="sm" id={"unitFormSaveAndExitButton"}>
          {t("t.saveExit")}
        </Button>

        <Button type="button" onClick={() => onClose()} variant="text" size="sm">
          {t("t.cancel")}
        </Button>
      </Drawer.Footer>

      <Drawer
        isOpen={addAmiDrawerOpen}
        onClose={() => setAmiDrawerOpen(false)}
        ariaLabelledBy="add-ami-level-drawer-header"
        nested
      >
        <DrawerHeader id="add-ami-level-drawer-header">{t("listings.unit.amiAdd")}</DrawerHeader>
        <UnitGroupAmiForm onClose={() => setAmiDrawerOpen(false)} />
      </Drawer>
    </>
  )
}

export default UnitGroupForm
