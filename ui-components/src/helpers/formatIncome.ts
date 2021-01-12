import { IncomePeriod } from "@bloom-housing/backend-core/types"

export function formatIncome(value: number, period: IncomePeriod, returnType: IncomePeriod) {
  const usd = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

  const monthIncomeNumber = period === "perYear" ? value / 12 : value
  const yearIncomeNumber = period === "perMonth" ? value * 12 : value

  const perMonth = usd.format(monthIncomeNumber)
  const perYear = usd.format(yearIncomeNumber)

  if (returnType === "perMonth") return perMonth

  return perYear
}
