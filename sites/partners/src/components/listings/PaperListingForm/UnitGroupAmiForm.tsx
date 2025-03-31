import { Button, Card, Drawer, FieldValue, Grid } from "@bloom-housing/ui-seeds"
import SectionWithGrid from "../../shared/SectionWithGrid"
import { Field, FieldGroup, Select, t } from "@bloom-housing/ui-components"
import { useForm, useFormContext, useWatch } from "react-hook-form"
import { useCallback, useContext, useEffect, useState } from "react"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { arrayToFormOptions, fieldHasError } from "../../../lib/helpers"
import {
  AmiChart,
  AmiChartItem,
  EnumUnitGroupAmiLevelMonthlyRentDeterminationType,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { useAmiChartList } from "../../../lib/hooks"

type UnitGroupAmiFormProps = {
  onClose: () => void
}

const UnitGroupAmiForm = ({ onClose }: UnitGroupAmiFormProps) => {
  const { amiChartsService } = useContext(AuthContext)

  const [amiChartsOptions, setAmiChartsOptions] = useState([])
  const [amiChartPercentageOptions, setAmiChartPercentageOptions] = useState([])

  const formMethods = useFormContext()
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { watch, errors } = formMethods
  const jurisdiction: string = watch("jurisdictions.id")
  const { data: amiCharts = [] } = useAmiChartList(jurisdiction)

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, control, clearErrors, setValue } = useForm()

  const amiChartID: string = useWatch({
    control,
    name: "amiChart",
  })

  const rentType: string = useWatch({
    control,
    name: "rentType",
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
              value: percentage,
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

  useEffect(() => {
    if (amiCharts.length === 0 || amiChartsOptions.length) return
    setAmiChartsOptions(arrayToFormOptions<AmiChart>(amiCharts, "name", "id"))
  }, [amiCharts, amiChartsOptions])

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

  return (
    <>
      <Drawer.Content>
        <Card>
          <Card.Section>
            <SectionWithGrid heading={t("listings.unit.amiLevel")}>
              <Grid.Row columns={4}>
                <FieldValue label={t("listings.unit.amiChart")}>
                  <Select
                    label={t("listings.unit.amiChart")}
                    name="amiChart"
                    placeholder={t("listings.unit.amiChart")}
                    options={[{ label: t("t.selectOne"), value: "" }, ...amiChartsOptions]}
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
                    options={[{ label: t("t.selectOne"), value: "" }, ...amiChartPercentageOptions]}
                    labelClassName="sr-only"
                    controlClassName="control"
                    register={register}
                    disabled={!amiChartID}
                  />
                </FieldValue>
                <FieldValue label={t("listings.unit.rentType")}>
                  <FieldGroup
                    name="rentType"
                    type="radio"
                    fields={rentTypeOptions}
                    register={register}
                  />
                </FieldValue>
                {rentType === EnumUnitGroupAmiLevelMonthlyRentDeterminationType.flatRent ? (
                  <FieldValue label={t("listings.unit.monthlyRent")}>
                    <Field
                      label={t("listings.unit.monthlyRent")}
                      name="flatRentValue"
                      id="flatRentValue"
                      readerOnly
                      register={register}
                      type="number"
                      error={errors?.flatRentValue}
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
                    />
                  </FieldValue>
                )}
              </Grid.Row>
            </SectionWithGrid>
          </Card.Section>
        </Card>
      </Drawer.Content>
      <Drawer.Footer>
        <Button type="button" variant="primary" size="sm" id={"amiLevelSaveButton"}>
          {t("t.save")}
        </Button>

        <Button type="button" onClick={onClose} variant="text" size="sm">
          {t("t.cancel")}
        </Button>
      </Drawer.Footer>
    </>
  )
}

export default UnitGroupAmiForm
