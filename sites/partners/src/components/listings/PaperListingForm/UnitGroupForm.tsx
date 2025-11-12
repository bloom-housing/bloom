import { UnitGroupTypeSort } from "@bloom-housing/shared-helpers/src/utilities/unitTypes"
import { Button, Card, Dialog, Drawer, Grid } from "@bloom-housing/ui-seeds"
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
import { useForm, useWatch } from "react-hook-form"
import { DrawerHeader } from "@bloom-housing/ui-seeds/src/overlays/Drawer"
import {
  useAmiChartList,
  useUnitPriorityList,
  useUnitTypeList,
  useWatchOnFormNumberFieldsChange,
} from "../../../lib/hooks"
import {
  AmiChart,
  EnumUnitGroupAmiLevelMonthlyRentDeterminationType,
  RentTypeEnum,
  UnitAccessibilityPriorityType,
  YesNoEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { arrayToFormOptions, fieldHasError } from "../../../lib/helpers"
import { TempAmiLevel, TempUnitGroup } from "../../../lib/listings/formTypes"
import UnitGroupAmiForm from "./UnitGroupAmiForm"
import styles from "./ListingForm.module.scss"

type UnitGroupFormProps = {
  onSubmit: (unit: TempUnitGroup) => void
  onClose: () => void
  defaultUnitGroup: TempUnitGroup | undefined
  draft: boolean
  nextId: number
  jurisdiction: string
  isNonRegulated?: boolean
}

const UnitGroupForm = ({
  onClose,
  onSubmit,
  defaultUnitGroup,
  draft,
  nextId,
  jurisdiction,
  isNonRegulated,
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

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const {
    register,
    formState: { errors },
    trigger,
    setValue,
    control,
    getValues,
    reset,
  } = useForm({
    mode: "onChange",
    shouldFocusError: false,
  })
  /**
   * fetch form options
   */
  const { data: amiCharts = [] } = useAmiChartList(jurisdiction)
  const { data: unitPriorities = [] } = useUnitPriorityList()
  const { data: unitTypes = [] } = useUnitTypeList()

  // Controls for validating occupancy
  const minOccupancy: number = useWatch({ control, name: "minOccupancy" })
  const maxOccupancy: number = useWatch({ control, name: "maxOccupancy" })

  const flatRentValueFrom: number = useWatch({ control, name: "flatRentValueFrom" })
  const flatRentValueTo: number = useWatch({ control, name: "flatRentValueTo" })

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
  const rentType = useWatch({ control, name: "rentType" })
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

  const fieldValuesToWatch = [
    minOccupancy,
    maxOccupancy,
    sqFeetMin,
    sqFeetMax,
    floorMin,
    floorMax,
    bathroomMin,
    bathroomMax,
  ]

  const fieldToTriggerWatch = [
    "minOccupancy",
    "maxOccupancy",
    "sqFeetMin",
    "sqFeetMax",
    "floorMin",
    "floorMax",
    "bathroomMin",
    "bathroomMax",
  ]

  useWatchOnFormNumberFieldsChange(fieldValuesToWatch, fieldToTriggerWatch, trigger)

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
      unitTypes
        .filter((unitType) => UnitGroupTypeSort.includes(unitType.name))
        .map((unitType) => {
          return {
            id: unitType.id,
            label: t(`listings.unitGroup.typeOptions.${unitType.name}`),
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
        openWaitlist: defaultUnitGroup.openWaitlist ? YesNoEnum.yes : YesNoEnum.no,
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
        const selectedAmiChart = amiChartsOptions.find((chart) => chart.value === ami.amiChart?.id)

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
                  className={"font-semibold darker-link"}
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
                  className={"font-semibold darker-alert"}
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
      openWaitlist: data.openWaitlist === YesNoEnum.yes,
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
                  <legend className={`mb-5 ${styles["custom-label"]}`}>
                    {t("listings.unit.type")}
                  </legend>
                </Grid.Row>
                <Grid.Row columns={2}>
                  <Grid.Cell>
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
                      fieldLabelClassName={styles["label-option"]}
                    />
                  </Grid.Cell>
                </Grid.Row>
              </fieldset>
            </SectionWithGrid>
            <SectionWithGrid heading={t("listings.unit.details")}>
              <Grid.Row columns={3}>
                <Grid.Cell>
                  <Field
                    label={t("listings.unit.affordableGroupQuantity")}
                    id="totalCount"
                    name="totalCount"
                    register={register}
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
                </Grid.Cell>
              </Grid.Row>
              {isNonRegulated && (
                <>
                  <Grid.Row columns={3}>
                    <Grid.Cell>
                      <FieldGroup
                        name="rentType"
                        type="radio"
                        register={register}
                        groupLabel={t("listings.unitGroup.rentType")}
                        fields={[
                          {
                            label: t("listings.unitGroup.fixedRent"),
                            value: RentTypeEnum.fixedRent,
                            id: "rentTypeFixed",
                          },
                          {
                            label: t("listings.unitGroup.rentRange"),
                            value: RentTypeEnum.rentRange,
                            id: "rentTypeRange",
                          },
                        ]}
                      />
                    </Grid.Cell>
                  </Grid.Row>
                  {rentType === RentTypeEnum.fixedRent && (
                    <Grid.Row columns={3}>
                      <Grid.Cell>
                        <Field
                          id="monthlyRent"
                          name="monthlyRent"
                          label={t("listings.unit.monthlyRent")}
                          register={register}
                          placeholder="0.00"
                          type="number"
                          prepend="$"
                        />
                      </Grid.Cell>
                    </Grid.Row>
                  )}
                  {rentType === RentTypeEnum.rentRange && (
                    <Grid.Row columns={3}>
                      <Grid.Cell>
                        <Field
                          id="flatRentValueFrom"
                          name="flatRentValueFrom"
                          label={t("listings.unitGroup.flatRentValueFrom")}
                          register={register}
                          placeholder="0.00"
                          validation={{ max: flatRentValueTo }}
                          errorMessage={t("errors.minGreaterThanFlatRentValueTo")}
                          error={fieldHasError(errors?.flatRentValueFrom)}
                          type="number"
                          prepend="$"
                          onChange={() => {
                            void trigger("flatRentValueTo")
                            void trigger("flatRentValueFrom")
                          }}
                        />
                      </Grid.Cell>
                      <Grid.Cell>
                        <Field
                          id="flatRentValueTo"
                          name="flatRentValueTo"
                          label={t("listings.unitGroup.flatRentValueTo")}
                          register={register}
                          placeholder="0.00"
                          validation={{ min: flatRentValueFrom }}
                          errorMessage={t("errors.maxLessThanFlatRentValueFrom")}
                          error={fieldHasError(errors?.flatRentValueTo)}
                          type="number"
                          prepend="$"
                          onChange={() => {
                            void trigger("flatRentValueTo")
                            void trigger("flatRentValueFrom")
                          }}
                        />
                      </Grid.Cell>
                    </Grid.Row>
                  )}
                </>
              )}
              <Grid.Row columns={3}>
                <Grid.Cell>
                  <Select
                    controlClassName="control"
                    label={t("listings.unit.minOccupancy")}
                    id="minOccupancy"
                    name="minOccupancy"
                    register={register}
                    options={numberOptions(numberOccupancyOptions, 1)}
                    errorMessage={t("errors.minGreaterThanMaxOccupancyError")}
                    error={fieldHasError(errors?.minOccupancy)}
                    validation={{ max: maxOccupancy || numberOccupancyOptions }}
                  />
                </Grid.Cell>
                <Grid.Cell>
                  <Select
                    id="maxOccupancy"
                    name="maxOccupancy"
                    label={t("listings.unit.maxOccupancy")}
                    register={register}
                    controlClassName="control"
                    options={numberOptions(numberOccupancyOptions, 1)}
                    errorMessage={t("errors.maxLessThanMinOccupancyError")}
                    error={fieldHasError(errors?.maxOccupancy)}
                    validation={{ min: minOccupancy }}
                  />
                </Grid.Cell>
              </Grid.Row>
              {!isNonRegulated && (
                <>
                  <Grid.Row columns={3}>
                    <Grid.Cell>
                      <Field
                        label={t("listings.unit.minSquareFootage")}
                        id="sqFeetMin"
                        name="sqFeetMin"
                        register={register}
                        type="number"
                        errorMessage={t("errors.minGreaterThanMaxFootageError")}
                        error={fieldHasError(errors?.sqFeetMin)}
                        validation={{ max: sqFeetMax }}
                        onChange={() => {
                          void trigger("sqFeetMin")
                          void trigger("sqFeetMax")
                        }}
                      />
                    </Grid.Cell>
                    <Grid.Cell>
                      <Field
                        label={t("listings.unit.maxSquareFootage")}
                        id="sqFeetMax"
                        name="sqFeetMax"
                        register={register}
                        type="number"
                        errorMessage={t("errors.maxLessThanMinFootageError")}
                        error={fieldHasError(errors?.sqFeetMax)}
                        validation={{ min: sqFeetMin }}
                        onChange={() => {
                          void trigger("sqFeetMin")
                          void trigger("sqFeetMax")
                        }}
                      />
                    </Grid.Cell>
                  </Grid.Row>
                  <Grid.Row columns={3}>
                    <Grid.Cell>
                      <Select
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
                    </Grid.Cell>
                    <Grid.Cell>
                      <Select
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
                    </Grid.Cell>
                  </Grid.Row>
                </>
              )}
              <Grid.Row columns={3}>
                <Grid.Cell>
                  <Select
                    controlClassName="control"
                    label={t("listings.unit.minBathrooms")}
                    name="bathroomMin"
                    id="bathroomMin"
                    options={bathroomOptions}
                    register={register}
                    errorMessage={t("errors.minGreaterThanMaxBathroomsError")}
                    error={fieldHasError(errors.bathroomMin)}
                    validation={{ max: bathroomMax }}
                  />
                </Grid.Cell>
                <Grid.Cell>
                  <Select
                    controlClassName="control"
                    label={t("listings.unit.maxBathrooms")}
                    name="bathroomMax"
                    id="bathroomMax"
                    options={bathroomOptions}
                    register={register}
                    errorMessage={t("errors.maxLessThanMinBathroomsError")}
                    error={fieldHasError(errors.bathroomMax)}
                    validation={{ min: bathroomMin }}
                  />
                </Grid.Cell>
              </Grid.Row>
            </SectionWithGrid>
            <hr className="spacer-section-above spacer-section" />
            <SectionWithGrid heading={t("t.availability")}>
              <Grid.Row columns={3}>
                <Grid.Cell>
                  <Field
                    label={t("listings.unit.groupVacancies")}
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
                  />
                </Grid.Cell>
                {!isNonRegulated && (
                  <Grid.Cell>
                    <FieldGroup
                      name="openWaitlist"
                      type="radio"
                      fields={[
                        {
                          id: "waitlistStatusOpen",
                          dataTestId: "waitlistStatusOpen",
                          label: t("listings.listingStatus.active"),
                          value: YesNoEnum.yes,
                          defaultChecked: !defaultUnitGroup,
                        },
                        {
                          id: "waitlistStatusClosed",
                          dataTestId: "waitlistStatusClosed",
                          label: t("listings.listingStatus.closed"),
                          value: YesNoEnum.no,
                        },
                      ]}
                      register={register}
                      fieldClassName="m-0"
                      fieldGroupClassName="flex h-12 items-center"
                      error={errors?.openWaitlist !== undefined}
                      errorMessage={t("errors.requiredFieldError")}
                      dataTestId="openWaitListQuestion"
                      groupLabel={t("listings.unit.waitlistStatus")}
                      fieldLabelClassName={styles["label-option"]}
                    />
                  </Grid.Cell>
                )}
              </Grid.Row>
            </SectionWithGrid>
            {!isNonRegulated && (
              <>
                <hr className="spacer-section-above spacer-section" />
                <SectionWithGrid heading={t("listings.sections.eligibilityTitle")}>
                  <Grid.Row>
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
                  </Grid.Row>
                </SectionWithGrid>
              </>
            )}
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

        <Button
          type="button"
          onClick={() => onClose()}
          variant="text"
          size="sm"
          className={"font-semibold darker-alert"}
        >
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
