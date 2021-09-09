import React, { useMemo, useContext, useState } from "react"
import Head from "next/head"
import {
  PageHeader,
  t,
  lRoute,
  AuthContext,
  Button,
  LocalizedLink,
  AgPagination,
  AG_PER_PAGE_OPTIONS,
} from "@bloom-housing/ui-components"
import moment from "moment"
import { AgGridReact } from "ag-grid-react"
import { GridOptions } from "ag-grid-community"

import { useListingsData } from "../lib/hooks"
import Layout from "../layouts"
import { MetaTags } from "../src/MetaTags"

class formatLinkCell {
  link: HTMLAnchorElement

  init(params) {
    this.link = document.createElement("a")
    this.link.classList.add("text-blue-700")
    this.link.setAttribute("href", lRoute(`/listings/${params.data.id}/applications`))
    this.link.innerText = params.valueFormatted || params.value
  }

  getGui() {
    return this.link
  }
}

class ApplicationsLink extends formatLinkCell {
  init(params) {
    super.init(params)
    this.link.setAttribute("href", lRoute(`/listings/${params.data.id}/applications`))
  }
}

class ListingsLink extends formatLinkCell {
  init(params) {
    super.init(params)
    this.link.setAttribute("href", lRoute(`/listings/${params.data.id}`))
  }
}

export default function ListingsList() {
  const { profile } = useContext(AuthContext)
  const leasingAgentInListings = profile.leasingAgentInListings
    ?.map((leasingAgent) => leasingAgent.id)
    .join(",")
  const isAdmin = profile.roles?.isAdmin || false

  /* Pagination */
  const [itemsPerPage, setItemsPerPage] = useState<number>(AG_PER_PAGE_OPTIONS[0])
  const [currentPage, setCurrentPage] = useState<number>(1)

  const metaDescription = t("pageDescription.welcome", { regionName: t("region.name") })
  const metaImage = "" // TODO: replace with hero image

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

  const gridOptions: GridOptions = {
    components: {
      ApplicationsLink,
      formatLinkCell,
      formatWaitlistStatus,
      ListingsLink,
    },
  }

  const columnDefs = useMemo(() => {
    const columns = [
      {
        headerName: t("listings.listingName"),
        field: "name",
        sortable: false,
        filter: false,
        resizable: true,
        cellRenderer: "ListingsLink",
      },
      {
        headerName: t("listings.listingStatusText"),
        field: "status",
        sortable: false,
        filter: false,
        resizable: true,
        flex: 1,
        valueFormatter: ({ value }) => t(`listings.${value}`),
        cellRenderer: "ApplicationsLink",
      },
      {
        headerName: t("listings.applicationDeadline"),
        field: "applicationDueDate",
        sortable: false,
        filter: false,
        resizable: true,
        valueFormatter: ({ value }) => (value ? moment(value).format("MM/DD/YYYY") : t("t.none")),
      },
      {
        headerName: t("listings.availableUnits"),
        field: "unitsAvailable",
        sortable: false,
        filter: false,
        resizable: true,
      },
      {
        headerName: t("listings.waitlist.open"),
        field: "waitlistCurrentSize",
        sortable: false,
        filter: false,
        resizable: true,
        cellRenderer: "formatWaitlistStatus",
      },
    ]
    return columns
  }, [])

  const { listingDtos, listingsLoading, listingsError } = useListingsData({
    page: currentPage,
    limit: itemsPerPage,
    userId: !isAdmin ? profile?.id : undefined,
  })

  if (listingsLoading) return "Loading..."
  if (listingsError) return "An error has occurred."

  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitlePartners")}</title>
      </Head>
      <MetaTags
        title={t("nav.siteTitlePartners")}
        image={metaImage}
        description={metaDescription}
      />
      <PageHeader title={t("nav.listings")} />
      <section>
        <article className="flex-row flex-wrap relative max-w-screen-xl mx-auto py-8 px-4">
          <div className="ag-theme-alpine ag-theme-bloom">
            <div className="flex justify-between">
              <div className="w-56"></div>
              <div className="flex-row">
                {isAdmin && (
                  <LocalizedLink href={`/listings/add`}>
                    <Button className="mx-1" onClick={() => false}>
                      {t("listings.addListing")}
                    </Button>
                  </LocalizedLink>
                )}
              </div>
            </div>

            <div className="applications-table mt-5">
              <AgGridReact
                gridOptions={gridOptions}
                columnDefs={columnDefs}
                rowData={listingDtos.items}
                domLayout={"autoHeight"}
                headerHeight={83}
                rowHeight={58}
                suppressPaginationPanel={true}
                paginationPageSize={AG_PER_PAGE_OPTIONS[0]}
                suppressScrollOnNewData={true}
              ></AgGridReact>

              <AgPagination
                totalItems={listingDtos.meta.totalItems}
                totalPages={listingDtos.meta.totalPages}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                quantityLabel={t("listings.totalListings")}
                setCurrentPage={setCurrentPage}
                setItemsPerPage={setItemsPerPage}
                onPerPageChange={() => setCurrentPage(1)}
              />
            </div>
          </div>
        </article>
      </section>
    </Layout>
  )
}
