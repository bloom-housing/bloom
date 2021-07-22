import React, { useEffect, useState } from "react"
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
} from "@bloom-housing/ui-components"
import { useForm } from "react-hook-form"
import { TempUnit } from "."
import {
  AmiChart,
  UnitAccessibilityPriorityType,
  UnitType,
  UnitStatus,
} from "@bloom-housing/backend-core/types"
import { useAmiChartList, useUnitPriorityList, useUnitTypeList } from "../../../lib/hooks"
import { arrayToFormOptions, getRentType } from "../../../lib/helpers"

type UnitFormProps = {
  onSubmit: (unit: TempUnit) => void
  onClose: () => void
  units: TempUnit[]
  currentTempId: number
}

const UnitForm = ({ onSubmit, onClose, units, currentTempId }: UnitFormProps) => {
  const [current, setCurrent] = useState<TempUnit>(null)
  const [tempId, setTempId] = useState<number | null>(null)
  const [options, setOptions] = useState({
    amiCharts: [],
    unitPriorities: [],
    unitTypes: [],
  })

  /**
   * fetch form options
   */
  const { data: amiCharts = [] } = useAmiChartList()
  const { data: unitPriorities = [] } = useUnitPriorityList()
  const { data: unitTypes = [] } = useUnitTypeList()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch, errors, trigger, getValues, reset } = useForm({
    defaultValues: {
      number: current?.number,
      unitType: current?.unitType,
      numBathrooms: current?.numBathrooms,
      floor: current?.floor,
      sqFeet: current?.sqFeet,
      status: UnitStatus.unknown,
      minOccupancy: current?.minOccupancy,
      maxOccupancy: current?.maxOccupancy,
      amiChart: current?.amiChart,
      amiPercentage: current?.amiPercentage,
      monthlyIncomeMin: current?.monthlyIncomeMin,
      monthlyRent: current?.monthlyRent,
      monthlyRentAsPercentOfIncome: current?.monthlyRentAsPercentOfIncome,
      priorityType: current?.priorityType,
      rentType: getRentType(current),
    },
  })

  useEffect(() => {
    setTempId(currentTempId)
  }, [currentTempId])

  useEffect(() => {
    const unit = units.filter((unit) => unit.tempId === tempId)[0]
    setCurrent(unit)
    reset({
      ...unit,
      rentType: getRentType(unit),
      status: unit?.status,
    })
  }, [units, setCurrent, tempId, reset, options])

  const rentType = watch("rentType")

  async function onFormSubmit(action?: string) {
    const validation = await trigger()

    if (!validation) return

    const data = getValues()

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

    const current = units.find((unit) => unit.tempId === tempId)
    if (current) {
      onSubmit({ ...formData, id: current.id, tempId: current.tempId })
    } else {
      onSubmit({ ...formData, id: undefined, tempId: units.length + 1 })
    }
    setTempId(null)
    if (action === "copyNew") {
      setCurrent({ ...formData, id: current?.id, tempId: units.length + 1 })
      reset({ ...formData })
    } else if (action === "saveNew") {
      setCurrent(null)
      reset()
    } else {
      onClose()
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

  useEffect(() => {
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
              <Field
                id="status"
                name="status"
                label={t("listings.unit.unitStatus")}
                placeholder={t("listings.unit.unitStatus")}
                register={register}
                readerOnly
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
        </GridSection>
        <GridSection columns={4} className="pt-6">
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
