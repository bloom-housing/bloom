import React, { useMemo } from "react"
import { Unit } from "@bloom-housing/backend-core/types"
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
} from "@bloom-housing/ui-components"
import { useForm } from "react-hook-form"
import { useAmiChartList } from "../../../lib/hooks"

type UnitFormProps = {
  onSubmit: (unit: Unit) => void
  onClose: () => void
  units: Unit[]
  currentNumber: string
}

const UnitForm = ({ onSubmit, onClose, units, currentNumber }: UnitFormProps) => {
  const current = useMemo(() => units.filter((unit) => unit.number === currentNumber)[0], [
    units,
    currentNumber,
  ])

  /**
   * fetch options
   */
  const { data: amiCharts = [] } = useAmiChartList()
  console.log("amiCharts = ", amiCharts)

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch, errors, trigger, getValues, reset } = useForm({
    defaultValues: {
      number: current?.number,
      unitType: current?.unitType,
      numBathrooms: current?.numBathrooms,
      floor: current?.floor,
      sqFeet: current?.sqFeet,
      status: current?.status,
      minOccupancy: current?.minOccupancy,
      maxOccupancy: current?.maxOccupancy,
      amiChart: current?.amiChart,
      amiPercentage: current?.amiPercentage,
      monthlyIncomeMin: current?.monthlyIncomeMin,
      monthlyRent: current?.monthlyRent,
      monthlyRentAsPercentageOfIncome: current?.monthlyRentAsPercentOfIncome,
      priorityType: current?.priorityType,
    },
  })

  const rentType = watch("rentType")

  async function onFormSubmit(action?: string) {
    const validation = await trigger()

    if (!validation) return

    const data = getValues()

    const formData = {
      createdAt: undefined,
      updatedAt: undefined,
      ...data,
    }

    const current = units.find((unit) => unit.number === currentNumber)

    onSubmit({ ...current, ...formData })

    if (action === "copyNew") {
      reset({ ...data, number: null })
    } else if (action === "saveNew") {
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
                error={errors.number}
                errorMessage={t("errors.requiredFieldError")}
                validation={{ required: true }}
                readerOnly
              />
            </ViewItem>
          </GridCell>
          <GridCell>
            <ViewItem label={t("listings.unit.type")}>
              <Field
                id="unitType"
                name="unitType"
                label={t("listings.unit.type")}
                placeholder={t("listings.unit.type")}
                register={register}
                readerOnly
              />
            </ViewItem>
          </GridCell>
          <GridCell>
            <ViewItem label={t("listings.unit.numBathrooms")}>
              <Field
                id="numBathrooms"
                name="numBathrooms"
                label={t("listings.unit.numBathrooms")}
                placeholder={t("listings.unit.numBathrooms")}
                register={register}
                readerOnly
              />
            </ViewItem>
          </GridCell>
          <GridCell>
            <ViewItem label={t("listings.unit.floor")}>
              <Field
                id="floor"
                name="floor"
                label={t("listings.unit.floor")}
                placeholder={t("listings.unit.floor")}
                register={register}
                readerOnly
              />
            </ViewItem>
          </GridCell>
          <GridCell>
            <ViewItem label={t("listings.unit.squareFootage")}>
              <Field
                id="sqft"
                name="sqft"
                label={t("listings.unit.squareFootage")}
                placeholder={t("listings.unit.squareFootage")}
                register={register}
                readerOnly
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
              />
            </ViewItem>
          </GridCell>
          <GridCell>
            <ViewItem label={t("listings.unit.minOccupancy")}>
              <Field
                id="minOccupancy"
                name="minOccupancy"
                label={t("listings.unit.minOccupancy")}
                placeholder={t("listings.unit.minOccupancy")}
                register={register}
                type="number"
                readerOnly
              />
            </ViewItem>
          </GridCell>
          <GridCell>
            <ViewItem label={t("listings.unit.maxOccupancy")}>
              <Field
                id="maxOccupancy"
                name="maxOccupancy"
                label={t("listings.unit.maxOccupancy")}
                placeholder={t("listings.unit.maxOccupancy")}
                register={register}
                type="number"
                readerOnly
              />
            </ViewItem>
          </GridCell>
        </GridSection>
        <GridSection title={t("listings.unit.eligibility")} columns={3}>
          <GridCell>
            <ViewItem label={t("listings.unit.amiChart")}>
              <Select
                id="amiChart"
                name="amiChart"
                label={t("listings.unit.amiChart")}
                placeholder={t("listings.unit.amiChart")}
                labelClassName="sr-only"
                register={register}
                controlClassName="control"
                options={amiCharts.map((chart) => ({ label: chart.name, value: chart.id }))}
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
                    id="monthlyRentAsPercentageOfIncome"
                    name="monthlyRentAsPercentageOfIncome"
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
        <GridSection title={t("t.accessibility")} columns={4}>
          <GridCell>
            <ViewItem label={t("listings.unit.accessibilityPriorityType")}>
              <Field
                id="priorityType"
                name="priorityType"
                label={t("listings.unit.accessibilityPriorityType")}
                placeholder={t("listings.unit.accessibilityPriorityType")}
                register={register}
                readerOnly
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
        >
          {t("t.copyNew")}
        </Button>

        <Button
          type="button"
          onClick={() => onFormSubmit("saveNew")}
          styleType={AppearanceStyleType.secondary}
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
