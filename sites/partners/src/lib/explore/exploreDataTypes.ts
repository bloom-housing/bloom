export interface IncomeHouseholdSizeCrossTab {
  [householdSize: string]: {
    [AMI: string]: number
  }
}

export interface FrequencyData {
  count: number
  percentage: number
}

export interface RaceFrequency extends FrequencyData {
  race: string
}

export interface EthnicityFrequency extends FrequencyData {
  ethnicity: string
}

export interface SubsidyFrequency extends FrequencyData {
  subsidyType: string
}

export interface AccessibilityFrequency extends FrequencyData {
  accessibilityType: string
}

export interface AgeFrequency extends FrequencyData {
  age: string
}

export interface LocationFrequency extends FrequencyData {
  location: string
}

export interface LanguageFrequency extends FrequencyData {
  language: string
}

export interface ReportProducts {
  incomeHouseholdSizeCrossTab: IncomeHouseholdSizeCrossTab
  raceFrequencies: RaceFrequency[]
  ethnicityFrequencies: EthnicityFrequency[]
  subsidyOrVoucherTypeFrequencies: SubsidyFrequency[]
  accessibilityTypeFrequencies: AccessibilityFrequency[]
  ageFrequencies: AgeFrequency[]
  residentialLocationFrequencies: LocationFrequency[]
  languageFrequencies: LanguageFrequency[]
}

export interface ReportData {
  dateRange: string
  totalProcessedApplications: number
  totalListings: number
  isSufficient: boolean
  kAnonScore: number
  products: ReportProducts
  reportErrors: string[]
}

export interface DateRange {
  preset?: "day" | "week" | "month" | "year" | null
  start_date?: string | null
  end_date?: string | null
}

export interface HouseholdIncome {
  min?: number | null
  max?: number | null
}

export interface Household {
  household_size?: string[] | null
  household_income?: HouseholdIncome | null
  household_ami?: string[] | null
  income_vouchers?: boolean | null
  accessibility?: string[] | null
}

export interface AgeFilter {
  min?: number | null
  max?: number | null
}

export interface Demographics {
  race?: string[] | null
  ethnicity?: string[] | null
  age?: AgeFilter | null
}

export interface Geography {
  cities?: string[] | null
  census_tracts?: string[] | null
  zip_codes?: string[] | null
}

export interface ApiFilters {
  date_range?: DateRange | null
  household?: Household | null
  demographics?: Demographics | null
  geography?: Geography | null
}
