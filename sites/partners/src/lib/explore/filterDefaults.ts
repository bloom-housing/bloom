import { DateFieldValues } from "@bloom-housing/ui-components"
import { ApiFilters } from "./exploreDataTypes"
import { FormValues } from "./filterTypes"

// Centralized default values for form fields
export const FORM_DEFAULT_VALUES: FormValues = {
  householdSize: ["all"],
  amiLevels: ["all"],
  voucherStatuses: ["all"],
  accessibilityTypes: ["all"],
  races: ["all"],
  ethnicities: ["all"],
  applicantResidentialCounties: ["all"],
  applicantWorkCounties: ["all"],
  minAge: undefined,
  maxAge: undefined,
  startDate: undefined,
  endDate: undefined,
  minIncome: undefined,
  maxIncome: undefined,
}

// Helper function to convert DateFieldValues to ISO 8601 datetime string with timezone
const getDateString = (dateField: DateFieldValues | null | undefined): string | null => {
  if (!dateField?.year || !dateField?.month || !dateField?.day) {
    return null
  }
  // Pad month and day with leading zeros if needed
  const month = dateField.month.padStart(2, "0")
  const day = dateField.day.padStart(2, "0")
  // Return ISO 8601 format with UTC timezone: YYYY-MM-DDTHH:MM:SSZ
  // Using start of day (00:00:00) in UTC
  return `${dateField.year}-${month}-${day}T00:00:00Z`
}

// Helper to get numeric value or null
const getNumericValue = (num: number | null | undefined): number | null =>
  num !== undefined && !isNaN(num) ? num : null

// Helper to filter out "all" values - return null if array contains "all", otherwise return the array
const filterAllValues = (arr: string[] | undefined): string[] | null => {
  if (!arr || arr.length === 0 || arr.includes("all")) {
    return null
  }
  return arr
}

// Function to convert form values to API filters
export const formValuesToApiFilters = (filters: FormValues): ApiFilters => {
  const startDate = getDateString(filters.startDate)
  const endDate = getDateString(filters.endDate)
  const dateRange =
    startDate || endDate
      ? {
          start_date: startDate,
          end_date: endDate,
        }
      : null

  // Build household object
  const minIncome = getNumericValue(filters.minIncome)
  const maxIncome = getNumericValue(filters.maxIncome)

  // Convert voucherStatuses to boolean flags
  // If "all" is selected, return null for both. Otherwise check for specific values.
  const voucherStatusesFiltered = filterAllValues(filters.voucherStatuses)
  const incomeVouchers = voucherStatusesFiltered?.includes("voucher") ?? null

  const household = {
    household_size: filterAllValues(filters.householdSize),
    household_income:
      minIncome || maxIncome
        ? {
            min: minIncome,
            max: maxIncome,
          }
        : null,
    household_ami: filterAllValues(filters.amiLevels),
    income_vouchers: incomeVouchers,
    accessibility: filterAllValues(filters.accessibilityTypes),
  }

  // Build demographics object
  const minAge = getNumericValue(filters.minAge)
  const maxAge = getNumericValue(filters.maxAge)
  const demographics = {
    race: filterAllValues(filters.races),
    ethnicity: filterAllValues(filters.ethnicities),
    age:
      minAge || maxAge
        ? {
            min: minAge,
            max: maxAge,
          }
        : null,
  }

  // Build geography object
  const geography = {
    cities: filterAllValues(filters.applicantResidentialCounties),
    census_tracts: null,
    zip_codes: filterAllValues(filters.applicantWorkCounties),
  }

  // Convert FormValues to ApiFilters format matching Python ReportFilters structure
  // Always include all filter objects with their fields, even if values are null
  return {
    date_range: dateRange,
    household: household,
    demographics: demographics,
    geography: geography,
  }
}

// Default API filters (derived from form defaults)
export const DEFAULT_API_FILTERS = formValuesToApiFilters(FORM_DEFAULT_VALUES)
