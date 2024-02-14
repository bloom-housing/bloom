import React, { useContext, Fragment } from "react"
import { t } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { ApplicationContext } from "../../ApplicationContext"
import { IncomePeriod } from "@bloom-housing/backend-core/types"
import { formatIncome } from "../../../../lib/helpers"
import SectionWithGrid from "../../../shared/SectionWithGrid"

const DetailsHouseholdIncome = () => {
  const application = useContext(ApplicationContext)

  return (
    <SectionWithGrid heading={t("application.details.householdIncome")} inset>
      <Grid.Row>
        <FieldValue label={t("application.details.annualIncome")} testId="annualIncome">
          {application.incomePeriod === IncomePeriod.perYear
            ? formatIncome(
                parseFloat(application.income),
                application.incomePeriod,
                IncomePeriod.perYear
              )
            : t("t.n/a")}
        </FieldValue>

        <FieldValue label={t("application.details.monthlyIncome")} testId="monthlyIncome">
          {application.incomePeriod === IncomePeriod.perMonth
            ? formatIncome(
                parseFloat(application.income),
                application.incomePeriod,
                IncomePeriod.perMonth
              )
            : t("t.n/a")}
        </FieldValue>

        <FieldValue label={t("application.details.incomeVouchers")} testId="vouchers">
          {(!application.incomeVouchers || application.incomeVouchers.length === 0) && t("t.n/a")}

          {application.incomeVouchers?.map((item) => (
            <Fragment key={item}>
              {t(`application.financial.vouchers.options.${item}`)}
              <br />
            </Fragment>
          ))}
        </FieldValue>
      </Grid.Row>
    </SectionWithGrid>
  )
}

export { DetailsHouseholdIncome as default, DetailsHouseholdIncome }
