import { Button, Card, Drawer, FieldValue, Grid } from "@bloom-housing/ui-seeds"
import SectionWithGrid from "../../shared/SectionWithGrid"
import { Field, FieldGroup, Form, Select, SelectOption, t } from "@bloom-housing/ui-components"
import { useForm, useWatch } from "react-hook-form"
import { useCallback, useContext, useEffect, useState } from "react"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { fieldHasError } from "../../../lib/helpers"
import {
  AmiChartItem,
  EnumUnitGroupAmiLevelMonthlyRentDeterminationType,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { TempAmiLevel } from "../../../lib/listings/formTypes"

type UnitGroupAmiFormProps = {
  onSubmit: (amiLevel: TempAmiLevel) => void
  onClose: () => void
  amiChartsOptions: SelectOption[]
  amiLevels: TempAmiLevel[]
  currentTempId: number
}

const UnitGroupAmiForm = ({
  onSubmit,
  onClose,
  amiLevels,
  currentTempId,
  amiChartsOptions,
}: UnitGroupAmiFormProps) => {
  const { amiChartsService } = useContext(AuthContext)

  const [amiChartPercentageOptions, setAmiChartPercentageOptions] = useState([])

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, control, trigger, clearErrors, setValue, getValues, errors, reset } = useForm()

  const amiChartID: string = useWatch({
    control,
    name: "amiChart.id",
  })

  const rentType: string = useWatch({
    control,
    name: "monthlyRentDeterminationType",
  })

  const fetchAmiChart = useCallback(
    async (chartId: string) => {
      try {
        const thisAmiChart = await amiChartsService.retrieve({
          amiChartId: chartId,
        })
        const amiChartData = thisAmiChart.items
        const uniquePercentages = Array.from(
          new Set(amiChartData.map((item: AmiChartItem) => item.percentOfAmi))
        ).sort(function (a: number, b: number) {
          return a - b
        })
        setAmiChartPercentageOptions(
          uniquePercentages.map((percentage) => {
            return {
              label: percentage.toString(),
              value: percentage.toString(),
            }
          })
        )
        return amiChartData
      } catch (e) {
        console.error(e)
      }
    },
    [amiChartsService]
  )

  useEffect(() => {
    if (amiChartID) {
      void fetchAmiChart(amiChartID)
    }
  }, [amiChartID, fetchAmiChart])

  async function onFormSubmit() {
    const validation = await trigger()
    if (!validation) return

    const data = getValues()

    const formData = {
      id: null,
      createdAt: undefined,
      updatedAt: undefined,
      ...data,
    }

    const current = amiLevels.find((summary) => summary.tempId === currentTempId)
    if (current) {
      onSubmit({ ...formData, id: current.id, tempId: current.tempId })
    } else {
      onSubmit({
        ...formData,
        id: undefined,
        tempId: amiLevels.length + 1,
      })
    }
    onClose()
  }

  const rentTypeOptions = [
    {
      id: "fixed",
      label: t("listings.unit.fixed"),
      value: EnumUnitGroupAmiLevelMonthlyRentDeterminationType.flatRent,
    },
    {
      id: "percentage",
      label: t("listings.unit.percentage"),
      value: EnumUnitGroupAmiLevelMonthlyRentDeterminationType.percentageOfIncome,
    },
  ]

  useEffect(() => {
    const amiLevel = amiLevels.find((entry) => entry.tempId === currentTempId)
    if (amiLevel) {
      reset({ ...amiLevel })
    }
  }, [amiLevels, currentTempId, reset, amiChartPercentageOptions])

  return (
    <Form onSubmit={() => false}>
      <Drawer.Content>
        <Card>
          <Card.Section>
            <SectionWithGrid heading={t("listings.unit.amiLevel")}>
              <Grid.Row columns={4}>
                <FieldValue label={t("listings.unit.amiChart")}>
                  <Select
                    label={t("listings.unit.amiChart")}
                    id="amiChart.id"
                    name="amiChart.id"
                    placeholder={t("t.selectOne")}
                    options={amiChartsOptions}
                    labelClassName="sr-only"
                    controlClassName="control"
                    register={register}
                    error={fieldHasError(errors?.amiChart)}
                    errorMessage={t("errors.requiredFieldError")}
                    validation={{ required: true }}
                    inputProps={{
                      onChange: () => {
                        setValue("amiPercentage", undefined)
                        clearErrors("amiPercentage")
                        clearErrors("amiChart.id")
                      },
                    }}
                  />
                </FieldValue>
                <FieldValue label={t("listings.unit.amiPercentage")}>
                  <Select
                    label={t("listings.unit.amiPercentage")}
                    name="amiPercentage"
                    placeholder={t("t.selectOne")}
                    options={amiChartPercentageOptions}
                    labelClassName="sr-only"
                    controlClassName="control"
                    register={register}
                    disabled={!amiChartID}
                    error={fieldHasError(errors?.amiPercentage)}
                    errorMessage={t("errors.requiredFieldError")}
                    validation={{ required: true }}
                  />
                </FieldValue>
                <FieldValue label={t("listings.unit.rentType")}>
                  <FieldGroup
                    name="monthlyRentDeterminationType"
                    type="radio"
                    fields={rentTypeOptions}
                    register={register}
                    error={fieldHasError(errors?.monthlyRentDeterminationType)}
                    errorMessage={t("errors.requiredFieldError")}
                    validation={{ required: true }}
                  />
                </FieldValue>

                {rentType &&
                  (rentType === EnumUnitGroupAmiLevelMonthlyRentDeterminationType.flatRent ? (
                    <FieldValue label={t("listings.unit.monthlyRent")}>
                      <Field
                        label={t("listings.unit.monthlyRent")}
                        name="flatRentValue"
                        id="flatRentValue"
                        readerOnly
                        register={register}
                        type="number"
                        error={errors?.flatRentValue}
                        errorMessage={t("errors.requiredFieldError")}
                        validation={{ required: true }}
                      />
                    </FieldValue>
                  ) : (
                    <FieldValue label={t("listings.unit.percentage")}>
                      <Field
                        label={t("listings.unit.percentage")}
                        name="percentageOfIncomeValue"
                        id="percentageOfIncomeValue"
                        readerOnly
                        register={register}
                        type="number"
                        error={errors?.percentageOfIncomeValue}
                        errorMessage={t("errors.requiredFieldError")}
                        validation={{ required: true }}
                      />
                    </FieldValue>
                  ))}
              </Grid.Row>
            </SectionWithGrid>
          </Card.Section>
        </Card>
      </Drawer.Content>
      <Drawer.Footer>
        <Button
          type="button"
          variant="primary"
          size="sm"
          id={"amiLevelSaveButton"}
          onClick={() => onFormSubmit()}
        >
          {t("t.save")}
        </Button>

        <Button type="button" onClick={onClose} variant="text" size="sm">
          {t("t.cancel")}
        </Button>
      </Drawer.Footer>
    </Form>
  )
}

export default UnitGroupAmiForm
