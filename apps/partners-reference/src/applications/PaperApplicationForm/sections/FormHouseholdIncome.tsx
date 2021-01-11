import React from "react"
import { t, GridSection, ViewItem, GridCell, Field, Select } from "@bloom-housing/ui-components"
import { useFormContext } from "react-hook-form"

export enum FormHouseholdIncomeFields {
  IncomePeriod = "application.incomePeriod",
  IncomeYear = "incomeYear",
  IncomeMonth = "incomeMonth",
  IncomeVouchers = "application.incomeVouchers",
}

export enum FormHouseholdIncomePeriodType {
  PerYear = "perYear",
  PerMonth = "perMonth",
}

export type IncomeVouchersOptionsType = "yes" | "no"

const incomeVouchersOptions: IncomeVouchersOptionsType[] = ["yes", "no"]

const FormHouseholdIncome = () => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, setValue, watch } = formMethods

  const incomePeriodValue: string = watch("application.incomePeriod")

  return (
    <GridSection title={t("application.details.householdIncome")} grid={false} separator>
      <GridSection columns={3}>
        <GridCell>
          <ViewItem label={t("application.add.incomePeriod")}>
            <div className="flex h-12 items-center">
              <Field
                id={`${FormHouseholdIncomeFields.IncomePeriod}Year`}
                name={FormHouseholdIncomeFields.IncomePeriod}
                className="m-0"
                type="radio"
                label={t("t.perYear")}
                register={register}
                inputProps={{
                  value: FormHouseholdIncomePeriodType.PerYear,
                  onChange: () => {
                    setValue(FormHouseholdIncomeFields.IncomeMonth, "")
                    setValue(FormHouseholdIncomeFields.IncomeYear, "")
                  },
                }}
              />

              <Field
                id={`${FormHouseholdIncomeFields.IncomePeriod}Month`}
                name={FormHouseholdIncomeFields.IncomePeriod}
                className="m-0"
                type="radio"
                label={t("t.perMonth")}
                register={register}
                inputProps={{
                  value: FormHouseholdIncomePeriodType.PerMonth,
                  onChange: () => {
                    setValue(FormHouseholdIncomeFields.IncomeMonth, "")
                    setValue(FormHouseholdIncomeFields.IncomeYear, "")
                  },
                }}
              />
            </div>
          </ViewItem>
        </GridCell>
      </GridSection>

      <GridSection columns={3}>
        <GridCell>
          <ViewItem label={t("application.details.annualIncome")}>
            <Field
              id={FormHouseholdIncomeFields.IncomeYear}
              name={FormHouseholdIncomeFields.IncomeYear}
              type="number"
              label={t("application.details.annualIncome")}
              placeholder={t("t.enterAmount")}
              register={register}
              disabled={incomePeriodValue !== FormHouseholdIncomePeriodType.PerYear}
              readerOnly
            />
          </ViewItem>
        </GridCell>

        <GridCell>
          <ViewItem label={t("application.details.monthlyIncome")}>
            <Field
              id={FormHouseholdIncomeFields.IncomeMonth}
              name={FormHouseholdIncomeFields.IncomeMonth}
              type="number"
              label={t("application.details.monthlyIncome")}
              placeholder={t("t.enterAmount")}
              register={register}
              disabled={incomePeriodValue !== FormHouseholdIncomePeriodType.PerMonth}
              readerOnly
            />
          </ViewItem>
        </GridCell>

        <GridCell>
          <ViewItem label={t("application.details.vouchers")}>
            <Select
              id={FormHouseholdIncomeFields.IncomeVouchers}
              name={FormHouseholdIncomeFields.IncomeVouchers}
              placeholder={t("t.selectOne")}
              label={t("application.details.vouchers")}
              labelClassName="sr-only"
              register={register}
              controlClassName="control"
              options={incomeVouchersOptions}
              keyPrefix="t"
            />
          </ViewItem>
        </GridCell>
      </GridSection>
    </GridSection>
  )
}

export { FormHouseholdIncome as default, FormHouseholdIncome }
