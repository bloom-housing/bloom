import React, { useState, useMemo, useContext } from "react"
import { useRouter } from "next/router"
import dayjs from "dayjs"
import Head from "next/head"
import {
  AgTable,
  t,
  Button,
  LocalizedLink,
  SiteAlert,
  setSiteAlertMessage,
  useAgTable,
} from "@bloom-housing/ui-components"
import { AuthContext } from "@bloom-housing/shared-helpers"
import {
  useSingleListingData,
  useFlaggedApplicationsList,
  useApplicationsData,
} from "../../../../lib/hooks"
import { ApplicationSecondaryNav } from "../../../../src/applications/ApplicationSecondaryNav"
import Layout from "../../../../layouts"
import { getColDefs } from "../../../../src/applications/ApplicationsColDefs"
import {
  EnumApplicationsApiExtraModelOrder,
  EnumApplicationsApiExtraModelOrderBy,
} from "@bloom-housing/backend-core/types"

const ApplicationsList = () => {
  const { applicationsService } = useContext(AuthContext)
  const router = useRouter()

  const tableOptions = useAgTable()

  const [csvExportLoading, setCsvExportLoading] = useState(false)
  const [csvExportError, setCsvExportError] = useState(false)

  /* Data Fetching */
  const listingId = router.query.id as string
  const { listingDto } = useSingleListingData(listingId)
  const countyCode = listingDto?.countyCode
  const listingName = listingDto?.name
  const { data: flaggedApps } = useFlaggedApplicationsList({
    listingId,
    page: 1,
    limit: 1,
  })

  const { applications, appsMeta, appsLoading, appsError } = useApplicationsData(
    tableOptions.pagination.currentPage,
    tableOptions.filter.filterValue,
    tableOptions.pagination.itemsPerPage,
    listingId,
    tableOptions.sort.sortOptions?.[0]?.orderBy as EnumApplicationsApiExtraModelOrderBy,
    tableOptions.sort.sortOptions?.[0]?.orderDir as EnumApplicationsApiExtraModelOrder
  )

  class formatLinkCell {
    linkWithId: HTMLSpanElement

    init(params) {
      const applicationId = params.data.id

      this.linkWithId = document.createElement("button")
      this.linkWithId.classList.add("text-blue-700")
      this.linkWithId.innerText = params.value

      this.linkWithId.addEventListener("click", function () {
        void router.push(`/application/${applicationId}`)
      })
    }

    getGui() {
      return this.linkWithId
    }
  }

  const onExport = async () => {
    setCsvExportError(false)
    setCsvExportLoading(true)

    try {
      const content = await applicationsService.listAsCsv({
        listingId,
      })

      const now = new Date()
      const dateString = dayjs(now).format("YYYY-MM-DD_HH:mm:ss")

      const blob = new Blob([content], { type: "text/csv" })
      const fileLink = document.createElement("a")
      fileLink.setAttribute("download", `applications-${listingId}-${dateString}.csv`)
      fileLink.href = URL.createObjectURL(blob)
      fileLink.click()
    } catch (err) {
      setCsvExportError(true)
      setSiteAlertMessage(err.response.data.error, "alert")
    }

    setCsvExportLoading(false)
  }

  // get the highest value from householdSize and limit to 6
  const maxHouseholdSize = useMemo(() => {
    let max = 1

    applications?.forEach((item) => {
      if (item.householdSize > max) {
        max = item.householdSize
      }
    })

    return max < 6 ? max : 6
  }, [applications])

  const columnDefs = useMemo(() => {
    return getColDefs(maxHouseholdSize, countyCode)
  }, [maxHouseholdSize, countyCode])

  const gridComponents = {
    formatLinkCell,
  }

  if (!applications || appsError) return "An error has occurred."

  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitlePartners")}</title>
      </Head>

      <ApplicationSecondaryNav
        title={listingName}
        listingId={listingId}
        flagsQty={flaggedApps?.meta?.totalFlagged}
      >
        {csvExportError && (
          <div className="flex top-4 right-4 absolute z-50 flex-col items-center">
            <SiteAlert type="alert" timeout={5000} dismissable />
          </div>
        )}
      </ApplicationSecondaryNav>

      <section>
        <article className="flex-row flex-wrap relative max-w-screen-xl mx-auto py-8 px-4">
          <AgTable
            id="applications-table"
            pagination={{
              perPage: tableOptions.pagination.itemsPerPage,
              setPerPage: tableOptions.pagination.setItemsPerPage,
              currentPage: tableOptions.pagination.currentPage,
              setCurrentPage: tableOptions.pagination.setCurrentPage,
            }}
            config={{
              gridComponents,
              columns: columnDefs,
              totalItemsLabel: t("applications.totalApplications"),
            }}
            data={{
              items: applications,
              loading: appsLoading,
              totalItems: appsMeta?.totalItems,
              totalPages: appsMeta?.totalPages,
            }}
            search={{
              setSearch: tableOptions.filter.setFilterValue,
            }}
            sort={{
              setSort: tableOptions.sort.setSortOptions,
            }}
            headerContent={
              <div className="flex-row">
                <LocalizedLink href={`/listings/${listingId}/applications/add`}>
                  <Button
                    className="mx-1"
                    onClick={() => false}
                    dataTestId={"addApplicationButton"}
                  >
                    {t("applications.addApplication")}
                  </Button>
                </LocalizedLink>

                <Button className="mx-1" onClick={() => onExport()} loading={csvExportLoading}>
                  {t("t.export")}
                </Button>
              </div>
            }
          />
        </article>
      </section>
    </Layout>
  )
}

export default ApplicationsList
