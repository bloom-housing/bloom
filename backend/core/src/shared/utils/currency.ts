import { MinMaxCurrency } from "../../units/types/min-max-currency"

export const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

export const getRoundedNumber = (initialValue: string) => {
  return parseFloat(parseFloat(initialValue).toFixed(2))
}

export const getCurrencyString = (initialValue: string) => {
  return usd.format(getRoundedNumber(initialValue))
}

export const yearlyCurrencyStringToMonthly = (currency: string) => {
  return usd.format(parseFloat(currency.replace(/[^0-9.-]+/g, "")) / 12)
}

export const minMaxCurrency = (baseValue: MinMaxCurrency, newValue: number): MinMaxCurrency => {
  return {
    min: usd.format(Math.min(parseFloat(baseValue.min.replace(/[^0-9.-]+/g, "")), newValue)),
    max: usd.format(Math.max(parseFloat(baseValue.max.replace(/[^0-9.-]+/g, "")), newValue)),
  }
}
