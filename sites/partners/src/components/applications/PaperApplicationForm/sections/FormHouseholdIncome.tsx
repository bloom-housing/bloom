import React from "react"
import { t, Field, FieldGroup } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { useFormContext } from "react-hook-form"
import { IncomePeriodEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import SectionWithGrid from "../../../shared/SectionWithGrid"

type FormHouseholdIncomeProps = {
  enableMultiselectVoucherQuestion?: boolean
}

const FormHouseholdIncome = ({ enableMultiselectVoucherQuestion }: FormHouseholdIncomeProps) => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, setValue, watch } = formMethods

  const incomePeriodValue: string = watch("application.incomePeriod")

  const incomeVouchersValue: string[] = watch("application.incomeVouchers") || []

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
              type={enableMultiselectVoucherQuestion ? "checkbox" : "radio"}
              name={
                enableMultiselectVoucherQuestion
                  ? "application.incomeVouchers"
                  : "application.incomeVouchersYesNo"
              }
              register={register}
              fields={
                enableMultiselectVoucherQuestion
                  ? [
                      {
                        id: "application.incomeVouchers.issuedVouchers",
                        value: "issuedVouchers",
                        label: t("application.financial.vouchers.issuedVouchers"),
                        inputProps: {
                          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                            if (e.target.checked) {
                              setValue("application.incomeVouchers", [
                                ...new Set([
                                  ...incomeVouchersValue.filter((v) => v !== "none"),
                                  "issuedVouchers",
                                ]),
                              ])
                            }
                          },
                        },
                      },
                      {
                        id: "application.incomeVouchers.rentalAssistance",
                        value: "rentalAssistance",
                        label: t("application.financial.vouchers.rentalAssistance"),
                        inputProps: {
                          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                            if (e.target.checked) {
                              setValue("application.incomeVouchers", [
                                ...new Set([
                                  ...incomeVouchersValue.filter((v) => v !== "none"),
                                  "rentalAssistance",
                                ]),
                              ])
                            }
                          },
                        },
                      },
                      {
                        id: "application.incomeVouchers.none",
                        value: "none",
                        label: t("application.financial.vouchers.none"),
                        inputProps: {
                          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                            if (e.target.checked) {
                              setValue("application.incomeVouchers", ["none"])
                            }
                          },
                        },
                      },
                    ]
                  : [
                      {
                        id: "incomeVoucherYes",
                        value: "incomeVoucher",
                        label: t("t.yes"),
                        defaultChecked: incomeVouchersValue?.includes("incomeVoucher"),
                      },
                      {
                        id: "incomeVoucherNo",
                        value: "none",
                        label: t("t.no"),
                        defaultChecked:
                          incomeVouchersValue?.includes("none") || incomeVouchersValue.length === 0,
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
