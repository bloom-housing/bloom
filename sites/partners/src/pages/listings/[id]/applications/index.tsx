import React, { useContext, useMemo } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import { AgTable, t, useAgTable, Breadcrumbs, BreadcrumbLink } from "@bloom-housing/ui-components"
import { Button } from "@bloom-housing/ui-seeds"
import { AuthContext } from "@bloom-housing/shared-helpers"
import {
  ApplicationOrderByKeys,
  OrderByEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import {
  useSingleListingData,
  useFlaggedApplicationsList,
  useApplicationsData,
  useApplicationsExport,
} from "../../../../lib/hooks"
import { ListingStatusBar } from "../../../../components/listings/ListingStatusBar"
import Layout from "../../../../layouts"
import { getColDefs } from "../../../../components/applications/ApplicationsColDefs"
import { ApplicationsSideNav } from "../../../../components/applications/ApplicationsSideNav"
import { NavigationHeader } from "../../../../components/shared/NavigationHeader"

const ApplicationsList = () => {
  const { profile } = useContext(AuthContext)
  const router = useRouter()
  const listingId = router.query.id as string

  const tableOptions = useAgTable()

  /* Data Fetching */
  const { listingDto } = useSingleListingData(listingId)

  const listingJurisdiction = profile.jurisdictions.find(
    (jurisdiction) => jurisdiction.id === listingDto?.jurisdictions.id
  )
  const includeDemographicsPartner =
    profile?.userRoles?.isPartner && listingJurisdiction?.enablePartnerDemographics
  const { onExport, csvExportLoading } = useApplicationsExport(
    listingId,
    (profile?.userRoles?.isAdmin || includeDemographicsPartner) ?? false
  )

  const countyCode = listingDto?.jurisdictions.name
  const listingName = listingDto?.name
  const isListingOpen = listingDto?.status === "active"
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
    tableOptions.sort.sortOptions?.[0]?.orderBy as ApplicationOrderByKeys,
    tableOptions.sort.sortOptions?.[0]?.orderDir as OrderByEnum
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
      <NavigationHeader
        title={listingName}
        listingId={listingId}
        tabs={{
          show: true,
          flagsQty: flaggedApps?.meta?.totalFlagged,
          listingLabel: t("t.listingSingle"),
          applicationsLabel: t("nav.applications"),
        }}
        breadcrumbs={
          <Breadcrumbs>
            <BreadcrumbLink href="/">{t("t.listing")}</BreadcrumbLink>
            <BreadcrumbLink href={`/listings/${listingId}`}>{listingName}</BreadcrumbLink>
            <BreadcrumbLink href={`/listings/${listingId}/applications`} current>
              {t("nav.applications")}
            </BreadcrumbLink>
          </Breadcrumbs>
        }
      />

      <ListingStatusBar status={listingDto?.status} />

      <section className={"bg-gray-200 pt-4"}>
        <article className="flex flex-col md:flex-row items-start gap-x-8 relative max-w-screen-xl mx-auto pb-8 px-4 flex-col">
          {listingDto && (
            <>
              <ApplicationsSideNav
                className="w-full md:w-72"
                listingId={listingId}
                listingOpen={isListingOpen}
              />

              <AgTable
                className="w-full"
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
                    <Button
                      href={`/listings/${listingId}/applications/add`}
                      variant="primary-outlined"
                      size="sm"
                      className="mx-1"
                      id={"addApplicationButton"}
                    >
                      {t("applications.addApplication")}
                    </Button>

                    <Button
                      variant="primary-outlined"
                      size="sm"
                      className="mx-1"
                      onClick={() => onExport()}
                      loadingMessage={csvExportLoading && t("t.formSubmitted")}
                    >
                      {t("t.export")}
                    </Button>
                  </div>
                }
              />
            </>
          )}
        </article>
      </section>
    </Layout>
  )
}

export default ApplicationsList
