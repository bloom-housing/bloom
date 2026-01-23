import { DateFieldValues } from "@bloom-housing/ui-components"

export type FormValues = {
  householdSize: string[]
  minIncome?: number
  maxIncome?: number
  amiLevels: string[]
  voucherStatuses: string[]
  accessibilityTypes: string[]
  races: string[]
  ethnicities: string[]
  applicantResidentialCounties: string[]
  applicantWorkCounties: string[]
  minAge?: number
  maxAge?: number
  startDate?: DateFieldValues
  endDate?: DateFieldValues
}
