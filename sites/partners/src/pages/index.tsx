import React, { useMemo, useContext, useState, useEffect } from "react"
import Head from "next/head"
import { Button } from "@bloom-housing/ui-seeds"
import {
  t,
  AgTable,
  useAgTable,
  AlertBox,
  SiteAlert,
  Icon,
  UniversalIconType,
} from "@bloom-housing/ui-components"
import { AuthContext } from "@bloom-housing/shared-helpers"
import dayjs from "dayjs"
import { ColDef, ColGroupDef } from "ag-grid-community"
import { useListingExport, useListingsData } from "../lib/hooks"
import Layout from "../layouts"
import { MetaTags } from "../components/shared/MetaTags"
import { NavigationHeader } from "../components/shared/NavigationHeader"
import { faFileExport } from "@fortawesome/free-solid-svg-icons"

class formatLinkCell {
  link: HTMLAnchorElement

  init(params) {
    this.link = document.createElement("a")
    this.link.classList.add("text-blue-700")
    this.link.setAttribute("href", `/listings/${params.data.id}/applications`)
    this.link.innerText = params.valueFormatted || params.value
  }

  getGui() {
    return this.link
  }
}

class formatWaitlistStatus {
  text: HTMLSpanElement

  init({ data }) {
    const isWaitlistOpen = data.waitlistCurrentSize < data.waitlistMaxSize

    this.text = document.createElement("span")
    this.text.innerHTML = isWaitlistOpen ? t("t.yes") : t("t.no")
  }

  getGui() {
    return this.text
  }
}

class ApplicationsLink extends formatLinkCell {
  init(params) {
    super.init(params)
    this.link.setAttribute("href", `/listings/${params.data.id}/applications`)
    this.link.setAttribute("data-testid", `listing-status-cell-${params.data.name}`)
  }
}

class ListingsLink extends formatLinkCell {
  init(params) {
    super.init(params)
    this.link.setAttribute("href", `/listings/${params.data.id}`)
    this.link.setAttribute("data-testid", params.data.name)
  }
}

export default function ListingsList() {
  const metaDescription = t("pageDescription.welcome", { regionName: t("region.name") })
  const [errorAlert, setErrorAlert] = useState(false)
  const { profile } = useContext(AuthContext)
  const isAdmin = profile?.userRoles?.isAdmin || profile?.userRoles?.isJurisdictionalAdmin || false
  const { onExport, csvExportLoading, csvExportError, csvExportSuccess } = useListingExport()
  useEffect(() => {
    setErrorAlert(csvExportError)
  }, [csvExportError])

  const tableOptions = useAgTable()

  const gridComponents = {
    ApplicationsLink,
    formatLinkCell,
    formatWaitlistStatus,
    ListingsLink,
  }

  const columnDefs = useMemo(() => {
    const columns: (ColDef | ColGroupDef)[] = [
      {
        headerName: t("listings.listingName"),
        field: "name",
        sortable: true,
        unSortIcon: true,
        filter: false,
        resizable: true,
        cellRenderer: "ListingsLink",
        minWidth: 250,
        flex: 1,
      },
      {
        headerName: t("listings.listingStatusText"),
        field: "status",
        sortable: true,
        unSortIcon: true,
        sort: "asc",
        // disable frontend sorting
        comparator: () => 0,
        filter: false,
        resizable: true,
        valueFormatter: ({ value }) => t(`listings.listingStatus.${value}`),
        cellRenderer: "ApplicationsLink",
        minWidth: 180,
      },
      {
        headerName: t("listings.applicationDeadline"),
        field: "applicationDueDate",
        sortable: false,
        filter: false,
        resizable: true,
        valueFormatter: ({ value }) => (value ? dayjs(value).format("MM/DD/YYYY") : t("t.none")),
        minWidth: 130,
      },
      {
        headerName: t("listings.availableUnits"),
        field: "unitsAvailable",
        sortable: false,
        filter: false,
        resizable: true,
        minWidth: 110,
      },
      {
        headerName: t("listings.waitlist.open"),
        field: "waitlistCurrentSize",
        sortable: false,
        filter: false,
        resizable: true,
        cellRenderer: "formatWaitlistStatus",
        minWidth: 100,
      },
    ]
    return columns
  }, [])

  const { listingDtos, listingsLoading } = useListingsData({
    page: tableOptions.pagination.currentPage,
    limit: tableOptions.pagination.itemsPerPage,
    search: tableOptions.filter.filterValue,
    userId: profile?.id,
    sort: tableOptions.sort.sortOptions,
    roles: profile?.userRoles,
    userJurisidctionIds: profile?.jurisdictions?.map((jurisdiction) => jurisdiction.id),
  })

  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitlePartners")}</title>
      </Head>
      <SiteAlert type="success" timeout={5000} dismissable sticky={true} />
      <MetaTags title={t("nav.siteTitlePartners")} description={metaDescription} />
      <NavigationHeader title={t("nav.listings")}>
        {csvExportSuccess && (
          <div className="flex absolute right-4 z-50 flex-col items-center">
            <SiteAlert dismissable timeout={5000} sticky={true} type="success" />
          </div>
        )}
      </NavigationHeader>
      <section>
        <article className="flex-row flex-wrap relative max-w-screen-xl mx-auto py-8 px-4">
          {errorAlert && (
            <AlertBox
              className="mb-8"
              onClose={() => setErrorAlert(false)}
              closeable
              type="alert"
              inverted
            >
              {t("account.settings.alerts.genericError")}
            </AlertBox>
          )}
          <AgTable
            id="listings-table"
            pagination={{
              perPage: tableOptions.pagination.itemsPerPage,
              setPerPage: tableOptions.pagination.setItemsPerPage,
              currentPage: tableOptions.pagination.currentPage,
              setCurrentPage: tableOptions.pagination.setCurrentPage,
            }}
            config={{
              gridComponents,
              columns: columnDefs,
              totalItemsLabel: t("listings.totalListings"),
            }}
            data={{
              items: listingDtos?.items,
              loading: listingsLoading,
              totalItems: listingDtos?.meta.totalItems,
              totalPages: listingDtos?.meta.totalPages,
            }}
            search={{
              setSearch: tableOptions.filter.setFilterValue,
            }}
            sort={{
              setSort: tableOptions.sort.setSortOptions,
            }}
            headerContent={
              <div className="flex-row">
                {isAdmin && (
                  <div className="flex-row">
                    <Button
                      size="sm"
                      className="mx-1"
                      variant="primary"
                      href="/listings/add"
                      id="addListingButton"
                    >
                      {t("listings.addListing")}
                    </Button>
                    <Button
                      className="mx-1"
                      id="export-listings"
                      variant="primary-outlined"
                      onClick={() => onExport()}
                      leadIcon={
                        !csvExportLoading ? (
                          <Icon symbol={faFileExport as UniversalIconType} size="base" />
                        ) : null
                      }
                      size="sm"
                      loadingMessage={csvExportLoading && t("t.formSubmitted")}
                    >
                      {t("t.exportToCSV")}
                    </Button>
                  </div>
                )}
              </div>
            }
          />
        </article>
      </section>
    </Layout>
  )
}
