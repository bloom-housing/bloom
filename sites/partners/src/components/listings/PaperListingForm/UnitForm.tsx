import React, { useEffect, useRef, useState, useContext, useMemo } from "react"
import { t, Field, Select, FieldGroup, Form, numberOptions } from "@bloom-housing/ui-components"
import { Button, Card, Drawer, Grid, LoadingState } from "@bloom-housing/ui-seeds"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { useWatch, useForm } from "react-hook-form"
import { TempUnit } from "../../../lib/listings/formTypes"
import {
  AmiChart,
  AmiChartItem,
  Jurisdiction,
  UnitType,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { useWatchOnFormNumberFieldsChange } from "../../../lib/hooks"
import { arrayToFormOptions, getRentType, fieldHasError, addAsterisk } from "../../../lib/helpers"
import SectionWithGrid from "../../shared/SectionWithGrid"
import styles from "./ListingForm.module.scss"

type UnitFormProps = {
  amiCharts: AmiChart[] | undefined
  amiChartsLoading: boolean
  defaultUnit: TempUnit | undefined
  draft: boolean
  jurisdictionData: Jurisdiction | undefined
  jurisdictionLoading: boolean
  nextId: number
  onClose: (openNextUnit: boolean, openCurrentUnit: boolean, defaultUnit: TempUnit) => void
  onSubmit: (unit: TempUnit) => void
  unitTypes: UnitType[] | undefined
  unitTypesLoading: boolean
}

const UnitForm = ({
  amiCharts,
  amiChartsLoading,
  defaultUnit,
  draft,
  jurisdictionData,
  jurisdictionLoading,
  nextId,
  onClose,
  onSubmit,
  unitTypes,
  unitTypesLoading,
}: UnitFormProps) => {
  const { amiChartsService } = useContext(AuthContext)

  const initialLoadComplete = useRef(false)
  const [isAmiPercentageDirty, setIsAmiPercentageDirty] = useState(false)
  const [loading, setLoading] = useState(true)
  const [fetchingAmiChart, setFetchingAmiChart] = useState(false)
  const [currentAmiChart, setCurrentAmiChart] = useState(null)
  const [amiChartPercentageOptions, setAmiChartPercentageOptions] = useState([])

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const {
    register,
    formState: { errors },
    trigger,
    getValues,
    setValue,
    control,
    reset,
    clearErrors,
  } = useForm({
    mode: "onChange",
    shouldFocusError: false,
  })
  const hasInitializedFormData =
    amiCharts !== undefined && unitTypes !== undefined && jurisdictionData !== undefined

  const amiChartsOptions = useMemo(() => {
    if (!amiCharts) return []
    return arrayToFormOptions<AmiChart>(amiCharts, "name", "id")
  }, [amiCharts])

  const unitTypesOptions = useMemo(() => {
    if (!unitTypes) return []
    return arrayToFormOptions<UnitType>(unitTypes, "name", "id", "listings.unit.typeOptions")
  }, [unitTypes])

  const unitPrioritiesOptions = useMemo(() => {
    const visibleTypes = jurisdictionData?.visibleAccessibilityPriorityTypes || []
    return visibleTypes.map((type) => ({
      value: type,
      id: type,
      label: t(`listings.unit.accessibilityType.${type}`),
    }))
  }, [jurisdictionData?.visibleAccessibilityPriorityTypes])

  const numberOccupancyOptions = 11

  const rentType: string = useWatch({
    control,
    name: "rentType",
  })
  const amiPercentage: string = useWatch({
    control,
    name: "amiPercentage",
  })
  const amiChartID: string = useWatch({
    control,
    name: "amiChart.id",
  })

  const minOccupancy: number = useWatch({
    control,
    name: "minOccupancy",
  })

  const maxOccupancy: number = useWatch({
    control,
    name: "maxOccupancy",
  })

  const fieldsValuesToWatch = [minOccupancy, maxOccupancy]

  const fieldsToTriggerWatch = ["minOccupancy", "maxOccupancy"]

  useWatchOnFormNumberFieldsChange(fieldsValuesToWatch, fieldsToTriggerWatch, trigger)

  const maxAmiHouseholdSize = 8

  const getAmiChartTableData = () => {
    return [...Array(maxAmiHouseholdSize)].map((_, index) => {
      const fieldName = `maxIncomeHouseholdSize${index + 1}`
      const incomeCell = (
        <Field
          key={fieldName}
          id={fieldName}
          name={fieldName}
          label={t("t.minimumIncome")}
          register={register}
          type="number"
          prepend="$"
          readerOnly
          className={errors[fieldName] ? "error" : ""}
          error={errors[fieldName]}
          errorMessage={t("errors.requiredFieldError")}
          validation={{ required: !!amiChartID }}
          inputProps={{
            onChange: () => {
              clearErrors(fieldName)
            },
          }}
        />
      )
      return (
        <tr key={index}>
          <td className="pl-4 py-2">{index + 1}</td>
          <td className="py-2">{incomeCell}</td>
        </tr>
      )
    })
  }

  const resetDefaultValues = async () => {
    if (defaultUnit) {
      const values: Record<string, unknown> = { ...defaultUnit }

      if (defaultUnit.amiChart) {
        const chartData = await fetchAmiChart(defaultUnit.amiChart.id)
        if (chartData) {
          const percentage = defaultUnit.amiPercentage
          const newPercentagesByHouseHold = chartData.reduce((acc, item: AmiChartItem) => {
            if (item.percentOfAmi === parseInt(percentage)) {
              acc[item.householdSize] = item
            }
            return acc
          }, {})
          for (let i = 1; i < 9; i++) {
            values[`maxIncomeHouseholdSize${i}`] = newPercentagesByHouseHold[i]
              ? newPercentagesByHouseHold[i].income.toString()
              : ""
          }
        }
        if (defaultUnit.unitAmiChartOverrides) {
          defaultUnit.unitAmiChartOverrides.items.forEach((override) => {
            values[`maxIncomeHouseholdSize${override.householdSize}`] = override.income
          })
        }
      }

      values.amiPercentage = parseInt(defaultUnit["amiPercentage"])
      values.rentType = getRentType(defaultUnit)

      reset(values)
    } else {
      reset({})
    }
    initialLoadComplete.current = true
    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)
    void resetDefaultValues()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultUnit])

  const fetchAmiChart = async (defaultChartID?: string) => {
    setFetchingAmiChart(true)
    try {
      const thisAmiChart = await amiChartsService.retrieve({
        amiChartId: defaultChartID ?? amiChartID,
      })
      const amiChartData = thisAmiChart.items
      setCurrentAmiChart(amiChartData)
      const uniquePercentages = Array.from(
        new Set(amiChartData.map((item: AmiChartItem) => item.percentOfAmi))
      ).sort(function (a: number, b: number) {
        return a - b
      })
      setAmiChartPercentageOptions(
        uniquePercentages.map((percentage) => {
          return {
            label: percentage.toString(),
            value: percentage,
          }
        })
      )
      return amiChartData
    } catch (e) {
      console.error(e)
    } finally {
      setFetchingAmiChart(false)
    }
  }

  const resetAmiTableValues = (defaultAmiChart?: AmiChartItem[], defaultAmiPercentage?: string) => {
    const chart = defaultAmiChart ?? currentAmiChart
    const percentage = defaultAmiPercentage ?? amiPercentage
    const newPercentagesByHouseHold = chart.reduce((acc, item: AmiChartItem) => {
      if (item.percentOfAmi === parseInt(percentage)) {
        acc[item.householdSize] = item
      }
      return acc
    }, {})

    for (let i = 1; i < 9; i++) {
      setValue(
        `maxIncomeHouseholdSize${i}`,
        newPercentagesByHouseHold[i] ? newPercentagesByHouseHold[i].income.toString() : ""
      )
    }
  }

  useEffect(() => {
    ;[...Array(maxAmiHouseholdSize)].forEach((_, index) => {
      clearErrors(`maxIncomeHouseholdSize${index + 1}`)
    })
    if (
      amiPercentage &&
      !loading &&
      amiChartsOptions &&
      unitPrioritiesOptions &&
      unitTypesOptions &&
      isAmiPercentageDirty
    ) {
      resetAmiTableValues()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amiPercentage, amiChartPercentageOptions, isAmiPercentageDirty])

  useEffect(() => {
    if (!initialLoadComplete.current && defaultUnit && !amiPercentage) {
      setValue("amiPercentage", defaultUnit.amiPercentage)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amiChartPercentageOptions])

  type FormSubmitAction = "saveNew" | "saveExit" | "save"

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatFormData = (data: { [x: string]: any }) => {
    if (data.amiChart?.id) {
      const chart = amiCharts?.find((chart) => chart.id === data.amiChart.id)
      data.amiChart = chart
    } else {
      delete data.amiChart
    }

    if (data.rentType === "fixed") {
      delete data.monthlyRentAsPercentOfIncome
    } else if (data.rentType === "percentage") {
      data.monthlyIncomeMin = "0"
      delete data.monthlyRent
    }

    if (!data.accessibilityPriorityType) {
      delete data.accessibilityPriorityType
    }

    if (data.unitTypes?.id) {
      const type = unitTypes?.find((type) => type.id === data.unitTypes.id)
      data.unitTypes = type
    } else {
      delete data.unitTypes
    }

    if (currentAmiChart) {
      // Only keep overrides so we're not duplicating existing ami data
      ;[...Array(maxAmiHouseholdSize)].forEach((_, index) => {
        const existingChartValue = currentAmiChart.filter(
          (item: AmiChartItem) =>
            item.householdSize === index + 1 && item.percentOfAmi === parseInt(amiPercentage)
        )[0]

        if (
          data[`maxIncomeHouseholdSize${index + 1}`] &&
          existingChartValue &&
          parseInt(data[`maxIncomeHouseholdSize${index + 1}`]) === existingChartValue.income
        ) {
          delete data[`maxIncomeHouseholdSize${index + 1}`]
        }
      })
    }

    const formData = {
      createdAt: undefined,
      updatedAt: undefined,
      id: null,
      ...data,
    }

    return formData
  }

  const copyAndNew = () => {
    const data = getValues()
    const formData = formatFormData(data)
    onClose(true, false, formData)
    void resetDefaultValues()
  }

  async function onFormSubmit(action?: FormSubmitAction) {
    const data = getValues()
    const validation = await trigger()
    if (!validation) {
      return
    }

    setLoading(true)
    const formData = formatFormData(data)

    // If we're looking at a draft unit in the drawer
    // Save --> creates a new unit, drawer stays open on that unit
    // Save and New --> creates a new unit, opens a draft empty drawer
    // Save & Exit --> creates a new unit, closes the drawer
    // If we're looking at a saved unit
    // Make a Copy --> does not create a new unit, opens a draft drawer with same data
    // Save & New --> does not create a new unit, submits changes with existing ID, opens a draft empty drawer
    // Save & Exit --> does not create a new unit, submits changes with existing ID, closes the drawer

    if (action === "saveNew") {
      onSubmit({
        ...formData,
        tempId: draft ? nextId : defaultUnit.tempId,
      })
      onClose(true, false, null)
      reset()
      setLoading(false)
    }
    if (action === "saveExit") {
      onSubmit({
        ...formData,
        tempId: draft ? nextId : defaultUnit.tempId,
      })
      onClose(false, false, null)
    }
    if (action === "save") {
      onSubmit({
        ...formData,
        tempId: nextId,
      })
      onClose(false, true, {
        ...formData,
        tempId: nextId,
      })
    }
  }

  const rentTypeOptions = [
    {
      id: "fixed",
      label: t("listings.unit.fixed"),
      value: "fixed",
    },
    {
      id: "percentage",
      label: t("listings.unit.percentage"),
      value: "percentage",
    },
  ]

  // sets the unit type to be the value from default
  // after the unitType options are set
  useEffect(() => {
    if (defaultUnit && unitTypesOptions.length) {
      setValue("unitTypes.id", defaultUnit.unitTypes?.id)
    }
  }, [defaultUnit, unitTypesOptions, setValue])

  // when rent type is updated we set the rent/income data to defaultUnit data for that value
  // e.g. rent is fixed and switched to percentage, then switched back we readd the old fixed data
  useEffect(() => {
    if (defaultUnit) {
      if (rentType === "fixed") {
        setValue("monthlyIncomeMin", defaultUnit.monthlyIncomeMin)
        setValue("monthlyRent", defaultUnit.monthlyRent)
      } else {
        setValue("monthlyRentAsPercentOfIncome", defaultUnit.monthlyRentAsPercentOfIncome)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rentType])

  if (
    !hasInitializedFormData ||
    loading ||
    amiChartsLoading ||
    unitTypesLoading ||
    jurisdictionLoading
  ) {
    return (
      <LoadingState loading={true}>
        <></>
      </LoadingState>
    )
  }

  return (
    <>
      <Drawer.Content>
        <Form onSubmit={() => false}>
          <Card>
            <Card.Section>
              <SectionWithGrid heading={t("listings.unit.details")}>
                <Grid.Row columns={4}>
                  <Grid.Cell>
                    <Field
                      id="number"
                      name="number"
                      label={t("listings.unit.unitNumber")}
                      register={register}
                      type="text"
                    />
                  </Grid.Cell>
                  <Grid.Cell>
                    <Select
                      id="unitTypes.id"
                      name="unitTypes.id"
                      label={addAsterisk(t("listings.unit.type"))}
                      placeholder={t("listings.unit.type")}
                      register={register}
                      controlClassName="control"
                      options={unitTypesOptions}
                      error={fieldHasError(errors?.unitTypes)}
                      errorMessage={t("errors.requiredFieldError")}
                      validation={{ required: true }}
                      inputProps={{
                        onChange: () => {
                          clearErrors("unitTypes.id")
                        },
                      }}
                    />
                  </Grid.Cell>
                  <Grid.Cell>
                    <Select
                      id="numBathrooms"
                      name="numBathrooms"
                      label={t("listings.unit.numBathrooms")}
                      register={register}
                      controlClassName="control"
                      options={[
                        { value: "", label: t("t.selectOne") },
                        { label: t("listings.unit.sharedBathroom"), value: "0" },
                        ...numberOptions(5),
                      ]}
                    />
                  </Grid.Cell>
                  <Grid.Cell>
                    <Select
                      id="floor"
                      name="floor"
                      label={t("listings.unit.floor")}
                      register={register}
                      controlClassName="control"
                      options={[{ value: "", label: t("t.selectOne") }, ...numberOptions(10)]}
                    />
                  </Grid.Cell>
                  <Grid.Cell>
                    <Field
                      id="sqFeet"
                      name="sqFeet"
                      label={t("listings.unit.squareFootage")}
                      register={register}
                      type="number"
                    />
                  </Grid.Cell>

                  <Grid.Cell>
                    <Select
                      id="minOccupancy"
                      name="minOccupancy"
                      label={t("listings.unit.minOccupancy")}
                      register={register}
                      controlClassName="control"
                      options={[
                        { value: "", label: t("t.selectOne") },
                        ...numberOptions(numberOccupancyOptions),
                      ]}
                      error={fieldHasError(errors?.minOccupancy)}
                      errorMessage={t("errors.minGreaterThanMaxOccupancyError")}
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
                      options={[
                        { value: "", label: t("t.selectOne") },
                        ...numberOptions(numberOccupancyOptions),
                      ]}
                      error={fieldHasError(errors?.maxOccupancy)}
                      errorMessage={t("errors.maxLessThanMinOccupancyError")}
                      validation={{ min: minOccupancy }}
                    />
                  </Grid.Cell>
                </Grid.Row>
              </SectionWithGrid>

              <hr className="spacer-section-above spacer-section" />
              <SectionWithGrid heading={t("listings.unit.eligibility")}>
                <Grid.Row columns={4}>
                  <Grid.Cell>
                    <Select
                      id="amiChart.id"
                      name="amiChart.id"
                      label={addAsterisk(t("listings.unit.amiChart"))}
                      placeholder={t("listings.unit.amiChart")}
                      register={register}
                      controlClassName="control"
                      options={amiChartsOptions}
                      error={fieldHasError(errors?.amiChart?.id)}
                      errorMessage={t("errors.requiredFieldError")}
                      validation={{ required: true }}
                      inputProps={{
                        onChange: (value) => {
                          setValue("amiPercentage", undefined)
                          clearErrors("amiPercentage")
                          clearErrors("amiChart.id")
                          ;[...Array(maxAmiHouseholdSize)].forEach((_, index) => {
                            setValue(`maxIncomeHouseholdSize${index + 1}`, undefined)
                          })
                          setAmiChartPercentageOptions([])
                          setCurrentAmiChart(null)
                          if (value?.target?.value && !loading && amiChartsOptions) {
                            void fetchAmiChart(value.target?.value)
                            setIsAmiPercentageDirty(true)
                          }
                        },
                      }}
                    />
                  </Grid.Cell>
                  <Grid.Cell>
                    <Select
                      id={"amiPercentage"}
                      name="amiPercentage"
                      label={addAsterisk(t("listings.unit.amiPercentage"))}
                      placeholder={t("listings.unit.amiPercentage")}
                      register={register}
                      controlClassName="control"
                      options={amiChartPercentageOptions}
                      inputProps={{
                        onChange: () => {
                          setIsAmiPercentageDirty(true)
                          clearErrors("amiPercentage")
                        },
                      }}
                      error={fieldHasError(errors?.amiPercentage)}
                      errorMessage={t("errors.requiredFieldError")}
                      validation={{ required: !!amiChartID }}
                      disabled={!amiChartID || fetchingAmiChart}
                    />
                  </Grid.Cell>
                </Grid.Row>
              </SectionWithGrid>

              <section className="mb-6 sm:w-1/2 sm:pr-3">
                <table className={"w-full text-xs td-plain th-plain"}>
                  <thead>
                    <tr>
                      <th>{t("listings.householdSize")}</th>
                      <th>{t("listings.maxAnnualIncome")}</th>
                    </tr>
                  </thead>
                  <tbody>{getAmiChartTableData()}</tbody>
                </table>
              </section>

              <Grid>
                <Grid.Row columns={4}>
                  <Grid.Cell>
                    <FieldGroup
                      name="rentType"
                      type="radio"
                      register={register}
                      fields={rentTypeOptions}
                      fieldClassName="m-0"
                      fieldGroupClassName="flex h-12 items-center"
                      groupLabel={t("listings.unit.rentType")}
                      fieldLabelClassName={styles["label-option"]}
                    />
                  </Grid.Cell>

                  {rentType === "fixed" && (
                    <>
                      <Grid.Cell>
                        <Field
                          id="monthlyIncomeMin"
                          name="monthlyIncomeMin"
                          label={t("t.monthlyMinimumIncome")}
                          placeholder="0.00"
                          register={register}
                          type="number"
                          prepend="$"
                        />
                      </Grid.Cell>

                      <Grid.Cell>
                        <Field
                          id="monthlyRent"
                          name="monthlyRent"
                          label={t("listings.unit.monthlyRent")}
                          placeholder="0.00"
                          register={register}
                          type="number"
                          prepend="$"
                        />
                      </Grid.Cell>
                    </>
                  )}
                  {rentType === "percentage" && (
                    <Grid.Cell>
                      <Field
                        id="monthlyRentAsPercentOfIncome"
                        name="monthlyRentAsPercentOfIncome"
                        label={t("listings.unit.%incomeRent")}
                        placeholder={t("listings.unit.percentage")}
                        register={register}
                        type="number"
                      />
                    </Grid.Cell>
                  )}
                </Grid.Row>
              </Grid>

              <hr className="spacer-section-above spacer-section" />
              <SectionWithGrid heading={t("t.accessibility")}>
                <Grid.Row columns={4}>
                  <Grid.Cell>
                    <Select
                      id="accessibilityPriorityType"
                      name="accessibilityPriorityType"
                      label={t("listings.unit.accessibilityPriorityType")}
                      register={register}
                      controlClassName="control"
                      options={[{ value: "", label: t("t.selectOne") }, ...unitPrioritiesOptions]}
                    />
                  </Grid.Cell>
                </Grid.Row>
              </SectionWithGrid>
            </Card.Section>
          </Card>
        </Form>
      </Drawer.Content>
      <Drawer.Footer>
        {!draft ? (
          <Button type="button" onClick={() => copyAndNew()} variant="secondary" size="sm">
            {t("t.copy")}
          </Button>
        ) : (
          <Button type="button" onClick={() => onFormSubmit("save")} variant="secondary" size="sm">
            {t("t.save")}
          </Button>
        )}
        <Button type="button" onClick={() => onFormSubmit("saveNew")} variant="secondary" size="sm">
          {t("t.saveNew")}
        </Button>

        <Button
          type="button"
          onClick={() => onFormSubmit("saveExit")}
          variant="primary"
          size="sm"
          id={"unitFormSaveAndExitButton"}
        >
          {t("t.saveExit")}
        </Button>

        <Button
          type="button"
          onClick={() => onClose(false, false, null)}
          variant="text"
          size="sm"
          className={"font-semibold darker-alert"}
        >
          {t("t.cancel")}
        </Button>
      </Drawer.Footer>
    </>
  )
}

export default UnitForm
