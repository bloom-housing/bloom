import React from "react"
import Head from "next/head"
import { PageHeader, MetaTags, t } from "@bloom-housing/ui-components"
import { useListingsData } from "../lib/hooks"
import Layout from "../layouts/application"

import { AgGridReact } from "ag-grid-react"

export default function ListingsList() {
  const metaDescription = t("pageDescription.welcome", { regionName: t("region.name") })
  const metaImage = "" // TODO: replace with hero image

  const columnDefs = [
    {
      headerName: "Name",
      field: "name",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Status",
      field: "status",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Id",
      field: "id",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Created",
      field: "createdAt",
      sortable: true,
      filter: true,
    },
  ]

  const { listingDtos, listingsLoading, listingsError } = useListingsData()
  if (listingsError) return "An error has occurred."
  if (listingsLoading) return "Loading..."

  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitle")}</title>
      </Head>
      <MetaTags title={t("nav.siteTitle")} image={metaImage} description={metaDescription} />
      <PageHeader>All Listings</PageHeader>
      <section>
        <article className="flex-row flex-wrap relative max-w-screen-xl mx-auto py-8 px-4">
          <div className="ag-theme-alpine ag-theme-bloom">
            <AgGridReact
              columnDefs={columnDefs}
              rowData={listingDtos.listings}
              domLayout={"autoHeight"}
              headerHeight={83}
              rowHeight={58}
              suppressPaginationPanel={true}
              paginationPageSize={8}
              suppressScrollOnNewData={true}
            />
          </div>
        </article>
      </section>
    </Layout>
  )
}
