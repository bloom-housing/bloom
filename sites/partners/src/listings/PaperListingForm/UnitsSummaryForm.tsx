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
import { TempUnitsSummary } from "."
import { UnitAccessibilityPriorityType, UnitType } from "@bloom-housing/backend-core/types"
import { useUnitPriorityList, useUnitTypeList } from "../../../lib/hooks"
import { arrayToFormOptions, getRentTypeFromUnitsSummary } from "../../../lib/helpers"

type UnitsSummaryFormProps = {
  onSubmit: (unit: TempUnitsSummary) => void
  onClose: () => void
  summaries: TempUnitsSummary[]
  currentTempId: number
}

const UnitsSummaryForm = ({
  onSubmit,
  onClose,
  summaries,
  currentTempId,
}: UnitsSummaryFormProps) => {
  const [current, setCurrent] = useState<TempUnitsSummary>(null)
  const [tempId, setTempId] = useState<number | null>(null)
  const [options, setOptions] = useState({
    unitPriorities: [],
    unitTypes: [],
  })

  /**
   * fetch form options
   */
  const { data: unitPriorities = [] } = useUnitPriorityList()
  const { data: unitTypes = [] } = useUnitTypeList()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch, errors, trigger, getValues, reset } = useForm({
    defaultValues: {
      unitType: current?.unitType,
      floorMin: current?.floorMin,
      floorMax: current?.floorMax,
      sqFeetMin: current?.sqFeetMin,
      sqFeetMax: current?.sqFeetMax,
      minOccupancy: current?.minOccupancy,
      maxOccupancy: current?.maxOccupancy,
      amiPercentage: current?.amiPercentage,
      minimumIncomeMin: current?.minimumIncomeMin,
      monthlyRentMin: current?.monthlyRentMin,
      monthlyRentMax: current?.monthlyRentMax,
      monthlyRentAsPercentOfIncome: current?.monthlyRentAsPercentOfIncome,
      priorityType: current?.priorityType,
      rentType: getRentTypeFromUnitsSummary(current),
    },
  })

  useEffect(() => {
    setTempId(currentTempId)
  }, [currentTempId])

  useEffect(() => {
    const summary = summaries.filter((summary) => summary.tempId === tempId)[0]
    setCurrent(summary)
    reset({
      ...summary,
      rentType: getRentTypeFromUnitsSummary(summary),
    })
  }, [summaries, setCurrent, tempId, reset, options])

  const rentType = watch("rentType")

  async function onFormSubmit(action?: string) {
    // Triggers validation across the form.
    const validation = await trigger()

    if (!validation) return

    const data = getValues()

    if (data.rentType === "fixed") {
      delete data.monthlyRentAsPercentOfIncome
    } else if (data.rentType === "percentage") {
      data.minimumIncomeMin = "0"
      delete data.monthlyRentMin
      delete data.monthlyRentMax
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

    const current = summaries.find((summary) => summary.tempId === tempId)
    if (current) {
      onSubmit({ ...formData, id: current.id, tempId: current.tempId })
    } else {
      onSubmit({
        ...formData,
        id: undefined,
        tempId: summaries.length + 1,
      })
    }
    setTempId(null)
    if (action === "copyNew") {
      setCurrent({
        ...formData,
        id: current?.id,
        tempId: summaries.length + 1,
      })
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
      unitPriorities: arrayToFormOptions<UnitAccessibilityPriorityType>(
        unitPriorities,
        "name",
        "id"
      ),
      unitTypes: arrayToFormOptions<UnitType>(unitTypes, "name", "id"),
    })
  }, [unitPriorities, unitTypes])

  return (
    <Form onSubmit={() => false}>
      <div className="border rounded-md p-8 bg-white">
        <GridSection title={t("listings.unit.details")} columns={4}>
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
            <ViewItem label={t("listings.unitsSummary.floorMin")}>
              <Select
                id="floorMin"
                name="floorMin"
                label={t("listings.unitsSummary.floorMin")}
                placeholder={t("listings.unitsSummary.floorMin")}
                labelClassName="sr-only"
                register={register}
                controlClassName="control"
                options={numberOptions(10)}
              />
            </ViewItem>
            <ViewItem label={t("listings.unitsSummary.floorMax")}>
              <Select
                id="floorMax"
                name="floorMax"
                label={t("listings.unitsSummary.floorMax")}
                placeholder={t("listings.unitsSummary.floorMax")}
                labelClassName="sr-only"
                register={register}
                controlClassName="control"
                options={numberOptions(10)}
              />
            </ViewItem>
          </GridCell>
          <GridCell>
            <ViewItem label={t("listings.unitsSummary.sqFeetMin")}>
              <Field
                id="sqFeetMin"
                name="sqFeetMin"
                label={t("listings.unitsSummary.sqFeetMin")}
                placeholder={t("listings.unitsSummary.sqFeetMin")}
                register={register}
                readerOnly
                type="number"
              />
            </ViewItem>
            <ViewItem label={t("listings.unitsSummary.sqFeetMax")}>
              <Field
                id="sqFeetMax"
                name="sqFeetMax"
                label={t("listings.unitsSummary.sqFeetMax")}
                placeholder={t("listings.unitsSummary.sqFeetMax")}
                register={register}
                readerOnly
                type="number"
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
        <GridSection title={t("listings.unitsSummary.availability")} columns={4} separator>
          <GridCell>
            <ViewItem label={t("listings.unitsSummary.count")}>
              <Field
                id="totalCount"
                name="totalCount"
                label={t("listings.unitsSummary.count")}
                placeholder={t("listings.unitsSummary.count")}
                register={register}
                readerOnly
                type="number"
              />
            </ViewItem>
          </GridCell>
          <GridCell>
            <ViewItem label={t("listings.unitsSummary.available")}>
              <Field
                id="totalAvailable"
                name="totalAvailable"
                label={t("listings.unitsSummary.available")}
                placeholder={t("listings.unitsSummary.available")}
                register={register}
                readerOnly
                type="number"
              />
            </ViewItem>
          </GridCell>
        </GridSection>
        <GridSection title={t("listings.unit.eligibility")} columns={4} separator>
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
                    id="minimumIncomeMin"
                    name="minimumIncomeMin"
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
                <ViewItem label={t("listings.unitsSummary.monthlyRentMin")}>
                  <Field
                    id="monthlyRentMin"
                    name="monthlyRentMin"
                    label={t("listings.unitsSummary.monthlyRentMin")}
                    placeholder="0.00"
                    register={register}
                    type="number"
                    prepend="$"
                    readerOnly
                  />
                </ViewItem>
                <ViewItem label={t("listings.unitsSummary.monthlyRentMax")}>
                  <Field
                    id="monthlyRentMax"
                    name="monthlyRentMax"
                    label={t("listings.unitsSummary.monthlyRentMax")}
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

export default UnitsSummaryForm
