import React, { useMemo, useState } from "react"
import Head from "next/head"
import { PageHeader, MetaTags, t, lRoute } from "@bloom-housing/ui-components"
import { useListingsData } from "../lib/hooks"
import Layout from "../layouts/application"

import { AgGridReact } from "ag-grid-react"
import { GridOptions, GridApi } from "ag-grid-community"

export default function ListingsList() {
  // const router = useRouter()
  const [gridApi, setGridApi] = useState<GridApi>(null)

  console.log(gridApi)

  const onGridReady = (params) => {
    setGridApi(params.api)
  }
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

  const gridOptions: GridOptions = {
    components: {
      formatLinkCell: formatLinkCell,
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
        cellRenderer: "formatLinkCell",
      },
      {
        headerName: t("listings.applicationDeadline"),
        field: "applicationDueDate",
        sortable: false,
        filter: false,
        valueFormatter: ({ value }) => {
          console.log(value)

          return value
        },
      },
      {
        headerName: t("listings.applicationsSubmitted"),
        field: "isSubmitted",
        sortable: false,
        filter: false,
      },
      {
        headerName: t("listings.availableUnits"),
        field: "property.unitsAvailable",
        sortable: false,
        filter: false,
      },
      {
        headerName: t("listings.waitlist.open"),
        field: "waitlistCurrentSize",
        sortable: false,
        filter: false,
      },
      {
        headerName: t("listings.listingStatus"),
        field: "status",
        sortable: false,
        filter: false,
      },
    ],
    []
  )

  const { listingDtos, listingsLoading, listingsError } = useListingsData()
  if (listingsError) return "An error has occurred."
  if (listingsLoading) return "Loading..."

  return (
    <Layout>
      {console.log(listingDtos)}
      <Head>
        <title>{t("nav.siteTitle")}</title>
      </Head>
      <MetaTags title={t("nav.siteTitle")} image={metaImage} description={metaDescription} />
      <PageHeader>{t("nav.listings")}</PageHeader>
      <section>
        <article className="flex-row flex-wrap relative max-w-screen-xl mx-auto py-8 px-4">
          <div className="ag-theme-alpine ag-theme-bloom">
            <AgGridReact
              onGridReady={onGridReady}
              gridOptions={gridOptions}
              columnDefs={columnDefs}
              rowData={listingDtos}
              domLayout={"autoHeight"}
              headerHeight={83}
              rowHeight={58}
              suppressScrollOnNewData={true}
            ></AgGridReact>
          </div>
        </article>
      </section>
    </Layout>
  )
}
