import { Button, Card, Drawer, Grid } from "@bloom-housing/ui-seeds"
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
import styles from "./ListingForm.module.scss"

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
  const [initialAmiPercentage, setInitialAmiPercentage] = useState(null)

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
        let currentLevel
        if (amiChartPercentageOptions.length === 0) {
          currentLevel = amiLevels.find((entry) => entry.tempId === currentTempId)
        }
        setAmiChartPercentageOptions(
          uniquePercentages.map((percentage) => {
            return {
              label: percentage.toString(),
              value: percentage.toString(),
            }
          })
        )
        if (currentLevel) {
          setInitialAmiPercentage(currentLevel.amiPercentage)
        }
        return amiChartData
      } catch (e) {
        console.error(e)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (initialAmiPercentage !== null) {
      setValue("amiPercentage", initialAmiPercentage)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialAmiPercentage])

  return (
    <Form onSubmit={() => false}>
      <Drawer.Content>
        <Card>
          <Card.Section>
            <SectionWithGrid heading={t("listings.unit.amiLevel")}>
              <Grid.Row columns={4}>
                <Grid.Cell>
                  <Select
                    label={t("listings.unit.amiChart")}
                    id="amiChart.id"
                    name="amiChart.id"
                    placeholder={t("t.selectOne")}
                    options={amiChartsOptions}
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
                </Grid.Cell>
                <Grid.Cell>
                  <Select
                    id={"amiPercentage"}
                    label={t("listings.unit.amiPercentage")}
                    name="amiPercentage"
                    placeholder={t("t.selectOne")}
                    options={amiChartPercentageOptions}
                    controlClassName="control"
                    register={register}
                    disabled={!amiChartID}
                    error={fieldHasError(errors?.amiPercentage)}
                    errorMessage={t("errors.requiredFieldError")}
                    validation={{ required: true }}
                  />
                </Grid.Cell>
                <Grid.Cell>
                  <FieldGroup
                    name="monthlyRentDeterminationType"
                    type="radio"
                    fields={rentTypeOptions}
                    register={register}
                    error={fieldHasError(errors?.monthlyRentDeterminationType)}
                    errorMessage={t("errors.requiredFieldError")}
                    validation={{ required: true }}
                    groupLabel={t("listings.unit.rentType")}
                    fieldLabelClassName={styles["label-option"]}
                  />
                </Grid.Cell>

                {rentType &&
                  (rentType === EnumUnitGroupAmiLevelMonthlyRentDeterminationType.flatRent ? (
                    <Grid.Cell>
                      <Field
                        label={t("listings.unit.monthlyRent")}
                        name="flatRentValue"
                        id="flatRentValue"
                        register={register}
                        type="number"
                        error={errors?.flatRentValue}
                        errorMessage={t("errors.requiredFieldError")}
                        validation={{ required: true }}
                      />
                    </Grid.Cell>
                  ) : (
                    <Grid.Cell>
                      <Field
                        label={t("listings.unit.percentage")}
                        name="percentageOfIncomeValue"
                        id="percentageOfIncomeValue"
                        register={register}
                        type="number"
                        error={errors?.percentageOfIncomeValue}
                        errorMessage={t("errors.requiredFieldError")}
                        validation={{ required: true }}
                      />
                    </Grid.Cell>
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
