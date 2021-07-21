import React, { useState, useMemo, useEffect } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import { AgGridReact } from "ag-grid-react"

import { useFlaggedApplicationsList, useSingleListingData } from "../../../../lib/hooks"
import Layout from "../../../../layouts"
import { t, AgPagination, AG_PER_PAGE_OPTIONS } from "@bloom-housing/ui-components"
import { getFlagSetCols } from "../../../../src/flags/flagSetCols"
import { ApplicationSecondaryNav } from "../../../../src/applications/ApplicationSecondaryNav"

const FlagsPage = () => {
  const router = useRouter()
  const listingId = router.query.id as string

  /* Pagination */
  const [itemsPerPage, setItemsPerPage] = useState<number>(AG_PER_PAGE_OPTIONS[0])
  const [currentPage, setCurrentPage] = useState<number>(1)

  // reset page to 1 when user change limit
  useEffect(() => {
    setCurrentPage(1)
  }, [itemsPerPage])

  const { listingDto } = useSingleListingData(listingId)

  const { data } = useFlaggedApplicationsList({
    listingId,
    page: currentPage,
    limit: itemsPerPage,
  })

  const listingName = listingDto?.name

  const defaultColDef = {
    resizable: true,
    maxWidth: 300,
  }

  const columns = useMemo(() => getFlagSetCols(), [])

  if (!data) return null

  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitle")}</title>
      </Head>

      <ApplicationSecondaryNav
        title={listingName}
        listingId={listingId}
        flagsQty={data?.meta?.totalFlagged}
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
            ></AgGridReact>

            <AgPagination
              totalItems={data?.meta.totalItems}
              totalPages={data?.meta.totalPages}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              quantityLabel={t("applications.totalSets")}
              setCurrentPage={setCurrentPage}
              setItemsPerPage={setItemsPerPage}
            />
          </div>
        </div>
      </article>
    </Layout>
  )
}

export default FlagsPage
