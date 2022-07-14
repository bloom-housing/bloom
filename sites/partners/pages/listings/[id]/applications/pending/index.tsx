import React, { useState, useContext } from "react"
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
  Breadcrumbs,
  BreadcrumbLink,
  NavigationHeader,
  SideNav,
} from "@bloom-housing/ui-components"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { useSingleListingData, useFlaggedApplicationsList } from "../../../../../lib/hooks"
import { ListingStatusBar } from "../../../../../src/listings/ListingStatusBar"
import Layout from "../../../../../layouts"

const ApplicationsList = () => {
  const { applicationsService } = useContext(AuthContext)
  const router = useRouter()

  const tableOptions = useAgTable()

  const [csvExportLoading, setCsvExportLoading] = useState(false)
  const [csvExportError, setCsvExportError] = useState(false)

  /* Data Fetching */
  const listingId = router.query.id as string
  const { listingDto } = useSingleListingData(listingId)
  const listingName = listingDto?.name
  const { data: flaggedApps } = useFlaggedApplicationsList({
    listingId,
    page: 1,
    limit: 1,
  })

  const columns = [
    {
      headerName: t("applications.duplicates.duplicateGroup"),
      field: "",
      sortable: false,
      filter: false,
      pinned: "left",
      cellRenderer: "formatLinkCell",
    },
    {
      headerName: t("applications.duplicates.primaryApplicant"),
      field: "",
      sortable: false,
      filter: false,
      pinned: "left",
    },
    {
      headerName: t("t.rule"),
      field: "",
      sortable: false,
      filter: false,
      pinned: "left",
    },
    {
      headerName: t("applications.pendingReview"),
      field: "",
      sortable: false,
      filter: false,
      pinned: "right",
    },
  ]

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

  const gridComponents = {
    formatLinkCell,
  }

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
          <SideNav
            className="w-full md:w-72"
            navItems={[
              {
                label: t("applications.allApplications"),
                url: `/listings/${listingId}/applications`,
              },
              {
                label: t("applications.pendingReview"),
                url: `/listings/${listingId}/applications/pending`,
                current: true,
              },
              { label: t("t.resolved"), url: `/listings/${listingId}/applications/resolved` },
            ]}
          />
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
              gridComponents,
              columns,
              totalItemsLabel: t("applications.totalApplications"),
            }}
            data={{
              items: [],
              loading: false,
              totalItems: 0,
              totalPages: 0,
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
