import React, { useMemo } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import { AgGridReact } from "ag-grid-react"

import { useFlaggedApplicationsList } from "../../../lib/hooks"
import Layout from "../../../layouts/application"
import { t, ListingSecondaryNav, Tag } from "@bloom-housing/ui-components"
import { cols } from "../../../src/flags/cols"

const FlagsPage = () => {
  const router = useRouter()
  const listingId = router.query.listing as string

  const { data } = useFlaggedApplicationsList({
    listingId,
  })

  const agGridComponents = {
    tag: Tag,
  }

  const defaultColDef = {
    resizable: true,
    maxWidth: 300,
  }

  const columns = useMemo(() => [...cols], [])

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

      <article className="flex-row flex-wrap relative max-w-screen-xl mx-auto py-8 px-4 w-full">
        <div className="ag-theme-alpine ag-theme-bloom">
          <div className="applications-table mt-5">
            <AgGridReact
              columnDefs={columns}
              rowData={data?.items}
              domLayout="autoHeight"
              headerHeight={83}
              rowHeight={58}
              defaultColDef={defaultColDef}
              suppressScrollOnNewData={true}
              frameworkComponents={agGridComponents}
            ></AgGridReact>
          </div>
        </div>
      </article>

      {console.log(data)}
    </Layout>
  )
}

export default FlagsPage
