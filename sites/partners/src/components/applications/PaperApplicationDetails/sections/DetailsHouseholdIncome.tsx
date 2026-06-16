import React, { useContext } from "react"
import { t } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { ApplicationContext } from "../../ApplicationContext"
import { formatIncome } from "../../../../lib/helpers"
import SectionWithGrid from "../../../shared/SectionWithGrid"
import { IncomePeriodEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

type DetailsHouseholdIncomeProps = {
  enableMultiselectVoucherQuestion?: boolean
}

const DetailsHouseholdIncome = ({
  enableMultiselectVoucherQuestion,
}: DetailsHouseholdIncomeProps) => {
  const application = useContext(ApplicationContext)

  const renderVouchers = () => {
    if (enableMultiselectVoucherQuestion) {
      if (!application.incomeVouchers || application.incomeVouchers.length === 0) {
        return t("t.n/a")
      }
      return application.incomeVouchers
        .map((v) => t(`application.financial.vouchers.${v}`))
        .join(", ")
    }
    if (application.incomeVouchers === null || application.incomeVouchers === undefined) {
      return t("t.n/a")
    }
    return application.incomeVouchers?.includes("incomeVoucher") ? t("t.yes") : t("t.no")
  }

  return (
    <SectionWithGrid heading={t("application.details.householdIncome")} inset>
      <Grid.Row>
        <Grid.Cell>
          <FieldValue label={t("application.details.annualIncome")} testId="annualIncome">
            {application.incomePeriod === IncomePeriodEnum.perYear
              ? formatIncome(
                  parseFloat(application.income),
                  application.incomePeriod,
                  IncomePeriodEnum.perYear
                )
              : t("t.n/a")}
          </FieldValue>
        </Grid.Cell>

        <Grid.Cell>
          <FieldValue label={t("application.details.monthlyIncome")} testId="monthlyIncome">
            {application.incomePeriod === IncomePeriodEnum.perMonth
              ? formatIncome(
                  parseFloat(application.income),
                  application.incomePeriod,
                  IncomePeriodEnum.perMonth
                )
              : t("t.n/a")}
          </FieldValue>
        </Grid.Cell>

        <Grid.Cell>
          <FieldValue label={t("application.details.vouchers")} testId="vouchers">
            {renderVouchers()}
          </FieldValue>
        </Grid.Cell>
      </Grid.Row>
    </SectionWithGrid>
  )
}

export { DetailsHouseholdIncome as default, DetailsHouseholdIncome }
