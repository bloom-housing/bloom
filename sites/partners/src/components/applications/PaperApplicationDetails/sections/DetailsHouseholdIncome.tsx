import React, { useContext } from "react"
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

        <FieldValue label={t("application.details.vouchers")} testId="vouchers">
          {(() => {
            if (application.incomeVouchers === null) return t("t.n/a")

            if (application.incomeVouchers) {
              return t("t.yes")
            }

            return t("t.no")
          })()}
        </FieldValue>
      </Grid.Row>
    </SectionWithGrid>
  )
}

export { DetailsHouseholdIncome as default, DetailsHouseholdIncome }
