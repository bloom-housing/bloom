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
import { getReportDataFastAPI, ApiFilters } from "../../lib/explore/data-explorer"
import { FormValues } from "../../components/explore/filtering/mainForm"
import { useRouter } from "next/router"
import { ReportProducts } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

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
  const [appliedFilters, setAppliedFilters] = useState<ApiFilters | undefined>(undefined)

  // Log applied filters for debugging
  useEffect(() => {
    if (appliedFilters) {
      console.log("Current applied filters:", appliedFilters)
    }
  }, [appliedFilters])

  const fetchData = async (filters?: ApiFilters) => {
    try {
      const reportData = await getReportDataFastAPI(filters)
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

  useEffect(() => {
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

  const handleApplyFilters = (filters: FormValues) => {
    console.log("Raw filter values:", filters)

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
        <div className="flex flex-col bg-gray-100 max-w-7xl mx-auto my-4 px-5">
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

      <FilteringSlideOut
        isOpen={isFilterPanelOpen}
        onClose={() => setIsFilterPanelOpen(false)}
        onApplyFilters={handleApplyFilters}
      />
    </Layout>
  )
}

export default ApplicationAnalysis
