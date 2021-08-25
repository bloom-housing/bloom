import React, { useContext } from "react"
import { t, GridSection, ViewItem, GridCell } from "@bloom-housing/ui-components"
import { ApplicationContext } from "../../ApplicationContext"
import { IncomePeriod } from "@bloom-housing/backend-core/types"
import { formatIncome } from "../../../../lib/helpers"

const DetailsHouseholdIncome = () => {
  const application = useContext(ApplicationContext)

  return (
    <GridSection
      className="bg-primary-lighter"
      title={t("application.details.householdIncome")}
      inset
    >
      <GridCell>
        <ViewItem label={t("application.details.annualIncome")}>
          {application.incomePeriod === IncomePeriod.perYear
            ? formatIncome(
                parseFloat(application.income),
                application.incomePeriod,
                IncomePeriod.perYear
              )
            : t("t.n/a")}
        </ViewItem>
      </GridCell>

      <GridCell>
        <ViewItem label={t("application.details.monthlyIncome")}>
          {application.incomePeriod === IncomePeriod.perMonth
            ? formatIncome(
                parseFloat(application.income),
                application.incomePeriod,
                IncomePeriod.perMonth
              )
            : t("t.n/a")}
        </ViewItem>
      </GridCell>

      <GridCell>
        <ViewItem label={t("application.details.vouchers")}>
          {(() => {
            if (application.incomeVouchers === null) return t("t.n/a")

            if (application.incomeVouchers) {
              return t("t.yes")
            }

            return t("t.no")
          })()}
        </ViewItem>
      </GridCell>
    </GridSection>
  )
}

export { DetailsHouseholdIncome as default, DetailsHouseholdIncome }
