import React, { useEffect, useState, useCallback, useMemo } from "react"
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
  AppearanceSizeType,
  Drawer,
  Modal,
} from "@bloom-housing/ui-components"
import { useForm, useFormContext } from "react-hook-form"
import { TempUnitsSummary, TempAmiLevel } from "./formTypes"
import {
  AmiChart,
  MonthlyRentDeterminationType,
  UnitAccessibilityPriorityType,
} from "@bloom-housing/backend-core/types"
import { useUnitPriorityList, useAmiChartList } from "../../../lib/hooks"
import { arrayToFormOptions } from "../../../lib/helpers"
import UnitsSummaryAmiForm from "./UnitsSummaryAmiForm"

interface FieldSingle {
  id: string
  label: string
  value?: string
}

type UnitsSummaryFormProps = {
  onSubmit: (unit: TempUnitsSummary) => void
  onClose: () => void
  summaries: TempUnitsSummary[]
  currentTempId: number
  unitTypeOptions: FieldSingle[]
}

const UnitsSummaryForm = ({
  onSubmit,
  onClose,
  summaries,
  currentTempId,
  unitTypeOptions,
}: UnitsSummaryFormProps) => {
  const [current, setCurrent] = useState<TempUnitsSummary>(null)
  const [summaryDrawer, setSummaryDrawer] = useState<number | null>(null)
  const [amiDeleteModal, setAmiDeleteModal] = useState<number | null>(null)
  const [options, setOptions] = useState({
    unitPriorities: [],
    amiCharts: [],
  })

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { watch } = useFormContext()
  const jurisdiction: string = watch("jurisdiction.id")

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, errors, trigger, getValues, reset, clearErrors, watch: formWatch } = useForm({
    defaultValues: {
      unitType: current?.unitType,
      floorMin: current?.floorMin,
      floorMax: current?.floorMax,
      sqFeetMin: current?.sqFeetMin,
      sqFeetMax: current?.sqFeetMax,
      bathroomMin: current?.bathroomMin,
      bathroomMax: current?.bathroomMax,
      minOccupancy: current?.minOccupancy,
      maxOccupancy: current?.maxOccupancy,
      totalCount: current?.totalCount,
      totalAvailable: current?.totalAvailable,
      priorityType: current?.priorityType,
      openWaitlist: current?.openWaitlist,
      amiLevels: current?.amiLevels,
    },
  })

  const unitType = formWatch("unitType")
  const minOccupancy = formWatch("minOccupancy")
  const maxOccupancy = formWatch("maxOccupancy")
  const sqFeetMin = formWatch("sqFeetMin")
  const sqFeetMax = formWatch("sqFeetMax")
  const floorMin = formWatch("floorMin")
  const floorMax = formWatch("floorMax")
  const bathroomMin = formWatch("bathroomMin")
  const bathroomMax = formWatch("bathroomMax")
  const totalAvailable = formWatch("totalAvailable")
  const totalCount = formWatch("totalCount")

  /**
   * fetch form options
   */
  const { data: unitPriorities = [] } = useUnitPriorityList()
  const { data: amis = [] } = useAmiChartList(jurisdiction)

  useEffect(() => {
    const summary = summaries.find((summary) => summary.tempId === currentTempId)
    setCurrent(summary)
    reset({
      ...summary,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore:next-line
      unitType: summary?.unitType?.map((elem) => elem.id ?? elem.toString()),
      openWaitListQuestion: summary?.openWaitlist?.toString(),
    })
  }, [summaries, reset, currentTempId, setCurrent])

  async function onFormSubmit() {
    // Triggers validation across the form.
    const validation = await trigger()
    if (!validation) return

    const data = getValues()

    if (data.priorityType?.id) {
      const priority = unitPriorities.find((priority) => priority.id === data.priorityType.id)
      data.priorityType = priority
    } else {
      delete data.priorityType
    }

    let amiLevels
    if (current) {
      amiLevels = current.amiLevels?.map((level) => ({
        ...level,
        amiChart: amis.find((a) => a.id === level.amiChartId),
      }))
    } else if (data?.amiLevels) {
      data.amiLevels = data.amiLevels.map((level) => ({
        ...level,
        amiChart: amis.find((a) => a.id === level.amiChartId),
      }))
    }

    const formData = {
      createdAt: undefined,
      updatedAt: undefined,
      ...data,
    }

    if (current) {
      onSubmit({
        ...formData,
        id: current.id,
        tempId: current.tempId || currentTempId,
        amiLevels,
      })
    } else {
      onSubmit({
        ...formData,
        id: undefined,
        tempId: (summaries.length || 0) + 1,
      })
    }
    onClose()
  }

  useEffect(() => {
    setOptions({
      unitPriorities: arrayToFormOptions<UnitAccessibilityPriorityType>(
        unitPriorities,
        "name",
        "id",
        undefined,
        true
      ),
      amiCharts: arrayToFormOptions<AmiChart>(amis, "name", "id", undefined, true),
    })
  }, [unitPriorities, amis])

  const editAmi = useCallback(
    (tempId: number) => {
      setSummaryDrawer(tempId)
    },
    [setSummaryDrawer]
  )

  const saveAmiSummary = (newAmiLevel: TempAmiLevel) => {
    const exists = current?.amiLevels?.some((amiLevel) => amiLevel.tempId === newAmiLevel.tempId)
    if (exists) {
      setCurrent({
        ...current,
        amiLevels: current.amiLevels.map((amiLevel) =>
          amiLevel.tempId === newAmiLevel.tempId ? newAmiLevel : amiLevel
        ),
      })
    } else {
      if (current?.amiLevels) {
        setCurrent({ ...current, amiLevels: [...current.amiLevels, newAmiLevel] })
      } else {
        setCurrent({ ...current, amiLevels: [newAmiLevel] })
      }
    }
  }

  const amiSummaryTableData = useMemo(
    () =>
      current?.amiLevels?.map((ami) => {
        const selectedAmiChart = options.amiCharts.find((chart) => chart.value === ami.amiChartId)

        let rentValue = undefined
        let monthlyRentDeterminationType = undefined
        if (ami.monthlyRentDeterminationType === MonthlyRentDeterminationType.flatRent) {
          rentValue = `${ami.flatRentValue ? `$${ami.flatRentValue}` : ""}`
          monthlyRentDeterminationType = t("listings.unitsSummary.flatRent")
        } else if (
          ami.monthlyRentDeterminationType === MonthlyRentDeterminationType.percentageOfIncome
        ) {
          rentValue = `${ami.percentageOfIncomeValue ? `${ami.percentageOfIncomeValue}%` : ""}`
          monthlyRentDeterminationType = t("listings.unitsSummary.percentIncome")
        }

        return {
          amiChartName: selectedAmiChart?.label || "",
          amiPercentage: `${ami.amiPercentage ? `${ami.amiPercentage}%` : ""}`,
          monthlyRentDeterminationType: monthlyRentDeterminationType,
          rentValue: rentValue,
          action: (
            <div className="flex-col">
              <Button
                type="button"
                className="front-semibold uppercase m-1"
                onClick={() => editAmi(ami.tempId)}
                unstyled
              >
                {t("t.edit")}
              </Button>
              <Button
                type="button"
                className="front-semibold uppercase text-red-700 m-1"
                onClick={() => setAmiDeleteModal(ami.tempId)}
                unstyled
              >
                {t("t.delete")}
              </Button>
            </div>
          ),
        }
      }),
    [current, options.amiCharts, editAmi, setAmiDeleteModal]
  )

  const deleteAmi = useCallback(
    (tempId: number) => {
      const updateAmis = current?.amiLevels
        .filter((summary) => summary.tempId !== tempId)
        .map((updatedAmi, index) => ({
          ...updatedAmi,
          tempId: index + 1,
        }))

      setCurrent({ ...current, amiLevels: updateAmis })
      setAmiDeleteModal(null)
    },
    [setAmiDeleteModal, setCurrent, current]
  )

  const openWaitlistOptions = [
    {
      id: "true",
      label: t("listings.unitsSummary.open"),
      value: "true",
    },
    {
      id: "false",
      label: t("listings.unitsSummary.closed"),
      value: "false",
      defaultChecked: true,
    },
  ]

  const amiSummariesHeaders = {
    amiChartName: "listings.unitsSummary.amiChart",
    amiPercentage: "listings.unitsSummary.amiLevel",
    monthlyRentDeterminationType: "listings.unitsSummary.rentType",
    rentValue: "listings.unitsSummary.flatRentValue",
    action: "",
  }

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

  useEffect(() => {
    if (unitType?.length && errors?.unitType) {
      clearErrors("unitType")
    }
  }, [unitType, errors, clearErrors])

  return (
    <>
      <Form onSubmit={() => false}>
        <div className="border rounded-md p-8 bg-white">
          <GridSection title={t("listings.unit.details")} columns={2}>
            <GridCell span={1}>
              <ViewItem label={t("listings.unit.type")}>
                <FieldGroup
                  name="unitType"
                  type="checkbox"
                  register={register}
                  fields={unitTypeOptions}
                  fieldClassName="m-0"
                  error={errors?.unitType !== undefined}
                  errorMessage={t("errors.requiredFieldError")}
                  validation={{ required: true }}
                  fieldGroupClassName="grid grid-cols-2 mt-4"
                />
              </ViewItem>
            </GridCell>
          </GridSection>
          <GridSection title={t("listings.unit.details")} columns={1}>
            <GridSection columns={3}>
              <GridCell span={1}>
                <ViewItem label={t("listings.unitsSummary.count")}>
                  <Field
                    id="totalCount"
                    name="totalCount"
                    label={t("listings.unitsSummary.count")}
                    placeholder={t("listings.unitsSummary.count")}
                    register={register}
                    readerOnly
                    type="number"
                    error={errors?.totalCount !== undefined}
                    errorMessage={t("errors.totalCountLessThanTotalAvailableError")}
                    validation={{ min: totalAvailable }}
                    inputProps={{
                      onBlur: () => {
                        trigger("totalCount")
                        trigger("totalAvailable")
                      },
                    }}
                  />
                </ViewItem>
              </GridCell>
            </GridSection>
            <GridSection columns={3}>
              <GridCell span={1}>
                <ViewItem label={t("listings.unit.minOccupancy")}>
                  <Select
                    id="minOccupancy"
                    name="minOccupancy"
                    label={t("listings.unit.minOccupancy")}
                    labelClassName="sr-only"
                    register={register}
                    controlClassName="control"
                    options={numberOptions(8, 1, true)}
                    error={errors?.minOccupancy !== undefined}
                    errorMessage={t("errors.minGreaterThanMaxOccupancyError")}
                    validation={{ max: maxOccupancy || minOccupancy }}
                    inputProps={{
                      onChange: () => {
                        trigger("minOccupancy")
                        trigger("maxOccupancy")
                      },
                    }}
                  />
                </ViewItem>
              </GridCell>
              <GridCell span={1}>
                <ViewItem label={t("listings.unit.maxOccupancy")}>
                  <Select
                    id="maxOccupancy"
                    name="maxOccupancy"
                    label={t("listings.unit.maxOccupancy")}
                    labelClassName="sr-only"
                    register={register}
                    controlClassName="control"
                    options={numberOptions(8, 1, true)}
                    error={errors?.maxOccupancy !== undefined}
                    errorMessage={t("errors.maxLessThanMinOccupancyError")}
                    validation={{ min: minOccupancy }}
                    inputProps={{
                      onChange: () => {
                        trigger("minOccupancy")
                        trigger("maxOccupancy")
                      },
                    }}
                  />
                </ViewItem>
              </GridCell>
            </GridSection>
            <GridSection columns={3}>
              <GridCell span={1}>
                <ViewItem label={t("listings.unitsSummary.sqFeetMin")}>
                  <Field
                    id="sqFeetMin"
                    name="sqFeetMin"
                    label={t("listings.unitsSummary.sqFeetMin")}
                    placeholder={t("listings.unitsSummary.sqFeetMin")}
                    register={register}
                    readerOnly
                    type="number"
                    error={errors?.sqFeetMin !== undefined}
                    errorMessage={t("errors.minGreaterThanMaxSqFeetError")}
                    validation={{ max: sqFeetMax || sqFeetMin }}
                    inputProps={{
                      onBlur: () => {
                        trigger("sqFeetMin")
                        trigger("sqFeetMax")
                      },
                    }}
                  />
                </ViewItem>
              </GridCell>
              <GridCell span={1}>
                <ViewItem label={t("listings.unitsSummary.sqFeetMax")}>
                  <Field
                    id="sqFeetMax"
                    name="sqFeetMax"
                    label={t("listings.unitsSummary.sqFeetMax")}
                    placeholder={t("listings.unitsSummary.sqFeetMax")}
                    register={register}
                    readerOnly
                    type="number"
                    error={errors?.sqFeetMax !== undefined}
                    errorMessage={t("errors.maxLessThanMinSqFeetError")}
                    validation={{ min: sqFeetMin }}
                    inputProps={{
                      onBlur: () => {
                        trigger("sqFeetMin")
                        trigger("sqFeetMax")
                      },
                    }}
                  />
                </ViewItem>
              </GridCell>
            </GridSection>
            <GridSection columns={3}>
              <GridCell span={1}>
                <ViewItem label={t("listings.unitsSummary.floorMin")}>
                  <Select
                    id="floorMin"
                    name="floorMin"
                    label={t("listings.unitsSummary.floorMin")}
                    labelClassName="sr-only"
                    register={register}
                    controlClassName="control"
                    options={numberOptions(10, 1, true)}
                    error={errors?.floorMin !== undefined}
                    errorMessage={t("errors.minGreaterThanMaxFloorError")}
                    validation={{ max: floorMax || floorMin }}
                    inputProps={{
                      onChange: () => {
                        trigger("floorMin")
                        trigger("floorMax")
                      },
                    }}
                  />
                </ViewItem>
              </GridCell>
              <GridCell span={1}>
                <ViewItem label={t("listings.unitsSummary.floorMax")}>
                  <Select
                    id="floorMax"
                    name="floorMax"
                    label={t("listings.unitsSummary.floorMax")}
                    labelClassName="sr-only"
                    register={register}
                    controlClassName="control"
                    options={numberOptions(10, 1, true)}
                    error={errors?.floorMax !== undefined}
                    errorMessage={t("errors.maxLessThanMinFloorError")}
                    validation={{ min: floorMin }}
                    inputProps={{
                      onChange: () => {
                        trigger("floorMin")
                        trigger("floorMax")
                      },
                    }}
                  />
                </ViewItem>
              </GridCell>
            </GridSection>
            <GridSection columns={3}>
              <GridCell span={1}>
                <ViewItem label={t("listings.unitsSummary.bathroomMin")}>
                  <Select
                    id="bathroomMin"
                    name="bathroomMin"
                    label={t("listings.unitsSummary.bathroomMin")}
                    labelClassName="sr-only"
                    register={register}
                    controlClassName="control"
                    options={bathroomOptions}
                    error={errors?.bathroomMin !== undefined}
                    errorMessage={t("errors.minGreaterThanMaxBathroomError")}
                    validation={{ max: bathroomMax || bathroomMin }}
                    inputProps={{
                      onChange: () => {
                        trigger("bathroomMin")
                        trigger("bathroomMax")
                      },
                    }}
                  />
                </ViewItem>
              </GridCell>
              <GridCell span={1}>
                <ViewItem label={t("listings.unitsSummary.bathroomMax")}>
                  <Select
                    id="bathroomMax"
                    name="bathroomMax"
                    label={t("listings.unitsSummary.bathroomMax")}
                    labelClassName="sr-only"
                    register={register}
                    controlClassName="control"
                    options={bathroomOptions}
                    error={errors?.bathroomMax !== undefined}
                    errorMessage={t("errors.maxLessThanMinBathroomError")}
                    validation={{ min: bathroomMin }}
                    inputProps={{
                      onChange: () => {
                        trigger("bathroomMin")
                        trigger("bathroomMax")
                      },
                    }}
                  />
                </ViewItem>
              </GridCell>
            </GridSection>
          </GridSection>
          <GridSection title={t("listings.unitsSummary.availability")} columns={3} separator>
            <GridCell span={1}>
              <ViewItem label={t("listings.unitsSummary.vacancies")}>
                <Field
                  id="totalAvailable"
                  name="totalAvailable"
                  label={t("listings.unitsSummary.vacancies")}
                  placeholder={t("listings.unitsSummary.vacancies")}
                  register={register}
                  readerOnly
                  type="number"
                  error={errors?.totalAvailable !== undefined}
                  errorMessage={t("errors.totalAvailableGreaterThanTotalCountError")}
                  validation={{ max: totalCount || totalAvailable }}
                  inputProps={{
                    onBlur: () => {
                      trigger("totalCount")
                      trigger("totalAvailable")
                    },
                  }}
                />
              </ViewItem>
            </GridCell>
            <GridCell span={1}>
              <ViewItem label={t("listings.unitsSummary.openWaitlist")}>
                <FieldGroup
                  name="openWaitListQuestion"
                  type="radio"
                  register={register}
                  fields={openWaitlistOptions}
                  fieldClassName="m-0"
                  fieldGroupClassName="flex h-12 items-center"
                  error={errors?.openWaitlist !== undefined}
                  errorMessage={t("errors.requiredFieldError")}
                />
              </ViewItem>
            </GridCell>
          </GridSection>
          <GridSection title={t("listings.unit.eligibility")} columns={1} separator>
            <GridCell>
              <div className="bg-gray-300 px-4 py-5">
                {current?.amiLevels?.length ? (
                  <div className={"mb-5"}>
                    <MinimalTable
                      headers={amiSummariesHeaders}
                      data={amiSummaryTableData}
                      responsiveCollapse={true}
                    />
                  </div>
                ) : null}
                <Button
                  type="button"
                  size={AppearanceSizeType.normal}
                  styleType={null}
                  onClick={() => {
                    editAmi((current?.amiLevels?.length || 0) + 1)
                  }}
                >
                  {t("listings.unitsSummary.addAmi")}
                </Button>
              </div>
            </GridCell>
          </GridSection>
          <GridSection title={t("t.accessibility")} columns={4} separator>
            <GridCell>
              <ViewItem label={t("listings.unit.accessibilityPriorityType")}>
                <Select
                  id="priorityType.id"
                  name="priorityType.id"
                  label={t("listings.unit.accessibilityPriorityType")}
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
      <Drawer
        open={!!summaryDrawer}
        title={t("listings.unitsSummary.addAmi")}
        ariaDescription={t("listings.unitsSummary.addAmi")}
        onClose={() => setSummaryDrawer(null)}
      >
        <UnitsSummaryAmiForm
          onSubmit={(amiLevel) => saveAmiSummary(amiLevel)}
          onClose={() => setSummaryDrawer(null)}
          amiLevels={current?.amiLevels || []}
          currentTempId={summaryDrawer}
          amiCharOptions={options.amiCharts}
          amiInfo={amis}
        />
      </Drawer>
      <Modal
        open={!!amiDeleteModal}
        title={t("listings.unitsSummary.deleteAmi")}
        ariaDescription={t("listings.unitsSummary.deleteAmiConf")}
        actions={[
          <Button styleType={AppearanceStyleType.alert} onClick={() => deleteAmi(amiDeleteModal)}>
            {t("t.delete")}
          </Button>,
          <Button
            styleType={AppearanceStyleType.primary}
            border={AppearanceBorderType.borderless}
            onClick={() => {
              setAmiDeleteModal(null)
            }}
          >
            {t("t.cancel")}
          </Button>,
        ]}
      >
        {t("listings.unitsSummary.deleteAmiConf")}
      </Modal>
    </>
  )
}

export default UnitsSummaryForm
