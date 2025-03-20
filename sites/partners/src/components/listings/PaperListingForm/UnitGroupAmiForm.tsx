import { Button, Card, Drawer, FieldValue, Grid } from "@bloom-housing/ui-seeds"
import SectionWithGrid from "../../shared/SectionWithGrid"
import { Field, FieldGroup, Select, t } from "@bloom-housing/ui-components"
import { useForm, useFormContext, useWatch } from "react-hook-form"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { arrayToFormOptions } from "../../../lib/helpers"
import {
  AmiChart,
  EnumUnitGroupAmiLevelMonthlyRentDeterminationType,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { useAmiChartList } from "../../../lib/hooks"

type UnitGroupAmiFormProps = {
  onClose: () => void
}

const UnitGroupAmiForm = ({ onClose }: UnitGroupAmiFormProps) => {
  const { amiChartsService } = useContext(AuthContext)

  const [amiChartsOptions, setAmiChartsOptions] = useState([])

  const formMethods = useFormContext()
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { watch, errors } = formMethods
  const jurisdiction: string = watch("jurisdictions.id")
  const { data: amiCharts = [] } = useAmiChartList(jurisdiction)

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, control } = useForm()

  const amiPercentage: string = useWatch({
    control,
    name: "amiPercentage",
  })
  const amiChartID: string = useWatch({
    control,
    name: "amiChart.id",
  })

  const rentType: string = useWatch({
    control,
    name: "rentType",
  })

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
                    options={[{ label: t("t.selectOne"), value: "" }, ...amiChartsOptions]}
                    labelClassName="sr-only"
                    controlClassName="control"
                    register={register}
                  />
                </FieldValue>
                <FieldValue label={t("listings.unit.amiPercentage")}>
                  <Select
                    label={t("listings.unit.amiPercentage")}
                    name="amiChart"
                    options={[{ label: t("t.selectOne"), value: "" }]}
                    labelClassName="sr-only"
                    controlClassName="control"
                    register={register}
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
