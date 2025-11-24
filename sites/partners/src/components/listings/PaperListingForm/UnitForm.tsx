import React, { useEffect, useState, useContext } from "react"
import { t, Field, Select, FieldGroup, Form, numberOptions } from "@bloom-housing/ui-components"
import { Button, Card, Drawer, Grid } from "@bloom-housing/ui-seeds"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { useWatch, useForm } from "react-hook-form"
import { TempUnit } from "../../../lib/listings/formTypes"
import {
  AmiChart,
  AmiChartItem,
  UnitAccessibilityPriorityType,
  UnitType,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import {
  useAmiChartList,
  useUnitPriorityList,
  useUnitTypeList,
  useWatchOnFormNumberFieldsChange,
} from "../../../lib/hooks"
import { arrayToFormOptions, getRentType, fieldHasError } from "../../../lib/helpers"
import SectionWithGrid from "../../shared/SectionWithGrid"
import styles from "./ListingForm.module.scss"

type UnitFormProps = {
  onSubmit: (unit: TempUnit) => void
  onClose: (openNextUnit: boolean, openCurrentUnit: boolean, defaultUnit: TempUnit) => void
  defaultUnit: TempUnit | undefined
  nextId: number
  draft: boolean
  jurisdiction: string
}

const UnitForm = ({
  onSubmit,
  onClose,
  defaultUnit,
  nextId,
  draft,
  jurisdiction,
}: UnitFormProps) => {
  const { amiChartsService } = useContext(AuthContext)

  const [amiChartsOptions, setAmiChartsOptions] = useState([])
  const [unitPrioritiesOptions, setUnitPrioritiesOptions] = useState([])
  const [unitTypesOptions, setUnitTypesOptions] = useState([])
  const [isAmiPercentageDirty, setIsAmiPercentageDirty] = useState(false)
  const [loading, setLoading] = useState(true)
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
  /**
   * fetch form options
   */
  const { data: amiCharts = [] } = useAmiChartList(jurisdiction)
  const { data: unitPriorities = [] } = useUnitPriorityList()
  const { data: unitTypes = [] } = useUnitTypeList()

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
      if (defaultUnit.amiChart) {
        const chartData = await fetchAmiChart(defaultUnit.amiChart.id)
        resetAmiTableValues(chartData, defaultUnit.amiPercentage)
      }
      Object.keys(defaultUnit).forEach((key) => {
        setValue(key, defaultUnit[key])
      })
      if (defaultUnit.unitAmiChartOverrides) {
        defaultUnit.unitAmiChartOverrides.items.forEach((override) => {
          setValue(`maxIncomeHouseholdSize${override.householdSize}`, override.income)
        })
      }
      setValue("amiPercentage", parseInt(defaultUnit["amiPercentage"]))
      setValue("rentType", getRentType(defaultUnit))
    }
    setLoading(false)
  }

  useEffect(() => {
    void resetDefaultValues()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchAmiChart = async (defaultChartID?: string) => {
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
    if (defaultUnit && !amiPercentage) {
      setValue("amiPercentage", defaultUnit.amiPercentage)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amiChartPercentageOptions])

  type FormSubmitAction = "saveNew" | "saveExit" | "save"

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatFormData = (data: { [x: string]: any }) => {
    if (data.amiChart?.id) {
      const chart = amiCharts.find((chart) => chart.id === data.amiChart.id)
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

    if (data.unitAccessibilityPriorityTypes?.id) {
      const priority = unitPriorities.find(
        (priority) => priority.id === data.unitAccessibilityPriorityTypes.id
      )
      data.unitAccessibilityPriorityTypes = priority
    } else {
      delete data.unitAccessibilityPriorityTypes
    }

    if (data.unitTypes?.id) {
      const type = unitTypes.find((type) => type.id === data.unitTypes.id)
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
    setLoading(true)
    const data = getValues()
    const validation = await trigger()
    if (!validation) {
      setLoading(false)
      return
    }

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
    if (defaultUnit && unitTypesOptions) {
      setValue("unitTypes.id", defaultUnit.unitTypes?.id)
    }
  }, [defaultUnit, unitTypesOptions, setValue])

  // when rent type is updated we set the rent/income data to defaultUnit data for that value
  // e.g. rent is fixed and swithced to percentage, then switched back we readd the old fixed data
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
  }, [unitPrioritiesOptions, unitPriorities, defaultUnit, setValue])

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
                      label={t("listings.unit.type")}
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
                      placeholder={t("listings.unit.numBathrooms")}
                      register={register}
                      controlClassName="control"
                      options={[
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
                      placeholder={t("listings.unit.floor")}
                      register={register}
                      controlClassName="control"
                      options={numberOptions(10)}
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
                      placeholder={t("listings.unit.minOccupancy")}
                      register={register}
                      controlClassName="control"
                      options={numberOptions(numberOccupancyOptions)}
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
                      placeholder={t("listings.unit.maxOccupancy")}
                      register={register}
                      controlClassName="control"
                      options={numberOptions(numberOccupancyOptions)}
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
                      label={t("listings.unit.amiChart")}
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
                      label={t("listings.unit.amiPercentage")}
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
                      disabled={!amiChartID}
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
                      id="unitAccessibilityPriorityTypes.id"
                      name="unitAccessibilityPriorityTypes.id"
                      label={t("listings.unit.accessibilityPriorityType")}
                      placeholder={t("listings.unit.accessibilityPriorityType")}
                      register={register}
                      controlClassName="control"
                      options={unitPrioritiesOptions}
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
