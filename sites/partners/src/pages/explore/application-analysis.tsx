import React, { useState, useEffect, useContext } from "react"
import Head from "next/head"
import { t } from "@bloom-housing/ui-components"
import { AuthContext } from "@bloom-housing/shared-helpers/src/auth/AuthContext"
import { Button } from "@bloom-housing/ui-seeds"
import Layout from "../../layouts"
import { NavigationHeader } from "../../components/shared/NavigationHeader"
import HouseholdIncomeReport from "../../components/explore/income-analysis"
import DemographicsSection from "../../components/explore/raceAndEthnicity"
import PrimaryApplicantSection from "../../components/explore/applicantAndHouseholdData"
import ReportSummary from "../../components/explore/ReportSummary"
import { FilteringSlideOut } from "../../components/explore/FilteringSlideOut"
import {
  ApiFilters,
  IncomeHouseholdSizeCrossTab,
  defaultReport,
  lowIncomeAndYounger,
  highIncomeAndOlder,
  veryLowData,
  InsufficientNumberOfApplications,
  ReportData,
} from "../../lib/explore/data-explorer"
import { FormValues } from "../../components/explore/filtering/mainForm"
import { useRouter } from "next/router"
import { ReportProducts } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { AiPermissionModal } from "../../components/explore/aiPermissionModal"
import { AiInsightsPanel } from "../../components/explore/AIInsightsPanel"

const ApplicationAnalysis = () => {
  const router = useRouter()
  if (!process.env.enableHousingReports) {
    void router.replace("/")
  }

  const { dataExplorerService, profile, userService } = useContext(AuthContext)

  // Initialize from user profile
  const [hasUserConsentedToAI, setHasUserConsentedToAI] = useState(
    profile?.hasConsentedToAI || false
  )
  const [aiInsight, setAiInsight] = useState<string>("")
  const [isLoadingInsight, setIsLoadingInsight] = useState(false)
  const [insightError, setInsightError] = useState<string | null>(null)

  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false)
  const [isAiInsightsPanelOpen, setIsAiInsightsPanelOpen] = useState(false)
  const [isAiConsentPanelOpen, setIsAiConsentPanelOpen] = useState(false)
  const [dataOverride, setDataOverride] = useState<string>("none")
  const [chartData, setChartData] = useState<ReportProducts>({
    incomeHouseholdSizeCrossTab: {} as IncomeHouseholdSizeCrossTab,
    raceFrequencies: [],
    ethnicityFrequencies: [],
    residentialLocationFrequencies: [],
    ageFrequencies: [],
    languageFrequencies: [],
    subsidyOrVoucherTypeFrequencies: [],
    accessibilityTypeFrequencies: [],
  })
  const [filterInformation, setFilterInformation] = useState({
    dataRange: "",
    totalProcessedApplications: 0,
    totalListings: 0,
  })
  const [appliedFilters, setAppliedFilters] = useState<ApiFilters | undefined>(undefined)

  // Log applied filters for debugging
  useEffect(() => {
    if (appliedFilters) {
      console.log("Current applied filters:", appliedFilters)
    }
  }, [appliedFilters])

  const fetchData = React.useCallback(
    async (filters?: ApiFilters) => {
      try {
        let reportData: ReportData

        // Check if manual override is selected
        if (dataOverride !== "none") {
          switch (dataOverride) {
            case "default":
              reportData = defaultReport
              break
            case "lowIncome":
              reportData = lowIncomeAndYounger
              break
            case "highIncome":
              reportData = highIncomeAndOlder
              break
            case "veryLow":
              reportData = veryLowData
              break
            case "insufficient":
              reportData = InsufficientNumberOfApplications
              break
            default: {
              const apiData = await dataExplorerService.generateReport({
                ...filters,
                jurisdictionId: profile?.jurisdictions?.[0]?.id,
              })
              reportData = {
                dateRange: apiData.dateRange,
                totalProcessedApplications: apiData.totalProcessedApplications,
                totalListings: apiData.totalListings || 0,
                isSufficient: apiData.isSufficient,
                kAnonScore: apiData.kAnonScore,
                products: apiData.products,
                reportErrors: apiData.reportErrors || [],
              } as ReportData
              break
            }
          }
        } else {
          // No override - fetch from API through the service
          const apiData = await dataExplorerService.generateReport({
            ...filters,
            jurisdictionId: profile?.jurisdictions?.[0]?.id,
          })
          reportData = {
            dateRange: apiData.dateRange,
            totalProcessedApplications: apiData.totalProcessedApplications,
            totalListings: apiData.totalListings || 0,
            isSufficient: apiData.isSufficient,
            kAnonScore: apiData.kAnonScore,
            products: apiData.products,
            reportErrors: apiData.reportErrors || [],
          } as ReportData
        }

        setChartData({
          incomeHouseholdSizeCrossTab: reportData.products.incomeHouseholdSizeCrossTab,
          raceFrequencies: reportData.products.raceFrequencies,
          ethnicityFrequencies: reportData.products.ethnicityFrequencies,
          residentialLocationFrequencies: reportData.products.residentialLocationFrequencies,
          ageFrequencies: reportData.products.ageFrequencies,
          languageFrequencies: reportData.products.languageFrequencies,
          subsidyOrVoucherTypeFrequencies: reportData.products.subsidyOrVoucherTypeFrequencies,
          accessibilityTypeFrequencies: reportData.products.accessibilityTypeFrequencies,
        })
        setFilterInformation({
          dataRange: reportData.dateRange,
          totalProcessedApplications: reportData.totalProcessedApplications,
          totalListings: reportData.totalListings,
        })
      } catch (error) {
        console.error("Error fetching report data:", error)
      }
    },
    [dataExplorerService, dataOverride]
  )

  useEffect(() => {
    void fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Refetch data when data override changes
  useEffect(() => {
    void fetchData(appliedFilters)
  }, [dataOverride, appliedFilters, fetchData])

  // Effect to disable body scroll when filter panel is open
  useEffect(() => {
    if (isFilterPanelOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isFilterPanelOpen])

  const handleApplyFilters = (filters: FormValues) => {
    // Helper function to handle numeric fields - convert NaN to null, keep all other values
    const getNumericValue = (num: number | null | undefined): number | null =>
      num !== undefined && !isNaN(num) ? num : null

    // Helper function to handle string fields - convert empty strings to null
    const getStringValue = (str: string | null | undefined): string | null =>
      str && str.trim() !== "" ? str : null

    // Convert FormValues to ApiFilters format - preserve all values, transform NaN and empty strings to null
    const apiFilters: ApiFilters = {
      householdSize: filters.householdSize,
      minIncome: getNumericValue(filters.minIncome),
      maxIncome: getNumericValue(filters.maxIncome),
      amiLevels: filters.amiLevels,
      voucherStatuses: filters.voucherStatuses,
      accessibilityTypes: filters.accessibilityTypes,
      races: filters.races,
      ethnicities: filters.ethnicities,
      applicantResidentialCounties: filters.applicantResidentialCounties,
      applicantWorkCounties: filters.applicantWorkCounties,
      minAge: getNumericValue(filters.minAge),
      maxAge: getNumericValue(filters.maxAge),
      startDate: getStringValue(filters.startDate),
      endDate: getStringValue(filters.endDate),
    }

    // Remove undefined values
    const cleanedFilters = Object.fromEntries(
      Object.entries(apiFilters).filter(([, value]) => value !== undefined)
    ) as ApiFilters

    setAppliedFilters(cleanedFilters)
    console.log("Applied filters:", cleanedFilters)
    void fetchData(cleanedFilters)
    setIsFilterPanelOpen(false)
  }

  const fetchAiInsights = async () => {
    if (!hasUserConsentedToAI || !chartData) {
      return
    }

    setIsLoadingInsight(true)
    setInsightError(null)

    try {
      // Send data products for AI analysis
      // TODO: Optimize data size
      const response = await dataExplorerService.generateInsight({
        body: {
          data: defaultReport.products,
          prompt:
            "Analyze this housing application data and provide key insights about demographics, income distribution, and accessibility needs. Focus on actionable insights for housing policy makers.",
        },
      })

      setAiInsight(response.insight)
    } catch (error) {
      console.error("Error fetching AI insights:", error)
      setInsightError("Failed to generate insights. Please try again.")
    } finally {
      setIsLoadingInsight(false)
    }
  }

  // Fetch AI insights when panel opens and user has consented
  useEffect(() => {
    if (isAiInsightsPanelOpen && hasUserConsentedToAI && !aiInsight) {
      void fetchAiInsights()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAiInsightsPanelOpen, hasUserConsentedToAI, aiInsight])

  const handleAIConsent = async () => {
    try {
      // Update on server
      await userService.updateAiConsent({ body: { hasConsented: true } })

      // Update local state
      setHasUserConsentedToAI(true)
      setIsAiConsentPanelOpen(false)
    } catch (error) {
      console.error("Failed to update AI consent:", error)
      // Still update local state as fallback
      setHasUserConsentedToAI(true)
      setIsAiConsentPanelOpen(false)
    }
  }

  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitlePartners")} - Application Analysis</title>
      </Head>
      <NavigationHeader
        className="relative bg-white border-b border-gray-450"
        title="Application Report"
      />
      <div className="w-full bg-gray-100">
        <div className="relative flex justify-center gap-4 px-4">
          {/* Main Content - Centered with dynamic width based on panel state */}
          <div
            className={`flex flex-col bg-gray-100 w-full my-4 px-5 transition-all duration-300 ${
              isAiInsightsPanelOpen ? "max-w-4xl" : "max-w-7xl"
            }`}
          >
            <ReportSummary
              dateRange={filterInformation.dataRange}
              totalApplications={filterInformation.totalProcessedApplications}
              totalListings={filterInformation.totalListings}
            />

            {/* Test Data Override Dropdown */}
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <label
                htmlFor="dataOverride"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                🧪 Test Data Override
              </label>
              <select
                id="dataOverride"
                value={dataOverride}
                onChange={(e) => setDataOverride(e.target.value)}
                className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="none">No Override (Use API/Filters)</option>
                <option value="default">Default Report (Balanced Distribution)</option>
                <option value="lowIncome">Low Income & Younger Skew</option>
                <option value="highIncome">High Income & Older Skew</option>
                <option value="veryLow">Very Low Data (~22 applications)</option>
                <option value="insufficient">Insufficient Data (Error State)</option>
              </select>
              <p className="mt-2 text-xs text-gray-600">
                Select a test dataset to override the normal data fetching behavior
              </p>
            </div>

            {/* Dev AI Consent Override */}
            <div className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                👨‍💻 Dev: AI Consent Override
              </label>
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setHasUserConsentedToAI(true)}
                  className={hasUserConsentedToAI ? "opacity-50" : ""}
                >
                  Grant Consent
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setHasUserConsentedToAI(false)
                    setAiInsight("")
                  }}
                  className={!hasUserConsentedToAI ? "opacity-50" : ""}
                >
                  Revoke Consent
                </Button>
              </div>
              <p className="mt-2 text-xs text-gray-600">
                Current status: {hasUserConsentedToAI ? "✅ Consented" : "❌ Not Consented"}
              </p>
            </div>

            <div className="pb-8 ml-auto flex gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsFilterPanelOpen(true)}
                className="ml-auto"
              >
                Customize Report
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsAiInsightsPanelOpen(!isAiInsightsPanelOpen)}
                className="ml-auto"
              >
                See Data Summary
              </Button>
            </div>
            <div className="">
              <HouseholdIncomeReport
                chartData={{
                  incomeHouseholdSizeCrossTab:
                    chartData.incomeHouseholdSizeCrossTab as IncomeHouseholdSizeCrossTab,
                }}
              />
              <DemographicsSection
                chartData={{
                  raceFrequencies: chartData.raceFrequencies,
                  ethnicityFrequencies: chartData.ethnicityFrequencies,
                }}
              />
              <PrimaryApplicantSection
                chartData={{
                  residentialLocationFrequencies: chartData.residentialLocationFrequencies,
                  ageFrequencies: chartData.ageFrequencies,
                  languageFrequencies: chartData.languageFrequencies,
                  subsidyOrVoucherTypeFrequencies: chartData.subsidyOrVoucherTypeFrequencies,
                  accessibilityTypeFrequencies: chartData.accessibilityTypeFrequencies,
                }}
              />
            </div>
          </div>

          {/* GenAI Insights Panel - Positioned alongside main content */}
          {isAiInsightsPanelOpen && (
            <div
              className="flex-shrink-0 w-80 my-4 bg-white rounded-lg p-6 max-h-[calc(100vh-10rem)] overflow-y-auto sticky shadow top-4 animate-slide-in-right"
              style={{ height: "min-content" }}
            >
              <div className="relative">
                {/* Close Button */}
                <button
                  onClick={() => setIsAiInsightsPanelOpen(false)}
                  className="absolute top-0 right-0 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close AI Insights"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                {hasUserConsentedToAI ? (
                  <AiInsightsPanel
                    insight={aiInsight}
                    isLoading={isLoadingInsight}
                    error={insightError}
                    onRegenerate={() => {
                      setAiInsight("")
                      void fetchAiInsights()
                    }}
                  />
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-4">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Enable Gen AI Insights
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-md">
                        <p className="text-sm text-gray-700">
                          Leverage the power of Generative AI to gain deeper insights into your data
                        </p>
                      </div>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setIsAiConsentPanelOpen(true)}
                        className="w-full"
                      >
                        Enable AI Insights
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <FilteringSlideOut
        isOpen={isFilterPanelOpen}
        onClose={() => setIsFilterPanelOpen(false)}
        onApplyFilters={handleApplyFilters}
      />

      <AiPermissionModal
        showOnboardingModal={isAiConsentPanelOpen}
        setShowOnboardingModal={() => setIsAiConsentPanelOpen(false)}
        handleConfirmGenAI={handleAIConsent}
      />
    </Layout>
  )
}

export default ApplicationAnalysis
