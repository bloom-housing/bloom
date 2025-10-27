import axios from "axios"

export interface ReportFilters {
  dateRange: string
}

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
  reportFilters: ReportFilters
  totalProcessedApplications: number
  totalListings: number
  isSufficient: boolean
  kAnonScore: number
  products: ReportProducts
  reportErrors: string[]
}

// ── Conversational System Context ─────────────────────────────────────────────
export const conversationalSystemContext = {
  role: "housing_data_analyst",
  capabilities: [
    "Analyze affordable housing application patterns",
    "Identify demographic trends and insights",
    "Provide recommendations for housing policy",
    "Compare data across different time periods",
    "Explain statistical significance of findings",
  ],
  conversationStarters: [
    "What patterns do you see in the income distribution?",
    "Which demographic groups are most represented in applications?",
    "Are there any accessibility accommodations we should prioritize?",
    "How does our applicant pool compare to the broader community?",
    "What does this data tell us about housing need in our area?",
  ],
  contextualPrompts: {
    income_analysis:
      "When discussing income data, consider AMI ranges, household sizes, and affordability gaps",
    demographics:
      "For demographic analysis, look at representation, diversity, and potential outreach opportunities",
    accessibility:
      "When analyzing accessibility needs, focus on accommodation requirements and inclusive design",
    location:
      "For residential location data, consider displacement patterns and community connections",
    policy_insights:
      "Provide actionable recommendations that housing authorities and developers can implement",
  },
  conversationStyle: {
    tone: "professional yet approachable",
    expertise_level: "intermediate to advanced housing professional",
    response_length: "concise but comprehensive",
    data_presentation: "use specific numbers and percentages when relevant",
    recommendations: "always include actionable next steps",
  },
}

const API_BASE_URL = "http://127.0.0.1:8000"

export interface ApiFilters {
  householdSize?: string[] | null
  minIncome?: number | null
  maxIncome?: number | null
  amiLevels?: string[] | null
  voucherStatuses?: string[] | null
  accessibilityTypes?: string[] | null
  races?: string[] | null
  ethnicities?: string[] | null
  applicantResidentialCounties?: string[] | null
  applicantWorkCounties?: string[] | null
  minAge?: number | null
  maxAge?: number | null
  startDate?: string | null
  endDate?: string | null
}

export const getReportDataFastAPI = async (filters?: ApiFilters) => {
  console.log("Fetching data from API...")
  try {
    const url = `${API_BASE_URL}/generate-report`
    const response = filters ? await axios.post(url, filters) : await axios.get(url)
    console.log("Data returned from API:", response.data)
    return response.data as ReportData
  } catch (error) {
    console.error("Error returning data:", error)
    console.log("Falling back to default report data")
    return reportDataOption1
  }
}

// ── Option 1: Balanced distribution (more random) ─────────────────────────────
export const reportDataOption1: ReportData = {
  reportFilters: { dateRange: "01/01/2025 - 06/30/2025" },
  totalProcessedApplications: 13293,
  totalListings: 24,
  isSufficient: true,
  kAnonScore: 5,
  products: {
    incomeHouseholdSizeCrossTab: {
      "1": { "0-30% AMI": 23, "31-50% AMI": 67, "51-80% AMI": 89, "81-120% AMI": 41 },
      "2": { "0-30% AMI": 54, "31-50% AMI": 78, "51-80% AMI": 32, "81-120% AMI": 16 },
      "3": { "0-30% AMI": 45, "31-50% AMI": 68, "51-80% AMI": 72, "81-120% AMI": 55 },
      "4+": { "0-30% AMI": 31, "31-50% AMI": 82, "51-80% AMI": 58, "81-120% AMI": 49 },
    },
    raceFrequencies: [
      { race: "Asian", count: 217, percentage: 0.217 },
      { race: "Black or African American", count: 183, percentage: 0.183 },
      { race: "Hispanic or Latino", count: 210, percentage: 0.21 },
      { race: "White", count: 312, percentage: 0.312 },
      { race: "Multiracial", count: 78, percentage: 0.078 },
    ],
    ethnicityFrequencies: [
      { ethnicity: "Hispanic or Latino", count: 250, percentage: 0.25 },
      { ethnicity: "Not Hispanic or Latino", count: 750, percentage: 0.75 },
    ],
    subsidyOrVoucherTypeFrequencies: [
      { subsidyType: "Section 8", count: 312, percentage: 0.312 },
      { subsidyType: "Housing Choice Voucher", count: 241, percentage: 0.241 },
      { subsidyType: "Project-Based Voucher", count: 187, percentage: 0.187 },
      { subsidyType: "None", count: 260, percentage: 0.26 },
    ],
    accessibilityTypeFrequencies: [
      { accessibilityType: "Wheelchair Accessible", count: 134, percentage: 0.134 },
      { accessibilityType: "Hearing Impaired", count: 52, percentage: 0.052 },
      { accessibilityType: "Visual Impairment", count: 43, percentage: 0.043 },
      { accessibilityType: "None", count: 771, percentage: 0.771 },
    ],
    ageFrequencies: [
      { age: "18-24", count: 132, percentage: 0.132 },
      { age: "25-34", count: 298, percentage: 0.298 },
      { age: "35-44", count: 307, percentage: 0.307 },
      { age: "45-54", count: 151, percentage: 0.151 },
      { age: "55+", count: 112, percentage: 0.112 },
    ],
    residentialLocationFrequencies: [
      { location: "Oakland", count: 418, percentage: 0.418 },
      { location: "Berkeley", count: 276, percentage: 0.276 },
      { location: "Alameda", count: 194, percentage: 0.194 },
      { location: "Other", count: 112, percentage: 0.112 },
    ],
    languageFrequencies: [
      { language: "English", count: 846, percentage: 0.846 },
      { language: "Spanish", count: 84, percentage: 0.084 },
      { language: "Chinese", count: 42, percentage: 0.042 },
      { language: "Other", count: 28, percentage: 0.028 },
    ],
  },
  reportErrors: [],
}

// ── Option 2: Low-income & younger skew ──────────────────────────────────────────
export const reportDataOption2: ReportData = {
  reportFilters: { dateRange: "01/01/2025 - 06/30/2025" },
  totalProcessedApplications: 800,
  totalListings: 18,
  isSufficient: true,
  kAnonScore: 3,
  products: {
    incomeHouseholdSizeCrossTab: {
      "1": { "0-30% AMI": 120, "31-50% AMI": 50, "51-80% AMI": 20, "81-120% AMI": 10 },
      "2": { "0-30% AMI": 150, "31-50% AMI": 80, "51-80% AMI": 30, "81-120% AMI": 20 },
      "3": { "0-30% AMI": 100, "31-50% AMI": 60, "51-80% AMI": 40, "81-120% AMI": 20 },
      "4+": { "0-30% AMI": 80, "31-50% AMI": 40, "51-80% AMI": 30, "81-120% AMI": 10 },
    },
    raceFrequencies: [
      { race: "Asian", count: 80, percentage: 0.1 },
      { race: "Black or African American", count: 240, percentage: 0.3 },
      { race: "Hispanic or Latino", count: 160, percentage: 0.2 },
      { race: "White", count: 240, percentage: 0.3 },
      { race: "Other/Multiracial", count: 80, percentage: 0.1 },
    ],
    ethnicityFrequencies: [
      { ethnicity: "Hispanic or Latino", count: 200, percentage: 0.25 },
      { ethnicity: "Not Hispanic or Latino", count: 600, percentage: 0.75 },
    ],
    subsidyOrVoucherTypeFrequencies: [
      { subsidyType: "Section 8", count: 360, percentage: 0.45 },
      { subsidyType: "Housing Choice Voucher", count: 240, percentage: 0.3 },
      { subsidyType: "Project-Based Voucher", count: 120, percentage: 0.15 },
      { subsidyType: "None", count: 80, percentage: 0.1 },
    ],
    accessibilityTypeFrequencies: [
      { accessibilityType: "Wheelchair Accessible", count: 120, percentage: 0.15 },
      { accessibilityType: "Hearing Impaired", count: 40, percentage: 0.05 },
      { accessibilityType: "Visual Impairment", count: 40, percentage: 0.05 },
      { accessibilityType: "None", count: 600, percentage: 0.75 },
    ],
    ageFrequencies: [
      { age: "18-24", count: 240, percentage: 0.3 },
      { age: "25-34", count: 280, percentage: 0.35 },
      { age: "35-44", count: 160, percentage: 0.2 },
      { age: "45-54", count: 80, percentage: 0.1 },
      { age: "55+", count: 40, percentage: 0.05 },
    ],
    residentialLocationFrequencies: [
      { location: "Oakland", count: 360, percentage: 0.45 },
      { location: "Berkeley", count: 200, percentage: 0.25 },
      { location: "Alameda", count: 160, percentage: 0.2 },
      { location: "Other", count: 80, percentage: 0.1 },
    ],
    languageFrequencies: [
      { language: "English", count: 560, percentage: 0.7 },
      { language: "Spanish", count: 160, percentage: 0.2 },
      { language: "Traditional Chinese", count: 40, percentage: 0.05 },
      { language: "Other", count: 40, percentage: 0.05 },
    ],
  },
  reportErrors: [],
}

// ── Option 3: High-income & older skew ──────────────────────────────────────────
export const reportDataOption3: ReportData = {
  reportFilters: { dateRange: "01/01/2025 - 06/30/2025" },
  totalProcessedApplications: 1200,
  totalListings: 32,
  isSufficient: true,
  kAnonScore: 10,
  products: {
    incomeHouseholdSizeCrossTab: {
      "1": { "0-30% AMI": 10, "31-50% AMI": 20, "51-80% AMI": 80, "81-120% AMI": 90 },
      "2": { "0-30% AMI": 15, "31-50% AMI": 25, "51-80% AMI": 90, "81-120% AMI": 100 },
      "3": { "0-30% AMI": 20, "31-50% AMI": 30, "51-80% AMI": 100, "81-120% AMI": 110 },
      "4+": { "0-30% AMI": 25, "31-50% AMI": 35, "51-80% AMI": 110, "81-120% AMI": 120 },
    },
    raceFrequencies: [
      { race: "Asian", count: 240, percentage: 0.2 },
      { race: "Black or African American", count: 120, percentage: 0.1 },
      { race: "Hispanic or Latino", count: 240, percentage: 0.2 },
      { race: "White", count: 600, percentage: 0.5 },
    ],
    ethnicityFrequencies: [
      { ethnicity: "Hispanic or Latino", count: 240, percentage: 0.2 },
      { ethnicity: "Not Hispanic or Latino", count: 960, percentage: 0.8 },
    ],
    subsidyOrVoucherTypeFrequencies: [
      { subsidyType: "Section 8", count: 120, percentage: 0.1 },
      { subsidyType: "Housing Choice Voucher", count: 120, percentage: 0.1 },
      { subsidyType: "Project-Based Voucher", count: 120, percentage: 0.1 },
      { subsidyType: "None", count: 840, percentage: 0.7 },
    ],
    accessibilityTypeFrequencies: [
      { accessibilityType: "Wheelchair Accessible", count: 60, percentage: 0.05 },
      { accessibilityType: "Hearing Impaired", count: 60, percentage: 0.05 },
      { accessibilityType: "Visual Impairment", count: 60, percentage: 0.05 },
      { accessibilityType: "None", count: 1020, percentage: 0.85 },
    ],
    ageFrequencies: [
      { age: "18-24", count: 60, percentage: 0.05 },
      { age: "25-34", count: 120, percentage: 0.1 },
      { age: "35-44", count: 240, percentage: 0.2 },
      { age: "45-54", count: 360, percentage: 0.3 },
      { age: "55+", count: 420, percentage: 0.35 },
    ],
    residentialLocationFrequencies: [
      { location: "Oakland", count: 360, percentage: 0.3 },
      { location: "Berkeley", count: 360, percentage: 0.3 },
      { location: "Alameda", count: 240, percentage: 0.2 },
      { location: "Other", count: 240, percentage: 0.2 },
    ],
    languageFrequencies: [
      { language: "English", count: 1080, percentage: 0.9 },
      { language: "Spanish", count: 60, percentage: 0.05 },
      { language: "Traditional Chinese", count: 30, percentage: 0.025 },
      { language: "Other", count: 30, percentage: 0.025 },
    ],
  },
  reportErrors: [],
}

// ── Option 4: Error state (insufficient data) ─────────────────────────────────
export const reportDataOption4: ReportData = {
  reportFilters: { dateRange: "01/01/2025 - 06/30/2025" },
  totalProcessedApplications: 50,
  totalListings: 5,
  isSufficient: false,
  kAnonScore: 2,
  products: {
    incomeHouseholdSizeCrossTab: {},
    raceFrequencies: [],
    ethnicityFrequencies: [],
    subsidyOrVoucherTypeFrequencies: [],
    accessibilityTypeFrequencies: [],
    ageFrequencies: [],
    residentialLocationFrequencies: [],
    languageFrequencies: [],
  },
  reportErrors: [
    "Insufficient data for category: incomeHouseholdSizeCrossTab",
    "Insufficient data for category: ageFrequencies",
    "Data quality warning: 100% missing income information",
  ],
}
