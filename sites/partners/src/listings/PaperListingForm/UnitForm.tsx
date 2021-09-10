import React, { useEffect, useState, useContext, useCallback } from "react"
import {
  t,
  GridSection,
  ViewItem,
  GridCell,
  Field,
  Select,
  AppearanceStyleType,
  AppearanceBorderType,
  FieldGroup,
  Button,
  Form,
  numberOptions,
  MinimalTable,
  AuthContext,
} from "@bloom-housing/ui-components"
import { useForm, useWatch } from "react-hook-form"
import { TempUnit } from "."
import {
  AmiChart,
  UnitAccessibilityPriorityType,
  UnitStatus,
  UnitType,
} from "@bloom-housing/backend-core/types"
import { useAmiChartList, useUnitPriorityList, useUnitTypeList } from "../../../lib/hooks"
import { arrayToFormOptions, getRentType } from "../../../lib/helpers"

type UnitFormProps = {
  onSubmit: (unit: any) => void
  onClose: () => void
  defaultUnit: TempUnit | undefined
  tempId: number
}

const UnitForm = ({ onSubmit, onClose, tempId, defaultUnit }: UnitFormProps) => {
  const { amiChartsService } = useContext(AuthContext)

  // const [tempId, setTempId] = useState<number | null>(null)
  const [options, setOptions] = useState({
    amiCharts: [],
    unitPriorities: [],
    unitTypes: [],
  })
  const [amiOverrides, setAmiOverrides] = useState({})

  const unitStatusOptions = Object.values(UnitStatus).map((status) => ({
    label: t(`listings.unit.statusOptions.${status}`),
    value: status,
  }))

  /**
   * fetch form options
   */
  const { data: amiCharts = [] } = useAmiChartList()
  const { data: unitPriorities = [] } = useUnitPriorityList()
  const { data: unitTypes = [] } = useUnitTypeList()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch, errors, trigger, getValues, setValue, control } = useForm()

  const rentType = watch("rentType")

  const amiPercentage: string = useWatch({
    control,
    name: "amiPercentage",
  })

  const amiChartID: string = useWatch({
    control,
    name: "amiChart.id",
  })

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
          inputProps={{
            onChange: (e) => {
              const { id, value } = e.target
              const overrides = amiOverrides
              overrides[id] = value
              setAmiOverrides(overrides)
            },
          }}
        />
      )
      return (
        <tr>
          <td>{index + 1}</td>
          <td>{incomeCell}</td>
        </tr>
      )
    })
  }

  useEffect(() => {
    // On initial load, populate with default values if we have any
    if (defaultUnit) {
      Object.keys(defaultUnit).forEach((key) => {
        setValue(key, defaultUnit[key])
      })
    }
    setValue("status", "available")
  }, [])

  useEffect(() => {
    console.log("use effect 4")
    const fetchAmiChart = async () => {
      try {
        const thisAmiChart = await amiChartsService.retrieve({
          amiChartId: amiChartID,
        })
        const amiChartData = thisAmiChart.items
          .filter((item) => item.percentOfAmi === parseInt(amiPercentage))
          .sort(function (a, b) {
            return a.householdSize - b.householdSize
          })
        console.log("fetched ami chart", amiChartData)
        amiChartData.forEach((amiValue, index) => {
          setValue(`maxIncomeHouseholdSize${index + 1}`, amiValue.income.toString())
        })
      } catch (e) {
        console.error(e)
      }
    }
    if (amiChartID && amiPercentage) {
      void fetchAmiChart()
    }
  }, [amiChartID, amiPercentage])

  const amiChartTableHeaders = {
    householdSize: "listings.householdSize",
    maxIncome: "listings.maxAnnualIncome",
  }

  async function onFormSubmit(action?: string) {
    const data = getValues()
    const validation = await trigger()
    if (!validation) {
      console.log({ data })
      ;[...Array(maxAmiHouseholdSize)].forEach((index) => {
        const fieldName = `maxIncomeHouseholdSize${index + 1}`
        setValue(fieldName, data[fieldName])
      })
      return
    }

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

    if (data.priorityType?.id) {
      const priority = unitPriorities.find((priority) => priority.id === data.priorityType.id)
      data.priorityType = priority
    } else {
      delete data.priorityType
    }

    if (data.unitType?.id) {
      const type = unitTypes.find((type) => type.id === data.unitType.id)
      data.unitType = type
    } else {
      delete data.unitType
    }

    const formData = {
      createdAt: undefined,
      updatedAt: undefined,
      ...data,
    }

    onSubmit({ ...formData, tempId })
    onClose()
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

  useEffect(() => {
    console.log("use effect 5")
    // hm this seems to be running a lot
    setOptions({
      amiCharts: arrayToFormOptions<AmiChart>(amiCharts, "name", "id"),
      unitPriorities: arrayToFormOptions<UnitAccessibilityPriorityType>(
        unitPriorities,
        "name",
        "id"
      ),
      unitTypes: arrayToFormOptions<UnitType>(unitTypes, "name", "id"),
    })
  }, [amiCharts, unitPriorities, unitTypes])

  return (
    <Form onSubmit={() => false}>
      <div className="border rounded-md p-8 bg-white">
        <GridSection title={t("listings.unit.details")} columns={4}>
          <GridCell>
            <ViewItem label={t("listings.unit.unitNumber")}>
              <Field
                id="number"
                name="number"
                label={t("listings.unit.unitNumber")}
                placeholder={t("listings.unit.unitNumber")}
                register={register}
                type="number"
                readerOnly
              />
            </ViewItem>
          </GridCell>
          <GridCell>
            <ViewItem label={t("listings.unit.type")}>
              <Select
                id="unitType.id"
                name="unitType.id"
                label={t("listings.unit.type")}
                placeholder={t("listings.unit.type")}
                labelClassName="sr-only"
                register={register}
                controlClassName="control"
                options={options.unitTypes}
                error={errors?.unitType !== undefined}
                errorMessage={t("errors.requiredFieldError")}
                validation={{ required: true }}
              />
            </ViewItem>
          </GridCell>
          <GridCell>
            <ViewItem label={t("listings.unit.numBathrooms")}>
              <Select
                id="numBathrooms"
                name="numBathrooms"
                label={t("listings.unit.numBathrooms")}
                placeholder={t("listings.unit.numBathrooms")}
                labelClassName="sr-only"
                register={register}
                controlClassName="control"
                options={numberOptions(5)}
              />
            </ViewItem>
          </GridCell>
          <GridCell>
            <ViewItem label={t("listings.unit.floor")}>
              <Select
                id="floor"
                name="floor"
                label={t("listings.unit.floor")}
                placeholder={t("listings.unit.floor")}
                labelClassName="sr-only"
                register={register}
                controlClassName="control"
                options={numberOptions(10)}
              />
            </ViewItem>
          </GridCell>
          <GridCell>
            <ViewItem label={t("listings.unit.squareFootage")}>
              <Field
                id="sqFeet"
                name="sqFeet"
                label={t("listings.unit.squareFootage")}
                placeholder={t("listings.unit.squareFootage")}
                register={register}
                readerOnly
                type="number"
              />
            </ViewItem>
          </GridCell>
          <GridCell>
            <ViewItem label={t("listings.unit.unitStatus")}>
              <Select
                id="status"
                name="status"
                label={t("listings.unit.unitStatus")}
                placeholder={t("listings.unit.unitStatus")}
                labelClassName="sr-only"
                register={register}
                controlClassName="control"
                options={unitStatusOptions}
                disabled
              />
            </ViewItem>
          </GridCell>
          <GridCell>
            <ViewItem label={t("listings.unit.minOccupancy")}>
              <Select
                id="minOccupancy"
                name="minOccupancy"
                label={t("listings.unit.minOccupancy")}
                placeholder={t("listings.unit.minOccupancy")}
                labelClassName="sr-only"
                register={register}
                controlClassName="control"
                options={numberOptions(10)}
              />
            </ViewItem>
          </GridCell>
          <GridCell>
            <ViewItem label={t("listings.unit.maxOccupancy")}>
              <Select
                id="maxOccupancy"
                name="maxOccupancy"
                label={t("listings.unit.maxOccupancy")}
                placeholder={t("listings.unit.maxOccupancy")}
                labelClassName="sr-only"
                register={register}
                controlClassName="control"
                options={numberOptions(10)}
              />
            </ViewItem>
          </GridCell>
        </GridSection>
        <GridSection title={t("listings.unit.eligibility")} columns={4} separator>
          <GridCell>
            <ViewItem label={t("listings.unit.amiChart")}>
              <Select
                id="amiChart.id"
                name="amiChart.id"
                label={t("listings.unit.amiChart")}
                placeholder={t("listings.unit.amiChart")}
                labelClassName="sr-only"
                register={register}
                controlClassName="control"
                options={options.amiCharts}
              />
            </ViewItem>
          </GridCell>
          <GridCell>
            <ViewItem label={t("listings.unit.amiPercentage")}>
              <Field
                id="amiPercentage"
                name="amiPercentage"
                label={t("listings.unit.amiPercentage")}
                placeholder={t("listings.unit.amiPercentage")}
                register={register}
                type="number"
                readerOnly
              />
            </ViewItem>
          </GridCell>
        </GridSection>
        <GridSection columns={2} className="pt-6">
          <GridCell>
            <table>
              <tr>
                <th>{t("listings.householdSize")}</th>
                <th>{t("listings.maxAnnualIncome")}</th>
              </tr>
              {getAmiChartTableData()}
            </table>
            {/* <MinimalTable headers={amiChartTableHeaders} data={getAmiChartTableData()} /> */}
          </GridCell>
        </GridSection>
        <GridSection columns={4} className="pt-6">
          <GridCell>
            <ViewItem label={t("listings.unit.rentType")}>
              <FieldGroup
                name="rentType"
                type="radio"
                register={register}
                fields={rentTypeOptions}
                fieldClassName="m-0"
                fieldGroupClassName="flex h-12 items-center"
              />
            </ViewItem>
          </GridCell>
          {rentType === "fixed" && (
            <>
              <GridCell>
                <ViewItem label={t("t.minimumIncome")}>
                  <Field
                    id="monthlyIncomeMin"
                    name="monthlyIncomeMin"
                    label={t("t.minimumIncome")}
                    placeholder="0.00"
                    register={register}
                    type="number"
                    prepend="$"
                    readerOnly
                  />
                </ViewItem>
              </GridCell>
              <GridCell>
                <ViewItem label={t("listings.unit.monthlyRent")}>
                  <Field
                    id="monthlyRent"
                    name="monthlyRent"
                    label={t("listings.unit.monthlyRent")}
                    placeholder="0.00"
                    register={register}
                    type="number"
                    prepend="$"
                    readerOnly
                  />
                </ViewItem>
              </GridCell>
            </>
          )}
          {rentType === "percentage" && (
            <>
              <GridCell>
                <ViewItem label={t("listings.unit.percentage")}>
                  <Field
                    id="monthlyRentAsPercentOfIncome"
                    name="monthlyRentAsPercentOfIncome"
                    label={t("listings.unit.%incomeRent")}
                    placeholder={t("listings.unit.percentage")}
                    register={register}
                    type="number"
                    readerOnly
                  />
                </ViewItem>
              </GridCell>
            </>
          )}
        </GridSection>
        <GridSection title={t("t.accessibility")} columns={4} separator>
          <GridCell>
            <ViewItem label={t("listings.unit.accessibilityPriorityType")}>
              <Select
                id="priorityType.id"
                name="priorityType.id"
                label={t("listings.unit.accessibilityPriorityType")}
                placeholder={t("listings.unit.accessibilityPriorityType")}
                labelClassName="sr-only"
                register={register}
                controlClassName="control"
                options={options.unitPriorities}
              />
            </ViewItem>
          </GridCell>
        </GridSection>
      </div>
      <div className="mt-6">
        <Button
          type="button"
          onClick={() => onFormSubmit("copyNew")}
          styleType={AppearanceStyleType.secondary}
          className="mr-4"
        >
          {t("t.copyNew")}
        </Button>

        <Button
          type="button"
          onClick={() => onFormSubmit("saveNew")}
          styleType={AppearanceStyleType.secondary}
          className="mr-4"
        >
          {t("t.saveNew")}
        </Button>

        <Button
          type="button"
          onClick={() => onFormSubmit()}
          styleType={AppearanceStyleType.primary}
        >
          {t("t.saveExit")}
        </Button>

        <Button
          type="button"
          onClick={onClose}
          styleType={AppearanceStyleType.secondary}
          border={AppearanceBorderType.borderless}
        >
          {t("t.cancel")}
        </Button>
      </div>
    </Form>
  )
}

export default UnitForm
