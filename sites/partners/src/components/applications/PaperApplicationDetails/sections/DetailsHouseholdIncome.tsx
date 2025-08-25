import React, { useContext, Fragment } from "react"
import { t } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { ApplicationContext } from "../../ApplicationContext"
import { formatIncome } from "../../../../lib/helpers"
import SectionWithGrid from "../../../shared/SectionWithGrid"
import { IncomePeriodEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

const DetailsHouseholdIncome = () => {
  const application = useContext(ApplicationContext)

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
          <FieldValue label={t("application.details.incomeVouchers")} testId="vouchers">
            {(!application.incomeVouchers || application.incomeVouchers.length === 0) && t("t.n/a")}

            {application.incomeVouchers?.map((item) => (
              <Fragment key={item}>
                {t(`application.financial.vouchers.options.${item}`)}
                <br />
              </Fragment>
            ))}
          </FieldValue>
        </Grid.Cell>
      </Grid.Row>
    </SectionWithGrid>
  )
}

export { DetailsHouseholdIncome as default, DetailsHouseholdIncome }
