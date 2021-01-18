import React, { useMemo } from "react"
import Head from "next/head"
import { PageHeader, MetaTags, t, lRoute } from "@bloom-housing/ui-components"
import { useListingsData } from "../lib/hooks"
import Layout from "../layouts/application"
import moment from "moment"

import { AgGridReact } from "ag-grid-react"
import { GridOptions } from "ag-grid-community"

export default function ListingsList() {
  class formatLinkCell {
    link: HTMLAnchorElement

    init(params) {
      this.link = document.createElement("a")
      this.link.classList.add("text-blue-700")
      this.link.setAttribute("href", lRoute(`/listings/${params.data.id}/applications`))
      this.link.innerText = params.value
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

  const gridOptions: GridOptions = {
    components: {
      formatLinkCell: formatLinkCell,
      formatWaitlistStatus: formatWaitlistStatus,
    },
  }

  const metaDescription = t("pageDescription.welcome", { regionName: t("region.name") })
  const metaImage = "" // TODO: replace with hero image

  const columnDefs = useMemo(
    () => [
      {
        headerName: t("listings.listingName"),
        field: "name",
        sortable: false,
        filter: false,
        resizable: true,
        cellRenderer: "formatLinkCell",
      },
      {
        headerName: t("listings.applicationDeadline"),
        field: "applicationDueDate",
        sortable: false,
        filter: false,
        resizable: true,
        valueFormatter: ({ value }) => moment(value).format("MM/DD/YYYY"),
      },
      {
        headerName: t("listings.availableUnits"),
        field: "property.unitsAvailable",
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
      {
        headerName: t("listings.listingStatus"),
        field: "status",
        sortable: false,
        filter: false,
        resizable: true,
        flex: 1,
        valueFormatter: ({ value }) => t(`listings.${value}`),
      },
    ],
    []
  )

  const { listingDtos, listingsLoading, listingsError } = useListingsData()
  if (listingsError) return "An error has occurred."
  if (listingsLoading) return "Loading..."

  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitle")}</title>
      </Head>
      <MetaTags title={t("nav.siteTitle")} image={metaImage} description={metaDescription} />
      <PageHeader>{t("nav.listings")}</PageHeader>
      <section>
        <article className="flex-row flex-wrap relative max-w-screen-xl mx-auto py-8 px-4">
          <div className="ag-theme-alpine ag-theme-bloom">
            <AgGridReact
              gridOptions={gridOptions}
              columnDefs={columnDefs}
              rowData={listingDtos}
              domLayout={"autoHeight"}
              headerHeight={83}
              rowHeight={58}
              suppressScrollOnNewData={true}
            ></AgGridReact>

            <div className="data-pager">
              <div className="data-pager__control-group">
                <span className="data-pager__control">
                  <span className="field-label" id="lbTotalPages">
                    {listingDtos?.length}
                  </span>
                  <span className="field-label">{t("listings.totalListings")}</span>
                </span>
              </div>
            </div>
          </div>
        </article>
      </section>
    </Layout>
  )
}
