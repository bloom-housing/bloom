import React from "react"
import { t, Field, FieldGroup } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { vouchersOrRentalAssistanceKeys } from "@bloom-housing/shared-helpers"
import { useFormContext } from "react-hook-form"
import { IncomePeriod } from "@bloom-housing/backend-core/types"
import SectionWithGrid from "../../../shared/SectionWithGrid"

const FormHouseholdIncome = () => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, setValue, watch } = formMethods

  const incomeVouchersOptions = vouchersOrRentalAssistanceKeys.map((item) => ({
    id: item,
    label: t(`application.financial.vouchers.options.${item}`),
  }))

  const incomePeriodValue: string = watch("application.incomePeriod")

  return (
    <>
      <hr className="spacer-section-above spacer-section" />
      <SectionWithGrid heading={t("application.details.householdIncome")}>
        <Grid.Row columns={3}>
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
                  value: IncomePeriod.perYear,
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
                  value: IncomePeriod.perMonth,
                  onChange: () => {
                    setValue("incomeMonth", "")
                    setValue("incomeYear", "")
                  },
                }}
              />
            </div>
          </FieldValue>
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
              disabled={incomePeriodValue !== IncomePeriod.perYear}
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
              disabled={incomePeriodValue !== IncomePeriod.perMonth}
            />
          </Grid.Cell>

          <Grid.Cell>
            <FieldGroup
              name="application.incomeVouchers"
              fields={incomeVouchersOptions}
              groupLabel={t("application.details.incomeVouchers")}
              type="checkbox"
              register={register}
              dataTestId={"app-income-vouchers"}
            />
          </Grid.Cell>
        </Grid.Row>
      </SectionWithGrid>
    </>
  )
}

export { FormHouseholdIncome as default, FormHouseholdIncome }
