import React from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import { AgGridReact } from "ag-grid-react"

import { useFlaggedApplicationsList } from "../../../lib/hooks"
import Layout from "../../../layouts/application"
import { t, ListingSecondaryNav } from "@bloom-housing/ui-components"
import { cols } from "../../../src/flags/cols"

const FlagsPage = () => {
  const router = useRouter()
  const listingId = router.query.listing as string

  const { data } = useFlaggedApplicationsList({
    listingId,
  })

  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitle")}</title>
      </Head>

      {/* TODO: replace with correct total FLAGGED items */}
      <ListingSecondaryNav
        title={t("nav.flags")}
        listingId={listingId}
        flagsQty={data?.meta?.totalItems}
      />

      <div className="applications-table mt-5">
        {data && (
          <div className="ag-theme-alpine ag-theme-bloom">
            <AgGridReact
              // onGridReady={onGridReady}
              // gridOptions={gridOptions}
              // defaultColDef={defaultColDef}
              columnDefs={cols}
              rowData={data?.items}
              domLayout="autoHeight"
              headerHeight={83}
              rowHeight={58}
              suppressScrollOnNewData={true}
              // suppressPaginationPanel={true}
              // paginationPageSize={8}
            ></AgGridReact>
          </div>
        )}
      </div>

      {console.log(data)}
    </Layout>
  )
}

export default FlagsPage
