import React, { useState, useEffect } from "react"
import Head from "next/head"
import { t } from "@bloom-housing/ui-components"
import { Button } from "@bloom-housing/ui-seeds"
import Layout from "../../layouts"
import { NavigationHeader } from "../../components/shared/NavigationHeader"
import HouseholdIncomeReport from "../../components/explore/income-analysis"
import DemographicsSection from "../../components/explore/raceAndEthnicity"
import PrimaryApplicantSection from "../../components/explore/applicantAndHouseholdData"
import ReportSummary from "../../components/explore/ReportSummary"
import { FilteringSlideOut } from "../../components/explore/FilteringSlideOut"
import { getReportDataFastAPI, ReportProducts } from "../../lib/explore/data-explorer"
import { useRouter } from "next/router"

const ApplicationAnalysis = () => {
  const router = useRouter()
  if (!process.env.enableHousingReports) {
    void router.replace("/")
  }

  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false)
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
  const [filterInformation, setFilterInformation] = useState({
    dataRange: "",
    totalProcessedApplications: 0,
    totalListings: 0,
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
        setFilterInformation({
          dataRange: reportData.reportFilters.dateRange,
          totalProcessedApplications: reportData.totalProcessedApplications,
          totalListings: reportData.totalListings,
        })
      } catch (error) {
        console.error("Error fetching report data:", error)
      }
    }
    void fetchData()
  }, [])

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

  const handleApplyFilters = () => {
    // TODO: Apply filters and refresh data
    setIsFilterPanelOpen(false)
  }

  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitlePartners")} - Application Analysis</title>
      </Head>
      <NavigationHeader
        className="relative bg-white border-b border-gray-450"
        title="Application Report"
      ></NavigationHeader>
      <div className="w-full bg-gray-100">
        <div className="flex flex-col bg-gray-100 w-4/5 p-12">
          <ReportSummary
            dateRange={filterInformation.dataRange}
            totalApplications={filterInformation.totalProcessedApplications}
            totalListings={filterInformation.totalListings}
          />
          <div className="pb-8 ml-auto">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsFilterPanelOpen(true)}
              className="ml-auto"
            >
              Customize Report
            </Button>
          </div>
          <div className="">
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
          </div>
        </div>
      </div>

      {/* Filtering Slide-out Panel */}
      <FilteringSlideOut isOpen={isFilterPanelOpen} onClose={() => setIsFilterPanelOpen(false)} />
    </Layout>
  )
}

export default ApplicationAnalysis
