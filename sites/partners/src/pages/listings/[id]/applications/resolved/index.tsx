import React, { useContext } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import { AgTable, t, useAgTable, Breadcrumbs, BreadcrumbLink } from "@bloom-housing/ui-components"
import { AuthContext } from "@bloom-housing/shared-helpers"
import {
  Application,
  ApplicationReviewStatusEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { useSingleListingData, useFlaggedApplicationsList } from "../../../../../lib/hooks"
import { ListingStatusBar } from "../../../../../components/listings/ListingStatusBar"
import Layout from "../../../../../layouts"
import { ApplicationsSideNav } from "../../../../../components/applications/ApplicationsSideNav"
import { getLinkCellFormatter } from "../../../../../components/applications/helpers"
import { NavigationHeader } from "../../../../../components/shared/NavigationHeader"

import { mergeApplicationNames } from "../../../../../lib/helpers"

const ApplicationsList = () => {
  const router = useRouter()
  const listingId = router.query.id as string

  const tableOptions = useAgTable()

  /* Data Fetching */
  const { profile } = useContext(AuthContext)
  const { listingDto } = useSingleListingData(listingId)
  const listingName = listingDto?.name
  const { data: flaggedAppsData, loading: flaggedAppsLoading } = useFlaggedApplicationsList({
    listingId,
    page: tableOptions.pagination.currentPage,
    limit: tableOptions.pagination.itemsPerPage,
    view: "resolved",
    search: tableOptions.filter.filterValue,
  })

  const columns = [
    {
      headerName: t("applications.duplicates.duplicateGroup"),
      field: "id",
      cellRenderer: "formatLinkCell",
      valueGetter: ({ data }) => {
        return mergeApplicationNames(data.applications)
      },
      flex: 1,
      minWidth: 200,
    },
    {
      headerName: t("t.rule"),
      field: "rule",
      width: 130,
      minWidth: 50,
    },
    {
      headerName: t("applications.duplicates.duplicateApplications"),
      field: "",
      valueGetter: ({ data }) => {
        return data?.applications?.filter(
          (app: Application) => app.reviewStatus === ApplicationReviewStatusEnum.duplicate
        ).length
      },
      type: "rightAligned",
      width: 140,
      minWidth: 50,
    },
    {
      headerName: t("applications.duplicates.validApplications"),
      field: "",
      valueGetter: ({ data }) => {
        return data?.applications?.filter(
          (app: Application) => app.reviewStatus === ApplicationReviewStatusEnum.valid
        ).length
      },
      type: "rightAligned",
      width: 130,
      minWidth: 50,
    },
  ]

  if (profile?.userRoles?.isLimitedJurisdictionalAdmin) return null

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
        }}
        breadcrumbs={
          <Breadcrumbs>
            <BreadcrumbLink href="/">{t("t.listing")}</BreadcrumbLink>
            <BreadcrumbLink href={`/listings/${listingId}`}>{listingName}</BreadcrumbLink>
            <BreadcrumbLink href={`/listings/${listingId}/applications`}>
              {t("nav.applications")}
            </BreadcrumbLink>
            <BreadcrumbLink href={`/listings/${listingId}/applications/resolved`} current>
              {t("t.resolved")}
            </BreadcrumbLink>
          </Breadcrumbs>
        }
      />

      <ListingStatusBar status={listingDto?.status} />

      <section className={"bg-gray-200 pt-4"}>
        <article className="flex flex-col md:flex-row items-start gap-x-8 relative max-w-screen-xl mx-auto pb-8 px-4">
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
                columns: columns,
                totalItemsLabel:
                  flaggedAppsData?.meta?.totalItems === 1
                    ? t("applications.duplicates.set")
                    : t("applications.duplicates.sets"),
              }}
              data={{
                items: flaggedAppsData?.items ?? [],
                loading: flaggedAppsLoading,
                totalItems: flaggedAppsData?.meta?.totalItems ?? 0,
                totalPages: flaggedAppsData?.meta?.totalPages ?? 0,
              }}
              search={{
                setSearch: tableOptions.filter.setFilterValue,
              }}
              sort={{
                setSort: tableOptions.sort.setSortOptions,
              }}
            />
          </div>
        </article>
      </section>
    </Layout>
  )
}

export default ApplicationsList
