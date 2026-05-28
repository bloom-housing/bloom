import React from "react"
import { t, Field, FieldGroup } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { useFormContext } from "react-hook-form"
import {
  IncomePeriodEnum,
  YesNoEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import SectionWithGrid from "../../../shared/SectionWithGrid"

type FormHouseholdIncomeProps = {
  enableSection8vsRentalAssistance?: boolean
}

const FormHouseholdIncome = ({ enableSection8vsRentalAssistance }: FormHouseholdIncomeProps) => {
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
            <FieldGroup
              fieldGroupClassName="grid grid-cols-1"
              fieldClassName="ml-0"
              type={enableSection8vsRentalAssistance ? "checkbox" : "radio"}
              name="application.incomeVouchers"
              register={register}
              fields={
                enableSection8vsRentalAssistance
                  ? [
                      {
                        id: "application.incomeVouchers.issuedVouchers",
                        value: "issuedVouchers",
                        label: t("application.financial.vouchers.issuedVouchers"),
                      },
                      {
                        id: "application.incomeVouchers.rentalAssistance",
                        value: "rentalAssistance",
                        label: t("application.financial.vouchers.rentalAssistance"),
                      },
                      {
                        id: "application.incomeVouchers.none",
                        value: "none",
                        label: t("application.financial.vouchers.none"),
                      },
                    ]
                  : [
                      // TODO: get this to work
                      {
                        id: "application.incomeVouchers.incomeVoucher",
                        value: "incomeVoucher",
                        label: YesNoEnum.yes,
                        inputProps: {
                          onChange: (e) => {
                            if (e.target.checked) {
                              setValue("application.incomeVouchers", ["incomeVoucher"])
                            }
                          },
                        },
                      },
                      {
                        id: "application.incomeVouchers.none",
                        value: "none",
                        label: YesNoEnum.no,
                        inputProps: {
                          onChange: (e) => {
                            if (e.target.checked) {
                              setValue("application.incomeVouchers", ["none"])
                            }
                          },
                        },
                      },
                    ]
              }
              groupLabel={t("application.details.vouchers")}
            />
          </Grid.Cell>
        </Grid.Row>
      </SectionWithGrid>
    </>
  )
}

export { FormHouseholdIncome as default, FormHouseholdIncome }
