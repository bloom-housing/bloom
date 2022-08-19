import React, { useContext } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import {
  AgTable,
  t,
  Button,
  SiteAlert,
  useAgTable,
  Breadcrumbs,
  BreadcrumbLink,
  NavigationHeader,
} from "@bloom-housing/ui-components"
import { AuthContext } from "@bloom-housing/shared-helpers"
import {
  useSingleListingData,
  useFlaggedApplicationsList,
  useApplicationsExport,
} from "../../../../../lib/hooks"
import { ListingStatusBar } from "../../../../../src/listings/ListingStatusBar"
import Layout from "../../../../../layouts"
import { ApplicationsSideNav } from "../../../../../src/applications/ApplicationsSideNav"
import { tableColumns, getLinkCellFormatter } from "../../../../../src/applications/helpers"

const ApplicationsList = () => {
  const { profile } = useContext(AuthContext)
  const router = useRouter()
  const listingId = router.query.id as string

  const { onExport, csvExportLoading, csvExportError } = useApplicationsExport(
    listingId,
    profile?.roles?.isAdmin ?? false
  )

  const tableOptions = useAgTable()

  /* Data Fetching */
  const { listingDto } = useSingleListingData(listingId)
  const listingName = listingDto?.name
  const { data: flaggedAppsData, loading: flaggedAppsLoading } = useFlaggedApplicationsList({
    listingId,
    page: tableOptions.pagination.currentPage,
    limit: tableOptions.pagination.itemsPerPage,
  })

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
          flagsQty: flaggedAppsData?.meta?.totalFlagged,
          listingLabel: t("t.listingSingle"),
          applicationsLabel: t("nav.applications"),
          flagsLabel: t("nav.flags"),
        }}
        breadcrumbs={
          <Breadcrumbs>
            <BreadcrumbLink href="/">{t("t.listing")}</BreadcrumbLink>
            <BreadcrumbLink href={`/listings/${listingId}`}>{listingName}</BreadcrumbLink>
            <BreadcrumbLink href={`/listings/${listingId}/applications`}>
              {t("nav.applications")}
            </BreadcrumbLink>
            <BreadcrumbLink href={`/listings/${listingId}/applications/pending`} current>
              {t("t.pending")}
            </BreadcrumbLink>
          </Breadcrumbs>
        }
      >
        {csvExportError && (
          <div className="flex top-4 right-4 absolute z-50 flex-col items-center">
            <SiteAlert type="alert" timeout={5000} dismissable />
          </div>
        )}
      </NavigationHeader>

      <ListingStatusBar status={listingDto?.status} />

      <section>
        <article className="flex items-start gap-x-8 relative max-w-screen-xl mx-auto pb-8 px-4 mt-2">
          <ApplicationsSideNav className="w-full md:w-72" listingId={listingId} />

          <div className="w-full">
            <AgTable
              id="applications-table"
              className="w-full"
              pagination={{
                perPage: tableOptions.pagination.itemsPerPage,
                setPerPage: tableOptions.pagination.setItemsPerPage,
                currentPage: tableOptions.pagination.currentPage,
                setCurrentPage: tableOptions.pagination.setCurrentPage,
              }}
              config={{
                gridComponents: { formatLinkCell: getLinkCellFormatter(router) },
                columns: tableColumns,
                totalItemsLabel: t("applications.totalApplications"),
              }}
              data={{
                items: flaggedAppsData?.items,
                loading: flaggedAppsLoading,
                totalItems: flaggedAppsData?.meta.totalItems,
                totalPages: flaggedAppsData?.meta.totalPages,
              }}
              search={{
                setSearch: tableOptions.filter.setFilterValue,
              }}
              sort={{
                setSort: tableOptions.sort.setSortOptions,
              }}
              headerContent={
                <div className="flex-row">
                  <Button className="mx-1" onClick={() => onExport()} loading={csvExportLoading}>
                    {t("t.export")}
                  </Button>
                </div>
              }
            />

            {/* <div className="flex flex-row justify-end">
              <div className="mt-5">
                <span>Last Updated 06/17/22 at 9:00am</span>
                <Button className="mx-1 ml-5">{t("applications.scanForDuplicates")}</Button>
              </div>
            </div> */}
          </div>
        </article>
      </section>
    </Layout>
  )
}

export default ApplicationsList
