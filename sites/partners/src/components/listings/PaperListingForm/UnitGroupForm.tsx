import { Button, Card, Dialog, Drawer, FieldValue, Grid } from "@bloom-housing/ui-seeds"
import SectionWithGrid from "../../shared/SectionWithGrid"
import {
  Field,
  FieldGroup,
  MinimalTable,
  numberOptions,
  Select,
  t,
} from "@bloom-housing/ui-components"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useForm, useFormContext, useWatch } from "react-hook-form"
import { DrawerHeader } from "@bloom-housing/ui-seeds/src/overlays/Drawer"
import { useAmiChartList, useUnitPriorityList, useUnitTypeList } from "../../../lib/hooks"
import {
  AmiChart,
  EnumUnitGroupAmiLevelMonthlyRentDeterminationType,
  UnitAccessibilityPriorityType,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { arrayToFormOptions, fieldHasError } from "../../../lib/helpers"
import { TempAmiLevel, TempUnitGroup } from "../../../lib/listings/formTypes"
import UnitGroupAmiForm from "./UnitGroupAmiForm"

type UnitGroupFormProps = {
  onSubmit: (unit: TempUnitGroup) => void
  onClose: () => void
  defaultUnitGroup: TempUnitGroup | undefined
  draft: boolean
  nextId: number
}

const UnitGroupForm = ({
  onClose,
  onSubmit,
  defaultUnitGroup,
  draft,
  nextId,
}: UnitGroupFormProps) => {
  const [amiChartsOptions, setAmiChartsOptions] = useState([])
  const [unitPrioritiesOptions, setUnitPrioritiesOptions] = useState([])
  const [unitTypesOptions, setUnitTypesOptions] = useState([])
  const [amiDeleteModal, setAmiDeleteModal] = useState<number | null>(null)
  const [amiLevels, setAmiLevels] = useState<TempAmiLevel[]>([])
  const [amiSummary, setAmiSummary] = useState<number | null>(null)

  const amiTableHeaders = {
    amiChartName: "listings.unit.amiChart",
    amiPercentage: "listings.unit.amiLevel",
    monthlyRentDeterminationType: "listings.unit.rentType",
    rentValue: "listings.unit.monthlyRent",
    action: "",
  }

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
  const { register, errors, trigger, setValue, control, getValues, reset } = useForm()

  // Controls for validating occupancy
  const minOccupancy: number = useWatch({ control, name: "minOccupancy" })
  const maxOccupancy: number = useWatch({ control, name: "maxOccupancy" })

  // Controls for validating square footage
  const sqFeetMin: number = useWatch({ control, name: "sqFeetMin" })
  const sqFeetMax: number = useWatch({ control, name: "sqFeetMax" })

  // Controls for validating floor
  const floorMin: number = useWatch({ control, name: "floorMin" })
  const floorMax: number = useWatch({ control, name: "floorMax" })

  // Controls for validating number of bathrooms
  const bathroomMin: number = useWatch({ control, name: "bathroomMin" })
  const bathroomMax: number = useWatch({ control, name: "bathroomMax" })

  const totalAvailable: number = useWatch({ control, name: "totalAvailable" })
  const totalCount: number = useWatch({ control, name: "totalCount" })

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
      unitTypes.map((unitType) => {
        return {
          id: unitType.id,
          label: t(`listings.unit.typeOptions.${unitType.name}`),
          value: unitType.id,
        }
      })
    )
  }, [unitTypesOptions, unitTypes])

  // reset values to a default unit group for edit
  useEffect(() => {
    if (defaultUnitGroup) {
      if (defaultUnitGroup.unitGroupAmiLevels.length) {
        setAmiLevels(defaultUnitGroup.unitGroupAmiLevels)
      }

      reset({
        ...defaultUnitGroup,
        unitTypes: defaultUnitGroup?.unitTypes?.map((elem) => elem.id ?? elem.toString()),
      })
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const saveAmiSummary = (newAmiLevel: TempAmiLevel) => {
    const exisits = amiLevels?.some((amiLevel) => amiLevel.tempId === newAmiLevel.tempId)
    if (exisits) {
      setAmiLevels(
        amiLevels.map((amiLevel) =>
          amiLevel.tempId === newAmiLevel.tempId ? newAmiLevel : amiLevel
        )
      )
    } else {
      if (amiLevels) {
        setAmiLevels((current) => [...current, newAmiLevel])
      } else {
        setAmiLevels([newAmiLevel])
      }
    }
  }

  const deleteAmiLevel = useCallback(
    (tempId: number) => {
      const updatedAmiLevels = amiLevels
        .filter((entry) => entry.tempId !== tempId)
        .map((updatedAmiLevel, index) => ({
          ...updatedAmiLevel,
          tempId: index + 1,
        }))

      setAmiLevels(updatedAmiLevels)
      setAmiDeleteModal(null)
    },
    [amiLevels]
  )

  const amiLevelsTableData = useMemo(
    () =>
      amiLevels?.map((ami) => {
        const selectedAmiChart = amiChartsOptions.find((chart) => chart.value === ami.amiChart.id)

        let rentValue = undefined
        let monthlyRentDeterminationType = undefined
        if (
          ami.monthlyRentDeterminationType ===
          EnumUnitGroupAmiLevelMonthlyRentDeterminationType.flatRent
        ) {
          rentValue = `${ami.flatRentValue ? `$${ami.flatRentValue}` : ""}`
          monthlyRentDeterminationType = t("listings.unit.fixed")
        } else if (
          ami.monthlyRentDeterminationType ===
          EnumUnitGroupAmiLevelMonthlyRentDeterminationType.percentageOfIncome
        ) {
          rentValue = `${ami.percentageOfIncomeValue ? `${ami.percentageOfIncomeValue}%` : ""}`
          monthlyRentDeterminationType = t("listings.unit.percentage")
        }

        return {
          amiChartName: { content: selectedAmiChart?.label || "" },
          amiPercentage: { content: `${ami.amiPercentage ? `${ami.amiPercentage}%` : ""}` },
          monthlyRentDeterminationType: { content: monthlyRentDeterminationType },
          rentValue: { content: rentValue },
          action: {
            content: (
              <div className="flex gap-3">
                <Button
                  type="button"
                  className="front-semibold"
                  variant="text"
                  size="sm"
                  onClick={() => {
                    setAmiSummary(ami.tempId)
                  }}
                >
                  {t("t.edit")}
                </Button>
                <Button
                  type="button"
                  className="front-semibold text-alert"
                  variant="text"
                  size="sm"
                  onClick={() => setAmiDeleteModal(ami.tempId)}
                >
                  {t("t.delete")}
                </Button>
              </div>
            ),
          },
        }
      }),
    [amiLevels, amiChartsOptions]
  )

  async function onFormSubmit() {
    const validation = await trigger()
    if (!validation) {
      return
    }

    const data = getValues()

    if (data.unitTypes?.length) {
      const types = data.unitTypes
        .map((entry) => unitTypes.find((type) => type.id === entry))
        .filter((entry) => !!entry)

      data.unitTypes = types
    } else {
      delete data.unitTypes
    }

    let amiLevelsData
    if (amiLevels) {
      amiLevelsData = amiLevels?.map((level) => ({
        ...level,
        amiChart: amiCharts.find((a) => a.id === level.amiChart.id),
      }))
    } else if (data?.amiLevels) {
      data.amiLevels = data.amiLevels.map((level) => ({
        ...level,
        amiChart: amiCharts.find((a) => a.id === level.amiChart.id),
      }))
    }

    const formData = {
      id: null,
      createdAt: undefined,
      updatedAt: undefined,
      ...data,
      tempId: draft ? nextId : defaultUnitGroup.tempId,
      unitGroupAmiLevels: amiLevelsData,
    }
    onSubmit(formData)
    onClose()
  }

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
                    fieldClassName="m-0"
                    error={fieldHasError(errors?.unitTypes)}
                    errorMessage={t("errors.requiredFieldError")}
                    validation={{ required: true }}
                    dataTestId="unitTypesCheckBoxes"
                  />
                </Grid.Row>
              </fieldset>
            </SectionWithGrid>
            <SectionWithGrid heading={t("listings.unit.details")}>
              <Grid.Row columns={3}>
                <FieldValue label={t("listings.unit.affordableGroupQuantity")}>
                  <Field
                    label={t("listings.unit.affordableGroupQuantity")}
                    id="totalCount"
                    name="totalCount"
                    placeholder={t("listings.unit.affordableGroupQuantity")}
                    register={register}
                    readerOnly
                    type="number"
                    error={fieldHasError(errors?.totalCount)}
                    errorMessage={t("errors.totalCountLessThanTotalAvailableError")}
                    validation={{ min: totalAvailable }}
                    inputProps={{
                      onBlur: () => {
                        void trigger("totalCount")
                        void trigger("totalAvailable")
                      },
                    }}
                    dataTestId="totalCount"
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
                    errorMessage={t("errors.maxLessThanMinOccupancyError")}
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
                    id="sqFeetMin"
                    name="sqFeetMin"
                    placeholder={t("listings.unit.minSquareFootage")}
                    register={register}
                    readerOnly
                    type="number"
                    errorMessage={t("errors.minGreaterThanMaxFootageError")}
                    error={fieldHasError(errors?.sqFeetMin)}
                    validation={{ max: sqFeetMax }}
                    onChange={() => {
                      void trigger("sqFeetMin")
                      void trigger("sqFeetMax")
                    }}
                  />
                </FieldValue>
                <FieldValue label={t("listings.unit.maxSquareFootage")}>
                  <Field
                    label={t("listings.unit.maxSquareFootage")}
                    id="sqFeetMax"
                    name="sqFeetMax"
                    placeholder={t("listings.unit.maxSquareFootage")}
                    register={register}
                    readerOnly
                    type="number"
                    errorMessage={t("errors.maxLessThanMinFootageError")}
                    error={fieldHasError(errors?.sqFeetMax)}
                    validation={{ min: sqFeetMin }}
                    onChange={() => {
                      void trigger("sqFeetMin")
                      void trigger("sqFeetMax")
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
                    name="floorMin"
                    id="floorMin"
                    options={numberOptions(numberFloorsOptions)}
                    register={register}
                    errorMessage={t("errors.minGreaterThanMaxFloorError")}
                    error={fieldHasError(errors?.floorMin)}
                    validation={{ max: floorMax || numberFloorsOptions }}
                    inputProps={{
                      onChange: () => {
                        void trigger("floorMin")
                        void trigger("floorMax")
                      },
                    }}
                  />
                </FieldValue>
                <FieldValue label={t("listings.unit.maxFloor")}>
                  <Select
                    labelClassName="sr-only"
                    controlClassName="control"
                    label={t("listings.unit.maxFloor")}
                    name="floorMax"
                    id="floorMax"
                    options={numberOptions(numberFloorsOptions)}
                    register={register}
                    errorMessage={t("errors.maxLessThanMinFloorError")}
                    error={fieldHasError(errors?.floorMax)}
                    validation={{ min: floorMin }}
                    inputProps={{
                      onChange: () => {
                        void trigger("floorMin")
                        void trigger("floorMax")
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
                    name="bathroomMin"
                    id="bathroomMin"
                    options={bathroomOptions}
                    register={register}
                    errorMessage={t("errors.minGreaterThanMaxBathroomsError")}
                    error={fieldHasError(errors.bathroomMin)}
                    validation={{ max: bathroomMax }}
                    inputProps={{
                      onChange: () => {
                        void trigger("bathroomMin")
                        void trigger("bathroomMax")
                      },
                    }}
                  />
                </FieldValue>
                <FieldValue label={t("listings.unit.maxBathrooms")}>
                  <Select
                    labelClassName="sr-only"
                    controlClassName="control"
                    label={t("listings.unit.maxBathrooms")}
                    name="bathroomMax"
                    id="bathroomMax"
                    options={bathroomOptions}
                    register={register}
                    errorMessage={t("errors.maxLessThanMinBathroomsError")}
                    error={fieldHasError(errors.bathroomMax)}
                    validation={{ min: bathroomMin }}
                    inputProps={{
                      onChange: () => {
                        void trigger("bathroomMin")
                        void trigger("bathroomMax")
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
                    id="totalAvailable"
                    name="totalAvailable"
                    register={register}
                    type="number"
                    error={errors?.totalAvailable !== undefined}
                    errorMessage={t("errors.totalAvailableGreaterThanTotalCountError")}
                    validation={{ max: totalCount || totalAvailable }}
                    inputProps={{
                      onBlur: () => {
                        void trigger("totalCount")
                        void trigger("totalAvailable")
                      },
                    }}
                    readerOnly
                  />
                </FieldValue>
                <FieldValue label={t("listings.unit.waitlistStatus")}>
                  <FieldGroup
                    name="openWaitlist"
                    type="radio"
                    fields={waitlistStatusOptions}
                    register={register}
                    fieldClassName="m-0"
                    fieldGroupClassName="flex h-12 items-center"
                    error={errors?.openWaitlist !== undefined}
                    errorMessage={t("errors.requiredFieldError")}
                    dataTestId="openWaitListQuestion"
                  />
                </FieldValue>
              </Grid.Row>
            </SectionWithGrid>
            <hr className="spacer-section-above spacer-section" />
            <SectionWithGrid heading={t("listings.sections.eligibilityTitle")}>
              <Grid.Cell className="grid-inset-section">
                {!!amiLevels.length && (
                  <div className="mb-5">
                    <MinimalTable headers={amiTableHeaders} data={amiLevelsTableData} />
                  </div>
                )}
                <Button
                  onClick={() => {
                    setAmiSummary((amiLevels.length || 0) + 1)
                  }}
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
        <Button
          type="button"
          variant="primary"
          size="sm"
          id={"unitFormSaveAndExitButton"}
          onClick={() => onFormSubmit()}
        >
          {t("t.saveExit")}
        </Button>

        <Button type="button" onClick={() => onClose()} variant="text" size="sm">
          {t("t.cancel")}
        </Button>
      </Drawer.Footer>

      <Drawer
        isOpen={!!amiSummary}
        onClose={() => setAmiSummary(null)}
        ariaLabelledBy="add-ami-level-drawer-header"
        nested
      >
        <DrawerHeader id="add-ami-level-drawer-header">{t("listings.unit.amiAdd")}</DrawerHeader>
        <UnitGroupAmiForm
          onClose={() => setAmiSummary(null)}
          onSubmit={(amiLevel) => saveAmiSummary(amiLevel)}
          amiChartsOptions={amiChartsOptions}
          amiLevels={amiLevels}
          currentTempId={amiSummary}
        />
      </Drawer>

      <Dialog isOpen={!!amiDeleteModal} onClose={() => setAmiDeleteModal(null)}>
        <Dialog.Header>{t("listings.unit.amiDelete")}</Dialog.Header>
        <Dialog.Content>{t("listings.unit.amiDeleteConf")}</Dialog.Content>
        <Dialog.Footer>
          <Button variant="alert" onClick={() => deleteAmiLevel(amiDeleteModal)} size="sm">
            {t("t.delete")}
          </Button>
          <Button
            onClick={() => {
              setAmiDeleteModal(null)
            }}
            variant="primary-outlined"
            size="sm"
          >
            {t("t.cancel")}
          </Button>
        </Dialog.Footer>
      </Dialog>
    </>
  )
}

export default UnitGroupForm
