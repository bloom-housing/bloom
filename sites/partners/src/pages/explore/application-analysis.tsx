import React, { useState, useEffect } from "react"
import Head from "next/head"
import { t } from "@bloom-housing/ui-components"
import { Button } from "@bloom-housing/ui-seeds"
import Layout from "../../layouts"
import { NavigationHeader } from "../../components/shared/NavigationHeader"
import HouseholdIncomeReport from "../../components/explore/income-analysis"
import DemographicsSection from "../../components/explore/raceAndEthnicity"
import PrimaryApplicantSection from "../../components/explore/applicantAndHouseholdData"
import { AiPermissionModal } from "../../components/explore/aiPermissionModal"
import { AiInsightsPanel } from "../../components/explore/AIInsightsPanel"
import { getReportDataFastAPI, ReportProducts } from "../../lib/explore/data-explorer"
import { useRouter } from "next/router"

const ApplicationAnalysis = () => {
  const router = useRouter()
  if (!process.env.enableHousingReports) {
    void router.replace("/")
  }

  const [genAIEnabled, setGenAIEnabled] = useState(false)
  const [showOnboardingModal, setShowOnboardingModal] = useState(false)
  const [chartData, setChartData] = useState<ReportProducts>({
    incomeHouseholdSizeCrossTab: {},
    raceFrequencies: [],
    ethnicityFrequencies: [],
    residentialLocationFrequencies: [],
    ageFrequencies: [],
    languageFrequencies: [],
    subsidyOrVoucherTypeFrequencies: [],
    accessibilityTypeFrequencies: [],
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reportData = await getReportDataFastAPI()
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
      } catch (error) {
        console.error("Error fetching report data:", error)
      }
    }
    void fetchData()
  }, [])

  const handleEnableGenAI = () => {
    setShowOnboardingModal(true)
  }

  const handleConfirmGenAI = () => {
    setGenAIEnabled(true)
    setShowOnboardingModal(false)
  }

  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitlePartners")} - Application Analysis</title>
      </Head>
      <NavigationHeader className="relative" title="Application Analysis" />
      <div className="flex flex-wrap-reverse bg-gray-100">
        <div className="w-2/3">
          <>
            <HouseholdIncomeReport
              chartData={{ incomeHouseholdSizeCrossTab: chartData.incomeHouseholdSizeCrossTab }}
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
          </>
        </div>
        <div className="w-1/3 bg-white p-6 flex flex-col">
          {!genAIEnabled ? (
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Insights</h3>
                <p className="text-gray-600 mb-6">
                  Get intelligent analysis and recommendations based on your application data using
                  advanced AI technology.
                </p>
              </div>
              <Button size="md" onClick={handleEnableGenAI}>
                Enable GenAI Insights
              </Button>
            </div>
          ) : (
            <AiInsightsPanel />
          )}
        </div>
      </div>

      {/* GenAI Onboarding Modal */}
      <AiPermissionModal
        showOnboardingModal={showOnboardingModal}
        setShowOnboardingModal={() => setShowOnboardingModal(false)}
        handleConfirmGenAI={handleConfirmGenAI}
      />
    </Layout>
  )
}

export default ApplicationAnalysis
