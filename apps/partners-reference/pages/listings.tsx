import React, { useState } from "react"
import Head from "next/head"
import { PageHeader, MetaTags, t } from "@bloom-housing/ui-components"
import { useListingsData } from "../lib/hooks"
import Layout from "../layouts/application"
import { useRouter } from "next/router"

import { AgGridReact } from "ag-grid-react"
import { GridApi } from "ag-grid-community"

export default function ListingsList() {
  const router = useRouter()
  const [gridApi, setGridApi] = useState<GridApi>(null)

  const onGridReady = (params) => {
    setGridApi(params.api)
  }

  const onSelectionChanged = () => {
    const row = gridApi.getSelectedRows()
    const rowId = row[0].id

    void router.push(`/listings/${rowId}/applications`)
  }

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

  // DEMO custom pagination
  // const onGridReady = params => {
  //   this.gridApi = params.api;
  //   this.gridColumnApi = params.columnApi;
  // };

  // const onPaginationChanged = () => {
  //   console.log('onPaginationPageLoaded');
  //   if (this.gridApi) {
  //     setText('#lbLastPageFound', this.gridApi.paginationIsLastPageFound());
  //     setText('#lbPageSize', this.gridApi.paginationGetPageSize());
  //     setText('#lbCurrentPage', this.gridApi.paginationGetCurrentPage() + 1);
  //     setText('#lbTotalPages', this.gridApi.paginationGetTotalPages());
  //     setLastButtonDisabled(!this.gridApi.paginationIsLastPageFound());
  //   }
  // };

  // const onBtNext = () => {
  //   this.gridApi.paginationGoToNextPage()
  // }

  // const onBtPrevious = () => {
  //   this.gridApi.paginationGoToPreviousPage()
  // }

  // const onBtPageFive = () => {
  //   this.gridApi.paginationGoToPage(4);
  // };

  // const onBtPageFifty = () => {
  //   this.gridApi.paginationGoToPage(49);
  // };

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
              rowSelection={"single"}
              onGridReady={onGridReady}
              onSelectionChanged={onSelectionChanged}
            ></AgGridReact>
          </div>
        </article>
      </section>
    </Layout>
  )
}
