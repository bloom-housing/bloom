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
import { useUnitPriorityList } from "../../../lib/hooks"
import { arrayToFormOptions } from "../../../lib/helpers"
import UnitsSummaryAmiForm from "./UnitsSummaryAmiForm"
import { useAmiChartList } from "../../../lib/hooks"

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
  const [tempId, setTempId] = useState<number | null>(null)
  const [summaryDrawer, setSummaryDrawer] = useState<number | null>(null)
  const [amiDeleteModal, setAmiDeleteModal] = useState<number | null>(null)
  const [options, setOptions] = useState({
    unitPriorities: [],
    amiCharts: [],
  })

  const { watch } = useFormContext()
  const jurisdiction: string = watch("jurisdiction.id")

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, errors, trigger, getValues, reset, clearErrors } = useForm({
    defaultValues: {
      unitType: current?.unitType,
      floorMin: current?.floorMin,
      floorMax: current?.floorMax,
      sqFeetMin: current?.sqFeetMin,
      sqFeetMax: current?.sqFeetMax,
      minOccupancy: current?.minOccupancy,
      maxOccupancy: current?.maxOccupancy,
      totalCount: current?.totalCount,
      totalAvailable: current?.totalAvailable,
      priorityType: current?.priorityType,
      openWaitlist: current?.openWaitlist,
      amiLevels: current?.amiLevels,
    },
  })

  /**
   * fetch form options
   */
  const { data: unitPriorities = [] } = useUnitPriorityList()
  const { data: amis = [] } = useAmiChartList(jurisdiction)

  useEffect(() => {
    setTempId(currentTempId)
  }, [currentTempId])

  useEffect(() => {
    const summary = summaries.filter((summary) => summary.tempId === tempId)[0]
    setCurrent(summary)
    reset({
      ...summary,
    })
  }, [summaries, setCurrent, tempId, reset, options])

  async function onFormSubmit(action?: string) {
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

    const formData = {
      createdAt: undefined,
      updatedAt: undefined,
      ...data,
    }

    if (current) {
      onSubmit({
        ...formData,
        id: current.id,
        tempId: current.tempId || tempId,
        amiLevels: current.amiLevels,
      })
    } else {
      onSubmit({
        ...formData,
        id: undefined,
        tempId: (summaries.length || 0) + 1,
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

  useEffect(() => {
    setOptions({
      unitPriorities: arrayToFormOptions<UnitAccessibilityPriorityType>(
        unitPriorities,
        "name",
        "id"
      ),
      amiCharts: arrayToFormOptions<AmiChart>(amis, "name", "id"),
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
          rentValue = ami.flatRentValue
          monthlyRentDeterminationType = t("listings.unitsSummary.flatRent")
        } else if (
          ami.monthlyRentDeterminationType === MonthlyRentDeterminationType.percentageOfIncome
        ) {
          rentValue = ami.percentageOfIncomeValue
          monthlyRentDeterminationType = t("listings.unitsSummary.percentIncome")
        }

        return {
          amiChartName: selectedAmiChart?.label || "",
          amiPercentage: ami.amiPercentage,
          monthlyRentDeterminationType: monthlyRentDeterminationType,
          rentValue: rentValue,
          action: (
            <div className="flex">
              <Button
                type="button"
                className="front-semibold uppercase"
                onClick={() => editAmi(ami.tempId)}
                unstyled
              >
                {t("t.edit")}
              </Button>
              <Button
                type="button"
                className="front-semibold uppercase text-red-700"
                onClick={() => setAmiDeleteModal(ami.tempId)}
                unstyled
              >
                {t("t.delete")}
              </Button>
            </div>
          ),
        }
      }),
    [current, options.amiCharts]
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
      id: "open",
      label: t("listings.unitsSummary.open"),
      value: "open",
    },
    {
      id: "closed",
      label: t("listings.unitsSummary.closed"),
      value: "closed",
    },
  ]

  const amiSummariesHeaders = {
    amiChartName: "listings.unitsSummary.amiChart",
    amiPercentage: "listings.unitsSummary.amiLevel",
    monthlyRentDeterminationType: "listings.unitsSummary.rentType",
    rentValue: "listings.unitsSummary.flatRentValue",
    action: "",
  }

  return (
    <>
      <Form onSubmit={() => false}>
        <div className="border rounded-md p-8 bg-white">
          <GridSection title={t("listings.unit.details")} columns={1}>
            <GridCell>
              <ViewItem label={t("listings.unit.type")}>
                <FieldGroup
                  name="unitType"
                  type="checkbox"
                  register={register}
                  fields={unitTypeOptions}
                  fieldClassName="m-0"
                  fieldGroupClassName="flex h-12 items-center"
                  error={errors?.unitType !== undefined}
                  errorMessage={t("errors.requiredFieldError")}
                  validation={{ required: true }}
                />
              </ViewItem>
            </GridCell>
          </GridSection>
          <GridSection title={t("listings.unit.details")} columns={2}>
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
                  error={errors?.totalCount !== undefined}
                  errorMessage={t("errors.requiredFieldError")}
                />
              </ViewItem>
            </GridCell>
            <GridCell>{null}</GridCell>
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
            </GridCell>
            <GridCell>
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
            </GridCell>
            <GridCell>
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
              <ViewItem label={t("listings.unitsSummary.bathroomsMin")}>
                <Select
                  id="bathroomMin"
                  name="bathroomMin"
                  label={t("listings.unitsSummary.bathroomsMin")}
                  placeholder={t("listings.unitsSummary.bathroomsMin")}
                  labelClassName="sr-only"
                  register={register}
                  controlClassName="control"
                  options={numberOptions(10)}
                />
              </ViewItem>
            </GridCell>
            <GridCell>
              <ViewItem label={t("listings.unitsSummary.bathroomsMax")}>
                <Select
                  id="bathroomMax"
                  name="bathroomMax"
                  label={t("listings.unitsSummary.bathroomsMax")}
                  placeholder={t("listings.unitsSummary.bathroomsMax")}
                  labelClassName="sr-only"
                  register={register}
                  controlClassName="control"
                  options={numberOptions(10)}
                />
              </ViewItem>
            </GridCell>
          </GridSection>
          <GridSection title={t("listings.unitsSummary.availability")} columns={2} separator>
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
                  error={errors?.totalAvailable !== undefined}
                  errorMessage={t("errors.requiredFieldError")}
                />
              </ViewItem>
            </GridCell>
            <GridCell>
              <ViewItem label={t("listings.unitsSummary.openWaitlist")}>
                <FieldGroup
                  name="openWaitlist"
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
                <MinimalTable
                  headers={amiSummariesHeaders}
                  data={amiSummaryTableData}
                  responsiveCollapse={true}
                />
                <Button
                  type="button"
                  size={AppearanceSizeType.normal}
                  styleType={null}
                  onClick={() => {
                    editAmi((current?.amiLevels?.length || 0) + 1)
                    clearErrors("unitsSummaries")
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
