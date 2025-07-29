import React from "react"
import { t, Field, Select } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { useFormContext } from "react-hook-form"
import {
  IncomePeriodEnum,
  YesNoEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import SectionWithGrid from "../../../shared/SectionWithGrid"

const FormHouseholdIncome = () => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, setValue, watch } = formMethods

  const incomePeriodValue: string = watch("application.incomePeriod")

  return (
    <>
      <hr className="spacer-section-above spacer-section" />
      <SectionWithGrid heading={t("application.details.householdIncome")}>
        <Grid.Row columns={3}>
          <Grid.Cell>
            <FieldValue label={t("application.add.incomePeriod")}>
              <div className="flex h-12 items-center">
                <Field
                  id="application.incomePeriodYear"
                  name="application.incomePeriod"
                  className="m-0"
                  type="radio"
                  label={t("t.perYear")}
                  register={register}
                  inputProps={{
                    value: IncomePeriodEnum.perYear,
                    onChange: () => {
                      setValue("incomeMonth", "")
                      setValue("incomeYear", "")
                    },
                  }}
                />

                <Field
                  id="application.incomePeriodMonth"
                  name="application.incomePeriod"
                  className="m-0"
                  type="radio"
                  label={t("t.perMonth")}
                  register={register}
                  inputProps={{
                    value: IncomePeriodEnum.perMonth,
                    onChange: () => {
                      setValue("incomeMonth", "")
                      setValue("incomeYear", "")
                    },
                  }}
                />
              </div>
            </FieldValue>
          </Grid.Cell>
        </Grid.Row>

        <Grid.Row columns={3}>
          <Grid.Cell>
            <Field
              id="incomeYear"
              type="number"
              name="incomeYear"
              label={t("application.details.annualIncome")}
              placeholder={t("t.enterAmount")}
              register={register}
              disabled={incomePeriodValue !== IncomePeriodEnum.perYear}
            />
          </Grid.Cell>

          <Grid.Cell>
            <Field
              id="incomeMonth"
              type="number"
              name="incomeMonth"
              label={t("application.details.monthlyIncome")}
              placeholder={t("t.enterAmount")}
              register={register}
              disabled={incomePeriodValue !== IncomePeriodEnum.perMonth}
            />
          </Grid.Cell>

          <Grid.Cell>
            <Select
              id="application.incomeVouchers"
              name="application.incomeVouchers"
              placeholder={t("t.selectOne")}
              label={t("application.details.vouchers")}
              register={register}
              controlClassName="control"
              options={[YesNoEnum.yes, YesNoEnum.no]}
              keyPrefix="t"
            />
          </Grid.Cell>
        </Grid.Row>
      </SectionWithGrid>
    </>
  )
}

export { FormHouseholdIncome as default, FormHouseholdIncome }
